import { useEffect, useState } from 'react';
import type { Title } from '../types/title';

const FAVORITES_KEY = 'tmdb_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Title[]>(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      return storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (_) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (movie: Title) => {
    setFavorites((prev) => {
      if (prev.some((fav) => fav.id === movie.id)) {
        return prev;
      }
      return [...prev, movie];
    });
  };

  const removeFavorite = (movieId: number) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== movieId));
  };

  const isFavorite = (movieId: number): boolean => {
    return favorites.some((fav) => fav.id === movieId);
  };

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
