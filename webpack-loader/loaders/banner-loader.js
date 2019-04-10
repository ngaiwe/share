const path = require('path')
const fs = require('fs')
const loaderUtils = require('loader-utils')
const schemaUtils = require('schema-utils')

function loader(source) {
  this.cacheable && this.cacheable()
  let options = loaderUtils.getOptions(this)
  let cb = this.async()
  let schema = {
    type: 'object',
    properties: {
      text: {
        type: 'string'
      },
      filename: {
        type: 'string'
      }
    }
  }
  schemaUtils(schema, options, 'banner-loader')
  if (options.filename) {
    this.addDependency(options.filename)
    fs.readFile(options.filename, 'utf8', (err, data) => {
      cb(err, `/**${data}**/ ${source}`)
    })
  } else {
    cb(null, `/**${options.text}**/ ${source}`)
  }
}

module.exports = loader