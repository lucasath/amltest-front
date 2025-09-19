import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    env: {
        URL_API: process.env.URL_API,
    },
};

export default nextConfig;
