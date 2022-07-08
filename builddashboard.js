'use strict';

const { build: viteBuild } = require('vite');
const { svelte } = require('@sveltejs/vite-plugin-svelte');

module.exports = () => viteBuild({
  root: __dirname + '/gui/dashboard',
  base: '.',
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

module.exports();
