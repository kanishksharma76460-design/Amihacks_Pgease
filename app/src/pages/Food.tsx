import { useState } from 'react';
import { Plus, Utensils } from 'lucide-react';
import { useStore } from '../lib/store';
import { Badge, Button, Card, EmptyState, Field, inputClass, Modal, PageHeader } from '../components/ui';
import { inr } from '../lib/utils';

export default function Food() {
  const foodPlans = useStore((s) => s.foodPlans);
  const tenants = useStore((s) => s.tenants);
  const addFoodPlan = useStore((s) => s.addFoodPlan);
  const setTenantFood = useStore((s) => s.setTenantFood);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [rate, setRate] = useState('');

  const submit = () => {
    const r = Number(rate);
    if (!name.trim() || !Number.isFinite(r) || r <= 0) return;
    addFoodPlan(name.trim(), r);
    setName('');
    setRate('');
    setOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Food & Meal Plans"
        subtitle="Define plans and assign them to tenants — billed automatically"
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus size={16} /> Add plan
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Plans</h2>
          {foodPlans.length === 0 ? (
            <EmptyState title="No meal plans" />
          ) : (
            <div className="space-y-3">
              {foodPlans.map((f) => (
                <Card key={f.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Utensils size={18} className="text-indigo-500 dark:text-indigo-400" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{f.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{inr(f.monthlyRate)} / month</p>
                    </div>
                  </div>
                  <Badge tone="indigo">
                    {tenants.filter((t) => t.foodPlanId === f.id && t.hasFood).length} tenants
                  </Badge>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Tenant assignments</h2>
          <Card className="divide-y divide-slate-100 dark:divide-slate-800">
            {tenants.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">{t.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.hasFood ? 'Has meal plan' : 'No meal plan'}
                  </p>
                </div>
                <select
                  className="max-w-[150px] rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  value={t.hasFood ? t.foodPlanId : ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTenantFood(t.id, val !== '', val !== '' ? val : undefined);
                  }}
                >
                  <option value="">No food</option>
                  {foodPlans.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} — {inr(f.monthlyRate)}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </Card>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add meal plan"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit}>Save plan</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Field label="Plan name">
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Veg / Non-Veg / Jain"
            />
          </Field>
          <Field label="Monthly rate (₹)">
            <input
              className={inputClass}
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="4500"
            />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
