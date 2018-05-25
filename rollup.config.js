import { uglify } from 'rollup-plugin-uglify';

const devConfig = {
  input: 'svg-injector.js',
  output: {
    file: 'dist/svg-injector.js',
    format: 'umd',
    name: 'SVGInjector'
  }
};

const prodConfig = {
  input: 'svg-injector.js',
  output: {
    file: 'dist/svg-injector.min.js',
    format: 'umd',
    name: 'SVGInjector'
  },
  plugins: [uglify()]
};

export default [devConfig, prodConfig];
