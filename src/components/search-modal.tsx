import {
  CaretRightIcon,
  HashIcon,
  MagnifyingGlassIcon,
  XIcon,
} from '@phosphor-icons/react';
import * as Dialog from '@radix-ui/react-dialog';
import { useQuery } from '@tanstack/react-query';
import type React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSearch } from '../context/search-context';
import { searchTitles } from '../services/movie-api';
import type { Title } from '../types/title';

export function SearchModal() {
  const { isSearchOpen, setSearchOpen } = useSearch();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const { data: results, isLoading } = useQuery({
    queryKey: ['searchTitles', query],
    queryFn: async () => {
      if (!query) {
        return [];
      }
      const response = await searchTitles(query, 1);
      return response.results;
    },
    enabled: !!query,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) {
      navigate(`/search-results?q=${query}`);
      setSearchOpen(false);
    }
  };

  const handleItemClick = (title: Title) => {
    navigate(`/${title.media_type}/${title.id}`);
    setSearchOpen(false);
  };

  useEffect(() => {
    if (!isSearchOpen) {
      setQuery('');
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setSearchOpen, isSearchOpen]);

  return (
    <Dialog.Root onOpenChange={setSearchOpen} open={isSearchOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />

        <Dialog.Content className="-translate-x-1/2 fixed top-1/11 left-1/2 z-50 flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden overflow-y-auto rounded-lg bg-gray-800 p-6 shadow-2xl">
          <Dialog.Title className="pb-2 text-lg text-white">
            Pesquisar filmes ou séries
          </Dialog.Title>

          <form onSubmit={handleSearchSubmit}>
            <div className="relative mb-6">
              <input
                className="w-full rounded-lg bg-gray-700 p-4 pr-12 text-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar..."
                type="text"
                value={query}
              />
              <MagnifyingGlassIcon className="-translate-y-1/2 absolute top-1/2 right-4 h-5 w-5 text-gray-400" />
            </div>
          </form>

          <div className="custom-scrollbar flex-1 overflow-y-auto pr-1">
            {/* Estado inicial */}
            {!query && (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <p>Nenhuma busca recente</p>
              </div>
            )}

            {isLoading && query && (
              <div className="text-center text-gray-400">Carregando...</div>
            )}

            {results && results.length > 0 && (
              <div className="space-y-2">
                <ul className="space-y-2 pr-3">
                  {results.map((title) => (
                    <li key={`${title.id}-${title.media_type}`}>
                      <Link
                        className="flex w-full items-center justify-between rounded-lg bg-gray-700 p-3 text-blue-400 transition-colors duration-200 hover:bg-blue-600 hover:text-white"
                        onClick={() => handleItemClick(title)}
                        to={`/${title.media_type}/${title.id}`}
                      >
                        <div className="flex items-center space-x-3">
                          <HashIcon className="h-5 w-5" />
                          <span className="font-semibold text-white">
                            {title.media_type === "movie" ? title.title : title.name}
                          </span>
                        </div>
                        <span className="text-gray-300">
                          <CaretRightIcon className="h-3 w-3" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Dialog.Close asChild>
            <button
              className="absolute top-3 right-3 rounded-md p-1 text-gray-500 hover:rounded-full hover:bg-blue-600 hover:text-white"
              type="button"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
