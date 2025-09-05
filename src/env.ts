import { z } from 'zod';

const envSchema = z.object({
  VITE_TMDB_API_KEY: z.string().min(1, 'TMDB API key is required'),
  VITE_TMDB_BASE_URL: z
    .string()
    .url('TMDB base URL must be a valid URL')
    .startsWith('https://api.themoviedb.org/3'),
});

export const env = envSchema.parse(import.meta.env);
