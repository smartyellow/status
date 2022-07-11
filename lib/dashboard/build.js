'use strict';

const { minify: minifyCSS } = require('csso');
const { rollup } = require('rollup');
const commonjs = require('@rollup/plugin-commonjs');
const css = require('rollup-plugin-css-only');
const replace = require('@rollup/plugin-replace');
const { default: resolve } = require('@rollup/plugin-node-resolve');
const svelte = require('rollup-plugin-svelte');
const { terser } = require('rollup-plugin-terser');

async function build({ server, settings }) {
  const serverDomain = server.settings.domain || 'localhost';
  const serverPort = server.settings.port || 80;
  const serverBase = `${serverDomain}:${serverPort}`;
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

        // Replace env vars
        replace({
          preventAssignment: false,
          values: {
            '__SERVER__': serverBase,
            '__CLUSTERS__': JSON.stringify(settings.clusters),
          },
        }),
      ],
    });

    const { output } = await bundle.generate({
      sourcemap: true,
      format: 'iife',
      name: 'app',
      file: 'public/build/bundle.js',
    });

    return {
      map: output[0].map.toUrl(),
      code: output[0].code,
      css: cssOutput.css,
    };
  }
  catch (error) {
    console.error('Error while building status dashboard: ', error);
  }
}

module.exports = build;
