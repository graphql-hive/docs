import { ReactElement } from 'react';

// Type for static image imports (bundler)
export type StaticImageData = { src: string; width: number; height: number; blurDataURL?: string };

export interface ImageProps {
  src: string | StaticImageData;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Image component that handles static imports and remote URLs.
 * Uses native img with optional blur placeholder background.
 */
export function Image({ src, alt, className, width, height }: ImageProps): ReactElement {
  const imgSrc = typeof src === 'string' ? src : src.src;
  const blurDataURL = typeof src === 'object' ? src.blurDataURL : undefined;
  const imgWidth = width ?? (typeof src === 'object' ? src.width : undefined);
  const imgHeight = height ?? (typeof src === 'object' ? src.height : undefined);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      width={imgWidth}
      height={imgHeight}
      loading="lazy"
      decoding="async"
      style={blurDataURL ? { backgroundImage: `url(${blurDataURL})`, backgroundSize: 'cover' } : undefined}
    />
  );
}
