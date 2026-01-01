# Strapi + Next.js SSG 博客

[English](./README.md) | 中文

一个全栈博客解决方案，使用 **Strapi** 作为无头 CMS，**Next.js** 静态站点生成（SSG）作为前端。可将静态站点部署到 **Cloudflare Pages** 获得极速性能。

## 🏗️ 项目结构

```
strapi-next-ssg-blog/
├── strapi/                 # Strapi CMS 后端
│   ├── src/
│   │   ├── api/            # 内容类型 (article, blog, global)
│   │   ├── components/     # 共享组件 (layout, nav, shared)
│   │   └── plugins/        # 本地插件 (pinyin-slug)
│   ├── public/uploads/     # 上传的图片（自动同步到 Git）
│   ├── example.env         # 环境变量模板
│   └── ...
├── next/                   # Next.js 前端
│   ├── app/                # App Router 页面
│   ├── components/         # React 组件
│   ├── lib/                # 工具库和 Strapi 客户端
│   ├── example.env         # 环境变量模板
│   └── ...
├── scripts/                # 工具脚本
│   └── backup-db.js        # 数据库备份脚本
├── example.env             # 环境变量模板（备份配置）
└── package.json            # 根 package，工作区脚本
```

## ✨ 功能特性

- **Strapi CMS**：无头 CMS，自定义文章、分类、标签等内容类型
- **Next.js SSG**：静态站点生成，极致性能
- **全文搜索**：内置文章搜索功能
- **拼音 Slug 插件**：自动将中文标题转换为 URL 友好的拼音 slug
- **草稿预览**：发布前预览草稿文章
- **SEO 优化**：内置 SEO 组件和元数据管理
- **Cloudflare Pages**：一键部署到 Cloudflare

## 💡 推荐使用方式

### 方式一：Fork + GitHub 存储（推荐）

这是最简单的方式，适合个人博客：

1. **Fork 本项目**到你的 GitHub 账户
2. **克隆到本地**进行开发
3. **图片存储**：上传的图片会保存在 `strapi/public/uploads/` 目录，随代码一起提交到 GitHub
4. **数据库备份**：
   - 可以手动备份 `strapi/database/data.db` 文件
   - 或配置 `.env` 中的 `BACKUP_TARGET_DIR`，修改时自动备份到指定目录
5. **部署前端**：运行 `npm run deploy` 将静态页面部署到 Cloudflare Pages

### 方式二：前后端分离部署

适合需要更高可用性的场景：

1. 将 Strapi 部署到云服务器（如 AWS、阿里云等）
2. 本地只运行 Next.js 前端，连接远程 Strapi API
3. 运行 `npm run build` 生成静态页面并部署

## 🚀 快速开始

### 前置要求

- Node.js >= 18
- npm >= 9

### 安装步骤

1. **Fork 并克隆仓库**：
   ```bash
   # 先在 GitHub 上 Fork 本项目，然后克隆你的 Fork
   git clone https://github.com/你的用户名/strapi-next-ssg-blog.git
   cd strapi-next-ssg-blog
   ```

2. **安装依赖**：
   ```bash
   npm install
   ```
   这会自动安装 Strapi 和 Next.js 的所有依赖。

3. **配置环境变量**：

   **根目录** (`.env` - 数据库备份配置，可选)：
   ```bash
   cp example.env .env
   ```
   编辑 `.env`，设置 `BACKUP_TARGET_DIR` 启用自动备份。如不配置，备份功能将跳过。

   **Strapi** (`strapi/.env`)：
   ```bash
   cp strapi/example.env strapi/.env
   ```
   编辑 `strapi/.env` 更新密钥。可使用以下命令生成：
   ```bash
   openssl rand -base64 16
   ```

   **Next.js** (`next/.env`)：
   ```bash
   cp next/example.env next/.env
   ```
   启动 Strapi 后，在管理面板 **设置 → API Tokens** 生成 API 令牌，然后更新 `next/.env` 中的 `STRAPI_API_TOKEN`。

4. **启动开发服务器**：
   ```bash
   npm run dev
   ```
   同时运行 Strapi、Next.js、文件同步和数据库备份：
   - Strapi 管理面板：http://localhost:1337/admin
   - Next.js 前端：http://localhost:3000

## 📝 可用脚本

| 命令 | 描述 |
|------|------|
| `npm install` | 安装所有依赖（根目录、Strapi、Next.js、插件） |
| `npm run dev` | 启动开发服务器（含文件同步和备份） |
| `npm run build` | 构建生产环境静态站点 |
| `npm run deploy` | 构建并部署到 Cloudflare Pages |
| `npm run backup` | 手动运行数据库备份 |

## 🔧 配置说明

### Strapi 环境变量

| 变量 | 描述 |
|------|------|
| `HOST` | 服务器主机（默认：`0.0.0.0`） |
| `PORT` | 服务器端口（默认：`1337`） |
| `CLIENT_URL` | 前端 URL，用于预览 |
| `PREVIEW_SECRET` | 草稿预览密钥 |
| `APP_KEYS` | 应用密钥（逗号分隔） |
| `API_TOKEN_SALT` | API 令牌盐值 |
| `ADMIN_JWT_SECRET` | 管理面板 JWT 密钥 |
| `DATABASE_FILENAME` | SQLite 数据库路径 |

### Next.js 环境变量

| 变量 | 描述 |
|------|------|
| `NEXT_PUBLIC_STRAPI_API_URL` | Strapi API 地址 |
| `STRAPI_API_TOKEN` | Strapi API 访问令牌 |
| `NEXT_PUBLIC_STRAPI_SYNC_UPLOADS` | 启用上传同步 |
| `IMAGE_HOSTNAME` | 允许的图片主机名 |

### 备份环境变量（根目录 `.env`）

| 变量 | 描述 |
|------|------|
| `BACKUP_TARGET_DIR` | **必填** - 备份目标目录 |
| `BACKUP_SOURCE_FILE` | 源数据库文件（默认：`./strapi/database/data.db`） |
| `BACKUP_RETENTION_DAYS` | 备份保留天数（默认：`2`） |
| `BACKUP_POLL_INTERVAL` | 检查间隔，毫秒（默认：`30000`） |

## 🌐 部署

### 部署到 Cloudflare Pages

1. **安装 Wrangler CLI**：
   ```bash
   npm install -g wrangler@latest
   ```

2. **登录 Cloudflare**：
   ```bash
   wrangler login
   ```

3. **部署**：
   ```bash
   npm run deploy
   ```

## 🔌 本地插件

### 拼音 Slug 插件

位于 `strapi/src/plugins/pinyin-slug`，自动将中文标题转换为拼音 URL slug。

## 📚 了解更多

- [Strapi 文档](https://docs.strapi.io)
- [Next.js 文档](https://nextjs.org/docs)
- [Cloudflare Pages](https://developers.cloudflare.com/pages)

## 📄 许可证

MIT License
