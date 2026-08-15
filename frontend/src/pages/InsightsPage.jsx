import { useEffect, useState } from 'react';
import api from '../services/api';

function InsightsPage() {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    api.get('/insights').then((response) => setInsights(response.data || [])).catch(() => setInsights([]));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Intelligence</p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">AI insights</h2>
      </div>

      <div className="grid gap-4">
        {insights.length === 0 ? <p className="text-slate-500">Insights will appear as your financial data grows.</p> : insights.map((insight) => (
          <div key={insight.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">{insight.type}</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">{insight.title}</h3>
            <p className="mt-3 text-slate-600">{insight.description}</p>
            {insight.value && <p className="mt-3 text-sm font-medium text-slate-900">{insight.value}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default InsightsPage;
