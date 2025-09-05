import {
  DotOutlineIcon,
  LineVerticalIcon,
  PlayCircleIcon,
  PlusIcon,
  StarIcon,
} from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loading } from '../components/loading';
import { useFavorites } from '../hooks/use-favorites';
import {
  getTitleCredits,
  getTitleDetails,
  getTitleRecommendations,
  getTrailerKey,
} from '../services/movie-api';
import { formatDuration, getYearFromTitle } from '../utils/formatters';

export function TitleDetailsPage() {
  const { type, id } = useParams<{ type?: string; id?: string }>();
  const [isTitleFavorite, setIsTitleFavorite] = useState(false);
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
    if (credits?.crew) {
      const director = credits.crew.find(
        (member: any) => member.job === 'Director'
      );
      return director ? director.name : 'N/A';
    }
    return 'N/A';
  };

  const getPrincipalCast = () => {
    if (credits?.cast) {
      return credits.cast
        .map((actor: any) => actor.name)
        .join(', ');
    }
    return 'N/A';
  };

  function handleFavoriteClick() {
    if (title) {
      if (isTitleFavorite) {
        removeFavorite(title.id);
      } else {
        addFavorite(title);
      }
      setIsTitleFavorite(!isTitleFavorite);
    }
  }

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

          <p className="mt-4 mb-6 max-h-32 overflow-y-hidden text-base text-gray-200">
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
              <span className="mr-1 font-bold uppercase">Diretor:</span>
              {getDirector()}
            </p>
            <p>
              <span className="mr-1 font-bold uppercase">Elenco:</span>
              {getPrincipalCast()}
            </p>
          </div>
        </div>
      </div>

      {recommendations && recommendations.results.length > 0 && (
        <div className="absolute right-0 bottom-6 left-1/2 px-12">
          <h2 className="mb-4 font-semibold text-lg">
            Pessoas também curtiram
          </h2>
          <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
            {recommendations.results.map((movie) => (
              // biome-ignore lint/performance/noImgElement: <>
              <img
                alt={movie.title || movie.name}
                className="h-48 w-32 flex-shrink-0 rounded-lg object-cover shadow-lg"
                height={300}
                key={movie.id}
                loading="lazy"
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                width={300}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
