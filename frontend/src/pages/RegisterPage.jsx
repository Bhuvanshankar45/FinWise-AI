import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  name: z.string().min(2, 'Name is required.'),
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});

function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setLoading(true);
    setError('');
    try {
      await registerUser({ name: values.name, email: values.email, password: values.password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to create your account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">F</div>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">Create your account</h1>
          <p className="mt-2 text-sm text-slate-600">Start understanding your money with FinWise AI.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
            <input {...register('name')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" placeholder="Jane Doe" />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input {...register('email')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" placeholder="you@example.com" />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
              <input type="password" {...register('password')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" placeholder="••••••••" />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Confirm password</label>
              <input type="password" {...register('confirmPassword')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" placeholder="••••••••" />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={loading} className="w-full rounded-xl bg-slate-900 px-4 py-2.5 font-medium text-white disabled:cursor-not-allowed disabled:opacity-75">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account? <Link to="/login" className="font-medium text-slate-900">Log in</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
