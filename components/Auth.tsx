import React, { useState, useMemo } from 'react';
import { signIn, signUp } from '../services/dataService';
import { Mail, Lock, Loader2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const greeting = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const totalMinutes = hour * 60 + minute;

    // 6 AM to 11:50 AM: Good Morning
    if (totalMinutes >= 360 && totalMinutes < 710) {
      return 'Good Morning';
    }
    // 11:50 AM to 5 PM (17:00): Good Afternoon
    if (totalMinutes >= 710 && totalMinutes < 1020) {
      return 'Good Afternoon';
    }
    // 5 PM (17:00) till 6 AM: Good Evening
    return 'Good Evening';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (authError) {
        setError(authError.message);
      } else if (!isLogin && data.user && !data.session) {
        setError("Account created! Please check your email for a confirmation link.");
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative w-full overflow-y-auto">
      {/* Background Blobs (Fixed for visual stability) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-400/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Main Responsive Content Container */}
      <div className="relative z-10 flex flex-col items-center w-full min-h-screen px-4 sm:px-8 py-8 sm:py-16">
        
        {/* Branding Header */}
        <div className="text-center mb-6 sm:mb-10 shrink-0">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-2xl shadow-2xl shadow-blue-500/20 mb-4 transition-transform hover:rotate-6">
            <span className="text-2xl sm:text-3xl font-black text-white">N</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase tracking-[0.2em]">NAVEXA</h1>
        </div>

        {/* Glassmorphic Auth Card */}
        <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-6 sm:p-10 border border-white">
          <div className="mb-6 sm:mb-8 text-center">
            {isLogin ? (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-1">
                  {greeting}
                </h2>
                <div className="text-3xl sm:text-4xl mb-3 animate-bounce-subtle">👋</div>
                <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed max-w-[200px] mx-auto">
                  Welcome back. Please sign in to continue.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-1">
                  Create Account
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                  Join the next generation of fleet management.
                </p>
              </>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {error && (
              <div className={`p-4 rounded-xl flex items-start gap-3 text-xs sm:text-sm animate-in fade-in ${error.includes('Confirmation') ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700'}`}>
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-500 transition-colors">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 sm:py-4 bg-slate-50/50 border border-slate-200 rounded-xl sm:rounded-2xl text-slate-900 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 sm:py-4 bg-slate-50/50 border border-slate-200 rounded-xl sm:rounded-2xl text-slate-900 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-xl shadow-blue-600/20 transition-all transform hover:scale-[1.01] hover:shadow-blue-500/30 active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <div className="flex items-center">
                  <span className="text-base sm:text-lg">{isLogin ? 'Sign In' : 'Get Started'}</span>
                  <ArrowRight size={18} className="ml-2" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 text-center pt-5 sm:pt-6 border-t border-slate-50">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs sm:text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors"
            >
              {isLogin ? "Need a workspace? Create account" : "Already registered? Sign in"}
            </button>
          </div>
        </div>

        {/* Pushes footer to bottom if screen is tall, otherwise remains in flow */}
        <div className="flex-grow min-h-[2rem]"></div>

        {/* Persistent Branding Footer - Scroll-safe position */}
        <footer className="w-full max-w-2xl py-8 px-6 flex flex-col items-center shrink-0">
          <div className="flex items-center space-x-4 sm:space-x-6 mb-3">
            <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-slate-300"></div>
            <p className="text-[8px] sm:text-[9px] uppercase font-[1000] tracking-[0.3em] text-slate-500 text-center">
              Strategically Directed & Managed by DEBANJAN
            </p>
            <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-slate-300"></div>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-300 opacity-80">
            <ShieldCheck size={10} />
            <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-[0.2em]">Enterprise Grade Security</span>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Auth;