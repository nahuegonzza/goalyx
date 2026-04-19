import path from 'path';

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'styles')]
  }
};

export default nextConfig;
