const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const uglify = require('rollup-plugin-uglify').uglify
const fs = require('fs')

// see below for details on the options
const inputOptions = {
  input: 'src/index.js',
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
if (process.env.BABEL_ENV === 'production') inputOptions.plugins.push(uglify())

const outputOptions = {
  format: 'umd',
  name: 'ConwayJs'
}

async function build () {
  // create a bundle
  const bundle = await rollup.rollup(inputOptions)
  const { output } = await bundle.generate(outputOptions)

  // write the bundle to disk
  await fs.writeFileSync('./dist/index.js', output[0].code)
}

build()
