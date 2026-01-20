import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TripList from './components/TripList';
import TripForm from './components/TripForm';
import VehicleList from './components/VehicleList';
import Auth from './components/Auth';
import Welcome from './components/Welcome';
import { getTrips, getVehicles, addTrip, updateTrip, calculateStats, onAuthStateChange, supabase } from './services/dataService';
import { Trip, Vehicle, DashboardStats } from './types';
import { Plus } from 'lucide-react';
import { Session } from '@supabase/supabase-js';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  
  const [viewingWelcome, setViewingWelcome] = useState(true);
  const [welcomeExiting, setWelcomeExiting] = useState(false);
  
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
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
      const [tripsRes, vehiclesRes] = await Promise.all([getTrips(), getVehicles()]);
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

  const handleWelcomeStart = () => {
    setWelcomeExiting(true);
    // Cinema-Grade Cross-Fade: matches the 1500ms exit transition
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

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    setIsTripModalOpen(true);
  };

  const openNewTripModal = () => {
    setEditingTrip(null);
    setIsTripModalOpen(true);
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
        <div className="max-w-7xl mx-auto pb-20">
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
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-2xl font-bold text-slate-800">Trip Management</h1>
                    <button onClick={openNewTripModal} className="flex items-center bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 shadow-lg font-semibold"><Plus size={20} className="mr-2" />New Trip</button>
                  </div>
                  <TripList trips={trips} vehicles={vehicles} onEdit={handleEditTrip} />
                </div>
              )}
              {activeTab === 'vehicles' && <div className="space-y-6"><h1 className="text-2xl font-bold text-slate-800">Fleet Management</h1><VehicleList vehicles={vehicles} /></div>}
            </>
          )}
          {isTripModalOpen && <TripForm vehicles={vehicles} initialData={editingTrip} onSave={handleSaveTrip} onCancel={() => { setIsTripModalOpen(false); setEditingTrip(null); }} />}
        </div>
      </Layout>
    );
  }

  return (
    <div className={`relative min-h-screen ${viewingWelcome ? 'overflow-hidden' : ''} bg-white`}>
      {/* Auth screen (Handles its own scrolling) */}
      {(welcomeExiting || !viewingWelcome) && (
        <div className={`${viewingWelcome ? 'absolute inset-0' : 'relative w-full min-h-screen'} z-0 animate-auth-entrance`}>
          <Auth />
        </div>
      )}
      
      {/* Welcome Splash Screen (Dissolve Transition - Fades out on top) */}
      {viewingWelcome && (
        <div className={`fixed inset-0 z-50`}>
          <Welcome 
            onGetStarted={handleWelcomeStart} 
            isExiting={welcomeExiting} 
          />
        </div>
      )}
    </div>
  );
}

export default App;