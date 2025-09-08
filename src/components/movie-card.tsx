import { Link } from 'react-router-dom';
import { Poster } from '../components/placeholder-image';
import { getImageUrl } from '../services/movie-api';
import type { Title } from '../types/title';

type TitleCardProps = {
  title: Title;
};

export function MovieCard({ title }: TitleCardProps) {
  const imageUrl = getImageUrl(title.poster_path, 'original')
  const titleId = title.id;
  const mediaType = title.media_type || 'movie';

  return (
    <div className="transform overflow-hidden rounded-lg bg-gray-800 shadow-lg transition-transform duration-300 hover:scale-105">
      <Link to={`/${mediaType}/${titleId}`}>
        <Poster
          alt={title.title ?? title.name ?? 'Sem título'}
          src={imageUrl}
        />
      </Link>
    </div>
  );
}
