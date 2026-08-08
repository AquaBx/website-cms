import type { NextConfig } from 'next';
import { createRequire } from 'node:module';
import { paraglideWebpackPlugin } from "@inlang/paraglide-js";

const require = createRequire(import.meta.url);

const config: NextConfig = {
  webpack: (config) => {
    config.plugins.push(
      paraglideWebpackPlugin({
        project: './src/project.inlang',
        outdir: './src/paraglide',
        emitTsDeclarations: true,
      })
    );
    return config;
  },
  adapterPath: require.resolve('adapter-bun'),
};

export default config;