export enum PaymentMethod {
  CASH = 'Cash',
  UPI = 'UPI',
  BANK_TRANSFER = 'Bank Transfer',
}

export enum PaymentStatus {
  PAID = 'Paid',
  PENDING = 'Pending',
}

export interface Expense {
  fuelCost: number;
  tollCharges: number;
  parkingCharges: number;
  driverPayment: number;
  otherExpenses: number;
}

export interface DriverPaymentDetails {
  totalAmount: number;
  advancePaid: number;
  balance: number;
  status: PaymentStatus;
  method: PaymentMethod;
}

export interface OdometerReading {
  start: number;
  end: number;
  totalDistance: number;
}

export interface Trip {
  id: string;
  date: string; // ISO Date string
  vehicleId: string;
  driverName: string;
  customerName: string;
  pickupLocation: string;
  dropLocation: string;
  tripAmount: number; // Gross Income
  expenses: Expense;
  paymentDetails: DriverPaymentDetails;
  odometer: OdometerReading;
  notes: string;
  status: 'Completed' | 'In Progress' | 'Scheduled';
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  model: string;
  lastServiceDate: string;
  nextServiceDueDate: string;
  insuranceExpiryDate: string;
  pollutionExpiryDate: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  pendingPayments: number;
  totalTrips: number;
}