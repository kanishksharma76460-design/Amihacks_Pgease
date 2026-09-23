import { Link, NavLink } from 'react-router-dom';
import { Moon, Store, Sun } from 'lucide-react';
import { useTheme } from '../lib/theme';
import { cx } from '../lib/utils';
import Logo from './Logo';

export default function TenantNav() {
  const theme = useTheme((s) => s.theme);
  const toggle = useTheme((s) => s.toggle);
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Logo size={30} />
          <span className="font-semibold tracking-tight text-slate-900 dark:text-slate-100">PGease</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              cx(
                'rounded-lg px-3 py-1.5 text-sm font-medium',
                isActive
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white',
              )
            }
          >
            Explore PGs
          </NavLink>
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            <Store size={15} />
            <span className="hidden sm:inline">For PG owners</span>
          </Link>
          <button
            onClick={toggle}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </header>
  );
}
