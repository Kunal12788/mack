import React from 'react';
import { Vehicle } from '../types';
import { Calendar, AlertTriangle, CheckCircle, Truck, MoreHorizontal } from 'lucide-react';

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

  const getStatusStyle = (dateStr: string) => {
    if (isExpired(dateStr)) return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', icon: AlertTriangle };
    if (isApproaching(dateStr)) return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: AlertTriangle };
    return { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: CheckCircle };
  };

  const StatusRow = ({ label, date }: { label: string, date: string }) => {
      const style = getStatusStyle(date);
      const Icon = style.icon;
      return (
        <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <span className="text-sm text-slate-600">{label}</span>
            <div className={`flex items-center px-2.5 py-1 rounded-full border ${style.bg} ${style.border}`}>
                <Icon size={12} className={`${style.color} mr-1.5`} />
                <span className={`text-xs font-semibold ${style.color}`}>
                    {new Date(date).toLocaleDateString()}
                </span>
            </div>
        </div>
      )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {vehicles.map((vehicle) => (
        <div key={vehicle.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
          <div className="p-6 pb-4 bg-gradient-to-r from-slate-50 to-white border-b border-gray-100 flex justify-between items-start">
            <div className="flex items-start space-x-4">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-blue-600">
                    <Truck size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight">{vehicle.registrationNumber}</h3>
                    <p className="text-sm font-medium text-slate-500">{vehicle.model}</p>
                </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
                <MoreHorizontal size={20} />
            </button>
          </div>
          
          <div className="p-6 space-y-2">
            <StatusRow label="Insurance Expiry" date={vehicle.insuranceExpiryDate} />
            <StatusRow label="Pollution Expiry" date={vehicle.pollutionExpiryDate} />
            <StatusRow label="Service Due" date={vehicle.nextServiceDueDate} />
          </div>
          
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-center">
               <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors w-full">
                 View Full History
               </button>
            </div>
        </div>
      ))}
    </div>
  );
};

export default VehicleList;