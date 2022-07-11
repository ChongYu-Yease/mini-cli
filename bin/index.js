#!/usr/bin/env node

const checkNodeVersion = require('./utils/check-node-version')
checkNodeVersion()
const {
    Command
} = require('commander')
const program = new Command()
const listLog = require('./utils/list-log')
const downloadTemplate = require('./utils/download-template')
const templateQuestions = require('./questions/template-questions')
const initQuestions = require('./questions/init-questions')
const handleSetPackageJson = require('./package-json/index')
const installDependencies = require('./utils/install-dependencies')
const chalk = require('chalk')
const checkCliVersion = require('./utils/check-cli-version')
const checkInternet = require('./utils/check-internet')
const checkFolder = require('./utils/check-folder')
const getTemplateList = require('./utils/template-list.js')
const fs = require('fs')
const path = require('path')
const packagePath = path.resolve(__dirname, '../package.json')
const packageContent = JSON.parse(fs.readFileSync(packagePath))

const {
    bin,
    version
} = packageContent
const cliShell = Object.keys(bin)[0]

program.version(version, '-v,-V,--version')

/**
 * 初始化指定版本的指令
 */
program
    .command('create <templateName> <projectName>')
    .description(chalk.yellowBright('通过指定模版创建项目'))
    .action(async (templateName, projectName) => {
        // 检查网络
        await checkInternet()
        // 检查版本号
        await checkCliVersion()
        // 收集用户配置
        const answers = await templateQuestions(projectName)
        // 检查文件
        const checkedProjectName = await checkFolder(projectName)
        // 下载模板
        await downloadTemplate(templateName, checkedProjectName, answers)
        // 现在成功之后 修改package.json 内容
        await handleSetPackageJson(checkedProjectName, answers)
        // 安装依赖包
        installDependencies(templateName, checkedProjectName)
    })

/**
 * 用户自己选择版本
 */
program
    .command('init')
    .description(chalk.greenBright('初始化模板'))
    .action(async () => {
        // 检查网络
        await checkInternet()
        // 检查版本号
        await checkCliVersion()
        // 收集用户信息
        const answers = await initQuestions()
        const {
            templateName,
            projectName
        } = answers
        // 检查文件
        const checkedProjectName = await checkFolder(projectName)
        // 下载模板
        await downloadTemplate(templateName, checkedProjectName, answers)
        // 现在成功之后 修改package.json 内容
        await handleSetPackageJson(checkedProjectName, answers)
        // 安装依赖包
        installDependencies(templateName, checkedProjectName)
    })

/**
 * 查看所有的vue版本指令
 * */
program
    .command('list')
    .description(chalk.redBright('查看所有模版列表'))
    .action(async () => {
        // 检查版本号
        await checkCliVersion()
        const templates = await getTemplateList()
        listLog(templates)
    })

program
    .command('help')
    .description('脚手架帮助指令')
    .action(() => {
        console.log(
            `${chalk.blueBright(`${cliShell} list`)} : ${chalk.blueBright(
                '查看所有模板列表'
            )}`
        )
        console.log(
            `${chalk.redBright(`${cliShell} init`)} : ${chalk.redBright(
                '自定义选择模板'
            )}`
        )
        console.log(
            `${chalk.yellowBright(
                `${cliShell} create <模板名称> <项目名称>`
            )} : ${chalk.yellowBright('指定模板名称创建项目')}`
        )
    })

program.parse(process.argv)