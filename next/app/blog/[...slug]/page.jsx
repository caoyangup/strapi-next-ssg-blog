import { redirect } from "next/navigation";
import { generateArticleSlugStaticParams } from "@/lib/strapi/client";

// Generate static params for all existing article slugs
export async function generateStaticParams() {
    const articleParams = await generateArticleSlugStaticParams();

    // Convert single slug params to array format for catch-all  
    // Also add common sub-paths like /page/1, /page/2, etc.
    const params = [];

    // Add article slugs
    articleParams.forEach(({ slug }) => {
        params.push({ slug: [slug] });
    });

    // Add pagination pages (up to 20 pages should be enough)
    for (let i = 1; i <= 20; i++) {
        params.push({ slug: ["page", i.toString()] });
    }

    // Add preview path
    params.push({ slug: ["preview"] });

    return params;
}

export default async function BlogCatchAllRedirect({ params }) {
    const { slug } = await params;
    const path = slug ? slug.join("/") : "";

    // Redirect from /blog/* to /article/*
    redirect(`/article/${path}`);
}
