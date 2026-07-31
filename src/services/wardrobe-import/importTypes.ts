import type { ClothingCategory } from "@/types";

export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface DetectedClothingItem {
  id: string; // client-generated, for React keys + selection tracking
  imageDataUrl: string; // transparent PNG cutout, as a data URL
  category: ClothingCategory;
  confidence: number;
  boundingBox: BoundingBox;
}
