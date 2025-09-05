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
};

export type ApiResponse = {
  page: number;
  results: Title[];
  total_pages: number;
  total_results: number;
};

export type Cast = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};

export type Crew = {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
};

export type TitleCreditsResponse = {
  id: number;
  cast: Cast[];
  crew: Crew[];
};

export type Recommendation = {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
};

export type TitleRecommendationsResponse = {
  page: number;
  results: Recommendation[];
  total_pages: number;
  total_results: number;
};