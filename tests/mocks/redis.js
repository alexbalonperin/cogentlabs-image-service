'use strict'

class RedisMock {
  constructor () {
    this.storage = {}
  }
  set (key, value) {
    this.storage[key] = value
  }

  setNew (id) {
    this.set(id, JSON.stringify({ status: 'new' }))
  }

  setPublished (id) {
    this.set(id, JSON.stringify({ status: 'published' }))
  }

  get (id, cb) {
    return cb(null, this.storage[id])
  }
}

module.exports = RedisMock
