import { createClient, User, Session } from '@supabase/supabase-js';
import { Trip, Vehicle, DashboardStats, PaymentStatus, PaymentMethod } from '../types';

// Supabase Configuration from User Details
const SUPABASE_URL = 'https://bprbghscyohjlwqvgcms.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_f5FWH3cn3t-0Ib47Fu5sLA__vthYG4w';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth Methods
export const signUp = (email: string, password: string) => 
  supabase.auth.signUp({ email, password });

export const signIn = (email: string, password: string) => 
  supabase.auth.signInWithPassword({ email, password });

export const signOut = () => supabase.auth.signOut();

export const onAuthStateChange = (callback: (session: Session | null) => void) => {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
};

// Data Methods
export const getTrips = async (): Promise<{ data: Trip[], error: any }> => {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .order('date', { ascending: false });

  return { data: (data as Trip[]) || [], error };
};

export const getVehicles = async (): Promise<{ data: Vehicle[], error: any }> => {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*');

  return { data: (data as Vehicle[]) || [], error };
};

export const addTrip = async (trip: Omit<Trip, 'id'>): Promise<Trip | null> => {
  const totalAmount = trip.paymentDetails.totalAmount;
  const advancePaid = trip.paymentDetails.advancePaid;
  const balance = Number(totalAmount) - Number(advancePaid);
  
  const tripToInsert = {
    ...trip,
    paymentDetails: {
      ...trip.paymentDetails,
      balance,
      status: balance <= 0 ? PaymentStatus.PAID : PaymentStatus.PENDING
    },
    odometer: {
      ...trip.odometer,
      totalDistance: Number(trip.odometer.end) - Number(trip.odometer.start)
    }
  };

  const { data, error } = await supabase
    .from('trips')
    .insert([tripToInsert])
    .select();

  if (error) {
    console.error('Error adding trip:', error.message);
    return null;
  }

  return data[0] as Trip;
};

export const updateTrip = async (updatedTrip: Trip): Promise<Trip | null> => {
  const { data, error } = await supabase
    .from('trips')
    .update(updatedTrip)
    .eq('id', updatedTrip.id)
    .select();

  if (error) {
    console.error('Error updating trip:', error.message);
    return null;
  }

  return data[0] as Trip;
};

export const calculateStats = (tripData: Trip[]): DashboardStats => {
  let totalIncome = 0;
  let totalExpenses = 0;
  let pendingPayments = 0;

  tripData.forEach((trip) => {
    totalIncome += Number(trip.tripAmount || 0);
    
    const tripExpense = 
      Number(trip.expenses?.fuelCost || 0) + 
      Number(trip.expenses?.tollCharges || 0) + 
      Number(trip.expenses?.parkingCharges || 0) + 
      Number(trip.expenses?.driverPayment || 0) + 
      Number(trip.expenses?.otherExpenses || 0);
      
    totalExpenses += tripExpense;
    pendingPayments += Number(trip.paymentDetails?.balance || 0);
  });

  return {
    totalIncome,
    totalExpenses,
    netProfit: totalIncome - totalExpenses,
    pendingPayments,
    totalTrips: tripData.length,
  };
};

export const getVehicleStats = (vehicleId: string, tripData: Trip[]) => {
    const vehicleTrips = tripData.filter(t => t.vehicleId === vehicleId);
    const stats = calculateStats(vehicleTrips);
    return stats;
};