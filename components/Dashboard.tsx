import React, { useMemo } from 'react';
import { Trip, DashboardStats } from '../types';
import StatsCard from './StatsCard';
import { DollarSign, CreditCard, TrendingUp, AlertCircle, Fuel } from 'lucide-react';
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
  
  // Prepare Chart Data
  const monthlyData = useMemo(() => {
    // Aggregate by month (simple version)
    const data: Record<string, { name: string; income: number; expense: number; profit: number }> = {};
    
    trips.forEach(trip => {
      const date = new Date(trip.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
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
    ];
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Business Overview</h1>
        <div className="text-sm text-slate-500">Last updated: Just now</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Revenue" 
          value={formatCurrency(stats.totalIncome)} 
          icon={<DollarSign size={24} />} 
          color="blue"
        />
        <StatsCard 
          title="Total Expenses" 
          value={formatCurrency(stats.totalExpenses)} 
          icon={<CreditCard size={24} />} 
          color="red"
        />
        <StatsCard 
          title="Net Profit" 
          value={formatCurrency(stats.netProfit)} 
          icon={<TrendingUp size={24} />} 
          color="green"
        />
        <StatsCard 
          title="Pending Payments" 
          value={formatCurrency(stats.pendingPayments)} 
          icon={<AlertCircle size={24} />} 
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Financial Performance</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value)]}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Net Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Expense Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Activity or Fuel Efficiency placeholder could go here */}
      <div className="bg-blue-900 rounded-xl p-6 text-white flex items-center justify-between">
        <div>
            <h3 className="text-lg font-bold">Fuel Efficiency Insight</h3>
            <p className="text-blue-200 mt-1 text-sm">Vehicle KA-05-XY-9876 is performing 15% better than average this month.</p>
        </div>
        <div className="bg-blue-800 p-3 rounded-full">
            <Fuel size={24} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;