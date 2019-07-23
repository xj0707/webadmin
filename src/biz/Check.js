const RegEnum = require('../lib/util').RegEnum
const Util = require('../lib/util').Util
//检查类
module.exports = class Check {
    //登录检查
    loginCheck(inparam) {
        //需要检查的元素枚举
        // let checkArr = [
        //     { name: "test1", type: "Num", min: 4, max: 4 },
        //     { name: "test2", type: "Str", min: 2, max: 4 },
        //     { name: "test3", type: "Reg", equal: RegEnum.EMAIL },
        //     { name: "test4", type: "Str" ,min: 6, max: 12 },
        //     { name: "test5", type: "Array" },
        //     { name: "test6", type: "Obj" }
        // ]
        let checkArr = [
            { name: "userName", type: "Str", min: 6, max: 12 }
        ]
        let res = Util.check(checkArr, inparam)
        if (res.length != 0) {
            throw { code: -1, msg: '入参不合法', detail: res }
        }
    }
    //检查验证码参数
    checkCaptcha(inparam) {
        let checkArr = [
            { name: "userName", type: "Str", min: 6, max: 12 }
        ]
        let res = Util.check(checkArr, inparam)
        if (res.length != 0) {
            throw { code: -1, msg: '入参不合法', detail: res }
        }
    }




}