function StatCard({ title, value, change, tone = 'neutral' }) {
  const toneClasses = {
    neutral: 'bg-white text-slate-900',
    positive: 'bg-emerald-50 text-emerald-900',
    warning: 'bg-amber-50 text-amber-900',
    danger: 'bg-rose-50 text-rose-900',
  };

  return (
    <div className={`rounded-2xl border border-slate-200 p-5 shadow-soft ${toneClasses[tone]}`}>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        {change && (
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

export default StatCard;
