export const dynamic = "force-static";
import { api } from "@/lib/strapi/client";
export default async function sitemap() {
    const url = process.env.NEXT_PUBLIC_URL
    // 第一次请求第一页，主要是为了获取分页信息
    const articleData = await api.articles.find({
        filters: {
            $or: [
                { unlisted: { $eq: false } },
                { unlisted: { $null: true } }
            ]
        },
        pagination: {
            page: 1,
            pageSize: 100,
        }
    });

    // console.log('articleData', articleData);

    // 从 meta 中拿到分页信息
    const { pagination } = articleData.meta;
    // 计算总页数
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);

    const allArticleParams = [];

    // 遍历所有分页，逐页请求数据
    for (let i = 1; i <= totalPages; i++) {
        const forArticle = await api.articles.find({
            filters: {
                $or: [
                    { unlisted: { $eq: false } },
                    { unlisted: { $null: true } }
                ]
            },
            pagination: {
                page: i,
                pageSize: 100,
            }
        });

        // 遍历每条文章数据，收集 slug
        forArticle.data.forEach((article) => {
            article?.slug && allArticleParams.push({
                url: `${url}/article/${article.slug}`,
                lastModified: article.publishedAt,
            });
        });
    }
    // 返回所有文章的参数
    return [{
        url: url,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 1,
    },
    {
        url: url + '/blog',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.5,
    }, ...allArticleParams];

}

