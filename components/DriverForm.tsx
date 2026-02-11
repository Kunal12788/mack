import React, { useState } from 'react';
import { Driver } from '../types';
import { X, Save, User, ShieldCheck } from 'lucide-react';

interface DriverFormProps {
  onSave: (driver: Omit<Driver, 'id'>) => void;
  onCancel: () => void;
}

const DriverForm: React.FC<DriverFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Driver, 'id'>>({
    name: '',
    phone: '',
    licenseNumber: '',
    status: 'Active',
    joiningDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] animate-fadeIn">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden">
        <header className="px-10 py-8 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-4">
             <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
               <User size={24} />
             </div>
             <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Register Driver</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Operational Human Capital</p>
             </div>
          </div>
          <button onClick={onCancel} className="p-2 text-slate-300 hover:text-slate-900 transition-all"><X size={24} /></button>
        </header>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm font-bold" placeholder="e.g. John Doe" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact No.</label>
                <input type="text" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">License ID</label>
                <input type="text" required value={formData.licenseNumber} onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm font-bold" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Node Status</label>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm font-bold">
                <option value="Active">Active Duty</option>
                <option value="Inactive">Deactivated</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
             <button type="button" onClick={onCancel} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 rounded-2xl transition-all">Abort</button>
             <button type="submit" className="flex-[2] py-4 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center">
                <Save size={14} className="mr-3" /> Commit Driver
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverForm;