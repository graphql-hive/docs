'use client';

import clsx from 'clsx';
import { FC, useEffect, useState } from 'react';

import { IHeroVideoProps } from '../types/components';
import { Anchor } from './anchor';

// Simple hook to check if component is mounted (replaces nextra/hooks useMounted)
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

// Extract YouTube video ID from URL
function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  return match?.[1] ?? null;
}

export const HeroVideo: FC<IHeroVideoProps> = ({
  className,
  description,
  flipped,
  link,
  title,
  video,
}) => {
  const mounted = useMounted();
  const youtubeId = getYouTubeId(video.src);

  return (
    <section className={clsx('bg-gray-100 dark:bg-neutral-800', className)}>
      <div
        className={clsx(
          'container flex flex-wrap py-8 md:flex-nowrap md:items-center md:justify-center',
          flipped && 'md:flex-row-reverse',
        )}
      >
        <div className="mb-16 mt-8 md:my-0">
          <h2 className="m-0 max-w-sm text-2xl font-bold text-black md:text-3xl dark:text-gray-50">
            {title}
          </h2>
          <p className="mb-3 mt-1 max-w-md text-base text-gray-500 dark:text-gray-400">
            {description}
          </p>
          {link && (
            <Anchor
              {...link}
              className={clsx(
                'mt-auto w-max text-sm text-cyan-400 hover:text-cyan-300',
                link.className,
              )}
            />
          )}
        </div>
        <div
          className={clsx(
            'h-72 w-full overflow-hidden rounded-xl bg-white shadow-xl sm:h-96 md:h-72 md:w-3/5 lg:h-96',
            flipped ? 'md:mr-8' : 'md:ml-8',
          )}
        >
          {mounted && youtubeId && (
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="size-full border-0"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0`}
              title={typeof title === 'string' ? title : 'Video'}
            />
          )}
          {mounted && !youtubeId && (
            <video
              className="size-full object-cover"
              controls
              poster={video.placeholder}
              src={video.src}
            />
          )}
        </div>
      </div>
    </section>
  );
};
