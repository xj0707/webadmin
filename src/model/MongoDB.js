const config = require('config')
const MongoDB = require('mongodb')
const MongoClient = MongoDB.MongoClient
const ObjectID = MongoDB.ObjectID


class Db {
    //单例模式
    static getInstance() {
        if (!Db.instance) {
            Db.instance = new Db()
        }
        return Db.instance
    }
    //构造函数
    constructor() {
        this.dbClient = ''
        this.dbClient
    }
    //连接数据库
    connect() {
        let _that = this
        return new Promise((resolve, reject) => {
            if (!_that.dbClient) {
                MongoClient.connect(config.mongodb.url, { useNewUrlParser: true }, (err, client) => {
                    if (err) {
                        reject(err)
                    } else {
                        _that.dbClient = client.db(config.mongodb.dbName)
                        resolve(_that.dbClient)
                    }
                })
            } else {
                resolve(_that.dbClient)
            }
        })
    }
    //查找
    find(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                var result = db.collection(collectionName).find(json)
                result.toArray(function (err, docs) {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve(docs)
                })
            })
        })
    }
    //更新
    update(collectionName, json1, json2) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).updateOne(json1, {
                    $set: json2
                }, (err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
            })
        })
    }
    //插入
    insert(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).insertOne(json, function (err, result) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
            })
        })
    }
    //删除
    remove(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then((db) => {
                db.collection(collectionName).removeOne(json, function (err, result) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
            })
        })
    }
    //mongodb里面查询 _id 把字符串转换成对象
    getObjectId(id) {
        return new ObjectID(id)
    }
}

module.exports = Db.getInstance()
