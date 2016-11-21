const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const includePaths = require('rollup-plugin-includepaths')

const includePathOptions = {
    include: {},
    paths: ['src'],
    external: [],
    extensions: ['.js']
};

module.exports = {
  entry: 'src/index.js',
  dest: 'dist/bundle.js',
  format: 'cjs',
  plugins: [
    includePaths(includePathOptions),
    nodeResolve({ jsnext: true, main: true }),
    commonjs()
  ],
  external: [
    'choo',
    'choo/html',
    'pixi.js'
  ]
}
