/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "localhost:3000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "indecent.top",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.indecent.top",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "scontent-mty2-1.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "s3.amazonaws.com", // Adiciona o domínio genérico do S3
      },
      {
        protocol: "https",
        hostname: "indecent.top.s3.us-east-1.amazonaws.com", // Adapte para o seu domínio S3
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.indecent.top",
        pathname: "/**",
      },
      
      {
        protocol: "https",
        hostname: "s3.us-east-1.amazonaws.com",
        pathname: "/indecent.top/uploads/**",
      },
      {
        protocol: "https",
        hostname: "indecent-stories-oqmc3onwn84qibx3hc3dmwqzm69nause2a-s3alias.s3.us-east-1.amazonaws.com", 
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.us-1.amazonaws.com/indecent.top",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "indecent.top.s3.us-east-1.amazonaws.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "indecent.top.s3.amazonaws.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "d72slz63e5c7n.cloudfront.net",
        pathname: "/**", 
      },
      {
        protocol: "https",
        hostname: "indecenttop.s3.us-east-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.indecent.top",
        pathname: "/**",
      }
      
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  env: {
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

export default nextConfig;

