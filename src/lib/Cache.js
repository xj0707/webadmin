const redis = require('redis')

class Cache {
    constructor() {
        this.redisClient = redis.createClient({ url: 'redis://redis-14763.c12.us-east-1-4.ec2.cloud.redislabs.com:14763', password: 'pW5kx51hWqgk2bLXx0F034lRfAGEH7Ii' })
    }
    get(key) {
        return new Promise((resolve, reject) => {
            this.redisClient.get(key, function (err, res) {
                if (err) {
                    reject(err)
                } else {
                    console.log(res)
                    resolve(JSON.parse(res || '{}'))
                }
            })
        })
    }
    set(key, obj) {
        return new Promise((resolve, reject) => {
            this.redisClient.set(key, JSON.stringify(obj), function (err, res) {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    }
    quit() {
        this.redisClient.quit()
    }
    del(key) {
        return new Promise((resolve, reject) => {
            this.redisClient.del(key, function (err, res) {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    }
}

module.exports = Cache