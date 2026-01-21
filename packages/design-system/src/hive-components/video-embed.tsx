import { cn } from '../cn';

export function VideoEmbed({
  className,
  src,
  title,
}: {
  className?: string;
  src: string;
  title: string;
}) {
  return (
    <video
      autoPlay
      className={cn('mx-auto mt-6', className)}
      controls
      loop
      muted
      playsInline
      title={title}
    >
      <source src={src} type={`video/${src.slice(src.lastIndexOf('.') + 1)}`} />
      Your browser does not support the video tag.
    </video>
  );
}
