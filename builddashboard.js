'use strict';

const svelte = require('rollup-plugin-svelte');
const { terser } = require('rollup-plugin-terser');
const { rollup } = require('rollup');
const { default: resolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const { minify: minifyCSS } = require('csso');

async function build() {
  let cssOutput = { css: '', map: null };

  try {
    const bundle = await rollup({
      input: __dirname + '/gui/dashboard/index.js',
      plugins: [
        svelte({
          emitCss: false,
          compilerOptions: {
            dev: false,
            generate: 'dom',
          },
          preprocess: {
            style: ({ content }) => {
              cssOutput = minifyCSS(content);
              return '';
            },
          },
        }),
        resolve({
          browser: true,
          dedupe: [ 'svelte' ],
        }),
        commonjs(),
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
