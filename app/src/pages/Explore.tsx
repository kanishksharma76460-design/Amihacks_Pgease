import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeCheck, Clock, List, Map, MapPin, Star, Utensils } from 'lucide-react';
import TenantNav from '../components/TenantNav';
import Photo from '../components/Photo';
import MapView from '../components/MapView';
import { inputClass, Badge } from '../components/ui';
import {
  CITIES,
  DESTINATIONS,
  LISTINGS,
  distanceKm,
  minPrice,
  travelMinutes,
  type Destination,
  type Gender,
  type TravelMode,
} from '../lib/listings';
import { cx, inr } from '../lib/utils';

const MODES: TravelMode[] = ['walk', 'bike', 'car', 'metro'];

export default function Explore() {
  const navigate = useNavigate();
  const [city, setCity] = useState('Hyderabad');
  const [destId, setDestId] = useState('d1');
  const [mode, setMode] = useState<TravelMode>('bike');
  const [maxBudget, setMaxBudget] = useState<number>(0);
  const [sharing, setSharing] = useState<'any' | 'single' | 'double' | 'triple'>('any');
  const [gender, setGender] = useState<'any' | Gender>('any');
  const [food, setFood] = useState(false);
  const [ac, setAc] = useState(false);
  const [maxCommute, setMaxCommute] = useState<number>(0);
  const [view, setView] = useState<'list' | 'map'>('list');

  const dest = DESTINATIONS.find((d) => d.id === destId) ?? null;

  const filtered = useMemo(() => {
    return LISTINGS.filter((l) => {
      if (l.city !== city) return false;
      if (maxBudget > 0 && minPrice(l) > maxBudget) return false;
      if (sharing !== 'any' && l.prices[sharing] <= 0) return false;
      if (gender !== 'any' && l.gender !== gender) return false;
      if (food && !l.foodIncluded) return false;
      if (ac && !l.ac) return false;
      const km = distanceKm(l, dest);
      if (maxCommute > 0 && (km === null || travelMinutes(km, mode) > maxCommute)) return false;
      return true;
    }).sort((a, b) => {
      const ka = distanceKm(a, dest);
      const kb = distanceKm(b, dest);
      if (ka !== null && kb !== null) return ka - kb;
      if (ka !== null) return -1;
      if (kb !== null) return 1;
      return b.rating - a.rating;
    });
  }, [city, dest, mode, maxBudget, sharing, gender, food, ac, maxCommute]);

  const markers = useMemo(
    () => filtered.map((l) => ({ id: l.id, lat: l.lat, lng: l.lng, price: minPrice(l) })),
    [filtered],
  );

  const center: [number, number] = useMemo(
    () => (dest && dest.city === city ? [dest.lat, dest.lng] : cityCenter(city)),
    [dest, city],
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <TenantNav />

      <div className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Find a PG in {city}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {filtered.length} of {LISTINGS.filter((l) => l.city === city).length} PGs match your filters
        </p>

        {/* Filters */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">City</span>
              <select className={inputClass} value={city} onChange={(e) => setCity(e.target.value)}>
                {CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Near your office / college
              </span>
              <select className={inputClass} value={destId} onChange={(e) => setDestId(e.target.value)}>
                {DESTINATIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label} — {d.sublabel}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Budget — your max ₹/mo
              </span>
              <input
                className={inputClass}
                type="number"
                min={0}
                placeholder="Custom, e.g. 12000"
                value={maxBudget || ''}
                onChange={(e) => setMaxBudget(Number(e.target.value) || 0)}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Max commute</span>
              <select
                className={inputClass}
                value={maxCommute}
                onChange={(e) => setMaxCommute(Number(e.target.value))}
              >
                <option value={0}>Any</option>
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
              </select>
            </label>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-medium text-slate-500 dark:text-slate-400">Travel by:</span>
            {MODES.map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={
                  'rounded-full px-3 py-1 text-xs font-medium capitalize ' +
                  (mode === m
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300')
                }
              >
                {m}
              </button>
            ))}
            <span className="mx-2 hidden h-4 w-px bg-slate-200 dark:bg-slate-700 sm:block" />
            {(['any', 'single', 'double', 'triple'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSharing(s)}
                className={
                  'rounded-full px-3 py-1 text-xs font-medium capitalize ' +
                  (sharing === s
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300')
                }
              >
                {s === 'any' ? 'Any room' : s + ' sharing'}
              </button>
            ))}
            <button
              onClick={() => setFood(!food)}
              className={
                'rounded-full px-3 py-1 text-xs font-medium ' +
                (food ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300')
              }
            >
              Meals included
            </button>
            <button
              onClick={() => setAc(!ac)}
              className={
                'rounded-full px-3 py-1 text-xs font-medium ' +
                (ac ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300')
              }
            >
              AC
            </button>
          </div>
        </div>

        {/* Mobile view toggle */}
        <div className="mt-6 flex gap-2 lg:hidden">
          <button
            onClick={() => setView('list')}
            className={cx(
              'flex-1 rounded-lg px-3 py-2 text-sm font-medium',
              view === 'list'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
            )}
          >
            <span className="inline-flex items-center justify-center gap-1.5">
              <List size={15} /> List
            </span>
          </button>
          <button
            onClick={() => setView('map')}
            className={cx(
              'flex-1 rounded-lg px-3 py-2 text-sm font-medium',
              view === 'map'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
            )}
          >
            <span className="inline-flex items-center justify-center gap-1.5">
              <Map size={15} /> Map
            </span>
          </button>
        </div>

        {/* Results + map */}
        <div className="mt-4 lg:mt-6 lg:flex lg:gap-6">
          <div className={cx('lg:w-3/5', view === 'map' ? 'hidden lg:block' : 'block')}>
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
                <p className="font-medium text-slate-600 dark:text-slate-300">No PGs match those filters.</p>
                <p className="mt-1 text-sm text-slate-400">Try widening the budget or commute.</p>
              </div>
            ) : (
              <div className="animate-fade-in space-y-4">
                {filtered.map((l) => {
                  const km = distanceKm(l, dest);
                  const mins = km !== null ? travelMinutes(km, mode) : null;
                  return (
                    <button
                      key={l.id}
                      onClick={() => navigate(`/listing/${l.id}`)}
                      className="flex w-full gap-4 rounded-xl border border-slate-200 bg-white p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                    >
                      <Photo seed={l.id} className="h-28 w-28 shrink-0 rounded-lg" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate font-semibold text-slate-900 dark:text-slate-100">{l.name}</h3>
                          {l.verified ? (
                            <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400" title="Verified">
                              <BadgeCheck size={15} />
                            </span>
                          ) : null}
                        </div>
                        <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                          <MapPin size={12} /> {l.locality}, {l.city}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                          <span className="inline-flex items-center gap-1">
                            <Star size={12} className="text-amber-500" /> {l.rating} ({l.reviewsCount})
                          </span>
                          {mins !== null ? (
                            <span className="inline-flex items-center gap-1 font-medium text-indigo-600 dark:text-indigo-400">
                              <Clock size={12} /> {km!.toFixed(1)} km · ~{mins} min
                            </span>
                          ) : null}
                          {l.foodIncluded ? (
                            <span className="inline-flex items-center gap-1">
                              <Utensils size={12} /> Meals
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {inr(minPrice(l))}/mo{' '}
                          <span className="text-xs font-normal text-slate-400">from</span>
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div
            className={cx(
              'mt-6 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 lg:sticky lg:top-20 lg:mt-0 lg:w-2/5',
              view === 'map' ? 'block h-[70vh] lg:h-[600px]' : 'hidden lg:block lg:h-[600px]',
            )}
          >
            <MapView markers={markers} center={center} onSelect={(id) => navigate(`/listing/${id}`)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function cityCenter(city: string): [number, number] {
  if (city === 'Bengaluru') return [12.92, 77.63];
  if (city === 'Pune') return [18.57, 73.88];
  return [17.44, 78.38];
}
