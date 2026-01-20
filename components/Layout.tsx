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
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans selection:bg-blue-100">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40 lg:hidden transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-white transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0 shadow-2xl lg:shadow-none flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-20 px-8 bg-slate-950/50 border-b border-slate-800/50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <span className="font-black text-white text-lg">N</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-white">NAVEXA</span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-lg transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Operations</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setIsSidebarOpen(false);
              }}
              className={`
                group flex items-center w-full px-4 py-3.5 text-sm font-bold rounded-xl transition-all duration-200
                ${activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 scale-[1.02]' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white hover:pl-5'}
              `}
            >
              <span className={`mr-3 transition-colors ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
                {item.icon}
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              {activeTab === item.id && <ChevronRight size={14} className="text-blue-200 animate-pulse" />}
            </button>
          ))}
        </nav>

        {/* User Profile / Footer */}
        <div className="p-6 border-t border-slate-800/50 bg-slate-900/30">
          <div className="flex items-center p-3 mb-4 rounded-xl bg-slate-900/50 border border-slate-800/50">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
              <UserCircle size={22} />
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-xs font-black text-white uppercase tracking-wider truncate">Administrator</p>
              <p className="text-[10px] text-slate-500 truncate font-medium">{userEmail || 'User'}</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-3 text-xs font-bold text-slate-500 hover:text-rose-400 hover:bg-rose-400/5 rounded-xl transition-all duration-200"
          >
            <LogOut size={16} className="mr-3" />
            End Session
          </button>
        </div>
      </aside>

      {/* Main Content Area - Optimized for wide screens */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden bg-slate-50/50">
        <header className="flex items-center justify-between h-16 px-6 bg-white/80 backdrop-blur-md border-b border-slate-200/60 lg:hidden z-30 shrink-0">
            <div className="flex items-center">
                <button 
                  onClick={toggleSidebar} 
                  className="text-slate-600 hover:text-slate-900 focus:outline-none p-2 rounded-xl hover:bg-slate-100 transition-all active:scale-90"
                >
                  <Menu size={24} />
                </button>
                <div className="ml-3 flex items-center space-x-2">
                   <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-white text-sm">N</span>
                   </div>
                   <span className="font-black text-slate-800 tracking-tighter text-lg uppercase">Navexa</span>
                </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 border border-blue-400/20 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/20">
              {userEmail?.[0].toUpperCase() || 'U'}
            </div>
        </header>

        <main className="flex-1 overflow-y-auto focus:outline-none custom-scrollbar">
          <div className="max-w-screen-2xl mx-auto w-full p-4 sm:p-6 lg:p-10 transition-all">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;