'use strict';

/**
 * article service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::article.article', ({ strapi }) => ({

    /**
   * 查找与给定文章具有相关标签的其他文章.
   * @param {object} article - 当前文章对象, 必须包含 documentId 和已填充的 tags.
   * @returns {Promise<Array>} - 返回相关文章的列表.
   */
    async findRelated(article, options = { limit: 100 }) {
        // 1. 确保文章对象和标签存在
        if (!article || !article.tags || article.tags.length === 0) {
            return [];
        }

        const tagIds = article.tags.map(tag => tag.id);

        // 2. 使用原生查询来查找和排序相关文章
        // 我们需要找到共享一个或多个相同标签的其他文章,
        // 并按共享标签的数量进行降序排序.
        // Query Engine 无法直接处理这种聚合排序, 因此原生SQL是最佳选择.

        // 注意: Strapi 中多对多关系的连接表名通常是 `[table1]_[field1]_links_[table2]_[field2]_links` 的形式
        // 对于 article 和 tags 的关系，表名很可能是 `articles_tags_links`
        // 您应该在数据库中确认实际的表名和列名。常见的列名是 `article_id` 和 `tag_id`。
        const knex = strapi.db.connection;
        const query = knex('articles_tags_lnk as atl')
            .select('atl.article_id as id')
            .count('atl.tag_id as matching_tags')
            .whereIn('atl.tag_id', tagIds)      // 筛选出包含相关标签的文章
            .whereNot('atl.article_id', article.id) // 排除当前文章本身 (使用数据库中的主键 id)
            .groupBy('atl.article_id')
            .orderBy('matching_tags', 'desc')
            .limit(100); // <-- 添加这一行来限制结果数量为 10

        const relatedArticleIdsResult = await query;

        if (!relatedArticleIdsResult || relatedArticleIdsResult.length === 0) {
            return [];
        }
 
        return relatedArticleIdsResult

        // 3. 使用 Strapi 服务来获取完整的文章实体
        // 这样可以确保我们得到的是经过 Strapi 内部逻辑处理的、完整的、安全的数据对象
        await strapi.documents('api::article.article').findMany(
            {
                filters: {
                    id: { $in: orderedArticleIds },
                },
            }
        )
        const relatedArticles = await strapi.entityService.findMany('api::article.article', {
            filters: {
                id: { $in: orderedArticleIds },
                publishedAt: { $notNull: true } // 通常我们只希望推荐已发布的文章
            },
            populate: {
                // 在这里填充您希望在返回结果中包含的字段
                featuredImage: true,
                category: true,
            }
        });

        // 4. 将获取到的文章按照原生查询得到的排序顺序进行重新排序
        const articleMap = new Map(relatedArticles.map(item => [item.id, item]));
        const sortedArticles = orderedArticleIds
            .map(id => articleMap.get(id))
            .filter(Boolean); // .filter(Boolean) 用于过滤掉那些可能因未发布而没被 entityService 查出来的文章

        return sortedArticles;
    }
}));
