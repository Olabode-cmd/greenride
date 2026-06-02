/*
 * Pure utility functions for eco-metric calculations.
 * Scoring rule: 1 EcoPoint per 0.1 kg of CO₂ saved, floored to
 * the nearest whole point so partial savings don't award points.
 */

export function calculateEcoPoints(co2SavedKg: number): number {
  if (co2SavedKg <= 0) return 0;
  return Math.floor(co2SavedKg / 0.1);
}

/*
 * Formats a CO₂ value for display. Returns a string like "1.80 kg".
 * Always two decimal places to keep metric numbers visually stable.
 */
export function formatCo2(co2Kg: number): string {
  return `${co2Kg.toFixed(2)} kg`;
}

/*
 * Returns a human-readable summary of total CO₂ saved across
 * all rides, rounded to two decimal places.
 */
export function totalCo2Label(co2Kg: number): string {
  return `${co2Kg.toFixed(2)} kg CO₂ saved`;
}
