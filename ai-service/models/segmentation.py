"""
Class-agnostic instance segmentation via FastSAM.

FastSAM proposes distinct object regions in a photo without needing a
detector or clothing-specific training — a shirt-shaped blob, a
jeans-shaped blob, and a shoes-shaped blob on a mirror selfie come out as
separate masks because they're visually distinct regions, not because the
model was taught what a "shirt" is. Classification of what each region
actually is happens separately in classification.py.
"""

from typing import TypedDict

import numpy as np
from PIL import Image
from ultralytics import FastSAM

_model: FastSAM | None = None


class MaskResult(TypedDict):
    mask: np.ndarray  # (H, W) bool
    bbox: list[float]  # [x1, y1, x2, y2]
    score: float


def get_model() -> FastSAM:
    global _model
    if _model is None:
        # Small/fast variant — auto-downloads on first use, cached locally
        # after that. No network calls once cached.
        _model = FastSAM("FastSAM-s.pt")
    return _model


def generate_masks(image: Image.Image, conf: float = 0.4, iou: float = 0.9) -> list[MaskResult]:
    """Runs FastSAM's automatic mask generation over the whole image."""
    model = get_model()
    results = model(image, device="cpu", retina_masks=True, conf=conf, iou=iou, verbose=False)

    masks: list[MaskResult] = []
    for result in results:
        if result.masks is None or result.boxes is None:
            continue
        for i, mask_tensor in enumerate(result.masks.data):
            mask = mask_tensor.cpu().numpy().astype(bool)
            box = result.boxes.xyxy[i].cpu().numpy().tolist()
            score = float(result.boxes.conf[i]) if result.boxes.conf is not None else 0.0
            masks.append({"mask": mask, "bbox": box, "score": score})
    return masks
