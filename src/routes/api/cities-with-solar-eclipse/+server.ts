import { hashedCities } from '$lib/cities';

function sortCities(a: any, b: any) {
    if (a.willHaveTotalEclipse && !b.willHaveTotalEclipse) {
        return -1;
    }
    if (!a.willHaveTotalEclipse && b.willHaveTotalEclipse) {
        return 1;
    }
    if (a.obscuration > b.obscuration) {
        return -1;
    }
    if (a.obscuration < b.obscuration) {
        return 1;
    }
    if (a.population < b.population) {
        return 1;
    }
    if (a.population > b.population) {
        return -1;
    }
    return 0;
}

const citiesWithEclipse = Object.keys(hashedCities).filter((city) => hashedCities[city].willHaveEclipse);
const citiesWithEclipseData = citiesWithEclipse.map((city) => hashedCities[city]).filter(
    (city) => city.willHaveTotalEclipse || (city.population > 500000 && city.obscuration > 0.75) ||
        (city.population > 250000 && city.obscuration > 0.9) ||
        (city.population > 1000000 && city.obscuration > 0.5));
citiesWithEclipseData.sort(sortCities);


export async function GET() {
    return new Response(JSON.stringify(citiesWithEclipseData), {
        headers: {
            'content-type': 'application/json',
        },
    });
}