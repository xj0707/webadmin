
const Cache = require('../lib/Cache')

class CaptchaModel {
    async set(inparam) {
        if (inparam.userName) {
            const cache = new Cache()
            await cache.set(`NA_CAPTCHA_${inparam.userName}`, inparam.code)
            cache.quit()
        }
    }
    async check(inparam) {
        const cache = new Cache()
        let cacheRes = await cache.get(`NA_CAPTCHA_${inparam.userName}`)
        if (inparam.captcha != cacheRes) {
            throw { code: -1, msg: '验证码错误！' }
        }
        await cache.del(`NA_CAPTCHA_${inparam.userName}`)
        cache.quit()
    }
}


module.exports = CaptchaModel