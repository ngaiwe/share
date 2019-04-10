function loader(source) {
  console.log('loader-1')
  return source
}
loader.pitch = function () {
  console.log('pitch-1')
}

module.exports = loader