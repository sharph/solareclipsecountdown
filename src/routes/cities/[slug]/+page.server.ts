
import { error } from '@sveltejs/kit';
import { hashedCities } from '$lib/cities';

export async function load({ fetch, params }) {
    const city = hashedCities[params.slug];
    if (!city) {
        return error(404, 'city not found');
    }

    return {
        city,
        title: `Solar Eclipse Countdown Timer for ${city.displayName}`
    };
}