import React, { useState, useEffect } from 'react';
import { Trip, Vehicle, PaymentStatus, PaymentMethod } from '../types';
import { X, Save, Calculator, Calendar, MapPin, User, IndianRupee, FileText } from 'lucide-react';

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
    expenses: {
      fuelCost: 0,
      tollCharges: 0,
      parkingCharges: 0,
      driverPayment: 0,
      otherExpenses: 0,
    },
    paymentDetails: {
      totalAmount: 0,
      advancePaid: 0,
      balance: 0,
      status: PaymentStatus.PENDING,
      method: PaymentMethod.CASH,
    },
    odometer: {
      start: 0,
      end: 0,
      totalDistance: 0,
    },
    notes: '',
    status: 'Scheduled',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
    if (formData.vehicleId && formData.driverName && formData.customerName) {
      onSave(formData as Trip);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-[100] p-3 sm:p-6 lg:p-10 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200/50">
        
        {/* Responsive Header */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center space-x-4">
             <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
               <FileText size={20} />
             </div>
             <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  {initialData ? 'Trip Modification' : 'Log Daily Trip'}
                </h2>
                <p className="hidden sm:block text-xs font-medium text-slate-400 mt-0.5">Cloud-synced operational ledger</p>
             </div>
          </div>
          <button 
            onClick={onCancel} 
            className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all active:scale-90"
          >
            <X size={24} />
          </button>
        </div>

        {/* Fluid Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 bg-slate-50/30 custom-scrollbar">
          <form id="trip-form" onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
            
            {/* Core Info Section */}
            <div className="bg-white p-5 sm:p-8 rounded-[2rem] shadow-sm border border-slate-200/60">
                <div className="flex items-center space-x-2 mb-6">
                    <Calendar size={14} className="text-blue-500" />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Logistics Metadata</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 ml-1">Trip Date</label>
                        <input type="date" required 
                            className="w-full rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm text-sm p-3.5 transition-all outline-none"
                            value={formData.date} onChange={(e) => handleChange('date', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 ml-1">Assigned Fleet</label>
                        <select required className="w-full rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm text-sm p-3.5 transition-all outline-none bg-white"
                            value={formData.vehicleId} onChange={(e) => handleChange('vehicleId', e.target.value)}>
                            <option value="">Choose Vehicle</option>
                            {vehicles.map(v => <option key={v.id} value={v.id}>{v.registrationNumber} • {v.model}</option>)}
                        </select>
                    </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 ml-1">Client Name</label>
                        <input type="text" required placeholder="Organization or Guest"
                            className="w-full rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm text-sm p-3.5 transition-all outline-none"
                            value={formData.customerName} onChange={(e) => handleChange('customerName', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 ml-1">Primary Driver</label>
                        <input type="text" required placeholder="Authorized personnel"
                            className="w-full rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm text-sm p-3.5 transition-all outline-none"
                            value={formData.driverName} onChange={(e) => handleChange('driverName', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 ml-1">Starting Hub</label>
                        <input type="text" placeholder="Pickup point"
                            className="w-full rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm text-sm p-3.5 transition-all outline-none"
                            value={formData.pickupLocation} onChange={(e) => handleChange('pickupLocation', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 ml-1">End Point</label>
                        <input type="text" placeholder="Final drop"
                            className="w-full rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm text-sm p-3.5 transition-all outline-none"
                            value={formData.dropLocation} onChange={(e) => handleChange('dropLocation', e.target.value)} />
                    </div>
                </div>
            </div>

            {/* Financial Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                 {/* Income & Operating Expenses */}
                 <div className="bg-white p-5 sm:p-8 rounded-[2rem] shadow-sm border border-slate-200/60">
                    <div className="flex items-center space-x-2 mb-6">
                        <IndianRupee size={14} className="text-emerald-500" />
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Financial Parameters</h3>
                    </div>
                    <div className="space-y-6">
                        <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 group">
                             <label className="block text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-2.5 ml-1">Gross Contract Value</label>
                             <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-black text-xl">₹</span>
                                <input type="number" required
                                    className="w-full rounded-xl border-emerald-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 pl-10 py-4 text-2xl font-black text-emerald-900 placeholder-emerald-200 transition-all outline-none"
                                    value={formData.tripAmount} onChange={(e) => handleChange('tripAmount', Number(e.target.value))} />
                             </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fueling</label>
                                <input type="number" className="w-full rounded-xl border-slate-200 text-sm p-3 outline-none focus:border-blue-400 transition-all"
                                    value={formData.expenses?.fuelCost} onChange={(e) => handleNestedChange('expenses', 'fuelCost', Number(e.target.value))} />
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Driver Payout</label>
                                <input type="number" className="w-full rounded-xl border-slate-200 text-sm p-3 outline-none focus:border-blue-400 transition-all"
                                    value={formData.expenses?.driverPayment} onChange={(e) => handleNestedChange('expenses', 'driverPayment', Number(e.target.value))} />
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Toll/Permit</label>
                                <input type="number" className="w-full rounded-xl border-slate-200 text-sm p-3 outline-none focus:border-blue-400 transition-all"
                                    value={formData.expenses?.tollCharges} onChange={(e) => handleNestedChange('expenses', 'tollCharges', Number(e.target.value))} />
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Incidentals</label>
                                <input type="number" className="w-full rounded-xl border-slate-200 text-sm p-3 outline-none focus:border-blue-400 transition-all"
                                    value={formData.expenses?.parkingCharges} onChange={(e) => handleNestedChange('expenses', 'parkingCharges', Number(e.target.value))} />
                             </div>
                        </div>
                    </div>
                 </div>

                 <div className="flex flex-col gap-6 sm:gap-8">
                    {/* Driver Liability */}
                    <div className="bg-white p-5 sm:p-8 rounded-[2rem] shadow-sm border border-slate-200/60 flex-1">
                        <div className="flex items-center space-x-2 mb-6">
                            <User size={14} className="text-blue-500" />
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Personnel Liability</h3>
                        </div>
                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Net Agreed</label>
                                    <input type="number" className="w-full rounded-xl border-slate-200 text-sm p-3 outline-none focus:border-blue-400 transition-all"
                                        value={formData.paymentDetails?.totalAmount} onChange={(e) => handleNestedChange('paymentDetails', 'totalAmount', Number(e.target.value))} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Adv Disbursement</label>
                                    <input type="number" className="w-full rounded-xl border-slate-200 text-sm p-3 outline-none focus:border-blue-400 transition-all"
                                        value={formData.paymentDetails?.advancePaid} onChange={(e) => handleNestedChange('paymentDetails', 'advancePaid', Number(e.target.value))} />
                                </div>
                            </div>
                            <div className="pt-2">
                                <div className="flex justify-between items-center p-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Settlement</span>
                                    <span className={`text-xl font-black ${formData.paymentDetails?.balance > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                        ₹{formData.paymentDetails?.balance}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Efficiency Metrics */}
                    <div className="bg-white p-5 sm:p-8 rounded-[2rem] shadow-sm border border-slate-200/60">
                        <div className="flex items-center space-x-2 mb-6">
                            <Calculator size={14} className="text-purple-500" />
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Fleet Utilization</h3>
                        </div>
                        <div className="space-y-1.5">
                             <label className="text-xs font-bold text-slate-700 ml-1">Cumulative Trip Distance (KM)</label>
                             <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-500">
                                  <Calculator size={18} />
                                </div>
                                <input 
                                  type="number" 
                                  placeholder="0.00"
                                  className="w-full rounded-2xl border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 pl-11 py-4 bg-slate-50/50 text-lg font-black transition-all outline-none"
                                  value={formData.odometer?.totalDistance || ''} 
                                  onChange={(e) => handleNestedChange('odometer', 'totalDistance', Number(e.target.value))} 
                                />
                             </div>
                        </div>
                    </div>
                 </div>
            </div>

            <div className="bg-white p-5 sm:p-8 rounded-[2rem] shadow-sm border border-slate-200/60">
                <div className="flex items-center space-x-2 mb-4">
                    <FileText size={14} className="text-slate-400" />
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Audit Notes</h3>
                </div>
                <textarea rows={2} className="w-full rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm text-sm p-4 outline-none transition-all"
                    value={formData.notes} onChange={(e) => handleChange('notes', e.target.value)} placeholder="Operational incidents, route changes, or specific customer requests..." />
            </div>

          </form>
        </div>
        
        {/* Fixed Responsive Footer */}
        <div className="px-6 sm:px-10 py-6 border-t border-slate-100 bg-white flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 shrink-0">
          <button type="button" onClick={onCancel}
            className="order-2 sm:order-1 px-8 py-3.5 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all active:scale-95 text-sm sm:text-base">
            Discard
          </button>
          <button onClick={handleSubmit}
            className="order-1 sm:order-2 px-10 py-3.5 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 shadow-2xl shadow-blue-600/30 transition-all flex items-center justify-center transform active:scale-95 text-sm sm:text-base">
            <Save size={18} className="mr-2" />
            Commit to Ledger
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripForm;