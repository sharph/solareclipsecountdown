import { SearchLocalSolarEclipse, Observer, LocalSolarEclipseInfo } from "$lib/astronomy";

export async function load({ data }) {
    const observer = new Observer(data.city.loc.coordinates[1], data.city.loc.coordinates[0], 0);
    const localEclipse = SearchLocalSolarEclipse(
        new Date(Date.now() - 6 * 60 * 60 * 1000),
        observer,
    );
    return {
        localEclipse,
        ...data
    }
}
