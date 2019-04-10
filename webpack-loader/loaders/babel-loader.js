const babel = require('@babel/core')
const babelUtils = require('loader-utils')

function loader (source) {
  let options = babelUtils.getOptions(this)
  console.log(options)
  let cb = this.async()
  babel.transform(source, {
    ...options,
    sourceMap: true,
    filename: this.resourcePath.split('/').pop()
  },(err, result) => {
    cb(err, result.code, result.map)
  })
}

module.exports = loader