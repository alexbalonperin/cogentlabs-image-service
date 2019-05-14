'use strict'

const redis = require("redis")

const redisClient = redis.createClient({host: "redis"});
redisClient.on("error", function (err) {
    console.log("Error " + err);
});

class Redis {
  set(key, value) {
    redisClient.set(key, value, redis.print)
  }

  setNew(id) {
    this.set(id, 'new')
  }

  setPublished(id) {
    this.set(id, 'published')
  }
}

module.exports = Redis
