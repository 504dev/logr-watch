# logr-watch

Watch log files and push it to logr

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
module.exports = {
  udp: ":7776",
  public_key: "MCAwDQYJKoZIhvcNAQEBBQADDwAwDAIFAMg7IrMCAwEAAQ==",
  private_key: "MC0CAQACBQDIOyKzAgMBAAECBQCHaZwRAgMA0nkCAwDziwIDAL+xAgJMKwICGq0=",
  files: [
    {
      path: "/var/log/system.log",
    },
    {
      path: "/var/log/nginx/nginx_error.log",
      level: "error",
    },
    {
      path: "./*.txt",
      logname: "test.txt",
      parser() {
        return ({ message }) => {
          const splitted = message.split(/\s+/);
          return {
            timestamp: splitted[0],
            level: splitted[1],
            message: splitted[2],
          };
        };
      },
    },
  ],
};
```
