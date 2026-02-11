import { Trip, Vehicle, DashboardStats, PaymentStatus, PaymentMethod, Driver, Customer } from '../types';

// --- MOCK DATA FOR INITIALIZATION ---

const MOCK_VEHICLES: Vehicle[] = [
  { id: 'v1', registrationNumber: 'KA-01-HH-1234', model: 'Toyota Innova Crysta', lastServiceDate: '2023-12-01', nextServiceDueDate: '2024-03-01', insuranceExpiryDate: '2024-11-20', pollutionExpiryDate: '2024-05-15' },
  { id: 'v2', registrationNumber: 'KA-05-MJ-5678', model: 'Swift Dzire', lastServiceDate: '2024-01-15', nextServiceDueDate: '2024-04-15', insuranceExpiryDate: '2024-08-10', pollutionExpiryDate: '2024-02-28' },
  { id: 'v3', registrationNumber: 'TN-09-BE-9012', model: 'Tempo Traveller', lastServiceDate: '2023-11-10', nextServiceDueDate: '2024-02-10', insuranceExpiryDate: '2024-06-30', pollutionExpiryDate: '2024-03-01' },
];

const MOCK_DRIVERS: Driver[] = [
  { id: 'd1', name: 'Rajesh Kumar', phone: '9876543210', licenseNumber: 'DL-1234567890123', status: 'Active', joiningDate: '2022-05-15' },
  { id: 'd2', name: 'Suresh Singh', phone: '8765432109', licenseNumber: 'DL-9876543210987', status: 'Active', joiningDate: '2023-01-20' },
];

const MOCK_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Infosys Ltd', phone: '080-12345678', email: 'transport@infosys.com', address: 'Electronics City, Bangalore' },
  { id: 'c2', name: 'Wipro Technologies', phone: '080-87654321', email: 'logistics@wipro.com', address: 'Sarjapur Road, Bangalore' },
];

const MOCK_TRIPS: Trip[] = [
  {
    id: 't1', date: new Date().toISOString(), vehicleId: 'v1', driverId: 'd1', driverName: 'Rajesh Kumar', customerId: 'c1', customerName: 'Infosys Ltd',
    pickupLocation: 'Airport', dropLocation: 'Electronic City', tripAmount: 3500,
    expenses: { fuelCost: 1000, tollCharges: 150, parkingCharges: 50, driverPayment: 300, otherExpenses: 0 },
    paymentDetails: { totalAmount: 3500, advancePaid: 0, balance: 3500, status: PaymentStatus.PENDING, method: PaymentMethod.CASH },
    odometer: { start: 10500, end: 10580, totalDistance: 80 },
    notes: 'Airport Pickup', status: 'Completed'
  }
];

// --- LOCAL STORAGE HELPERS ---

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getFromStorage = <T>(key: string, defaultData: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(stored);
  } catch (e) {
    console.error("Storage Error", e);
    return defaultData;
  }
};

const setInStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- AUTH MOCK ---

const MOCK_SESSION = {
  access_token: 'mock-token',
  token_type: 'bearer',
  expires_in: 3600,
  refresh_token: 'mock-refresh',
  user: {
    id: 'user-123',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'asd@gmail.com',
    email_confirmed_at: new Date().toISOString(),
    phone: '',
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: {},
    identities: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
};

let authSubscribers: ((session: any) => void)[] = [];

const notifySubscribers = (session: any) => {
  authSubscribers.forEach(cb => cb(session));
};

// --- DATA SERVICES API ---

export const supabase = {
  auth: {
    getSession: async () => {
      const session = localStorage.getItem('navexa_session');
      return { data: { session: session ? JSON.parse(session) : null }, error: null };
    },
    signInWithPassword: async ({ email, password }: any) => {
      await delay(600); // Simulate network
      // Allow the demo credential, or any credential for testing if desired.
      if (email === 'asd@gmail.com' && password === '123') {
        const session = { ...MOCK_SESSION, user: { ...MOCK_SESSION.user, email } };
        localStorage.setItem('navexa_session', JSON.stringify(session));
        notifySubscribers(session);
        return { data: { session, user: session.user }, error: null };
      }
      return { data: { session: null, user: null }, error: { message: 'Invalid credentials. Try asd@gmail.com / 123' } };
    },
    signUp: async ({ email, password }: any) => {
       await delay(600);
       const session = { ...MOCK_SESSION, user: { ...MOCK_SESSION.user, email } };
       localStorage.setItem('navexa_session', JSON.stringify(session));
       notifySubscribers(session);
       return { data: { session, user: session.user }, error: null };
    },
    signOut: async () => {
      await delay(300);
      localStorage.removeItem('navexa_session');
      notifySubscribers(null);
      return { error: null };
    },
    onAuthStateChange: (callback: any) => {
       // Mock stub, implementation handled by the exported function below
       return { data: { subscription: { unsubscribe: () => {} } } };
    }
  }
};

export const signUp = (email: string, password: string) => supabase.auth.signUp({ email, password });
export const signIn = (email: string, password: string) => supabase.auth.signInWithPassword({ email, password });
export const signOut = () => supabase.auth.signOut();

export const onAuthStateChange = (callback: (session: any) => void) => {
  authSubscribers.push(callback);
  
  // Immediate check
  const session = localStorage.getItem('navexa_session');
  if (session) {
      try {
          callback(JSON.parse(session));
      } catch(e) {
          callback(null);
      }
  } else {
      callback(null);
  }
  
  return { data: { subscription: { unsubscribe: () => {
    authSubscribers = authSubscribers.filter(cb => cb !== callback);
  }}}}
};

// --- BUSINESS LOGIC ---

export const getTrips = async (): Promise<{ data: Trip[], error: any }> => {
  await delay(300);
  const data = getFromStorage('navexa_trips', MOCK_TRIPS);
  // Sort by date descending
  data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return { data, error: null };
};

export const getVehicles = async (): Promise<{ data: Vehicle[], error: any }> => {
  await delay(300);
  const data = getFromStorage('navexa_vehicles', MOCK_VEHICLES);
  return { data, error: null };
};

export const getDrivers = async (): Promise<{ data: Driver[], error: any }> => {
  await delay(300);
  const data = getFromStorage('navexa_drivers', MOCK_DRIVERS);
  return { data, error: null };
};

export const getCustomers = async (): Promise<{ data: Customer[], error: any }> => {
  await delay(300);
  const data = getFromStorage('navexa_customers', MOCK_CUSTOMERS);
  return { data, error: null };
};

export const addDriver = async (driver: Omit<Driver, 'id'>): Promise<Driver | null> => {
  await delay(300);
  const drivers = getFromStorage('navexa_drivers', MOCK_DRIVERS);
  const newDriver = { ...driver, id: `d${Date.now()}` };
  const updated = [newDriver, ...drivers];
  setInStorage('navexa_drivers', updated);
  return newDriver;
};

export const addCustomer = async (customer: Omit<Customer, 'id'>): Promise<Customer | null> => {
  await delay(300);
  const customers = getFromStorage('navexa_customers', MOCK_CUSTOMERS);
  const newCustomer = { ...customer, id: `c${Date.now()}` };
  const updated = [newCustomer, ...customers];
  setInStorage('navexa_customers', updated);
  return newCustomer;
};

export const addTrip = async (trip: Omit<Trip, 'id'>): Promise<Trip | null> => {
  await delay(300);
  const totalAmount = trip.paymentDetails.totalAmount;
  const advancePaid = trip.paymentDetails.advancePaid;
  const balance = Number(totalAmount) - Number(advancePaid);
  
  const tripToInsert: Trip = {
    ...trip,
    id: `t${Date.now()}`,
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

  const trips = getFromStorage('navexa_trips', MOCK_TRIPS);
  const updated = [tripToInsert, ...trips];
  setInStorage('navexa_trips', updated);
  return tripToInsert;
};

export const updateTrip = async (updatedTrip: Trip): Promise<Trip | null> => {
  await delay(300);
  const trips = getFromStorage('navexa_trips', MOCK_TRIPS);
  const index = trips.findIndex(t => t.id === updatedTrip.id);
  
  // Recalculate balance logic on update
  const totalAmount = updatedTrip.paymentDetails.totalAmount;
  const advancePaid = updatedTrip.paymentDetails.advancePaid;
  const balance = Number(totalAmount) - Number(advancePaid);
  
  const finalTrip = {
      ...updatedTrip,
      paymentDetails: {
          ...updatedTrip.paymentDetails,
          balance,
          status: balance <= 0 ? PaymentStatus.PAID : PaymentStatus.PENDING
      }
  };

  if (index !== -1) {
    trips[index] = finalTrip;
    setInStorage('navexa_trips', trips);
    return finalTrip;
  }
  return null;
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