import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    transpilePackages: ['@my-scope/utils'],
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'unsafe-none',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
