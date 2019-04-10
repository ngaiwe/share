const loaderUtils = require('loader-utils')
const mime = require('mime')

function loader(source) {
  let {
    limit
  } = loaderUtils.getOptions(this)
  if (limit && limit > source.length) {
    let type = mime.getType(this.resourcePath)
    return `module.exports="data:${type};base64,${source.toString('base64')}"`
  } else {
    return require('./file-loader').call(this, source)
  }
}

loader.raw = true

module.exports = loader