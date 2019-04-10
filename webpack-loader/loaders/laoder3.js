function loader(source) {
  console.log('loader-3')
  return source
}

loader.pitch = function () {
  console.log('pitch-3')
}

module.exports = loader