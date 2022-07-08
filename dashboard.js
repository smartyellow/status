'use strict';

const { build: viteBuild } = require('vite');
const { svelte } = require('@sveltejs/vite-plugin-svelte');
const fs = require('fs').promises;

const build = (prefix = '') => viteBuild({
  root: __dirname + '/gui/dashboard/',
  base: `${prefix}/statusdashboard/asset/`,
  plugins: [ svelte() ],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: '[hash].[ext]',
        entryFileNames: '[hash].js',
        chunkFileNames: '[hash].js',
      },
    },
    outDir: __dirname + '/gui/dashboard/build',
  },
});

const cleanup = () => fs.rm(__dirname + '/gui/dashboard/build', {
  recursive: true,
  force: true,
});

module.exports = { build, cleanup };
build();
