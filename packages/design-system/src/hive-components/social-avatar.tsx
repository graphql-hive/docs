'use client';

import { ReactElement } from 'react';
import { Image } from '@unpic/react';

/**
 * TODO: We should drop this and use the avatars defined in authors/index.ts
 * for consistency with the team section on the landing page.
 */
export const SocialAvatar = ({
  author,
}: {
  author: { name: string; github?: string; twitter?: string };
}): ReactElement => {
  // Use GitHub avatar if available, otherwise Twitter
  const avatarUrl = author.github
    ? `https://github.com/${author.github}.png?size=80`
    : author.twitter
      ? `https://unavatar.io/twitter/${author.twitter}`
      : null;

  if (!avatarUrl) {
    // Fallback to initials
    const initials = author.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2);
    return (
      <div
        className="flex size-10 items-center justify-center rounded-full bg-blue-200 text-sm font-medium text-blue-800"
        title={author.name}
      >
        {initials}
      </div>
    );
  }

  return (
    <Image
      src={avatarUrl}
      alt={author.name}
      title={author.name}
      width={40}
      height={40}
      className="size-10 rounded-full"
    />
  );
};
