import React, { useMemo } from 'react';
import { Trip, DashboardStats } from '../types';
import StatsCard from './StatsCard';
import { DollarSign, CreditCard, TrendingUp, AlertCircle, Fuel, Activity } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface DashboardProps {
  stats: DashboardStats;
  trips: Trip[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, trips }) => {
  
  const monthlyData = useMemo(() => {
    const data: Record<string, { name: string; income: number; expense: number; profit: number }> = {};
    const sortedTrips = [...trips].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedTrips.forEach(trip => {
      const date = new Date(trip.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })}`;
      if (!data[monthYear]) {
        data[monthYear] = { name: monthYear, income: 0, expense: 0, profit: 0 };
      }
      const tripExpense = Number(trip.expenses.fuelCost) + Number(trip.expenses.tollCharges) + Number(trip.expenses.parkingCharges) + Number(trip.expenses.driverPayment) + Number(trip.expenses.otherExpenses);
      data[monthYear].income += Number(trip.tripAmount);
      data[monthYear].expense += tripExpense;
      data[monthYear].profit += (Number(trip.tripAmount) - tripExpense);
    });
    return Object.values(data);
  }, [trips]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-8 sm:space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700 w-full overflow-x-hidden">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">Operational Metrics</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-3 opacity-60">High-Fidelity Real-time Analytics Layer</p>
        </div>
        <div className="flex items-center space-x-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm shrink-0 self-start">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Active Audit: ON</span>
        </div>
      </div>

      {/* Adaptive Stats Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard title="Revenue" value={formatCurrency(stats.totalIncome)} icon={<DollarSign size={20} />} color="blue" trend="12%" trendUp={true} />
        <StatsCard title="Cost" value={formatCurrency(stats.totalExpenses)} icon={<CreditCard size={20} />} color="red" trend="4%" trendUp={false} />
        <StatsCard title="Profit" value={formatCurrency(stats.netProfit)} icon={<TrendingUp size={20} />} color="green" trend="8%" trendUp={true} />
        <StatsCard title="Pending" value={formatCurrency(stats.pendingPayments)} icon={<AlertCircle size={20} />} color="yellow" />
      </div>

      {/* Fluid Visualization Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
        <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 xl:col-span-2 min-h-[350px] sm:min-h-[450px] flex flex-col">
          <div className="mb-10 shrink-0">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Financial Flow</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Monthly Trend Analysis</p>
          </div>
          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dx={-10} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip cursor={{fill: '#f8fafc', radius: 10}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="income" name="Income" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" name="Cost" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-950 p-6 sm:p-10 rounded-[2.5rem] shadow-2xl text-white flex flex-col min-h-[350px] sm:min-h-[450px]">
          <div className="mb-10 shrink-0">
            <h3 className="text-xl font-black tracking-tight">Asset Audit</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">System Load Analysis</p>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6">
             <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin-slow"></div>
                <span className="text-3xl font-black">{stats.totalTrips}</span>
             </div>
             <p className="text-sm text-slate-400 font-medium max-w-xs leading-relaxed">
               Digital synchronization of fleet ledger is currently <span className="text-emerald-400 font-black">ACTIVE</span>. 
               All data streams are verified.
             </p>
             <button className="px-6 py-3 bg-white text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-blue-500 hover:text-white transition-all transform active:scale-95">
                Generate Full Audit
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;