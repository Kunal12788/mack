import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Map, 
  Settings, 
  Menu, 
  X,
  LogOut,
  ChevronRight,
  UserCircle
} from 'lucide-react';
import { signOut } from '../services/dataService';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  userEmail?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, userEmail }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSignOut = async () => {
    await signOut();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'trips', label: 'Trips', icon: <Map size={20} /> },
    { id: 'vehicles', label: 'Fleet', icon: <Car size={20} /> },
  ];

  return (
    <div className="flex h-[100dvh] bg-slate-50 overflow-hidden font-sans">
      {/* Dynamic Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden animate-fadeIn"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Auto-Adaptive Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-[70] w-full max-w-[280px] bg-slate-950 text-white transform transition-transform duration-500 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0 flex flex-col shrink-0 border-r border-white/5 shadow-2xl lg:shadow-none
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between h-20 px-8 bg-slate-950/50 border-b border-white/5">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-xl shadow-blue-600/20">
              <span className="font-black text-white text-lg">N</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-white">NAVEXA</span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-slate-500 hover:text-white p-2 transition-colors">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Operations Hub</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setIsSidebarOpen(false);
              }}
              className={`
                group flex items-center w-full px-4 py-3.5 text-sm font-bold rounded-xl transition-all duration-300
                ${activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                  : 'text-slate-500 hover:bg-white/5 hover:text-white'}
              `}
            >
              <span className={`mr-3 transition-colors ${activeTab === item.id ? 'text-white' : 'text-slate-600 group-hover:text-white'}`}>
                {item.icon}
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              {activeTab === item.id && <ChevronRight size={14} className="animate-pulse" />}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 bg-slate-900/30">
          <div className="flex items-center p-3 mb-4 rounded-xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400 shrink-0">
              <UserCircle size={22} />
            </div>
            <div className="ml-3 min-w-0">
              <p className="text-[10px] font-black text-white uppercase tracking-wider truncate">Operator</p>
              <p className="text-[9px] text-slate-500 font-bold truncate">{userEmail || 'Administrator'}</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-3 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-rose-400 transition-all rounded-xl"
          >
            <LogOut size={14} className="mr-3" />
            Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Fluid Content Container */}
      <div className="flex flex-col flex-1 w-full min-w-0 overflow-hidden">
        {/* Responsive Header */}
        <header className="flex lg:hidden items-center justify-between h-16 px-6 bg-white border-b border-slate-200 z-50 shrink-0">
            <button onClick={toggleSidebar} className="text-slate-600 hover:text-slate-900 p-2 -ml-2 rounded-xl transition-colors active:scale-95">
              <Menu size={24} />
            </button>
            <div className="flex items-center space-x-2">
               <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-white text-xs">N</span>
               </div>
               <span className="font-black text-slate-900 tracking-tighter text-lg uppercase">Navexa</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs">
              {userEmail?.[0].toUpperCase() || 'A'}
            </div>
        </header>

        {/* Fluid Scroll Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="max-w-screen-2xl mx-auto w-full p-4 sm:p-6 md:p-10 lg:p-12 transition-all">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;