function loader(source) {
  console.log('loader-2')
  return source
}

loader.pitch = function () {
  console.log('pitch-2')
}

module.exports = loader