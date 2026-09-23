import type { Bill, BillLineKind } from './types';

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function inr(n: number): string {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

export function currentMonthKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function periodLabel(key: string): string {
  const [y, m] = key.split('-').map(Number);
  if (!y || !m) return key;
  return new Date(y, m - 1, 1).toLocaleDateString('en-IN', {
    month: 'short',
    year: 'numeric',
  });
}

export function monthEndDate(key: string): Date {
  const [y, m] = key.split('-').map(Number);
  return new Date(y, m, 0); // last day of the month
}

/** Whole days between an ISO date string and a target date (>= 1). */
export function daysBetween(startIso: string, end: Date): number {
  const start = new Date(startIso + 'T00:00:00');
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.round(ms / 86400000));
}

/** GST rate for a PG stay. 0 if exempt under Entry 12AA, else 12% (SAC 9963). */
export function gstRate(rentPerPerson: number, stayDays: number): number {
  return rentPerPerson <= 20000 && stayDays >= 90 ? 0 : 0.12;
}

export function gstNote(rate: number): string {
  return rate === 0
    ? 'GST exempt — Entry 12AA, Notification 12/2017-CT(R): continuous stay ≥ 90 days and rent ≤ ₹20,000/person/month.'
    : 'GST @ 12% — SAC 9963 (commercial lodging): applies when stay < 90 days or rent > ₹20,000/person/month.';
}

export interface BillTotals {
  taxable: number;
  electricity: number;
  gstAmount: number;
  total: number;
}

/** Electricity is treated as a pass-through (no GST); rent/food/misc are taxable. */
export function billTotals(bill: Bill): BillTotals {
  let taxable = 0;
  let electricity = 0;
  for (const line of bill.lines) {
    if (line.kind === 'electricity') electricity += line.amount;
    else taxable += line.amount;
  }
  const gstAmount = Math.round(taxable * bill.gstRate);
  return { taxable, electricity, gstAmount, total: taxable + electricity + gstAmount };
}

export function lineKindLabel(kind: BillLineKind): string {
  switch (kind) {
    case 'rent':
      return 'Rent';
    case 'food':
      return 'Food';
    case 'electricity':
      return 'Electricity';
    case 'misc':
      return 'Other';
  }
}

export function daysUntil(isoDate: string): number {
  const d = new Date(isoDate + 'T00:00:00');
  return Math.round((d.getTime() - new Date().getTime()) / 86400000);
}
