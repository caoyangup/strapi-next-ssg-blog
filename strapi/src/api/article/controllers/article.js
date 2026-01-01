'use strict';

/**
 * article controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::article.article', ({ strapi }) => ({
    /**
     * 获取相关文章
     */
    async findRelated(ctx) {
        const contentType = strapi.contentType('api::article.article');
        const { documentId } = ctx.params;

        await strapi.contentAPI.validate.query(ctx.query, contentType, { auth: ctx.state.auth });
        const sanitizedQueryParams = await strapi.contentAPI.sanitize.query(ctx.query, contentType, { auth: ctx.state.auth });

        // 1. 使用 document service 查找当前文章实体, 并填充其标签
        // 这是 Strapi v5 的推荐做法
        const article = await strapi.service('api::article.article').findOne(documentId, {
            populate: ['tags'],
        });

        if (!article) {
            return ctx.notFound('Article not found');
        }
        // 2. 调用我们自定义的服务函数 获取相关文档id
        const queryResult = await strapi.service('api::article.article').findRelated(article);

        // 如果没有找到相关文章，直接返回空数组
        if (!queryResult || queryResult.length === 0) {
            const sanitizedResults = await this.sanitizeOutput([], ctx);
            return this.transformResponse(sanitizedResults, {});
        }

        // 提取所有相关文章的 ID 用于数据库查询
        const relatedArticleIds = queryResult.map(item => item.id);
        // 创建一个 Map 以便快速查找每篇文章的 matching_tags 数量
        const matchingTagsMap = new Map(queryResult.map(item => [item.id, item.matching_tags]));

        // 3. 使用 Strapi 服务来获取完整的文章实体
        const { results, pagination } = await strapi.service('api::article.article').find(
            {
                status: 'published',
                ...sanitizedQueryParams,
                filters: {
                    ...sanitizedQueryParams.filters,
                    id: { $in: relatedArticleIds },
                },
                // 禁用数据库层面的排序和分页，因为我们需要在内存中进行自定义排序和分页
                sort: undefined,
                pagination: undefined
            }
        )
        // 4. 将获取到的文章按照新的复合规则进行重新排序
        // 排序规则: 
        //   - 主要条件: matching_tags 数量降序 (越多越靠前)
        //   - 次要条件: 如果 matching_tags 相同, 则按 publishedAt 发布时间降序 (越新越靠前)
        const sortedArticles = results.sort((a, b) => {
            const tagsA = matchingTagsMap.get(a.id) || 0;
            const tagsB = matchingTagsMap.get(b.id) || 0;

            // 首先比较 matching_tags 数量 (降序)
            const tagDifference = tagsB - tagsA;
            if (tagDifference !== 0) {
                return tagDifference;
            }

            // 如果 matching_tags 数量相同, 则比较发布时间 (降序)
            // 使用 getTime() 进行比较以获得更好的性能和准确性
            const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
            const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
            return dateB - dateA;
        });

        // 5. 手动应用分页限制
        const limit = sanitizedQueryParams.pagination?.limit || 4;
        // 注意：原代码中已经通过 .slice(0, limit) 实现了手动分页，我们保留这个逻辑
        const paginatedAndSortedArticles = sortedArticles.slice(0, limit);

        // (原代码后续部分，保持不变)
        const sanitizedResults = await this.sanitizeOutput(paginatedAndSortedArticles, ctx);
        return this.transformResponse(sanitizedResults, { pagination, queryResult });

    }
}));
