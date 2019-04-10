const loaderUtils = require('loader-utils')

function loader(source) {
  let filename = loaderUtils.interpolateName(this, '[hash].[ext]', {
    content: source
  })
  this.emitFile(filename, source)
  return `module.exports="${filename}"`
}
loader.raw = true 

module.exports = loader