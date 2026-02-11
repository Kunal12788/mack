import React from 'react';
import { Driver } from '../types';
import { User, Phone, FileBadge, Calendar, MoreHorizontal, CheckCircle2, XCircle } from 'lucide-react';

interface DriverListProps {
  drivers: Driver[];
}

const DriverList: React.FC<DriverListProps> = ({ drivers }) => {
  if (drivers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
          <User size={32} />
        </div>
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">No Personnel Records</h3>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Initialize your fleet team to see them here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {drivers.map((driver) => (
        <div key={driver.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group">
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                  <User size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-950 tracking-tight">{driver.name}</h3>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mt-1.5 ${driver.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-rose-100 text-rose-700 border border-rose-200'}`}>
                    {driver.status === 'Active' ? <CheckCircle2 size={12} className="mr-1.5" /> : <XCircle size={12} className="mr-1.5" />}
                    {driver.status}
                  </div>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-950 transition-colors p-1">
                <MoreHorizontal size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center text-slate-600">
                  <Phone size={16} className="mr-3 text-blue-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Phone Link</span>
                </div>
                <span className="text-sm font-black text-slate-950">{driver.phone}</span>
              </div>

              <div className="flex items-center justify-between px-4">
                <div className="flex items-center text-slate-500">
                  <FileBadge size={14} className="mr-3 text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">License ID</span>
                </div>
                <span className="text-xs font-black text-slate-800 tracking-wider">{driver.licenseNumber}</span>
              </div>

              <div className="flex items-center justify-between px-4">
                <div className="flex items-center text-slate-500">
                  <Calendar size={14} className="mr-3 text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Onboarded</span>
                </div>
                <span className="text-xs font-black text-slate-800">{new Date(driver.joiningDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-center">
            <button className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 hover:text-blue-800 transition-colors flex items-center">
              Internal Audit Report <MoreHorizontal size={14} className="ml-2" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DriverList;