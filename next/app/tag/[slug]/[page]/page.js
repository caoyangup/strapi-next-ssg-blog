import apiClient, { config, api, generateTagSlugAndPageStaticParams } from "@/lib/strapi/client";
import { generateMetadataObject } from "@/lib/shared/metadata";
import Page from "../page";

// 用于生成静态参数（比如 Next.js 的动态路由参数）
export async function generateStaticParams() {
    return await generateTagSlugAndPageStaticParams();
}

export default Page;

export async function generateMetadata({ params }) {
    const { slug, page } = await params;
    const { data: [data] } = await api.tags.find({
        filters: { slug },
        // populate: ['featuredImage', 'seo', 'tags'],
    });
    return generateMetadataObject(data.seo, {
        metaTitle: data.name + "标签的文章" + ` - 第${page}页`,
        // metaDescription: data.desc,
        // keywords: data.tags?.map(tag => tag.name).join(','),
        // metaImage: data.featuredImage || null,
    })
}
