#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const program = require('commander')

const {Logrw} = require('../index')
let {version} = require('../package')

program
    .option('-c, --config <string>', 'set config path')
    .version(version, '-v, --version')

program
    .command('help')
    .description('show help message')
    .action(() => program.help())

program
    .command('init')
    .description('create config file')
    .action(() => {
        const configpath = path.resolve(process.cwd(), 'config.js')
        if (fs.existsSync(configpath)) {
            console.error('Config file «%s» already exists!', configpath)
            return
        }
        const templatepath = path.resolve(__dirname, '../config.template.js')
        fs.copyFileSync(templatepath, configpath)
    })

program
    .action(async () => {
        const configpath = path.resolve(process.cwd(), program.config || 'config.js')
        if (!fs.existsSync(configpath)) {
            console.error('Config file «%s» not found.', configpath)
            return
        }
        const config = require(configpath)
        const app = new Logrw(config)
        await app.loop()
    })

program.parse(process.argv)
