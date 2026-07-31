"use client";

import { useRef, useState, type MouseEvent } from "react";
import { Button } from "@/components/ui/button";

interface ImageCropToolProps {
  imageSrc: string;
  onCropped: (dataUrl: string) => void;
  onCancel: () => void;
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Client-side Canvas cropping — works on any image source (a freshly
 * uploaded photo, or an already background-removed/rotated preview from
 * the review card). No AI, no server involved, always works.
 */
export function ImageCropTool({ imageSrc, onCropped, onCancel }: ImageCropToolProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);

  function getRelativePoint(event: MouseEvent) {
    const bounds = containerRef.current!.getBoundingClientRect();
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  }

  function handleMouseDown(event: MouseEvent) {
    const point = getRelativePoint(event);
    setStart(point);
    setRect({ x: point.x, y: point.y, width: 0, height: 0 });
  }

  function handleMouseMove(event: MouseEvent) {
    if (!start) return;
    const point = getRelativePoint(event);
    setRect({
      x: Math.min(start.x, point.x),
      y: Math.min(start.y, point.y),
      width: Math.abs(point.x - start.x),
      height: Math.abs(point.y - start.y),
    });
  }

  function handleMouseUp() {
    setStart(null);
  }

  function handleConfirm() {
    if (!rect || !imgRef.current || rect.width < 5 || rect.height < 5) return;

    const img = imgRef.current;
    const scaleX = img.naturalWidth / img.clientWidth;
    const scaleY = img.naturalHeight / img.clientHeight;

    const canvas = document.createElement("canvas");
    canvas.width = rect.width * scaleX;
    canvas.height = rect.height * scaleY;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(
      img,
      rect.x * scaleX,
      rect.y * scaleY,
      rect.width * scaleX,
      rect.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    onCropped(canvas.toDataURL("image/png"));
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-muted-foreground">Drag to draw a box, then confirm.</p>
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="relative w-full cursor-crosshair select-none overflow-hidden rounded-lg border border-border bg-[repeating-conic-gradient(#e5e5e5_0%_25%,transparent_0%_50%)] bg-[length:16px_16px]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- direct DOM ref needed for canvas-crop math; source may be a data: URL */}
        <img
          ref={imgRef}
          src={imageSrc}
          alt="To crop"
          className="w-full select-none"
          draggable={false}
        />
        {rect && (
          <div
            className="absolute border-2 border-primary bg-primary/10"
            style={{ left: rect.x, top: rect.y, width: rect.width, height: rect.height }}
          />
        )}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" className="flex-1" onClick={handleConfirm} disabled={!rect || rect.width < 5}>
          Use this crop
        </Button>
      </div>
    </div>
  );
}
