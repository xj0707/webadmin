const PORT = 5000
const moment = require('moment')
// 应用服务与中间件
const koa = require('koa')
const koaBody = require('koa-body')     //入参json解析中间件
// 路由控制器
const testRoute = require('./src/api_test')
const loginRoute = require('./src/api_login')

// 初始化服务与加载中间件
const app = new koa()
// 全局捕获错误中间件
app.use(async function (ctx, next) {
    try {
        await next()
    } catch (error) {
        console.log(error)
        ctx.status = 200
        ctx.body = { code: -1, msg: '内部系统异常' }
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
app.use(testRoute.routes())                 //测试接口
app.use(loginRoute.routes())                //登陆接口

app.use(function (ctx, next) {
    ctx.status = 404
    ctx.body = { code: 404, msg: 'not found' }
})
// 监听端口
app.listen(PORT)
console.log(`服务器监听端口：${PORT}`)
