import {
  CaretLeftIcon,
  CaretRightIcon,
  DotOutlineIcon,
  LineVerticalIcon,
  PlayCircleIcon,
  PlusIcon,
  StarIcon,
} from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loading } from '../components/loading';
import { useFavorites } from '../hooks/use-favorites';
import {
  getTitleCredits,
  getTitleDetails,
  getTitleRecommendations,
  getTrailerKey,
} from '../services/movie-api';
import type { Cast, Crew } from '../types/credits';
import { formatDuration, getYearFromTitle } from '../utils/formatters';

export function TitleDetailsPage() {
  const { type, id } = useParams<{ type?: string; id?: string }>();
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [isTitleFavorite, setIsTitleFavorite] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const titleType = type as 'movie' | 'tv';
  const titleId = Number.parseInt(id as string, 10);

  const {
    data: title,
    isLoading: isTitleLoading,
    isError: isTitleError,
  } = useQuery({
    queryKey: ['titleDetails', titleId, titleType],
    queryFn: () => getTitleDetails(titleId, titleType),
  });

  const { data: credits } = useQuery({
    queryKey: ['titleCredits', titleId, titleType],
    queryFn: () => getTitleCredits(titleId, titleType),
    enabled: !!title,
  });

  const { data: recommendations } = useQuery({
    queryKey: ['titleRecommendations', titleId, titleType],
    queryFn: () => getTitleRecommendations(titleId, titleType),
    enabled: !!title,
  });

  useEffect(() => {
    if (title) {
      setIsTitleFavorite(isFavorite(title.id));
    }
  }, [title, isFavorite]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) {
      if (!recommendations) {
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
  }, [recommendations]);

  if (isTitleLoading) {
    return <Loading />;
  }
  if (isTitleError || !title) {
    return (
      <div className="mt-8 text-center text-lg text-red-500">
        Erro ao carregar os detalhes.
      </div>
    );
  }

  const getDirector = () => {
    if (!credits) {
      return 'N/A';
    }

    if (title.media_type === 'movie') {
      const director = credits.crew?.find(
        (member: Crew) => member.job === 'Director'
      );
      return director ? director.name : 'N/A';
    }

    if (title.media_type === 'tv') {
      if (title.created_by && title.created_by.length > 0) {
        return title.created_by.map((creator) => creator.name).join(', ');
      }
      return 'N/A';
    }

    return 'N/A';
  };

  const getPrincipalCast = () => {
    const actorSize = 5;
    if (credits?.cast) {
      return credits.cast
        .filter((actor) => actor.order < actorSize)
        .map((actor: Cast) => actor.name)
        .join(', ');
    }
    return 'N/A';
  };

  const handleFavoriteClick = () => {
    if (title) {
      if (isTitleFavorite) {
        removeFavorite(title.id);
      } else {
        addFavorite(title);
      }
      setIsTitleFavorite(!isTitleFavorite);
    }
  };

  async function handleTrailerClick() {
    if (title) {
      const trailerKey = await getTrailerKey(title.id, titleType);
      if (trailerKey) {
        window.open(`https://www.youtube.com/watch?v=${trailerKey}`, '_blank');
      } else {
        alert('Trailer não encontrado!');
      }
    }
  }

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

  const backdropUrl = `https://image.tmdb.org/t/p/original${title.backdrop_path}`;

  return (
    <section>
      {/* Fundo Fixo da Página */}
      <div
        className="fixed inset-0 z-0 bg-center bg-cover"
        style={{
          backgroundImage: `url(${backdropUrl})`,
        }}
      >
        {/* Escurece o fundo */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      {/* Conteúdo Principal da Página (não-rolável) */}
      <div className="relative z-30 flex h-dvh items-center overflow-hidden px-12 pt-20">
        <div className="max-w-2xl text-white">
          <div className="mb-4 flex items-center space-x-4 text-lg">
            <span className="flex items-center space-x-1 text-yellow-400">
              <StarIcon className="h-5 w-5" weight="fill" />
              <span className="text-2xl">{title.vote_average.toFixed(1)}</span>
              <span className="text-gray-300 text-sm">/10</span>
            </span>
            <DotOutlineIcon className="h-6 w-6 text-white" weight="fill" />
            <span className="text-gray-300">{getYearFromTitle(title)}</span>
            {title.media_type === 'movie' && title.runtime != null ? (
              <>
                <DotOutlineIcon className="h-6 w-6 text-white" weight="fill" />
                <span className="text-gray-300">
                  {formatDuration(title.runtime)}
                </span>
              </>
            ) : null}
          </div>

          <h1 className="mb-4 font-extrabold text-6xl drop-shadow-lg">
            {title.title || title.name}
          </h1>

          <div className="flex flex-wrap">
            {title.genres.map((genre, index) => (
              <div className="flex items-center" key={genre.id}>
                <p className="font-bold text-gray-300 text-sm uppercase">
                  {genre.name}
                </p>
                {index < title.genres.length - 1 && (
                  <LineVerticalIcon className="mx-2 h-4 w-4 text-gray-500" />
                )}
              </div>
            ))}
          </div>

          <p className="mt-4 mb-6 overflow-y-hidden text-base text-gray-200">
            {title.overview}
          </p>

          <div className="mb-8 flex gap-4">
            <button
              className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-bold hover:bg-blue-700"
              onClick={handleTrailerClick}
              type="button"
            >
              <PlayCircleIcon className="h-7 w-7" weight="fill" />
              <span>Assistir Trailer</span>
            </button>

            <button
              className={`flex items-center gap-2 rounded-full border px-6 py-3 font-bold transition ${
                isTitleFavorite
                  ? 'border-red-600 bg-red-600 text-white hover:bg-red-700'
                  : 'border-white hover:bg-gray-700'
              }`}
              onClick={handleFavoriteClick}
              type="button"
            >
              <PlusIcon className="h-6 w-6" />
              <span>{isTitleFavorite ? 'Remover' : 'Favoritar'}</span>
            </button>
          </div>

          <div className="text-gray-300 text-sm">
            <p>
              <span className="mr-1 font-bold uppercase">
                {title.media_type === 'movie' ? 'Diretor:' : 'Criação:'}
              </span>
              {getDirector()}
            </p>
            <p>
              <span className="mr-1 font-bold uppercase">
                Elenco:
              </span>
              {getPrincipalCast()}
            </p>
          </div>
        </div>
      </div>

      {recommendations && recommendations.results.length > 0 && (
        <div className="absolute right-12 bottom-6 left-1/2 z-30 px-8">
          <h2 className="mb-4 font-semibold text-lg text-white">
            Pessoas também curtiram
          </h2>

          <div className="relative">
            {/* botão esquerdo */}
            <button
              aria-label="rolar para a esquerda"
              className={`-translate-y-1/2 absolute top-1/2 left-0 z-30 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition ${
                canScrollLeft
                  ? 'bg-black/50 text-white hover:bg-black/60'
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
              className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
              ref={carouselRef}
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {recommendations.results.map((movie) => (
                // cada item "snap-start" para alinhamento quando rolar
                <Link
                  className="inline-block flex-shrink-0 snap-start"
                  key={movie.id}
                  to={`/${movie.media_type}/${movie.id}`}
                >
                  <img
                    alt={movie.title || movie.name}
                    className="h-48 w-32 rounded-lg object-cover shadow-lg transition-transform hover:scale-105"
                    height={300}
                    loading="lazy"
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    width={300}
                  />
                </Link>
              ))}
            </div>

            {/* botão direito */}
            <button
              aria-label="rolar para a direita"
              className={`-translate-y-1/2 absolute top-1/2 right-0 z-30 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition ${
                canScrollRight
                  ? 'bg-black/50 text-white hover:bg-black/60'
                  : 'pointer-events-none opacity-30'
              }`}
              onClick={() => scrollCarousel('right')}
              type="button"
            >
              <CaretRightIcon size={20} weight="bold" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
