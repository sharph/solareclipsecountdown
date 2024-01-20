import cities from 'all-the-cities';
import { SearchGlobalSolarEclipse, SearchLocalSolarEclipse, Observer, Equator, Body, Horizon } from '$lib/astronomy';

import slug from 'slug';

export const hashedCities: { [id: string]: any } = {};

let nextEclipse = SearchGlobalSolarEclipse(new Date(Date.now() - 24 * 60 * 60 * 1000));

function willHaveEclipse(city: cities.City) {
    if (!city.loc) {
        return { hasEclipse: false, hasTotalEclipse: false };
    }
    const lat = city.loc.coordinates[1];
    const lng = city.loc.coordinates[0];
    let time;
    if (nextEclipse.peak) {
        time = nextEclipse.peak.date;
    } else {
        return { hasEclipse: false, hasTotalEclipse: false };
    }
    const observer = new Observer(lat, lng, 0);
    const sunAt = Equator(Body.Sun, time, observer, true, true);
    if (Horizon(time, observer, sunAt.ra, sunAt.dec, 'normal').altitude < 0) {
        return { hasEclipse: false, hasTotalEclipse: false };
    }
    const localSolarEclipse = SearchLocalSolarEclipse(new Date(time.getTime() - 24 * 60 * 60 * 1000), observer);
    if (localSolarEclipse.peak.altitude < 0) {
        return { hasEclipse: false, hasTotalEclipse: false };
    }
    if ((time.getTime() - 24 * 60 * 60 * 1000
        < localSolarEclipse.peak.time.date.getTime()) &&
        localSolarEclipse.peak.time.date.getTime()
        < time.getTime() + 24 * 60 * 60 * 1000) {
        return { hasEclipse: true, hasTotalEclipse: !!localSolarEclipse.total_begin };
    }
    return { hasEclipse: false, hasTotalEclipse: false };
}

console.log('processing cities');
(cities).forEach((city) => {
    const cityCopy = { ...city };
    const displayName = city.country === 'US' ? `${city.name}, ${city.adminCode}, US` : `${city.name}, ${city.country}`;
    hashedCities[slug(displayName, { lower: true })] = cityCopy;
    hashedCities[slug(displayName, { lower: true })].displayName = displayName;
    hashedCities[slug(displayName, { lower: true })].slug = slug(displayName, { lower: true });
    if (!city.loc || city.population < 100000) {
        return;
    }
    const { hasEclipse, hasTotalEclipse } = willHaveEclipse(cityCopy);
    hashedCities[slug(displayName, { lower: true })].willHaveEclipse = hasEclipse;
    hashedCities[slug(displayName, { lower: true })].willHaveTotalEclipse = hasTotalEclipse;
});
console.log('done processing cities');