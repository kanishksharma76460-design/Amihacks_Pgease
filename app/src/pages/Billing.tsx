import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus, Sparkles } from 'lucide-react';
import { useStore } from '../lib/store';
import type { Bill, BillLineKind, PaymentMethod } from '../lib/types';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  inputClass,
  Modal,
  PageHeader,
} from '../components/ui';
import {
  billTotals,
  currentMonthKey,
  gstNote,
  inr,
  lineKindLabel,
  periodLabel,
} from '../lib/utils';

export default function Billing() {
  const bills = useStore((s) => s.bills);
  const tenants = useStore((s) => s.tenants);
  const rooms = useStore((s) => s.rooms);
  const receipts = useStore((s) => s.receipts);
  const generateBills = useStore((s) => s.generateBills);
  const recordPayment = useStore((s) => s.recordPayment);
  const addLineToBill = useStore((s) => s.addLineToBill);
  const removeLineFromBill = useStore((s) => s.removeLineFromBill);

  const [period, setPeriod] = useState(currentMonthKey());
  const [payBill, setPayBill] = useState<Bill | null>(null);
  const [lineBill, setLineBill] = useState<Bill | null>(null);
  const [payForm, setPayForm] = useState({ amount: '', method: 'UPI' as PaymentMethod, note: '' });
  const [lineForm, setLineForm] = useState({ label: '', amount: '', kind: 'misc' as BillLineKind });
  const [flash, setFlash] = useState('');

  const tenantById = new Map(tenants.map((t) => [t.id, t]));
  const roomById = new Map(rooms.map((r) => [r.id, r]));

  const periodBills = useMemo(
    () =>
      bills
        .filter((b) => b.period === period)
        .sort((a, b) => (a.id < b.id ? 1 : -1)),
    [bills, period],
  );

  const openPay = (b: Bill) => {
    const remaining = billTotals(b).total - b.amountPaid;
    setPayForm({ amount: String(Math.max(0, remaining)), method: 'UPI', note: '' });
    setPayBill(b);
  };

  const submitPay = () => {
    if (!payBill) return;
    const amount = Number(payForm.amount);
    if (!Number.isFinite(amount) || amount <= 0) return;
    recordPayment(payBill.id, amount, payForm.method, payForm.note);
    setPayBill(null);
  };

  const submitLine = () => {
    if (!lineBill) return;
    const amount = Number(lineForm.amount);
    if (!lineForm.label.trim() || !Number.isFinite(amount) || amount < 0) return;
    addLineToBill(lineBill.id, lineForm.label.trim(), amount, lineForm.kind);
    setLineBill(null);
    setLineForm({ label: '', amount: '', kind: 'misc' });
  };

  const statusTone = (s: Bill['status']) =>
    s === 'paid' ? 'green' : s === 'partial' ? 'amber' : 'red';

  return (
    <div>
      <PageHeader
        title="Billing"
        subtitle="Generate bills, add charges, and collect payments"
        actions={
          <Button
            onClick={() => {
              const n = generateBills(period);
              setFlash(n > 0 ? `Generated ${n} bill${n === 1 ? '' : 's'}.` : 'All bills for this period already exist.');
            }}
          >
            <Sparkles size={16} /> Generate bills
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Field label="Billing period">
          <input
            type="month"
            className={inputClass}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          />
        </Field>
        <span className="self-end pb-1 text-sm text-slate-500 dark:text-slate-400">
          {periodLabel(period)}
        </span>
        {flash ? <span className="self-end pb-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">{flash}</span> : null}
      </div>

      {periodBills.length === 0 ? (
        <EmptyState
          title="No bills for this period"
          hint="Click “Generate bills” to create bills for all occupied rooms."
        />
      ) : (
        <div className="space-y-4">
          {periodBills.map((b) => {
            const t = tenantById.get(b.tenantId);
            const room = roomById.get(b.roomId);
            const totals = billTotals(b);
            const remaining = totals.total - b.amountPaid;
            const billReceipts = receipts.filter((r) => r.billId === b.id);
            return (
              <Card key={b.id} className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t?.name ?? '—'}</h3>
                      <Badge tone={statusTone(b.status)}>{b.status}</Badge>
                      {b.gstRate === 0 ? <Badge tone="green">Zero GST</Badge> : <Badge tone="amber">GST 12%</Badge>}
                    </div>
                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                      Room {room?.name ?? '—'} · {periodLabel(b.period)} · {b.stayDays} days stay
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">{inr(totals.total)}</p>
                    {b.amountPaid > 0 ? (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Paid {inr(b.amountPaid)} · Due {inr(remaining)}
                      </p>
                    ) : null}
                  </div>
                </div>

                <ul className="mt-3 space-y-1 border-t border-slate-100 pt-3 dark:border-slate-800">
                  {b.lines.map((l, i) => (
                    <li key={i} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-300">
                        {l.label}
                        <span className="ml-2 text-xs text-slate-400 dark:text-slate-500">{lineKindLabel(l.kind)}</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="text-slate-800 dark:text-slate-100">{inr(l.amount)}</span>
                        {l.kind !== 'rent' && l.kind !== 'food' ? (
                          <button
                            className="text-xs text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                            onClick={() => removeLineFromBill(b.id, i)}
                          >
                            remove
                          </button>
                        ) : null}
                      </span>
                    </li>
                  ))}
                  <li className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      GST {b.gstRate === 0 ? '(exempt)' : `@ ${Math.round(b.gstRate * 100)}%`}
                    </span>
                    <span className="text-slate-800 dark:text-slate-100">{inr(totals.gstAmount)}</span>
                  </li>
                </ul>

                <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                  {gstNote(b.gstRate)}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => openPay(b)}>
                    <Plus size={15} /> Record payment
                  </Button>
                  <Button variant="secondary" onClick={() => setLineBill(b)}>
                    <Plus size={15} /> Add charge
                  </Button>
                  {billReceipts.length > 0 ? (
                    <Link to={`/receipts/${billReceipts[billReceipts.length - 1].id}`}>
                      <Button variant="ghost">
                        <FileText size={15} /> View receipt
                      </Button>
                    </Link>
                  ) : null}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Record payment modal */}
      <Modal
        open={payBill !== null}
        onClose={() => setPayBill(null)}
        title="Record payment"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPayBill(null)}>
              Cancel
            </Button>
            <Button onClick={submitPay}>Save payment</Button>
          </>
        }
      >
        {payBill ? (
          <div className="space-y-3">
            <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
              {tenantById.get(payBill.tenantId)?.name} — due{' '}
              {inr(billTotals(payBill).total - payBill.amountPaid)}
            </div>
            <Field label="Amount (₹)">
              <input
                className={inputClass}
                type="number"
                value={payForm.amount}
                onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })}
              />
            </Field>
            <Field label="Method">
              <select
                className={inputClass}
                value={payForm.method}
                onChange={(e) => setPayForm({ ...payForm, method: e.target.value as PaymentMethod })}
              >
                <option>UPI</option>
                <option>Cash</option>
                <option>Bank Transfer</option>
              </select>
            </Field>
            <Field label="Note (optional)">
              <input
                className={inputClass}
                value={payForm.note}
                onChange={(e) => setPayForm({ ...payForm, note: e.target.value })}
                placeholder="UPI reference / remarks"
              />
            </Field>
          </div>
        ) : null}
      </Modal>

      {/* Add charge modal */}
      <Modal
        open={lineBill !== null}
        onClose={() => setLineBill(null)}
        title="Add charge"
        footer={
          <>
            <Button variant="secondary" onClick={() => setLineBill(null)}>
              Cancel
            </Button>
            <Button onClick={submitLine}>Add line</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Field label="Description">
            <input
              className={inputClass}
              value={lineForm.label}
              onChange={(e) => setLineForm({ ...lineForm, label: e.target.value })}
              placeholder="Electricity — 50 units"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount (₹)">
              <input
                className={inputClass}
                type="number"
                value={lineForm.amount}
                onChange={(e) => setLineForm({ ...lineForm, amount: e.target.value })}
              />
            </Field>
            <Field label="Type">
              <select
                className={inputClass}
                value={lineForm.kind}
                onChange={(e) => setLineForm({ ...lineForm, kind: e.target.value as BillLineKind })}
              >
                <option value="electricity">Electricity</option>
                <option value="misc">Other</option>
              </select>
            </Field>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Electricity is billed as a pass-through (no GST). Other charges are taxable.
          </p>
        </div>
      </Modal>
    </div>
  );
}
