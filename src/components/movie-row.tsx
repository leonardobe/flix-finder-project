import type { Title } from '../types/title';
import { MovieCard } from './movie-card';

type MovieRowProps = {
  title: string;
  movies: Title[];
};

export function MovieRow({ title, movies }: MovieRowProps) {
  return (
    <section className="mb-8">
      <h2 className="mb-4 font-bold text-3xl text-white">{title}</h2>
      <div className="no-scrollbar flex space-x-4 overflow-x-scroll">
        {movies.map((movie) => (
          <div className="w-48 flex-shrink-0" key={movie.id}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}
