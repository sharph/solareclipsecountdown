import sitemap from 'sitemap';

export async function GET({ fetch }) {
    const cities = await (await fetch('/api/cities-with-solar-eclipse')).json();
    const topPop = cities[0].population;
    const smStream = new sitemap.SitemapStream({
        hostname: 'https://eclipsecountdown.solar',
    });
    let count = 0;
    smStream.write({
        changefreq: 'daily',
        url: '/',
        priority: 0.6,
    });
    cities.forEach((city: any) => {
        const priority = (1 - (count / cities.length)) * 0.9;
        smStream.write({
            changefreq: 'daily',
            url: `/cities/${city.slug}`,
            priority: city.willHaveTotalEclipse ? priority : priority * 0.4,
        });
        count++;
    });
    smStream.end();
    return new Response(await sitemap.streamToPromise(smStream), {
        headers: {
            'content-type': 'application/xml',
        },
    });
}