const path = require('path')
const glob = require('glob')
const util = require('util')
const {Logr} = require('logr-node-client')
const {Watcher} = require('./watcher')

const globp = util.promisify(glob)

class App {
    constructor(config) {
        this.config = config
        this.logr = new Logr({
            udp: config.udp,
            publicKey: config.public_key,
            privateKey: config.private_key,
        })
        this.watchers = []
    }

    async loop() {
        while (true) {
            await this.watch()
            await sleep(5000)
        }
    }

    async watch() {
        for (let i = 0; i < this.config.files.length; i++) {
            const file = this.config.files[i]
            const patterns = [].concat(file.path || [])
            const paths = []
            for (let pattern of patterns) {
                paths.push(...await globp(pattern, {}))
            }
            this.watchers[i] = this.watchers[i] || {}
            for (let filepath of paths) {
                const abspath = path.resolve(process.cwd(), filepath)
                if (this.watchers[i][abspath]) {
                    continue
                }
                console.log(abspath)
                this.watchers[i][abspath] = new Watcher({...file, path: abspath}, this.logr)
            }
        }
    }

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {App}
