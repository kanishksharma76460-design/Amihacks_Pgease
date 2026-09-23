import { useMemo, useState } from 'react';
import { Wallet } from 'lucide-react';
import { useStore } from '../lib/store';
import type { PaymentMethod } from '../lib/types';
import { Badge, Card, EmptyState, PageHeader, StatCard, Td, Th } from '../components/ui';
import { inr } from '../lib/utils';

const METHODS: Array<PaymentMethod | 'All'> = ['All', 'UPI', 'Cash', 'Bank Transfer'];

export default function Payments() {
  const payments = useStore((s) => s.payments);
  const tenants = useStore((s) => s.tenants);
  const [filter, setFilter] = useState<PaymentMethod | 'All'>('All');

  const tenantById = new Map(tenants.map((t) => [t.id, t]));

  const filtered = useMemo(
    () =>
      [...payments]
        .filter((p) => filter === 'All' || p.method === filter)
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [payments, filter],
  );

  const total = filtered.reduce((s, p) => s + p.amount, 0);
  const byMethod = METHODS.filter((m) => m !== 'All').map((m) => ({
    method: m,
    sum: payments.filter((p) => p.method === m).reduce((s, p) => s + p.amount, 0),
    count: payments.filter((p) => p.method === m).length,
  }));

  return (
    <div>
      <PageHeader
        title="Payments"
        subtitle="Every rupee collected, across UPI, cash and bank"
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total collected" value={inr(total)} icon={<Wallet size={18} />} />
        {byMethod.map((m) => (
          <StatCard
            key={m.method}
            label={m.method}
            value={inr(m.sum)}
            hint={`${m.count} payment${m.count === 1 ? '' : 's'}`}
          />
        ))}
      </div>

      <div className="mt-6 mb-3 flex flex-wrap gap-2">
        {METHODS.map((m) => (
          <button
            key={m}
            onClick={() => setFilter(m)}
            className={
              'rounded-full px-3 py-1.5 text-sm font-medium ' +
              (filter === m
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700')
            }
          >
            {m}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No payments" hint="Record payments from the Billing tab." />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60">
              <tr>
                <Th>Date</Th>
                <Th>Tenant</Th>
                <Th>Method</Th>
                <Th>Note</Th>
                <Th className="text-right">Amount</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((p) => (
                <tr key={p.id}>
                  <Td>{p.date}</Td>
                  <Td className="font-medium text-slate-900 dark:text-slate-100">
                    {tenantById.get(p.tenantId)?.name ?? '—'}
                  </Td>
                  <Td>
                    <Badge tone={p.method === 'Cash' ? 'amber' : p.method === 'UPI' ? 'indigo' : 'slate'}>
                      {p.method}
                    </Badge>
                  </Td>
                  <Td className="max-w-[220px] truncate text-slate-500 dark:text-slate-400">{p.note || '—'}</Td>
                  <Td className="text-right font-semibold text-emerald-600 dark:text-emerald-400">+{inr(p.amount)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
