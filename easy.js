function easy_args(names, options, argv) {
  // check for batch mode 
  if (isObject(names) && arguments.length <= 2) {
    return process_batch.apply(this, arguments)
  }

  var params  = normalize_arguments(names, options, argv)
    , names   = params.names
    , options = params.options
    , argv    = params.argv
    , index   = argv_index(names, argv)
    , value   = null

  if (options.env) {
    value = getenv(names.map(toUpper), process.env)
  }
  if (!value && index >= 0 && (index + 1) < argv.length) {
    value = argv[index + 1]
  }

  return apply_options(index, value, options)
}

function apply_options(index, value, options) {
  if (options.flag) {
    value = (index >= 0 ? true : false)
  }

  if (value === null && 'default' in options)
    value = options.default

  if (options.array && typeof value == 'string')
    value = value.split(options.separator || ',')

  if (options.numbers !== false)
    value = Array.isArray(value)
      ? value.map(makenum)
      : makenum(value)

  return value
}

function normalize_arguments(names, options, argv) {

  if (!Array.isArray(names))
    names = [names]
  else
    names = names.slice()

  if (Array.isArray(options) && argv === undefined) {
    argv = options
    options = undefined
  }

  options = options || {}
  argv = argv || process.argv

  // add aliases to names
  if ('alias' in options) {
    if (Array.isArray(options.alias)) {
      options.alias.forEach(function(a) { names.push(a) })
    }
    else {
      names.push(options.alias)
    }
  }

  // add dashed aliases unless disabled
  if (!('dashes' in options) || options.dashes) {
    var dashes = names.map(function(n) {
      if (!/^--?/.test(n)) {
         // double-dash for longer opts, single dash for short opts
         return (n.length > 1 ? '--' : '-') + n
      }
      return n
    })

    if (options.dashes == 'require') {
      names = dashes
    }
    else {
      names = names.concat(dashes)
    }
  }

  return {
    names: names,
    options: options,
    argv: argv,
  }
}

// return the index of the first value in names that is present in argv
// or -1 if no values are present in argv
function argv_index(names, argv) {
  var index = -1
  for (var i=0; i<names.length; i++) {
    if ((index = argv.indexOf(names[i])) >= 0)
      break
  }
  return index
}

function getenv(names, env) {
  var value
  for (var i=0; i<names.length; i++) {
    if (names[i] in env) {
      value = env[names[i]]
      break
    }
  }
  return value
}

function process_batch(batch, argv) {
  var results = {}
  
  Object.keys(batch).forEach(function(arg) {
    results[arg] = easy_args(arg, batch[arg], argv)
  })

  return results
}

function toUpper(s) {
  return s.toUpperCase()
}

function makenum(v) {
  var n
  // booleans, empty string, and null shouldn't get converted to numbers
  if (v === true || v === false || v === '' || v === null) return v
  if (!isNaN(n = Number(v))) return n
  else return v
}


function isObject(o) {
  var type = typeof o
  return type === 'function' || type === 'object' && !!o && !Array.isArray(o)
}

module.exports = easy_args
