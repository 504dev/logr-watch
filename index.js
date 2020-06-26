const fs = require('fs')
const path = require('path')
const glob = require('glob')
const util = require('util')
const program = require('commander')
const {Logr} = require('logr-node-client')
const {Watcher} = require('./watcher')

let {version} = require('./package')
let globp = util.promisify(glob)

program
    .option('-c, --config <string>', 'config path', null, false)
    .version(version, '-v, --version')

program
    .command('help')
    .description('show help message')
    .action(() => program.help())

program
    .action(async () => {
        const configPath = path.resolve(process.cwd(), program.config || 'config.js')
        const config = require(configPath);

        const logr = new Logr({
            udp: ":7776",
            publicKey: "MCAwDQYJKoZIhvcNAQEBBQADDwAwDAIFAMg7IrMCAwEAAQ==",
            privateKey: "MC0CAQACBQDIOyKzAgMBAAECBQCHaZwRAgMA0nkCAwDziwIDAL+xAgJMKwICGq0=",
        });

        // const watchers = []
        for (let file of config.files) {
            const patterns = [].concat(file.path || [])
            for (let pattern of patterns) {
                const paths = await globp(pattern, {})
                for (let filepath of paths) {
                    filepath = path.resolve(process.cwd(), filepath)
                    // TODO logname func
                    const watcher = new Watcher({...file, path: filepath}, logr)
                    // watchers.push(watcher)
                }
            }

        }
        // console.log(watchers)
    })

program.parse(process.argv)
