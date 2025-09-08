import { MovieCard } from '../components/movie-card';
import { useFavorites } from '../hooks/use-favorites';

export function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <div className="container mx-auto p-4">
      <h1 className="my-8 pt-14 text-center font-bold text-4xl text-white">
        Meus Filmes Favoritos
      </h1>
      {favorites.length === 0 ? (
        <div className="text-center text-gray-400 text-lg">
          Você ainda não tem filmes favoritos. Adicione alguns!
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {favorites.map((movie) => (
            <MovieCard key={movie.id} title={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
