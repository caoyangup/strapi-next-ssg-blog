"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { SlashIcon, AlertTriangle, Loader2 } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { strapiImage } from "@/lib/strapi/strapiImage";
import ArticleContent from "../[slug]/ArticleContent";
import AccordionArticleToc from "../[slug]/AccordionArticleToc";
import { Separator } from "@/components/ui/separator";
import font from "@/lib/font";

function PreviewContent() {
    const searchParams = useSearchParams();
    const slug = searchParams.get("slug");
    const status = searchParams.get("status") || "published";
    const secret = searchParams.get("secret");

    const [articleData, setArticleData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!slug) {
            setError("缺少文章 slug 参数");
            setLoading(false);
            return;
        }

        const fetchArticle = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
                const params = new URLSearchParams({
                    "filters[slug][$eq]": slug,
                    "populate[featuredImage]": "true",
                    "populate[tags]": "true",
                });

                // Add status for draft content
                if (status === "draft") {
                    params.set("status", "draft");
                }

                const response = await fetch(`${apiUrl}/api/articles?${params}`, {
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || ""}`,
                    },
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error(`获取文章失败: ${response.status}`);
                }

                const result = await response.json();

                if (!result.data || result.data.length === 0) {
                    setError("文章未找到");
                } else {
                    setArticleData(result.data[0]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [slug, status, secret]);

    const allowedLevels = ["h2", "h3", "h4"];

    if (loading) {
        return (
            <div className="wrapper pt-[61px] pb-16 flex flex-col items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">正在加载预览...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="wrapper pt-[61px] pb-16 flex flex-col items-center justify-center min-h-[50vh]">
                <AlertTriangle className="w-12 h-12 text-destructive" />
                <h1 className="mt-4 text-xl font-medium">预览加载失败</h1>
                <p className="mt-2 text-muted-foreground">{error}</p>
                <Link href="/article" className="mt-4 text-primary hover:underline">
                    返回博客列表
                </Link>
            </div>
        );
    }

    if (!articleData) return null;

    const { title, featuredImage, publishedAt, content, tags, createdAt } = articleData;

    return (
        <article>
            {/* Draft indicator banner */}
            {/* {status === "draft" && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-amber-950 text-center py-2 text-sm font-medium">
                    <AlertTriangle className="inline-block w-4 h-4 mr-2" />
                    预览模式 - 草稿内容（未发布）
                </div>
            )} */}

            <div className={`wrapper pb-16 flex flex-col gap-16 ${status === "draft" ? "pt-[calc(61px+40px)]" : "pt-[61px]"}`}>
                <div className="mt-16">
                    <Breadcrumb className="flex justify-center">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/">首页</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <SlashIcon className="opacity-50 !size-2.5" />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/article">博客</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>
                                <SlashIcon className="opacity-50 !size-2.5" />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <span className="text-muted-foreground">预览</span>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h1 className="text-2xl md:text-4xl text-center font-medium text-accent-foreground mt-4">
                        {title}
                    </h1>
                </div>

                {featuredImage ? (
                    <Image
                        src={strapiImage(featuredImage.url)}
                        alt={featuredImage.alternativeText || title}
                        width={featuredImage.width || 1000}
                        height={featuredImage.height || 1000}
                        className="w-full h-auto object-cover rounded-md aspect-video"
                    />
                ) : (
                    <Separator className="-my-8 md:my-0" />
                )}

                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-full md:col-span-9">
                        <div className="flex justify-between text-sm mb-8">
                            <span className={`tracking-widest ${font.orbitron.className}`}>
                                <time dateTime={publishedAt || createdAt}>
                                    {new Date(publishedAt || createdAt).toLocaleDateString()}
                                </time>
                                {status === "draft" && (
                                    <span className="ml-2 text-amber-600 dark:text-amber-400">(草稿)</span>
                                )}
                            </span>
                        </div>
                        <div className="prose dark:prose-invert max-w-none prose-a:text-primary">
                            <ArticleContent content={content} />
                        </div>
                        {tags && tags.length > 0 && (
                            <div>
                                <h2 className="text-3xl font-medium text-accent-foreground mt-16" id="tag-list">
                                    标签：
                                </h2>
                                <ul className="mt-4 flex justify-start flex-wrap gap-4">
                                    {tags.map((tag) => (
                                        <li key={tag.id} className="isolate group/li">
                                            <Link href={`/tag/${tag?.slug}`}>
                                                <span className="text-primary group-hover/li:text-accent-foreground transition-colors duration-200">
                                                    {tag.name}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <aside className="col-span-full order-first md:block md:col-span-3 md:sticky md:top-[calc(1rem+var(--header-height))] md:h-fit md:max-h-[calc(100vh-var(--header-height)-2rem)] md:overflow-y-auto md:overflow-x-hidden">
                        <AccordionArticleToc
                            content={content}
                            articleTocProps={{
                                allowedLevels,
                                headingsLast: [],
                            }}
                            Label={
                                <h3 className="text-sm font-medium mb-2 text-foreground group-hover/trigger:text-accent-foreground">
                                    导航
                                </h3>
                            }
                        />
                    </aside>
                </div>
            </div>
        </article>
    );
}

export default function PreviewPage() {
    return (
        <Suspense
            fallback={
                <div className="wrapper pt-[61px] pb-16 flex flex-col items-center justify-center min-h-[50vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">正在加载预览...</p>
                </div>
            }
        >
            <PreviewContent />
        </Suspense>
    );
}
