import { strapiImage } from '../strapi/strapiImage';

export function generateMetadataObject(seo, seo2 = { metaTitle: undefined, metaDescription: undefined, keywords: undefined, metaImage: undefined }) {
    // Helper to find social media metadata
    const findSocial = (network) => {
        const socialData = seo?.metaSocial?.find(
            (s) => s.socialNetwork.toLowerCase() === network.toLowerCase()
        );
        return socialData || {};
    };

    const facebookData = findSocial('Facebook');
    const twitterData = findSocial('Twitter');

    const metaTitle = seo?.metaTitle || seo2?.metaTitle || 'Default Title';
    const metaDescription = seo?.metaDescription || seo2?.metaDescription || 'Default Description';
    const keywords = seo?.keywords || seo2?.keywords || null;
    const metaImageUrl = seo?.metaImage?.url
        ? strapiImage(seo.metaImage.url)
        : seo2?.metaImage?.url
            ? strapiImage(seo2.metaImage.url)
            : undefined;

    return {
        // Basic Metadata
        title: metaTitle,
        description: metaDescription,
        keywords: keywords ? keywords.split(',').map(k => k.trim()) : undefined,

        // Open Graph (Facebook)
        openGraph: {
            title: facebookData.title || metaTitle,
            description: facebookData.description || metaDescription,
            images: facebookData.image?.url
                ? [{ url: strapiImage(facebookData.image.url) }]
                : (metaImageUrl ? [{ url: metaImageUrl }] : []),
            type: 'website',
        },

        // Twitter
        twitter: {
            card: 'summary_large_image',
            title: twitterData.title || metaTitle,
            description: twitterData.description || metaDescription,
            images: twitterData.image?.url
                ? [strapiImage(twitterData.image.url)]
                : (metaImageUrl ? [metaImageUrl] : []),
        },

        // Other Metadata
        ...(seo?.canonicalURL && { alternates: { canonical: seo.canonicalURL } }),
        ...(seo?.metaRobots && { robots: seo.metaRobots }),
    };
}