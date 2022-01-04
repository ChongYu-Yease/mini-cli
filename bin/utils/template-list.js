const ora = require('ora')
const { promisify } = require('util')
const request = promisify(require('request'))
const chalk = require('chalk')

/**
 * 加速方案 来自于 https://zhuanlan.zhihu.com/p/337469043
 * 查询线上模板列表
 */
module.exports = async function () {
    const spinner = ora(chalk.green('正在查询模板列表'))
    spinner.start()
    const result = await request({
        url: 'https://raw.fastgit.org/ChongYu-Yease/template-list/master/template-list.json',
        timeout: 3000,
    }).catch(() => {
        spinner.fail(chalk.red('😔 模版拉取失败,请检查网络连接后再试一次'))
        process.exit(1)
    })
    spinner.succeed(chalk.green('🎉 模板列表查询完成\n'))

    return JSON.parse(result.body)
}
