/*
 * Ride service. Returns available rides from typed mock data.
 * Wrapped in a resolved promise so the store treats it identically
 * to a real async network call.
 */
import { Ride } from "../types";
import { mockRides } from "./mock-data/rides";

export async function getRides(): Promise<Ride[]> {
  return Promise.resolve(mockRides);
}
