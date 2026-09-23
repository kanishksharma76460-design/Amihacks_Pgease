import { Link } from 'react-router-dom';
import { BadgeCheck, MapPin, ReceiptText, Search, Store, Zap } from 'lucide-react';
import TenantNav from '../components/TenantNav';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <TenantNav />

      <section className="animate-fade-up mx-auto max-w-6xl px-4 pb-16 pt-14 text-center">
        <div className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
          <MapPin size={13} /> Hyderabad-first · built to go national
        </div>
        <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold leading-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
          Find a verified PG near your work.
          <span className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
            {' '}
            Or fill yours faster.
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          One platform, two faces. Tenants search verified PGs by commute and budget; owners run
          billing, receipts and compliance — and get the tenants.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/explore"
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30"
          >
            <span className="inline-flex items-center gap-2">
              <Search size={18} /> I'm looking for a PG
            </span>
          </Link>
          <Link
            to="/dashboard"
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <span className="inline-flex items-center gap-2">
              <Store size={18} /> I own a PG
            </span>
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        <Feature
          icon={<MapPin className="text-indigo-500 dark:text-indigo-400" size={20} />}
          title="Search by commute"
          text="Enter your office or college and see how far every PG really is — not just straight-line, but time to get there."
        />
        <Feature
          icon={<BadgeCheck className="text-indigo-500 dark:text-indigo-400" size={20} />}
          title="Verified listings"
          text="GST, trade licence, fire NOC and photos checked. A verified badge means the PG is real and compliant."
        />
        <Feature
          icon={<ReceiptText className="text-indigo-500 dark:text-indigo-400" size={20} />}
          title="Transparent pricing"
          text="Real per-bed prices, deposit norms and zero-GST receipts — no hidden charges, no broker games."
        />
        <Feature
          icon={<Store className="text-indigo-500 dark:text-indigo-400" size={20} />}
          title="Owners get tenants"
          text="Your PG gets discovered by people actively searching near you. Verified PGs rank higher."
        />
        <Feature
          icon={<Zap className="text-indigo-500 dark:text-indigo-400" size={20} />}
          title="Run the whole business"
          text="Rooms, billing, GST receipts, electricity, food and compliance — one app, no registers or WhatsApp chaos."
        />
        <Feature
          icon={<MapPin className="text-indigo-500 dark:text-indigo-400" size={20} />}
          title="National-ready"
          text="Starting in Hyderabad, built on one dataset that already spans Bengaluru and Pune."
        />
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400 dark:border-slate-800">
        PGease · demo prototype — availability and payments are simulated until the backend ships.
      </footer>
    </div>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{text}</p>
    </div>
  );
}
