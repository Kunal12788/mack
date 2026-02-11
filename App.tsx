import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TripList from './components/TripList';
import TripForm from './components/TripForm';
import VehicleList from './components/VehicleList';
import DriverList from './components/DriverList';
import CustomerList from './components/CustomerList';
import DriverForm from './components/DriverForm';
import CustomerForm from './components/CustomerForm';
import Auth from './components/Auth';
import Welcome from './components/Welcome';
import { 
  getTrips, 
  getVehicles, 
  getDrivers, 
  getCustomers,
  addTrip, 
  updateTrip, 
  addDriver,
  addCustomer,
  calculateStats, 
  onAuthStateChange, 
  supabase 
} from './services/dataService';
import { Trip, Vehicle, Driver, Customer, DashboardStats } from './types';
import { Plus } from 'lucide-react';
import { Session } from '@supabase/supabase-js';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  
  const [viewingWelcome, setViewingWelcome] = useState(true);
  const [welcomeExiting, setWelcomeExiting] = useState(false);
  
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setViewingWelcome(false);
      }
    });

    const { data: { subscription } } = onAuthStateChange((newSession) => {
      setSession(newSession);
      if (newSession) {
        setViewingWelcome(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    if (!session) return;
    setLoading(true);
    try {
      const [tripsRes, vehiclesRes, driversRes, customersRes] = await Promise.all([
        getTrips(), 
        getVehicles(),
        getDrivers(),
        getCustomers()
      ]);
      setTrips(tripsRes.data);
      setVehicles(vehiclesRes.data);
      setDrivers(driversRes.data);
      setCustomers(customersRes.data);
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

  const handleWelcomeStart = () => {
    setWelcomeExiting(true);
    setTimeout(() => {
      setViewingWelcome(false);
    }, 1500);
  };

  const handleSaveTrip = async (trip: Trip | Omit<Trip, 'id'>) => {
    if ('id' in trip) {
       await updateTrip(trip as Trip);
    } else {
       await addTrip(trip);
    }
    await fetchData();
    setIsTripModalOpen(false);
    setEditingTrip(null);
  };

  const handleSaveDriver = async (driver: Omit<Driver, 'id'>) => {
    await addDriver(driver);
    await fetchData();
    setIsDriverModalOpen(false);
  };

  const handleSaveCustomer = async (customer: Omit<Customer, 'id'>) => {
    await addCustomer(customer);
    await fetchData();
    setIsCustomerModalOpen(false);
  };

  if (loading && !session && !viewingWelcome) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="loader-spinner"></div>
        <p className="text-slate-500 font-medium">Syncing Data...</p>
      </div>
    );
  }

  if (session) {
    return (
      <Layout activeTab={activeTab} onTabChange={setActiveTab} userEmail={session.user.email}>
        <div className="max-w-7xl mx-auto pb-20 px-2 sm:px-0">
          {loading && (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
               <div className="loader-spinner"></div>
               <p className="text-slate-500 font-medium animate-pulse">Syncing Cloud Ledger...</p>
            </div>
          )}
          {!loading && (
            <>
              {activeTab === 'dashboard' && stats && <Dashboard stats={stats} trips={trips} />}
              
              {activeTab === 'trips' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Operation Ledger</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60">Synchronized Trip Data</p>
                    </div>
                    <button onClick={() => setIsTripModalOpen(true)} className="flex items-center bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-600/20 font-black text-[10px] uppercase tracking-widest transition-all transform active:scale-95 group">
                        <Plus size={16} className="mr-2 group-hover:rotate-90 transition-transform" />New Operation
                    </button>
                  </div>
                  <TripList trips={trips} vehicles={vehicles} onEdit={(trip) => { setEditingTrip(trip); setIsTripModalOpen(true); }} />
                </div>
              )}

              {activeTab === 'vehicles' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Fleet Command</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60">Asset Tracking & Maintenance</p>
                    </div>
                    <VehicleList vehicles={vehicles} />
                </div>
              )}

              {activeTab === 'drivers' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Personnel Hub</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60">Human Capital Management</p>
                    </div>
                    <button onClick={() => setIsDriverModalOpen(true)} className="flex items-center bg-slate-950 text-white px-8 py-4 rounded-2xl hover:bg-blue-600 shadow-xl font-black text-[10px] uppercase tracking-widest transition-all transform active:scale-95 group">
                        <Plus size={16} className="mr-2 group-hover:rotate-90 transition-transform" />Register Personnel
                    </button>
                  </div>
                  <DriverList drivers={drivers} />
                </div>
              )}

              {activeTab === 'customers' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Client Ledger</h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60">CRM Database</p>
                    </div>
                    <button onClick={() => setIsCustomerModalOpen(true)} className="flex items-center bg-slate-950 text-white px-8 py-4 rounded-2xl hover:bg-emerald-600 shadow-xl font-black text-[10px] uppercase tracking-widest transition-all transform active:scale-95 group">
                        <Plus size={16} className="mr-2 group-hover:rotate-90 transition-transform" />Add Client Entity
                    </button>
                  </div>
                  <CustomerList customers={customers} />
                </div>
              )}
            </>
          )}

          {isTripModalOpen && <TripForm vehicles={vehicles} drivers={drivers} customers={customers} initialData={editingTrip} onSave={handleSaveTrip} onCancel={() => { setIsTripModalOpen(false); setEditingTrip(null); }} />}
          {isDriverModalOpen && <DriverForm onSave={handleSaveDriver} onCancel={() => setIsDriverModalOpen(false)} />}
          {isCustomerModalOpen && <CustomerForm onSave={handleSaveCustomer} onCancel={() => setIsCustomerModalOpen(false)} />}
        </div>
      </Layout>
    );
  }

  return (
    <div className={`relative min-h-screen bg-white`}>
      {(welcomeExiting || !viewingWelcome) && (
        <div className={`${viewingWelcome ? 'fixed inset-0 overflow-hidden' : 'relative min-h-screen flex flex-col'} z-0 animate-auth-entrance`}>
          <Auth />
        </div>
      )}
      {viewingWelcome && (
        <div className={`fixed inset-0 z-50`}>
          <Welcome onGetStarted={handleWelcomeStart} isExiting={welcomeExiting} />
        </div>
      )}
    </div>
  );
}

export default App;