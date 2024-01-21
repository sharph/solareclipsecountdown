
export async function GET() {
    return new Response(`User-agent: *
Allow: /
Sitemap: https://eclipsecountdown.solar/sitemap.xml`, {
        headers: {
            'content-type': 'text/plain',
        },
    });
}