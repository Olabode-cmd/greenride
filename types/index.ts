/*
 * Global type definitions for GreenRide.
 * All shared interfaces and enums live here.
 * Vehicle-specific types are in ./vehicle.ts and re-exported below.
 */

export { PropulsionType, VehicleCategory, VehicleCondition } from "./vehicle";
export type { Vehicle } from "./vehicle";

export enum RideStatus {
  Available = "available",
  Booked = "booked",
  Completed = "completed",
}

export interface RideDestination {
  latitude: number;
  longitude: number;
  label: string;
  address: string;
  distanceKm: number;
}

export interface Driver {
  name: string;
  avatarUrl: string;
  rating: number;
  totalTrips: number;
}

export interface Ride {
  id: string;
  vehicle: import("./vehicle").Vehicle;
  driver: Driver;
  etaMinutes: number;
  durationMinutes: number;
  priceNgn: number;
  co2SavedKg: number;
  co2ComparisonLabel: string;
  status: RideStatus;
  destination: RideDestination;
  tags: string[];
}

export interface BookingRecord {
  rideId: string;
  vehicleId: string;
  bookedAt: string;
  ecoPointsEarned: number;
  co2SavedKg: number;
}

export interface UserProfile {
  totalRides: number;
  totalCo2Saved: number;
  ecoPoints: number;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/*
 * Store shape interfaces live here so stores contain zero
 * locally-declared types — they only import and implement.
 */

export interface RideStoreState {
  rides: Ride[];
  isLoading: boolean;
  error: string | null;
  selectedRide: Ride | null;
  fetchRides: () => Promise<void>;
  selectRide: (ride: Ride) => void;
  clearSelection: () => void;
}

export interface UserStoreState {
  totalRides: number;
  totalCo2Saved: number;
  ecoPoints: number;
  recordBooking: (ride: Ride) => void;
  reset: () => void;
}
