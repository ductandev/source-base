import React, { useState } from "react";
import type { StaticImageData } from "next/image";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

interface ImageWithFallbackProps extends Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src"
> {
  src: string | StaticImageData;
  fill?: boolean;
  priority?: boolean;
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  const { src, alt, style, className, fill, priority, ...rest } = props;

  // Convert StaticImageData to string
  const srcString = typeof src === "string" ? src : src.src;

  // Handle fill prop - convert to CSS
  const fillStyle = fill
    ? {
        position: "absolute" as const,
        height: "100%",
        width: "100%",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        objectFit: style?.objectFit || "cover",
        ...style,
      }
    : style;

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ""}`}
      style={fillStyle}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img
          src={ERROR_IMG_SRC}
          alt="Error loading image"
          {...rest}
          data-original-url={srcString}
        />
      </div>
    </div>
  ) : (
    <img
      src={srcString}
      alt={alt}
      className={className}
      style={fillStyle}
      {...rest}
      onError={handleError}
    />
  );
}
