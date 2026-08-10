import type { NextConfig } from 'next';
import { createRequire } from 'node:module';
import { paraglideWebpackPlugin } from "@inlang/paraglide-js";
import { withPayload } from '@payloadcms/next/withPayload'

const require = createRequire(import.meta.url);

const config: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.typ$/,
      type: 'asset/source',
    });
    config.plugins.push(
      paraglideWebpackPlugin({
        project: './src/project.inlang',
        outdir: './src/paraglide',
        emitTsDeclarations: true,
        strategy: ["cookie", "baseLocale"],
      })
    );
    return config;
  },
  adapterPath: require.resolve('adapter-bun'),
};

export default withPayload(config);