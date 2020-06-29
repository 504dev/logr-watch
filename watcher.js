const {basename} = require('path')
const {Tail} = require('tail')

class Watcher {
    constructor({path, logname, parser, level}, logr) {
        this.level = level
        this.parser = parser
        this.path = path
        this.logname = logname || basename(path)
        this.logger = logr.newLogger(this.logname)
        this.tail = new Tail(this.path)
        this.tail.on('line', this.handleLine.bind(this))
        this.tail.on('error', this.handleError.bind(this))
    }

    handleError(e) {
        this.logger.error(e)
    }

    handleLine(line) {
        let base = this.logger.blank(this.level, line)
        let diff = this.parser ? this.parser()({...base}) : {}
        if (!diff) {
            return
        }
        const log = {...base, ...diff}
        this.logger._send(log)
    }
}

module.exports = {Watcher}
