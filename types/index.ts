export enum VehicleType {
  Bike = "bike",
  Scooter = "scooter",
  Car = "car",
}

export enum RideStatus {
  Available = "available",
  Booked = "booked",
  Completed = "completed",
}

export interface Ride {
  id: string;
  vehicleType: VehicleType;
  etaMinutes: number;
  priceUsd: number;
  co2SavedKg: number;
  status: RideStatus;
  destination: {
    latitude: number;
    longitude: number;
    label: string;
  };
}

export interface BookingState {
  rideId: string;
  bookedAt: string;
  ecoPointsEarned: number;
}

export interface UserProfile {
  totalRides: number;
  totalCo2Saved: number;
  ecoPoints: number;
}
