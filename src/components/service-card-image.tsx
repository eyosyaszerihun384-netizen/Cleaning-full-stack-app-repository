"use client";

import Image from "next/image";
import { useState } from "react";

export default function ServiceCardImage({
  imageUrl,
  stockImageUrl,
  title,
  alt,
  className = "service-photo crown-service-image",
}: {
  imageUrl: string | null;
  stockImageUrl: string;
  title: string;
  alt: string | null;
  className?: string;
}) {
  const [showStockImage, setShowStockImage] = useState(!imageUrl);
  const [hasImageError, setHasImageError] = useState(false);

  if (hasImageError) {
    return (
      <div className={`${className} crown-image-unavailable`}>
        <span>{title}</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <Image
        src={showStockImage ? stockImageUrl : imageUrl ?? stockImageUrl}
        alt={
          showStockImage
            ? `Illustrative stock image for ${title}; not a Crown project`
            : alt ?? title
        }
        fill
        sizes="(max-width: 700px) 100vw, 33vw"
        onError={() => {
          if (showStockImage) {
            setHasImageError(true);
          } else {
            setShowStockImage(true);
          }
        }}
      />
      {showStockImage && (
        <span className="crown-image-label">Illustrative stock image</span>
      )}
    </div>
  );
}
