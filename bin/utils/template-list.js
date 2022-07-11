const ora = require('ora')
const {
    promisify
} = require('util')
const request = promisify(require('request'))
const chalk = require('chalk')

/**
 * 加速方案 来自于 https://zhuanlan.zhihu.com/p/337469043
 * 查询线上模板列表
 */
module.exports = async function getTemplateList() {
    const spinner = ora(chalk.green('正在查询模板列表...'))
    spinner.start()

    const result = await request({
        // url: 'https://raw.fastgit.org/ChongYu-Yease/template-list/master/template-list.json',
        // url: 'https://raw.githubusercontent.com/ChongYu-Yease/template-list/master/template-list.json',
        url: 'https://cdn.jsdelivr.net/gh/ChongYu-Yease/template-list@master/template-list.json',
        timeout: 3000,
    }).catch(() => {
        spinner.fail(chalk.red('查询失败，请稍后再试'))
        process.exit(1)
    })
    spinner.succeed(chalk.green('🎉 模板列表查询完成\n'))
    return JSON.parse(result.body)
}