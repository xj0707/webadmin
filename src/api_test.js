const Router = require('koa-router')
const router = new Router()


// get请求
router.get('/ping/:userId', async function (ctx, next) {
    let userId = ctx.params.userId   //:userId  取匹配值
    let inparam= ctx.request.query   //？a=123&b=456  取问号传参值
    console.log(inparam)
    ctx.body = { code: 0, data: userId }
})

// post请求
router.post('/postData', async function (ctx, next) {
    let inparam = ctx.request.body      
    ctx.body = { code: 0, data: inparam }
})


module.exports = router