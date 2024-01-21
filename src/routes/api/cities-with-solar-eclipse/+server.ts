import { hashedCities } from '$lib/cities';

function sortCities(a: any, b: any) {
    if (a.willHaveTotalEclipse && !b.willHaveTotalEclipse) {
        return -1;
    }
    if (!a.willHaveTotalEclipse && b.willHaveTotalEclipse) {
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
const citiesWithEclipseData = citiesWithEclipse.map((city) => hashedCities[city]).filter((city) => city.willHaveTotalEclipse || city.population > 500000);
citiesWithEclipseData.sort(sortCities);


export async function GET() {
    return new Response(JSON.stringify(citiesWithEclipseData), {
        headers: {
            'content-type': 'application/json',
        },
    });
}