export const dynamic = "force-static";

export default function robots() {
    const url = process.env.NEXT_PUBLIC_URL
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            // disallow: '/private/',
        },
        sitemap: [
            url + '/sitemap.xml',
            // url + '/article/sitemap.xml',
        ],
    }
}