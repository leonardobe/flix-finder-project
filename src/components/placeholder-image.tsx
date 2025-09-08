import { ImageBrokenIcon } from '@phosphor-icons/react';

type PosterProps = {
  src: string | null;
  alt: string;
  className?: string;
};

export function Poster({ src, alt, className }: PosterProps) {
  if (src == null) {
    return (
      <div
        className={`flex aspect-[2/3] w-full items-center justify-center rounded-md bg-gray-700 text-gray-400 ${className}`}
      >
        <ImageBrokenIcon size={48} weight="light" />
      </div>
    );
  }

  return (
    <img
      alt={alt}
      className={`h-auto w-full rounded-md object-cover ${className}`}
      height={300}
      src={src}
      width={300}
    />
  );
}
