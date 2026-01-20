import React from 'react';
import { Trip, Vehicle } from '../types';
import { Edit2, MoreVertical, Fuel, User, MapPin, Calendar, ArrowRight, Wallet } from 'lucide-react';

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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-8 py-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Trip ID / Date</th>
              <th className="px-6 py-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Vehicle & Driver</th>
              <th className="px-6 py-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Route Info</th>
              <th className="px-6 py-5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Financials</th>
              <th className="px-6 py-5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-8 py-5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {trips.map((trip) => {
               const totalExpense = (Object.values(trip.expenses) as number[]).reduce((a, b) => a + b, 0);
               const profit = trip.tripAmount - totalExpense;
               const isProfitable = profit >= 0;

               return (
              <tr key={trip.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">{new Date(trip.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    <span className="text-xs font-mono text-slate-400 mt-0.5">#{trip.id.toUpperCase()}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800">{getVehicleReg(trip.vehicleId)}</span>
                    <div className="flex items-center text-xs text-slate-500 mt-1">
                      <User size={12} className="mr-1.5" /> 
                      {trip.driverName}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex flex-col max-w-[200px]">
                     <div className="flex items-center text-sm text-slate-700 font-medium">
                        <span className="truncate">{trip.pickupLocation}</span>
                        <ArrowRight size={12} className="mx-2 text-slate-300 flex-shrink-0" />
                        <span className="truncate">{trip.dropLocation}</span>
                     </div>
                     <span className="text-xs text-slate-500 mt-1 truncate">{trip.customerName}</span>
                   </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="text-sm font-bold text-slate-900">{formatCurrency(trip.tripAmount)}</div>
                  <div className={`text-xs font-medium mt-1 ${isProfitable ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isProfitable ? '+' : ''}{formatCurrency(profit)}
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                      ${trip.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                        trip.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        'bg-amber-50 text-amber-700 border-amber-100'}`}>
                      {trip.status}
                    </span>
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => onEdit(trip)}
                    className="text-slate-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100"
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
      <div className="md:hidden p-4 space-y-4 bg-gray-50">
         {trips.map((trip) => {
            const totalExpense = (Object.values(trip.expenses) as number[]).reduce((a, b) => a + b, 0);
            const profit = trip.tripAmount - totalExpense;
            
            return (
           <div key={trip.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm active:scale-[0.99] transition-transform" onClick={() => onEdit(trip)}>
             <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                <div className="flex items-center space-x-3">
                   <div className={`w-2 h-10 rounded-full ${trip.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                   <div>
                      <div className="text-sm font-bold text-slate-900">{new Date(trip.date).toLocaleDateString()}</div>
                      <div className="text-xs text-slate-400 font-mono">#{trip.id.toUpperCase()}</div>
                   </div>
                </div>
                <div className="text-right">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${trip.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {trip.status}
                    </span>
                </div>
             </div>
             
             <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-slate-700">
                    <User size={16} className="text-slate-400 mr-3" />
                    <span className="font-medium">{trip.driverName}</span>
                    <span className="text-slate-300 mx-2">•</span>
                    <span className="text-slate-500">{getVehicleReg(trip.vehicleId)}</span>
                </div>
                <div className="flex items-start text-sm text-slate-700">
                    <MapPin size={16} className="text-slate-400 mr-3 mt-0.5" />
                    <div className="flex flex-col">
                        <span className="font-medium">{trip.pickupLocation}</span>
                        <span className="text-xs text-slate-400 my-0.5">to</span>
                        <span className="font-medium">{trip.dropLocation}</span>
                    </div>
                </div>
             </div>

             <div className="flex justify-between items-center pt-3 border-t border-gray-50 bg-gray-50/50 -mx-5 -mb-5 px-5 py-3 mt-4">
                <div>
                   <div className="text-xs text-slate-500 font-medium">Income</div>
                   <div className="text-sm font-bold text-slate-800">{formatCurrency(trip.tripAmount)}</div>
                </div>
                <div className="text-right">
                   <div className="text-xs text-slate-500 font-medium">Profit</div>
                   <div className={`text-sm font-bold ${profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
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