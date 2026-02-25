import { cn } from "../../cn";

export function MdxVideo({
  alt,
  className,
  src,
}: {
  alt: string;
  className?: string;
  src: string;
}) {
  return (
    <figure className={cn("my-4", className)}>
      <video autoPlay loop muted playsInline>
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <figcaption className="text-center text-sm italic">{alt}</figcaption>
    </figure>
  );
}
