export type RoomType = 'single' | 'double' | 'triple';
export type RoomStatus = 'vacant' | 'occupied';
export type PaymentMethod = 'UPI' | 'Cash' | 'Bank Transfer';
export type BillStatus = 'pending' | 'partial' | 'paid';
export type BillLineKind = 'rent' | 'food' | 'electricity' | 'misc';

export interface Property {
  id: string;
  name: string;
  address: string;
  ownerName: string;
  phone: string;
}

export interface Room {
  id: string;
  propertyId: string;
  name: string;
  type: RoomType;
  ac: boolean;
  monthlyRent: number;
  deposit: number;
  status: RoomStatus;
  tenantId?: string;
}

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  idProof: string;
  roomId: string;
  moveInDate: string; // YYYY-MM-DD
  depositPaid: number;
  hasFood: boolean;
  foodPlanId?: string;
}

export interface BillLine {
  label: string;
  amount: number;
  kind: BillLineKind;
}

export interface Bill {
  id: string;
  tenantId: string;
  roomId: string;
  period: string; // YYYY-MM
  lines: BillLine[];
  gstRate: number; // 0 | 0.12
  stayDays: number;
  amountPaid: number;
  status: BillStatus;
  createdAt: string;
}

export interface Payment {
  id: string;
  tenantId: string;
  billId?: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  note: string;
  reference: string;
}

export interface Receipt {
  id: string;
  number: string;
  paymentId: string;
  tenantId: string;
  billId?: string;
  amount: number;
  taxable: number;
  gstAmount: number;
  gstRate: number;
  zeroGst: boolean;
  date: string;
}

export interface MeterReading {
  id: string;
  roomId: string;
  date: string;
  units: number; // cumulative meter reading
}

export interface FoodPlan {
  id: string;
  name: string;
  monthlyRate: number;
}

export type DocType = 'Trade Licence' | 'Fire NOC' | 'FSSAI' | 'Police Form-A';

export interface ComplianceDoc {
  id: string;
  propertyId: string;
  type: DocType;
  number: string;
  issuedDate: string;
  expiryDate: string;
}

export interface Settings {
  gstin: string;
  electricityRate: number;
}
