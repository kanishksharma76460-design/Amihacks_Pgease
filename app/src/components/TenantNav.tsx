import { Link, NavLink, useLocation } from 'react-router-dom';
import { Moon, Store, Sun } from 'lucide-react';
import { useTheme } from '../lib/theme';
import { cx } from '../lib/utils';
import Logo from './Logo';

export default function TenantNav() {
  const theme = useTheme((s) => s.theme);
  const toggle = useTheme((s) => s.toggle);
  const location = useLocation();
  const isLanding = location.pathname === '/';

  // If we are on landing, we force a dark glassmorphic nav. Otherwise, we respect the theme.
  const navClasses = isLanding
    ? "sticky top-0 z-50 border-b border-white/5 bg-bugatti-obsidian/40 backdrop-blur-xl"
    : "sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-white/5 dark:bg-bugatti-obsidian/80";

  return (
    <header className={navClasses}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 group">
          <Logo size={32} />
          <span className="text-xl font-bold tracking-widest text-white">PG<span className="text-bugatti-cyan transition-colors group-hover:text-bugatti-blue">EASE</span></span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              cx(
                'rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all',
                isActive
                  ? 'bg-bugatti-cyan/10 text-bugatti-cyan border border-bugatti-cyan/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              )
            }
          >
            Explore PGs
          </NavLink>
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/5 transition-all border border-transparent"
          >
            <Store size={15} />
            <span className="hidden sm:inline">For Owners</span>
          </Link>
          {!isLanding && (
            <button
              onClick={toggle}
              className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-all ml-2"
              title="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
