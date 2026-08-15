import { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../services/api';
import StatCard from '../components/ui/StatCard';

function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [categories, setCategories] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/summary'),
      api.get('/analytics/trends'),
      api.get('/analytics/categories'),
      api.get('/insights'),
    ])
      .then(([summaryRes, trendsRes, categoriesRes, insightsRes]) => {
        setSummary(summaryRes.data);
        setTrends(trendsRes.data.monthly_data || []);
        setCategories(categoriesRes.data || []);
        setInsights(insightsRes.data || []);
      })
      .catch(() => {
        setSummary(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-slate-500">Loading dashboard...</div>;
  }

  const chartData = trends.map((item) => ({ name: item.period.slice(5), income: item.income, expenses: item.expense, savings: item.savings }));
  const donutData = categories.map((item) => ({ name: item.category, value: item.value }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Overview</p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Dashboard</h2>
        </div>
      </div>

      {summary ? (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            <StatCard title="Total Income" value={`₹${summary.total_income.toLocaleString()}`} change="Current" tone="neutral" />
            <StatCard title="Total Expenses" value={`₹${summary.total_expenses.toLocaleString()}`} change="Current" tone="warning" />
            <StatCard title="Current Savings" value={`₹${summary.current_savings.toLocaleString()}`} change="Current" tone="positive" />
            <StatCard title="Savings Rate" value={`${summary.savings_rate}%`} change="Current" tone="positive" />
            <StatCard title="Financial Health Score" value={`${summary.financial_health_score}/100`} change="Strong" tone="neutral" />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
              <p className="mb-4 text-lg font-semibold">Income vs expenses</p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="income" stroke="#0f172a" fill="#cbd5e1" />
                    <Area type="monotone" dataKey="expenses" stroke="#22c55e" fill="#bbf7d0" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
              <p className="mb-4 text-lg font-semibold">Expense distribution</p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie dataKey="value" innerRadius={60} outerRadius={90} data={donutData} fill="#16a34a" label />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
              <p className="mb-4 text-lg font-semibold">Monthly spending</p>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="expenses" fill="#0f172a" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
              <p className="mb-4 text-lg font-semibold">AI insights</p>
              <div className="space-y-3">
                {insights.map((insight) => (
                  <div key={insight.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">{insight.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{insight.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          No financial history yet. Add your first transaction to unlock dashboard analytics.
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
