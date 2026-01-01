import apiClient, { config } from "@/lib/strapi/client";
// import { Card } from "@/components/article/card";
import { ListItem } from "@/components/article/ListItem";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/article/pagination";

export default async function Page({ params = {} }) {
    const { page = 1 } = await params;
    const blog = apiClient.single('blog');
    const blogData = await blog.find({
        populate: [
            'topArticles.tags',
            // 'tags',
        ],
    });
    const article = apiClient.collection('articles');
    const articleData = await article.find({
        filters: {
            $or: [
                { unlisted: { $eq: false } },
                { unlisted: { $null: true } }
            ]
        },
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
        pagination: {
            page,
            pageSize: config.pageSize,
        },
        sort: config.sort,
    });
    const { pagination } = articleData.meta;
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);
    const { topArticles } = blogData.data;
    return (
        <main>
            <div className="wrapper pt-[61px] pb-16">
                <h1 className="sr-only">博客文章</h1>
                {/* {
                    topArticles?.length > 0 && (
                        <>
                            <h2 className="text-3xl font-medium text-accent-foreground mt-16">置顶文章</h2>
                            <div className="mt-16 grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-2">
                                {topArticles.map((article) => (
                                    <Link href={`/article/${article.documentId}`} key={article.documentId}>
                                        <Card data={article} />
                                    </Link>
                                ))}
                            </div>
                            <div className="my-16 border-b border-border"></div>
                        </>
                    )
                } */}
                <h2 className="text-3xl font-medium text-accent-foreground mt-16">最新文章 {page > 1 && <span className="text-muted-foreground text-xl">第{page}页</span>}</h2>
                {/* <div className="mt-16 grid grid-cols-1 gap-16 sm:gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {articleData.data.map((article) => (
                        <Link href={`/article/${article.documentId}`} key={article.documentId}>
                            <Card data={article} />
                        </Link>
                    ))}
                </div> */}
                <ul role="list" className="mt-16 divide-y border-y">
                    {page == 1 && topArticles.map((article) => (
                        <ListItem data={article} key={article.documentId} isTop />
                    ))}
                    {articleData.data
                        .filter((article) => !topArticles.some((top) => top.documentId === article.documentId))
                        .map((article) => (
                            <ListItem data={article} key={article.documentId} />
                        ))}
                </ul>
                <div className="mb-16 mt-16 flex justify-center">
                    <Pagination
                        currentPage={parseInt(page, 10)}
                        totalPages={totalPages}
                        buildLink={(page) => `/article/page/${page}`}
                    />
                </div>
                {/* {
                    articleData.meta.pagination.page < articleData.meta.pagination.pageCount && (
                        <div className="mb-16 pt-16 flex justify-center border-t">
                            <Button variant="secondary" size="lg" className="cursor-pointer">
                                <Link href={`/article/page/${articleData.meta.pagination.page + 1}`}  >查看更多</Link>
                            </Button>
                        </div>
                    )
                } */}

            </div>
        </main>

    );
}
