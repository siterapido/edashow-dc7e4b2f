import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  reactCompiler: false,
}

// Desabilita o bundling de pacotes do servidor durante desenvolvimento
// para melhor performance e compatibilidade
export default withPayload(nextConfig, { 
  devBundleServerPackages: false 
})