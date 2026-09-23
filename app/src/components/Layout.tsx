import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BedDouble,
  Building2,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  Moon,
  ReceiptText,
  RotateCcw,
  ShieldCheck,
  Sun,
  Utensils,
  Wallet,
  Zap,
} from 'lucide-react';
import { cx } from '../lib/utils';
import { useStore } from '../lib/store';
import { useTheme } from '../lib/theme';
import { useAuth } from '../lib/auth';
import { useLeads } from '../lib/leads';
import Logo from './Logo';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/leads', label: 'Leads', icon: Inbox },
  { to: '/properties', label: 'Properties', icon: Building2 },
  { to: '/rooms', label: 'Rooms & Tenants', icon: BedDouble },
  { to: '/billing', label: 'Billing', icon: ReceiptText },
  { to: '/payments', label: 'Payments', icon: Wallet },
  { to: '/receipts', label: 'Receipts', icon: FileText },
  { to: '/electricity', label: 'Electricity', icon: Zap },
  { to: '/food', label: 'Food', icon: Utensils },
  { to: '/compliance', label: 'Compliance', icon: ShieldCheck },
];

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <Logo size={30} />
      <span className="text-base font-semibold tracking-tight text-white">PGease</span>
    </div>
  );
}

function ThemeToggle() {
  const theme = useTheme((s) => s.theme);
  const toggle = useTheme((s) => s.toggle);
  return (
    <button
      onClick={toggle}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white"
      title="Toggle dark mode"
    >
      {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}

export default function Layout() {
  const resetDemo = useStore((s) => s.resetDemo);
  const owner = useAuth((s) => s.owner);
  const logout = useAuth((s) => s.logout);
  const navigate = useNavigate();
  const newLeads = useLeads((s) => s.leads.filter((l) => l.status === 'new').length);
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 lg:flex">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col bg-slate-900 dark:bg-slate-950 lg:flex">
        <div className="px-5 py-5">
          <Brand />
          <p className="mt-1 text-xs text-slate-400">PG Business Manager</p>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cx(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm'
                    : 'text-slate-300 hover:translate-x-1 hover:bg-slate-800 hover:text-white',
                )
              }
            >
              <item.icon size={17} />
              {item.label}
              {item.to === '/leads' && newLeads > 0 ? (
                <span className="ml-auto rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {newLeads}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4">
          <ThemeToggle />
          <button
            onClick={() => {
              if (window.confirm('Reset all data to the demo dataset?')) resetDemo();
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <RotateCcw size={17} />
            Reset demo data
          </button>
          {owner ? (
            <div className="mt-2 border-t border-slate-800 pt-3">
              <p className="px-3 text-sm font-medium text-slate-200">{owner.ownerName}</p>
              <p className="px-3 text-xs text-slate-400">{owner.businessName}</p>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <LogOut size={17} />
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-h-screen flex-1 flex-col lg:ml-60">
        {/* Mobile header + tab strip */}
        <header className="sticky top-0 z-20 bg-slate-900 text-white dark:bg-slate-950 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <Brand />
            <div className="flex items-center gap-1">
              <ThemeToggle />
              {owner ? (
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                  title="Sign out"
                >
                  <LogOut size={18} />
                </button>
              ) : null}
            </div>
          </div>
          <nav className="no-scrollbar flex gap-1 overflow-x-auto px-2 pb-2">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cx(
                    'whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium',
                    isActive ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white' : 'text-slate-300',
                  )
                }
              >
                {item.label}
                {item.to === '/leads' && newLeads > 0 ? ` · ${newLeads} new` : ''}
              </NavLink>
            ))}
          </nav>
        </header>

        {owner && owner.verification !== 'verified' ? (
          <div className="mx-auto w-full max-w-6xl px-4 pt-4 lg:px-8">
            <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
              {owner.verification === 'rejected'
                ? 'Verification rejected — please update your GST, photos or location and resubmit.'
                : 'Property verification pending — an admin will review your GST, photos and location before features unlock.'}
            </div>
          </div>
        ) : null}

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
