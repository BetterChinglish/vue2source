import json from '@rollup/plugin-json';
// import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import serve from 'rollup-plugin-serve';

// rollup.config.mjs
// ---cut-start---
/** @type {import('rollup').RollupOptions} */
// ---cut-end---
export default {
	input: 'src/main.js',
  output: [
    {
      file: 'dist/umd/vue.js',
      format: 'umd',
      name: 'Vue',
      sourcemap: true
    }
  ],
  plugins: [
    json(),
    resolve(),
    babel({
      exclude: 'node_modules/**'
    }),
    process.env.ENV === 'development' ? serve({
      open: true,
      openPage: '/public/main.html',
      port: 3000,
      contentBase: ''
    }) : null
  ]
};