function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
      <p className="text-lg font-semibold text-slate-700">{title}</p>
      <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
