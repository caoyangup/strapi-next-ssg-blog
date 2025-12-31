// Function to generate preview pathname based on content type
const getPreviewPathname = (uid, { document }) => {
  const { slug } = document;

  switch (uid) {
    case "api::article.article": {
      if (!slug) return "/article";
      return `/article/${slug}`;
    }
    default:
      return null;
  }
};

module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  preview: {
    enabled: true,
    config: {
      allowedOrigins: env("CLIENT_URL"),
      async handler(uid, { documentId, locale, status }) {
        const document = await strapi.documents(uid).findOne({ documentId });
        const pathname = getPreviewPathname(uid, { document });

        if (!pathname) return null;

        const clientUrl = env("CLIENT_URL");
        const previewSecret = env("PREVIEW_SECRET");

        // Build preview URL with parameters for draft support
        const params = new URLSearchParams({
          slug: document.slug,
          status: status || 'published',
        });

        // Add secret for draft access
        if (previewSecret && status === 'draft') {
          params.set('secret', previewSecret);
        }

        return `${clientUrl}/article/preview?${params}`;
      },
    },
  },
});
