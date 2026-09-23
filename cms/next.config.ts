import type { NextConfig } from 'next';
import { createRequire } from 'node:module';
import { withPayload } from '@payloadcms/next/withPayload'

const require = createRequire(import.meta.url);

const config: NextConfig = {
  output: 'standalone',
  adapterPath: require.resolve('adapter-bun'),
};

export default withPayload(config);