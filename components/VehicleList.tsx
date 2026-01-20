import React from 'react';
import { Vehicle } from '../types';
import { Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

interface VehicleListProps {
  vehicles: Vehicle[];
}

const VehicleList: React.FC<VehicleListProps> = ({ vehicles }) => {
  
  const isApproaching = (dateStr: string) => {
    const today = new Date();
    const target = new Date(dateStr);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  const isExpired = (dateStr: string) => {
    const today = new Date();
    const target = new Date(dateStr);
    return target < today;
  };

  const getStatusColor = (dateStr: string) => {
    if (isExpired(dateStr)) return 'text-red-600 bg-red-50 border-red-200';
    if (isApproaching(dateStr)) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <div key={vehicle.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <h3 className="text-lg font-bold text-slate-900">{vehicle.registrationNumber}</h3>
            <p className="text-sm text-slate-500">{vehicle.model}</p>
          </div>
          <div className="p-5 space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 flex items-center">
                <Calendar size={16} className="mr-2 text-slate-400"/> Insurance
              </span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-md border ${getStatusColor(vehicle.insuranceExpiryDate)}`}>
                {new Date(vehicle.insuranceExpiryDate).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 flex items-center">
                 <Calendar size={16} className="mr-2 text-slate-400"/> Pollution
              </span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-md border ${getStatusColor(vehicle.pollutionExpiryDate)}`}>
                {new Date(vehicle.pollutionExpiryDate).toLocaleDateString()}
              </span>
            </div>

             <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 flex items-center">
                 <Calendar size={16} className="mr-2 text-slate-400"/> Service Due
              </span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-md border ${getStatusColor(vehicle.nextServiceDueDate)}`}>
                {new Date(vehicle.nextServiceDueDate).toLocaleDateString()}
              </span>
            </div>
            
            <div className="pt-4 mt-2 border-t border-slate-100">
               <button className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-800">
                 View Service History
               </button>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
};

export default VehicleList;