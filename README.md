# logr-watch

Watch log files and push it to [Logr].

[Logr]: https://github.com/504dev/logr

## Usage

    -h, --help                 output usage information
    -v, --version              output the version number
    -c, --config <path>        path to config file
    init                       create config file
    help                       output usage information

## Getting started

```bash
npm i logr-watch -g
logrw init
logrw
```

## Config

```javascript
// logrw.config.js
module.exports = {
  udp: ":7776",
  public_key: "MCAwDQYJKoZIhvcNAQEBBQADDwAwDAIFAMg7IrMCAwEAAQ==",
  private_key: "MC0CAQACBQDIOyKzAgMBAAECBQCHaZwRAgMA0nkCAwDziwIDAL+xAgJMKwICGq0=",
  files: [
    // watch file
    {
      path: "/var/log/system.log",
    },
    // filter messages at error level and above
    {
      path: "/var/log/nginx/nginx_error.log",
      level: "error",
    },
    // watch multiple files, and log it under the name
    {
      path: "./*.txt",
      logname: "test.txt",
    },
    // using a custom parser
    {
      path: "./.pm2/logs/myapp*.log",
      logname: "myapp.pm2.log",
      parser() {
        return ({ message }) => {
          const match = /(.+?)\s+(.+?)\s+(.+)/.exec(message);
          if (match === null) {
            return null;
          }
          return {
            timestamp: match[1],
            level: match[2],
            message: match[3],
          };
        };
      },
    },
  ],
};
```
