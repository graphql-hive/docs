import { cn } from "@hive/design-system/cn";

export function BlogPostPicture({
  className,
  image,
  mobileImage,
}: {
  className?: string;
  image: string;
  mobileImage?: string;
}) {
  className = cn(
    "h-[324px] overflow-hidden object-cover sm:rounded-2xl",
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

  if (mobileImage) {
    return (
      <picture className={className}>
        <source media="(max-width: 640px)" srcSet={mobileImage} />
        <img
          alt=""
          className={className}
          height={324}
          loading="eager"
          src={image}
          width={1392}
        />
      </picture>
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
