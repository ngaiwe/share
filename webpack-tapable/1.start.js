let {
  AsyncSeriesHook
} = require('tapable')

class Lesson {
  constructor() {
    this.index = 0
    this.hooks = {
      arch: new AsyncSeriesHook(['name'])
    }
  }
  tap() {
    this.hooks.arch.tapAsync('weiran', (name, cb) => {
      setTimeout(() => {
        console.log('weiran:', name)
        cb()
      }, 1000)
    })
    this.hooks.arch.tapAsync('jujiajia', (name, cb) => {
      setTimeout(() => {
        console.log('jujiajai:', name)
        cb()
      }, 1000)
    })
  }
  start() {
    this.hooks.arch.callAsync('test', () => {
      console.log('end')
    })
  }
}

let l = new Lesson()
l.tap()
l.start()