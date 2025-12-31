import apiClient, { config, generateArticleCategoriesSlugAndPageStaticParams } from "@/lib/strapi/client";
import { Card } from "@/components/article/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from 'next/navigation'
import { Pagination } from "@/components/article/pagination";



// 用于生成静态参数（比如 Next.js 的动态路由参数）
export async function generateStaticParams() {
    return await generateArticleCategoriesSlugAndPageStaticParams();
}


export default async function Page({ params }) {
    // 分类信息
    const { slug, page } = await params;
    const categories = apiClient.collection('article-categories');
    const categoryData = await categories.find({
        filters: {
            slug: slug
        }
    });
    if (!categoryData) return notFound()
    const { name, desc } = categoryData.data[0];

    //文字信息
    const articles = apiClient.collection('articles');
    const articlesData = await articles.find({
        filters: {
            $and: [
                { category: { slug: slug } },
                {
                    $or: [
                        { unlisted: { $eq: false } },
                        { unlisted: { $null: true } }
                    ]
                }
            ]
        },
        populate: [
            'cardImage',
        ],
        pagination: {
            page: parseInt(page),
            pageSize: config.pageSize,
        },
        sort: config.sort,
    });

    const { pagination } = articlesData.meta;
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);

    return (
        <main>
            <div className="wrapper pt-[61px] pb-16">
                <h1 className="text-3xl font-medium text-accent-foreground mt-16">{name} 第{page}页</h1>

                <div className="mt-16 grid grid-cols-1 gap-16 sm:gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {articlesData.data.map((article) => (
                        <Link href={`/article/${article.documentId}`} key={article.documentId}>
                            <Card data={article} />
                        </Link>
                    ))}
                </div>
                <div className="mb-16 mt-16 flex justify-center">
                    <Pagination
                        currentPage={parseInt(page, 10)}
                        totalPages={totalPages}
                        buildLink={(page) => `/article/category/${slug}/page/${page}`} // Assuming your route is /article/pages/[number]
                    />
                </div>
            </div>
        </main>

    );
}
