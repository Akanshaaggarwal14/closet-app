# Closet App — Local AI Import Service

A small FastAPI service that powers Smart Wardrobe Import. Runs entirely on
your own machine — no cloud calls, no API keys, no paid services. The
Next.js app talks to it over `localhost` only.

## Pipeline

1. **FastSAM** (`models/segmentation.py`) proposes distinct object regions
   in an uploaded photo (class-agnostic — it doesn't know what's clothing,
   just what's visually a separate "thing").
2. **CLIP** (`models/classification.py`) zero-shot classifies each region
   against the app's five clothing categories (Tops, Bottoms, Dresses,
   Shoes, Accessories) plus a few "not clothing" prompts, filtering out
   skin/hair/background and suggesting a category for what's left.
3. `pipeline.py` composites each surviving mask into a transparent PNG
   cutout and returns it, along with the suggested category and a
   confidence score, to the caller.

## Setup

Requires Python 3.10+.

```bash
cd ai-service
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

First run will download the FastSAM and CLIP model weights automatically
(needs internet once; fully offline after that — weights are cached in
your Python environment's cache directories).

## Running

```bash
uvicorn main:app --port 8008 --reload
```

Leave this running in its own terminal whenever you want to use Import
Wardrobe in the app. It's a separate process from `npm run dev`.

Check it's up: open `http://localhost:8008/health` — should return
`{"status": "ok"}`.

## Notes

- CPU-only by default. No GPU required, but a multi-item photo may take
  several seconds to process.
- `FastSAM-s.pt` and the CLIP weights are cached locally after first
  download — not committed to the repo (see root `.gitignore`).
