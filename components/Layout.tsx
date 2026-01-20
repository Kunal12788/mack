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
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-30 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0 shadow-xl lg:shadow-none flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-20 px-8 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white text-lg">N</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">NAVEXA</span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Main Menu</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setIsSidebarOpen(false);
              }}
              className={`
                group flex items-center w-full px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200
                ${activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <span className={`mr-3 transition-colors ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
                {item.icon}
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              {activeTab === item.id && <ChevronRight size={16} className="text-blue-200" />}
            </button>
          ))}
        </nav>

        {/* User Profile / Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center p-2 mb-2 rounded-lg bg-slate-800/50 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 shrink-0">
              <UserCircle size={24} />
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Fleet Manager</p>
              <p className="text-xs text-slate-400 truncate">{userEmail || 'User'}</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-all duration-200"
          >
            <LogOut size={18} className="mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden bg-gray-50">
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 lg:hidden shadow-sm z-10">
            <div className="flex items-center">
                <button 
                onClick={toggleSidebar} 
                className="text-slate-500 hover:text-slate-700 focus:outline-none p-2 rounded-md hover:bg-gray-100"
                >
                <Menu size={24} />
                </button>
                <span className="ml-3 text-lg font-semibold text-slate-800">Navexa</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-xs">
              {userEmail?.[0].toUpperCase() || 'U'}
            </div>
        </header>

        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;