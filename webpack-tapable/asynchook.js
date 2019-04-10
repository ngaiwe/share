class AsyncParallelHook {
  constructor (args) {
    this.tasks = []
  }
  tapAsync (name, task) {
    this.tasks.push(task)
  }
  callAsync (...args) {
    let callback = args.pop(),
      index = 0,
      length = this.tasks.length
    this.tasks.forEach(task => task(...args, done))
    function done () {
      index++
      if (index == length) {
        callback()
      }
    }
  }
}

module.exports = {
  AsyncParallelHook,
}