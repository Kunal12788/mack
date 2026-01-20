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
  Legend,
  AreaChart,
  Area
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

      const tripExpense = 
        trip.expenses.fuelCost + 
        trip.expenses.tollCharges + 
        trip.expenses.parkingCharges + 
        trip.expenses.driverPayment + 
        trip.expenses.otherExpenses;

      data[monthYear].income += trip.tripAmount;
      data[monthYear].expense += tripExpense;
      data[monthYear].profit += (trip.tripAmount - tripExpense);
    });

    return Object.values(data);
  }, [trips]);

  const expenseBreakdown = useMemo(() => {
    let fuel = 0;
    let driver = 0;
    let toll = 0;
    let other = 0;

    trips.forEach(t => {
      fuel += t.expenses.fuelCost;
      driver += t.expenses.driverPayment;
      toll += t.expenses.tollCharges + t.expenses.parkingCharges;
      other += t.expenses.otherExpenses;
    });

    return [
      { name: 'Fuel', value: fuel },
      { name: 'Driver', value: driver },
      { name: 'Toll/Parking', value: toll },
      { name: 'Other', value: other },
    ].filter(item => item.value > 0);
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
    <div className="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">Holistic view of fleet operations & financial health.</p>
        </div>
        <div className="flex items-center space-x-3 bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-2xl border border-emerald-100 shadow-sm text-xs font-black uppercase tracking-widest self-start md:self-auto">
          <Activity size={16} className="animate-pulse" />
          <span>Real-time Active</span>
        </div>
      </div>

      {/* Stats Grid - Fluid for all widths */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard 
          title="Gross Revenue" 
          value={formatCurrency(stats.totalIncome)} 
          icon={<DollarSign size={22} />} 
          color="blue"
          trend="12.4%"
          trendUp={true}
        />
        <StatsCard 
          title="Operating Cost" 
          value={formatCurrency(stats.totalExpenses)} 
          icon={<CreditCard size={22} />} 
          color="red"
          trend="4.2%"
          trendUp={false}
        />
        <StatsCard 
          title="Net Profit" 
          value={formatCurrency(stats.netProfit)} 
          icon={<TrendingUp size={22} />} 
          color="green"
          trend="8.1%"
          trendUp={true}
        />
        <StatsCard 
          title="Outstanding" 
          value={formatCurrency(stats.pendingPayments)} 
          icon={<AlertCircle size={22} />} 
          color="yellow"
        />
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="bg-white p-5 sm:p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Revenue Dynamics</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Comparative Month-on-Month</p>
            </div>
            <select className="text-xs font-bold bg-slate-50 border-none rounded-xl px-4 py-2.5 text-slate-600 focus:ring-2 focus:ring-blue-500/10 cursor-pointer shadow-inner">
              <option>Quarterly Analysis</option>
              <option>Annual View</option>
            </select>
          </div>
          <div className="h-[300px] sm:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} barGap={10}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} 
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} 
                  tickFormatter={(val) => `₹${val/1000}k`} 
                  dx={-10}
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc', radius: 10}}
                  formatter={(value: number) => [formatCurrency(value)]}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 800, padding: '4px 0' }}
                  labelStyle={{ marginBottom: '10px', color: '#64748b', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '30px', fontWeight: 700, fontSize: '12px' }}/>
                <Bar dataKey="income" name="Income" fill="#3b82f6" radius={[6, 6, 6, 6]} maxBarSize={32} />
                <Bar dataKey="expense" name="Expenses" fill="#fb7185" radius={[6, 6, 6, 6]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col">
          <div className="mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Opex Structure</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Allocation by Category</p>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={85}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer outline-none" />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800 }}
                />
                <Legend verticalAlign="bottom" iconType="circle" height={36} wrapperStyle={{ fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Alert Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-[2.5rem] p-6 sm:p-10 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-900/20">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="p-4 bg-blue-500/10 rounded-3xl border border-white/10 shadow-inner">
              <Fuel size={32} className="text-blue-400" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
                <span className="bg-blue-500 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">Smart Insight</span>
                <h3 className="text-xl font-black tracking-tight">Fleet Efficiency Optimization</h3>
              </div>
              <p className="text-slate-400 max-w-2xl leading-relaxed text-sm sm:text-base font-medium">
                Analysis of recent trips indicates <span className="text-white font-bold">KA-05-XY-9876</span> is maintaining peak performance levels. 
                However, <span className="text-rose-400 font-bold">KA-01-AB-1234</span> shows a 5% increase in fuel consumption. We recommend an early service inspection.
              </p>
            </div>
        </div>
        <button className="w-full lg:w-auto px-10 py-4 bg-white text-slate-900 font-black rounded-2xl shadow-2xl hover:bg-blue-50 transition-all active:scale-95 whitespace-nowrap text-sm uppercase tracking-widest">
          Audit Fleet
        </button>
      </div>
    </div>
  );
};

export default Dashboard;