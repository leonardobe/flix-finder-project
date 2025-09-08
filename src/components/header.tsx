import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { Link, NavLink } from 'react-router-dom';
import { useSearch } from '../context/search-context';
import { navItems } from '../data/nav-items';

export function Header() {
  const { setSearchOpen } = useSearch();

  return (
    <header className="fixed top-0 z-40 flex h-14 w-full items-center border border-gray-700 bg-gray-900 bg-opacity-80 p-4 shadow-lg backdrop-blur-md">
      <div className="flex w-full items-center justify-between px-4">
        {/* Logo */}
        <Link
          className="neonText font-bold text-2xl text-white uppercase tracking-wide"
          to="/"
        >
          Flix.Finder
        </Link>

        {/* Botão para abrir o modal de busca */}
        <div className="mx-10 flex flex-1 justify-center">
          <button
            className="flex w-full max-w-xl cursor-pointer items-center justify-between rounded-full border border-gray-600 bg-gray-800 px-3 py-1.5 text-gray-400 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setSearchOpen(true)}
            type="button"
          >
            <div className="flex items-center space-x-4">
              <MagnifyingGlassIcon className="h-5 w-5" />
              <span>Pesquisar filmes e séries...</span>
            </div>
            <span className="rounded-lg border border-gray-600 px-2 py-0.5 font-mono text-[10px]">
              CTRL + K
            </span>
          </button>
        </div>

        {/* Área de itens de menu */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-7 text-gray-300">
            {navItems.map((item) => {
              return (
                <NavLink key={item.id} to={item.path}>
                  {({ isActive }) => (
                    <div className="group relative flex flex-col items-center py-2">
                      <span
                        className={`-bottom-0 absolute h-0.5 w-full transition-all ${isActive ? 'bg-[#2979FF]' : 'bg-[#2979FF] opacity-0 group-hover:opacity-50'}`}
                      />
                      <span
                        className='neonText font-bold text-sm uppercase'
                      >
                        {item.name}
                      </span>
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
