import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Header } from './components/header';
import { SearchModal } from './components/search-modal';
import { SearchProvider } from './context/search-context';
import { FavoritesPage } from './pages/favorites-page';
import { HomePage } from './pages/home-page';
import { SearchResultsPage } from './pages/search-results-page';
import { TitleDetailsPage } from './pages/title-details-page';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SearchProvider>
          <div className="min-h-screen bg-gray-900 font-montserrat text-white">
            <Header />
            <main>
              <Routes>
                <Route element={<HomePage />} path="/" />
                <Route element={<SearchResultsPage />} path="/search-results" />
                <Route element={<TitleDetailsPage />} path="/:type/:id" />
                <Route element={<FavoritesPage />} path="/favorites" />
              </Routes>
            </main>
            <SearchModal />
          </div>
        </SearchProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
