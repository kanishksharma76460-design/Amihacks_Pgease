import { useState } from 'react';
import { Plus, Zap } from 'lucide-react';
import { useStore } from '../lib/store';
import type { Room } from '../lib/types';
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
import { currentMonthKey, inr, periodLabel } from '../lib/utils';

interface UnitInfo {
  prev: number;
  latest: number;
  units: number;
  amount: number;
}

export default function Electricity() {
  const rooms = useStore((s) => s.rooms);
  const tenants = useStore((s) => s.tenants);
  const readings = useStore((s) => s.readings);
  const settings = useStore((s) => s.settings);
  const setSettings = useStore((s) => s.setSettings);
  const addReading = useStore((s) => s.addReading);
  const generateBills = useStore((s) => s.generateBills);
  const addLineToBill = useStore((s) => s.addLineToBill);

  const [open, setOpen] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [units, setUnits] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [rate, setRate] = useState(String(settings.electricityRate));

  const occupied = rooms.filter((r) => r.status === 'occupied');
  const tenantByRoom = new Map(tenants.map((t) => [t.roomId, t]));

  const infoFor = (roomId: string): UnitInfo => {
    const list = readings
      .filter((r) => r.roomId === roomId)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
    const latest = list[list.length - 1]?.units ?? 0;
    const prev = list.length > 1 ? list[list.length - 2].units : latest;
    const units = Math.max(0, latest - prev);
    return { prev, latest, units, amount: Math.round(units * settings.electricityRate) };
  };

  const submitReading = () => {
    const u = Number(units);
    if (!roomId || !Number.isFinite(u) || u < 0) return;
    addReading(roomId, u, date);
    setUnits('');
    setOpen(false);
  };

  const addToBill = (room: Room) => {
    const tenant = tenantByRoom.get(room.id);
    if (!tenant) return;
    const period = currentMonthKey();
    generateBills(period);
    const bill = useStore
      .getState()
      .bills.find((b) => b.tenantId === tenant.id && b.period === period);
    if (!bill) return;
    const info = infoFor(room.id);
    addLineToBill(
      bill.id,
      `Electricity — ${info.units} units @ ${inr(settings.electricityRate)}/unit`,
      info.amount,
      'electricity',
    );
  };

  const saveRate = () => {
    const r = Number(rate);
    if (Number.isFinite(r) && r > 0) setSettings({ electricityRate: r });
  };

  return (
    <div>
      <PageHeader
        title="Electricity"
        subtitle={`Sub-meter reading tracker for ${periodLabel(currentMonthKey())}`}
        actions={
          <Button
            onClick={() => {
              if (!occupied.length) {
                setRoomId('');
              } else {
                setRoomId(occupied[0].id);
              }
              setOpen(true);
            }}
          >
            <Plus size={16} /> Add reading
          </Button>
        }
      />

      <Card className="mb-4 flex flex-wrap items-end gap-3 p-4">
        <Field label="Unit rate (₹ per kWh)">
          <input
            className={inputClass}
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </Field>
        <Button variant="secondary" onClick={saveRate}>
          Save rate
        </Button>
        <p className="pb-2 text-xs text-slate-400 dark:text-slate-500">
          Applied to all rooms. Change per the building's actual tariff.
        </p>
      </Card>

      {occupied.length === 0 ? (
        <EmptyState title="No occupied rooms" hint="Meter tracking applies to occupied rooms." />
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60">
              <tr>
                <Th>Room</Th>
                <Th>Tenant</Th>
                <Th>Prev reading</Th>
                <Th>Latest</Th>
                <Th>Units used</Th>
                <Th>Amount</Th>
                <Th />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {occupied.map((room) => {
                const info = infoFor(room.id);
                const tenant = tenantByRoom.get(room.id);
                return (
                  <tr key={room.id}>
                    <Td className="font-medium text-slate-900 dark:text-slate-100">{room.name}</Td>
                    <Td>{tenant?.name ?? '—'}</Td>
                    <Td>{info.prev} kWh</Td>
                    <Td>{info.latest} kWh</Td>
                    <Td>
                      <Badge tone="indigo">{info.units} kWh</Badge>
                    </Td>
                    <Td className="font-medium">{inr(info.amount)}</Td>
                    <Td>
                      <Button
                        variant="secondary"
                        disabled={info.units <= 0}
                        onClick={() => addToBill(room)}
                      >
                        <Zap size={15} /> Add to bill
                      </Button>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add meter reading"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitReading}>Save reading</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Field label="Room">
            <select className={inputClass} value={roomId} onChange={(e) => setRoomId(e.target.value)}>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} — {tenantByRoom.get(r.id)?.name ?? 'vacant'}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Reading (kWh)">
              <input
                className={inputClass}
                type="number"
                value={units}
                onChange={(e) => setUnits(e.target.value)}
                placeholder="1290"
              />
            </Field>
            <Field label="Date">
              <input
                className={inputClass}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Field>
          </div>
        </div>
      </Modal>
    </div>
  );
}
