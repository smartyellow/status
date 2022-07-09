'use strict';

const { minify: minifyCSS } = require('csso');
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
      input: __dirname + '/gui/dashboard/index.js',
      plugins: [
        // Svelte
        svelte({
          compilerOptions: {
            dev: false,
            generate: 'dom',
          },
        }),

        // Extract CSS
        css({
          output: style => cssOutput = minifyCSS(style),
        }),

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
      sourcemap: true,
      format: 'iife',
      name: 'app',
      file: 'public/build/bundle.js',
    });

    return {
      code: output[0].code,
      css: cssOutput.css,
    };
  }
  catch (error) {
    console.error('Error while building status dashboard: ', error);
  }
}

module.exports = build;
