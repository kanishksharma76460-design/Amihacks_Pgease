import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { useStore } from '../lib/store';
import { useAuth } from '../lib/auth';
import { Button, Card, EmptyState } from '../components/ui';
import { inr } from '../lib/utils';

export default function ReceiptView() {
  const { id } = useParams();
  const receipts = useStore((s) => s.receipts);
  const payments = useStore((s) => s.payments);
  const tenants = useStore((s) => s.tenants);
  const rooms = useStore((s) => s.rooms);
  const properties = useStore((s) => s.properties);
  const settings = useStore((s) => s.settings);
  const owner = useAuth((s) => s.owner);

  const receipt = receipts.find((r) => r.id === id);
  if (!receipt) {
    return <EmptyState title="Receipt not found" />;
  }

  const payment = payments.find((p) => p.id === receipt.paymentId);
  const tenant = tenants.find((t) => t.id === receipt.tenantId);
  const room = rooms.find((r) => r.id === tenant?.roomId);
  const property = properties.find((p) => p.id === room?.propertyId);

  const businessName = property?.name ?? owner?.propertyName ?? 'PGease PG';
  const address = property?.address ?? owner?.address ?? '';
  const gstin = owner?.gstin || settings.gstin;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between no-print">
        <Link to="/receipts">
          <Button variant="secondary">
            <ArrowLeft size={16} /> Back
          </Button>
        </Link>
        <Button onClick={() => window.print()}>
          <Printer size={16} /> Print
        </Button>
      </div>

      <Card className="print-area mx-auto max-w-xl p-6">
        <div className="flex items-start justify-between border-b border-dashed border-slate-300 pb-4 dark:border-slate-700">
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">{businessName}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{address}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">GSTIN: {gstin}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">Receipt</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{receipt.number}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{receipt.date}</p>
          </div>
        </div>

        <div className="space-y-3 border-b border-dashed border-slate-300 py-4 text-sm dark:border-slate-700">
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Received from</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">{tenant?.name ?? '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Room</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">{room?.name ?? '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Payment method</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">{payment?.method ?? '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">For period</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {receipt.billId ? useStore.getState().bills.find((b) => b.id === receipt.billId)?.period : '—'}
            </span>
          </div>
        </div>

        <div className="space-y-2 border-b border-dashed border-slate-300 py-4 text-sm dark:border-slate-700">
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Taxable amount</span>
            <span className="text-slate-900 dark:text-slate-100">{inr(receipt.taxable)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">
              GST {receipt.zeroGst ? '(exempt)' : `@ ${Math.round(receipt.gstRate * 100)}%`}
            </span>
            <span className="text-slate-900 dark:text-slate-100">{inr(receipt.gstAmount)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold dark:border-slate-700">
            <span className="text-slate-900 dark:text-slate-100">Amount paid</span>
            <span className="text-slate-900 dark:text-slate-100">{inr(receipt.amount)}</span>
          </div>
        </div>

        {receipt.zeroGst ? (
          <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
            GST exempt under Entry 12AA of Notification 12/2017-CT(R) — residential dwelling /
            continuous stay ≥ 90 days and rent ≤ ₹20,000 per person per month.
          </p>
        ) : (
          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
            GST charged @ 12% under SAC 9963 (commercial lodging).
          </p>
        )}

        <p className="mt-4 text-center text-[11px] text-slate-400 dark:text-slate-500">
          This is a computer-generated receipt and does not require a signature.
        </p>
      </Card>
    </div>
  );
}
