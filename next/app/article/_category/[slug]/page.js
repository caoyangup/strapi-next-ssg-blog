import apiClient, { config, generateArticleCategoriesSlugStaticParams } from "@/lib/strapi/client";
import { Card } from "@/components/article/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from 'next/navigation'

// 用于生成静态参数（比如 Next.js 的动态路由参数）
export async function generateStaticParams() {
    return await generateArticleCategoriesSlugStaticParams();
}


export default async function Page({ params }) {
    // 分类信息
    const { slug } = await params;
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
            page: 1,
            pageSize: config.pageSize,
        },
        sort: config.sort,
    });



    return (
        <main>
            <div className="wrapper pt-[61px] pb-16">
                <h1 className="text-3xl font-medium text-accent-foreground mt-16">{name}</h1>

                <div className="mt-16 grid grid-cols-1 gap-16 sm:gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {articlesData.data.map((article) => (
                        <Link href={`/article/${article.documentId}`} key={article.documentId}>
                            <Card data={article} />
                        </Link>
                    ))}
                </div>
                {
                    articlesData.meta.pagination.page < articlesData.meta.pagination.pageCount && (
                        <div className="mb-16 mt-16 flex justify-center">
                            <Button variant="secondary" size="lg" className="cursor-pointer">
                                <Link href={`/article/category/${slug}/page/${articlesData.meta.pagination.page + 1}`}  >查看更多</Link>
                            </Button>
                        </div>
                    )
                }
            </div>
        </main>

    );
}
