"""
Orchestrates: image -> candidate masks -> classify + filter -> transparent
PNG cutouts. This is the only module main.py calls into — keeps the HTTP
layer separate from the actual image-processing logic.
"""

import base64
import io

import numpy as np
from PIL import Image

from models.classification import classify_crop
from models.segmentation import generate_masks

# Masks smaller than this are usually noise (buttons, jewelry specks
# mis-segmented on their own). Masks larger than this are usually the
# whole person/background rather than a single garment.
MIN_AREA_FRACTION = 0.02
MAX_AREA_FRACTION = 0.95
MIN_CUTOUT_SIZE_PX = 20


def _mask_to_cutout(image: Image.Image, mask: np.ndarray, bbox: list[float]) -> Image.Image:
    x1, y1, x2, y2 = [int(v) for v in bbox]
    rgba = image.convert("RGBA")
    arr = np.array(rgba)
    arr[:, :, 3] = (mask * 255).astype(np.uint8)
    return Image.fromarray(arr).crop((x1, y1, x2, y2))


def _image_to_data_url(image: Image.Image) -> str:
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{encoded}"


def process_image(image: Image.Image) -> list[dict]:
    width, height = image.size
    total_area = width * height

    detected_items: list[dict] = []

    for entry in generate_masks(image):
        mask = entry["mask"]
        bbox = entry["bbox"]

        area_fraction = mask.sum() / total_area
        if area_fraction < MIN_AREA_FRACTION or area_fraction > MAX_AREA_FRACTION:
            continue

        cutout = _mask_to_cutout(image, mask, bbox)
        if cutout.width < MIN_CUTOUT_SIZE_PX or cutout.height < MIN_CUTOUT_SIZE_PX:
            continue

        # CLIP wasn't trained on transparency, so classify a plain RGB
        # version of the same crop.
        classification = classify_crop(cutout.convert("RGB"))
        if classification is None:
            continue

        category, confidence = classification
        detected_items.append(
            {
                "imageDataUrl": _image_to_data_url(cutout),
                "category": category,
                "confidence": confidence,
                "boundingBox": {"x1": bbox[0], "y1": bbox[1], "x2": bbox[2], "y2": bbox[3]},
            }
        )

    return detected_items
