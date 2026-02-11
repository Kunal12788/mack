import React, { useState } from 'react';
import { Customer } from '../types';
import { X, Save, Contact2, Globe } from 'lucide-react';

interface CustomerFormProps {
  onSave: (customer: Omit<Customer, 'id'>) => void;
  onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Customer, 'id'>>({
    name: '',
    phone: '',
    email: '',
    address: ''
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
               <Contact2 size={24} />
             </div>
             <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Enterprise Client</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">CRM Protocol</p>
             </div>
          </div>
          <button onClick={onCancel} className="p-2 text-slate-300 hover:text-slate-900 transition-all"><X size={24} /></button>
        </header>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Entity Name</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm font-bold" placeholder="e.g. Acme Corp" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                <input type="text" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm font-bold" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Office Address</label>
              <textarea required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm font-bold min-h-[100px] resize-none" />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
             <button type="button" onClick={onCancel} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 rounded-2xl transition-all">Abort</button>
             <button type="submit" className="flex-[2] py-4 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center">
                <Save size={14} className="mr-3" /> Commit Client
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;