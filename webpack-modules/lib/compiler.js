const path = require('path')
const fs = require('fs')
// babylon 主要把源码转换为ast
// @babel/traverse 遍历ast节点
// @babel/types 修改ast节点
// @babel/generator 生成新的ast节点
const babylon = require('babylon')
const types = require('@babel/types')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default
const ejs = require('ejs')
const {
  SyncHook
} = require('tapable')

class Compiler {
  constructor(config) {
    this.config = config
    this.entryId // '.src/index.js
    this.assets = {}
    this.modules = {}
    this.entry = config.entry
    this.root = process.cwd()
    this.hooks = {
      entryOptions: new SyncHook(),
      compile: new SyncHook(),
      afterCompile: new SyncHook(),
      afterPlugins: new SyncHook(),
      run: new SyncHook(),
      emit: new SyncHook(),
      done: new SyncHook()
    }
    let plugins = this.config.plugins
    if (Array.isArray(plugins)) {
      plugins.forEach(plugin => plugin.apply(this))
    } else {
      void null
    }
    this.hooks.afterPlugins.call()
  }
  getSource(modulePath) {
    let content = fs.readFileSync(modulePath, 'utf-8')
    let rules = this.config.module.rules
    for (let i = 0; i < rules.length; i++) {
      let rule = rules[i]
      let {
        test,
        use
      } = rule
      let len = use.length - 1
      if (test.test(modulePath)) {
        // loader
        normalLoader()

        function normalLoader() {
          let loader = require(use[len--])
          content = loader(content)
          if (len > 0) {
            normalLoader()
          } else {
            void null
          }
        }
      } else {
        void null
      }
    }
    return content
  }
  parse(source, parentPath) {
    let ast = babylon.parse(source)
    let dependencies = []
    traverse(ast, {
      CallExpression(p) {
        let node = p.node
        if (node.callee.name === 'require') {
          node.callee.name = '__webpack_require__'
          let moduleName = node.arguments[0].value // 引用名字 './a'
          moduleName = moduleName + (path.extname(moduleName) ? '' : '.js')

          moduleName = './' + path.join(parentPath, moduleName)

          dependencies.push(moduleName)

          node.arguments = [types.stringLiteral(moduleName)]

        } else {
          void null
        }
      }
    })
    let sourceCode = generator(ast).code
    return {
      sourceCode,
      dependencies
    }
  }
  buildModule(modulePath, isEntry) {
    let source = this.getSource(modulePath)
    let moduleName = './' + path.relative(this.root, modulePath)
    if (isEntry) {
      this.entryId = moduleName
    }
    let {
      sourceCode,
      dependencies
    } = this.parse(source, path.dirname(moduleName))
    this.modules[moduleName] = sourceCode
    // console.log(this.modules)
    dependencies.forEach(dep => {
      this.buildModule(path.join(this.root, dep), false)
    })
  }
  emitFile() {
    let main = path.join(this.config.output.path, this.config.output.filename)
    let template = this.getSource(path.join(__dirname, 'main.ejs'))
    let code = ejs.render(template, {
      entryId: this.entryId,
      modules: this.modules
    })
    this.assets[main] = code
    fs.writeFileSync(main, this.assets[main])
  }
  run() {
    this.hooks.run.call()
    this.hooks.compile.call()
    this.buildModule(path.resolve(this.root, this.entry), true)
    this.hooks.afterCompile.call()
    this.emitFile()
    this.hooks.emit.call()
    this.hooks.done.call()
  }
}

module.exports = Compiler