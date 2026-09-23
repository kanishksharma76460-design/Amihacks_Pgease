import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Store,
} from 'lucide-react';
import TenantNav from '../components/TenantNav';
import Photo from '../components/Photo';
import { Badge, Button, Field, inputClass } from '../components/ui';
import { DESTINATIONS, LISTINGS, distanceKm, minPrice, travelMinutes, type TravelMode } from '../lib/listings';
import { useLeads } from '../lib/leads';
import { inr } from '../lib/utils';

const MODES: TravelMode[] = ['walk', 'bike', 'car', 'metro'];

export default function ListingDetail() {
  const { id } = useParams();
  const listing = LISTINGS.find((l) => l.id === id);
  const addLead = useLeads((s) => s.addLead);

  const [destId, setDestId] = useState('d1');
  const [mode, setMode] = useState<TravelMode>('bike');
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const dest = useMemo(() => DESTINATIONS.find((d) => d.id === destId) ?? null, [destId]);

  if (!listing) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <TenantNav />
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <p className="text-lg font-medium text-slate-600 dark:text-slate-300">PG not found.</p>
          <Link to="/explore" className="mt-3 inline-block font-medium text-indigo-600 dark:text-indigo-400">
            ← Back to explore
          </Link>
        </div>
      </div>
    );
  }

  const km = distanceKm(listing, dest);
  const mins = km !== null ? travelMinutes(km, mode) : null;

  const submit = () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    addLead({ pgName: listing.name, tenantName: form.name.trim(), phone: form.phone.trim(), message: form.message.trim() });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <TenantNav />

      <div className="mx-auto max-w-6xl px-4 py-6">
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft size={15} /> Back to results
        </Link>

        <div className="mt-4 grid gap-6 lg:grid-cols-3">
          {/* Left: main info */}
          <div className="space-y-6 lg:col-span-2">
            <Photo seed={listing.id} label={`${listing.locality}, ${listing.city}`} className="h-64 w-full rounded-xl" />

            <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{listing.name}</h1>
                    {listing.verified ? (
                      <Badge tone="green">
                        <BadgeCheck size={13} /> Verified
                      </Badge>
                    ) : null}
                    {listing.managed ? (
                      <Badge tone="indigo">
                        <Store size={13} /> Managed on PGease
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                    <MapPin size={14} /> {listing.locality}, {listing.city}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{inr(minPrice(listing))}/mo</p>
                  <p className="flex items-center justify-end gap-1 text-sm text-slate-500 dark:text-slate-400">
                    <Star size={14} className="text-amber-500" /> {listing.rating} · {listing.reviewsCount} reviews
                  </p>
                </div>
              </div>

              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{listing.description}</p>

              {/* Commute */}
              <div className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Commute to your office / college
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <select className={inputClass + ' max-w-[220px]'} value={destId} onChange={(e) => setDestId(e.target.value)}>
                    {DESTINATIONS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label} — {d.sublabel}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-1">
                    {MODES.map((m) => (
                      <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={
                          'rounded-full px-2.5 py-1 text-xs font-medium capitalize ' +
                          (mode === m
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300')
                        }
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                {mins !== null ? (
                  <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    <Clock size={14} /> {km!.toFixed(1)} km · ~{mins} min by {mode}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-slate-400">Set a Hyderabad destination to see commute.</p>
                )}
              </div>

              {/* Amenities */}
              <div className="mt-4 flex flex-wrap gap-2">
                {listing.amenities.map((a) => (
                  <span
                    key={a}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {a}
                  </span>
                ))}
              </div>

              {/* Compliance */}
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className={listing.compliance.tradeLicence ? 'text-emerald-500' : 'text-slate-300'} />
                  Trade licence {listing.compliance.tradeLicence ? '' : '— pending'}
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className={listing.compliance.fireNoc ? 'text-emerald-500' : 'text-slate-300'} />
                  Fire NOC {listing.compliance.fireNoc ? '' : '— pending'}
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className={listing.compliance.fssai ? 'text-emerald-500' : 'text-slate-300'} />
                  FSSAI {listing.compliance.fssai ? '' : '— pending'}
                </span>
              </div>
            </div>

            {/* Reviews */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">Reviews</h2>
              <div className="mt-3 space-y-3">
                {listing.reviews.map((r) => (
                  <div key={r.name} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800 dark:text-slate-100">{r.name}</span>
                      <span className="flex items-center gap-0.5 text-xs text-amber-500">
                        {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: pricing + contact */}
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">Rooms & pricing</h2>
              <div className="mt-3 space-y-2">
                {(
                  [
                    ['single', listing.prices.single],
                    ['double', listing.prices.double],
                    ['triple', listing.prices.triple],
                  ] as const
                ).map(([k, v]) =>
                  v > 0 ? (
                    <div key={k} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/60">
                      <span className="text-sm capitalize text-slate-600 dark:text-slate-300">{k} sharing</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{inr(v)}/mo</span>
                    </div>
                  ) : null,
                )}
                <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-sm dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Deposit</span>
                  <span className="text-slate-700 dark:text-slate-200">{inr(listing.deposit)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Meals</span>
                  <span className="text-slate-700 dark:text-slate-200">{listing.foodIncluded ? 'Included' : 'Not included'}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">Request a visit</h2>
              {submitted ? (
                <div className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <p className="flex items-center gap-1.5 font-medium">
                    <Check size={16} /> Request sent!
                  </p>
                  <p className="mt-1 text-xs">The owner will reach out to you shortly. (Demo — no real message is sent.)</p>
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  <input
                    className={inputClass}
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <input
                    className={inputClass}
                    placeholder="Phone number"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                  <input
                    className={inputClass}
                    placeholder="Message (optional)"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                  <Button className="w-full" onClick={submit}>
                    Request a visit
                  </Button>
                </div>
              )}
              <a
                href={`tel:${listing.phone}`}
                className="mt-2 flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <Phone size={15} /> {listing.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
