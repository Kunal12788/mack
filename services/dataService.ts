import { Trip, Vehicle, DashboardStats, PaymentStatus, PaymentMethod } from '../types';

// Mock Data
const MOCK_VEHICLES: Vehicle[] = [
  {
    id: 'v1',
    registrationNumber: 'KA-01-AB-1234',
    model: 'Toyota Innova Crysta',
    lastServiceDate: '2023-10-15',
    nextServiceDueDate: '2024-01-15',
    insuranceExpiryDate: '2024-05-20',
    pollutionExpiryDate: '2024-03-10',
  },
  {
    id: 'v2',
    registrationNumber: 'KA-05-XY-9876',
    model: 'Suzuki Ertiga',
    lastServiceDate: '2023-11-01',
    nextServiceDueDate: '2024-02-01',
    insuranceExpiryDate: '2024-08-15',
    pollutionExpiryDate: '2024-02-28',
  },
  {
    id: 'v3',
    registrationNumber: 'TN-09-ZZ-5555',
    model: 'Force Traveler',
    lastServiceDate: '2023-09-20',
    nextServiceDueDate: '2023-12-20',
    insuranceExpiryDate: '2024-01-10',
    pollutionExpiryDate: '2024-01-15',
  },
];

const MOCK_TRIPS: Trip[] = [
  {
    id: 't1',
    date: '2023-11-20',
    vehicleId: 'v1',
    driverName: 'Ramesh Kumar',
    customerName: 'Tech Corp',
    pickupLocation: 'Airport',
    dropLocation: 'Electronic City',
    tripAmount: 4500,
    expenses: {
      fuelCost: 1200,
      tollCharges: 150,
      parkingCharges: 100,
      driverPayment: 500,
      otherExpenses: 0,
    },
    paymentDetails: {
      totalAmount: 500,
      advancePaid: 500,
      balance: 0,
      status: PaymentStatus.PAID,
      method: PaymentMethod.UPI,
    },
    odometer: {
      start: 10500,
      end: 10580,
      totalDistance: 80,
    },
    notes: 'Client requested waiting for 1 hour.',
    status: 'Completed',
  },
  {
    id: 't2',
    date: '2023-11-21',
    vehicleId: 'v2',
    driverName: 'Suresh Singh',
    customerName: 'Family Tour',
    pickupLocation: 'Indiranagar',
    dropLocation: 'Mysore',
    tripAmount: 8000,
    expenses: {
      fuelCost: 2500,
      tollCharges: 300,
      parkingCharges: 0,
      driverPayment: 1000,
      otherExpenses: 200,
    },
    paymentDetails: {
      totalAmount: 1000,
      advancePaid: 500,
      balance: 500,
      status: PaymentStatus.PENDING,
      method: PaymentMethod.CASH,
    },
    odometer: {
      start: 45000,
      end: 45300,
      totalDistance: 300,
    },
    notes: '',
    status: 'Completed',
  },
  {
    id: 't3',
    date: '2023-11-22',
    vehicleId: 'v1',
    driverName: 'Ramesh Kumar',
    customerName: 'Hotel Royal',
    pickupLocation: 'City Center',
    dropLocation: 'Airport',
    tripAmount: 3500,
    expenses: {
      fuelCost: 800,
      tollCharges: 100,
      parkingCharges: 50,
      driverPayment: 400,
      otherExpenses: 0,
    },
    paymentDetails: {
      totalAmount: 400,
      advancePaid: 0,
      balance: 400,
      status: PaymentStatus.PENDING,
      method: PaymentMethod.BANK_TRANSFER,
    },
    odometer: {
      start: 10580,
      end: 10620,
      totalDistance: 40,
    },
    notes: 'Night pickup',
    status: 'Completed',
  },
];

// In-memory storage simulation
let trips: Trip[] = [...MOCK_TRIPS];
let vehicles: Vehicle[] = [...MOCK_VEHICLES];

export const getTrips = (): Promise<Trip[]> => {
  return new Promise((resolve) => setTimeout(() => resolve([...trips]), 300));
};

export const getVehicles = (): Promise<Vehicle[]> => {
  return new Promise((resolve) => setTimeout(() => resolve([...vehicles]), 300));
};

export const addTrip = (trip: Omit<Trip, 'id'>): Promise<Trip> => {
  return new Promise((resolve) => {
    const newTrip = { ...trip, id: Math.random().toString(36).substr(2, 9) };
    // Auto-calculate logic just in case the UI didn't catch it
    newTrip.paymentDetails.balance = newTrip.paymentDetails.totalAmount - newTrip.paymentDetails.advancePaid;
    newTrip.paymentDetails.status = newTrip.paymentDetails.balance <= 0 ? PaymentStatus.PAID : PaymentStatus.PENDING;
    newTrip.odometer.totalDistance = newTrip.odometer.end - newTrip.odometer.start;

    trips = [newTrip, ...trips];
    resolve(newTrip);
  });
};

export const updateTrip = (updatedTrip: Trip): Promise<Trip> => {
    return new Promise((resolve) => {
        trips = trips.map(t => t.id === updatedTrip.id ? updatedTrip : t);
        resolve(updatedTrip);
    })
}

export const calculateStats = (tripData: Trip[]): DashboardStats => {
  let totalIncome = 0;
  let totalExpenses = 0;
  let pendingPayments = 0;

  tripData.forEach((trip) => {
    totalIncome += trip.tripAmount;
    
    const tripExpense = 
      trip.expenses.fuelCost + 
      trip.expenses.tollCharges + 
      trip.expenses.parkingCharges + 
      trip.expenses.driverPayment + 
      trip.expenses.otherExpenses;
      
    totalExpenses += tripExpense;
    pendingPayments += trip.paymentDetails.balance;
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
}