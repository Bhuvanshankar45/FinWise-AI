import { ArrowRight, CheckCircle2, ChevronRight, ShieldCheck, Sparkles, Target, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  { title: 'Smart cash flow analysis', description: 'Track income, expenses, and saving habits in real time.' },
  { title: 'Financial goal planning', description: 'Set realistic targets and monitor progress with live milestones.' },
  { title: 'AI-powered projections', description: 'Estimate short and long-term savings outcomes using transparent models.' },
  { title: 'Risk education', description: 'Understand your financial positioning without one-size-fits-all advice.' },
];

const steps = ['Connect your data', 'Analyze trends', 'Predict future progress', 'Plan with confidence'];

function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="mx-auto max-w-7xl px-6 py-6">
        <nav className="flex items-center justify-between rounded-full border border-slate-200 bg-white/80 px-5 py-3 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">F</div>
            <span className="text-lg font-semibold tracking-tight">FinWise AI</span>
          </div>
          <div className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#security">Security</a>
            <a href="#about">About</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="rounded-full px-4 py-2 text-sm font-medium text-slate-700">Login</Link>
            <Link to="/register" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm">Get Started</Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              <Sparkles size={16} />
              AI-powered personal finance intelligence
            </div>
            <h1 className="max-w-xl text-5xl font-semibold leading-tight tracking-tight text-slate-900">
              Turn Your Financial Data Into Smarter Decisions.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-600">
              FinWise AI helps you understand spending patterns, monitor savings progress, and plan with confidence using transparent analytics and accessible forecasting.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/register" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 font-medium text-white shadow-soft">
                Get Started <ArrowRight size={18} />
              </Link>
              <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 font-medium text-slate-700">
                Explore Dashboard <ChevronRight size={18} />
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-soft">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Portfolio overview</p>
                  <p className="text-2xl font-semibold">₹2,34,000</p>
                </div>
                <div className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">+12.4%</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Income</div>
                  <div className="mt-2 text-lg font-semibold">₹84,000</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Expenses</div>
                  <div className="mt-2 text-lg font-semibold">₹48,300</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Savings</div>
                  <div className="mt-2 text-lg font-semibold">₹35,700</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Health</div>
                  <div className="mt-2 text-lg font-semibold">82/100</div>
                </div>
              </div>
              <div className="mt-5 rounded-xl bg-gradient-to-r from-slate-100 to-emerald-50 p-4">
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                  <span>Goal progress</span>
                  <span>42% complete</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-200">
                  <div className="h-2.5 w-[42%] rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">Why FinWise AI?</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">Clarity for modern money decisions</h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">
                    <TrendingUp size={22} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">How It Works</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">From raw transactions to practical decisions</h2>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-lg font-medium text-slate-700">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center gap-4">
                <div className="rounded-full border border-slate-200 bg-slate-50 px-5 py-3">{step}</div>
                {index < steps.length - 1 && <ChevronRight className="text-slate-400" />}
              </div>
            ))}
          </div>
        </section>

        <section id="security" className="bg-slate-900 py-20 text-white">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">Security & Privacy</p>
              <h2 className="mt-4 text-3xl font-semibold">Your financial data stays protected.</h2>
              <p className="mt-5 max-w-lg text-slate-300">
                We use secure password hashing, JWT-based authentication, and controlled access so every user sees only their own records.
              </p>
            </div>
            <div className="grid gap-4">
              {[
                'Encrypted authentication flows',
                'User-scoped records and protected routes',
                'Transparent explanation of score and insights',
              ].map((point) => (
                <div key={point} className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-800 p-4">
                  <CheckCircle2 className="text-emerald-400" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-6">
              <Target className="mb-4 text-emerald-600" />
              <h3 className="text-lg font-semibold">Goal-driven planning</h3>
              <p className="mt-2 text-sm text-slate-600">Track milestone progress across emergency funds, education, travel, and major purchases.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6">
              <ShieldCheck className="mb-4 text-emerald-600" />
              <h3 className="text-lg font-semibold">Educational insights</h3>
              <p className="mt-2 text-sm text-slate-600">Every recommendation is based on your actual financial history and patterns rather than generic advice.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-6">
              <Sparkles className="mb-4 text-emerald-600" />
              <h3 className="text-lg font-semibold">Future visibility</h3>
              <p className="mt-2 text-sm text-slate-600">Understand expected savings momentum and identify what may need attention before long-term goals drift.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-20">
          <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-soft">
            <h3 className="text-2xl font-semibold">Frequently asked questions</h3>
            <div className="mt-8 space-y-4 text-sm text-slate-300">
              <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
                <strong className="text-white">Does FinWise AI provide financial advice?</strong>
                <p className="mt-2">It offers educational insights and analytical projections only. It does not provide guaranteed returns or investment recommendations.</p>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4">
                <strong className="text-white">How are predictions generated?</strong>
                <p className="mt-2">The platform trains and compares models using your recorded financial data and exposes the actual performance metrics behind the projected trend.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <span>© 2026 FinWise AI</span>
          <span>Educational financial insights only</span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
