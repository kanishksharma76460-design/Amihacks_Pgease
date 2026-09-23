import { Link } from 'react-router-dom';
import { AlertTriangle, BedDouble, Building2, IndianRupee, Users, Wallet } from 'lucide-react';
import { useStore } from '../lib/store';
import { Badge, Card, EmptyState, PageHeader, StatCard } from '../components/ui';
import { billTotals, currentMonthKey, daysUntil, inr, periodLabel } from '../lib/utils';

export default function Dashboard() {
  const rooms = useStore((s) => s.rooms);
  const tenants = useStore((s) => s.tenants);
  const bills = useStore((s) => s.bills);
  const payments = useStore((s) => s.payments);
  const docs = useStore((s) => s.docs);

  const occupied = rooms.filter((r) => r.status === 'occupied');
  const occupancy = rooms.length ? Math.round((occupied.length / rooms.length) * 100) : 0;
  const rentRoll = occupied.reduce((sum, r) => sum + r.monthlyRent, 0);

  const month = currentMonthKey();
  const collectedThisMonth = payments
    .filter((p) => p.date.startsWith(month))
    .reduce((sum, p) => sum + p.amount, 0);

  const outstanding = bills
    .filter((b) => b.status !== 'paid')
    .reduce((sum, b) => sum + (billTotals(b).total - b.amountPaid), 0);

  const tenantById = new Map(tenants.map((t) => [t.id, t]));

  const recentPayments = [...payments]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 6);

  const pendingBills = bills
    .filter((b) => b.status !== 'paid')
    .sort((a, b) => (a.period < b.period ? 1 : -1));

  const complianceAlerts = docs
    .map((d) => ({ doc: d, days: daysUntil(d.expiryDate) }))
    .filter((x) => x.days <= 30)
    .sort((a, b) => a.days - b.days);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle={`Overview for ${periodLabel(month)}`} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Occupancy" value={`${occupancy}%`} hint={`${occupied.length} of ${rooms.length} rooms`} icon={<BedDouble size={18} />} />
        <StatCard label="Monthly rent roll" value={inr(rentRoll)} hint="Occupied rooms only" icon={<IndianRupee size={18} />} />
        <StatCard label="Collected this month" value={inr(collectedThisMonth)} hint="All payment methods" icon={<Wallet size={18} />} />
        <StatCard label="Outstanding dues" value={inr(outstanding)} hint="Across all periods" icon={<AlertTriangle size={18} />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Pending dues</h2>
            <Link to="/billing" className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">
              Go to billing
            </Link>
          </div>
          {pendingBills.length === 0 ? (
            <EmptyState title="No pending dues" hint="All bills are settled." />
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {pendingBills.map((b) => {
                const t = tenantById.get(b.tenantId);
                const due = billTotals(b).total - b.amountPaid;
                return (
                  <li key={b.id} className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{t?.name ?? '—'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{periodLabel(b.period)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{inr(due)}</p>
                      <Badge tone={b.status === 'partial' ? 'amber' : 'red'}>
                        {b.status === 'partial' ? 'Partial' : 'Pending'}
                      </Badge>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Recent payments</h2>
            <Link to="/payments" className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">
              View all
            </Link>
          </div>
          {recentPayments.length === 0 ? (
            <EmptyState title="No payments yet" />
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentPayments.map((p) => {
                const t = tenantById.get(p.tenantId);
                return (
                  <li key={p.id} className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{t?.name ?? '—'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {p.date} · {p.method}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">+{inr(p.amount)}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Compliance alerts</h2>
            <Link to="/compliance" className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">
              Manage
            </Link>
          </div>
          {complianceAlerts.length === 0 ? (
            <EmptyState title="All documents in order" />
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {complianceAlerts.map(({ doc, days }) => (
                <li key={doc.id} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{doc.type}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{doc.number}</p>
                  </div>
                  <Badge tone={days < 0 ? 'red' : 'amber'}>
                    {days < 0 ? `Expired ${-days}d ago` : `Due in ${days}d`}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <Users size={16} className="text-indigo-500 dark:text-indigo-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tenants</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{tenants.length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Active tenants</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
              <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{tenants.filter((t) => t.hasFood).length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">With meal plan</p>
            </div>
          </div>
          <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800/60">
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-indigo-500 dark:text-indigo-400" />
              <p className="font-medium text-slate-700 dark:text-slate-200">1 property</p>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Add more properties from the Properties tab.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
