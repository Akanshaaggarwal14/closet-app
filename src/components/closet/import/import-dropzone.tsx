"use client";

import { useCallback, useState, type DragEvent } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImportDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
}

export function ImportDropzone({ onFilesSelected, multiple = true }: ImportDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const files = Array.from(event.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/"),
      );
      if (files.length > 0) onFilesSelected(multiple ? files : [files[0]]);
    },
    [onFilesSelected, multiple],
  );

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-12 text-center transition-colors",
        isDragging ? "border-primary bg-accent" : "border-border",
      )}
    >
      <UploadCloud className="h-8 w-8 text-muted-foreground" />
      <div>
        <p className="font-medium">Drag &amp; drop {multiple ? "photos" : "a photo"} here</p>
        <p className="text-sm text-muted-foreground">
          Mirror selfies, outfit photos, clothes laid out
          {multiple ? " — one or more at once" : ""}
        </p>
      </div>
      <label className="cursor-pointer rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        Choose {multiple ? "photos" : "a photo"}
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            if (files.length > 0) onFilesSelected(multiple ? files : [files[0]]);
            event.target.value = "";
          }}
        />
      </label>
    </div>
  );
}
