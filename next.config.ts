import type { NextConfig } from 'next';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const config: NextConfig = {
  adapterPath: require.resolve('adapter-bun'),
};

export default config;