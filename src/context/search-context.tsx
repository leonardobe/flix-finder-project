import { createContext, type ReactNode, useContext, useState } from 'react';

type SearchContextType = {
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [isSearchOpen, setSearchOpen] = useState(false);

  return (
    <SearchContext.Provider value={{ isSearchOpen, setSearchOpen }}>
      {children}
    </SearchContext.Provider>
  );
};

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch deve ser usado dentro de um SearchProvider');
  }
  return context;
}
