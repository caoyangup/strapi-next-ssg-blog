# Strapi + Next.js SSG Blog

A modern, fast, and SEO-friendly blog built with **Strapi CMS** and **Next.js Static Site Generation (SSG)**. Deploy to Cloudflare Pages for lightning-fast global delivery.

## ✨ Features

- 📝 **Strapi CMS** - Headless CMS for easy content management
- ⚡ **Next.js SSG** - Static site generation for blazing fast performance
- 🎨 **Modern Design** - Clean and responsive UI
- 🔍 **SEO Optimized** - Built-in SEO best practices
- 📱 **Responsive** - Works on all devices
- 🏷️ **Tags & Categories** - Organize your content
- 📖 **Table of Contents** - Auto-generated article navigation
- 🔄 **Draft Preview** - Preview unpublished content
- ☁️ **Cloudflare Pages** - Easy deployment with edge caching

## 📁 Project Structure

```
├── strapi/          # Strapi CMS backend
│   ├── src/         # Strapi source code
│   ├── config/      # Strapi configuration
│   └── public/      # Public assets & uploads
├── next/            # Next.js frontend
│   ├── app/         # App router pages
│   ├── components/  # React components
│   └── lib/         # Utilities & API client
└── scripts/         # Utility scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/caoyangup/strapi-next-ssg-blog.git
cd strapi-next-ssg-blog
```

### 2. Install dependencies

```bash
# Install all dependencies (root, strapi, next, and plugins)
npm install
```

> **Note**: The `postinstall` script will automatically install dependencies for Strapi, Next.js, and local Strapi plugins.

### 3. Configure environment variables

```bash
# Strapi
cp strapi/.env.example strapi/.env
# Edit strapi/.env and generate your own secret keys

# Next.js
cp next/.env.example next/.env
# Edit next/.env with your configuration
```

#### Generate Strapi Keys

You can generate secret keys using:

```bash
openssl rand -base64 16
```

#### Get Strapi API Token

1. Start Strapi and access admin panel at `http://localhost:1337/admin`
2. Go to **Settings > API Tokens > Create new API Token**
3. Set permissions (Full access or Custom)
4. Copy the token to your `.env` files

### 4. Start development

```bash
npm run dev
```

This will start:
- Strapi CMS at `http://localhost:1337`
- Next.js frontend at `http://localhost:3000`
- File sync between Strapi uploads and Next.js public folder

### 5. Create your first content

1. Access Strapi admin at `http://localhost:1337/admin`
2. Create your admin account
3. Start creating articles, categories, and tags!

## 🏗️ Build & Deploy

### Build for production

```bash
npm run build
```

### Deploy to Cloudflare Pages

1. Install Wrangler CLI:
```bash
npm install -g wrangler@latest
```

2. Deploy:
```bash
npm run deploy
```

Or manually:
```bash
wrangler pages deploy ./next/out
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development servers |
| `npm run build` | Build for production |
| `npm run deploy` | Build and deploy to Cloudflare Pages |
| `npm run backup` | Backup database to configured location |

## 🔧 Configuration

### Strapi Configuration

- `strapi/config/` - Strapi configuration files
- `strapi/.env` - Environment variables

### Next.js Configuration

- `next/next.config.mjs` - Next.js configuration
- `next/.env` - Environment variables

### Content Types

The blog includes the following content types:

- **Article** - Blog posts with rich content
- **Category** - Article categories
- **Tag** - Article tags
- **Global** - Site-wide settings and metadata

## 📝 SEO

### Metadata Configuration

- Edit global metadata in Strapi admin under **Global** content type
- Per-page metadata is automatically generated from article content
- OpenGraph images are supported

### Resources

- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Strapi](https://strapi.io/) - Open source headless CMS
- [Next.js](https://nextjs.org/) - React framework
- [Cloudflare Pages](https://pages.cloudflare.com/) - Edge hosting platform