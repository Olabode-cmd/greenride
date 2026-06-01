export enum VehicleCategory {
  Bike = "bike",
  Scooter = "scooter",
  Car = "car",
}

export enum VehicleCondition {
  Excellent = "excellent",
  Good = "good",
  Fair = "fair",
}

export enum PropulsionType {
  HumanPowered = "human-powered",
  Electric = "electric",
  Hybrid = "hybrid",
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  category: VehicleCategory;
  make: string;
  model: string;
  year: number;
  colour: string;
  propulsion: PropulsionType;
  condition: VehicleCondition;
  seatingCapacity: number;
  rangeKm: number;
  topSpeedKmh: number;
  features: string[];
  imageUrl: string;
  rating: number;
  totalRatings: number;
}
