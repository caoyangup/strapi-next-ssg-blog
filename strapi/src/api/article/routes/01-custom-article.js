// strapi/src/api/article/routes/01-custom-article.js
module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/articles/:documentId/related',
      handler: 'article.findRelated',
    }
  ],
};