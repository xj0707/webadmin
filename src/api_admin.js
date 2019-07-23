//路由
const Router = require('koa-router')
const router = new Router()

//model
const MongoDB=require('./model/MongoDB')

// 管理员信息
router.post('/adminList', async function (ctx, next) {
    //获取参数
    let inparam = ctx.request.body
    let ip = ctx.request.ip
    MongoDB.insert('user',{userName:'zhangsan'})
    //入参校验
    // new Check().loginCheck(inparam)
    let res=await MongoDB.find('user')
    console.log(res)
    //逻辑处理
    let data=[]
    //返回结果
    ctx.body = { code: 0, msg: data }
})

module.exports = router