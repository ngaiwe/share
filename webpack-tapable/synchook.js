class SyncHook {
  constructor (args) {
    this.tasks = []
  }
  tap (name, task) {
    this.tasks.push(task)
  }
  call (...args) {
    this.tasks.forEach(task => task(...args))
  }
}
class SyncBailHook {
  constructor (args) {
    this.tasks = []
  }
  tap (name, task) {
    this.tasks.push(task)
  }
  call (...args) {
    let result, index = 0
    do {
      result = this.tasks[index++](...args)
    } while (result === undefined && index < this.tasks.length);
  }
}

class SyncWaterfallHook {
  constructor (args) {
    this.tasks = []
  }
  tap (name, task) {
    this.tasks.push(task)
  }
  call (...args) {
    let [first, ...others] = this.tasks
    let result = first(...args)
    others.reduce((a,b) => {
      if (a) {
        return b(a)
      } else {
        return b(...args)
      }
    }, result)
  }
}

class SyncLoopHook {
  constructor (args) {
    this.tasks = []
  }
  tap (name, task) {
    this.tasks.push(task)
  }
  call (...args) {
    this.tasks.forEach(task => {
      let result
      do {
        result = task(...args)
      } while (result != undefined);
    })
  }
}


module.exports = {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook
}