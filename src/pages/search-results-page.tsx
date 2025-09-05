import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { Loading } from '../components/loading';
import { MovieCard } from '../components/movie-card';
import { searchTitles } from '../services/movie-api';

export async function fetchSearchResults(query: string) {
  if (!query) {
    return null;
  }

  const response = await searchTitles(query, 1);
  return response.results;
};

export function SearchResultsPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';

  const {
    data: movies,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['searchMovies', query],
    queryFn: () => fetchSearchResults(query),
    enabled: !!query,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="mt-8 text-center text-lg text-red-500">
        Erro ao carregar os resultados.
      </div>
    );
  }
  if (!query) {
    return (
      <div className="mt-8 text-center text-gray-400 text-lg">
        Digite algo na busca para começar.
      </div>
    );
  }
  if (!movies || movies.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-400 text-lg">
        Nenhum filme encontrado para "{query}".
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="my-8 text-center font-bold text-4xl text-white">
        Resultados para "{query}"
      </h1>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};
