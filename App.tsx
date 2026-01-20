import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TripList from './components/TripList';
import TripForm from './components/TripForm';
import VehicleList from './components/VehicleList';
import { getTrips, getVehicles, addTrip, updateTrip, calculateStats } from './services/dataService';
import { Trip, Vehicle, DashboardStats } from './types';
import { Plus } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tripsData, vehiclesData] = await Promise.all([getTrips(), getVehicles()]);
      setTrips(tripsData);
      setVehicles(vehiclesData);
      setStats(calculateStats(tripsData));
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveTrip = async (trip: Trip | Omit<Trip, 'id'>) => {
    if ('id' in trip) {
       await updateTrip(trip);
    } else {
       await addTrip(trip);
    }
    await fetchData(); // Refresh data to update stats
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

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="max-w-7xl mx-auto pb-20">
        
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                  <h1 className="text-2xl font-bold text-slate-800">Trip Management</h1>
                  <button 
                    onClick={openNewTripModal}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
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
                 <h1 className="text-2xl font-bold text-slate-800">Fleet Management</h1>
                 <VehicleList vehicles={vehicles} />
              </div>
            )}
          </>
        )}

        {/* Floating Action Button for Mobile */}
        {activeTab === 'trips' && !isTripModalOpen && (
           <button 
             onClick={openNewTripModal}
             className="fixed bottom-6 right-6 md:hidden bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none z-40"
           >
             <Plus size={24} />
           </button>
        )}

        {/* Modals */}
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