const cron = require('node-cron')
const moment = require('moment')


//每十秒定时执行一次
cron.schedule('*/10 * * * * *', async () => {
    let date = moment().format()
    console.log(`当前时间：${date}`)
})
//每五分钟定时执行一次
cron.schedule('0 */5 * * * *', async () => {
    let date = moment().format()
    console.log(`当前时间：${date}`)
})

//每天凌晨2点执行一次)
cron.schedule('0 0 2 * * *', async () => {
    let date = moment().format()
    console.log(`当前时间：${date}`)
})