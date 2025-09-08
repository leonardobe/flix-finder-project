import axios from 'axios';
import { env } from '../env';
import type { TitleCreditsResponse } from '../types/credits';
import type { TitleRecommendationsResponse } from '../types/recommendations';
import type { ApiResponse, Title } from '../types/title';
import type { Video } from '../types/video';

const tmdbApi = axios.create({
  baseURL: env.VITE_TMDB_BASE_URL,
  params: {
    api_key: env.VITE_TMDB_API_KEY,
  },
});

export function getImageUrl(path: string | null, size: string): string | null {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}

export async function getPopularMovies(): Promise<Title[]> {
  const response = await tmdbApi.get<{ results: Omit<Title, 'media_type'>[] }>(
    '/movie/popular',
    {
      params: { api_key: env.VITE_TMDB_API_KEY, language: 'pt-BR' },
    }
  );
  return response.data.results.map((movie) => ({
    ...movie,
    media_type: 'movie' as const,
  }));
}

export async function getPopularTvShows(): Promise<Title[]> {
  const response = await tmdbApi.get<{ results: Omit<Title, 'media_type'>[] }>(
    '/tv/popular',
    {
      params: { api_key: env.VITE_TMDB_API_KEY, language: 'pt-BR' },
    }
  );
  return response.data.results.map((show) => ({
    ...show,
    media_type: 'tv' as const,
  }));
}

export async function getTopRatedMovies(): Promise<Title[]> {
  const response = await tmdbApi.get<{ results: Omit<Title, 'media_type'>[] }>(
    '/movie/top_rated',
    {
      params: { api_key: env.VITE_TMDB_API_KEY, language: 'pt-BR' },
    }
  );
  return response.data.results.map((movie) => ({
    ...movie,
    media_type: 'movie' as const,
  }));
}

export async function getTopRatedTvShows(): Promise<Title[]> {
  const response = await tmdbApi.get<{ results: Omit<Title, 'media_type'>[] }>(
    '/tv/top_rated',
    {
      params: { api_key: env.VITE_TMDB_API_KEY, language: 'pt-BR' },
    }
  );
  return response.data.results.map((show) => ({
    ...show,
    media_type: 'tv' as const,
  }));
}

export async function searchTitles(
  query: string,
  page: number
): Promise<ApiResponse> {
  const response = await tmdbApi.get('/search/multi', {
    params: {
      api_key: env.VITE_TMDB_API_KEY,
      query,
      page,
      language: 'pt-BR',
    },
  });
  return response.data;
}

export async function getTrailerKey(
  id: number,
  type: 'movie' | 'tv'
): Promise<string | null> {
  const response = await tmdbApi.get<{ results: Video[] }>(
    `/${type}/${id}/videos`,
    {
      params: {
        api_key: env.VITE_TMDB_API_KEY,
        language: 'en-US',
      },
    }
  );
  const trailers = response.data.results.filter(
    (video: Video) => video.type === 'Trailer' && video.site === 'YouTube'
  );
  return trailers.length > 0 ? trailers[0].key : null;
}

export async function getTitleDetails(
  id: number,
  type: 'movie' | 'tv'
): Promise<Title> {
  const response = await tmdbApi.get(`/${type}/${id}`, {
    params: {
      api_key: env.VITE_TMDB_API_KEY,
      language: 'pt-BR',
    },
  });
  return { ...response.data, media_type: type };
}

export async function getTrendingTitles(): Promise<Title[]> {
  const response = await tmdbApi.get('/trending/all/day', {
    params: { api_key: env.VITE_TMDB_API_KEY, language: 'pt-BR' },
  });
  return response.data.results;
}

export async function getTitleCredits(
  id: number,
  type: 'movie' | 'tv'
): Promise<TitleCreditsResponse> {
  const response = await tmdbApi.get(`/${type}/${id}/credits`, {
    params: {
      api_key: env.VITE_TMDB_API_KEY,
      language: 'pt-BR',
    },
  });
  return response.data;
}

export async function getTitleRecommendations(
  id: number,
  type: 'movie' | 'tv'
): Promise<TitleRecommendationsResponse> {
  const response = await tmdbApi.get(`/${type}/${id}/recommendations`, {
    params: {
      api_key: env.VITE_TMDB_API_KEY,
      language: 'pt-BR',
    },
  });
  return response.data;
}
