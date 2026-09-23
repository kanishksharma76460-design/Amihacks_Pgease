import { useState } from 'react';
import { Building2, MapPin, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../lib/store';
import { Badge, Button, Card, EmptyState, Field, inputClass, Modal, PageHeader } from '../components/ui';

export default function Properties() {
  const properties = useStore((s) => s.properties);
  const rooms = useStore((s) => s.rooms);
  const addProperty = useStore((s) => s.addProperty);
  const deleteProperty = useStore((s) => s.deleteProperty);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', ownerName: '', phone: '' });

  const submit = () => {
    if (!form.name.trim()) return;
    addProperty({ ...form, name: form.name.trim() });
    setForm({ name: '', address: '', ownerName: '', phone: '' });
    setOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Properties"
        subtitle="The buildings and hostels you manage"
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus size={16} /> Add property
          </Button>
        }
      />

      {properties.length === 0 ? (
        <EmptyState title="No properties yet" hint="Add your first PG or hostel to get started." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {properties.map((p) => {
            const propRooms = rooms.filter((r) => r.propertyId === p.id);
            const occupied = propRooms.filter((r) => r.status === 'occupied').length;
            return (
              <Card key={p.id} className="p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 size={18} className="text-indigo-500 dark:text-indigo-400" />
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{p.name}</h3>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete "${p.name}" and all its rooms & tenants?`)) {
                        deleteProperty(p.id);
                      }
                    }}
                    className="rounded-md p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="mt-1 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                  <MapPin size={14} /> {p.address}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {p.ownerName} · {p.phone}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Badge tone="indigo">{propRooms.length} rooms</Badge>
                  <Badge tone="green">{occupied} occupied</Badge>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add property"
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
          <Field label="Property name">
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Sunrise PG — Madhapur"
            />
          </Field>
          <Field label="Address">
            <input
              className={inputClass}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Street, locality, city, PIN"
            />
          </Field>
          <Field label="Owner name">
            <input
              className={inputClass}
              value={form.ownerName}
              onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
            />
          </Field>
          <Field label="Phone">
            <input
              className={inputClass}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
