'use strict';

const { rollup } = require('rollup');
const commonjs = require('@rollup/plugin-commonjs');
const css = require('rollup-plugin-css-only');
const { default: resolve } = require('@rollup/plugin-node-resolve');
const svelte = require('rollup-plugin-svelte');
const { terser } = require('rollup-plugin-terser');

async function build() {
  let cssOutput = '';

  try {
    const bundle = await rollup({
      input: __dirname + '/../../gui/dashboard/index.js',
      plugins: [
        // Svelte
        svelte({
          compilerOptions: {
            dev: false,
            generate: 'dom',
          },
        }),

        // Extract CSS
        css({ output: style => cssOutput = style }),

        // Resolve dependencies
        resolve({
          browser: true,
          dedupe: [ 'svelte' ],
        }),

        // CommonJS functions
        commonjs(),

        // Minify
        terser(),
      ],
    });

    const { output } = await bundle.generate({
      sourcemap: false,
      format: 'iife',
      name: 'app',
      file: 'public/build/bundle.js',
    });

    return {
      map: output[0].map ? output[0].map.toUrl() : '',
      code: output[0].code,
      css: cssOutput,
    };
  }
  catch (error) {
    console.error('Error while building status dashboard: ', error);
  }
}

module.exports = build;
