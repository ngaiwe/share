#! /usr/bin/env node

const path = require('path')

const config = require(path.resolve('webpack.config.js'))

const Compiler = require('../lib/compiler')

let compiler = new Compiler(config)
compiler.hooks.entryOptions.call()
compiler.run()