const options = {
  presets: [
    ['@babel/env', { loose: true, modules: process.env.BABEL_OUTPUT || false }]
  ]
}

module.exports = options
