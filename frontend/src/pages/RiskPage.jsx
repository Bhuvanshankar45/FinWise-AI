import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../services/api';

const schema = z.object({
  income_stability: z.coerce.number().min(1).max(5),
  savings_consistency: z.coerce.number().min(1).max(5),
  emergency_savings: z.coerce.number().min(1).max(5),
  time_horizon: z.coerce.number().min(1).max(5),
  financial_experience: z.coerce.number().min(1).max(5),
  market_fluctuation_response: z.coerce.number().min(1).max(5),
});

function RiskPage() {
  const [latest, setLatest] = useState(null);
  const { register, handleSubmit } = useForm({ resolver: zodResolver(schema), defaultValues: { income_stability: 3, savings_consistency: 3, emergency_savings: 3, time_horizon: 3, financial_experience: 3, market_fluctuation_response: 3 } });

  const fetchLatest = async () => {
    const response = await api.get('/risk/latest');
    setLatest(response.data);
  };

  useEffect(() => {
    fetchLatest();
  }, []);

  const onSubmit = async (values) => {
    const response = await api.post('/risk/assessment', values);
    setLatest(response.data);
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Intelligence</p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Risk assessment</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft space-y-4">
          {Object.entries({ income_stability: 'Income stability', savings_consistency: 'Savings consistency', emergency_savings: 'Emergency savings', time_horizon: 'Financial time horizon', financial_experience: 'Financial experience', market_fluctuation_response: 'Response to market fluctuations' }).map(([field, label]) => (
            <div key={field}>
              <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
              <input type="range" min="1" max="5" step="1" {...register(field)} className="w-full" />
            </div>
          ))}
          <button type="submit" className="w-full rounded-xl bg-slate-900 px-4 py-2.5 font-medium text-white">Calculate score</button>
        </form>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          {latest ? (
            <>
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Latest assessment</p>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-5xl font-semibold text-slate-900">{latest.score}</span>
                <span className="text-sm text-slate-500">/ 100</span>
              </div>
              <p className="mt-3 text-xl font-medium text-slate-800">{latest.category}</p>
              <p className="mt-4 text-sm text-slate-600">This score is educational and reflects your current responses. It is not a recommendation for any specific investment product or guaranteed return.</p>
            </>
          ) : (
            <p className="text-slate-500">Complete the assessment to see a financial risk category.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RiskPage;
