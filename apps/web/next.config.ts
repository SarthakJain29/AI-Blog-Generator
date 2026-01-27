import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    transpilePackages: ['@my-scope/utils'],
};

export default nextConfig;
