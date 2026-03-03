import { cn } from "@hive/design-system/cn";

export function BlogPostPicture({
  className,
  image,
}: {
  className?: string;
  image: string;
}) {
  className = cn(
    "h-[324px] rounded-3xl overflow-hidden object-cover sm:rounded-2xl sm:mx-6",
    className,
  );

  if (image.endsWith(".webm") || image.endsWith(".mp4")) {
    return (
      <video
        autoPlay
        className={className}
        loop
        muted
        playsInline
        src={image}
      />
    );
  }

  return (
    <img
      alt=""
      className={className}
      height={324}
      loading="eager"
      src={image}
      width={1392}
    />
  );
}
