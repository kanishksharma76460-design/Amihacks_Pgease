import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ImagePlus,
  MapPin,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { Badge, Button, Card, Field, inputClass } from '../components/ui';
import Logo from '../components/Logo';
import { cx } from '../lib/utils';

const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const PHONE_RE = /^[6-9]\d{9}$/;
const PIN_RE = /^\d{6}$/;

const STEPS = ['Owner', 'Property', 'Verification', 'Review'];

function downscale(file: File, maxDim = 1000): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Login() {
  const navigate = useNavigate();
  const signUp = useAuth((s) => s.signUp);
  const loginByPhone = useAuth((s) => s.loginByPhone);
  const demoLogin = useAuth((s) => s.demoLogin);
  const owner = useAuth((s) => s.owner);

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [step, setStep] = useState(0);
  const [signinPhone, setSigninPhone] = useState('');
  const [signinError, setSigninError] = useState('');

  const [form, setForm] = useState({
    businessName: '',
    ownerName: '',
    phone: '',
    propertyName: '',
    address: '',
    pincode: '',
    gstin: '',
    photos: [] as string[],
    location: null as { lat: number; lng: number } | null,
    locationText: '',
  });

  if (owner) return <Navigate to="/dashboard" replace />;

  const gstValid = GSTIN_RE.test(form.gstin.toUpperCase());
  const phoneValid = PHONE_RE.test(form.phone);
  const pinValid = PIN_RE.test(form.pincode);

  const stepValid = [
    form.businessName.trim() !== '' && form.ownerName.trim() !== '' && phoneValid,
    form.propertyName.trim() !== '' && form.address.trim() !== '' && pinValid,
    gstValid && form.photos.length >= 1,
    true,
  ][step];

  const addPhotos = async (files: FileList | null) => {
    if (!files) return;
    const incoming = Array.from(files).slice(0, 3 - form.photos.length);
    const dataUrls: string[] = [];
    for (const f of incoming) {
      try {
        dataUrls.push(await downscale(f));
      } catch {
        /* skip unreadable file */
      }
    }
    setForm((s) => ({ ...s, photos: [...s.photos, ...dataUrls] }));
  };

  const detectLocation = () => {
    if (!('geolocation' in navigator)) {
      setForm((s) => ({ ...s, locationText: 'Geolocation not supported — address will be used.' }));
      return;
    }
    setForm((s) => ({ ...s, locationText: 'Detecting…' }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setForm((s) => ({
          ...s,
          location: { lat, lng },
          locationText: `Detected: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        }));
      },
      () =>
        setForm((s) => ({
          ...s,
          locationText: 'Location permission denied — address will be used.',
        })),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const submit = () => {
    signUp({
      businessName: form.businessName.trim(),
      ownerName: form.ownerName.trim(),
      phone: form.phone,
      gstin: form.gstin.toUpperCase(),
      propertyName: form.propertyName.trim(),
      address: form.address.trim(),
      pincode: form.pincode,
      photos: form.photos,
      location: form.location,
      locationText: form.locationText || 'Not captured',
    });
    navigate('/dashboard');
  };

  const doSignIn = () => {
    if (loginByPhone(signinPhone)) {
      navigate('/dashboard');
    } else {
      setSigninError('No account found with this phone. Create an account, or try the demo owner.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-4">
      <div className="w-full max-w-lg">
        <div className="mb-6 flex items-center justify-center gap-2.5 text-white">
          <Logo size={34} />
          <span className="text-xl font-semibold tracking-tight">PGease</span>
        </div>

        <Card className="p-6">
          {mode === 'signin' ? (
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Owner sign in
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Enter your registered phone number.
              </p>
              <div className="mt-4 space-y-3">
                <Field label="Phone number">
                  <input
                    className={inputClass}
                    value={signinPhone}
                    onChange={(e) => setSigninPhone(e.target.value)}
                    placeholder="9000000000"
                    inputMode="numeric"
                  />
                </Field>
                {signinError ? (
                  <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-400">
                    {signinError}
                  </p>
                ) : null}
                <Button className="w-full" onClick={doSignIn}>
                  Sign in
                </Button>
                <div className="text-center text-xs text-slate-400">
                  Demo owner phone: <span className="font-mono">9000000000</span>
                </div>
                <Button variant="secondary" className="w-full" onClick={() => { demoLogin(); navigate('/dashboard'); }}>
                  Explore with demo owner
                </Button>
                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                  New here?{' '}
                  <button
                    className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                    onClick={() => { setMode('signup'); setStep(0); }}
                  >
                    Create an account
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Verify your property
                </h1>
                <button
                  onClick={() => setMode('signin')}
                  className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Sign in instead
                </button>
              </div>

              {/* Progress */}
              <div className="mt-4 flex items-center gap-1">
                {STEPS.map((label, i) => (
                  <div key={label} className="flex flex-1 flex-col gap-1">
                    <div
                      className={cx(
                        'h-1.5 rounded-full',
                        i <= step ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700',
                      )}
                    />
                    <span
                      className={cx(
                        'text-[10px] font-medium',
                        i <= step ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400',
                      )}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-3">
                {step === 0 && (
                  <>
                    <Field label="Business / PG name">
                      <input
                        className={inputClass}
                        value={form.businessName}
                        onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                        placeholder="Sunrise PG"
                      />
                    </Field>
                    <Field label="Owner name">
                      <input
                        className={inputClass}
                        value={form.ownerName}
                        onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                        placeholder="Ravi Kumar"
                      />
                    </Field>
                    <Field label="Phone (for OTP)">
                      <input
                        className={inputClass}
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="9000000000"
                        inputMode="numeric"
                      />
                      {form.phone && !phoneValid ? (
                        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                          Enter a valid 10-digit mobile number.
                        </p>
                      ) : null}
                    </Field>
                  </>
                )}

                {step === 1 && (
                  <>
                    <Field label="Property name">
                      <input
                        className={inputClass}
                        value={form.propertyName}
                        onChange={(e) => setForm({ ...form, propertyName: e.target.value })}
                        placeholder="Sunrise PG — Madhapur"
                      />
                    </Field>
                    <Field label="Full address">
                      <input
                        className={inputClass}
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        placeholder="Plot 12, Ayyappa Society, Madhapur, Hyderabad"
                      />
                    </Field>
                    <Field label="PIN code">
                      <input
                        className={inputClass}
                        value={form.pincode}
                        onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                        placeholder="500081"
                        inputMode="numeric"
                      />
                      {form.pincode && !pinValid ? (
                        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                          6-digit PIN code required.
                        </p>
                      ) : null}
                    </Field>
                  </>
                )}

                {step === 2 && (
                  <>
                    <Field label="GSTIN">
                      <input
                        className={inputClass}
                        value={form.gstin}
                        onChange={(e) => setForm({ ...form, gstin: e.target.value.toUpperCase() })}
                        placeholder="36AAAAA0000A1Z5"
                      />
                      {form.gstin && (
                        <p
                          className={cx(
                            'mt-1 flex items-center gap-1 text-xs',
                            gstValid
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400',
                          )}
                        >
                          {gstValid ? <Check size={12} /> : <X size={12} />}
                          {gstValid
                            ? 'Valid GSTIN format.'
                            : 'Invalid GSTIN — expected 15 characters (e.g. 36AAAAA0000A1Z5).'}
                        </p>
                      )}
                    </Field>

                    <div>
                      <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Property photos ({form.photos.length}/3)
                      </span>
                      <label
                        htmlFor="photo-upload"
                        className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 px-4 py-6 text-center text-slate-500 hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-400"
                      >
                        <ImagePlus size={22} />
                        <span className="text-sm">Tap to add photos of the building & rooms</span>
                      </label>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          void addPhotos(e.target.files);
                          e.target.value = '';
                        }}
                      />
                      {form.photos.length > 0 ? (
                        <div className="mt-2 flex gap-2">
                          {form.photos.map((p, i) => (
                            <img
                              key={i}
                              src={p}
                              alt={`Photo ${i + 1}`}
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                          ))}
                        </div>
                      ) : null}
                    </div>

                    <div>
                      <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Property location
                      </span>
                      <Button variant="secondary" onClick={detectLocation}>
                        <MapPin size={15} /> Detect my location
                      </Button>
                      {form.locationText ? (
                        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                          {form.locationText}
                        </p>
                      ) : null}
                    </div>
                  </>
                )}

                {step === 3 && (
                  <div className="space-y-2 rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800/60">
                    <SummaryRow label="Business" value={form.businessName} />
                    <SummaryRow label="Owner" value={form.ownerName} />
                    <SummaryRow label="Phone" value={form.phone} />
                    <SummaryRow label="Property" value={form.propertyName} />
                    <SummaryRow label="Address" value={`${form.address}, ${form.pincode}`} />
                    <SummaryRow label="GSTIN" value={form.gstin.toUpperCase()} />
                    <SummaryRow label="Photos" value={`${form.photos.length} uploaded`} />
                    <SummaryRow label="Location" value={form.locationText || 'Not captured'} />
                    <p className="flex items-start gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
                      <ShieldCheck size={14} className="mt-0.5 shrink-0 text-indigo-500" />
                      Your GST, photos and location are submitted for review. Listings go live only
                      after verification to prevent fraud.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <Button
                  variant="ghost"
                  disabled={step === 0}
                  onClick={() => setStep((s) => s - 1)}
                >
                  <ArrowLeft size={15} /> Back
                </Button>
                {step < 3 ? (
                  <Button disabled={!stepValid} onClick={() => setStep((s) => s + 1)}>
                    Continue <ArrowRight size={15} />
                  </Button>
                ) : (
                  <Button onClick={submit}>
                    <ShieldCheck size={15} /> Submit for verification
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>

        <p className="mt-4 text-center text-xs text-white/70">
          A fraud-prevention onboarding flow — GST + photos + GPS location, verified before listing.
        </p>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="shrink-0 text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-right font-medium text-slate-900 dark:text-slate-100">{value}</span>
    </div>
  );
}
