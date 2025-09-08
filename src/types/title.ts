export type Title = {
  id: number;
  title?: string;
  name?: string;
  media_type: 'movie' | 'tv';
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  backdrop_path: string;
  overview: string;
  runtime?: number | null;
  episode_run_time?: number[];
  genres: { id: number; name: string }[];
  created_by?: {
    id: number;
    name: string;
  }[];
};

export type ApiResponse = {
  page: number;
  results: Title[];
  total_pages: number;
  total_results: number;
};