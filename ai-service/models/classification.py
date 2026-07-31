"""
Zero-shot filtering + labeling via CLIP.

FastSAM's masks aren't clothing-aware — it'll happily propose a mask for
skin, hair, or the wall behind someone. CLIP closes that gap: each
candidate mask is scored against the app's exact five clothing categories
plus a handful of "not clothing" prompts. Anything that doesn't clearly
match a clothing category is dropped; whichever category wins becomes the
suggested label (still user-editable in the review screen).
"""

from typing import Optional

import open_clip
import torch
from PIL import Image

CLOTHING_CATEGORIES = ["Tops", "Bottoms", "Dresses", "Shoes", "Accessories"]
NON_CLOTHING_LABELS = [
    "a person's bare skin",
    "a person's face",
    "hair",
    "a background wall or floor",
    "furniture",
]
_ALL_LABELS = CLOTHING_CATEGORIES + NON_CLOTHING_LABELS

_model = None
_preprocess = None
_tokenizer = None
_text_features = None


def _load() -> None:
    global _model, _preprocess, _tokenizer, _text_features
    if _model is not None:
        return

    _model, _, _preprocess = open_clip.create_model_and_transforms("ViT-B-32", pretrained="openai")
    _tokenizer = open_clip.get_tokenizer("ViT-B-32")
    _model.eval()

    prompts = [
        f"a photo of {label.lower()}" if label in CLOTHING_CATEGORIES else f"a photo of {label}"
        for label in _ALL_LABELS
    ]
    tokens = _tokenizer(prompts)
    with torch.no_grad():
        features = _model.encode_text(tokens)
        features /= features.norm(dim=-1, keepdim=True)
    _text_features = features


def classify_crop(crop: Image.Image, min_confidence: float = 0.35) -> Optional[tuple[str, float]]:
    """
    Returns (category, confidence) if the crop confidently matches one of
    the clothing categories, otherwise None (filtered out).
    """
    _load()
    image_input = _preprocess(crop).unsqueeze(0)

    with torch.no_grad():
        image_features = _model.encode_image(image_input)
        image_features /= image_features.norm(dim=-1, keepdim=True)
        similarity = (100.0 * image_features @ _text_features.T).softmax(dim=-1)

    probs = similarity[0].tolist()
    best_idx = max(range(len(probs)), key=lambda i: probs[i])
    best_label = _ALL_LABELS[best_idx]
    best_prob = probs[best_idx]

    if best_label not in CLOTHING_CATEGORIES or best_prob < min_confidence:
        return None
    return best_label, best_prob
