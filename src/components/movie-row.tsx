import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';
import type { Title } from '../types/title';
import { MovieCard } from './movie-card';

type MovieRowProps = {
  sectionTitle: string;
  titles: Title[];
};

export function MovieRow({ sectionTitle, titles }: MovieRowProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) {
      if (!titles) {
        setCanScrollLeft(false);
        setCanScrollRight(false);
      }
      return;
    }

    const update = () => {
      const sizeResults = 5;
      setCanScrollLeft(el.scrollLeft > sizeResults);
      setCanScrollRight(
        el.scrollLeft + el.clientWidth < el.scrollWidth - sizeResults
      );
    };

    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [titles]);

  function scrollCarousel(direction: 'left' | 'right') {
    const el = carouselRef.current;
    const scrolFactor = 0.6;

    if (!el) {
      return;
    }
    const distance = Math.round(el.clientWidth * scrolFactor);
    el.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  }

  return (
    <section className="mb-8">
      <h2 className="mb-4 font-bold text-3xl text-white">{sectionTitle}</h2>
      <div className="no-scrollbar relative flex cursor-pointer overflow-y-hidden overflow-x-scroll">
        {/* botão esquerdo */}
        <button
          aria-label="rolar para a esquerda"
          className={`-translate-y-1/2 absolute top-1/2 left-0 z-30 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition ${
            canScrollLeft
              ? 'bg-white/50 text-zinc-900 hover:bg-white/60'
              : 'pointer-events-none opacity-30'
          }`}
          disabled={!canScrollLeft}
          onClick={() => scrollCarousel('left')}
          type="button"
        >
          <CaretLeftIcon size={20} weight="bold" />
        </button>

        {/* track rolável */}
        <div
          className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2"
          ref={carouselRef}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {titles.map((title) => (
            <div className="w-48 flex-shrink-0" key={title.id}>
              <MovieCard title={title} />
            </div>
          ))}
        </div>

        {/* botão direito */}
        <button
          aria-label="rolar para a direita"
          className={`-translate-y-1/2 absolute top-1/2 right-0 z-30 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition ${
            canScrollRight
              ? 'bg-white/50 text-zinc-900 hover:bg-white/60'
              : 'pointer-events-none opacity-30'
          }`}
          onClick={() => scrollCarousel('right')}
          type="button"
        >
          <CaretRightIcon size={20} weight="bold" />
        </button>
      </div>
    </section>
  );
}
