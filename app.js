const config = require('config')
const moment = require('moment')
const jwt = require('jsonwebtoken')
// 应用服务与中间件
const koa = require('koa')
const koaBody = require('koa-body')     //入参json解析中间件
// 路由控制器
const testRoute = require('./src/api_test')
const loginRoute = require('./src/api_login')

//定时服务
require('./src/api_cron')

// 初始化服务与加载中间件
const app = new koa()
// 全局捕获错误中间件
app.use(async function (ctx, next) {
    try {
        await next()
    } catch (error) {
        console.log(error)
        ctx.status = 200
        if (!error.code) {
            ctx.body = { code: -1, msg: error.message }
        } else {
            ctx.body = { ...error }
        }

    }
})
app.use(koaBody())
// 日志记录及入参处理
app.use(async (ctx, next) => {
    console.log(moment().format(), ctx.method, `${ctx.header.host}${ctx.url}`)
    if (ctx.method != 'GET') {
        console.log('BODY', ctx.request.body)
    }
    // 统一输入数据trim处理
    if (ctx.request.body) {
        for (let i in ctx.request.body) {
            if (typeof (ctx.request.body[i]) == 'string') {
                ctx.request.body[i] = ctx.request.body[i].trim()
                if (ctx.request.body[i] == '') {
                    delete ctx.request.body[i]
                }
            }
        }
    }
    await next()
})
// 权限控制
app.use(async (ctx, next) => {
    // 是否放行跨域OPTIONS请求
    if (config.auth.cors && ctx.method == 'OPTIONS') {
        return next()
    }
    // 白名单直接返回
    if (config.auth.pass.length) {
        for (let item of config.auth.pass) {
            if (new RegExp(item).test(ctx.url)) return next()
        }
    }
    // 获取token
    let token = ctx.header[config.auth.tokenname] || ctx.header.token
    try {
        const tokenVerify = jwt.verify(token, config.auth.secret)
        if (tokenVerify) {
            let roleArr = config.auth.role[tokenVerify.role]
            for (let item of roleArr) {
                if (item.indexOf(':') != '-1') {
                    if (item.split(':')[0] != ctx.method) {
                        continue
                    }
                    item = item.split(':')[1]
                }
                if (new RegExp(item).test(ctx.url)) {
                    ctx.tokenVerify = tokenVerify
                    return next()
                }
            }
            ctx.status = 200
            ctx.body = { code: -1, msg: '权限不足！' }
        } else {
            ctx.status = 200
            ctx.body = { code: -1, msg: '未知token' }
        }
    } catch (error) {
        console.log(error)
        ctx.status = 200
        ctx.body = { code: -1, msg: error.message }
    }
})


app.use(testRoute.routes())                 //测试接口
app.use(loginRoute.routes())                //登陆接口

app.use(function (ctx, next) {
    ctx.status = 404
    ctx.body = { code: 404, msg: 'not found' }
})
// 监听端口
const PORT = config.sys.port
app.listen(PORT)
console.log(`服务器监听端口：${PORT}`)
