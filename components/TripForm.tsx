import React, { useState, useEffect } from 'react';
import { Trip, Vehicle, PaymentStatus, PaymentMethod } from '../types';
import { X, Save, Calculator, Calendar, MapPin, User, IndianRupee } from 'lucide-react';

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

      if (section === 'odometer') {
          const odo = updatedSection as any;
          odo.totalDistance = Number(odo.end) - Number(odo.start);
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {initialData ? 'Edit Trip Details' : 'Record New Trip'}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">Fill in the trip information below</p>
          </div>
          <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <form id="trip-form" onSubmit={handleSubmit} className="space-y-8 max-w-6xl mx-auto">
            
            {/* Section 1: Basic Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center">
                    <Calendar size={16} className="mr-2 text-blue-600" />
                    Trip Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500">Date</label>
                        <input type="date" required 
                            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm text-sm p-2.5 transition-all"
                            value={formData.date} onChange={(e) => handleChange('date', e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500">Vehicle</label>
                        <select required className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm text-sm p-2.5 transition-all"
                            value={formData.vehicleId} onChange={(e) => handleChange('vehicleId', e.target.value)}>
                            <option value="">Select Vehicle</option>
                            {vehicles.map(v => <option key={v.id} value={v.id}>{v.registrationNumber} ({v.model})</option>)}
                        </select>
                    </div>
                     <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500">Customer</label>
                        <input type="text" required placeholder="Enter customer name"
                            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm text-sm p-2.5 transition-all"
                            value={formData.customerName} onChange={(e) => handleChange('customerName', e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500">Driver</label>
                        <input type="text" required placeholder="Driver Name"
                            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm text-sm p-2.5 transition-all"
                            value={formData.driverName} onChange={(e) => handleChange('driverName', e.target.value)} />
                    </div>
                     <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500">Pickup</label>
                        <input type="text" placeholder="Starting point"
                            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm text-sm p-2.5 transition-all"
                            value={formData.pickupLocation} onChange={(e) => handleChange('pickupLocation', e.target.value)} />
                    </div>
                     <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500">Drop</label>
                        <input type="text" placeholder="Destination"
                            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm text-sm p-2.5 transition-all"
                            value={formData.dropLocation} onChange={(e) => handleChange('dropLocation', e.target.value)} />
                    </div>
                </div>
            </div>

            {/* Section 2: Financials & Expenses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center">
                        <IndianRupee size={16} className="mr-2 text-emerald-600" />
                        Trip Income & Expenses
                    </h3>
                    <div className="space-y-6">
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                             <label className="block text-xs font-bold text-emerald-800 mb-1.5">Total Trip Income (Gross)</label>
                             <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 font-bold">₹</span>
                                <input type="number" required
                                    className="w-full rounded-lg border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 pl-8 py-3 text-lg font-bold text-emerald-900 placeholder-emerald-300"
                                    value={formData.tripAmount} onChange={(e) => handleChange('tripAmount', Number(e.target.value))} />
                             </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Fuel Cost</label>
                                <input type="number" className="w-full rounded-lg border-gray-300 text-sm p-2.5"
                                    value={formData.expenses?.fuelCost} onChange={(e) => handleNestedChange('expenses', 'fuelCost', Number(e.target.value))} />
                             </div>
                             <div>
                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Driver Batta</label>
                                <input type="number" className="w-full rounded-lg border-gray-300 text-sm p-2.5"
                                    value={formData.expenses?.driverPayment} onChange={(e) => handleNestedChange('expenses', 'driverPayment', Number(e.target.value))} />
                             </div>
                             <div>
                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Tolls</label>
                                <input type="number" className="w-full rounded-lg border-gray-300 text-sm p-2.5"
                                    value={formData.expenses?.tollCharges} onChange={(e) => handleNestedChange('expenses', 'tollCharges', Number(e.target.value))} />
                             </div>
                             <div>
                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Parking</label>
                                <input type="number" className="w-full rounded-lg border-gray-300 text-sm p-2.5"
                                    value={formData.expenses?.parkingCharges} onChange={(e) => handleNestedChange('expenses', 'parkingCharges', Number(e.target.value))} />
                             </div>
                        </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    {/* Driver Payments */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center">
                            <User size={16} className="mr-2 text-blue-600" />
                            Driver Payment Tracking
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500">Agreed Amount</label>
                                    <input type="number" className="w-full rounded-lg border-gray-300 text-sm p-2.5"
                                        value={formData.paymentDetails?.totalAmount} onChange={(e) => handleNestedChange('paymentDetails', 'totalAmount', Number(e.target.value))} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-500">Advance Paid</label>
                                    <input type="number" className="w-full rounded-lg border-gray-300 text-sm p-2.5"
                                        value={formData.paymentDetails?.advancePaid} onChange={(e) => handleNestedChange('paymentDetails', 'advancePaid', Number(e.target.value))} />
                                </div>
                            </div>
                            <div className="pt-2">
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                                    <span className="text-sm font-medium text-slate-600">Balance Pending</span>
                                    <span className={`text-lg font-bold ${formData.paymentDetails?.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        ₹{formData.paymentDetails?.balance}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Odometer */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center">
                            <Calculator size={16} className="mr-2 text-purple-600" />
                            Odometer (KM)
                        </h3>
                        <div className="flex items-end gap-4">
                             <div className="space-y-1.5 flex-1">
                                <label className="text-xs font-semibold text-slate-500">Start</label>
                                <input type="number" className="w-full rounded-lg border-gray-300 text-sm p-2.5"
                                    value={formData.odometer?.start} onChange={(e) => handleNestedChange('odometer', 'start', Number(e.target.value))} />
                            </div>
                            <div className="space-y-1.5 flex-1">
                                <label className="text-xs font-semibold text-slate-500">End</label>
                                <input type="number" className="w-full rounded-lg border-gray-300 text-sm p-2.5"
                                    value={formData.odometer?.end} onChange={(e) => handleNestedChange('odometer', 'end', Number(e.target.value))} />
                            </div>
                            <div className="w-24 bg-purple-50 p-2.5 rounded-lg border border-purple-100 text-center">
                                <span className="block text-xs text-purple-600 font-semibold mb-1">Total</span>
                                <span className="block text-sm font-bold text-purple-900">{formData.odometer?.totalDistance} km</span>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <label className="text-xs font-semibold text-slate-500 mb-2 block">Notes / Remarks</label>
                <textarea rows={3} className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm text-sm p-3"
                    value={formData.notes} onChange={(e) => handleChange('notes', e.target.value)} placeholder="Any special instructions or incidents..." />
            </div>

          </form>
        </div>
        
        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 bg-white flex justify-end gap-4 z-10">
          <button type="button" onClick={onCancel}
            className="px-6 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
            Cancel
          </button>
          <button onClick={handleSubmit}
            className="px-8 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center transform active:scale-95">
            <Save size={18} className="mr-2" />
            Save Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripForm;