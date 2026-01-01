import apiClient, { config, api } from "@/lib/strapi/client";
import Tags from "@/components/article/tags";
import { generateMetadataObject } from "@/lib/shared/metadata";

export default async function Page() {

    const allTags = await getAllTags({
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
        },
    });
    // 过滤出 count > 0 的标签，并按 count 从大到小排序
    const filteredAndSortedTags = allTags
        .filter(tag => tag.articles.count > 0)
        .sort((a, b) => b.articles.count - a.articles.count);

    return (
        <main>
            <div className="wrapper pt-[61px] pb-16">
                <h1 className="sr-only- text-3xl font-medium text-accent-foreground text-center mt-16">所有标签</h1>

                {/* <h2 className="text-3xl font-medium text-accent-foreground text-center mt-16"></h2> */}

                <Tags tags={filteredAndSortedTags} />

            </div>
        </main>
    );
}

export async function generateMetadata({ params }) {
    return generateMetadataObject({}, {
        metaTitle: "所有标签",
        metaDescription: "这里是所有标签的列表页，你可以通过点击标签来查看相关的文章。每个标签还包含计数，显示了该标签下的文章数量。你可以通过标签来发现更多你感兴趣的内容。",
        // keywords: articleData.tags?.map(tag => tag.name).join(','),
        // metaImage: articleData.featuredImage || null,
    })
}

/**
 * 获取所有 tags
 */
export async function getAllTags(params = {}) {
    const {
        sort = undefined, //'articleCount:DESC',
        pagination: paginationParams = {},
        ...restParams
    } = params;

    const pageSize = paginationParams.pageSize || 100;

    // 第一次请求第一页，获取分页信息
    const firstPageResult = await api.tags.find({
        pagination: {
            page: 1,
            pageSize: pageSize,
            ...paginationParams
        },
        sort,
        ...restParams
    });

    // 从 meta 中获取分页信息
    const { pagination } = firstPageResult.meta;

    // 计算总页数
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);

    // 收集所有数据
    const allTags = [...firstPageResult.data];

    // 如果只有一页，直接返回
    if (totalPages <= 1) {
        return allTags;
    }

    // 创建剩余页数的请求数组
    const remainingPageRequests = [];
    for (let i = 2; i <= totalPages; i++) {
        remainingPageRequests.push(
            api.tags.find({
                pagination: {
                    page: i,
                    pageSize: pageSize,
                    ...paginationParams
                },
                sort,
                ...restParams
            })
        );
    }

    // 并发请求所有剩余页面
    const remainingResults = await Promise.all(remainingPageRequests);

    // 合并所有数据
    remainingResults.forEach(result => {
        allTags.push(...result.data);
    });

    return allTags;
}