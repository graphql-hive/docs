import { ReactElement } from 'react';

// Type for static image imports (bundler)
export type StaticImageData = { blurDataURL?: string; height: number; src: string; width: number; };

export interface ImageProps {
  alt: string;
  className?: string;
  height?: number;
  src: StaticImageData | string;
  width?: number;
}

/**
 * Image component that handles static imports and remote URLs.
 * Uses native img with optional blur placeholder background.
 */
export function Image({ alt, className, height, src, width }: ImageProps): ReactElement {
  const imgSrc = typeof src === 'string' ? src : src.src;
  const blurDataURL = typeof src === 'object' ? src.blurDataURL : undefined;
  const imgWidth = width ?? (typeof src === 'object' ? src.width : undefined);
  const imgHeight = height ?? (typeof src === 'object' ? src.height : undefined);

  return (
    <img
      alt={alt}
      className={className}
      decoding="async"
      height={imgHeight}
      loading="lazy"
      src={imgSrc}
      style={blurDataURL ? { backgroundImage: `url(${blurDataURL})`, backgroundSize: 'cover' } : undefined}
      width={imgWidth}
    />
  );
}
