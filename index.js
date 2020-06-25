const fs = require('fs');
const path = require('path');
const {Logr} = require('logr-node-client');
const {Watcher} = require('./watcher');

const configPath = path.resolve(process.cwd(), './config.js')
const config = require(configPath);

const logr = new Logr({
    udp: ":7776",
    publicKey: "MCAwDQYJKoZIhvcNAQEBBQADDwAwDAIFAMg7IrMCAwEAAQ==",
    privateKey: "MC0CAQACBQDIOyKzAgMBAAECBQCHaZwRAgMA0nkCAwDziwIDAL+xAgJMKwICGq0=",
});

const watchers = []
for (const file of config.files) {
    // console.log(file.path, fs.existsSync(file.path))
    if (!file.path || !fs.existsSync(file.path)) {
        continue
    }
    const watcher = new Watcher(file, logr)
    watchers.push(watcher)
}
