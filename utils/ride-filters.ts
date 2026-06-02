import { RideFilters } from "@/components/filter-sheet";
import { Ride } from "@/types";

export function applyFilters(
  rides: Ride[],
  query: string,
  filters: RideFilters,
): Ride[] {
  let result = rides;

  if (query.length > 0) {
    const q = query.toLowerCase();
    result = result.filter(
      (r) =>
        r.vehicle.make.toLowerCase().includes(q) ||
        r.vehicle.model.toLowerCase().includes(q) ||
        r.destination.label.toLowerCase().includes(q) ||
        r.vehicle.category.toLowerCase().includes(q),
    );
  }

  if (filters.categories.length > 0) {
    result = result.filter((r) =>
      filters.categories.includes(r.vehicle.category),
    );
  }

  if (filters.propulsions.length > 0) {
    result = result.filter((r) =>
      filters.propulsions.includes(r.vehicle.propulsion),
    );
  }

  if (filters.maxPrice !== null) {
    result = result.filter((r) => r.priceNgn <= filters.maxPrice!);
  }

  if (filters.maxEta !== null) {
    result = result.filter((r) => r.etaMinutes <= filters.maxEta!);
  }

  if (filters.minCo2Saved !== null) {
    result = result.filter((r) => r.co2SavedKg >= filters.minCo2Saved!);
  }

  if (filters.selfRideOnly) {
    result = result.filter((r) => r.driver.totalTrips === 0);
  }

  return result;
}
