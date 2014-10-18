var easy_args = require('./easy.js')
  , assert = require('assert')

function make_argv(str) {
  return str.split(' ')
}

function test_basic() {
  var argv = make_argv('node test.js --port 80')
    , port = easy_args('port', argv)

  assert.strictEqual(port, 80)
}

function test_defaults() {
  var argv = make_argv('node test.js')
    , port = easy_args('port', { default: 8080 }, argv)
    , host = easy_args('host', { default: '' }, argv)

  assert.strictEqual(port, 8080)
  assert.strictEqual(host, '')
  assert.strictEqual(easy_args('nonexistent'), null)
}

function test_dashes() {
  var argv = make_argv('node test.js --port 80')
    , port1 = easy_args('port', { dashes: 'require' }, argv)
    , port2 = easy_args('port', { dashes: false, default: 8080 }, argv)

  assert.strictEqual(port1, 80)
  assert.strictEqual(port2, 8080)
}

function test_flags() {
  var argv = make_argv('node test.js --some-flag')
    , flag = easy_args('some-flag', { flag: true }, argv)
    , noflag = easy_args('some-flag', { flag: true }, [])

  assert.strictEqual(flag, true)
  assert.strictEqual(noflag, false)
}

function test_numbers() {
  var numbers = [0, -1, -23.76, 10, 100, 23.4534]
  numbers.forEach(function(n) {
    var argv = make_argv('node test.js --port '+n)
      , port = easy_args('port', argv)

    assert.strictEqual(port, n)
  })
}

function test_aliases() {
  var argv = make_argv('node test.js -p 8090')
    , argv2 = make_argv('node test.js -t 8090')

  assert.strictEqual(easy_args(['port', 'p'], argv), 8090)
  assert.strictEqual(easy_args('port', {alias: 'p'}, argv), 8090)
  assert.strictEqual(easy_args('port', {alias: ['p', 't']}, argv2), 8090)
}

function test_batches() {
  var argv = make_argv('node test.js --arg1 23 --arg2 test --flag1 --arg-3 hyphenated')
    , args = easy_args({
        arg1: { default: 1 },
        arg2: { default: 'arg 2' },
        flag1: { flag: true },
        flag2: { flag: true },
        'arg-3': { default: 'arg-3' },
    }, argv)

    assert.strictEqual(args.arg1, 23)
    assert.strictEqual(args.arg2, 'test')
    assert.strictEqual(args.flag1, true)
    assert.strictEqual(args.flag2, false)
    assert.strictEqual(args['arg-3'], 'hyphenated')
}

function test_env() {
  var argv = make_argv('node test.js --port 2300')
  // should pull from process.env
  var home = easy_args('home', { env: true }, argv)

  // should pull from argv
  var port = easy_args('port', { env: true }, argv)

  assert.strictEqual(home, process.env.HOME)
  assert.strictEqual(port, 2300)
}

test_basic()
test_defaults()
test_dashes()
test_flags()
test_numbers()
test_aliases()
test_batches()
test_env()
console.log('OK!')
