import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'slate';
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, trendUp, color = 'blue' }) => {
  const colorStyles = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
    green: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
    red: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100' },
    yellow: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
    slate: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100' }
  };

  const style = colorStyles[color];

  return (
    <div className="p-6 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{title}</h3>
          <p className="text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${style.bg} ${style.text} shadow-sm`}>
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center">
          <span className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${trendUp ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
          <span className="text-xs text-slate-400 ml-2">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;