/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    // trailingSlash: true,
    images: {
        remotePatterns: [{ hostname: process.env.IMAGE_HOSTNAME || 'localhost' }],
        unoptimized: true,
        // loader: 'custom',
        // loaderFile: './my-loader.js',
    },
};

export default nextConfig;
