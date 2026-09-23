import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type {
  Bill,
  BillLineKind,
  ComplianceDoc,
  DocType,
  FoodPlan,
  MeterReading,
  Payment,
  PaymentMethod,
  Property,
  Receipt,
  Room,
  RoomType,
  Settings,
  Tenant,
} from './types';
import {
  billTotals,
  currentMonthKey,
  daysBetween,
  gstRate,
  monthEndDate,
  uid,
} from './utils';

interface AppState {
  properties: Property[];
  rooms: Room[];
  tenants: Tenant[];
  bills: Bill[];
  payments: Payment[];
  receipts: Receipt[];
  readings: MeterReading[];
  foodPlans: FoodPlan[];
  docs: ComplianceDoc[];
  settings: Settings;

  addProperty: (p: Omit<Property, 'id'>) => void;
  deleteProperty: (id: string) => void;
  addRoom: (r: Omit<Room, 'id' | 'status'>) => void;
  deleteRoom: (id: string) => void;
  addTenant: (t: Omit<Tenant, 'id'>) => void;
  vacateRoom: (roomId: string) => void;
  generateBills: (period: string) => number;
  addLineToBill: (billId: string, label: string, amount: number, kind: BillLineKind) => void;
  removeLineFromBill: (billId: string, index: number) => void;
  recordPayment: (
    billId: string,
    amount: number,
    method: PaymentMethod,
    note: string,
  ) => void;
  addReading: (roomId: string, units: number, date: string) => void;
  addFoodPlan: (name: string, monthlyRate: number) => void;
  setTenantFood: (tenantId: string, hasFood: boolean, foodPlanId?: string) => void;
  addDoc: (d: Omit<ComplianceDoc, 'id'>) => void;
  deleteDoc: (id: string) => void;
  setSettings: (partial: Partial<Settings>) => void;
  resetDemo: () => void;
}

type DataState = Pick<
  AppState,
  | 'properties'
  | 'rooms'
  | 'tenants'
  | 'bills'
  | 'payments'
  | 'receipts'
  | 'readings'
  | 'foodPlans'
  | 'docs'
  | 'settings'
>;

function seed(): DataState {
  const properties: Property[] = [
    {
      id: 'p1',
      name: 'Sunrise PG — Madhapur',
      address: 'Plot 12, Ayyappa Society, Madhapur, Hyderabad, TG 500081',
      ownerName: 'Ravi Kumar',
      phone: '98480 12345',
    },
  ];

  const rooms: Room[] = [
    { id: 'r1', propertyId: 'p1', name: '101-A', type: 'double', ac: true, monthlyRent: 15000, deposit: 15000, status: 'occupied', tenantId: 't1' },
    { id: 'r2', propertyId: 'p1', name: '101-B', type: 'double', ac: false, monthlyRent: 13500, deposit: 13500, status: 'occupied', tenantId: 't2' },
    { id: 'r3', propertyId: 'p1', name: '102', type: 'single', ac: true, monthlyRent: 21000, deposit: 21000, status: 'occupied', tenantId: 't3' },
    { id: 'r4', propertyId: 'p1', name: '102-B', type: 'double', ac: false, monthlyRent: 12000, deposit: 12000, status: 'vacant' },
    { id: 'r5', propertyId: 'p1', name: '103', type: 'triple', ac: false, monthlyRent: 9000, deposit: 9000, status: 'vacant' },
  ];

  const tenants: Tenant[] = [
    { id: 't1', name: 'Ankit Sharma', phone: '90000 11111', idProof: 'Aadhaar **** 4421', roomId: 'r1', moveInDate: '2026-06-01', depositPaid: 15000, hasFood: true, foodPlanId: 'fp2' },
    { id: 't2', name: 'Priya Nair', phone: '90000 22222', idProof: 'Aadhaar **** 7788', roomId: 'r2', moveInDate: '2026-05-20', depositPaid: 13500, hasFood: true, foodPlanId: 'fp1' },
    { id: 't3', name: 'Mohammed Irfan', phone: '90000 33333', idProof: 'Aadhaar **** 1190', roomId: 'r3', moveInDate: '2026-08-10', depositPaid: 21000, hasFood: false },
  ];

  const foodPlans: FoodPlan[] = [
    { id: 'fp1', name: 'Veg', monthlyRate: 4500 },
    { id: 'fp2', name: 'Non-Veg', monthlyRate: 5500 },
  ];

  const mkBill = (
    id: string,
    tenantId: string,
    roomId: string,
    period: string,
    lines: Bill['lines'],
    stayDays: number,
    rentPerPerson: number,
    amountPaid: number,
    status: Bill['status'],
  ): Bill => ({
    id,
    tenantId,
    roomId,
    period,
    lines,
    gstRate: gstRate(rentPerPerson, stayDays),
    stayDays,
    amountPaid,
    status,
    createdAt: period + '-01T10:00:00',
  });

  const bills: Bill[] = [
    mkBill('b1', 't1', 'r1', '2026-09',
      [{ label: 'Rent (101-A)', amount: 15000, kind: 'rent' }, { label: 'Food — Non-Veg', amount: 5500, kind: 'food' }],
      113, 15000, 20500, 'paid'),
    mkBill('b2', 't2', 'r2', '2026-09',
      [{ label: 'Rent (101-B)', amount: 13500, kind: 'rent' }, { label: 'Food — Veg', amount: 4500, kind: 'food' }],
      125, 13500, 10000, 'partial'),
    mkBill('b3', 't3', 'r3', '2026-09',
      [{ label: 'Rent (102)', amount: 21000, kind: 'rent' }],
      43, 21000, 0, 'pending'),
  ];

  const payments: Payment[] = [
    { id: 'pay1', tenantId: 't1', billId: 'b1', amount: 20500, method: 'UPI', date: '2026-09-05', note: 'September full payment', reference: 'UPI 512388123' },
    { id: 'pay2', tenantId: 't2', billId: 'b2', amount: 10000, method: 'Cash', date: '2026-09-08', note: 'Part payment — balance due', reference: '' },
  ];

  const mkReceipt = (id: string, number: string, payment: Payment, bill: Bill): Receipt => {
    const totals = billTotals(bill);
    const ratio = totals.total > 0 ? payment.amount / totals.total : 0;
    const taxable = Math.round(totals.taxable * ratio);
    const gstAmount = Math.round(totals.gstAmount * ratio);
    return {
      id,
      number,
      paymentId: payment.id,
      tenantId: payment.tenantId,
      billId: bill.id,
      amount: payment.amount,
      taxable,
      gstAmount,
      gstRate: bill.gstRate,
      zeroGst: bill.gstRate === 0,
      date: payment.date,
    };
  };

  const receipts: Receipt[] = [
    mkReceipt('rc1', 'R-2026-0001', payments[0], bills[0]),
    mkReceipt('rc2', 'R-2026-0002', payments[1], bills[1]),
  ];

  const readings: MeterReading[] = [
    { id: 'rd1', roomId: 'r1', date: '2026-08-31', units: 1240 },
    { id: 'rd2', roomId: 'r1', date: '2026-09-20', units: 1290 },
    { id: 'rd3', roomId: 'r2', date: '2026-08-31', units: 980 },
    { id: 'rd4', roomId: 'r2', date: '2026-09-20', units: 1015 },
    { id: 'rd5', roomId: 'r3', date: '2026-08-31', units: 460 },
    { id: 'rd6', roomId: 'r3', date: '2026-09-20', units: 520 },
  ];

  const docs: ComplianceDoc[] = [
    { id: 'd1', propertyId: 'p1', type: 'Trade Licence', number: 'GHMC/TL/2026/4419', issuedDate: '2026-03-01', expiryDate: '2026-12-31' },
    { id: 'd2', propertyId: 'p1', type: 'Fire NOC', number: 'GHMC/FIRE/2025/882', issuedDate: '2025-11-01', expiryDate: '2026-09-30' },
    { id: 'd3', propertyId: 'p1', type: 'FSSAI', number: 'FSSAI/TS/2025/22041', issuedDate: '2025-07-01', expiryDate: '2026-06-30' },
  ];

  const settings: Settings = { gstin: '36AAAAA0000A1Z5', electricityRate: 8.5 };

  return {
    properties,
    rooms,
    tenants,
    bills,
    payments,
    receipts,
    readings,
    foodPlans,
    docs,
    settings,
  };
}

function recalcBillStatus(bill: Bill): Pick<Bill, 'amountPaid' | 'status'> {
  const total = billTotals(bill).total;
  const status = bill.amountPaid <= 0 ? 'pending' : bill.amountPaid >= total ? 'paid' : 'partial';
  return { amountPaid: bill.amountPaid, status };
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...seed(),

      addProperty: (p) =>
        set((s) => ({ properties: [...s.properties, { ...p, id: uid() }] })),

      deleteProperty: (id) =>
        set((s) => {
          const roomIds = s.rooms.filter((r) => r.propertyId === id).map((r) => r.id);
          const tenantIds = s.tenants.filter((t) => roomIds.includes(t.roomId)).map((t) => t.id);
          return {
            properties: s.properties.filter((p) => p.id !== id),
            rooms: s.rooms.filter((r) => r.propertyId !== id),
            tenants: s.tenants.filter((t) => !tenantIds.includes(t.id)),
          };
        }),

      addRoom: (r) =>
        set((s) => ({ rooms: [...s.rooms, { ...r, id: uid(), status: 'vacant' as const }] })),

      deleteRoom: (id) =>
        set((s) => {
          const tenant = s.tenants.find((t) => t.roomId === id);
          return {
            rooms: s.rooms.filter((r) => r.id !== id),
            tenants: tenant ? s.tenants.filter((t) => t.id !== tenant.id) : s.tenants,
          };
        }),

      addTenant: (t) =>
        set((s) => {
          const id = uid();
          return {
            tenants: [...s.tenants, { ...t, id }],
            rooms: s.rooms.map((r) =>
              r.id === t.roomId ? { ...r, status: 'occupied' as const, tenantId: id } : r,
            ),
          };
        }),

      vacateRoom: (roomId) =>
        set((s) => {
          const tenant = s.tenants.find((t) => t.roomId === roomId);
          return {
            tenants: tenant ? s.tenants.filter((t) => t.id !== tenant.id) : s.tenants,
            rooms: s.rooms.map((r) =>
              r.id === roomId ? { ...r, status: 'vacant' as const, tenantId: undefined } : r,
            ),
          };
        }),

      generateBills: (period) => {
        const { rooms, tenants, bills, foodPlans } = get();
        let created = 0;
        const end = monthEndDate(period);
        const newBills: Bill[] = [];
        for (const room of rooms) {
          if (room.status !== 'occupied' || !room.tenantId) continue;
          const tenant = tenants.find((t) => t.id === room.tenantId);
          if (!tenant) continue;
          const exists = bills.some((b) => b.tenantId === tenant.id && b.period === period);
          if (exists) continue;
          const lines: Bill['lines'] = [{ label: `Rent (${room.name})`, amount: room.monthlyRent, kind: 'rent' }];
          if (tenant.hasFood && tenant.foodPlanId) {
            const plan = foodPlans.find((f) => f.id === tenant.foodPlanId);
            if (plan) lines.push({ label: `Food — ${plan.name}`, amount: plan.monthlyRate, kind: 'food' });
          }
          const stayDays = daysBetween(tenant.moveInDate, end);
          const rate = gstRate(room.monthlyRent, stayDays);
          newBills.push({
            id: uid(),
            tenantId: tenant.id,
            roomId: room.id,
            period,
            lines,
            gstRate: rate,
            stayDays,
            amountPaid: 0,
            status: 'pending',
            createdAt: new Date().toISOString(),
          });
          created += 1;
        }
        if (newBills.length) set((s) => ({ bills: [...s.bills, ...newBills] }));
        return created;
      },

      addLineToBill: (billId, label, amount, kind) =>
        set((s) => ({
          bills: s.bills.map((b) =>
            b.id === billId ? { ...b, lines: [...b.lines, { label, amount, kind }] } : b,
          ),
        })),

      removeLineFromBill: (billId, index) =>
        set((s) => ({
          bills: s.bills.map((b) =>
            b.id === billId ? { ...b, lines: b.lines.filter((_, i) => i !== index) } : b,
          ),
        })),

      recordPayment: (billId, amount, method, note) => {
        const { bills, receipts } = get();
        const bill = bills.find((b) => b.id === billId);
        if (!bill || amount <= 0) return;
        const payment: Payment = {
          id: uid(),
          tenantId: bill.tenantId,
          billId,
          amount,
          method,
          date: new Date().toISOString().slice(0, 10),
          note,
          reference: '',
        };
        const totals = billTotals(bill);
        const ratio = totals.total > 0 ? amount / totals.total : 0;
        const receipt: Receipt = {
          id: uid(),
          number: `R-${new Date().getFullYear()}-${String(receipts.length + 1).padStart(4, '0')}`,
          paymentId: payment.id,
          tenantId: bill.tenantId,
          billId: bill.id,
          amount,
          taxable: Math.round(totals.taxable * ratio),
          gstAmount: Math.round(totals.gstAmount * ratio),
          gstRate: bill.gstRate,
          zeroGst: bill.gstRate === 0,
          date: payment.date,
        };
        set((s) => ({
          payments: [...s.payments, payment],
          receipts: [...s.receipts, receipt],
          bills: s.bills.map((b) =>
            b.id === billId
              ? { ...b, ...recalcBillStatus({ ...b, amountPaid: b.amountPaid + amount }) }
              : b,
          ),
        }));
      },

      addReading: (roomId, units, date) =>
        set((s) => ({ readings: [...s.readings, { id: uid(), roomId, units, date }] })),

      addFoodPlan: (name, monthlyRate) =>
        set((s) => ({ foodPlans: [...s.foodPlans, { id: uid(), name, monthlyRate }] })),

      setTenantFood: (tenantId, hasFood, foodPlanId) =>
        set((s) => ({
          tenants: s.tenants.map((t) =>
            t.id === tenantId ? { ...t, hasFood, foodPlanId } : t,
          ),
        })),

      addDoc: (d) => set((s) => ({ docs: [...s.docs, { ...d, id: uid() }] })),

      deleteDoc: (id) => set((s) => ({ docs: s.docs.filter((d) => d.id !== id) })),

      setSettings: (partial) =>
        set((s) => ({ settings: { ...s.settings, ...partial } })),

      resetDemo: () => set(() => ({ ...seed() })),
    }),
    {
      name: 'kaupro-store-v1',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
