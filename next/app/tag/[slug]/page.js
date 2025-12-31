import apiClient, { config, api, generateTagSlugStaticParams } from "@/lib/strapi/client";

import { ListItem } from "@/components/article/ListItem";
import { notFound } from 'next/navigation'
import { Pagination } from "@/components/article/pagination";
import { generateMetadataObject } from "@/lib/shared/metadata";

// 用于生成静态参数（比如 Next.js 的动态路由参数）
export async function generateStaticParams() {
    return await generateTagSlugStaticParams();
}

export default async function Page({ params }) {
    const { slug, page = 1 } = await params;
    const tag = apiClient.collection('tags');
    const tagData = await tag.find({
        populate: {
            articles: {
                count: true
            }
        },
        filters: {
            slug,
        },
        pagination: {
            page: 1,
            pageSize: 1,
        },
    });

    if (tagData.data.length === 0) return notFound()

    const article = apiClient.collection('articles');
    const articleData = await article.find({
        populate: {
            tags: {
                populate: {
                    articles: {
                        count: true,
                        filters: {
                            $or: [
                                { unlisted: { $eq: false } },
                                { unlisted: { $null: true } }
                            ]
                        }
                    }
                }
            },
        },
        filters: {
            $and: [
                { tags: { slug } },
                {
                    $or: [
                        { unlisted: { $eq: false } },
                        { unlisted: { $null: true } }
                    ]
                }
            ]
        },
        pagination: {
            page,
            pageSize: config.pageSize,
        },
        sort: config.sort,
    });
    const { pagination } = articleData.meta;
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);

    return (
        <main>
            <div className="wrapper pt-[61px] pb-16">
                <h1 className="sr-only- text-3xl font-medium text-accent-foreground mt-16">
                    {tagData.data[0].name} <span className="text-muted-foreground text-xl">标签的文章 第{page}页</span>
                </h1>

                <ul role="list" className="mt-16 divide-y border-y">

                    {articleData.data
                        .map((article) => (
                            <ListItem data={article} key={article.documentId} />
                        ))}
                </ul>
                <div className="mb-16 mt-16 flex justify-center">
                    <Pagination
                        currentPage={parseInt(page, 10)}
                        totalPages={totalPages}
                        buildLink={(page) => `/tag/${slug}/${page}`}
                    />
                </div>
            </div>
        </main>
    );
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const { data: [data] } = await api.tags.find({
        filters: { slug },
        // populate: ['featuredImage', 'seo', 'tags'],
    });
    return generateMetadataObject(data.seo, {
        metaTitle: data.name + "标签的文章" + ` - 第1页`,
        // metaDescription: data.desc,
        // keywords: data.tags?.map(tag => tag.name).join(','),
        // metaImage: data.featuredImage || null,
    })
}
