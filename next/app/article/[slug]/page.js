import apiClient, { api, generateArticleSlugStaticParams } from "@/lib/strapi/client";
import { getAllTags } from "@/app/tags/page";
import Link from "next/link";
import { notFound } from 'next/navigation'
import { SlashIcon } from "lucide-react"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { strapiImage } from "@/lib/strapi/strapiImage";
import Image from "next/image";

import ArticleContent from './ArticleContent'
import ArticleToc from './ArticleToc';
import CopyLink from "./CopyLink";
import font from "@/lib/font";
import Tags from "@/components/article/tags";
import qs from 'qs';
// import { useMemo } from 'react';
import RelatedArticles from "./RelatedArticles";
import { generateMetadataObject } from "@/lib/shared/metadata";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import AccordionArticleToc from "./AccordionArticleToc";
import { Separator } from "@/components/ui/separator"
import GiscusComments from "@/components/giscus-comments";



// 用于生成静态参数（比如 Next.js 的动态路由参数）
export async function generateStaticParams() {
    return await generateArticleSlugStaticParams();
}


export default async function Page({ params }) {
    // 使用 useMemo 来确保数组实例在多次渲染之间保持不变
    // const allowedLevels = useMemo(() => ['h2', 'h3'], []);
    const allowedLevels = ['h2', 'h3', 'h4']
    const { slug } = await params;
    const { data: [articleData] } = await api.articles.find({
        filters: { slug: slug },
        // populate: ['featuredImage', 'tags'],
        populate: {
            featuredImage: true,
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
    });
    if (!articleData) return notFound();
    const { title, featuredImage, publishedAt, content, tags, createdAt, commentable } = articleData;
    const articleLink = `/article/${articleData.slug}`;

    // 获取相关文章
    const result = await api.fetch(`/articles/${articleData.documentId}/related?${qs.stringify({
        populate: ['tags'],
        pagination: {
            limit: 10, // 增加limit以便过滤后仍有足够文章
        },
    }, {
        encodeValuesOnly: true, // prettify URL
    })}`, { method: 'GET' });
    const { data: rawRelatedArticles } = await result.json();
    // 过滤掉 unlisted 文章
    const relatedArticles = (rawRelatedArticles || [])
        .filter(article => article.unlisted !== true)
        .slice(0, 4); // 限制返回4篇
    const allTags = await getAllTags();
    const replaceTagsLinkContent = replaceTagsWithMarkdownLinks(content, allTags);

    const headingsLast = [
        tags?.length > 0 ? {
            id: "tag-list",
            text: "标签",
            level: 2,
        } : undefined,
        commentable !== false ? {
            id: "giscus-comments",
            text: "评论",
            level: 2,
        } : undefined,
        relatedArticles?.length > 0 ? {
            id: "related-articles",
            text: "相关文章",
            level: 2,
        } : undefined,
    ].filter(Boolean);

    return (
        <article data-pagefind-body>
            <div className="wrapper pt-[61px] pb-16 flex flex-col gap-16">
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
                            {/* <BreadcrumbSeparator >
                                <SlashIcon className="opacity-50 !size-2.5" />
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href={`/article/category/${category?.slug}`}>{category?.name}</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem> */}

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
                ) : <Separator className={"-my-8 md:my-0"} />}
                <div className="grid grid-cols-12 gap-8 ">
                    {/* 文章内容区域 - 占据主要空间 */}
                    <div className="col-span-full md:col-span-9">
                        <div className="flex justify-between text-sm mb-8">
                            <span className={`tracking-widest ${font.orbitron.className}`}>
                                <time dateTime={publishedAt}>
                                    {
                                        new Date(createdAt).toLocaleDateString() == new Date(publishedAt).toLocaleDateString()
                                            ? new Date(publishedAt).toLocaleDateString()
                                            : `${new Date(createdAt).toLocaleDateString()} ~ ${new Date(publishedAt).toLocaleDateString()}`
                                    }
                                    {/* {new Date(publishedAt).toLocaleTimeString()} */}
                                </time>
                            </span>
                            <CopyLink copyText={articleLink} />
                        </div>
                        <div className="prose dark:prose-invert max-w-none prose-a:text-primary" >
                            <ArticleContent content={replaceTagsLinkContent} />
                        </div>
                        {
                            tags && tags.filter(tag => tag.articles?.count > 0).length > 0 && <div >
                                <h2 className="text-3xl font-medium text-accent-foreground mt-16" id="tag-list">
                                    标签：
                                </h2>
                                <Tags
                                    className="mt-4 flex justify-start flex-wrap gap-4"
                                    tags={tags.filter(tag => tag.articles?.count > 0)}
                                    sortFn={(a, b) => (b.articleCount || 0) - (a.articleCount || 0)}
                                />
                            </div>
                        }

                        {commentable !== false && (
                            <div>
                                <h2 className="text-3xl font-medium text-accent-foreground mt-16" id="giscus-comments">
                                    评论：
                                </h2>
                                <GiscusComments className="mt-16" />
                            </div>
                        )}
                        {
                            relatedArticles && relatedArticles.length > 0 && <div className="" data-pagefind-ignore>
                                <h2 id="related-articles" className="text-3xl font-medium text-accent-foreground mt-16">相关文章</h2>
                                <p className="text-muted-foreground mt-2">基于文章标签的相关内容推荐</p>
                                <div className="mt-8">
                                    <RelatedArticles articles={relatedArticles} className="divide-y border-t" />
                                </div>
                            </div>
                        }

                    </div>

                    {/* 目录导航区域 - 在大屏幕上显示在右侧 */}
                    <aside className="col-span-full order-first md:block md:col-span-3 md:sticky md:top-[calc(1rem+var(--header-height))] md:h-fit md:max-h-[calc(100vh-var(--header-height)-2rem)] md:overflow-y-auto md:overflow-x-hidden" data-pagefind-ignore>
                        <AccordionArticleToc
                            content={content}
                            articleTocProps={
                                {
                                    allowedLevels,
                                    headingsLast,
                                }
                            }
                            Label={<h3 key={"ArticleToc"} className="text-sm font-medium mb-2  text-foreground group-hover/trigger:text-accent-foreground">导航</h3>}
                        />
                    </aside>

                </div>


            </div>
        </article>

    );
}


export async function generateMetadata({ params }) {
    const { slug } = await params;
    const { data: [articleData] } = await api.articles.find({
        filters: { slug },
        populate: ['featuredImage', 'seo', 'tags'],
    });
    return generateMetadataObject(articleData.seo, {
        metaTitle: articleData.title,
        metaDescription: articleData.desc,
        keywords: articleData.tags?.map(tag => tag.name).join(','),
        metaImage: articleData.featuredImage || null,
    })
}


/**
 * 替换文章内容里的 tag 为 markdown 链接
 * 避免替换 code、行内代码、已有链接、HTML code 块等
 * @param {string} content 原始文章 Markdown 内容
 * @param {Array} tags 所有 tag 对象
 * @returns {string} 替换后的 Markdown 内容
 */
const replaceTagsWithMarkdownLinks = (content, tags) => {
    if (!content || !tags?.length) return content;

    let replaced = content;

    // === 阶段 1：屏蔽不该被替换的区域 ===
    const placeholders = {
        links: [],
        codes: [],
        inlineCodes: [],
        htmlCodes: [],
    };

    // 1. 屏蔽 Markdown 三引号代码块 ```
    replaced = replaced.replace(/```[\s\S]*?```/g, match => {
        placeholders.codes.push(match);
        return `__CODE_BLOCK_${placeholders.codes.length - 1}__`;
    });

    // 2. 屏蔽 HTML 代码块 <pre><code>...</code></pre> 或 <code>...</code>
    replaced = replaced.replace(/<pre><code[\s\S]*?<\/code><\/pre>/gi, match => {
        placeholders.htmlCodes.push(match);
        return `__HTML_CODE_BLOCK_${placeholders.htmlCodes.length - 1}__`;
    });
    replaced = replaced.replace(/<code[\s\S]*?<\/code>/gi, match => {
        placeholders.htmlCodes.push(match);
        return `__HTML_CODE_BLOCK_${placeholders.htmlCodes.length - 1}__`;
    });

    // 3. 屏蔽行内代码 `xxx`
    replaced = replaced.replace(/`[^`]+`/g, match => {
        placeholders.inlineCodes.push(match);
        return `__INLINE_CODE_${placeholders.inlineCodes.length - 1}__`;
    });

    // 4. 屏蔽 Markdown 链接 [xxx](url)
    replaced = replaced.replace(/\[([^\]]+)\]\([^)]+\)/g, match => {
        placeholders.links.push(match);
        return `__LINK_PLACEHOLDER_${placeholders.links.length - 1}__`;
    });

    // === 阶段 2：执行替换 ===
    const sortedTags = [...tags].sort((a, b) => {
        const nameA = a.attributes?.name || a.name;
        const nameB = b.attributes?.name || b.name;
        return nameB.length - nameA.length;
    });

    sortedTags.forEach(tag => {
        const tagName = tag.attributes?.name || tag.name;
        const tagSlug = tag.attributes?.slug || tag.slug;
        if (!tagName || !tagSlug) return;

        // 匹配中英文场景：用 lookaround 确保不误匹配
        const regex = new RegExp(
            `(?<![\\w/])${escapeRegExp(tagName)}(?![\\w/])`,
            "g"
        );

        replaced = replaced.replace(regex, `[${tagName}](/tag/${tagSlug})`);
    });

    // === 阶段 3：恢复被屏蔽的内容 ===
    replaced = replaced
        .replace(/__LINK_PLACEHOLDER_(\d+)__/g, (_, i) => placeholders.links[i])
        .replace(/__INLINE_CODE_(\d+)__/g, (_, i) => placeholders.inlineCodes[i])
        .replace(/__CODE_BLOCK_(\d+)__/g, (_, i) => placeholders.codes[i])
        .replace(/__HTML_CODE_BLOCK_(\d+)__/g, (_, i) => placeholders.htmlCodes[i]);

    return replaced;
};

// 工具函数：转义正则特殊字符
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
