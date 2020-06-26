const path = require('path')
const glob = require('glob')
const util = require('util')
const program = require('commander')
const {Logr} = require('logr-node-client')
const {Watcher} = require('./watcher')

let {version} = require('./package')
const globp = util.promisify(glob)

program
    .option('-c, --config <string>', 'config path', null, false)
    .version(version, '-v, --version')

program
    .command('help')
    .description('show help message')
    .action(() => program.help())

program
    .command('init')
    .description('create config file')
    .action(() => {
        console.log('not implemented yet')
    })

program
    .action(async () => {
        const configPath = path.resolve(process.cwd(), program.config || 'config.js')
        const config = require(configPath);

        const logr = new Logr({
            udp: config.udp,
            publicKey: config.public_key,
            privateKey: config.private_key,
        });

        while (true) {
            await watch(config, logr)
            await sleep(5000)
        }
        // console.log(watchers)
    })

program.parse(process.argv)

const watchers = []

async function watch(config, logr) {
    for (let i = 0; i < config.files.length; i++) {
        const file = config.files[i]
        const patterns = [].concat(file.path || [])
        const paths = []
        for (let pattern of patterns) {
            paths.push(...await globp(pattern, {}))
        }
        watchers[i] = watchers[i] || {}
        for (let filepath of paths) {
            const abspath = path.resolve(process.cwd(), filepath)
            if (watchers[i][abspath]) {
                continue
            }
            console.log(abspath)
            watchers[i][abspath] = new Watcher({...file, path: abspath}, logr)
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
