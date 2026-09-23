import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { uid } from './utils';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface OwnerProfile {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  gstin: string;
  propertyName: string;
  address: string;
  pincode: string;
  photos: string[]; // downscaled data URLs
  location: { lat: number; lng: number } | null;
  locationText: string;
  verification: VerificationStatus;
  submittedAt: string;
}

export interface SignupInput {
  businessName: string;
  ownerName: string;
  phone: string;
  gstin: string;
  propertyName: string;
  address: string;
  pincode: string;
  photos: string[];
  location: { lat: number; lng: number } | null;
  locationText: string;
}

interface AuthState {
  accounts: OwnerProfile[];
  owner: OwnerProfile | null;
  signUp: (input: SignupInput) => OwnerProfile;
  loginByPhone: (phone: string) => boolean;
  logout: () => void;
  setVerification: (status: VerificationStatus) => void;
  demoLogin: () => void;
}

const DEMO_OWNER: OwnerProfile = {
  id: 'demo-owner',
  businessName: 'Sunrise PG',
  ownerName: 'Ravi Kumar',
  phone: '9000000000',
  gstin: '36AAAAA0000A1Z5',
  propertyName: 'Sunrise PG — Madhapur',
  address: 'Plot 12, Ayyappa Society, Madhapur, Hyderabad',
  pincode: '500081',
  photos: [],
  location: { lat: 17.4499, lng: 78.3802 },
  locationText: 'Madhapur, Hyderabad',
  verification: 'verified',
  submittedAt: '2026-09-01',
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      accounts: [DEMO_OWNER],
      owner: null,

      signUp: (input) => {
        const profile: OwnerProfile = {
          ...input,
          id: uid(),
          verification: 'pending',
          submittedAt: new Date().toISOString().slice(0, 10),
        };
        set((s) => ({ accounts: [...s.accounts, profile], owner: profile }));
        return profile;
      },

      loginByPhone: (phone) => {
        const account = get().accounts.find(
          (a) => a.phone.trim() === phone.trim() && phone.trim() !== '',
        );
        if (!account) return false;
        set({ owner: account });
        return true;
      },

      logout: () => set({ owner: null }),

      setVerification: (status) =>
        set((s) => ({
          owner: s.owner ? { ...s.owner, verification: status } : null,
          accounts: s.accounts.map((a) =>
            a.id === s.owner?.id ? { ...a, verification: status } : a,
          ),
        })),

      demoLogin: () => {
        const existing = get().accounts.find((a) => a.id === DEMO_OWNER.id);
        const account = existing ?? DEMO_OWNER;
        set({ owner: account });
      },
    }),
    {
      name: 'kaupro-auth',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
