import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../services/api';
import EmptyState from '../components/ui/EmptyState';

const schema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.coerce.number().positive('Amount must be greater than zero.'),
  category: z.string().min(1, 'Category is required.'),
  description: z.string().min(2, 'Description is required.'),
  transaction_date: z.string().min(1, 'Date is required.'),
});

const categories = ['Food', 'Housing', 'Transportation', 'Education', 'Healthcare', 'Bills', 'Shopping', 'Entertainment', 'Other'];

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: { type: 'expense', category: 'Food', transaction_date: new Date().toISOString().slice(0, 10) } });

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const onSubmit = async (values) => {
    await api.post('/transactions', values);
    reset();
    fetchTransactions();
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this transaction?')) return;
    await api.delete(`/transactions/${id}`);
    fetchTransactions();
  };

  const total = useMemo(() => transactions.reduce((sum, item) => sum + (item.type === 'income' ? item.amount : -item.amount), 0), [transactions]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Financial data</p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Transactions</h2>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">Net cash flow: ₹{total.toLocaleString()}</div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <h3 className="text-lg font-semibold">Add transaction</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
              <select {...register('type')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Amount</label>
              <input type="number" step="0.01" {...register('amount')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
              {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
              <select {...register('category')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
              <input {...register('description')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" placeholder="Grocery store" />
              {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Date</label>
              <input type="date" {...register('transaction_date')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
              {errors.transaction_date && <p className="mt-1 text-xs text-red-500">{errors.transaction_date.message}</p>}
            </div>
            <button type="submit" className="w-full rounded-xl bg-slate-900 px-4 py-2.5 font-medium text-white">Save transaction</button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <h3 className="text-lg font-semibold">Recent activity</h3>
          {loading ? <p className="mt-4 text-slate-500">Loading transactions...</p> : transactions.length === 0 ? <div className="mt-6"><EmptyState title="No transactions yet" description="Add your first transaction to begin tracking your cash flow." actionLabel="Add your first transaction" onAction={() => document.querySelector('input[name="description"]').focus()} /></div> : (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="px-4 py-3">{tx.transaction_date}</td>
                      <td className="px-4 py-3">{tx.description}</td>
                      <td className="px-4 py-3">{tx.category}</td>
                      <td className="px-4 py-3 capitalize">{tx.type}</td>
                      <td className={`px-4 py-3 font-medium ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-600'}`}>₹{Number(tx.amount).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <button type="button" onClick={() => onDelete(tx.id)} className="text-red-600 hover:text-red-700">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionsPage;
