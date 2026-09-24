import type { NextConfig } from 'next';
import { createRequire } from 'node:module';
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default withPayload(nextConfig);