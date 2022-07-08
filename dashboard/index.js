'use strict';

const { build: viteBuild } = require('vite');
const fs = require('fs').promises;
const { svelte } = require('@sveltejs/vite-plugin-svelte');

const path = __dirname + '/../gui/dashboard';

const build = (prefix = '') => viteBuild({
  root: path,
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
    outDir: path + '/build',
  },
});

const cleanup = () => fs.rm(path + '/build', {
  recursive: true,
  force: true,
});

module.exports = { build, cleanup, path };
build();
