const loaderUtils = require('loader-utils')

function loader (source) {
  let str = `
    let style = document.createElement('style');
    style.innerHTML = ${JSON.stringify(source)};
    document.head.appendChild(style);
  `
  return str
}

loader.pitch = function (reminingRequest) {
  let str = `
    let style = document.createElement('style');
    style.innerHTML = require(${loaderUtils.stringifyRequest(this, "!!"+reminingRequest)}});
    document.head.appendChild(style);
  `
  return str
}

module.exports = loader