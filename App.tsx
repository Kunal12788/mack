import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TripList from './components/TripList';
import TripForm from './components/TripForm';
import VehicleList from './components/VehicleList';
import Auth from './components/Auth';
import { getTrips, getVehicles, addTrip, updateTrip, calculateStats, onAuthStateChange, supabase } from './services/dataService';
import { Trip, Vehicle, DashboardStats } from './types';
import { Plus, Database, Copy, Check, ExternalLink, RefreshCw } from 'lucide-react';
import { Session } from '@supabase/supabase-js';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [dbMissing, setDbMissing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Modal State
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  useEffect(() => {
    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. Auth Listener
    const { data: { subscription } } = onAuthStateChange((newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    if (!session) return;
    setLoading(true);
    setDbMissing(false);
    try {
      const [tripsRes, vehiclesRes] = await Promise.all([getTrips(), getVehicles()]);
      
      if (tripsRes.error?.code === 'PGRST204' || vehiclesRes.error?.code === 'PGRST204') {
        setDbMissing(true);
        return;
      }

      setTrips(tripsRes.data);
      setVehicles(vehiclesRes.data);
      setStats(calculateStats(tripsRes.data));
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [session]);

  const handleSaveTrip = async (trip: Trip | Omit<Trip, 'id'>) => {
    if ('id' in trip) {
       await updateTrip(trip);
    } else {
       await addTrip(trip);
    }
    await fetchData();
    setIsTripModalOpen(false);
    setEditingTrip(null);
  };

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    setIsTripModalOpen(true);
  };

  const openNewTripModal = () => {
    setEditingTrip(null);
    setIsTripModalOpen(true);
  };

  const sqlSchema = `-- Run this in your Supabase SQL Editor

-- 1. Create vehicles table
create table vehicles (
  id uuid default gen_random_uuid() primary key,
  "registrationNumber" text not null,
  model text,
  "lastServiceDate" date,
  "nextServiceDueDate" date,
  "insuranceExpiryDate" date,
  "pollutionExpiryDate" date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create trips table
create table trips (
  id uuid default gen_random_uuid() primary key,
  date date not null,
  "vehicleId" uuid references vehicles(id),
  "driverName" text not null,
  "customerName" text,
  "pickupLocation" text,
  "dropLocation" text,
  "tripAmount" numeric default 0,
  expenses jsonb default '{}'::jsonb,
  "paymentDetails" jsonb default '{}'::jsonb,
  odometer jsonb default '{}'::jsonb,
  notes text,
  status text default 'Scheduled',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Security)
alter table vehicles enable row level security;
alter table trips enable row level security;

-- Create policy for public access
create policy "Public Access" on vehicles for all using (true) with check (true);
create policy "Public Access" on trips for all using (true) with check (true);

-- 3. Insert initial vehicles (Required to use the trip form)
insert into vehicles ("registrationNumber", model, "insuranceExpiryDate", "pollutionExpiryDate", "nextServiceDueDate")
values
('KA-01-AB-1234', 'Innova Crysta', '2025-12-31', '2025-06-15', '2025-08-20'),
('KA-05-XY-9876', 'Swift Dzire', '2025-10-10', '2025-04-05', '2025-07-15');`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // 1. Show setup screen if DB tables are missing
  if (session && dbMissing) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200">
          <div className="bg-slate-900 p-8 md:w-1/3 text-white flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                <Database size={24} />
              </div>
              <h1 className="text-2xl font-bold mb-4 tracking-tight">Database Setup Required</h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                Navexa is connected, but the required tables were not found.
              </p>
            </div>
            <div className="mt-8">
              <a 
                href="https://supabase.com/dashboard/project/bprbghscyohjlwqvgcms/sql/new" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest"
              >
                Open SQL Editor <ExternalLink size={14} className="ml-2" />
              </a>
            </div>
          </div>
          <div className="p-8 md:w-2/3">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Initialize Your Schema</h3>
            <p className="text-slate-500 text-sm mb-6">Copy the SQL below and run it in your Supabase SQL Editor.</p>
            
            <div className="relative group">
              <pre className="bg-slate-50 p-4 rounded-xl text-xs font-mono text-slate-700 overflow-x-auto h-64 border border-slate-200">
                {sqlSchema}
              </pre>
              <button 
                onClick={copySql}
                className="absolute top-3 right-3 p-2 bg-white rounded-lg shadow-md border border-slate-200 hover:bg-slate-50 transition-all flex items-center text-xs font-bold text-slate-600"
              >
                {copySuccess ? <Check size={14} className="text-green-500 mr-2" /> : <Copy size={14} className="mr-2" />}
                {copySuccess ? 'Copied!' : 'Copy SQL'}
              </button>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={fetchData}
                className="flex-1 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center"
              >
                <RefreshCw size={18} className="mr-2" />
                I've created the tables
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Show Auth screen if not logged in
  if (!session) {
    return <Auth />;
  }

  // 3. Main App Screen
  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} userEmail={session.user.email}>
      <div className="max-w-7xl mx-auto pb-20">
        {loading && (
          <div className="flex flex-col items-center justify-center h-96 space-y-4">
             <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-blue-600"></div>
             <p className="text-slate-500 font-medium animate-pulse">Syncing with Supabase...</p>
          </div>
        )}

        {!loading && (
          <>
            {activeTab === 'dashboard' && stats && (
              <Dashboard stats={stats} trips={trips} />
            )}

            {activeTab === 'trips' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800">Trip Management</h1>
                    <p className="text-slate-500 text-sm">Review and manage your daily transport logs</p>
                  </div>
                  <button 
                    onClick={openNewTripModal}
                    className="flex items-center bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/10 font-semibold"
                  >
                    <Plus size={20} className="mr-2" />
                    New Trip
                  </button>
                </div>
                <TripList trips={trips} vehicles={vehicles} onEdit={handleEditTrip} />
              </div>
            )}

            {activeTab === 'vehicles' && (
              <div className="space-y-6">
                 <div>
                    <h1 className="text-2xl font-bold text-slate-800">Fleet Management</h1>
                    <p className="text-slate-500 text-sm">Monitor vehicle health and compliance status</p>
                 </div>
                 <VehicleList vehicles={vehicles} />
              </div>
            )}
          </>
        )}

        {activeTab === 'trips' && !isTripModalOpen && (
           <button 
             onClick={openNewTripModal}
             className="fixed bottom-6 right-6 md:hidden bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 focus:outline-none z-40"
           >
             <Plus size={24} />
           </button>
        )}

        {isTripModalOpen && (
          <TripForm 
            vehicles={vehicles}
            initialData={editingTrip}
            onSave={handleSaveTrip}
            onCancel={() => {
              setIsTripModalOpen(false);
              setEditingTrip(null);
            }}
          />
        )}
      </div>
    </Layout>
  );
}

export default App;