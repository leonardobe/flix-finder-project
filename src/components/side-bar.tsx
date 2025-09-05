import { NavLink } from 'react-router-dom';
import { navItems } from '../data/nav-items';

export function Sidebar() {
  return (
    //fixed top-17 left-4 z-30 flex w-20 flex-col rounded-xl border border-gray-700 bg-gray-800 p-2.5
    <aside className="fixed left-4 top-1/2 -translate-y-1/2 z-50 p-4 rounded-full bg-gray-800 shadow-xl border border-gray-700 w-19">
      <nav className="flex-1">
        <ul>
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <li className="relative mb-2" key={item.id}>
                <NavLink to={item.path}>
                  {({ isActive }) => (
                    <div className="group relative flex flex-col items-center p-3">
                      <span
                        className={`-left-3 -translate-y-1/2 absolute top-1/2 h-12 w-1 rounded-r-full transition-all ${isActive ? 'bg-[#2979FF]' : 'bg-[#2979FF] opacity-0 group-hover:opacity-100'}`}
                      />
                      <Icon
                        className={`mb-1 h-5 w-5 ${isActive ? 'text-[#2979FF]' : 'text-white'}`}
                      />
                      <span className="text-xs">{item.name}</span>
                    </div>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
