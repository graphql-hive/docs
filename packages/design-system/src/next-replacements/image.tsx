import { forwardRef, type ImgHTMLAttributes } from 'react';

export interface StaticImageData {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
}

export interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'ref' | 'loading'> {
  src: string | StaticImageData;
  alt: string;
  width?: number | `${number}`;
  height?: number | `${number}`;
  fill?: boolean;
  quality?: number | `${number}`;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  unoptimized?: boolean;
}

/**
 * Replacement for next/image - renders a standard img element
 * TODO: Add lazy loading, blur placeholder support if needed
 */
const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
  { src, alt, width, height, fill, priority, loading, placeholder, blurDataURL, quality, unoptimized, style, ...props },
  ref
) {
  const imgSrc = typeof src === 'string' ? src : src.src;
  const imgWidth = width ?? (typeof src !== 'string' ? src.width : undefined);
  const imgHeight = height ?? (typeof src !== 'string' ? src.height : undefined);

  const fillStyle = fill
    ? { position: 'absolute' as const, inset: 0, width: '100%', height: '100%', objectFit: 'cover' as const }
    : {};

  return (
    <img
      ref={ref}
      src={imgSrc}
      alt={alt}
      width={imgWidth}
      height={imgHeight}
      loading={priority ? 'eager' : loading ?? 'lazy'}
      decoding="async"
      style={{ ...fillStyle, ...style }}
      {...props}
    />
  );
});

export default Image;
export { Image };
