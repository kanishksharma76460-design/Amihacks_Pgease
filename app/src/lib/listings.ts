export interface Review {
  name: string;
  text: string;
  rating: number;
}

export type Gender = 'boys' | 'girls' | 'coed';
export type TravelMode = 'walk' | 'bike' | 'car' | 'metro';

export interface PgListing {
  id: string;
  name: string;
  locality: string;
  city: string;
  lat: number;
  lng: number;
  gender: Gender;
  foodIncluded: boolean;
  ac: boolean;
  wifi: boolean;
  laundry: boolean;
  parking: boolean;
  prices: { single: number; double: number; triple: number };
  deposit: number;
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  verified: boolean;
  managed: boolean;
  compliance: { tradeLicence: boolean; fireNoc: boolean; fssai: boolean };
  description: string;
  amenities: string[];
  phone: string;
}

export interface Destination {
  id: string;
  label: string;
  sublabel: string;
  lat: number;
  lng: number;
  city: string;
}

export const DESTINATIONS: Destination[] = [
  { id: 'd1', label: 'Microsoft IDC', sublabel: 'Gachibowli', lat: 17.4401, lng: 78.3489, city: 'Hyderabad' },
  { id: 'd2', label: 'HITEC City', sublabel: 'Madhapur', lat: 17.4496, lng: 78.3807, city: 'Hyderabad' },
  { id: 'd3', label: 'Financial District', sublabel: 'Nanakramguda', lat: 17.414, lng: 78.3406, city: 'Hyderabad' },
  { id: 'd4', label: 'Cyber Towers', sublabel: 'HITEC City', lat: 17.4435, lng: 78.3772, city: 'Hyderabad' },
  { id: 'd5', label: 'JNTU Hyderabad', sublabel: 'Kukatpally', lat: 17.4932, lng: 78.3914, city: 'Hyderabad' },
  { id: 'd6', label: 'IIIT Hyderabad', sublabel: 'Gachibowli', lat: 17.4456, lng: 78.3497, city: 'Hyderabad' },
  { id: 'd7', label: 'University of Hyderabad', sublabel: 'Gachibowli', lat: 17.4557, lng: 78.3316, city: 'Hyderabad' },
  { id: 'd8', label: 'Ameerpet (coaching hub)', sublabel: 'Ameerpet', lat: 17.4375, lng: 78.4483, city: 'Hyderabad' },
  { id: 'd9', label: 'Secunderabad Station', sublabel: 'Secunderabad', lat: 17.4399, lng: 78.4983, city: 'Hyderabad' },
  { id: 'd10', label: 'RGIA Airport', sublabel: 'Shamshabad', lat: 17.2403, lng: 78.4294, city: 'Hyderabad' },
];

export const CITIES = ['Hyderabad', 'Bengaluru', 'Pune'];

function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(s));
}

export function distanceKm(listing: PgListing, dest: Destination | null): number | null {
  if (!dest || listing.city !== dest.city) return null;
  return haversineKm(listing.lat, listing.lng, dest.lat, dest.lng);
}

const SPEEDS: Record<TravelMode, number> = { walk: 4.5, bike: 22, car: 15, metro: 30 };

export function travelMinutes(km: number, mode: TravelMode): number {
  const mins = (km / SPEEDS[mode]) * 60 + (mode === 'metro' ? 8 : 0);
  return Math.max(1, Math.round(mins));
}

export function minPrice(l: PgListing): number {
  const vals = [l.prices.single, l.prices.double, l.prices.triple].filter((p) => p > 0);
  return vals.length ? Math.min(...vals) : 0;
}

const PALETTE: Array<[string, string]> = [
  ['#6366f1', '#8b5cf6'],
  ['#0ea5e9', '#6366f1'],
  ['#10b981', '#0ea5e9'],
  ['#f59e0b', '#ef4444'],
  ['#ec4899', '#8b5cf6'],
];

export function gradientFor(id: string): [string, string] {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export const LISTINGS: PgListing[] = [
  {
    id: 'pg-1', name: 'Sunrise PG — Madhapur', locality: 'Madhapur', city: 'Hyderabad',
    lat: 17.4502, lng: 78.3869, gender: 'coed', foodIncluded: true, ac: true, wifi: true, laundry: true, parking: true,
    prices: { single: 21000, double: 15000, triple: 0 }, deposit: 15000, rating: 4.6, reviewsCount: 132,
    reviews: [
      { name: 'Ankit S.', text: '5 min walk to HITEC City. Food is genuinely good and the owner is responsive.', rating: 5 },
      { name: 'Priya N.', text: 'Clean rooms, CCTV everywhere, zero deposit drama at checkout.', rating: 4 },
    ],
    verified: true, managed: true, compliance: { tradeLicence: true, fireNoc: true, fssai: true },
    description: 'A fully-managed PG in Ayyappa Society with AC rooms, in-house kitchen and a 5-minute walk to HITEC City.',
    amenities: ['Wi-Fi', 'AC', 'Meals', 'Laundry', 'CCTV', 'Parking', 'Power backup'],
    phone: '98480 12345',
  },
  {
    id: 'pg-2', name: 'Green Nest Co-living', locality: 'Gachibowli', city: 'Hyderabad',
    lat: 17.4399, lng: 78.3549, gender: 'coed', foodIncluded: true, ac: true, wifi: true, laundry: true, parking: false,
    prices: { single: 17500, double: 12500, triple: 9500 }, deposit: 12000, rating: 4.3, reviewsCount: 87,
    reviews: [{ name: 'Rohit M.', text: 'Great for Microsoft/Amazon folks — under 15 min to the campus.', rating: 4 }],
    verified: true, managed: false, compliance: { tradeLicence: true, fireNoc: false, fssai: true },
    description: 'Modern co-living near Gachibowli with shared workspaces and a rooftop lounge.',
    amenities: ['Wi-Fi', 'AC', 'Meals', 'Laundry', 'Gym', 'Rooftop'],
    phone: '91234 10001',
  },
  {
    id: 'pg-3', name: 'Zolo Vista', locality: 'Kondapur', city: 'Hyderabad',
    lat: 17.4646, lng: 78.3522, gender: 'coed', foodIncluded: true, ac: true, wifi: true, laundry: true, parking: true,
    prices: { single: 16500, double: 11500, triple: 9000 }, deposit: 11000, rating: 4.1, reviewsCount: 214,
    reviews: [{ name: 'Sneha K.', text: 'Housekeeping is weekly and consistent. Rent is fair for Kondapur.', rating: 4 }],
    verified: true, managed: false, compliance: { tradeLicence: true, fireNoc: true, fssai: true },
    description: 'Branded co-living with professional housekeeping and app-based support.',
    amenities: ['Wi-Fi', 'AC', 'Meals', 'Laundry', 'Housekeeping', 'Parking'],
    phone: '91234 10002',
  },
  {
    id: 'pg-4', name: 'Stanza Living — Financial District', locality: 'Financial District', city: 'Hyderabad',
    lat: 17.4172, lng: 78.344, gender: 'coed', foodIncluded: true, ac: true, wifi: true, laundry: true, parking: true,
    prices: { single: 19000, double: 13500, triple: 0 }, deposit: 13000, rating: 4.0, reviewsCount: 156,
    reviews: [{ name: 'Arjun V.', text: 'Pricier but zero hassle — walkable to the Financial District offices.', rating: 4 }],
    verified: true, managed: false, compliance: { tradeLicence: true, fireNoc: true, fssai: true },
    description: 'Premium managed living aimed at Financial District professionals.',
    amenities: ['Wi-Fi', 'AC', 'Meals', 'Laundry', 'Gym', 'Parking'],
    phone: '91234 10003',
  },
  {
    id: 'pg-5', name: 'Home Away Hostel', locality: 'HITEC City', city: 'Hyderabad',
    lat: 17.4486, lng: 78.3818, gender: 'boys', foodIncluded: false, ac: false, wifi: true, laundry: false, parking: false,
    prices: { single: 0, double: 8000, triple: 6500 }, deposit: 8000, rating: 3.7, reviewsCount: 43,
    reviews: [{ name: 'Karthik R.', text: 'Cheapest near HITEC City but no food — you eat out.', rating: 3 }],
    verified: false, managed: false, compliance: { tradeLicence: false, fireNoc: false, fssai: false },
    description: 'Budget boys hostel near HITEC City. No meals, shared bathrooms.',
    amenities: ['Wi-Fi', 'CCTV'],
    phone: '91234 10004',
  },
  {
    id: 'pg-6', name: 'Serene Stay PG', locality: 'Ameerpet', city: 'Hyderabad',
    lat: 17.438, lng: 78.4477, gender: 'coed', foodIncluded: true, ac: false, wifi: true, laundry: true, parking: false,
    prices: { single: 9500, double: 7500, triple: 6000 }, deposit: 7000, rating: 3.9, reviewsCount: 61,
    reviews: [{ name: 'Vikram P.', text: 'Walking distance to coaching centres — perfect for exam prep.', rating: 4 }],
    verified: true, managed: false, compliance: { tradeLicence: true, fireNoc: false, fssai: true },
    description: 'Ameerpet coaching-hub favourite — affordable triple sharing with home food.',
    amenities: ['Wi-Fi', 'Meals', 'Laundry', 'Study room'],
    phone: '91234 10005',
  },
  {
    id: 'pg-7', name: 'Prime Living PG', locality: 'Kukatpally', city: 'Hyderabad',
    lat: 17.489, lng: 78.403, gender: 'coed', foodIncluded: true, ac: true, wifi: true, laundry: true, parking: true,
    prices: { single: 11000, double: 8500, triple: 7000 }, deposit: 8000, rating: 4.2, reviewsCount: 78,
    reviews: [{ name: 'Divya T.', text: 'Near JNTU and the metro — very convenient.', rating: 4 }],
    verified: true, managed: false, compliance: { tradeLicence: true, fireNoc: true, fssai: true },
    description: 'Well-maintained PG near JNTU and KPHB metro with AC and meals.',
    amenities: ['Wi-Fi', 'AC', 'Meals', 'Laundry', 'Parking'],
    phone: '91234 10006',
  },
  {
    id: 'pg-8', name: 'Student Nest', locality: 'Gachibowli', city: 'Hyderabad',
    lat: 17.4473, lng: 78.3522, gender: 'coed', foodIncluded: true, ac: false, wifi: true, laundry: false, parking: false,
    prices: { single: 9000, double: 7000, triple: 5500 }, deposit: 7000, rating: 3.8, reviewsCount: 52,
    reviews: [{ name: 'Nithin B.', text: 'Basic but cheap and close to IIIT-H.', rating: 4 }],
    verified: false, managed: false, compliance: { tradeLicence: true, fireNoc: false, fssai: false },
    description: 'No-frills student accommodation near IIIT-H and the University of Hyderabad.',
    amenities: ['Wi-Fi', 'Meals', 'Study room'],
    phone: '91234 10007',
  },
  {
    id: 'pg-9', name: 'Lotus Women’s Hostel', locality: 'Madhapur', city: 'Hyderabad',
    lat: 17.4526, lng: 78.3856, gender: 'girls', foodIncluded: true, ac: true, wifi: true, laundry: true, parking: false,
    prices: { single: 15000, double: 11000, triple: 0 }, deposit: 12000, rating: 4.5, reviewsCount: 95,
    reviews: [{ name: 'Megha A.', text: 'Safe, clean, 24/7 guard. Staff background-checked.', rating: 5 }],
    verified: true, managed: false, compliance: { tradeLicence: true, fireNoc: true, fssai: true },
    description: 'Women-only hostel with 24/7 security, biometric entry and home-style food.',
    amenities: ['Wi-Fi', 'AC', 'Meals', 'Laundry', '24/7 guard', 'CCTV'],
    phone: '91234 10008',
  },
  {
    id: 'pg-10', name: 'Maple Leaf PG', locality: 'Kondapur', city: 'Hyderabad',
    lat: 17.467, lng: 78.356, gender: 'coed', foodIncluded: true, ac: false, wifi: true, laundry: true, parking: true,
    prices: { single: 10000, double: 8000, triple: 6500 }, deposit: 8000, rating: 3.9, reviewsCount: 34,
    reviews: [{ name: 'Sumanth G.', text: 'Decent rooms, food could be better.', rating: 3 }],
    verified: true, managed: false, compliance: { tradeLicence: true, fireNoc: true, fssai: true },
    description: 'Family-run PG in Kondapur with home-cooked meals and parking.',
    amenities: ['Wi-Fi', 'Meals', 'Laundry', 'Parking'],
    phone: '91234 10009',
  },
  {
    id: 'pg-11', name: 'Metro Stay', locality: 'Kukatpally', city: 'Hyderabad',
    lat: 17.4917, lng: 78.3944, gender: 'boys', foodIncluded: false, ac: false, wifi: true, laundry: false, parking: false,
    prices: { single: 7000, double: 5500, triple: 4500 }, deposit: 5000, rating: 3.5, reviewsCount: 22,
    reviews: [{ name: 'Praveen K.', text: '2 min from KPHB metro. Bare bones but cheap.', rating: 3 }],
    verified: false, managed: false, compliance: { tradeLicence: false, fireNoc: false, fssai: false },
    description: 'Budget boys hostel right next to KPHB metro station.',
    amenities: ['Wi-Fi'],
    phone: '91234 10010',
  },
  {
    id: 'pg-12', name: 'Elite Boys Hostel', locality: 'Ameerpet', city: 'Hyderabad',
    lat: 17.436, lng: 78.446, gender: 'boys', foodIncluded: true, ac: false, wifi: true, laundry: true, parking: false,
    prices: { single: 8500, double: 6500, triple: 5500 }, deposit: 6000, rating: 3.8, reviewsCount: 40,
    reviews: [{ name: 'Ravi T.', text: 'Good for long-term exam prep stays.', rating: 4 }],
    verified: true, managed: false, compliance: { tradeLicence: true, fireNoc: false, fssai: true },
    description: 'Boys hostel near Ameerpet coaching centres with meals and laundry.',
    amenities: ['Wi-Fi', 'Meals', 'Laundry', 'Study room'],
    phone: '91234 10011',
  },
  {
    id: 'pg-13', name: 'Tulip Residency', locality: 'HITEC City', city: 'Hyderabad',
    lat: 17.447, lng: 78.3779, gender: 'coed', foodIncluded: true, ac: true, wifi: true, laundry: true, parking: true,
    prices: { single: 18000, double: 13000, triple: 0 }, deposit: 13000, rating: 4.4, reviewsCount: 118,
    reviews: [{ name: 'Ishita M.', text: 'Premium, walk to Cyber Towers. Worth it if your office is here.', rating: 5 }],
    verified: true, managed: false, compliance: { tradeLicence: true, fireNoc: true, fssai: true },
    description: 'Upscale AC co-living steps from Cyber Towers and HITEC City.',
    amenities: ['Wi-Fi', 'AC', 'Meals', 'Laundry', 'Gym', 'Parking'],
    phone: '91234 10012',
  },
  {
    id: 'pg-14', name: 'Akshara PG', locality: 'Manikonda', city: 'Hyderabad',
    lat: 17.4025, lng: 78.3815, gender: 'coed', foodIncluded: true, ac: false, wifi: true, laundry: false, parking: true,
    prices: { single: 9000, double: 7000, triple: 6000 }, deposit: 7000, rating: 3.6, reviewsCount: 18,
    reviews: [{ name: 'Sai P.', text: 'Affordable for the Manikonda side.', rating: 3 }],
    verified: false, managed: false, compliance: { tradeLicence: true, fireNoc: false, fssai: true },
    description: 'Simple, affordable PG in Manikonda with meals and parking.',
    amenities: ['Wi-Fi', 'Meals', 'Parking'],
    phone: '91234 10013',
  },
  {
    id: 'pg-15', name: 'Nivas Ladies Hostel', locality: 'Gachibowli', city: 'Hyderabad',
    lat: 17.443, lng: 78.358, gender: 'girls', foodIncluded: true, ac: true, wifi: true, laundry: true, parking: false,
    prices: { single: 16000, double: 12000, triple: 0 }, deposit: 12000, rating: 4.6, reviewsCount: 71,
    reviews: [{ name: 'Ananya S.', text: 'Very safe, warden on site, great for working women.', rating: 5 }],
    verified: true, managed: false, compliance: { tradeLicence: true, fireNoc: true, fssai: true },
    description: 'Working-women hostel near Gachibowli with warden, CCTV and biometric entry.',
    amenities: ['Wi-Fi', 'AC', 'Meals', 'Laundry', 'Warden', 'CCTV'],
    phone: '91234 10014',
  },
  {
    id: 'pg-16', name: 'Campus Hub', locality: 'Lingampally', city: 'Hyderabad',
    lat: 17.4868, lng: 78.3418, gender: 'coed', foodIncluded: true, ac: false, wifi: true, laundry: false, parking: true,
    prices: { single: 8000, double: 6000, triple: 5000 }, deposit: 6000, rating: 3.7, reviewsCount: 26,
    reviews: [{ name: 'Harsha V.', text: 'Good for students near Lingampally railway.', rating: 4 }],
    verified: false, managed: false, compliance: { tradeLicence: true, fireNoc: false, fssai: false },
    description: 'Student-focused PG near Lingampally with meals and open parking.',
    amenities: ['Wi-Fi', 'Meals', 'Parking'],
    phone: '91234 10015',
  },
  {
    id: 'pg-17', name: 'Ivy Stay', locality: 'Miyapur', city: 'Hyderabad',
    lat: 17.5012, lng: 78.3654, gender: 'coed', foodIncluded: true, ac: true, wifi: true, laundry: true, parking: true,
    prices: { single: 10000, double: 7500, triple: 6000 }, deposit: 7000, rating: 4.0, reviewsCount: 33,
    reviews: [{ name: 'Lakshmi R.', text: 'Value for money on the Miyapur side of the metro.', rating: 4 }],
    verified: true, managed: false, compliance: { tradeLicence: true, fireNoc: true, fssai: true },
    description: 'AC rooms near Miyapur metro with meals, laundry and parking.',
    amenities: ['Wi-Fi', 'AC', 'Meals', 'Laundry', 'Parking'],
    phone: '91234 10016',
  },
  {
    id: 'pg-18', name: 'Sai Residency', locality: 'Uppal', city: 'Hyderabad',
    lat: 17.4086, lng: 78.5594, gender: 'boys', foodIncluded: false, ac: false, wifi: true, laundry: false, parking: false,
    prices: { single: 7000, double: 5500, triple: 4500 }, deposit: 5000, rating: 3.4, reviewsCount: 15,
    reviews: [{ name: 'Manoj K.', text: 'Cheap, near Uppal metro. No food.', rating: 3 }],
    verified: false, managed: false, compliance: { tradeLicence: false, fireNoc: false, fssai: false },
    description: 'Budget boys PG near Uppal, no meals, shared bathrooms.',
    amenities: ['Wi-Fi'],
    phone: '91234 10017',
  },
  {
    id: 'pg-19', name: 'Blossom Co-living', locality: 'Koramangala', city: 'Bengaluru',
    lat: 12.9352, lng: 77.6245, gender: 'coed', foodIncluded: true, ac: true, wifi: true, laundry: true, parking: false,
    prices: { single: 22000, double: 16000, triple: 11000 }, deposit: 16000, rating: 4.3, reviewsCount: 190,
    reviews: [{ name: 'Aditi G.', text: 'Koramangala is pricey but this is decent for the area.', rating: 4 }],
    verified: true, managed: false, compliance: { tradeLicence: true, fireNoc: true, fssai: true },
    description: 'Managed co-living in Koramangala, popular with startup folks.',
    amenities: ['Wi-Fi', 'AC', 'Meals', 'Laundry'],
    phone: '91234 10018',
  },
  {
    id: 'pg-20', name: 'Metro Nest', locality: 'HSR Layout', city: 'Bengaluru',
    lat: 12.9121, lng: 77.6446, gender: 'coed', foodIncluded: true, ac: false, wifi: true, laundry: true, parking: true,
    prices: { single: 14000, double: 10000, triple: 8000 }, deposit: 10000, rating: 4.1, reviewsCount: 77,
    reviews: [{ name: 'Deepak N.', text: 'HSR is quiet and well-connected. Good food.', rating: 4 }],
    verified: true, managed: false, compliance: { tradeLicence: true, fireNoc: false, fssai: true },
    description: 'Comfortable PG in HSR Layout with meals and parking.',
    amenities: ['Wi-Fi', 'Meals', 'Laundry', 'Parking'],
    phone: '91234 10019',
  },
  {
    id: 'pg-21', name: 'Hinjewadi Hub', locality: 'Hinjewadi', city: 'Pune',
    lat: 18.5913, lng: 73.7389, gender: 'coed', foodIncluded: true, ac: true, wifi: true, laundry: true, parking: true,
    prices: { single: 17000, double: 12000, triple: 9000 }, deposit: 12000, rating: 4.2, reviewsCount: 140,
    reviews: [{ name: 'Siddharth J.', text: "IT folks' first choice in Hinjewadi Phase 1.", rating: 4 }],
    verified: true, managed: false, compliance: { tradeLicence: true, fireNoc: true, fssai: true },
    description: 'IT-focused co-living near Hinjewadi Phase 1 with AC and meals.',
    amenities: ['Wi-Fi', 'AC', 'Meals', 'Laundry', 'Parking'],
    phone: '91234 10020',
  },
  {
    id: 'pg-22', name: 'Kharadi Stay', locality: 'Kharadi', city: 'Pune',
    lat: 18.5544, lng: 73.9401, gender: 'coed', foodIncluded: true, ac: false, wifi: true, laundry: false, parking: true,
    prices: { single: 12000, double: 9000, triple: 7000 }, deposit: 9000, rating: 3.9, reviewsCount: 55,
    reviews: [{ name: 'Pooja D.', text: 'Near EON IT Park, affordable for Kharadi.', rating: 4 }],
    verified: false, managed: false, compliance: { tradeLicence: true, fireNoc: false, fssai: true },
    description: 'Affordable PG near EON IT Park in Kharadi.',
    amenities: ['Wi-Fi', 'Meals', 'Parking'],
    phone: '91234 10021',
  },
];
