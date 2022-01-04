// 检测网络
const isOnline = require('is-online')
const chalk = require('chalk')
/**
 * 检查网络
 */
module.exports = async () => {
    const online = await isOnline({
        timeout: 1000,
        version: 'v4',
    })
    if (!online) {
        console.log(chalk.red('请检查网络'))
        process.exit(1)
    }
}
