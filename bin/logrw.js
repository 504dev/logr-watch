#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const program = require('commander')

const {Logrw} = require('../app')

let {version} = require('../package')

program
    .option('-c, --config <string>', 'set config path', null, false)
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
            console.error('Config file already exists')
            return
        }
        const templatepath = path.resolve(__dirname, '../config.template.js')
        fs.copyFileSync(templatepath, configpath)
    })

program
    .action(async () => {
        const configPath = path.resolve(process.cwd(), program.config || 'config.js')
        const config = require(configPath);

        const app = new Logrw(config)

        await app.loop()
    })

program.parse(process.argv)
