import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { uid } from './utils';

export interface Lead {
  id: string;
  pgName: string;
  tenantName: string;
  phone: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted';
}

interface LeadsState {
  leads: Lead[];
  addLead: (l: Omit<Lead, 'id' | 'createdAt' | 'status'>) => void;
  markContacted: (id: string) => void;
  deleteLead: (id: string) => void;
  clearAll: () => void;
}

export const useLeads = create<LeadsState>()(
  persist(
    (set) => ({
      leads: [],
      addLead: (l) =>
        set((s) => ({
          leads: [
            { ...l, id: uid(), status: 'new', createdAt: new Date().toISOString().slice(0, 10) },
            ...s.leads,
          ],
        })),
      markContacted: (id) =>
        set((s) => ({
          leads: s.leads.map((l) => (l.id === id ? { ...l, status: 'contacted' } : l)),
        })),
      deleteLead: (id) => set((s) => ({ leads: s.leads.filter((l) => l.id !== id) })),
      clearAll: () => set({ leads: [] }),
    }),
    {
      name: 'kaupro-leads',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
