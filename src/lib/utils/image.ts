/** Client-side (browser) image helpers used by the wardrobe import flow. */

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("Couldn't read file"));
    reader.readAsDataURL(blob);
  });
}

/** Rotates a data URL image by 90/180/270 degrees, returning a new PNG data URL. */
export function rotateImageDataUrl(dataUrl: string, degrees: 90 | 180 | 270): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const swapDimensions = degrees === 90 || degrees === 270;
      const canvas = document.createElement("canvas");
      canvas.width = swapDimensions ? img.naturalHeight : img.naturalWidth;
      canvas.height = swapDimensions ? img.naturalWidth : img.naturalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((degrees * Math.PI) / 180);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("Couldn't load image for rotation"));
    img.src = dataUrl;
  });
}
