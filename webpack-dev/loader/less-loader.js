const less = require('less')

function loader (source) {
  let css = ''
  less.render(source, function(err, c) {
    css = c.css.replace(/\n/, '//n')
  })
  return css
}

module.exports = loader