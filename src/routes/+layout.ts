
import * as astronomy from '$lib/astronomy';

export async function load({ fetch }) {
  // startTime should be 6 hours ago
  const startTime = new Date(Date.now() - 6 * 60 * 60 * 1000);
  const eclipse = astronomy.SearchGlobalSolarEclipse(startTime);
  const citiesWithEclipse = await (await fetch('/api/cities-with-solar-eclipse')).json();
  return {
    eclipse,
    citiesWithEclipse,
  };
}