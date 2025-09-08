import {
  DotOutlineIcon,
  PlayCircleIcon,
  PlusIcon,
  StarIcon,
  XIcon,
} from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loading } from '../components/loading';
import { MovieRow } from '../components/movie-row';
import { useFavorites } from '../hooks/use-favorites';
import {
  getImageUrl,
  getPopularMovies,
  getPopularTvShows,
  getTitleDetails,
  getTopRatedMovies,
  getTopRatedTvShows,
  getTrailerKey,
  getTrendingTitles,
} from '../services/movie-api';
import type { Title } from '../types/title';
import { getYearFromTitle } from '../utils/formatters';

export function HomePage() {
  const [featuredTitle, setFeaturedTitle] = useState<Title | null>(null);
  const { addFavorite, isFavorite, removeFavorite } = useFavorites();

  const { data: trendingTitles, isLoading: isTrendingLoading } = useQuery({
    queryKey: ['trendingMovies'],
    queryFn: getTrendingTitles,
  });

  const { data: popularMovies } = useQuery({
    queryKey: ['popularMovies'],
    queryFn: getPopularMovies,
  });

  const { data: popularTvShows } = useQuery({
    queryKey: ['popularTvShows'],
    queryFn: getPopularTvShows,
  });

  const { data: topRatedMovies } = useQuery({
    queryKey: ['topRatedMovies'],
    queryFn: getTopRatedMovies,
  });

  const { data: topRatedTvShows } = useQuery({
    queryKey: ['topRatedTvShows'],
    queryFn: getTopRatedTvShows,
  });

  useEffect(() => {
    async function fetchFeatured() {
      if (trendingTitles && trendingTitles.length > 0) {
        const firstTitle = trendingTitles[0];
        const type = firstTitle.media_type || 'movie';
        const details = await getTitleDetails(firstTitle.id, type);
        setFeaturedTitle(details);
      }
    }

    fetchFeatured();
  }, [trendingTitles]);

  if (isTrendingLoading || !featuredTitle) {
    return <Loading />;
  }

  const titleText = featuredTitle.title || featuredTitle.name;
  const isFeaturedFavorite = isFavorite(featuredTitle.id);
  const backdropUrl = getImageUrl(featuredTitle.backdrop_path, 'original');

  function handleFavoriteClick(e: React.MouseEvent) {
    e.preventDefault();
    if (featuredTitle) {
      isFeaturedFavorite
        ? removeFavorite(featuredTitle.id)
        : addFavorite(featuredTitle);
    }
  }

  async function handleTrailerClick(e: React.MouseEvent) {
    e.preventDefault();
    if (featuredTitle) {
      const type = featuredTitle.media_type || 'movie';
      const trailerKey = await getTrailerKey(featuredTitle.id, type);
      if (trailerKey) {
        window.open(`https://www.youtube.com/watch?v=${trailerKey}`, '_blank');
      }
    }
  }

  return (
    <div className="w-full overflow-x-hidden pt-13">
      {/* Seção de Destaque */}
      <section>
        <Link
          className="block"
          onClick={(e) => e.stopPropagation()}
          to={`/${featuredTitle.media_type || 'movie'}/${featuredTitle.id}`}
        >
          <div
            className="relative h-[600px] w-full overflow-hidden bg-center bg-cover"
            style={{
              backgroundImage: `url(${backdropUrl})`,
            }}
          >
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-gray-900/95 via-gray-900/60 to-transparent px-6 pb-12 md:px-12">
              <div className="mb-3 flex flex-wrap items-center space-x-2">
                {featuredTitle.genres.map((genre) => (
                  <span
                    className="rounded-lg border border-gray-700 bg-gray-800/70 px-3 py-1 text-gray-300 text-xs"
                    key={genre.id}
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              {/*Título*/}
              <h1 className="mb-2 max-w-3xl font-extrabold text-4xl text-white drop-shadow-md md:text-6xl">
                {titleText}
              </h1>
              {/*Infos*/}
              <div className="mb-4 flex flex-wrap items-center space-x-2 text-gray-300 text-lg">
                <span>
                  {featuredTitle.media_type === 'movie' ? 'Filme' : 'Série'}
                </span>
                <DotOutlineIcon weight="fill" />
                <span>{getYearFromTitle(featuredTitle)}</span>
                <DotOutlineIcon weight="fill" />
                <span className="flex items-center">
                  <StarIcon
                    className="mr-1 h-4 w-4 text-amber-400"
                    weight="fill"
                  />
                  {featuredTitle.vote_average.toFixed(1)}
                </span>
              </div>
              {/* Descrição */}
              <p className="line-clamp-3 max-w-2xl text-base text-gray-200">
                {featuredTitle.overview}
              </p>
              {/* Botões */}
              <div className="mt-6 flex space-x-4">
                <button
                  className="flex items-center space-x-2 rounded-full bg-blue-600 px-6 py-3 font-bold text-white transition-colors duration-200 hover:bg-blue-700"
                  onClick={handleTrailerClick}
                  type="button"
                >
                  <PlayCircleIcon className="h-8 w-8" weight="fill" />
                  <span>Assistir Trailer</span>
                </button>
                <button
                  className="flex items-center space-x-2 rounded-full border px-6 py-3 font-bold text-white transition-colors duration-200 hover:bg-gray-600"
                  onClick={handleFavoriteClick}
                  type="button"
                >
                  {isFeaturedFavorite ? (
                    <XIcon className="h-6 w-6" />
                  ) : (
                    <PlusIcon className="h-6 w-6" />
                  )}
                  <span>{isFeaturedFavorite ? 'Remover' : 'Favoritar'}</span>
                </button>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Seções de Agrupamento */}
      <div className="mt-12 max-w-full px-12">
        {popularMovies && (
          <MovieRow sectionTitle="Filmes Populares" titles={popularMovies} />
        )}
        {popularTvShows && (
          <MovieRow sectionTitle="Séries Populares" titles={popularTvShows} />
        )}
        {topRatedMovies && (
          <MovieRow
            sectionTitle="Top 10 Filmes Avaliados"
            titles={topRatedMovies}
          />
        )}
        {topRatedTvShows && (
          <MovieRow
            sectionTitle="Top 10 Séries Avaliadas"
            titles={topRatedTvShows}
          />
        )}
      </div>
    </div>
  );
}
