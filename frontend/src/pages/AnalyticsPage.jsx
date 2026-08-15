import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../services/api';

const colors = ['#0f172a', '#22c55e', '#f59e0b', '#06b6d4', '#a78bfa', '#f97316'];

function AnalyticsPage() {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [monthly, setMonthly] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/summary'),
      api.get('/analytics/categories'),
      api.get('/analytics/trends'),
    ]).then(([summaryRes, categoriesRes, trendsRes]) => {
      setSummary(summaryRes.data);
      setCategories(categoriesRes.data || []);
      setMonthly(trendsRes.data.monthly_data || []);
    });
  }, []);

  if (!summary) {
    return <div className="text-slate-500">Loading analytics...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Insights</p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Analytics</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft"><p className="text-sm text-slate-500">Avg Monthly Income</p><p className="mt-2 text-2xl font-semibold">₹{(summary.total_income / Math.max(monthly.length || 1, 1)).toLocaleString()}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft"><p className="text-sm text-slate-500">Avg Monthly Expense</p><p className="mt-2 text-2xl font-semibold">₹{(summary.total_expenses / Math.max(monthly.length || 1, 1)).toLocaleString()}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft"><p className="text-sm text-slate-500">Avg Savings</p><p className="mt-2 text-2xl font-semibold">₹{(summary.current_savings / Math.max(monthly.length || 1, 1)).toLocaleString()}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft"><p className="text-sm text-slate-500">Savings Rate</p><p className="mt-2 text-2xl font-semibold">{summary.savings_rate}%</p></div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <p className="mb-4 text-lg font-semibold">Category analysis</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {categories.map((entry, index) => <Cell key={entry.category} fill={colors[index % colors.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <p className="mb-4 text-lg font-semibold">Savings trend</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categories} dataKey="value" nameKey="category" outerRadius={90} label>
                  {categories.map((entry, index) => <Cell key={entry.category} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
