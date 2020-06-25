const {resolve, basename} = require('path')
const {Tail} = require('tail')

class Watcher {
    constructor({path, logname, handler, level}, logr) {
        this.level = level
        this.handler = handler
        this.path = path
        this.abspath = resolve(process.cwd(), path)
        this.logname = logname || basename(path)
        console.log(this.path, this.abspath, this.logname)
        this.logger = logr.newLogger(this.logname)
        this.tail = new Tail(this.abspath)
        this.tail.on('line', this.handleLine.bind(this))
        this.tail.on('error', console.error)
    }

    handleLine(line) {
        let base = this.logger.blank(this.level, line)
        let diff = this.handler ? this.handler()({...base}) : {}
        if (!diff) {
            return
        }
        const log = {...base, ...diff}
        this.logger._send(log)
    }
}

module.exports = {Watcher}
