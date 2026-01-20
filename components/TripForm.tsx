import React, { useState, useEffect } from 'react';
import { Trip, Vehicle, PaymentStatus, PaymentMethod } from '../types';
import { X, Save } from 'lucide-react';

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
      
      // Auto-calculations
      if (section === 'paymentDetails') {
          // ensure type safety
          const payment = updatedSection as any;
          payment.balance = Number(payment.totalAmount) - Number(payment.advancePaid);
          payment.status = payment.balance <= 0 ? PaymentStatus.PAID : PaymentStatus.PENDING;
          
          // Sync driver payment in expenses if totalAmount changes? 
          // Usually driver payment expense = total trip driver cost (salary + batta), 
          // whereas paymentDetails tracks the specific payout for this trip. 
          // For simplicity, let's keep them somewhat independent but users often map them.
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Edit Trip' : 'New Trip Entry'}
          </h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          {/* Section 1: Basic Trip Info */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Trip Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input 
                  type="date" 
                  required
                  className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle</label>
                <select 
                  required
                  className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={formData.vehicleId}
                  onChange={(e) => handleChange('vehicleId', e.target.value)}
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.registrationNumber} ({v.model})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Driver Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={formData.driverName}
                  onChange={(e) => handleChange('driverName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={formData.customerName}
                  onChange={(e) => handleChange('customerName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pickup Location</label>
                <input 
                  type="text" 
                  className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={formData.pickupLocation}
                  onChange={(e) => handleChange('pickupLocation', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Drop Location</label>
                <input 
                  type="text" 
                  className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={formData.dropLocation}
                  onChange={(e) => handleChange('dropLocation', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Financials */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Financials</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-4">
                <label className="block text-sm font-bold text-blue-700 mb-1">Total Trip Income (Gross)</label>
                <input 
                  type="number" 
                  required
                  className="w-full rounded-lg border-blue-200 bg-blue-50 border p-3 text-lg font-bold text-blue-900 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.tripAmount}
                  onChange={(e) => handleChange('tripAmount', Number(e.target.value))}
                />
              </div>
              
              {/* Expenses */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fuel Cost</label>
                <input 
                  type="number" 
                  className="w-full rounded-lg border-slate-300 border p-2 text-sm"
                  value={formData.expenses?.fuelCost}
                  onChange={(e) => handleNestedChange('expenses', 'fuelCost', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Toll Charges</label>
                <input 
                  type="number" 
                  className="w-full rounded-lg border-slate-300 border p-2 text-sm"
                  value={formData.expenses?.tollCharges}
                  onChange={(e) => handleNestedChange('expenses', 'tollCharges', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Parking</label>
                <input 
                  type="number" 
                  className="w-full rounded-lg border-slate-300 border p-2 text-sm"
                  value={formData.expenses?.parkingCharges}
                  onChange={(e) => handleNestedChange('expenses', 'parkingCharges', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Driver Batta/Cost</label>
                <input 
                  type="number" 
                  className="w-full rounded-lg border-slate-300 border p-2 text-sm"
                  value={formData.expenses?.driverPayment}
                  onChange={(e) => handleNestedChange('expenses', 'driverPayment', Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Driver Payment Status */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Driver Payment Tracking</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Total To Pay Driver</label>
                <input 
                  type="number" 
                  className="w-full rounded-lg border-slate-300 border p-2 text-sm"
                  value={formData.paymentDetails?.totalAmount}
                  onChange={(e) => handleNestedChange('paymentDetails', 'totalAmount', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Advance Paid</label>
                <input 
                  type="number" 
                  className="w-full rounded-lg border-slate-300 border p-2 text-sm"
                  value={formData.paymentDetails?.advancePaid}
                  onChange={(e) => handleNestedChange('paymentDetails', 'advancePaid', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Balance</label>
                <input 
                  type="number" 
                  readOnly
                  className="w-full rounded-lg border-slate-300 bg-slate-100 border p-2 text-sm text-slate-500 cursor-not-allowed"
                  value={formData.paymentDetails?.balance}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Odometer */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Usage Tracking</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start KM</label>
                <input 
                  type="number" 
                  className="w-full rounded-lg border-slate-300 border p-2 text-sm"
                  value={formData.odometer?.start}
                  onChange={(e) => handleNestedChange('odometer', 'start', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End KM</label>
                <input 
                  type="number" 
                  className="w-full rounded-lg border-slate-300 border p-2 text-sm"
                  value={formData.odometer?.end}
                  onChange={(e) => handleNestedChange('odometer', 'end', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Total Distance</label>
                <input 
                  type="number" 
                  readOnly
                  className="w-full rounded-lg border-slate-300 bg-slate-100 border p-2 text-sm text-slate-500"
                  value={formData.odometer?.totalDistance}
                />
              </div>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Notes / Remarks</label>
             <textarea 
                className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
             />
          </div>

        </form>
        
        <div className="p-6 border-t border-slate-200 bg-slate-50 sticky bottom-0 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onCancel}
            className="px-6 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-md transition-colors flex items-center"
          >
            <Save size={18} className="mr-2" />
            Save Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripForm;