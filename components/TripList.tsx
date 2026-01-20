import React from 'react';
import { Trip, Vehicle } from '../types';
import { Edit2, MoreVertical, Fuel, User, MapPin, Calendar } from 'lucide-react';

interface TripListProps {
  trips: Trip[];
  vehicles: Vehicle[];
  onEdit: (trip: Trip) => void;
}

const TripList: React.FC<TripListProps> = ({ trips, vehicles, onEdit }) => {
  
  const getVehicleReg = (id: string) => {
    return vehicles.find(v => v.id === id)?.registrationNumber || 'Unknown Vehicle';
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getProfitColor = (income: number, expense: number) => {
    const profit = income - expense;
    if (profit > 0) return 'text-green-600';
    if (profit < 0) return 'text-red-600';
    return 'text-slate-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date/ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Route</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Financials</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {trips.map((trip) => {
               const totalExpense = (Object.values(trip.expenses) as number[]).reduce((a, b) => a + b, 0);
               const profit = trip.tripAmount - totalExpense;

               return (
              <tr key={trip.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">{new Date(trip.date).toLocaleDateString()}</div>
                  <div className="text-xs text-slate-500">#{trip.id.toUpperCase()}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-slate-900 mb-1">
                    <span className="font-semibold mr-2">{getVehicleReg(trip.vehicleId)}</span>
                  </div>
                  <div className="flex items-center text-xs text-slate-500">
                    <User size={12} className="mr-1" /> {trip.driverName}
                  </div>
                </td>
                <td className="px-6 py-4">
                   <div className="text-sm text-slate-800 flex items-center">
                     <MapPin size={14} className="mr-1 text-slate-400" />
                     {trip.pickupLocation} <span className="mx-2 text-slate-300">→</span> {trip.dropLocation}
                   </div>
                   <div className="text-xs text-slate-500 mt-1">
                     {trip.customerName}
                   </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="text-sm font-medium text-slate-900">{formatCurrency(trip.tripAmount)}</div>
                  <div className={`text-xs font-medium ${getProfitColor(trip.tripAmount, totalExpense)}`}>
                    Net: {formatCurrency(profit)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => onEdit(trip)}
                    className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 p-4">
         {trips.map((trip) => {
            const totalExpense = (Object.values(trip.expenses) as number[]).reduce((a, b) => a + b, 0);
            const profit = trip.tripAmount - totalExpense;
            
            return (
           <div key={trip.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm" onClick={() => onEdit(trip)}>
             <div className="flex justify-between items-start mb-3">
               <div>
                  <div className="text-sm font-bold text-slate-800">{new Date(trip.date).toLocaleDateString()}</div>
                  <div className="text-xs text-slate-500">#{trip.id.toUpperCase()}</div>
               </div>
               <span className={`px-2 py-1 text-xs font-semibold rounded-full ${trip.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                 {trip.status}
               </span>
             </div>
             
             <div className="mb-3">
                <div className="text-sm font-medium text-slate-900 flex items-center mb-1">
                   {getVehicleReg(trip.vehicleId)}
                </div>
                <div className="text-xs text-slate-600 flex items-center">
                   {trip.pickupLocation} → {trip.dropLocation}
                </div>
             </div>

             <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <div className="text-left">
                   <div className="text-xs text-slate-500">Income</div>
                   <div className="text-sm font-bold text-slate-800">{formatCurrency(trip.tripAmount)}</div>
                </div>
                <div className="text-right">
                   <div className="text-xs text-slate-500">Net Profit</div>
                   <div className={`text-sm font-bold ${getProfitColor(trip.tripAmount, totalExpense)}`}>
                     {formatCurrency(profit)}
                   </div>
                </div>
             </div>
           </div>
         )})}
      </div>
    </div>
  );
};

export default TripList;