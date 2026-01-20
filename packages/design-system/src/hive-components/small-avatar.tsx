import { Image } from '@unpic/react';
import { cn } from '../guild-components/cn';

export interface SmallAvatarProps {
  src: string;
  alt?: string;
  className?: string;
}

export function SmallAvatar({ className, alt, src }: SmallAvatarProps) {
  return (
    <Image
      src={src}
      width={24}
      height={24}
      className={cn('size-6 rounded-full object-cover', className)}
      alt={alt || ''}
    />
  );
}
