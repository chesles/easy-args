# easy-args

A stupidly simple command-line argument reader.

# WTF WHY?

There are a lot of great full-featured command-line argument parsers out there:
[minimist][minimist], [yargs][yargs], [nomnom][nomnom], and a gazillion others
in [npm][npm-argv].

`easy_args` is for when you just want something a tiny bit better than
`process.argv.indexOf('--arg')`, but you don't need/want something fancy and
complicated.

# API

Get the value of an argument, provide an optional default.

`easy_args` just looks for something in process.argv that looks like either 'arg' or
'--arg', and returns the value immediately after it.

```js
var easy_args = require('easy-argv')

var port = easy_args('port', { default: 8080 })

// check for a flag - return true if the option is present, false if not
var secure = easy_args('ssl', { flag: true })
```

That's it.

## OK THERE'S (a little) MORE

### Numeric args

Anything that looks like a number is converted to a number:

```js
var port = easy_args('port')
// => 8080 (not "8080")
```

Automatic conversion can be disabled by passing the `numbers: false` option:

```js
var port = easy_args('port', { numbers: false })
// => "8080" (not 8080)
```

### Custom argument array

Provide a custom argv array as the last argument. We use `process.argv` by default.

```js
var port = easy_args('port', { default: 8080 }, ['port', '3117'])
//=> 3117

var port = easy_args('port', { default: 8080 }, [])
//=> 8080

var name = easy_args('name', ['name', 'Steve'])
//=> 'Steve'
```

### Environment Variables

Environment-based configuration is nice, let's support that. Just pass `env: true`:

```js
var port = easy_args('port', { default: 8080, env: true })
// looks in process.env for PORT first, then argv for 'port' or '--port'
```

### Aliases

Allow multiple names for arguments by passing an array of names, or using the
`alias` option (which can also be an array if you want to have lots of names
for the same option. Don't go too crazy with this though.)

```js
var port = easy_args(['port', 'p'], { default: 8080 })
var port = easy_args('port', { default: 8080, alias: 'p' })
```

### Batch mode

Get a batch of args all at once

```js
var args = easy_args({
  port: { alias: 'p', default: 8080 },
  ssl: { flag: true },
})
```

That's all there is. EASY, RIGHT?

  [yargs]: https://github.com/chevex/yargs
  [minimist]: https://github.com/substack/minimist
  [nomnom]: https://github.com/harthur/nomnom
  [npm-argv]: https://www.npmjs.org/search?q=argv
