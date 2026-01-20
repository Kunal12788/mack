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
    if (totalMinutes >= 360 && totalMinutes < 710) return 'Good Morning';
    if (totalMinutes >= 710 && totalMinutes < 1020) return 'Good Afternoon';
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
        setError("Account created! Please check your email.");
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-slate-50 w-full h-[100dvh] relative overflow-hidden font-sans">
      {/* Background Blobs - Scaled for Viewport */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[50vw] h-[50vw] bg-blue-500/5 rounded-full blur-[100px] animate-pulse-soft"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[40vw] h-[40vw] bg-amber-500/5 rounded-full blur-[100px] animate-pulse-soft"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-between w-full h-full p-4 sm:p-6 md:p-10 lg:p-12">
        
        {/* Responsive Branding Segment */}
        <header className="flex flex-col items-center shrink-0 mt-2 sm:mt-4">
          <div className="relative inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-slate-900 rounded-2xl shadow-xl transition-transform hover:scale-105 duration-500">
            <span className="text-xl sm:text-2xl font-black text-white">N</span>
            <div className="absolute -inset-2 bg-blue-600/10 blur-xl rounded-full"></div>
          </div>
          <h1 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-black text-slate-900 tracking-[0.3em] uppercase">NAVEXA</h1>
        </header>

        {/* Adaptive Hub Card - Scalable Paddings */}
        <main className="w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-white flex flex-col justify-center overflow-hidden transition-all duration-300 mx-auto">
          <div className="p-6 sm:p-8 md:p-10">
            <div className="mb-6 sm:mb-8 text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {isLogin ? greeting : "Join Hub"}
              </h2>
              <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] mt-1 opacity-60">
                {isLogin ? "Operational Terminal" : "Enterprise Config"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {error && (
                <div className="p-3 sm:p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-3 text-[10px] sm:text-xs text-rose-700 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-600 transition-colors">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 sm:py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl sm:rounded-2xl text-slate-900 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all outline-none"
                    placeholder="user@navexa.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Key</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-600 transition-colors">
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 sm:py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl sm:rounded-2xl text-slate-900 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 sm:h-14 flex items-center justify-center bg-slate-950 text-white font-black rounded-xl sm:rounded-2xl shadow-xl hover:bg-blue-600 transition-all transform active:scale-[0.97] disabled:opacity-70 group"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <div className="flex items-center text-xs sm:text-sm uppercase tracking-widest">
                    <span>{isLogin ? 'Access Session' : 'Create Profile'}</span>
                    <ArrowRight size={18} className="ml-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </form>

            <div className="mt-6 text-center pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-[9px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-[0.2em]"
              >
                {isLogin ? "Configure New Workspace" : "Return to Login"}
              </button>
            </div>
          </div>
        </main>

        {/* Global Scalable Footer */}
        <footer className="w-full flex flex-col items-center shrink-0 mb-2 sm:mb-4">
          <div className="flex items-center space-x-4 mb-4 opacity-40">
            <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-slate-900"></div>
            <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.4em] text-slate-900 text-center whitespace-nowrap">
              Strategically Managed by DEBANJAN
            </p>
            <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-slate-900"></div>
          </div>
          <div className="flex items-center justify-center gap-4 opacity-30">
             <ShieldCheck size={12} />
             <span className="text-[8px] font-black uppercase tracking-widest text-slate-900">Enterprise Protocol 2.5</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Auth;