import { useEffect, useState } from 'react';
import api from '../services/api';

function ReportsPage() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    api.get('/reports').then((response) => setReport(response.data)).catch(() => setReport(null));
  }, []);

  const downloadPdf = async () => {
    const response = await api.post('/reports/generate', { period: 'last_6_months' }, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'finwise-report.pdf';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Reporting</p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Reports</h2>
      </div>

      {report ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-slate-500">User summary</p>
              <h3 className="mt-2 text-2xl font-semibold">{report.user_name}</h3>
            </div>
            <button onClick={downloadPdf} className="rounded-xl bg-slate-900 px-4 py-2.5 font-medium text-white">Download PDF Report</button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm text-slate-500">Income</p><p className="mt-2 text-xl font-semibold">₹{report.summary.total_income.toLocaleString()}</p></div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm text-slate-500">Expenses</p><p className="mt-2 text-xl font-semibold">₹{report.summary.total_expenses.toLocaleString()}</p></div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm text-slate-500">Savings</p><p className="mt-2 text-xl font-semibold">₹{report.summary.current_savings.toLocaleString()}</p></div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm text-slate-500">Health</p><p className="mt-2 text-xl font-semibold">{report.summary.financial_health_score}/100</p></div>
          </div>
          <p className="mt-6 text-sm text-slate-600">{report.disclaimer}</p>
        </div>
      ) : (
        <p className="text-slate-500">Report data is not available yet.</p>
      )}
    </div>
  );
}

export default ReportsPage;
