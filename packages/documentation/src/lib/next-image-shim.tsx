/**
 * Shim for `next/image` imports in old docs content.
 */
export default function Image(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} loading="lazy" />;
}
