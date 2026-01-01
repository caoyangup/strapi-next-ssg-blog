import { strapi } from '@strapi/client';

const client = strapi({
    baseURL: process.env.NEXT_PUBLIC_STRAPI_API_URL + "/api",
    auth: process.env.STRAPI_API_TOKEN
});
const config = {
    pageSize: process.env.NEXT_PUBLIC_STRAPI_API_PAGE_SIZE || 12,
    sort: process.env.NEXT_PUBLIC_STRAPI_API_SORT || 'publishedAt:DESC',
}

// 用于生成文章分页的静态参数
const generateArticlePageStaticParams = async () => {
    const article = client.collection('articles');
    const articleData = await article.find({
        filters: {
            $or: [
                { unlisted: { $eq: false } },
                { unlisted: { $null: true } }
            ]
        },
        pagination: {
            page: 1,
            pageSize: config.pageSize,
        }
    });
    //根据总页数meta.pagination.pageSize生成params
    const { pagination } = articleData.meta;
    const params = [];
    for (let i = 1; i <= Math.ceil(pagination.total / pagination.pageSize); i++) {
        params.push({
            page: i.toString(), // 到文本
        })
    }
    return params;
}
// 用于生成文章slug的静态参数
const generateArticleSlugStaticParams = async () => {
    // 获取文章集合
    const article = client.collection('articles');

    // 第一次请求第一页，主要是为了获取分页信息
    const articleData = await article.find({
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
        const forArticle = await article.find({
            pagination: {
                page: i,
                pageSize: 100,
            }
        });

        // 遍历每条文章数据，收集 slug
        forArticle.data.forEach((article) => {
            article?.slug && allArticleParams.push({
                slug: article.slug.toString(),
            });
        });
    }
    // 返回所有文章的参数
    return allArticleParams;
}
// 用于生成标签slug的静态参数
const generateTagSlugStaticParams = async () => {
    // 获取文章集合
    const tag = client.collection('tags');

    // 第一次请求第一页，主要是为了获取分页信息
    const tagData = await tag.find({
        populate: {
            articles: {
                count: true
            }
        },
        pagination: {
            page: 1,
            pageSize: 100,
        }
    });

    // console.log('articleData', articleData);

    // 从 meta 中拿到分页信息
    const { pagination } = tagData.meta;
    // 计算总页数
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);

    const allTagParams = [];

    // 遍历所有分页，逐页请求数据
    for (let i = 1; i <= totalPages; i++) {
        const forTag = await tag.find({
            populate: {
                articles: {
                    count: true
                }
            },
            pagination: {
                page: i,
                pageSize: 100,
            }
        });

        // 遍历每条文章数据，收集 slug
        forTag.data.forEach((tag) => {
            tag?.slug && tag.articles.count > 0 && allTagParams.push({
                slug: tag.slug.toString(),
            });
        });
    }
    // 返回所有文章的参数
    return allTagParams;
}
// 用于生成标签slug&page的静态参数
const generateTagSlugAndPageStaticParams = async () => {
    const tagSlug = await generateTagSlugStaticParams();
    const allParams = []
    // 等待数组异步
    await Promise.all(tagSlug.map(async (item) => {
        const { slug } = item;
        const articles = client.collection('articles');
        const articlesData = await articles.find({
            filters: {
                $and: [
                    { tags: { slug: slug } },
                    {
                        $or: [
                            { unlisted: { $eq: false } },
                            { unlisted: { $null: true } }
                        ]
                    }
                ]
            },
            pagination: {
                page: 1,
                pageSize: config.pageSize,
            }
        });
        const { pagination } = articlesData.meta;
        const totalPages = Math.ceil(pagination.total / pagination.pageSize);
        for (let i = 1; i <= totalPages; i++) {
            allParams.push({
                slug: slug,
                page: i.toString(),
            })
        }
    }))
    return allParams;
}
// 用于生成文章分类slug的静态参数
const generateArticleCategoriesSlugStaticParams = async () => {
    const categories = client.collection('article-categories');

    // 第一次请求第一页，主要是为了获取分页信息
    const categoriesData = await categories.find({
        pagination: {
            page: 1,
            pageSize: config.pageSize,
        }
    });


    // 从 meta 中拿到分页信息
    const { pagination } = categoriesData.meta;
    // 计算总页数
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);

    const allCategoryParams = [];

    // 遍历所有分页，逐页请求数据
    for (let i = 1; i <= totalPages; i++) {
        const forCategory = await categories.find({
            pagination: {
                page: i,
                pageSize: config.pageSize,
            }
        });

        // 遍历每条文章数据，收集 documentId
        forCategory.data.forEach((category) => {
            allCategoryParams.push({
                slug: category.slug.toString(),
            });
        });
    }

    // 返回所有分类的参数
    return allCategoryParams;
}
// 用于生成文章分类slug和分页的静态参数
const generateArticleCategoriesSlugAndPageStaticParams = async () => {
    const catSlug = await generateArticleCategoriesSlugStaticParams();
    const allParams = []
    // 等待数组异步
    await Promise.all(catSlug.map(async (item) => {
        const { slug } = item;
        const articles = client.collection('articles');
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
            pagination: {
                page: 1,
                pageSize: config.pageSize,
            }
        });
        const { pagination } = articlesData.meta;
        const totalPages = Math.ceil(pagination.total / pagination.pageSize);
        for (let i = 1; i <= totalPages; i++) {
            allParams.push({
                slug: slug,
                page: i.toString(),
            })
        }
    }))
    // console.log('generateArticleCategoriesSlugAndPageStaticParams', allParams);
    return allParams;
}

const api = {
    // ...client,
    articles: client.collection('articles'),
    tags: client.collection('tags'),
    blog: client.single('blog'),
    global: client.single('global'),
    fetch: client.fetch.bind(client),// 使用 bind 确保正确的上下文
}

export default client;
export {
    api,
    config,
    generateArticleSlugStaticParams,
    generateArticlePageStaticParams,
    generateTagSlugStaticParams,
    generateTagSlugAndPageStaticParams,
    generateArticleCategoriesSlugStaticParams,
    generateArticleCategoriesSlugAndPageStaticParams,
}