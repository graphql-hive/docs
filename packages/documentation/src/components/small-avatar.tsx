import { cn } from "@hive/design-system/cn";

export interface SmallAvatarProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {}

export function SmallAvatar({ className, ...rest }: SmallAvatarProps) {
  return (
    <img
      className={cn("size-6 rounded-full object-cover", className)}
      height={24}
      width={24}
      {...rest}
      alt={rest.alt || ""}
    />
  );
}
