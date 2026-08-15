import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../services/api';

const schema = z.object({
  monthly_income: z.coerce.number().min(0),
  monthly_expenses: z.coerce.number().min(0),
  current_savings: z.coerce.number().min(0),
  monthly_savings: z.coerce.number().min(0),
  historical_savings: z.string().default(''),
  goal_amount: z.coerce.number().min(0).optional(),
  time_period: z.coerce.number().min(3).max(24).optional(),
});

function SavingsPage() {
  const [projection, setProjection] = useState(null);
  const { register, handleSubmit } = useForm({ resolver: zodResolver(schema), defaultValues: { monthly_income: 25000, monthly_expenses: 14000, current_savings: 15000, monthly_savings: 11000, historical_savings: '12000,11000,9800,14000', goal_amount: 100000, time_period: 12 } });

  const onSubmit = async (values) => {
    const parsedNumbers = (values.historical_savings || '').split(',').map((item) => Number(item.trim())).filter(Boolean);
    const response = await api.post('/predictions/savings', { ...values, historical_savings: parsedNumbers });
    setProjection(response.data);
  };

  const chartData = projection ? [
    { name: 'Actual', value: 10000 },
    { name: '3M', value: projection.prediction['3_month'] },
    { name: '6M', value: projection.prediction['6_month'] },
    { name: '12M', value: projection.prediction['12_month'] },
  ] : [];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Planning</p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Savings intelligence</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Monthly income</label>
            <input type="number" {...register('monthly_income')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Monthly expenses</label>
            <input type="number" {...register('monthly_expenses')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Current savings</label>
            <input type="number" {...register('current_savings')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Monthly savings</label>
            <input type="number" {...register('monthly_savings')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Historical savings</label>
            <input {...register('historical_savings')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
          </div>
          <button type="submit" className="w-full rounded-xl bg-slate-900 px-4 py-2.5 font-medium text-white">Generate forecast</button>
        </form>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          {projection ? (
            <>
              <p className="text-lg font-semibold">Projected savings</p>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line dataKey="value" stroke="#0f172a" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-3"><p className="text-sm text-slate-500">3 months</p><p className="mt-2 text-xl font-semibold">₹{projection.prediction['3_month'].toLocaleString()}</p></div>
                <div className="rounded-2xl bg-slate-50 p-3"><p className="text-sm text-slate-500">6 months</p><p className="mt-2 text-xl font-semibold">₹{projection.prediction['6_month'].toLocaleString()}</p></div>
                <div className="rounded-2xl bg-slate-50 p-3"><p className="text-sm text-slate-500">12 months</p><p className="mt-2 text-xl font-semibold">₹{projection.prediction['12_month'].toLocaleString()}</p></div>
              </div>
            </>
          ) : (
            <p className="text-slate-500">Enter your inputs to generate a savings projection with actual model inference.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SavingsPage;
