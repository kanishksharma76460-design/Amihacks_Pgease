import { useState } from 'react';
import { BedDouble, LogOut, Plus, UserPlus } from 'lucide-react';
import { useStore } from '../lib/store';
import type { RoomType } from '../lib/types';
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
import { inr } from '../lib/utils';

export default function Rooms() {
  const rooms = useStore((s) => s.rooms);
  const tenants = useStore((s) => s.tenants);
  const properties = useStore((s) => s.properties);
  const foodPlans = useStore((s) => s.foodPlans);
  const addRoom = useStore((s) => s.addRoom);
  const addTenant = useStore((s) => s.addTenant);
  const vacateRoom = useStore((s) => s.vacateRoom);

  const [roomOpen, setRoomOpen] = useState(false);
  const [tenantOpen, setTenantOpen] = useState(false);
  const [targetRoom, setTargetRoom] = useState<string | null>(null);

  const [roomForm, setRoomForm] = useState({
    propertyId: properties[0]?.id ?? '',
    name: '',
    type: 'double' as RoomType,
    ac: false,
    monthlyRent: '',
    deposit: '',
  });

  const [tenantForm, setTenantForm] = useState({
    name: '',
    phone: '',
    idProof: '',
    moveInDate: new Date().toISOString().slice(0, 10),
    depositPaid: '',
    hasFood: false,
    foodPlanId: foodPlans[0]?.id ?? '',
  });

  const propName = (id: string) => properties.find((p) => p.id === id)?.name ?? '—';
  const tenantByRoom = new Map(tenants.map((t) => [t.roomId, t]));

  const submitRoom = () => {
    const rent = Number(roomForm.monthlyRent);
    const deposit = Number(roomForm.deposit);
    if (!roomForm.name.trim() || !roomForm.propertyId || rent <= 0) return;
    addRoom({
      propertyId: roomForm.propertyId,
      name: roomForm.name.trim(),
      type: roomForm.type,
      ac: roomForm.ac,
      monthlyRent: rent,
      deposit: deposit || rent,
    });
    setRoomForm({
      propertyId: properties[0]?.id ?? '',
      name: '',
      type: 'double',
      ac: false,
      monthlyRent: '',
      deposit: '',
    });
    setRoomOpen(false);
  };

  const submitTenant = () => {
    if (!targetRoom || !tenantForm.name.trim()) return;
    const deposit = Number(tenantForm.depositPaid);
    addTenant({
      name: tenantForm.name.trim(),
      phone: tenantForm.phone.trim(),
      idProof: tenantForm.idProof.trim() || 'Aadhaar **** —',
      roomId: targetRoom,
      moveInDate: tenantForm.moveInDate,
      depositPaid: Number.isFinite(deposit) ? deposit : 0,
      hasFood: tenantForm.hasFood,
      foodPlanId: tenantForm.hasFood ? tenantForm.foodPlanId : undefined,
    });
    setTenantForm({
      name: '',
      phone: '',
      idProof: '',
      moveInDate: new Date().toISOString().slice(0, 10),
      depositPaid: '',
      hasFood: false,
      foodPlanId: foodPlans[0]?.id ?? '',
    });
    setTargetRoom(null);
    setTenantOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Rooms & Tenants"
        subtitle="Bed-level inventory and who is staying where"
        actions={
          <Button onClick={() => setRoomOpen(true)}>
            <Plus size={16} /> Add room
          </Button>
        }
      />

      {rooms.length === 0 ? (
        <EmptyState title="No rooms yet" hint="Add rooms to start managing occupancy." />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60">
              <tr>
                <Th>Room</Th>
                <Th>Property</Th>
                <Th>Type</Th>
                <Th>AC</Th>
                <Th>Rent</Th>
                <Th>Deposit</Th>
                <Th>Status</Th>
                <Th>Tenant</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {rooms.map((r) => {
                const t = tenantByRoom.get(r.id);
                return (
                  <tr key={r.id}>
                    <Td className="font-medium text-slate-900 dark:text-slate-100">{r.name}</Td>
                    <Td>{propName(r.propertyId)}</Td>
                    <Td className="capitalize">{r.type}</Td>
                    <Td>{r.ac ? 'Yes' : 'No'}</Td>
                    <Td>{inr(r.monthlyRent)}</Td>
                    <Td>{inr(r.deposit)}</Td>
                    <Td>
                      <Badge tone={r.status === 'occupied' ? 'green' : 'slate'}>
                        {r.status}
                      </Badge>
                    </Td>
                    <Td>{t ? t.name : '—'}</Td>
                    <Td>
                      {t ? (
                        <Button
                          variant="ghost"
                          className="text-rose-600 dark:text-rose-400"
                          onClick={() => {
                            if (window.confirm(`Vacate ${t.name} from ${r.name}?`)) vacateRoom(r.id);
                          }}
                        >
                          <LogOut size={15} /> Vacate
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setTargetRoom(r.id);
                            setTenantOpen(true);
                          }}
                        >
                          <UserPlus size={15} /> Add tenant
                        </Button>
                      )}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {/* Add room modal */}
      <Modal
        open={roomOpen}
        onClose={() => setRoomOpen(false)}
        title="Add room / bed"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRoomOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitRoom}>Save room</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Field label="Property">
            <select
              className={inputClass}
              value={roomForm.propertyId}
              onChange={(e) => setRoomForm({ ...roomForm, propertyId: e.target.value })}
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Room / bed name">
            <input
              className={inputClass}
              value={roomForm.name}
              onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
              placeholder="101-A"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Sharing type">
              <select
                className={inputClass}
                value={roomForm.type}
                onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value as RoomType })}
              >
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="triple">Triple</option>
              </select>
            </Field>
            <Field label="Monthly rent (₹)">
              <input
                className={inputClass}
                type="number"
                value={roomForm.monthlyRent}
                onChange={(e) => setRoomForm({ ...roomForm, monthlyRent: e.target.value })}
                placeholder="12000"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Deposit (₹)">
              <input
                className={inputClass}
                type="number"
                value={roomForm.deposit}
                onChange={(e) => setRoomForm({ ...roomForm, deposit: e.target.value })}
                placeholder="12000"
              />
            </Field>
            <label className="flex items-end gap-2 pb-2 text-sm text-slate-700 dark:text-slate-200">
              <input
                type="checkbox"
                checked={roomForm.ac}
                onChange={(e) => setRoomForm({ ...roomForm, ac: e.target.checked })}
              />
              Air-conditioned
            </label>
          </div>
        </div>
      </Modal>

      {/* Add tenant modal */}
      <Modal
        open={tenantOpen}
        onClose={() => setTenantOpen(false)}
        title="Add tenant"
        footer={
          <>
            <Button variant="secondary" onClick={() => setTenantOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitTenant}>Move in</Button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
            <BedDouble size={16} />
            Room: {targetRoom ? rooms.find((r) => r.id === targetRoom)?.name : '—'}
          </div>
          <Field label="Full name">
            <input
              className={inputClass}
              value={tenantForm.name}
              onChange={(e) => setTenantForm({ ...tenantForm, name: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone">
              <input
                className={inputClass}
                value={tenantForm.phone}
                onChange={(e) => setTenantForm({ ...tenantForm, phone: e.target.value })}
              />
            </Field>
            <Field label="ID proof">
              <input
                className={inputClass}
                value={tenantForm.idProof}
                onChange={(e) => setTenantForm({ ...tenantForm, idProof: e.target.value })}
                placeholder="Aadhaar **** 1234"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Move-in date">
              <input
                className={inputClass}
                type="date"
                value={tenantForm.moveInDate}
                onChange={(e) => setTenantForm({ ...tenantForm, moveInDate: e.target.value })}
              />
            </Field>
            <Field label="Deposit paid (₹)">
              <input
                className={inputClass}
                type="number"
                value={tenantForm.depositPaid}
                onChange={(e) => setTenantForm({ ...tenantForm, depositPaid: e.target.value })}
              />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            <input
              type="checkbox"
              checked={tenantForm.hasFood}
              onChange={(e) => setTenantForm({ ...tenantForm, hasFood: e.target.checked })}
            />
            Includes meal plan
          </label>
          {tenantForm.hasFood ? (
            <Field label="Meal plan">
              <select
                className={inputClass}
                value={tenantForm.foodPlanId}
                onChange={(e) => setTenantForm({ ...tenantForm, foodPlanId: e.target.value })}
              >
                {foodPlans.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} — {inr(f.monthlyRate)}
                  </option>
                ))}
              </select>
            </Field>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
