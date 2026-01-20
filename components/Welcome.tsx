import React, { useEffect } from 'react';
import { ArrowRight, Zap, ChevronRight, Globe, ShieldCheck, Activity } from 'lucide-react';

interface WelcomeProps {
  onGetStarted: () => void;
  isExiting: boolean;
}

const Welcome: React.FC<WelcomeProps> = ({ onGetStarted, isExiting }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onGetStarted();
    }, 2000); // Exactly 2 seconds of display time
    return () => clearTimeout(timer);
  }, [onGetStarted]);

  return (
    <div className={`relative min-h-screen bg-[#fafafa] transition-opacity duration-[1500ms] cubic-bezier(0.2, 0.8, 0.2, 1) flex flex-col selection:bg-blue-100 overflow-x-hidden ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* Dynamic Enterprise Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Tech Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23000' stroke-width='1'%3E%3Cpath d='M36 34v-1h-2v1h-1v2h1v1h2v-1h1v-2zm0 0h1v1h-1v-1zm10-6v-1h-2v1h-1v2h1v1h2v-1h1v-2zm0 0h1v1h-1v-1zm-6-10v-1h-2v1h-1v2h1v1h2v-1h1v-2zm0 0h1v1h-1v-1zM9 25v-1H7v1H6v2h1v1h2v-1h1v-2zm0 0h1v1H9v-1zM0 15v-1h2v1H1v2h1v1H0v-1h-1v-2zm0 0h1v1H0v-1zm10 10v-1h2v1h-1v2h1v1h10v-1h1v-2zm0 0h1v1h-1v-1zm10 0v-1h2v1h-1v2h1v1h10v-1h1v-2zm0 0h1v1h-1v-1zM40 5v-1h2v1h-1v2h1v1H40v-1h-1v-2zm0 0h1v1h-1v-1zM30 45v-1h2v1h-1v2h1v1H30v-1h-1v-2zm0 0h1v1h-1v-1zM20 35v-1h2v1h-1v2h1v1H20v-1h-1v-2zm0 0h1v1h-1v-1zM10 45v-1h2v1h-1v2h1v1H10v-1h-1v-2zm0 0h1v1h-1v-1zM40 25v-1h2v1h-1v2h1v1H40v-1h-1v-2zm0 0h1v1h-1v-1zM90 15v-1h2v1h-1v2h1v1H90v-1h-1v-2zm0 0h1v1h-1v-1zM80 5v-1h2v1h-1v2h1v1H80v-1h-1v-2zm0 0h1v1h-1v-1z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
        
        {/* Animated Blobs with Soft Glow */}
        <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] bg-blue-100/30 rounded-full blur-[140px] animate-float"></div>
        <div className="absolute top-[10%] -right-[15%] w-[50vw] h-[50vw] bg-indigo-50/40 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-3s' }}></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[45vw] h-[45vw] bg-blue-50/50 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-6s' }}></div>
      </div>

      {/* Floating Navigation */}
      <nav className="relative z-50 w-full max-w-7xl mx-auto px-6 md:px-12 py-8 flex items-center justify-between animate-fadeIn shrink-0">
        <div className="flex items-center space-x-4 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center border border-white/10 shadow-2xl group-hover:scale-105 transition-transform duration-500">
              <span className="font-black text-white text-2xl tracking-tighter">N</span>
            </div>
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-2xl font-[1000] tracking-tighter text-slate-950 uppercase">NAVEXA</span>
            <span className="text-[10px] font-black tracking-[0.4em] text-blue-600 uppercase">Enterprise</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="hidden lg:flex items-center space-x-2 text-slate-400">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Encrypted Session</span>
          </div>
          <button 
            onClick={onGetStarted}
            className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-black text-slate-900 uppercase tracking-widest hover:border-blue-500 hover:text-blue-600 hover:shadow-xl transition-all active:scale-95"
          >
            <span>Log In</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center max-w-7xl mx-auto w-full">
        <div className="max-w-5xl w-full flex flex-col items-center">
          
          {/* Status Badge */}
          <div 
            className="inline-flex items-center space-x-3 bg-white/60 backdrop-blur-xl border border-white text-slate-900 px-6 py-2.5 rounded-full mb-8 shadow-2xl shadow-blue-900/5 animate-slideUpFade"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
            <span className="text-[11px] font-[900] uppercase tracking-[0.3em]">Operational Readiness v2.5</span>
          </div>

          {/* Epic Headline */}
          <h1 
            className="text-[42px] sm:text-[64px] md:text-[88px] lg:text-[104px] font-[1000] text-slate-950 tracking-[-0.05em] leading-[0.95] animate-slideUpFade"
            style={{ animationDelay: '0.3s' }}
          >
            Managing Travel <br className="hidden sm:block" />
            With <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-700">Digital Mastery.</span>
          </h1>

          {/* Professional Narrative */}
          <p 
            className="mt-8 md:mt-12 text-lg sm:text-xl text-slate-500 max-w-2xl leading-relaxed font-medium animate-slideUpFade px-4 opacity-80"
            style={{ animationDelay: '0.5s' }}
          >
            The centralized ecosystem for high-performance travel firms. <br className="hidden md:block" />
            Automate logistics, optimize payouts, and dominate profitability.
          </p>

          {/* High-Impact CTAs */}
          <div 
            className="mt-12 md:mt-16 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 animate-slideUpFade w-full sm:w-auto"
            style={{ animationDelay: '0.7s' }}
          >
            <button 
              onClick={onGetStarted}
              className="group relative w-full sm:w-auto flex items-center justify-center bg-slate-950 text-white px-10 md:px-16 py-5 md:py-6 rounded-3xl font-[900] text-lg md:text-xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_25px_50px_rgba(37,99,235,0.25)] hover:bg-blue-600 transition-all transform hover:scale-[1.04] active:scale-[0.98] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <span className="relative z-10 flex items-center uppercase tracking-widest text-sm md:text-base">
                Initialize Dashboard
                <ArrowRight size={22} className="ml-4 group-hover:translate-x-2 transition-transform" />
              </span>
            </button>
            
            {/* Professional Trust Bar */}
            <div className="flex items-center space-x-8 px-8 py-4 bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/60 shadow-lg">
              <div className="flex flex-col items-center">
                  <div className="flex items-center space-x-1.5 text-blue-600 mb-0.5">
                    <Globe size={14} />
                    <span className="text-lg font-black tracking-tight">24/7</span>
                  </div>
                  <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Global Support</span>
              </div>
              <div className="w-[1px] h-10 bg-slate-200"></div>
              <div className="flex flex-col items-center">
                  <div className="flex items-center space-x-1.5 text-emerald-600 mb-0.5">
                    <Activity size={14} />
                    <span className="text-lg font-black tracking-tight">99.9%</span>
                  </div>
                  <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Core Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Signature Corporate Footer */}
      <footer 
        className="relative z-10 w-full py-16 px-6 flex flex-col items-center animate-fadeIn shrink-0"
        style={{ animationDelay: '1.2s' }}
      >
        <div className="w-full max-w-4xl flex flex-col items-center">
          <div className="flex items-center space-x-6 mb-8 opacity-40">
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-slate-400"></div>
            <p className="text-[11px] uppercase font-[1000] tracking-[0.4em] text-slate-900 whitespace-nowrap">
              Strategically Directed & Managed by DEBANJAN
            </p>
            <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-slate-400"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full text-center">
             <div className="space-y-1">
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">System Architect</span>
                <span className="block text-sm font-bold text-blue-600">Kunal</span>
             </div>
             <div className="space-y-1">
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Executive Director</span>
                <span className="block text-sm font-bold text-slate-900">BANJO</span>
             </div>
             <div className="space-y-1">
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Legal Compliance</span>
                <span className="block text-sm font-bold text-slate-900">Navexa Enterprise</span>
             </div>
          </div>
          
          <p className="mt-12 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            © 2025 NAVEXA OPERATIONS. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
};

export default Welcome;