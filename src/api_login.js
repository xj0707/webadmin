//路由
const Router = require('koa-router')
const router = new Router()
//工具
const config = require('config')
const cron = require('node-cron')
const _ = require('lodash')
const IP2Region = require('ip2region')
const ipquery = new IP2Region()
const axios = require('axios')
const captchapng = require('captchapng')
const jwt = require('jsonwebtoken')
const NP = require('number-precision')
const uuid = require('uuid/v4')
//model类
const Check = require('./biz/Check')
const CaptchaModel = require('./model/CaptchaModel')

// 登陆
router.post('/login', async function (ctx, next) {
    //获取参数
    let inparam = ctx.request.body
    let ip = ctx.request.ip
    //入参校验
    new Check().loginCheck(inparam)
    //逻辑处理
    let data = { username: 'xj', role: '10' }
    //生成token
    let token = jwt.sign({
        ...data,
        exp: Math.floor(Date.now() / 1000) + 86400 * 3
    }, config.auth.secret)
    //返回结果
    ctx.body = { code: 0, msg: data, token }
})

// 获取验证码
router.post('/captcha', async function (ctx, next) {
    let inparam = ctx.request.body
    inparam.code = _.random(1000, 9999)
    // 检查参数是否合法
    new Check().checkCaptcha(inparam)
    await new CaptchaModel().set(inparam)
    let p = new captchapng(80, 30, inparam.code)
    p.color(255, 255, 255, 0)
    p.color(80, 80, 80, 255)
    // 结果返回
    ctx.body = { code: 0, payload: p.getBase64() }
})


//ip查询
async function queryIp(ip) {
    if (ip == '0.0.0.0') {
        return ['其他', '其他', '其他']
    }
    let ipObj = ipquery.search(ip)
    if (ipObj && ipObj.country != '0') {
        return [ipObj.country, ipObj.province.slice(0, ipObj.province.indexOf('省') == -1 ? ipObj.province.length : ipObj.province.indexOf('省')), ipObj.city]
    } else {
        try {
            // 淘宝IP查询
            let res = await axios.get(`http://ip.taobao.com/service/getIpInfo.php?ip=${ip}`)
            if (res.data && res.data.data.country && res.data.data.country != 'XX') {
                return [res.data.data.country, res.data.data.region.slice(0, res.data.data.region.indexOf('省') == -1 ? res.data.data.region.length : res.data.data.region.indexOf('省')), res.data.data.city]
            } else {
                return ['其他', '其他', '其他']
            }
        } catch (error) {
            // 其他IP查询
            let res2 = await axios.get(`http://freeapi.ipip.net/${ip}`)
            if (res2.data && res2.data.length > 0 && res2.data != 'not found' && res2.data[0] != '保留地址' && res2.data[0] != '局域网') {
                return [res2.data[0], res2.data[1].slice(0, res2.data[1].indexOf('省') == -1 ? res2.data[1].length : res2.data[1].indexOf('省')), res2.data[2]]
            } else {
                return ['其他', '其他', '其他']
            }
        }
    }
}

module.exports = router
