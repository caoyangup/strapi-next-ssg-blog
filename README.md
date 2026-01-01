# Strapi + Next.js SSG Blog

English | [中文](./README.zh-CN.md)

A full-stack blog solution using **Strapi** as the headless CMS and **Next.js** with Static Site Generation (SSG) for the frontend. Deploy your static site to **Cloudflare Pages** for blazing-fast performance.

## 🏗️ Project Structure

```
strapi-next-ssg-blog/
├── strapi/                 # Strapi CMS backend
│   ├── src/
│   │   ├── api/            # Content-types (article, blog, global)
│   │   ├── components/     # Shared components (layout, nav, shared)
│   │   └── plugins/        # Local plugins (pinyin-slug)
│   ├── public/uploads/     # Uploaded images (auto-synced to Git)
│   ├── example.env         # Environment variables template
│   └── ...
├── next/                   # Next.js frontend
│   ├── app/                # App router pages
│   ├── components/         # React components
│   ├── lib/                # Utilities and Strapi client
│   ├── example.env         # Environment variables template
│   └── ...
├── scripts/                # Utility scripts
│   └── backup-db.js        # Database backup script
├── example.env             # Environment variables template (backup config)
└── package.json            # Root package with workspace scripts
```

## ✨ Features

- **Strapi CMS**: Headless CMS with custom content-types for articles, categories, and tags
- **Next.js SSG**: Static site generation for optimal performance
- **Full-text Search**: Built-in article search functionality
- **Pinyin Slug Plugin**: Auto-generate URL-friendly slugs from Chinese titles
- **Draft Preview**: Preview draft articles before publishing
- **SEO Optimized**: Built-in SEO components and metadata management
- **Cloudflare Pages**: One-command deployment to Cloudflare

## 💡 Recommended Usage

### Option 1: Fork + GitHub Storage (Recommended)

The simplest approach for personal blogs:

1. **Fork this repository** to your GitHub account
2. **Clone locally** for development
3. **Image storage**: Uploaded images are saved in `strapi/public/uploads/` and committed to GitHub with your code
4. **Database backup**:
   - Manually backup `strapi/database/data.db` file
   - Or configure `BACKUP_TARGET_DIR` in `.env` for automatic backup on changes
5. **Deploy frontend**: Run `npm run deploy` to deploy static pages to Cloudflare Pages

### Option 2: Separate Frontend/Backend Deployment

For higher availability requirements:

1. Deploy Strapi to a cloud server (AWS, DigitalOcean, etc.)
2. Run only Next.js frontend locally, connecting to remote Strapi API
3. Run `npm run build` to generate static pages and deploy

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

1. **Fork and clone the repository**:
   ```bash
   # First fork this project on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/strapi-next-ssg-blog.git
   cd strapi-next-ssg-blog
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   This will automatically install dependencies for both Strapi and Next.js.

3. **Configure environment variables**:

   **Root** (`.env` - for database backup, optional):
   ```bash
   cp example.env .env
   ```
   Edit `.env` and set `BACKUP_TARGET_DIR` to enable automatic database backup. If not configured, backup will be skipped.

   **Strapi** (`strapi/.env`):
   ```bash
   cp strapi/example.env strapi/.env
   ```
   Edit `strapi/.env` and update the secret keys. You can generate new keys using:
   ```bash
   openssl rand -base64 16
   ```

   **Next.js** (`next/.env`):
   ```bash
   cp next/example.env next/.env
   ```
   After starting Strapi, generate an API token from **Settings → API Tokens** in the Strapi admin panel, then update `STRAPI_API_TOKEN` in `next/.env`.

4. **Start development servers**:
   ```bash
   npm run dev
   ```
   This runs Strapi, Next.js, file sync, and database backup concurrently:
   - Strapi Admin: http://localhost:1337/admin
   - Next.js Frontend: http://localhost:3000

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies (root, Strapi, Next.js, plugins) |
| `npm run dev` | Start development servers with file sync and backup |
| `npm run build` | Build the static site for production |
| `npm run deploy` | Build and deploy to Cloudflare Pages |
| `npm run backup` | Run database backup manually |

## 🔧 Configuration

### Strapi Environment Variables

| Variable | Description |
|----------|-------------|
| `HOST` | Server host (default: `0.0.0.0`) |
| `PORT` | Server port (default: `1337`) |
| `CLIENT_URL` | Frontend URL for preview |
| `PREVIEW_SECRET` | Secret key for draft preview |
| `APP_KEYS` | Application keys (comma-separated) |
| `API_TOKEN_SALT` | Salt for API tokens |
| `ADMIN_JWT_SECRET` | JWT secret for admin panel |
| `DATABASE_FILENAME` | SQLite database path |

### Next.js Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_STRAPI_API_URL` | Strapi API URL |
| `STRAPI_API_TOKEN` | API token for Strapi access |
| `NEXT_PUBLIC_STRAPI_SYNC_UPLOADS` | Enable upload sync |
| `IMAGE_HOSTNAME` | Allowed image hostname |

### Backup Environment Variables (Root `.env`)

| Variable | Description |
|----------|-------------|
| `BACKUP_TARGET_DIR` | **Required** - Backup destination directory |
| `BACKUP_SOURCE_FILE` | Source database file (default: `./strapi/database/data.db`) |
| `BACKUP_RETENTION_DAYS` | Days to keep backups (default: `2`) |
| `BACKUP_POLL_INTERVAL` | Check interval in ms (default: `30000`) |

## 🌐 Deployment

### Deploy to Cloudflare Pages

1. **Install Wrangler CLI**:
   ```bash
   npm install -g wrangler@latest
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

## 🔌 Local Plugins

### Pinyin Slug Plugin

Located in `strapi/src/plugins/pinyin-slug`, this plugin automatically converts Chinese titles to pinyin-based URL slugs.

## 📚 Learn More

- [Strapi Documentation](https://docs.strapi.io)
- [Next.js Documentation](https://nextjs.org/docs)
- [Cloudflare Pages](https://developers.cloudflare.com/pages)

## 📄 License

MIT License