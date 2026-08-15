import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../services/api';

const schema = z.object({
  name: z.string().min(2, 'Goal name is required.'),
  target_amount: z.coerce.number().positive('Target must be positive.'),
  current_amount: z.coerce.number().min(0, 'Current amount cannot be negative.'),
  target_date: z.string().min(1, 'Target date is required.'),
});

function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const fetchGoals = async () => {
    try {
      const response = await api.get('/goals');
      setGoals(response.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const onSubmit = async (values) => {
    await api.post('/goals', values);
    reset();
    fetchGoals();
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Planning</p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Financial goals</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <h3 className="text-lg font-semibold">Create a goal</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Goal name</label>
              <input {...register('name')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" placeholder="Emergency Fund" />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Target amount</label>
              <input type="number" step="0.01" {...register('target_amount')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
              {errors.target_amount && <p className="mt-1 text-xs text-red-500">{errors.target_amount.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Current amount</label>
              <input type="number" step="0.01" {...register('current_amount')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
              {errors.current_amount && <p className="mt-1 text-xs text-red-500">{errors.current_amount.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Target date</label>
              <input type="date" {...register('target_date')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
              {errors.target_date && <p className="mt-1 text-xs text-red-500">{errors.target_date.message}</p>}
            </div>
            <button type="submit" className="w-full rounded-xl bg-slate-900 px-4 py-2.5 font-medium text-white">Save goal</button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <h3 className="text-lg font-semibold">Progress tracker</h3>
          {loading ? <p className="mt-4 text-slate-500">Loading goals...</p> : (
            <div className="mt-5 space-y-4">
              {goals.length === 0 ? <p className="text-slate-500">No goals yet. Create your first goal to start tracking progress.</p> : goals.map((goal) => {
                const progress = goal.target_amount > 0 ? Math.min((goal.current_amount / goal.target_amount) * 100, 100) : 0;
                const remaining = Math.max(goal.target_amount - goal.current_amount, 0);
                return (
                  <div key={goal.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-lg font-semibold">{goal.name}</p>
                      <p className="text-sm text-slate-500">{progress.toFixed(0)}% complete</p>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">₹{Number(goal.current_amount).toLocaleString()} / ₹{Number(goal.target_amount).toLocaleString()}</p>
                    <div className="mt-3 h-2.5 rounded-full bg-slate-200"><div className="h-2.5 rounded-full bg-emerald-500" style={{ width: `${progress}%` }} /></div>
                    <div className="mt-3 text-sm text-slate-500">₹{remaining.toLocaleString()} remaining</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GoalsPage;
