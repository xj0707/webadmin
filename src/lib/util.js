//正则表达式枚举
const RegEnum = {
    URL: /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/,
    IP: /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/,
    PASSWORD: /^[A-Za-z0-9]{6,12}$/,
    DISPLAYNAME: /^[\u4E00-\u9FA5A-Za-z0-9]{2,10}$/,
    USERNAME: /^[A-Za-z0-9_\-.@]{5,16}$/,
    EMAIL: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    RATE: /^(\d{1,2}(\.\d{1,2})?|100(\.0{1,2})?)$/,
    PRICE: /^[0-9]+([.]{1}[0-9]{1,2})?$/,
    NUMBER: /^[0-9]+$/
}
//常用工具
class Util {
    //检查入参
    static check(checkArr, inparam) {
        let errorArr = []
        for (let item of checkArr) {
            let name = item.name
            let type = item.type
            if (!inparam[name]) {
                errorArr.push(name)
                continue
            }
            switch (type) {
                case 'Reg':  //正则检验
                    if (!item.equal.test(inparam[name])) errorArr.push(name)
                    break;
                case 'Str':    //校验字符串
                    if (inparam[name].length > item.max || inparam[name].length < item.min) errorArr.push(name)
                    break;
                case 'Num':    //校验数字长度
                    if (Number.isNaN(+inparam[name])) { errorArr.push(name) }
                    if (inparam[name] > item.max || inparam[name] < item.min) { errorArr.push(name) }
                    break;
                case 'Obj':  //校验是否是对象
                    if (checkType(inparam[name]) != 'object') errorArr.push(name)
                    break;
                case 'Array':  //校验是否是数组
                    if (checkType(inparam[name]) != 'array') errorArr.push(name)
                    break;
                default:
                    throw { code: -1, msg: '系统内部错误' }
            }
        }
        return errorArr
    }

}

//内部方法
//校验入参类型
function checkType(o) {
    let s = Object.prototype.toString.call(o)
    return s.match(/\[object (.*?)\]/)[1].toLowerCase()
}

module.exports = {
    RegEnum,
    Util
}