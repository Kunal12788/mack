import React, { useState, useEffect } from 'react';
import { Trip, Vehicle, PaymentStatus, PaymentMethod } from '../types';
import { X, Save, FileText, ChevronRight } from 'lucide-react';

interface TripFormProps {
  vehicles: Vehicle[];
  initialData?: Trip | null;
  onSave: (trip: Omit<Trip, 'id'> | Trip) => void;
  onCancel: () => void;
}

const TripForm: React.FC<TripFormProps> = ({ vehicles, initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Trip>>({
    date: new Date().toISOString().split('T')[0],
    vehicleId: '',
    driverName: '',
    customerName: '',
    pickupLocation: '',
    dropLocation: '',
    tripAmount: 0,
    expenses: { fuelCost: 0, tollCharges: 0, parkingCharges: 0, driverPayment: 0, otherExpenses: 0 },
    paymentDetails: { totalAmount: 0, advancePaid: 0, balance: 0, status: PaymentStatus.PENDING, method: PaymentMethod.CASH },
    odometer: { start: 0, end: 0, totalDistance: 0 },
    notes: '',
    status: 'Scheduled',
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleNestedChange = (section: 'expenses' | 'paymentDetails' | 'odometer', field: string, value: any) => {
    setFormData(prev => {
      const updatedSection = { ...prev[section], [field]: value };
      if (section === 'paymentDetails') {
          const payment = updatedSection as any;
          payment.balance = Number(payment.totalAmount) - Number(payment.advancePaid);
          payment.status = payment.balance <= 0 ? PaymentStatus.PAID : PaymentStatus.PENDING;
      }
      return { ...prev, [section]: updatedSection };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.vehicleId && formData.driverName && formData.customerName) onSave(formData as Trip);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-0 sm:p-4 animate-fadeIn overflow-hidden">
      <div className="bg-white rounded-none sm:rounded-[2.5rem] shadow-2xl w-full max-w-4xl h-full sm:h-auto sm:max-h-[90dvh] flex flex-col overflow-hidden">
        
        {/* Dynamic Header */}
        <header className="px-6 sm:px-10 py-5 sm:py-7 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-4">
             <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
               <FileText size={20} />
             </div>
             <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  {initialData ? 'Update Operation' : 'Initialize Operation'}
                </h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Navexa Core Protocol</p>
             </div>
          </div>
          <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
            <X size={24} />
          </button>
        </header>

        {/* Scrollable Adaptive Form Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-50/30 custom-scrollbar">
          <form id="trip-form" onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {/* Identification Segment */}
                <div className="space-y-6 bg-white p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 shadow-sm">
                    <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Identification</h3>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Fleet Unit</label>
                            <select required className="w-full rounded-xl border-slate-200 text-sm p-3.5 outline-none bg-slate-50/50 focus:border-blue-600 transition-all"
                                value={formData.vehicleId} onChange={(e) => handleChange('vehicleId', e.target.value)}>
                                <option value="">Select Asset</option>
                                {vehicles.map(v => <option key={v.id} value={v.id}>{v.registrationNumber}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Client Entity</label>
                            <input type="text" required className="w-full rounded-xl border-slate-200 text-sm p-3.5 outline-none bg-slate-50/50 focus:border-blue-600 transition-all"
                                value={formData.customerName} onChange={(e) => handleChange('customerName', e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Financial Audit Segment */}
                <div className="space-y-6 bg-white p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 shadow-sm">
                    <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Financial Audit</h3>
                    <div className="space-y-4">
                        <div className="p-5 bg-slate-950 rounded-2xl">
                             <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Operational Revenue (₹)</label>
                             <input type="number" required className="bg-transparent text-white text-3xl font-black w-full outline-none"
                                value={formData.tripAmount} onChange={(e) => handleChange('tripAmount', Number(e.target.value))} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Driver Payout</label>
                                <input type="number" className="w-full rounded-xl border-slate-200 p-3 text-sm outline-none" value={formData.expenses?.driverPayment} onChange={(e) => handleNestedChange('expenses', 'driverPayment', Number(e.target.value))} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Fuel Allocation</label>
                                <input type="number" className="w-full rounded-xl border-slate-200 p-3 text-sm outline-none" value={formData.expenses?.fuelCost} onChange={(e) => handleNestedChange('expenses', 'fuelCost', Number(e.target.value))} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </form>
        </div>

        {/* Adaptive Sticky Footer */}
        <footer className="px-6 sm:px-10 py-6 border-t border-slate-100 bg-white flex flex-col-reverse sm:flex-row justify-end gap-3 shrink-0">
          <button onClick={onCancel} className="px-8 py-4 rounded-xl sm:rounded-2xl text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-8 py-4 rounded-xl sm:rounded-2xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center group">
            <Save size={14} className="mr-3" />
            Commit Record
            <ChevronRight size={14} className="ml-2 opacity-40 group-hover:translate-x-1 transition-transform" />
          </button>
        </footer>
      </div>
    </div>
  );
};

export default TripForm;