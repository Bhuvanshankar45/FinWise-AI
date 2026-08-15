import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function SettingsPage() {
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState({ currency: 'INR', theme: 'system', date_format: 'YYYY-MM-DD' });

  useEffect(() => {
    api.get('/settings').then((response) => setSettings(response.data)).catch(() => setSettings({ currency: 'INR', theme: 'system', date_format: 'YYYY-MM-DD' }));
  }, []);

  const updateSettings = async (next) => {
    const payload = { ...settings, ...next };
    setSettings(payload);
    await api.put('/settings', payload);
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Profile</p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Settings</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <h3 className="text-lg font-semibold">Profile</h3>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <p><span className="font-medium text-slate-700">Name:</span> {user?.name}</p>
            <p><span className="font-medium text-slate-700">Email:</span> {user?.email}</p>
            <p><span className="font-medium text-slate-700">Account created:</span> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <h3 className="text-lg font-semibold">Preferences</h3>
          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Currency</label>
              <select value={settings.currency} onChange={(e) => updateSettings({ currency: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Theme</label>
              <select value={settings.theme} onChange={(e) => updateSettings({ theme: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <option value="light">Light mode</option>
                <option value="dark">Dark mode</option>
                <option value="system">System theme</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Date format</label>
              <select value={settings.date_format} onChange={(e) => updateSettings({ date_format: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          <h3 className="text-lg font-semibold">Security</h3>
          <button type="button" onClick={logout} className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-2.5 font-medium text-white">Logout</button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
