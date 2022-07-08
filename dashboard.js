'use strict';

const { build: viteBuild } = require('vite');
const { svelte } = require('@sveltejs/vite-plugin-svelte');
const fs = require('fs').promises;

const build = (prefix = '') => viteBuild({
  root: __dirname + '/gui/dashboard',
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

const cleanup = () => fs.rmdir(__dirname + '/gui/dashboard/build');

module.exports = { build, cleanup };
build();
