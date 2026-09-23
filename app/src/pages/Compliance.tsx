import { useState } from 'react';
import { Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { useStore } from '../lib/store';
import type { DocType } from '../lib/types';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  inputClass,
  Modal,
  PageHeader,
  Td,
  Th,
} from '../components/ui';
import { daysUntil } from '../lib/utils';

const DOC_TYPES: DocType[] = ['Trade Licence', 'Fire NOC', 'FSSAI', 'Police Form-A'];

export default function Compliance() {
  const docs = useStore((s) => s.docs);
  const properties = useStore((s) => s.properties);
  const settings = useStore((s) => s.settings);
  const setSettings = useStore((s) => s.setSettings);
  const addDoc = useStore((s) => s.addDoc);
  const deleteDoc = useStore((s) => s.deleteDoc);

  const [open, setOpen] = useState(false);
  const [gstin, setGstin] = useState(settings.gstin);
  const [elecRate, setElecRate] = useState(String(settings.electricityRate));
  const [form, setForm] = useState({
    propertyId: properties[0]?.id ?? '',
    type: 'Trade Licence' as DocType,
    number: '',
    issuedDate: new Date().toISOString().slice(0, 10),
    expiryDate: '',
  });

  const propName = (id: string) => properties.find((p) => p.id === id)?.name ?? '—';

  const statusTone = (days: number) => (days < 0 ? 'red' : days <= 30 ? 'amber' : 'green');
  const statusLabel = (days: number) =>
    days < 0 ? `Expired ${-days}d ago` : days <= 30 ? `Due in ${days}d` : `${days}d left`;

  const submit = () => {
    if (!form.number.trim() || !form.expiryDate) return;
    addDoc({ ...form, number: form.number.trim() });
    setForm({ ...form, number: '', expiryDate: '' });
    setOpen(false);
  };

  const saveSettings = () => {
    setSettings({ gstin, electricityRate: Number(elecRate) || settings.electricityRate });
  };

  return (
    <div>
      <PageHeader
        title="Compliance"
        subtitle="Licences, safety certificates and business settings"
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus size={16} /> Add document
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Documents</h2>
          {docs.length === 0 ? (
            <EmptyState title="No documents" hint="Track trade licence, fire NOC, FSSAI and police Form-A." />
          ) : (
            <Card className="overflow-x-auto">
              <table className="w-full min-w-[560px]">
                <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60">
                  <tr>
                    <Th>Type</Th>
                    <Th>Number</Th>
                    <Th>Property</Th>
                    <Th>Expiry</Th>
                    <Th />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {docs
                    .slice()
                    .sort((a, b) => daysUntil(a.expiryDate) - daysUntil(b.expiryDate))
                    .map((d) => {
                      const days = daysUntil(d.expiryDate);
                      return (
                        <tr key={d.id}>
                          <Td className="font-medium text-slate-900 dark:text-slate-100">{d.type}</Td>
                          <Td>{d.number}</Td>
                          <Td>{propName(d.propertyId)}</Td>
                          <Td>
                            <Badge tone={statusTone(days)}>{statusLabel(days)}</Badge>
                          </Td>
                          <Td>
                            <button
                              onClick={() => deleteDoc(d.id)}
                              className="rounded-md p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                            >
                              <Trash2 size={15} />
                            </button>
                          </Td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </Card>
          )}
        </div>

        <div>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            <ShieldCheck size={16} className="text-indigo-500 dark:text-indigo-400" /> Business settings
          </h2>
          <Card className="space-y-3 p-4">
            <Field label="GSTIN (shown on receipts)">
              <input className={inputClass} value={gstin} onChange={(e) => setGstin(e.target.value)} />
            </Field>
            <Field label="Electricity rate (₹/kWh)">
              <input
                className={inputClass}
                type="number"
                value={elecRate}
                onChange={(e) => setElecRate(e.target.value)}
              />
            </Field>
            <Button onClick={saveSettings}>Save settings</Button>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              GST is calculated automatically per bill using Entry 12AA — rent ≤ ₹20,000/month and
              ≥ 90-day stay means zero GST.
            </p>
          </Card>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add compliance document"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit}>Save</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Field label="Type">
            <select
              className={inputClass}
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as DocType })}
            >
              {DOC_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Document number">
            <input
              className={inputClass}
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
              placeholder="GHMC/TL/2026/4419"
            />
          </Field>
          <Field label="Property">
            <select
              className={inputClass}
              value={form.propertyId}
              onChange={(e) => setForm({ ...form, propertyId: e.target.value })}
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Issued date">
              <input
                className={inputClass}
                type="date"
                value={form.issuedDate}
                onChange={(e) => setForm({ ...form, issuedDate: e.target.value })}
              />
            </Field>
            <Field label="Expiry date">
              <input
                className={inputClass}
                type="date"
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
              />
            </Field>
          </div>
        </div>
      </Modal>
    </div>
  );
}
