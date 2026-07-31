"""
Local-only AI service for Smart Wardrobe Import. Runs on the user's own
machine and is only ever called by the Next.js server (never directly by
the browser, never over the internet). No cloud inference, no API keys.

Run with: uvicorn main:app --port 8008 --reload
"""

import io

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

from pipeline import process_image

app = FastAPI(title="Closet App - Local AI Import Service")

# Defensive only — in normal operation the Next.js server calls this
# service directly (server-to-server), not the browser, so CORS doesn't
# usually come into play. Enabled in case of local direct testing.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/detect")
async def detect(file: UploadFile = File(...)) -> dict:
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    contents = await file.read()
    try:
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception as exc:  # noqa: BLE001 - want to surface any decode failure as a 400
        raise HTTPException(status_code=400, detail="Couldn't read image") from exc

    items = process_image(image)
    return {"items": items}
