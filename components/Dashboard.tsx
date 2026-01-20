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
  
  // Prepare Chart Data
  const monthlyData = useMemo(() => {
    // Aggregate by month (simple version)
    const data: Record<string, { name: string; income: number; expense: number; profit: number }> = {};
    
    // Sort trips by date first to ensure chart order
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Executive Overview</h1>
          <p className="text-slate-500 mt-1">Real-time performance metrics and financial insights.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm text-sm text-slate-600">
          <Activity size={16} className="text-green-500" />
          <span>System Healthy</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Revenue" 
          value={formatCurrency(stats.totalIncome)} 
          icon={<DollarSign size={22} />} 
          color="blue"
          trend="12%"
          trendUp={true}
        />
        <StatsCard 
          title="Total Expenses" 
          value={formatCurrency(stats.totalExpenses)} 
          icon={<CreditCard size={22} />} 
          color="red"
          trend="5%"
          trendUp={false}
        />
        <StatsCard 
          title="Net Profit" 
          value={formatCurrency(stats.netProfit)} 
          icon={<TrendingUp size={22} />} 
          color="green"
          trend="8%"
          trendUp={true}
        />
        <StatsCard 
          title="Pending Payments" 
          value={formatCurrency(stats.pendingPayments)} 
          icon={<AlertCircle size={22} />} 
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800">Financial Performance</h3>
            <select className="text-sm border-gray-200 rounded-lg text-slate-500 focus:ring-blue-500">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}} 
                  tickFormatter={(val) => `₹${val/1000}k`} 
                  dx={-10}
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  formatter={(value: number) => [formatCurrency(value)]}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '13px', fontWeight: 500 }}
                  labelStyle={{ marginBottom: '8px', color: '#64748b', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                <Bar dataKey="income" name="Income" fill="#3b82f6" radius={[4, 4, 4, 4]} maxBarSize={40} />
                <Bar dataKey="expense" name="Expenses" fill="#f87171" radius={[4, 4, 4, 4]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Expense Breakdown</h3>
          <p className="text-sm text-slate-500 mb-6">Where is your money going?</p>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" iconType="circle" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-lg shadow-blue-900/20">
        <div className="mb-4 md:mb-0">
            <div className="flex items-center mb-2">
              <div className="p-2 bg-blue-800/50 rounded-lg mr-3">
                <Fuel size={20} className="text-blue-200" />
              </div>
              <h3 className="text-lg font-bold">Fleet Efficiency Insight</h3>
            </div>
            <p className="text-blue-100 max-w-2xl leading-relaxed">
              Vehicle <span className="font-mono bg-blue-800/50 px-2 py-0.5 rounded text-white">KA-05-XY-9876</span> is performing 
              <span className="font-bold text-green-300"> 15% better</span> than average this month. Consider scheduling maintenance for <span className="font-mono bg-blue-800/50 px-2 py-0.5 rounded text-white">KA-01-AB-1234</span> to improve mileage.
            </p>
        </div>
        <button className="px-5 py-2.5 bg-white text-blue-900 font-semibold rounded-lg shadow hover:bg-blue-50 transition-colors whitespace-nowrap">
          View Fleet Report
        </button>
      </div>
    </div>
  );
};

export default Dashboard;