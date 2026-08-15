import { Bell, ChevronDown, CreditCard, Goal, LayoutGrid, LogOut, Moon, PiggyBank, ShieldCheck, Sparkles, TrendingUp, Wallet } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navGroups = [
  { label: 'Overview', items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutGrid }] },
  { label: 'Financial Data', items: [{ to: '/transactions', label: 'Transactions', icon: CreditCard }, { to: '/analytics', label: 'Analytics', icon: TrendingUp }] },
  { label: 'Planning', items: [{ to: '/savings', label: 'Savings Intelligence', icon: PiggyBank }, { to: '/goals', label: 'Financial Goals', icon: Goal }] },
  { label: 'Intelligence', items: [{ to: '/risk', label: 'Risk Assessment', icon: ShieldCheck }, { to: '/insights', label: 'AI Insights', icon: Sparkles }] },
  { label: 'Reporting', items: [{ to: '/reports', label: 'Reports', icon: Wallet }] },
];

function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-slate-950 text-slate-200 md:block">
          <div className="flex items-center justify-center border-b border-slate-800 p-6">
            <div className="text-lg font-semibold tracking-[0.24em] text-white">FINWISE AI</div>
          </div>
          <nav className="space-y-6 p-5">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">{group.label}</p>
                <div className="space-y-1">
                  {group.items.map(({ to, label, icon: Icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}`}
                    >
                      <Icon size={16} />
                      {label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          <div className="mt-6 border-t border-slate-800 p-5">
            <div className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-slate-800">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-white">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
              <span>{user?.name || 'User'}</span>
            </div>
            <NavLink to="/settings" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-slate-800">
              <Moon size={16} />
              Settings
            </NavLink>
            <button type="button" onClick={logout} className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Application</p>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Financial intelligence</h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 md:flex">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  INR
                </div>
                <button type="button" className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-700">
                  <Bell size={18} />
                </button>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
                  <span className="hidden sm:block">{user?.name || 'User'}</span>
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </header>
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppShell;
