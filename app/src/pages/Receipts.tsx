import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { useStore } from '../lib/store';
import { Badge, Card, EmptyState, PageHeader, Td, Th } from '../components/ui';
import { inr } from '../lib/utils';

export default function Receipts() {
  const receipts = useStore((s) => s.receipts);
  const tenants = useStore((s) => s.tenants);
  const tenantById = new Map(tenants.map((t) => [t.id, t]));

  const sorted = [...receipts].sort((a, b) => (a.number < b.number ? 1 : -1));

  return (
    <div>
      <PageHeader
        title="Receipts"
        subtitle="Auto-generated, GST-compliant receipts for every payment"
      />

      {sorted.length === 0 ? (
        <EmptyState title="No receipts yet" hint="A receipt is created automatically when you record a payment." />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60">
              <tr>
                <Th>Receipt no.</Th>
                <Th>Date</Th>
                <Th>Tenant</Th>
                <Th>GST</Th>
                <Th className="text-right">Amount</Th>
                <Th />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sorted.map((r) => (
                <tr key={r.id}>
                  <Td className="font-medium text-slate-900 dark:text-slate-100">{r.number}</Td>
                  <Td>{r.date}</Td>
                  <Td>{tenantById.get(r.tenantId)?.name ?? '—'}</Td>
                  <Td>
                    <Badge tone={r.zeroGst ? 'green' : 'amber'}>
                      {r.zeroGst ? 'Zero GST' : `${Math.round(r.gstRate * 100)}%`}
                    </Badge>
                  </Td>
                  <Td className="text-right font-semibold text-slate-900">{inr(r.amount)}</Td>
                  <Td>
                    <Link to={`/receipts/${r.id}`} className="text-indigo-600 hover:underline dark:text-indigo-400">
                      <FileText size={15} />
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
