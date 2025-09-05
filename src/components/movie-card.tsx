import { Link } from 'react-router-dom';
import type { Title } from '../types/title';

type MovieCardProps = {
  movie: Title;
};

export function MovieCard({ movie }: MovieCardProps) {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750.png?text=Sem+Imagem';

  return (
    <div className="transform overflow-hidden rounded-lg bg-gray-800 shadow-lg transition-transform duration-300 hover:scale-105">
      <Link to={`/movie/${movie.id}`}>
        {/** biome-ignore lint/performance/noImgElement: <> */}
        <img
          alt={movie.title}
          className="h-auto w-full object-cover"
          height={32}
          src={imageUrl}
          width={32}
        />
      </Link>
    </div>
  );
}
