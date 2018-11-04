(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 119);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

try {
  var util = __webpack_require__(0);
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  module.exports = __webpack_require__(37);
}


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("buffer");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 8 */,
/* 9 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(40);

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("zlib");

/***/ }),
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */
/***/ (function(module, exports) {

module.exports = require("net");

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),
/* 37 */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Detect Electron renderer process, which is node, but we should
 * treat as a browser.
 */

if (typeof process !== 'undefined' && process.type === 'renderer') {
  module.exports = __webpack_require__(39);
} else {
  module.exports = __webpack_require__(41);
}


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(15);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}


/***/ }),
/* 40 */
/***/ (function(module, exports) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

var tty = __webpack_require__(42);
var util = __webpack_require__(0);

/**
 * This is the Node.js implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(15);
exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // camel-case
  var prop = key
    .substring(6)
    .toLowerCase()
    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });

  // coerce string value into JS value
  var val = process.env[key];
  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
  else if (val === 'null') val = null;
  else val = Number(val);

  obj[prop] = val;
  return obj;
}, {});

/**
 * The file descriptor to write the `debug()` calls to.
 * Set the `DEBUG_FD` env variable to override with another value. i.e.:
 *
 *   $ DEBUG_FD=3 node script.js 3>debug.log
 */

var fd = parseInt(process.env.DEBUG_FD, 10) || 2;

if (1 !== fd && 2 !== fd) {
  util.deprecate(function(){}, 'except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)')()
}

var stream = 1 === fd ? process.stdout :
             2 === fd ? process.stderr :
             createWritableStdioStream(fd);

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts
    ? Boolean(exports.inspectOpts.colors)
    : tty.isatty(fd);
}

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

exports.formatters.o = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts)
    .split('\n').map(function(str) {
      return str.trim()
    }).join(' ');
};

/**
 * Map %o to `util.inspect()`, allowing multiple lines if needed.
 */

exports.formatters.O = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var name = this.namespace;
  var useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var prefix = '  \u001b[3' + c + ';1m' + name + ' ' + '\u001b[0m';

    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push('\u001b[3' + c + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
  } else {
    args[0] = new Date().toUTCString()
      + ' ' + name + ' ' + args[0];
  }
}

/**
 * Invokes `util.format()` with the specified arguments and writes to `stream`.
 */

function log() {
  return stream.write(util.format.apply(util, arguments) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  if (null == namespaces) {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  } else {
    process.env.DEBUG = namespaces;
  }
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  return process.env.DEBUG;
}

/**
 * Copied from `node/src/node.js`.
 *
 * XXX: It's lame that node doesn't expose this API out-of-the-box. It also
 * relies on the undocumented `tty_wrap.guessHandleType()` which is also lame.
 */

function createWritableStdioStream (fd) {
  var stream;
  var tty_wrap = process.binding('tty_wrap');

  // Note stream._type is used for test-module-load-list.js

  switch (tty_wrap.guessHandleType(fd)) {
    case 'TTY':
      stream = new tty.WriteStream(fd);
      stream._type = 'tty';

      // Hack to have stream not keep the event loop alive.
      // See https://github.com/joyent/node/issues/1726
      if (stream._handle && stream._handle.unref) {
        stream._handle.unref();
      }
      break;

    case 'FILE':
      var fs = __webpack_require__(1);
      stream = new fs.SyncWriteStream(fd, { autoClose: false });
      stream._type = 'fs';
      break;

    case 'PIPE':
    case 'TCP':
      var net = __webpack_require__(35);
      stream = new net.Socket({
        fd: fd,
        readable: false,
        writable: true
      });

      // FIXME Should probably have an option in net.Socket to create a
      // stream from an existing fd which is writable only. But for now
      // we'll just add this hack and set the `readable` member to false.
      // Test: ./node test/fixtures/echo.js < /etc/passwd
      stream.readable = false;
      stream.read = null;
      stream._type = 'pipe';

      // FIXME Hack to have stream not keep the event loop alive.
      // See https://github.com/joyent/node/issues/1726
      if (stream._handle && stream._handle.unref) {
        stream._handle.unref();
      }
      break;

    default:
      // Probably an error on in uv_guess_handle()
      throw new Error('Implement me. Unknown stream file type!');
  }

  // For supporting legacy API we put the FD here.
  stream.fd = fd;

  stream._isStdio = true;

  return stream;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init (debug) {
  debug.inspectOpts = {};

  var keys = Object.keys(exports.inspectOpts);
  for (var i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

/**
 * Enable namespaces listed in `process.env.DEBUG` initially.
 */

exports.enable(load());


/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = require("tty");

/***/ }),
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */


const debug = __webpack_require__(38);
const marky = __webpack_require__(131);

const EventEmitter = __webpack_require__(7).EventEmitter;
const isWindows = process.platform === 'win32';

// process.browser is set when browserify'd via the `process` npm module
const isBrowser = process.browser;

const colors = {
  red: isBrowser ? 'crimson' : 1,
  yellow: isBrowser ? 'gold' : 3,
  cyan: isBrowser ? 'darkturquoise' : 6,
  green: isBrowser ? 'forestgreen' : 2,
  blue: isBrowser ? 'steelblue' : 4,
  magenta: isBrowser ? 'palevioletred' : 5,
};

// whitelist non-red/yellow colors for debug()
debug.colors = [colors.cyan, colors.green, colors.blue, colors.magenta];

class Emitter extends EventEmitter {
  /**
   * Fires off all status updates. Listen with
   * `require('lib/log').events.addListener('status', callback)`
   * @param {string} title
   * @param {!Array<*>} argsArray
   */
  issueStatus(title, argsArray) {
    if (title === 'status' || title === 'statusEnd') {
      this.emit(title, [title, ...argsArray]);
    }
  }

  /**
   * Fires off all warnings. Listen with
   * `require('lib/log').events.addListener('warning', callback)`
   * @param {string} title
   * @param {!Array<*>} argsArray
   */
  issueWarning(title, argsArray) {
    this.emit('warning', [title, ...argsArray]);
  }
}

const loggersByTitle = {};
const loggingBufferColumns = 25;
let level_;

class Log {
  static _logToStdErr(title, argsArray) {
    const log = Log.loggerfn(title);
    log(...argsArray);
  }

  static loggerfn(title) {
    let log = loggersByTitle[title];
    if (!log) {
      log = debug(title);
      loggersByTitle[title] = log;
      // errors with red, warnings with yellow.
      if (title.endsWith('error')) {
        log.color = colors.red;
      } else if (title.endsWith('warn')) {
        log.color = colors.yellow;
      }
    }
    return log;
  }

  /**
   * @param {string} level
   */
  static setLevel(level) {
    level_ = level;
    switch (level) {
      case 'silent':
        debug.enable('-*');
        break;
      case 'verbose':
        debug.enable('*');
        break;
      case 'error':
        debug.enable('-*, *:error');
        break;
      default:
        debug.enable('*, -*:verbose');
    }
  }

  /**
   * A simple formatting utility for event logging.
   * @param {string} prefix
   * @param {!Object} data A JSON-serializable object of event data to log.
   * @param {string=} level Optional logging level. Defaults to 'log'.
   */
  static formatProtocol(prefix, data, level) {
    const columns = (!process || process.browser) ? Infinity : process.stdout.columns;
    const method = data.method || '?????';
    const maxLength = columns - method.length - prefix.length - loggingBufferColumns;
    // IO.read blacklisted here to avoid logging megabytes of trace data
    const snippet = (data.params && method !== 'IO.read') ?
      JSON.stringify(data.params).substr(0, maxLength) : '';
    Log._logToStdErr(`${prefix}:${level || ''}`, [method, snippet]);
  }

  /**
   * @return {boolean}
   */
  static isVerbose() {
    return level_ === 'verbose';
  }

  static time({msg, id, args = []}, level = 'log') {
    marky.mark(id);
    Log[level]('status', msg, ...args);
  }

  static timeEnd({msg, id, args = []}, level = 'verbose') {
    Log[level]('statusEnd', msg, ...args);
    marky.stop(id);
  }

  static log(title, ...args) {
    Log.events.issueStatus(title, args);
    return Log._logToStdErr(title, args);
  }

  static warn(title, ...args) {
    Log.events.issueWarning(title, args);
    return Log._logToStdErr(`${title}:warn`, args);
  }

  static error(title, ...args) {
    return Log._logToStdErr(`${title}:error`, args);
  }

  static verbose(title, ...args) {
    Log.events.issueStatus(title, args);
    return Log._logToStdErr(`${title}:verbose`, args);
  }

  /**
   * Add surrounding escape sequences to turn a string green when logged.
   * @param {string} str
   * @return {string}
   */
  static greenify(str) {
    return `${Log.green}${str}${Log.reset}`;
  }

  /**
   * Add surrounding escape sequences to turn a string red when logged.
   * @param {string} str
   * @return {string}
   */
  static redify(str) {
    return `${Log.red}${str}${Log.reset}`;
  }

  static get green() {
    return '\x1B[32m';
  }

  static get red() {
    return '\x1B[31m';
  }

  static get yellow() {
    return '\x1b[33m';
  }

  static get purple() {
    return '\x1b[95m';
  }

  static get reset() {
    return '\x1B[0m';
  }

  static get bold() {
    return '\x1b[1m';
  }

  static get dim() {
    return '\x1b[2m';
  }

  static get tick() {
    return isWindows ? '\u221A' : '✓';
  }

  static get cross() {
    return isWindows ? '\u00D7' : '✘';
  }

  static get whiteSmallSquare() {
    return isWindows ? '\u0387' : '▫';
  }

  static get heavyHorizontal() {
    return isWindows ? '\u2500' : '━';
  }

  static get heavyVertical() {
    return isWindows ? '\u2502 ' : '┃ ';
  }

  static get heavyUpAndRight() {
    return isWindows ? '\u2514' : '┗';
  }

  static get heavyVerticalAndRight() {
    return isWindows ? '\u251C' : '┣';
  }

  static get heavyDownAndHorizontal() {
    return isWindows ? '\u252C' : '┳';
  }

  static get doubleLightHorizontal() {
    return '──';
  }
}

Log.events = new Emitter();
Log.takeTimeEntries = () => {
  const entries = marky.getEntries();
  marky.clear();
  return entries;
};
Log.getTimeEntries = () => marky.getEntries();

module.exports = Log;


/***/ }),
/* 88 */,
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable node/no-deprecated-api */
var buffer = __webpack_require__(6)
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}


/***/ }),
/* 90 */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const safeBuffer = __webpack_require__(89);
const Limiter = __webpack_require__(139);
const zlib = __webpack_require__(17);

const bufferUtil = __webpack_require__(96);

const Buffer = safeBuffer.Buffer;

const TRAILER = Buffer.from([0x00, 0x00, 0xff, 0xff]);
const EMPTY_BLOCK = Buffer.from([0x00]);

const kWriteInProgress = Symbol('write-in-progress');
const kPendingClose = Symbol('pending-close');
const kTotalLength = Symbol('total-length');
const kCallback = Symbol('callback');
const kBuffers = Symbol('buffers');
const kError = Symbol('error');
const kOwner = Symbol('owner');

//
// We limit zlib concurrency, which prevents severe memory fragmentation
// as documented in https://github.com/nodejs/node/issues/8871#issuecomment-250915913
// and https://github.com/websockets/ws/issues/1202
//
// Intentionally global; it's the global thread pool that's an issue.
//
let zlibLimiter;

/**
 * permessage-deflate implementation.
 */
class PerMessageDeflate {
  /**
   * Creates a PerMessageDeflate instance.
   *
   * @param {Object} options Configuration options
   * @param {Boolean} options.serverNoContextTakeover Request/accept disabling
   *     of server context takeover
   * @param {Boolean} options.clientNoContextTakeover Advertise/acknowledge
   *     disabling of client context takeover
   * @param {(Boolean|Number)} options.serverMaxWindowBits Request/confirm the
   *     use of a custom server window size
   * @param {(Boolean|Number)} options.clientMaxWindowBits Advertise support
   *     for, or request, a custom client window size
   * @param {Number} options.level The value of zlib's `level` param
   * @param {Number} options.memLevel The value of zlib's `memLevel` param
   * @param {Number} options.threshold Size (in bytes) below which messages
   *     should not be compressed
   * @param {Number} options.concurrencyLimit The number of concurrent calls to
   *     zlib
   * @param {Boolean} isServer Create the instance in either server or client
   *     mode
   * @param {Number} maxPayload The maximum allowed message length
   */
  constructor (options, isServer, maxPayload) {
    this._maxPayload = maxPayload | 0;
    this._options = options || {};
    this._threshold = this._options.threshold !== undefined
      ? this._options.threshold
      : 1024;
    this._isServer = !!isServer;
    this._deflate = null;
    this._inflate = null;

    this.params = null;

    if (!zlibLimiter) {
      const concurrency = this._options.concurrencyLimit !== undefined
        ? this._options.concurrencyLimit
        : 10;
      zlibLimiter = new Limiter({ concurrency });
    }
  }

  /**
   * @type {String}
   */
  static get extensionName () {
    return 'permessage-deflate';
  }

  /**
   * Create extension parameters offer.
   *
   * @return {Object} Extension parameters
   * @public
   */
  offer () {
    const params = {};

    if (this._options.serverNoContextTakeover) {
      params.server_no_context_takeover = true;
    }
    if (this._options.clientNoContextTakeover) {
      params.client_no_context_takeover = true;
    }
    if (this._options.serverMaxWindowBits) {
      params.server_max_window_bits = this._options.serverMaxWindowBits;
    }
    if (this._options.clientMaxWindowBits) {
      params.client_max_window_bits = this._options.clientMaxWindowBits;
    } else if (this._options.clientMaxWindowBits == null) {
      params.client_max_window_bits = true;
    }

    return params;
  }

  /**
   * Accept extension offer.
   *
   * @param {Array} paramsList Extension parameters
   * @return {Object} Accepted configuration
   * @public
   */
  accept (paramsList) {
    paramsList = this.normalizeParams(paramsList);

    var params;
    if (this._isServer) {
      params = this.acceptAsServer(paramsList);
    } else {
      params = this.acceptAsClient(paramsList);
    }

    this.params = params;
    return params;
  }

  /**
   * Releases all resources used by the extension.
   *
   * @public
   */
  cleanup () {
    if (this._inflate) {
      if (this._inflate[kWriteInProgress]) {
        this._inflate[kPendingClose] = true;
      } else {
        this._inflate.close();
        this._inflate = null;
      }
    }
    if (this._deflate) {
      if (this._deflate[kWriteInProgress]) {
        this._deflate[kPendingClose] = true;
      } else {
        this._deflate.close();
        this._deflate = null;
      }
    }
  }

  /**
   * Accept extension offer from client.
   *
   * @param {Array} paramsList Extension parameters
   * @return {Object} Accepted configuration
   * @private
   */
  acceptAsServer (paramsList) {
    const accepted = {};
    const result = paramsList.some((params) => {
      if (
        (this._options.serverNoContextTakeover === false &&
          params.server_no_context_takeover) ||
        (this._options.serverMaxWindowBits === false &&
          params.server_max_window_bits) ||
        (typeof this._options.serverMaxWindowBits === 'number' &&
          typeof params.server_max_window_bits === 'number' &&
          this._options.serverMaxWindowBits > params.server_max_window_bits) ||
        (typeof this._options.clientMaxWindowBits === 'number' &&
          !params.client_max_window_bits)
      ) {
        return;
      }

      if (
        this._options.serverNoContextTakeover ||
        params.server_no_context_takeover
      ) {
        accepted.server_no_context_takeover = true;
      }
      if (
        this._options.clientNoContextTakeover ||
        (this._options.clientNoContextTakeover !== false &&
          params.client_no_context_takeover)
      ) {
        accepted.client_no_context_takeover = true;
      }
      if (typeof this._options.serverMaxWindowBits === 'number') {
        accepted.server_max_window_bits = this._options.serverMaxWindowBits;
      } else if (typeof params.server_max_window_bits === 'number') {
        accepted.server_max_window_bits = params.server_max_window_bits;
      }
      if (typeof this._options.clientMaxWindowBits === 'number') {
        accepted.client_max_window_bits = this._options.clientMaxWindowBits;
      } else if (
        this._options.clientMaxWindowBits !== false &&
        typeof params.client_max_window_bits === 'number'
      ) {
        accepted.client_max_window_bits = params.client_max_window_bits;
      }
      return true;
    });

    if (!result) throw new Error("Doesn't support the offered configuration");

    return accepted;
  }

  /**
   * Accept extension response from server.
   *
   * @param {Array} paramsList Extension parameters
   * @return {Object} Accepted configuration
   * @private
   */
  acceptAsClient (paramsList) {
    const params = paramsList[0];

    if (
      this._options.clientNoContextTakeover === false &&
      params.client_no_context_takeover
    ) {
      throw new Error('Invalid value for "client_no_context_takeover"');
    }

    if (
      (typeof this._options.clientMaxWindowBits === 'number' &&
        (!params.client_max_window_bits ||
          params.client_max_window_bits > this._options.clientMaxWindowBits)) ||
      (this._options.clientMaxWindowBits === false &&
        params.client_max_window_bits)
    ) {
      throw new Error('Invalid value for "client_max_window_bits"');
    }

    return params;
  }

  /**
   * Normalize extensions parameters.
   *
   * @param {Array} paramsList Extension parameters
   * @return {Array} Normalized extensions parameters
   * @private
   */
  normalizeParams (paramsList) {
    return paramsList.map((params) => {
      Object.keys(params).forEach((key) => {
        var value = params[key];
        if (value.length > 1) {
          throw new Error(`Multiple extension parameters for ${key}`);
        }

        value = value[0];

        switch (key) {
          case 'server_no_context_takeover':
          case 'client_no_context_takeover':
            if (value !== true) {
              throw new Error(`invalid extension parameter value for ${key} (${value})`);
            }
            params[key] = true;
            break;
          case 'server_max_window_bits':
          case 'client_max_window_bits':
            if (typeof value === 'string') {
              value = parseInt(value, 10);
              if (
                Number.isNaN(value) ||
                value < zlib.Z_MIN_WINDOWBITS ||
                value > zlib.Z_MAX_WINDOWBITS
              ) {
                throw new Error(`invalid extension parameter value for ${key} (${value})`);
              }
            }
            if (!this._isServer && value === true) {
              throw new Error(`Missing extension parameter value for ${key}`);
            }
            params[key] = value;
            break;
          default:
            throw new Error(`Not defined extension parameter (${key})`);
        }
      });
      return params;
    });
  }

  /**
   * Decompress data. Concurrency limited by async-limiter.
   *
   * @param {Buffer} data Compressed data
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @public
   */
  decompress (data, fin, callback) {
    zlibLimiter.push((done) => {
      this._decompress(data, fin, (err, result) => {
        done();
        callback(err, result);
      });
    });
  }

  /**
   * Compress data. Concurrency limited by async-limiter.
   *
   * @param {Buffer} data Data to compress
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @public
   */
  compress (data, fin, callback) {
    zlibLimiter.push((done) => {
      this._compress(data, fin, (err, result) => {
        done();
        callback(err, result);
      });
    });
  }

  /**
   * Decompress data.
   *
   * @param {Buffer} data Compressed data
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @private
   */
  _decompress (data, fin, callback) {
    const endpoint = this._isServer ? 'client' : 'server';

    if (!this._inflate) {
      const key = `${endpoint}_max_window_bits`;
      const windowBits = typeof this.params[key] !== 'number'
        ? zlib.Z_DEFAULT_WINDOWBITS
        : this.params[key];

      this._inflate = zlib.createInflateRaw({ windowBits });
      this._inflate[kTotalLength] = 0;
      this._inflate[kBuffers] = [];
      this._inflate[kOwner] = this;
      this._inflate.on('error', inflateOnError);
      this._inflate.on('data', inflateOnData);
    }

    this._inflate[kCallback] = callback;
    this._inflate[kWriteInProgress] = true;

    this._inflate.write(data);
    if (fin) this._inflate.write(TRAILER);

    this._inflate.flush(() => {
      const err = this._inflate[kError];

      if (err) {
        this._inflate.close();
        this._inflate = null;
        callback(err);
        return;
      }

      const data = bufferUtil.concat(
        this._inflate[kBuffers],
        this._inflate[kTotalLength]
      );

      if (
        (fin && this.params[`${endpoint}_no_context_takeover`]) ||
        this._inflate[kPendingClose]
      ) {
        this._inflate.close();
        this._inflate = null;
      } else {
        this._inflate[kWriteInProgress] = false;
        this._inflate[kTotalLength] = 0;
        this._inflate[kBuffers] = [];
      }

      callback(null, data);
    });
  }

  /**
   * Compress data.
   *
   * @param {Buffer} data Data to compress
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @private
   */
  _compress (data, fin, callback) {
    if (!data || data.length === 0) {
      process.nextTick(callback, null, EMPTY_BLOCK);
      return;
    }

    const endpoint = this._isServer ? 'server' : 'client';

    if (!this._deflate) {
      const key = `${endpoint}_max_window_bits`;
      const windowBits = typeof this.params[key] !== 'number'
        ? zlib.Z_DEFAULT_WINDOWBITS
        : this.params[key];

      this._deflate = zlib.createDeflateRaw({
        memLevel: this._options.memLevel,
        level: this._options.level,
        flush: zlib.Z_SYNC_FLUSH,
        windowBits
      });

      this._deflate[kTotalLength] = 0;
      this._deflate[kBuffers] = [];

      //
      // `zlib.DeflateRaw` emits an `'error'` event only when an attempt to use
      // it is made after it has already been closed. This cannot happen here,
      // so we only add a listener for the `'data'` event.
      //
      this._deflate.on('data', deflateOnData);
    }

    this._deflate[kWriteInProgress] = true;

    this._deflate.write(data);
    this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
      var data = bufferUtil.concat(
        this._deflate[kBuffers],
        this._deflate[kTotalLength]
      );

      if (fin) data = data.slice(0, data.length - 4);

      if (
        (fin && this.params[`${endpoint}_no_context_takeover`]) ||
        this._deflate[kPendingClose]
      ) {
        this._deflate.close();
        this._deflate = null;
      } else {
        this._deflate[kWriteInProgress] = false;
        this._deflate[kTotalLength] = 0;
        this._deflate[kBuffers] = [];
      }

      callback(null, data);
    });
  }
}

module.exports = PerMessageDeflate;

/**
 * The listener of the `zlib.DeflateRaw` stream `'data'` event.
 *
 * @param {Buffer} chunk A chunk of data
 * @private
 */
function deflateOnData (chunk) {
  this[kBuffers].push(chunk);
  this[kTotalLength] += chunk.length;
}

/**
 * The listener of the `zlib.InflateRaw` stream `'data'` event.
 *
 * @param {Buffer} chunk A chunk of data
 * @private
 */
function inflateOnData (chunk) {
  this[kTotalLength] += chunk.length;

  if (
    this[kOwner]._maxPayload < 1 ||
    this[kTotalLength] <= this[kOwner]._maxPayload
  ) {
    this[kBuffers].push(chunk);
    return;
  }

  this[kError] = new Error('max payload size exceeded');
  this[kError].closeCode = 1009;
  this.removeListener('data', inflateOnData);
  this.reset();
}

/**
 * The listener of the `zlib.InflateRaw` stream `'error'` event.
 *
 * @param {Error} err The emitted error
 * @private
 */
function inflateOnError (err) {
  //
  // There is no need to call `Zlib#close()` as the handle is automatically
  // closed when an error is emitted.
  //
  this[kOwner]._inflate = null;
  this[kCallback](err);
}


/***/ }),
/* 92 */
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = minimatch
minimatch.Minimatch = Minimatch

var path = { sep: '/' }
try {
  path = __webpack_require__(3)
} catch (er) {}

var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
var expand = __webpack_require__(125)

var plTypes = {
  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
  '?': { open: '(?:', close: ')?' },
  '+': { open: '(?:', close: ')+' },
  '*': { open: '(?:', close: ')*' },
  '@': { open: '(?:', close: ')' }
}

// any single thing other than /
// don't need to escape / when using new RegExp()
var qmark = '[^/]'

// * => any number of characters
var star = qmark + '*?'

// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?'

// not a ^ or / followed by a dot,
// followed by anything, any number of times.
var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?'

// characters that need to be escaped in RegExp.
var reSpecials = charSet('().*{}+?[]^$\\!')

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
  return s.split('').reduce(function (set, c) {
    set[c] = true
    return set
  }, {})
}

// normalizes slashes.
var slashSplit = /\/+/

minimatch.filter = filter
function filter (pattern, options) {
  options = options || {}
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

function ext (a, b) {
  a = a || {}
  b = b || {}
  var t = {}
  Object.keys(b).forEach(function (k) {
    t[k] = b[k]
  })
  Object.keys(a).forEach(function (k) {
    t[k] = a[k]
  })
  return t
}

minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return minimatch

  var orig = minimatch

  var m = function minimatch (p, pattern, options) {
    return orig.minimatch(p, pattern, ext(def, options))
  }

  m.Minimatch = function Minimatch (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  }

  return m
}

Minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return Minimatch
  return minimatch.defaults(def).Minimatch
}

function minimatch (p, pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    return false
  }

  // "" only matches ""
  if (pattern.trim() === '') return p === ''

  return new Minimatch(pattern, options).match(p)
}

function Minimatch (pattern, options) {
  if (!(this instanceof Minimatch)) {
    return new Minimatch(pattern, options)
  }

  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}
  pattern = pattern.trim()

  // windows support: need to use /, not \
  if (path.sep !== '/') {
    pattern = pattern.split(path.sep).join('/')
  }

  this.options = options
  this.set = []
  this.pattern = pattern
  this.regexp = null
  this.negate = false
  this.comment = false
  this.empty = false

  // make the set of regexps etc.
  this.make()
}

Minimatch.prototype.debug = function () {}

Minimatch.prototype.make = make
function make () {
  // don't do it more than once.
  if (this._made) return

  var pattern = this.pattern
  var options = this.options

  // empty patterns and comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    this.comment = true
    return
  }
  if (!pattern) {
    this.empty = true
    return
  }

  // step 1: figure out negation, etc.
  this.parseNegate()

  // step 2: expand braces
  var set = this.globSet = this.braceExpand()

  if (options.debug) this.debug = console.error

  this.debug(this.pattern, set)

  // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters
  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  })

  this.debug(this.pattern, set)

  // glob --> regexps
  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this)

  this.debug(this.pattern, set)

  // filter out everything that didn't compile properly.
  set = set.filter(function (s) {
    return s.indexOf(false) === -1
  })

  this.debug(this.pattern, set)

  this.set = set
}

Minimatch.prototype.parseNegate = parseNegate
function parseNegate () {
  var pattern = this.pattern
  var negate = false
  var options = this.options
  var negateOffset = 0

  if (options.nonegate) return

  for (var i = 0, l = pattern.length
    ; i < l && pattern.charAt(i) === '!'
    ; i++) {
    negate = !negate
    negateOffset++
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset)
  this.negate = negate
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = function (pattern, options) {
  return braceExpand(pattern, options)
}

Minimatch.prototype.braceExpand = braceExpand

function braceExpand (pattern, options) {
  if (!options) {
    if (this instanceof Minimatch) {
      options = this.options
    } else {
      options = {}
    }
  }

  pattern = typeof pattern === 'undefined'
    ? this.pattern : pattern

  if (typeof pattern === 'undefined') {
    throw new TypeError('undefined pattern')
  }

  if (options.nobrace ||
    !pattern.match(/\{.*\}/)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  return expand(pattern)
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch.prototype.parse = parse
var SUBPARSE = {}
function parse (pattern, isSub) {
  if (pattern.length > 1024 * 64) {
    throw new TypeError('pattern is too long')
  }

  var options = this.options

  // shortcuts
  if (!options.noglobstar && pattern === '**') return GLOBSTAR
  if (pattern === '') return ''

  var re = ''
  var hasMagic = !!options.nocase
  var escaping = false
  // ? => one single character
  var patternListStack = []
  var negativeLists = []
  var stateChar
  var inClass = false
  var reClassStart = -1
  var classStart = -1
  // . and .. never match anything that doesn't start with .,
  // even when options.dot is set.
  var patternStart = pattern.charAt(0) === '.' ? '' // anything
  // not (start or / followed by . or .. followed by / or end)
  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
  : '(?!\\.)'
  var self = this

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case '*':
          re += star
          hasMagic = true
        break
        case '?':
          re += qmark
          hasMagic = true
        break
        default:
          re += '\\' + stateChar
        break
      }
      self.debug('clearStateChar %j %j', stateChar, re)
      stateChar = false
    }
  }

  for (var i = 0, len = pattern.length, c
    ; (i < len) && (c = pattern.charAt(i))
    ; i++) {
    this.debug('%s\t%s %s %j', pattern, i, re, c)

    // skip over any that are escaped.
    if (escaping && reSpecials[c]) {
      re += '\\' + c
      escaping = false
      continue
    }

    switch (c) {
      case '/':
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false

      case '\\':
        clearStateChar()
        escaping = true
      continue

      // the various stateChar values
      // for the "extglob" stuff.
      case '?':
      case '*':
      case '+':
      case '@':
      case '!':
        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c)

        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (inClass) {
          this.debug('  in class')
          if (c === '!' && i === classStart + 1) c = '^'
          re += c
          continue
        }

        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
        self.debug('call clearStateChar %j', stateChar)
        clearStateChar()
        stateChar = c
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        if (options.noext) clearStateChar()
      continue

      case '(':
        if (inClass) {
          re += '('
          continue
        }

        if (!stateChar) {
          re += '\\('
          continue
        }

        patternListStack.push({
          type: stateChar,
          start: i - 1,
          reStart: re.length,
          open: plTypes[stateChar].open,
          close: plTypes[stateChar].close
        })
        // negation is (?:(?!js)[^/]*)
        re += stateChar === '!' ? '(?:(?!(?:' : '(?:'
        this.debug('plType %j %j', stateChar, re)
        stateChar = false
      continue

      case ')':
        if (inClass || !patternListStack.length) {
          re += '\\)'
          continue
        }

        clearStateChar()
        hasMagic = true
        var pl = patternListStack.pop()
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
        re += pl.close
        if (pl.type === '!') {
          negativeLists.push(pl)
        }
        pl.reEnd = re.length
      continue

      case '|':
        if (inClass || !patternListStack.length || escaping) {
          re += '\\|'
          escaping = false
          continue
        }

        clearStateChar()
        re += '|'
      continue

      // these are mostly the same in regexp and glob
      case '[':
        // swallow any state-tracking char before the [
        clearStateChar()

        if (inClass) {
          re += '\\' + c
          continue
        }

        inClass = true
        classStart = i
        reClassStart = re.length
        re += c
      continue

      case ']':
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += '\\' + c
          escaping = false
          continue
        }

        // handle the case where we left a class open.
        // "[z-a]" is valid, equivalent to "\[z-a\]"
        if (inClass) {
          // split where the last [ was, make sure we don't have
          // an invalid re. if so, re-walk the contents of the
          // would-be class to re-translate any characters that
          // were passed through as-is
          // TODO: It would probably be faster to determine this
          // without a try/catch and a new RegExp, but it's tricky
          // to do safely.  For now, this is safe and works.
          var cs = pattern.substring(classStart + 1, i)
          try {
            RegExp('[' + cs + ']')
          } catch (er) {
            // not a valid class!
            var sp = this.parse(cs, SUBPARSE)
            re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]'
            hasMagic = hasMagic || sp[1]
            inClass = false
            continue
          }
        }

        // finish up the class.
        hasMagic = true
        inClass = false
        re += c
      continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar()

        if (escaping) {
          // no need
          escaping = false
        } else if (reSpecials[c]
          && !(c === '^' && inClass)) {
          re += '\\'
        }

        re += c

    } // switch
  } // for

  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    cs = pattern.substr(classStart + 1)
    sp = this.parse(cs, SUBPARSE)
    re = re.substr(0, reClassStart) + '\\[' + sp[0]
    hasMagic = hasMagic || sp[1]
  }

  // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.
  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + pl.open.length)
    this.debug('setting tail', re, pl)
    // maybe some even number of \, then maybe 1 \, followed by a |
    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = '\\'
      }

      // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.
      return $1 + $1 + $2 + '|'
    })

    this.debug('tail=%j\n   %s', tail, tail, pl, re)
    var t = pl.type === '*' ? star
      : pl.type === '?' ? qmark
      : '\\' + pl.type

    hasMagic = true
    re = re.slice(0, pl.reStart) + t + '\\(' + tail
  }

  // handle trailing things that only matter at the very end.
  clearStateChar()
  if (escaping) {
    // trailing \\
    re += '\\\\'
  }

  // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot
  var addPatternStart = false
  switch (re.charAt(0)) {
    case '.':
    case '[':
    case '(': addPatternStart = true
  }

  // Hack to work around lack of negative lookbehind in JS
  // A pattern like: *.!(x).!(y|z) needs to ensure that a name
  // like 'a.xyz.yz' doesn't match.  So, the first negative
  // lookahead, has to look ALL the way ahead, to the end of
  // the pattern.
  for (var n = negativeLists.length - 1; n > -1; n--) {
    var nl = negativeLists[n]

    var nlBefore = re.slice(0, nl.reStart)
    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8)
    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd)
    var nlAfter = re.slice(nl.reEnd)

    nlLast += nlAfter

    // Handle nested stuff like *(*.js|!(*.json)), where open parens
    // mean that we should *not* include the ) in the bit that is considered
    // "after" the negated section.
    var openParensBefore = nlBefore.split('(').length - 1
    var cleanAfter = nlAfter
    for (i = 0; i < openParensBefore; i++) {
      cleanAfter = cleanAfter.replace(/\)[+*?]?/, '')
    }
    nlAfter = cleanAfter

    var dollar = ''
    if (nlAfter === '' && isSub !== SUBPARSE) {
      dollar = '$'
    }
    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast
    re = newRe
  }

  // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.
  if (re !== '' && hasMagic) {
    re = '(?=.)' + re
  }

  if (addPatternStart) {
    re = patternStart + re
  }

  // parsing just a piece of a larger pattern.
  if (isSub === SUBPARSE) {
    return [re, hasMagic]
  }

  // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.
  if (!hasMagic) {
    return globUnescape(pattern)
  }

  var flags = options.nocase ? 'i' : ''
  try {
    var regExp = new RegExp('^' + re + '$', flags)
  } catch (er) {
    // If it was an invalid regular expression, then it can't match
    // anything.  This trick looks for a character after the end of
    // the string, which is of course impossible, except in multi-line
    // mode, but it's not a /m regex.
    return new RegExp('$.')
  }

  regExp._glob = pattern
  regExp._src = re

  return regExp
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch(pattern, options || {}).makeRe()
}

Minimatch.prototype.makeRe = makeRe
function makeRe () {
  if (this.regexp || this.regexp === false) return this.regexp

  // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.
  var set = this.set

  if (!set.length) {
    this.regexp = false
    return this.regexp
  }
  var options = this.options

  var twoStar = options.noglobstar ? star
    : options.dot ? twoStarDot
    : twoStarNoDot
  var flags = options.nocase ? 'i' : ''

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return (p === GLOBSTAR) ? twoStar
      : (typeof p === 'string') ? regExpEscape(p)
      : p._src
    }).join('\\\/')
  }).join('|')

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = '^(?:' + re + ')$'

  // can match anything, as long as it's not this.
  if (this.negate) re = '^(?!' + re + ').*$'

  try {
    this.regexp = new RegExp(re, flags)
  } catch (ex) {
    this.regexp = false
  }
  return this.regexp
}

minimatch.match = function (list, pattern, options) {
  options = options || {}
  var mm = new Minimatch(pattern, options)
  list = list.filter(function (f) {
    return mm.match(f)
  })
  if (mm.options.nonull && !list.length) {
    list.push(pattern)
  }
  return list
}

Minimatch.prototype.match = match
function match (f, partial) {
  this.debug('match', f, this.pattern)
  // short-circuit in the case of busted things.
  // comments, etc.
  if (this.comment) return false
  if (this.empty) return f === ''

  if (f === '/' && partial) return true

  var options = this.options

  // windows: need to use /, not \
  if (path.sep !== '/') {
    f = f.split(path.sep).join('/')
  }

  // treat the test path as a set of pathparts.
  f = f.split(slashSplit)
  this.debug(this.pattern, 'split', f)

  // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set
  this.debug(this.pattern, 'set', set)

  // Find the basename of the path by looking for the last non-empty segment
  var filename
  var i
  for (i = f.length - 1; i >= 0; i--) {
    filename = f[i]
    if (filename) break
  }

  for (i = 0; i < set.length; i++) {
    var pattern = set[i]
    var file = f
    if (options.matchBase && pattern.length === 1) {
      file = [filename]
    }
    var hit = this.matchOne(file, pattern, partial)
    if (hit) {
      if (options.flipNegate) return true
      return !this.negate
    }
  }

  // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.
  if (options.flipNegate) return false
  return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options

  this.debug('matchOne',
    { 'this': this, file: file, pattern: pattern })

  this.debug('matchOne', file.length, pattern.length)

  for (var fi = 0,
      pi = 0,
      fl = file.length,
      pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi++, pi++) {
    this.debug('matchOne loop')
    var p = pattern[pi]
    var f = file[fi]

    this.debug(pattern, p, f)

    // should be impossible.
    // some invalid regexp stuff in the set.
    if (p === false) return false

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f])

      // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit
      var fr = fi
      var pr = pi + 1
      if (pr === pl) {
        this.debug('** at the end')
        // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.
        for (; fi < fl; fi++) {
          if (file[fi] === '.' || file[fi] === '..' ||
            (!options.dot && file[fi].charAt(0) === '.')) return false
        }
        return true
      }

      // ok, let's see if we can swallow whatever we can.
      while (fr < fl) {
        var swallowee = file[fr]

        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee)

        // XXX remove this slice.  Just pass the start index.
        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee)
          // found a match.
          return true
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === '.' || swallowee === '..' ||
            (!options.dot && swallowee.charAt(0) === '.')) {
            this.debug('dot detected!', file, fr, pattern, pr)
            break
          }

          // ** swallows a segment, and continue.
          this.debug('globstar swallow a segment, and continue')
          fr++
        }
      }

      // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then
      if (partial) {
        // ran out of file
        this.debug('\n>>> no match, partial?', file, fr, pattern, pr)
        if (fr === fl) return true
      }
      return false
    }

    // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.
    var hit
    if (typeof p === 'string') {
      if (options.nocase) {
        hit = f.toLowerCase() === p.toLowerCase()
      } else {
        hit = f === p
      }
      this.debug('string match', p, f, hit)
    } else {
      hit = f.match(p)
      this.debug('pattern match', p, f, hit)
    }

    if (!hit) return false
  }

  // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*

  // now either we fell off the end of the pattern, or we're done.
  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial
  } else if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    var emptyFileEnd = (fi === fl - 1) && (file[fi] === '')
    return emptyFileEnd
  }

  // should be unreachable.
  throw new Error('wtf?')
}

// replace stuff like \* with *
function globUnescape (s) {
  return s.replace(/\\(.)/g, '$1')
}

function regExpEscape (s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function posix(path) {
	return path.charAt(0) === '/';
}

function win32(path) {
	// https://github.com/nodejs/node/blob/b3fcc245fb25539909ef1d5eaa01dbf92e168633/lib/path.js#L56
	var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
	var result = splitDeviceRe.exec(path);
	var device = result[1] || '';
	var isUnc = Boolean(device && device.charAt(1) !== ':');

	// UNC paths are always absolute
	return Boolean(result[2] || isUnc);
}

module.exports = process.platform === 'win32' ? win32 : posix;
module.exports.posix = posix;
module.exports.win32 = win32;


/***/ }),
/* 95 */
/***/ (function(module, exports) {

throw new Error("Module parse failed: Unexpected token (39:43)\nYou may need an appropriate loader to handle this file type.\n|    */\n|   static fromLighthouseError(err) {\n|     const {code, friendlyMessage: message, ...rest} = err;\n|     // Note: {...rest} convinces tsc 3.1 that it's assignable to a Record.\n|     return new LighthouseError({code, message}, {...rest});");

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */



const safeBuffer = __webpack_require__(89);

const Buffer = safeBuffer.Buffer;

/**
 * Merges an array of buffers into a new buffer.
 *
 * @param {Buffer[]} list The array of buffers to concat
 * @param {Number} totalLength The total length of buffers in the list
 * @return {Buffer} The resulting buffer
 * @public
 */
const concat = (list, totalLength) => {
  const target = Buffer.allocUnsafe(totalLength);
  var offset = 0;

  for (var i = 0; i < list.length; i++) {
    const buf = list[i];
    buf.copy(target, offset);
    offset += buf.length;
  }

  return target;
};

try {
  const bufferUtil = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"bufferutil\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

  module.exports = Object.assign({ concat }, bufferUtil.BufferUtil || bufferUtil);
} catch (e) /* istanbul ignore next */ {
  /**
   * Masks a buffer using the given mask.
   *
   * @param {Buffer} source The buffer to mask
   * @param {Buffer} mask The mask to use
   * @param {Buffer} output The buffer where to store the result
   * @param {Number} offset The offset at which to start writing
   * @param {Number} length The number of bytes to mask.
   * @public
   */
  const mask = (source, mask, output, offset, length) => {
    for (var i = 0; i < length; i++) {
      output[offset + i] = source[i] ^ mask[i & 3];
    }
  };

  /**
   * Unmasks a buffer using the given mask.
   *
   * @param {Buffer} buffer The buffer to unmask
   * @param {Buffer} mask The mask to use
   * @public
   */
  const unmask = (buffer, mask) => {
    // Required until https://github.com/nodejs/node/issues/9006 is resolved.
    const length = buffer.length;
    for (var i = 0; i < length; i++) {
      buffer[i] ^= mask[i & 3];
    }
  };

  module.exports = { concat, mask, unmask };
}


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const safeBuffer = __webpack_require__(89);

const Buffer = safeBuffer.Buffer;

exports.BINARY_TYPES = ['nodebuffer', 'arraybuffer', 'fragments'];
exports.GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
exports.EMPTY_BUFFER = Buffer.alloc(0);
exports.NOOP = () => {};


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */


/**
 * Adjustments needed for DevTools network throttling to simulate
 * more realistic network conditions.
 * See: crbug.com/721112
 */
const DEVTOOLS_RTT_ADJUSTMENT_FACTOR = 3.75;
const DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR = 0.9;

const throttling = {
  DEVTOOLS_RTT_ADJUSTMENT_FACTOR,
  DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR,
  mobile3G: {
    rttMs: 150,
    throughputKbps: 1.6 * 1024,
    requestLatencyMs: 150 * DEVTOOLS_RTT_ADJUSTMENT_FACTOR,
    downloadThroughputKbps: 1.6 * 1024 * DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR,
    uploadThroughputKbps: 750 * DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR,
    cpuSlowdownMultiplier: 4,
  },
};

/** @type {LH.Config.Settings} */
const defaultSettings = {
  output: 'json',
  maxWaitForLoad: 45 * 1000,
  throttlingMethod: 'simulate',
  throttling: throttling.mobile3G,
  auditMode: false,
  gatherMode: false,
  disableStorageReset: false,
  disableDeviceEmulation: false,
  emulatedFormFactor: 'mobile',

  // the following settings have no defaults but we still want ensure that `key in settings`
  // in config will work in a typechecked way
  locale: 'en-US', // actual default determined by Config using lib/i18n
  blockedUrlPatterns: null,
  additionalTraceCategories: null,
  extraHeaders: null,
  onlyAudits: null,
  onlyCategories: null,
  skipAudits: null,
};

/** @type {LH.Config.Pass} */
const defaultPassConfig = {
  passName: 'defaultPass',
  recordTrace: false,
  useThrottling: false,
  pauseAfterLoadMs: 0,
  networkQuietThresholdMs: 0,
  cpuQuietThresholdMs: 0,
  blockedUrlPatterns: [],
  blankPage: 'about:blank',
  blankDuration: 300,
  gatherers: [],
};

const nonSimulatedPassConfigOverrides = {
  pauseAfterLoadMs: 5250,
  networkQuietThresholdMs: 5250,
  cpuQuietThresholdMs: 5250,
};

module.exports = {
  throttling,
  defaultSettings,
  defaultPassConfig,
  nonSimulatedPassConfigOverrides,
};


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */


/**
 * URL shim so we keep our code DRY
 */

/* global self */

const Util = __webpack_require__(116);

// Type cast so tsc sees window.URL and require('url').URL as sufficiently equivalent.
const URL = /** @type {!Window["URL"]} */ (typeof self !== 'undefined' && self.URL) ||
    __webpack_require__(4).URL;

// 25 most used tld plus one domains from http archive.
// @see https://github.com/GoogleChrome/lighthouse/pull/5065#discussion_r191926212
const listOfTlds = [
  'com', 'co', 'gov', 'edu', 'ac', 'org', 'go', 'gob', 'or', 'net', 'in', 'ne', 'nic', 'gouv',
  'web', 'spb', 'blog', 'jus', 'kiev', 'mil', 'wi', 'qc', 'ca', 'bel', 'on',
];

const allowedProtocols = [
  'https:', 'http:', 'chrome:',
];

/**
 * There is fancy URL rewriting logic for the chrome://settings page that we need to work around.
 * Why? Special handling was added by Chrome team to allow a pushState transition between chrome:// pages.
 * As a result, the network URL (chrome://chrome/settings/) doesn't match the final document URL (chrome://settings/).
 * @param {string} url
 * @return {string}
 */
function rewriteChromeInternalUrl(url) {
  if (!url || !url.startsWith('chrome://')) return url;
  // Chrome adds a trailing slash to `chrome://` URLs, but the spec does not.
  //   https://github.com/GoogleChrome/lighthouse/pull/3941#discussion_r154026009
  if (url.endsWith('/')) url = url.replace(/\/$/, '');
  return url.replace(/^chrome:\/\/chrome\//, 'chrome://');
}

class URLShim extends URL {
  /**
   * @param {string} url
   * @return {boolean}
   */
  static isValid(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * @param {string} urlA
   * @param {string} urlB
   * @return {boolean}
   */
  static hostsMatch(urlA, urlB) {
    try {
      return new URL(urlA).host === new URL(urlB).host;
    } catch (e) {
      return false;
    }
  }

  /**
   * @param {string} urlA
   * @param {string} urlB
   * @return {boolean}
   */
  static originsMatch(urlA, urlB) {
    try {
      return new URL(urlA).origin === new URL(urlB).origin;
    } catch (e) {
      return false;
    }
  }

  /**
   * @param {string} url
   * @return {?string}
   */
  static getOrigin(url) {
    try {
      const urlInfo = new URL(url);
      // check for both host and origin since some URLs schemes like data and file set origin to the
      // string "null" instead of the object
      return (urlInfo.host && urlInfo.origin) || null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Gets the tld of a domain
   *
   * @param {string} hostname
   * @return {string} tld
   */
  static getTld(hostname) {
    const tlds = hostname.split('.').slice(-2);

    if (!listOfTlds.includes(tlds[0])) {
      return `.${tlds[tlds.length - 1]}`;
    }

    return `.${tlds.join('.')}`;
  }

  /**
   * Check if rootDomains matches
   *
   * @param {string} urlA
   * @param {string} urlB
   */
  static rootDomainsMatch(urlA, urlB) {
    let urlAInfo;
    let urlBInfo;
    try {
      urlAInfo = new URL(urlA);
      urlBInfo = new URL(urlB);
    } catch (err) {
      return false;
    }

    if (!urlAInfo.hostname || !urlBInfo.hostname) {
      return false;
    }

    const tldA = URLShim.getTld(urlAInfo.hostname);
    const tldB = URLShim.getTld(urlBInfo.hostname);

    // get the string before the tld
    const urlARootDomain = urlAInfo.hostname.replace(new RegExp(`${tldA}$`), '')
      .split('.').splice(-1)[0];
    const urlBRootDomain = urlBInfo.hostname.replace(new RegExp(`${tldB}$`), '')
      .split('.').splice(-1)[0];

    return urlARootDomain === urlBRootDomain;
  }

  /**
   * @param {string} url
   * @param {{numPathParts: number, preserveQuery: boolean, preserveHost: boolean}=} options
   * @return {string}
   */
  static getURLDisplayName(url, options) {
    return Util.getURLDisplayName(new URL(url), options);
  }

  /**
   * Limits data URIs to 100 characters, returns all other strings untouched.
   * @param {string} url
   * @return {string}
   */
  static elideDataURI(url) {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'data:' ? url.slice(0, 100) : url;
    } catch (e) {
      return url;
    }
  }

  /**
   * Determine if url1 equals url2, ignoring URL fragments.
   * @param {string} url1
   * @param {string} url2
   * @return {boolean}
   */
  static equalWithExcludedFragments(url1, url2) {
    [url1, url2] = [url1, url2].map(rewriteChromeInternalUrl);
    try {
      const urla = new URL(url1);
      urla.hash = '';

      const urlb = new URL(url2);
      urlb.hash = '';

      return urla.href === urlb.href;
    } catch (e) {
      return false;
    }
  }

  /**
   * Determine if the url has a protocol that we're able to test
   * @param {string} url
   * @return {boolean}
   */
  static isProtocolAllowed(url) {
    try {
      const parsed = new URL(url);
      return allowedProtocols.includes(parsed.protocol);
    } catch (e) {
      return false;
    }
  }
}

URLShim.URL = URL;
URLShim.URLSearchParams = (typeof self !== 'undefined' && self.URLSearchParams) ||
    __webpack_require__(4).URLSearchParams;

URLShim.NON_NETWORK_PROTOCOLS = ['blob', 'data'];

URLShim.INVALID_URL_DEBUG_STRING =
    'Lighthouse was unable to determine the URL of some script executions. ' +
    'It\'s possible a Chrome extension or other eval\'d code is the source.';

module.exports = URLShim;


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

// Approach:
//
// 1. Get the minimatch set
// 2. For each pattern in the set, PROCESS(pattern, false)
// 3. Store matches per-set, then uniq them
//
// PROCESS(pattern, inGlobStar)
// Get the first [n] items from pattern that are all strings
// Join these together.  This is PREFIX.
//   If there is no more remaining, then stat(PREFIX) and
//   add to matches if it succeeds.  END.
//
// If inGlobStar and PREFIX is symlink and points to dir
//   set ENTRIES = []
// else readdir(PREFIX) as ENTRIES
//   If fail, END
//
// with ENTRIES
//   If pattern[n] is GLOBSTAR
//     // handle the case where the globstar match is empty
//     // by pruning it out, and testing the resulting pattern
//     PROCESS(pattern[0..n] + pattern[n+1 .. $], false)
//     // handle other cases.
//     for ENTRY in ENTRIES (not dotfiles)
//       // attach globstar + tail onto the entry
//       // Mark that this entry is a globstar match
//       PROCESS(pattern[0..n] + ENTRY + pattern[n .. $], true)
//
//   else // not globstar
//     for ENTRY in ENTRIES (not dotfiles, unless pattern[n] is dot)
//       Test ENTRY against pattern[n]
//       If fails, continue
//       If passes, PROCESS(pattern[0..n] + item + pattern[n+1 .. $])
//
// Caveat:
//   Cache all stats and readdirs results to minimize syscall.  Since all
//   we ever care about is existence and directory-ness, we can just keep
//   `true` for files, and [children,...] for directories, or `false` for
//   things that don't exist.

module.exports = glob

var fs = __webpack_require__(1)
var rp = __webpack_require__(101)
var minimatch = __webpack_require__(93)
var Minimatch = minimatch.Minimatch
var inherits = __webpack_require__(5)
var EE = __webpack_require__(7).EventEmitter
var path = __webpack_require__(3)
var assert = __webpack_require__(92)
var isAbsolute = __webpack_require__(94)
var globSync = __webpack_require__(128)
var common = __webpack_require__(102)
var alphasort = common.alphasort
var alphasorti = common.alphasorti
var setopts = common.setopts
var ownProp = common.ownProp
var inflight = __webpack_require__(129)
var util = __webpack_require__(0)
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

var once = __webpack_require__(104)

function glob (pattern, options, cb) {
  if (typeof options === 'function') cb = options, options = {}
  if (!options) options = {}

  if (options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return globSync(pattern, options)
  }

  return new Glob(pattern, options, cb)
}

glob.sync = globSync
var GlobSync = glob.GlobSync = globSync.GlobSync

// old api surface
glob.glob = glob

function extend (origin, add) {
  if (add === null || typeof add !== 'object') {
    return origin
  }

  var keys = Object.keys(add)
  var i = keys.length
  while (i--) {
    origin[keys[i]] = add[keys[i]]
  }
  return origin
}

glob.hasMagic = function (pattern, options_) {
  var options = extend({}, options_)
  options.noprocess = true

  var g = new Glob(pattern, options)
  var set = g.minimatch.set

  if (!pattern)
    return false

  if (set.length > 1)
    return true

  for (var j = 0; j < set[0].length; j++) {
    if (typeof set[0][j] !== 'string')
      return true
  }

  return false
}

glob.Glob = Glob
inherits(Glob, EE)
function Glob (pattern, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = null
  }

  if (options && options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return new GlobSync(pattern, options)
  }

  if (!(this instanceof Glob))
    return new Glob(pattern, options, cb)

  setopts(this, pattern, options)
  this._didRealPath = false

  // process each pattern in the minimatch set
  var n = this.minimatch.set.length

  // The matches are stored as {<filename>: true,...} so that
  // duplicates are automagically pruned.
  // Later, we do an Object.keys() on these.
  // Keep them as a list so we can fill in when nonull is set.
  this.matches = new Array(n)

  if (typeof cb === 'function') {
    cb = once(cb)
    this.on('error', cb)
    this.on('end', function (matches) {
      cb(null, matches)
    })
  }

  var self = this
  this._processing = 0

  this._emitQueue = []
  this._processQueue = []
  this.paused = false

  if (this.noprocess)
    return this

  if (n === 0)
    return done()

  var sync = true
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false, done)
  }
  sync = false

  function done () {
    --self._processing
    if (self._processing <= 0) {
      if (sync) {
        process.nextTick(function () {
          self._finish()
        })
      } else {
        self._finish()
      }
    }
  }
}

Glob.prototype._finish = function () {
  assert(this instanceof Glob)
  if (this.aborted)
    return

  if (this.realpath && !this._didRealpath)
    return this._realpath()

  common.finish(this)
  this.emit('end', this.found)
}

Glob.prototype._realpath = function () {
  if (this._didRealpath)
    return

  this._didRealpath = true

  var n = this.matches.length
  if (n === 0)
    return this._finish()

  var self = this
  for (var i = 0; i < this.matches.length; i++)
    this._realpathSet(i, next)

  function next () {
    if (--n === 0)
      self._finish()
  }
}

Glob.prototype._realpathSet = function (index, cb) {
  var matchset = this.matches[index]
  if (!matchset)
    return cb()

  var found = Object.keys(matchset)
  var self = this
  var n = found.length

  if (n === 0)
    return cb()

  var set = this.matches[index] = Object.create(null)
  found.forEach(function (p, i) {
    // If there's a problem with the stat, then it means that
    // one or more of the links in the realpath couldn't be
    // resolved.  just return the abs value in that case.
    p = self._makeAbs(p)
    rp.realpath(p, self.realpathCache, function (er, real) {
      if (!er)
        set[real] = true
      else if (er.syscall === 'stat')
        set[p] = true
      else
        self.emit('error', er) // srsly wtf right here

      if (--n === 0) {
        self.matches[index] = set
        cb()
      }
    })
  })
}

Glob.prototype._mark = function (p) {
  return common.mark(this, p)
}

Glob.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}

Glob.prototype.abort = function () {
  this.aborted = true
  this.emit('abort')
}

Glob.prototype.pause = function () {
  if (!this.paused) {
    this.paused = true
    this.emit('pause')
  }
}

Glob.prototype.resume = function () {
  if (this.paused) {
    this.emit('resume')
    this.paused = false
    if (this._emitQueue.length) {
      var eq = this._emitQueue.slice(0)
      this._emitQueue.length = 0
      for (var i = 0; i < eq.length; i ++) {
        var e = eq[i]
        this._emitMatch(e[0], e[1])
      }
    }
    if (this._processQueue.length) {
      var pq = this._processQueue.slice(0)
      this._processQueue.length = 0
      for (var i = 0; i < pq.length; i ++) {
        var p = pq[i]
        this._processing--
        this._process(p[0], p[1], p[2], p[3])
      }
    }
  }
}

Glob.prototype._process = function (pattern, index, inGlobStar, cb) {
  assert(this instanceof Glob)
  assert(typeof cb === 'function')

  if (this.aborted)
    return

  this._processing++
  if (this.paused) {
    this._processQueue.push([pattern, index, inGlobStar, cb])
    return
  }

  //console.error('PROCESS %d', this._processing, pattern)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === 'string') {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // see if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index, cb)
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var remain = pattern.slice(n)

  // get the list of entries.
  var read
  if (prefix === null)
    read = '.'
  else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix
    read = prefix
  } else
    read = prefix

  var abs = this._makeAbs(read)

  //if ignored, skip _processing
  if (childrenIgnored(this, read))
    return cb()

  var isGlobStar = remain[0] === minimatch.GLOBSTAR
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb)
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb)
}

Glob.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}

Glob.prototype._processReaddir2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return cb()

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0]
  var negate = !!this.minimatch.negate
  var rawGlob = pn._glob
  var dotOk = this.dot || rawGlob.charAt(0) === '.'

  var matchedEntries = []
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i]
    if (e.charAt(0) !== '.' || dotOk) {
      var m
      if (negate && !prefix) {
        m = !e.match(pn)
      } else {
        m = e.match(pn)
      }
      if (m)
        matchedEntries.push(e)
    }
  }

  //console.error('prd2', prefix, entries, remain[0]._glob, matchedEntries)

  var len = matchedEntries.length
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return cb()

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null)

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i]
      if (prefix) {
        if (prefix !== '/')
          e = prefix + '/' + e
        else
          e = prefix + e
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e)
      }
      this._emitMatch(index, e)
    }
    // This was the last one, and no stats were needed
    return cb()
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift()
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i]
    var newPattern
    if (prefix) {
      if (prefix !== '/')
        e = prefix + '/' + e
      else
        e = prefix + e
    }
    this._process([e].concat(remain), index, inGlobStar, cb)
  }
  cb()
}

Glob.prototype._emitMatch = function (index, e) {
  if (this.aborted)
    return

  if (isIgnored(this, e))
    return

  if (this.paused) {
    this._emitQueue.push([index, e])
    return
  }

  var abs = isAbsolute(e) ? e : this._makeAbs(e)

  if (this.mark)
    e = this._mark(e)

  if (this.absolute)
    e = abs

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true

  var st = this.statCache[abs]
  if (st)
    this.emit('stat', e, st)

  this.emit('match', e)
}

Glob.prototype._readdirInGlobStar = function (abs, cb) {
  if (this.aborted)
    return

  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false, cb)

  var lstatkey = 'lstat\0' + abs
  var self = this
  var lstatcb = inflight(lstatkey, lstatcb_)

  if (lstatcb)
    fs.lstat(abs, lstatcb)

  function lstatcb_ (er, lstat) {
    if (er && er.code === 'ENOENT')
      return cb()

    var isSym = lstat && lstat.isSymbolicLink()
    self.symlinks[abs] = isSym

    // If it's not a symlink or a dir, then it's definitely a regular file.
    // don't bother doing a readdir in that case.
    if (!isSym && lstat && !lstat.isDirectory()) {
      self.cache[abs] = 'FILE'
      cb()
    } else
      self._readdir(abs, false, cb)
  }
}

Glob.prototype._readdir = function (abs, inGlobStar, cb) {
  if (this.aborted)
    return

  cb = inflight('readdir\0'+abs+'\0'+inGlobStar, cb)
  if (!cb)
    return

  //console.error('RD %j %j', +inGlobStar, abs)
  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs, cb)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE')
      return cb()

    if (Array.isArray(c))
      return cb(null, c)
  }

  var self = this
  fs.readdir(abs, readdirCb(this, abs, cb))
}

function readdirCb (self, abs, cb) {
  return function (er, entries) {
    if (er)
      self._readdirError(abs, er, cb)
    else
      self._readdirEntries(abs, entries, cb)
  }
}

Glob.prototype._readdirEntries = function (abs, entries, cb) {
  if (this.aborted)
    return

  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i]
      if (abs === '/')
        e = abs + e
      else
        e = abs + '/' + e
      this.cache[e] = true
    }
  }

  this.cache[abs] = entries
  return cb(null, entries)
}

Glob.prototype._readdirError = function (f, er, cb) {
  if (this.aborted)
    return

  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        this.emit('error', error)
        this.abort()
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false
      if (this.strict) {
        this.emit('error', er)
        // If the error is handled, then we abort
        // if not, we threw out of here
        this.abort()
      }
      if (!this.silent)
        console.error('glob error', er)
      break
  }

  return cb()
}

Glob.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}


Glob.prototype._processGlobStar2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {
  //console.error('pgs2', prefix, remain[0], entries)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return cb()

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1)
  var gspref = prefix ? [ prefix ] : []
  var noGlobStar = gspref.concat(remainWithoutGlobStar)

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false, cb)

  var isSym = this.symlinks[abs]
  var len = entries.length

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return cb()

  for (var i = 0; i < len; i++) {
    var e = entries[i]
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true, cb)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true, cb)
  }

  cb()
}

Glob.prototype._processSimple = function (prefix, index, cb) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var self = this
  this._stat(prefix, function (er, exists) {
    self._processSimple2(prefix, index, er, exists, cb)
  })
}
Glob.prototype._processSimple2 = function (prefix, index, er, exists, cb) {

  //console.error('ps2', prefix, exists)

  if (!this.matches[index])
    this.matches[index] = Object.create(null)

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return cb()

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix)
    } else {
      prefix = path.resolve(this.root, prefix)
      if (trail)
        prefix += '/'
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/')

  // Mark this as a match
  this._emitMatch(index, prefix)
  cb()
}

// Returns either 'DIR', 'FILE', or false
Glob.prototype._stat = function (f, cb) {
  var abs = this._makeAbs(f)
  var needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength)
    return cb()

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c))
      c = 'DIR'

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return cb(null, c)

    if (needDir && c === 'FILE')
      return cb()

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists
  var stat = this.statCache[abs]
  if (stat !== undefined) {
    if (stat === false)
      return cb(null, stat)
    else {
      var type = stat.isDirectory() ? 'DIR' : 'FILE'
      if (needDir && type === 'FILE')
        return cb()
      else
        return cb(null, type, stat)
    }
  }

  var self = this
  var statcb = inflight('stat\0' + abs, lstatcb_)
  if (statcb)
    fs.lstat(abs, statcb)

  function lstatcb_ (er, lstat) {
    if (lstat && lstat.isSymbolicLink()) {
      // If it's a symlink, then treat it as the target, unless
      // the target does not exist, then treat it as a file.
      return fs.stat(abs, function (er, stat) {
        if (er)
          self._stat2(f, abs, null, lstat, cb)
        else
          self._stat2(f, abs, er, stat, cb)
      })
    } else {
      self._stat2(f, abs, er, lstat, cb)
    }
  }
}

Glob.prototype._stat2 = function (f, abs, er, stat, cb) {
  if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
    this.statCache[abs] = false
    return cb()
  }

  var needDir = f.slice(-1) === '/'
  this.statCache[abs] = stat

  if (abs.slice(-1) === '/' && stat && !stat.isDirectory())
    return cb(null, false, stat)

  var c = true
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE'
  this.cache[abs] = this.cache[abs] || c

  if (needDir && c === 'FILE')
    return cb()

  return cb(null, c, stat)
}


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = realpath
realpath.realpath = realpath
realpath.sync = realpathSync
realpath.realpathSync = realpathSync
realpath.monkeypatch = monkeypatch
realpath.unmonkeypatch = unmonkeypatch

var fs = __webpack_require__(1)
var origRealpath = fs.realpath
var origRealpathSync = fs.realpathSync

var version = process.version
var ok = /^v[0-5]\./.test(version)
var old = __webpack_require__(124)

function newError (er) {
  return er && er.syscall === 'realpath' && (
    er.code === 'ELOOP' ||
    er.code === 'ENOMEM' ||
    er.code === 'ENAMETOOLONG'
  )
}

function realpath (p, cache, cb) {
  if (ok) {
    return origRealpath(p, cache, cb)
  }

  if (typeof cache === 'function') {
    cb = cache
    cache = null
  }
  origRealpath(p, cache, function (er, result) {
    if (newError(er)) {
      old.realpath(p, cache, cb)
    } else {
      cb(er, result)
    }
  })
}

function realpathSync (p, cache) {
  if (ok) {
    return origRealpathSync(p, cache)
  }

  try {
    return origRealpathSync(p, cache)
  } catch (er) {
    if (newError(er)) {
      return old.realpathSync(p, cache)
    } else {
      throw er
    }
  }
}

function monkeypatch () {
  fs.realpath = realpath
  fs.realpathSync = realpathSync
}

function unmonkeypatch () {
  fs.realpath = origRealpath
  fs.realpathSync = origRealpathSync
}


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

exports.alphasort = alphasort
exports.alphasorti = alphasorti
exports.setopts = setopts
exports.ownProp = ownProp
exports.makeAbs = makeAbs
exports.finish = finish
exports.mark = mark
exports.isIgnored = isIgnored
exports.childrenIgnored = childrenIgnored

function ownProp (obj, field) {
  return Object.prototype.hasOwnProperty.call(obj, field)
}

var path = __webpack_require__(3)
var minimatch = __webpack_require__(93)
var isAbsolute = __webpack_require__(94)
var Minimatch = minimatch.Minimatch

function alphasorti (a, b) {
  return a.toLowerCase().localeCompare(b.toLowerCase())
}

function alphasort (a, b) {
  return a.localeCompare(b)
}

function setupIgnores (self, options) {
  self.ignore = options.ignore || []

  if (!Array.isArray(self.ignore))
    self.ignore = [self.ignore]

  if (self.ignore.length) {
    self.ignore = self.ignore.map(ignoreMap)
  }
}

// ignore patterns are always in dot:true mode.
function ignoreMap (pattern) {
  var gmatcher = null
  if (pattern.slice(-3) === '/**') {
    var gpattern = pattern.replace(/(\/\*\*)+$/, '')
    gmatcher = new Minimatch(gpattern, { dot: true })
  }

  return {
    matcher: new Minimatch(pattern, { dot: true }),
    gmatcher: gmatcher
  }
}

function setopts (self, pattern, options) {
  if (!options)
    options = {}

  // base-matching: just use globstar for that.
  if (options.matchBase && -1 === pattern.indexOf("/")) {
    if (options.noglobstar) {
      throw new Error("base matching requires globstar")
    }
    pattern = "**/" + pattern
  }

  self.silent = !!options.silent
  self.pattern = pattern
  self.strict = options.strict !== false
  self.realpath = !!options.realpath
  self.realpathCache = options.realpathCache || Object.create(null)
  self.follow = !!options.follow
  self.dot = !!options.dot
  self.mark = !!options.mark
  self.nodir = !!options.nodir
  if (self.nodir)
    self.mark = true
  self.sync = !!options.sync
  self.nounique = !!options.nounique
  self.nonull = !!options.nonull
  self.nosort = !!options.nosort
  self.nocase = !!options.nocase
  self.stat = !!options.stat
  self.noprocess = !!options.noprocess
  self.absolute = !!options.absolute

  self.maxLength = options.maxLength || Infinity
  self.cache = options.cache || Object.create(null)
  self.statCache = options.statCache || Object.create(null)
  self.symlinks = options.symlinks || Object.create(null)

  setupIgnores(self, options)

  self.changedCwd = false
  var cwd = process.cwd()
  if (!ownProp(options, "cwd"))
    self.cwd = cwd
  else {
    self.cwd = path.resolve(options.cwd)
    self.changedCwd = self.cwd !== cwd
  }

  self.root = options.root || path.resolve(self.cwd, "/")
  self.root = path.resolve(self.root)
  if (process.platform === "win32")
    self.root = self.root.replace(/\\/g, "/")

  // TODO: is an absolute `cwd` supposed to be resolved against `root`?
  // e.g. { cwd: '/test', root: __dirname } === path.join(__dirname, '/test')
  self.cwdAbs = isAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd)
  if (process.platform === "win32")
    self.cwdAbs = self.cwdAbs.replace(/\\/g, "/")
  self.nomount = !!options.nomount

  // disable comments and negation in Minimatch.
  // Note that they are not supported in Glob itself anyway.
  options.nonegate = true
  options.nocomment = true

  self.minimatch = new Minimatch(pattern, options)
  self.options = self.minimatch.options
}

function finish (self) {
  var nou = self.nounique
  var all = nou ? [] : Object.create(null)

  for (var i = 0, l = self.matches.length; i < l; i ++) {
    var matches = self.matches[i]
    if (!matches || Object.keys(matches).length === 0) {
      if (self.nonull) {
        // do like the shell, and spit out the literal glob
        var literal = self.minimatch.globSet[i]
        if (nou)
          all.push(literal)
        else
          all[literal] = true
      }
    } else {
      // had matches
      var m = Object.keys(matches)
      if (nou)
        all.push.apply(all, m)
      else
        m.forEach(function (m) {
          all[m] = true
        })
    }
  }

  if (!nou)
    all = Object.keys(all)

  if (!self.nosort)
    all = all.sort(self.nocase ? alphasorti : alphasort)

  // at *some* point we statted all of these
  if (self.mark) {
    for (var i = 0; i < all.length; i++) {
      all[i] = self._mark(all[i])
    }
    if (self.nodir) {
      all = all.filter(function (e) {
        var notDir = !(/\/$/.test(e))
        var c = self.cache[e] || self.cache[makeAbs(self, e)]
        if (notDir && c)
          notDir = c !== 'DIR' && !Array.isArray(c)
        return notDir
      })
    }
  }

  if (self.ignore.length)
    all = all.filter(function(m) {
      return !isIgnored(self, m)
    })

  self.found = all
}

function mark (self, p) {
  var abs = makeAbs(self, p)
  var c = self.cache[abs]
  var m = p
  if (c) {
    var isDir = c === 'DIR' || Array.isArray(c)
    var slash = p.slice(-1) === '/'

    if (isDir && !slash)
      m += '/'
    else if (!isDir && slash)
      m = m.slice(0, -1)

    if (m !== p) {
      var mabs = makeAbs(self, m)
      self.statCache[mabs] = self.statCache[abs]
      self.cache[mabs] = self.cache[abs]
    }
  }

  return m
}

// lotta situps...
function makeAbs (self, f) {
  var abs = f
  if (f.charAt(0) === '/') {
    abs = path.join(self.root, f)
  } else if (isAbsolute(f) || f === '') {
    abs = f
  } else if (self.changedCwd) {
    abs = path.resolve(self.cwd, f)
  } else {
    abs = path.resolve(f)
  }

  if (process.platform === 'win32')
    abs = abs.replace(/\\/g, '/')

  return abs
}


// Return true, if pattern ends with globstar '**', for the accompanying parent directory.
// Ex:- If node_modules/** is the pattern, add 'node_modules' to ignore list along with it's contents
function isIgnored (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return item.matcher.match(path) || !!(item.gmatcher && item.gmatcher.match(path))
  })
}

function childrenIgnored (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return !!(item.gmatcher && item.gmatcher.match(path))
  })
}


/***/ }),
/* 103 */
/***/ (function(module, exports) {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

var wrappy = __webpack_require__(103)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __webpack_require__(3);
const child_process_1 = __webpack_require__(90);
const mkdirp = __webpack_require__(132);
const isWsl = __webpack_require__(133);
function defaults(val, def) {
    return typeof val === 'undefined' ? def : val;
}
exports.defaults = defaults;
function delay(time) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => setTimeout(resolve, time));
    });
}
exports.delay = delay;
class LauncherError extends Error {
    constructor(message = 'Unexpected error', code) {
        super();
        this.message = message;
        this.code = code;
        this.stack = new Error().stack;
        return this;
    }
}
exports.LauncherError = LauncherError;
class ChromePathNotSetError extends LauncherError {
    constructor() {
        super(...arguments);
        this.message = 'The environment variable CHROME_PATH must be set to executable of a build of Chromium version 54.0 or later.';
        this.code = "ERR_LAUNCHER_PATH_NOT_SET" /* ERR_LAUNCHER_PATH_NOT_SET */;
    }
}
exports.ChromePathNotSetError = ChromePathNotSetError;
class InvalidUserDataDirectoryError extends LauncherError {
    constructor() {
        super(...arguments);
        this.message = 'userDataDir must be false or a path.';
        this.code = "ERR_LAUNCHER_INVALID_USER_DATA_DIRECTORY" /* ERR_LAUNCHER_INVALID_USER_DATA_DIRECTORY */;
    }
}
exports.InvalidUserDataDirectoryError = InvalidUserDataDirectoryError;
class UnsupportedPlatformError extends LauncherError {
    constructor() {
        super(...arguments);
        this.message = `Platform ${getPlatform()} is not supported.`;
        this.code = "ERR_LAUNCHER_UNSUPPORTED_PLATFORM" /* ERR_LAUNCHER_UNSUPPORTED_PLATFORM */;
    }
}
exports.UnsupportedPlatformError = UnsupportedPlatformError;
class ChromeNotInstalledError extends LauncherError {
    constructor() {
        super(...arguments);
        this.message = 'No Chrome installations found.';
        this.code = "ERR_LAUNCHER_NOT_INSTALLED" /* ERR_LAUNCHER_NOT_INSTALLED */;
    }
}
exports.ChromeNotInstalledError = ChromeNotInstalledError;
function getPlatform() {
    return isWsl ? 'wsl' : process.platform;
}
exports.getPlatform = getPlatform;
function makeTmpDir() {
    switch (getPlatform()) {
        case 'darwin':
        case 'linux':
            return makeUnixTmpDir();
        case 'wsl':
            // We populate the user's Windows temp dir so the folder is correctly created later
            process.env.TEMP = getLocalAppDataPath(`${process.env.PATH}`);
        case 'win32':
            return makeWin32TmpDir();
        default:
            throw new UnsupportedPlatformError();
    }
}
exports.makeTmpDir = makeTmpDir;
function toWinDirFormat(dir = '') {
    const results = /\/mnt\/([a-z])\//.exec(dir);
    if (!results) {
        return dir;
    }
    const driveLetter = results[1];
    return dir.replace(`/mnt/${driveLetter}/`, `${driveLetter.toUpperCase()}:\\`)
        .replace(/\//g, '\\');
}
exports.toWinDirFormat = toWinDirFormat;
function getLocalAppDataPath(path) {
    const userRegExp = /\/mnt\/([a-z])\/Users\/([^\/:]+)\/AppData\//;
    const results = userRegExp.exec(path) || [];
    return `/mnt/${results[1]}/Users/${results[2]}/AppData/Local`;
}
exports.getLocalAppDataPath = getLocalAppDataPath;
function makeUnixTmpDir() {
    return child_process_1.execSync('mktemp -d -t lighthouse.XXXXXXX').toString().trim();
}
function makeWin32TmpDir() {
    const winTmpPath = process.env.TEMP || process.env.TMP ||
        (process.env.SystemRoot || process.env.windir) + '\\temp';
    const randomNumber = Math.floor(Math.random() * 9e7 + 1e7);
    const tmpdir = path_1.join(winTmpPath, 'lighthouse.' + randomNumber);
    mkdirp.sync(tmpdir);
    return tmpdir;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRztBQUNILFlBQVksQ0FBQzs7Ozs7Ozs7OztBQUViLCtCQUEwQjtBQUMxQixpREFBdUM7QUFDdkMsaUNBQWlDO0FBQ2pDLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQVNoQyxrQkFBNEIsR0FBZ0IsRUFBRSxHQUFNO0lBQ2xELE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0FBQ2hELENBQUM7QUFGRCw0QkFFQztBQUVELGVBQTRCLElBQVk7O1FBQ3RDLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUMzRCxDQUFDO0NBQUE7QUFGRCxzQkFFQztBQUVELG1CQUEyQixTQUFRLEtBQUs7SUFDdEMsWUFBbUIsVUFBa0Isa0JBQWtCLEVBQVMsSUFBYTtRQUMzRSxLQUFLLEVBQUUsQ0FBQztRQURTLFlBQU8sR0FBUCxPQUFPLENBQTZCO1FBQVMsU0FBSSxHQUFKLElBQUksQ0FBUztRQUUzRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQ0Y7QUFORCxzQ0FNQztBQUVELDJCQUFtQyxTQUFRLGFBQWE7SUFBeEQ7O1FBQ0UsWUFBTyxHQUNILDhHQUE4RyxDQUFDO1FBQ25ILFNBQUksK0RBQThDO0lBQ3BELENBQUM7Q0FBQTtBQUpELHNEQUlDO0FBRUQsbUNBQTJDLFNBQVEsYUFBYTtJQUFoRTs7UUFDRSxZQUFPLEdBQUcsc0NBQXNDLENBQUM7UUFDakQsU0FBSSw2RkFBNkQ7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

/***/ }),
/* 106 */
/***/ (function(module, exports) {

throw new Error("Module parse failed: Unexpected token (283:8)\nYou may need an appropriate loader to handle this file type.\n|       const auditContext = {\n|         options: auditOptions,\n|         ...sharedAuditContext,\n|       };\n| ");

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */


const EventEmitter = __webpack_require__(7).EventEmitter;
const log = __webpack_require__(87);
const LHError = __webpack_require__(95);

// TODO(bckenny): CommandCallback properties should be tied by command type after
// https://github.com/Microsoft/TypeScript/pull/22348. See driver.js TODO.
/**
 * @typedef {{'protocolevent': [LH.Protocol.RawEventMessage]}} ProtocolEventRecord
 * @typedef {LH.Protocol.StrictEventEmitter<ProtocolEventRecord>} CrdpEventMessageEmitter
 * @typedef {LH.CrdpCommands[keyof LH.CrdpCommands]} CommandInfo
 * @typedef {{resolve: function(Promise<CommandInfo['returnType']>): void, method: keyof LH.CrdpCommands}} CommandCallback
 */

class Connection {
  constructor() {
    this._lastCommandId = 0;
    /** @type {Map<number, CommandCallback>} */
    this._callbacks = new Map();

    this._eventEmitter = /** @type {?CrdpEventMessageEmitter} */ (new EventEmitter());
  }

  /**
   * @return {Promise<void>}
   */
  connect() {
    return Promise.reject(new Error('Not implemented'));
  }

  /**
   * @return {Promise<void>}
   */
  disconnect() {
    return Promise.reject(new Error('Not implemented'));
  }

  /**
   * @return {Promise<string>}
   */
  wsEndpoint() {
    return Promise.reject(new Error('Not implemented'));
  }

  /**
   * Call protocol methods
   * @template {keyof LH.CrdpCommands} C
   * @param {C} method
   * @param {LH.CrdpCommands[C]['paramsType']} paramArgs,
   * @return {Promise<LH.CrdpCommands[C]['returnType']>}
   */
  sendCommand(method, ...paramArgs) {
    // Reify params since we need it as a property so can't just spread again.
    const params = paramArgs.length ? paramArgs[0] : undefined;

    log.formatProtocol('method => browser', {method, params}, 'verbose');
    const id = ++this._lastCommandId;
    const message = JSON.stringify({id, method, params});
    this.sendRawMessage(message);

    return new Promise(resolve => {
      this._callbacks.set(id, {method, resolve});
    });
  }

  /**
   * Bind listeners for connection events.
   * @param {'protocolevent'} eventName
   * @param {function(LH.Protocol.RawEventMessage): void} cb
   */
  on(eventName, cb) {
    if (eventName !== 'protocolevent') {
      throw new Error('Only supports "protocolevent" events');
    }

    if (!this._eventEmitter) {
      throw new Error('Attempted to add event listener after connection disposed.');
    }
    this._eventEmitter.on(eventName, cb);
  }

  /* eslint-disable no-unused-vars */

  /**
   * @param {string} message
   * @protected
   */
  sendRawMessage(message) {
    throw new Error('Not implemented');
  }

  /* eslint-enable no-unused-vars */

  /**
   * @param {string} message
   * @return {void}
   * @protected
   */
  handleRawMessage(message) {
    const object = /** @type {LH.Protocol.RawMessage} */(JSON.parse(message));

    // Responses to commands carry "id" property, while events do not.
    if (!('id' in object)) {
      log.formatProtocol('<= event',
          {method: object.method, params: object.params}, 'verbose');
      this.emitProtocolEvent(object);
      return;
    }

    const callback = this._callbacks.get(object.id);
    if (callback) {
      this._callbacks.delete(object.id);

      return callback.resolve(Promise.resolve().then(_ => {
        if (object.error) {
          log.formatProtocol('method <= browser ERR', {method: callback.method}, 'error');
          throw LHError.fromProtocolMessage(callback.method, object.error);
        }

        log.formatProtocol('method <= browser OK',
          {method: callback.method, params: object.result}, 'verbose');
        return object.result;
      }));
    } else {
      // In DevTools we receive responses to commands we did not send which we cannot act on, so we
      // just log these occurrences.
      const error = object.error && object.error.message;
      log.formatProtocol(`disowned method <= browser ${error ? 'ERR' : 'OK'}`,
          {method: 'UNKNOWN', params: error || object.result}, 'verbose');
    }
  }

  /**
   * @param {LH.Protocol.RawEventMessage} eventMessage
   */
  emitProtocolEvent(eventMessage) {
    if (!this._eventEmitter) {
      throw new Error('Attempted to emit event after connection disposed.');
    }

    this._eventEmitter.emit('protocolevent', eventMessage);
  }

  /**
   * @protected
   */
  dispose() {
    if (this._eventEmitter) {
      this._eventEmitter.removeAllListeners();
      this._eventEmitter = null;
    }
  }
}

module.exports = Connection;


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */



const EventEmitter = __webpack_require__(7);
const crypto = __webpack_require__(14);
const Ultron = __webpack_require__(109);
const https = __webpack_require__(16);
const http = __webpack_require__(9);
const url = __webpack_require__(4);

const PerMessageDeflate = __webpack_require__(91);
const EventTarget = __webpack_require__(140);
const Extensions = __webpack_require__(110);
const constants = __webpack_require__(97);
const Receiver = __webpack_require__(111);
const Sender = __webpack_require__(113);

const protocolVersions = [8, 13];
const closeTimeout = 30 * 1000; // Allow 30 seconds to terminate the connection cleanly.

/**
 * Class representing a WebSocket.
 *
 * @extends EventEmitter
 */
class WebSocket extends EventEmitter {
  /**
   * Create a new `WebSocket`.
   *
   * @param {String} address The URL to which to connect
   * @param {(String|String[])} protocols The subprotocols
   * @param {Object} options Connection options
   */
  constructor (address, protocols, options) {
    super();

    if (!protocols) {
      protocols = [];
    } else if (typeof protocols === 'string') {
      protocols = [protocols];
    } else if (!Array.isArray(protocols)) {
      options = protocols;
      protocols = [];
    }

    this.readyState = WebSocket.CONNECTING;
    this.bytesReceived = 0;
    this.extensions = {};
    this.protocol = '';

    this._binaryType = constants.BINARY_TYPES[0];
    this._finalize = this.finalize.bind(this);
    this._finalizeCalled = false;
    this._closeMessage = null;
    this._closeTimer = null;
    this._closeCode = null;
    this._receiver = null;
    this._sender = null;
    this._socket = null;
    this._ultron = null;

    if (Array.isArray(address)) {
      initAsServerClient.call(this, address[0], address[1], options);
    } else {
      initAsClient.call(this, address, protocols, options);
    }
  }

  get CONNECTING () { return WebSocket.CONNECTING; }
  get CLOSING () { return WebSocket.CLOSING; }
  get CLOSED () { return WebSocket.CLOSED; }
  get OPEN () { return WebSocket.OPEN; }

  /**
   * @type {Number}
   */
  get bufferedAmount () {
    var amount = 0;

    if (this._socket) {
      amount = this._socket.bufferSize + this._sender._bufferedBytes;
    }
    return amount;
  }

  /**
   * This deviates from the WHATWG interface since ws doesn't support the required
   * default "blob" type (instead we define a custom "nodebuffer" type).
   *
   * @type {String}
   */
  get binaryType () {
    return this._binaryType;
  }

  set binaryType (type) {
    if (constants.BINARY_TYPES.indexOf(type) < 0) return;

    this._binaryType = type;

    //
    // Allow to change `binaryType` on the fly.
    //
    if (this._receiver) this._receiver._binaryType = type;
  }

  /**
   * Set up the socket and the internal resources.
   *
   * @param {net.Socket} socket The network socket between the server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @private
   */
  setSocket (socket, head) {
    socket.setTimeout(0);
    socket.setNoDelay();

    this._receiver = new Receiver(this.extensions, this._maxPayload, this.binaryType);
    this._sender = new Sender(socket, this.extensions);
    this._ultron = new Ultron(socket);
    this._socket = socket;

    // socket cleanup handlers
    this._ultron.on('close', this._finalize);
    this._ultron.on('error', this._finalize);
    this._ultron.on('end', this._finalize);

    // ensure that the head is added to the receiver
    if (head.length > 0) socket.unshift(head);

    // subsequent packets are pushed to the receiver
    this._ultron.on('data', (data) => {
      this.bytesReceived += data.length;
      this._receiver.add(data);
    });

    // receiver event handlers
    this._receiver.onmessage = (data) => this.emit('message', data);
    this._receiver.onping = (data) => {
      this.pong(data, !this._isServer, true);
      this.emit('ping', data);
    };
    this._receiver.onpong = (data) => this.emit('pong', data);
    this._receiver.onclose = (code, reason) => {
      this._closeMessage = reason;
      this._closeCode = code;
      this.close(code, reason);
    };
    this._receiver.onerror = (error, code) => {
      // close the connection when the receiver reports a HyBi error code
      this.close(code, '');
      this.emit('error', error);
    };

    this.readyState = WebSocket.OPEN;
    this.emit('open');
  }

  /**
   * Clean up and release internal resources.
   *
   * @param {(Boolean|Error)} Indicates whether or not an error occurred
   * @private
   */
  finalize (error) {
    if (this._finalizeCalled) return;

    this.readyState = WebSocket.CLOSING;
    this._finalizeCalled = true;

    clearTimeout(this._closeTimer);
    this._closeTimer = null;

    //
    // If the connection was closed abnormally (with an error), or if the close
    // control frame was malformed or not received then the close code must be
    // 1006.
    //
    if (error) this._closeCode = 1006;

    if (this._socket) {
      this._ultron.destroy();
      this._socket.on('error', function onerror () {
        this.destroy();
      });

      if (!error) this._socket.end();
      else this._socket.destroy();

      this._receiver.cleanup(() => this.emitClose());

      this._receiver = null;
      this._sender = null;
      this._socket = null;
      this._ultron = null;
    } else {
      this.emitClose();
    }
  }

  /**
   * Emit the `close` event.
   *
   * @private
   */
  emitClose () {
    this.readyState = WebSocket.CLOSED;
    this.emit('close', this._closeCode || 1006, this._closeMessage || '');

    if (this.extensions[PerMessageDeflate.extensionName]) {
      this.extensions[PerMessageDeflate.extensionName].cleanup();
    }

    this.extensions = null;

    this.removeAllListeners();
    this.on('error', constants.NOOP); // Catch all errors after this.
  }

  /**
   * Pause the socket stream.
   *
   * @public
   */
  pause () {
    if (this.readyState !== WebSocket.OPEN) throw new Error('not opened');

    this._socket.pause();
  }

  /**
   * Resume the socket stream
   *
   * @public
   */
  resume () {
    if (this.readyState !== WebSocket.OPEN) throw new Error('not opened');

    this._socket.resume();
  }

  /**
   * Start a closing handshake.
   *
   * @param {Number} code Status code explaining why the connection is closing
   * @param {String} data A string explaining why the connection is closing
   * @public
   */
  close (code, data) {
    if (this.readyState === WebSocket.CLOSED) return;
    if (this.readyState === WebSocket.CONNECTING) {
      if (this._req && !this._req.aborted) {
        this._req.abort();
        this.emit('error', new Error('closed before the connection is established'));
        this.finalize(true);
      }
      return;
    }

    if (this.readyState === WebSocket.CLOSING) {
      if (this._closeCode && this._socket) this._socket.end();
      return;
    }

    this.readyState = WebSocket.CLOSING;
    this._sender.close(code, data, !this._isServer, (err) => {
      if (err) this.emit('error', err);

      if (this._socket) {
        if (this._closeCode) this._socket.end();
        //
        // Ensure that the connection is cleaned up even when the closing
        // handshake fails.
        //
        clearTimeout(this._closeTimer);
        this._closeTimer = setTimeout(this._finalize, closeTimeout, true);
      }
    });
  }

  /**
   * Send a ping message.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Indicates whether or not to mask `data`
   * @param {Boolean} failSilently Indicates whether or not to throw if `readyState` isn't `OPEN`
   * @public
   */
  ping (data, mask, failSilently) {
    if (this.readyState !== WebSocket.OPEN) {
      if (failSilently) return;
      throw new Error('not opened');
    }

    if (typeof data === 'number') data = data.toString();
    if (mask === undefined) mask = !this._isServer;
    this._sender.ping(data || constants.EMPTY_BUFFER, mask);
  }

  /**
   * Send a pong message.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Indicates whether or not to mask `data`
   * @param {Boolean} failSilently Indicates whether or not to throw if `readyState` isn't `OPEN`
   * @public
   */
  pong (data, mask, failSilently) {
    if (this.readyState !== WebSocket.OPEN) {
      if (failSilently) return;
      throw new Error('not opened');
    }

    if (typeof data === 'number') data = data.toString();
    if (mask === undefined) mask = !this._isServer;
    this._sender.pong(data || constants.EMPTY_BUFFER, mask);
  }

  /**
   * Send a data message.
   *
   * @param {*} data The message to send
   * @param {Object} options Options object
   * @param {Boolean} options.compress Specifies whether or not to compress `data`
   * @param {Boolean} options.binary Specifies whether `data` is binary or text
   * @param {Boolean} options.fin Specifies whether the fragment is the last one
   * @param {Boolean} options.mask Specifies whether or not to mask `data`
   * @param {Function} cb Callback which is executed when data is written out
   * @public
   */
  send (data, options, cb) {
    if (typeof options === 'function') {
      cb = options;
      options = {};
    }

    if (this.readyState !== WebSocket.OPEN) {
      if (cb) cb(new Error('not opened'));
      else throw new Error('not opened');
      return;
    }

    if (typeof data === 'number') data = data.toString();

    const opts = Object.assign({
      binary: typeof data !== 'string',
      mask: !this._isServer,
      compress: true,
      fin: true
    }, options);

    if (!this.extensions[PerMessageDeflate.extensionName]) {
      opts.compress = false;
    }

    this._sender.send(data || constants.EMPTY_BUFFER, opts, cb);
  }

  /**
   * Forcibly close the connection.
   *
   * @public
   */
  terminate () {
    if (this.readyState === WebSocket.CLOSED) return;
    if (this.readyState === WebSocket.CONNECTING) {
      if (this._req && !this._req.aborted) {
        this._req.abort();
        this.emit('error', new Error('closed before the connection is established'));
        this.finalize(true);
      }
      return;
    }

    this.finalize(true);
  }
}

WebSocket.CONNECTING = 0;
WebSocket.OPEN = 1;
WebSocket.CLOSING = 2;
WebSocket.CLOSED = 3;

//
// Add the `onopen`, `onerror`, `onclose`, and `onmessage` attributes.
// See https://html.spec.whatwg.org/multipage/comms.html#the-websocket-interface
//
['open', 'error', 'close', 'message'].forEach((method) => {
  Object.defineProperty(WebSocket.prototype, `on${method}`, {
    /**
     * Return the listener of the event.
     *
     * @return {(Function|undefined)} The event listener or `undefined`
     * @public
     */
    get () {
      const listeners = this.listeners(method);
      for (var i = 0; i < listeners.length; i++) {
        if (listeners[i]._listener) return listeners[i]._listener;
      }
    },
    /**
     * Add a listener for the event.
     *
     * @param {Function} listener The listener to add
     * @public
     */
    set (listener) {
      const listeners = this.listeners(method);
      for (var i = 0; i < listeners.length; i++) {
        //
        // Remove only the listeners added via `addEventListener`.
        //
        if (listeners[i]._listener) this.removeListener(method, listeners[i]);
      }
      this.addEventListener(method, listener);
    }
  });
});

WebSocket.prototype.addEventListener = EventTarget.addEventListener;
WebSocket.prototype.removeEventListener = EventTarget.removeEventListener;

module.exports = WebSocket;

/**
 * Initialize a WebSocket server client.
 *
 * @param {http.IncomingMessage} req The request object
 * @param {net.Socket} socket The network socket between the server and client
 * @param {Buffer} head The first packet of the upgraded stream
 * @param {Object} options WebSocket attributes
 * @param {Number} options.protocolVersion The WebSocket protocol version
 * @param {Object} options.extensions The negotiated extensions
 * @param {Number} options.maxPayload The maximum allowed message size
 * @param {String} options.protocol The chosen subprotocol
 * @private
 */
function initAsServerClient (socket, head, options) {
  this.protocolVersion = options.protocolVersion;
  this._maxPayload = options.maxPayload;
  this.extensions = options.extensions;
  this.protocol = options.protocol;

  this._isServer = true;

  this.setSocket(socket, head);
}

/**
 * Initialize a WebSocket client.
 *
 * @param {String} address The URL to which to connect
 * @param {String[]} protocols The list of subprotocols
 * @param {Object} options Connection options
 * @param {String} options.protocol Value of the `Sec-WebSocket-Protocol` header
 * @param {(Boolean|Object)} options.perMessageDeflate Enable/disable permessage-deflate
 * @param {Number} options.handshakeTimeout Timeout in milliseconds for the handshake request
 * @param {String} options.localAddress Local interface to bind for network connections
 * @param {Number} options.protocolVersion Value of the `Sec-WebSocket-Version` header
 * @param {Object} options.headers An object containing request headers
 * @param {String} options.origin Value of the `Origin` or `Sec-WebSocket-Origin` header
 * @param {http.Agent} options.agent Use the specified Agent
 * @param {String} options.host Value of the `Host` header
 * @param {Number} options.family IP address family to use during hostname lookup (4 or 6).
 * @param {Function} options.checkServerIdentity A function to validate the server hostname
 * @param {Boolean} options.rejectUnauthorized Verify or not the server certificate
 * @param {String} options.passphrase The passphrase for the private key or pfx
 * @param {String} options.ciphers The ciphers to use or exclude
 * @param {String} options.ecdhCurve The curves for ECDH key agreement to use or exclude
 * @param {(String|String[]|Buffer|Buffer[])} options.cert The certificate key
 * @param {(String|String[]|Buffer|Buffer[])} options.key The private key
 * @param {(String|Buffer)} options.pfx The private key, certificate, and CA certs
 * @param {(String|String[]|Buffer|Buffer[])} options.ca Trusted certificates
 * @private
 */
function initAsClient (address, protocols, options) {
  options = Object.assign({
    protocolVersion: protocolVersions[1],
    protocol: protocols.join(','),
    perMessageDeflate: true,
    handshakeTimeout: null,
    localAddress: null,
    headers: null,
    family: null,
    origin: null,
    agent: null,
    host: null,

    //
    // SSL options.
    //
    checkServerIdentity: null,
    rejectUnauthorized: null,
    passphrase: null,
    ciphers: null,
    ecdhCurve: null,
    cert: null,
    key: null,
    pfx: null,
    ca: null
  }, options);

  if (protocolVersions.indexOf(options.protocolVersion) === -1) {
    throw new Error(
      `unsupported protocol version: ${options.protocolVersion} ` +
      `(supported versions: ${protocolVersions.join(', ')})`
    );
  }

  this.protocolVersion = options.protocolVersion;
  this._isServer = false;
  this.url = address;

  const serverUrl = url.parse(address);
  const isUnixSocket = serverUrl.protocol === 'ws+unix:';

  if (!serverUrl.host && (!isUnixSocket || !serverUrl.path)) {
    throw new Error('invalid url');
  }

  const isSecure = serverUrl.protocol === 'wss:' || serverUrl.protocol === 'https:';
  const key = crypto.randomBytes(16).toString('base64');
  const httpObj = isSecure ? https : http;
  var perMessageDeflate;

  const requestOptions = {
    port: serverUrl.port || (isSecure ? 443 : 80),
    host: serverUrl.hostname,
    path: '/',
    headers: {
      'Sec-WebSocket-Version': options.protocolVersion,
      'Sec-WebSocket-Key': key,
      'Connection': 'Upgrade',
      'Upgrade': 'websocket'
    }
  };

  if (options.headers) Object.assign(requestOptions.headers, options.headers);
  if (options.perMessageDeflate) {
    perMessageDeflate = new PerMessageDeflate(
      options.perMessageDeflate !== true ? options.perMessageDeflate : {},
      false
    );
    requestOptions.headers['Sec-WebSocket-Extensions'] = Extensions.format({
      [PerMessageDeflate.extensionName]: perMessageDeflate.offer()
    });
  }
  if (options.protocol) {
    requestOptions.headers['Sec-WebSocket-Protocol'] = options.protocol;
  }
  if (options.origin) {
    if (options.protocolVersion < 13) {
      requestOptions.headers['Sec-WebSocket-Origin'] = options.origin;
    } else {
      requestOptions.headers.Origin = options.origin;
    }
  }
  if (options.host) requestOptions.headers.Host = options.host;
  if (serverUrl.auth) requestOptions.auth = serverUrl.auth;

  if (options.localAddress) requestOptions.localAddress = options.localAddress;
  if (options.family) requestOptions.family = options.family;

  if (isUnixSocket) {
    const parts = serverUrl.path.split(':');

    requestOptions.socketPath = parts[0];
    requestOptions.path = parts[1];
  } else if (serverUrl.path) {
    //
    // Make sure that path starts with `/`.
    //
    if (serverUrl.path.charAt(0) !== '/') {
      requestOptions.path = `/${serverUrl.path}`;
    } else {
      requestOptions.path = serverUrl.path;
    }
  }

  var agent = options.agent;

  //
  // A custom agent is required for these options.
  //
  if (
    options.rejectUnauthorized != null ||
    options.checkServerIdentity ||
    options.passphrase ||
    options.ciphers ||
    options.ecdhCurve ||
    options.cert ||
    options.key ||
    options.pfx ||
    options.ca
  ) {
    if (options.passphrase) requestOptions.passphrase = options.passphrase;
    if (options.ciphers) requestOptions.ciphers = options.ciphers;
    if (options.ecdhCurve) requestOptions.ecdhCurve = options.ecdhCurve;
    if (options.cert) requestOptions.cert = options.cert;
    if (options.key) requestOptions.key = options.key;
    if (options.pfx) requestOptions.pfx = options.pfx;
    if (options.ca) requestOptions.ca = options.ca;
    if (options.checkServerIdentity) {
      requestOptions.checkServerIdentity = options.checkServerIdentity;
    }
    if (options.rejectUnauthorized != null) {
      requestOptions.rejectUnauthorized = options.rejectUnauthorized;
    }

    if (!agent) agent = new httpObj.Agent(requestOptions);
  }

  if (agent) requestOptions.agent = agent;

  this._req = httpObj.get(requestOptions);

  if (options.handshakeTimeout) {
    this._req.setTimeout(options.handshakeTimeout, () => {
      this._req.abort();
      this.emit('error', new Error('opening handshake has timed out'));
      this.finalize(true);
    });
  }

  this._req.on('error', (error) => {
    if (this._req.aborted) return;

    this._req = null;
    this.emit('error', error);
    this.finalize(true);
  });

  this._req.on('response', (res) => {
    if (!this.emit('unexpected-response', this._req, res)) {
      this._req.abort();
      this.emit('error', new Error(`unexpected server response (${res.statusCode})`));
      this.finalize(true);
    }
  });

  this._req.on('upgrade', (res, socket, head) => {
    this.emit('headers', res.headers, res);

    //
    // The user may have closed the connection from a listener of the `headers`
    // event.
    //
    if (this.readyState !== WebSocket.CONNECTING) return;

    this._req = null;

    const digest = crypto.createHash('sha1')
      .update(key + constants.GUID, 'binary')
      .digest('base64');

    if (res.headers['sec-websocket-accept'] !== digest) {
      socket.destroy();
      this.emit('error', new Error('invalid server key'));
      return this.finalize(true);
    }

    const serverProt = res.headers['sec-websocket-protocol'];
    const protList = (options.protocol || '').split(/, */);
    var protError;

    if (!options.protocol && serverProt) {
      protError = 'server sent a subprotocol even though none requested';
    } else if (options.protocol && !serverProt) {
      protError = 'server sent no subprotocol even though requested';
    } else if (serverProt && protList.indexOf(serverProt) === -1) {
      protError = 'server responded with an invalid protocol';
    }

    if (protError) {
      socket.destroy();
      this.emit('error', new Error(protError));
      return this.finalize(true);
    }

    if (serverProt) this.protocol = serverProt;

    if (perMessageDeflate) {
      try {
        const serverExtensions = Extensions.parse(
          res.headers['sec-websocket-extensions']
        );

        if (serverExtensions[PerMessageDeflate.extensionName]) {
          perMessageDeflate.accept(
            serverExtensions[PerMessageDeflate.extensionName]
          );
          this.extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
        }
      } catch (err) {
        socket.destroy();
        this.emit('error', new Error('invalid Sec-WebSocket-Extensions header'));
        return this.finalize(true);
      }
    }

    this.setSocket(socket, head);
  });
}


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty;

/**
 * An auto incrementing id which we can use to create "unique" Ultron instances
 * so we can track the event emitters that are added through the Ultron
 * interface.
 *
 * @type {Number}
 * @private
 */
var id = 0;

/**
 * Ultron is high-intelligence robot. It gathers intelligence so it can start improving
 * upon his rudimentary design. It will learn from your EventEmitting patterns
 * and exterminate them.
 *
 * @constructor
 * @param {EventEmitter} ee EventEmitter instance we need to wrap.
 * @api public
 */
function Ultron(ee) {
  if (!(this instanceof Ultron)) return new Ultron(ee);

  this.id = id++;
  this.ee = ee;
}

/**
 * Register a new EventListener for the given event.
 *
 * @param {String} event Name of the event.
 * @param {Functon} fn Callback function.
 * @param {Mixed} context The context of the function.
 * @returns {Ultron}
 * @api public
 */
Ultron.prototype.on = function on(event, fn, context) {
  fn.__ultron = this.id;
  this.ee.on(event, fn, context);

  return this;
};
/**
 * Add an EventListener that's only called once.
 *
 * @param {String} event Name of the event.
 * @param {Function} fn Callback function.
 * @param {Mixed} context The context of the function.
 * @returns {Ultron}
 * @api public
 */
Ultron.prototype.once = function once(event, fn, context) {
  fn.__ultron = this.id;
  this.ee.once(event, fn, context);

  return this;
};

/**
 * Remove the listeners we assigned for the given event.
 *
 * @returns {Ultron}
 * @api public
 */
Ultron.prototype.remove = function remove() {
  var args = arguments
    , ee = this.ee
    , event;

  //
  // When no event names are provided we assume that we need to clear all the
  // events that were assigned through us.
  //
  if (args.length === 1 && 'string' === typeof args[0]) {
    args = args[0].split(/[, ]+/);
  } else if (!args.length) {
    if (ee.eventNames) {
      args = ee.eventNames();
    } else if (ee._events) {
      args = [];

      for (event in ee._events) {
        if (has.call(ee._events, event)) args.push(event);
      }

      if (Object.getOwnPropertySymbols) {
        args = args.concat(Object.getOwnPropertySymbols(ee._events));
      }
    }
  }

  for (var i = 0; i < args.length; i++) {
    var listeners = ee.listeners(args[i]);

    for (var j = 0; j < listeners.length; j++) {
      event = listeners[j];

      //
      // Once listeners have a `listener` property that stores the real listener
      // in the EventEmitter that ships with Node.js.
      //
      if (event.listener) {
        if (event.listener.__ultron !== this.id) continue;
      } else if (event.__ultron !== this.id) {
        continue;
      }

      ee.removeListener(args[i], event);
    }
  }

  return this;
};

/**
 * Destroy the Ultron instance, remove all listeners and release all references.
 *
 * @returns {Boolean}
 * @api public
 */
Ultron.prototype.destroy = function destroy() {
  if (!this.ee) return false;

  this.remove();
  this.ee = null;

  return true;
};

//
// Expose the module.
//
module.exports = Ultron;


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//
// Allowed token characters:
//
// '!', '#', '$', '%', '&', ''', '*', '+', '-',
// '.', 0-9, A-Z, '^', '_', '`', a-z, '|', '~'
//
// tokenChars[32] === 0 // ' '
// tokenChars[33] === 1 // '!'
// tokenChars[34] === 0 // '"'
// ...
//
const tokenChars = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0 - 15
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 16 - 31
  0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, // 32 - 47
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 48 - 63
  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 64 - 79
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, // 80 - 95
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 96 - 111
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0 // 112 - 127
];

/**
 * Adds an offer to the map of extension offers or a parameter to the map of
 * parameters.
 *
 * @param {Object} dest The map of extension offers or parameters
 * @param {String} name The extension or parameter name
 * @param {(Object|Boolean|String)} elem The extension parameters or the
 *     parameter value
 * @private
 */
function push (dest, name, elem) {
  if (Object.prototype.hasOwnProperty.call(dest, name)) dest[name].push(elem);
  else dest[name] = [elem];
}

/**
 * Parses the `Sec-WebSocket-Extensions` header into an object.
 *
 * @param {String} header The field value of the header
 * @return {Object} The parsed object
 * @public
 */
function parse (header) {
  const offers = {};

  if (header === undefined || header === '') return offers;

  var params = {};
  var mustUnescape = false;
  var isEscaping = false;
  var inQuotes = false;
  var extensionName;
  var paramName;
  var start = -1;
  var end = -1;

  for (var i = 0; i < header.length; i++) {
    const code = header.charCodeAt(i);

    if (extensionName === undefined) {
      if (end === -1 && tokenChars[code] === 1) {
        if (start === -1) start = i;
      } else if (code === 0x20/* ' ' */|| code === 0x09/* '\t' */) {
        if (end === -1 && start !== -1) end = i;
      } else if (code === 0x3b/* ';' */ || code === 0x2c/* ',' */) {
        if (start === -1) throw new Error(`unexpected character at index ${i}`);

        if (end === -1) end = i;
        const name = header.slice(start, end);
        if (code === 0x2c) {
          push(offers, name, params);
          params = {};
        } else {
          extensionName = name;
        }

        start = end = -1;
      } else {
        throw new Error(`unexpected character at index ${i}`);
      }
    } else if (paramName === undefined) {
      if (end === -1 && tokenChars[code] === 1) {
        if (start === -1) start = i;
      } else if (code === 0x20 || code === 0x09) {
        if (end === -1 && start !== -1) end = i;
      } else if (code === 0x3b || code === 0x2c) {
        if (start === -1) throw new Error(`unexpected character at index ${i}`);

        if (end === -1) end = i;
        push(params, header.slice(start, end), true);
        if (code === 0x2c) {
          push(offers, extensionName, params);
          params = {};
          extensionName = undefined;
        }

        start = end = -1;
      } else if (code === 0x3d/* '=' */&& start !== -1 && end === -1) {
        paramName = header.slice(start, i);
        start = end = -1;
      } else {
        throw new Error(`unexpected character at index ${i}`);
      }
    } else {
      //
      // The value of a quoted-string after unescaping must conform to the
      // token ABNF, so only token characters are valid.
      // Ref: https://tools.ietf.org/html/rfc6455#section-9.1
      //
      if (isEscaping) {
        if (tokenChars[code] !== 1) {
          throw new Error(`unexpected character at index ${i}`);
        }
        if (start === -1) start = i;
        else if (!mustUnescape) mustUnescape = true;
        isEscaping = false;
      } else if (inQuotes) {
        if (tokenChars[code] === 1) {
          if (start === -1) start = i;
        } else if (code === 0x22/* '"' */ && start !== -1) {
          inQuotes = false;
          end = i;
        } else if (code === 0x5c/* '\' */) {
          isEscaping = true;
        } else {
          throw new Error(`unexpected character at index ${i}`);
        }
      } else if (code === 0x22 && header.charCodeAt(i - 1) === 0x3d) {
        inQuotes = true;
      } else if (end === -1 && tokenChars[code] === 1) {
        if (start === -1) start = i;
      } else if (start !== -1 && (code === 0x20 || code === 0x09)) {
        if (end === -1) end = i;
      } else if (code === 0x3b || code === 0x2c) {
        if (start === -1) throw new Error(`unexpected character at index ${i}`);

        if (end === -1) end = i;
        var value = header.slice(start, end);
        if (mustUnescape) {
          value = value.replace(/\\/g, '');
          mustUnescape = false;
        }
        push(params, paramName, value);
        if (code === 0x2c) {
          push(offers, extensionName, params);
          params = {};
          extensionName = undefined;
        }

        paramName = undefined;
        start = end = -1;
      } else {
        throw new Error(`unexpected character at index ${i}`);
      }
    }
  }

  if (start === -1 || inQuotes) throw new Error('unexpected end of input');

  if (end === -1) end = i;
  const token = header.slice(start, end);
  if (extensionName === undefined) {
    push(offers, token, {});
  } else {
    if (paramName === undefined) {
      push(params, token, true);
    } else if (mustUnescape) {
      push(params, paramName, token.replace(/\\/g, ''));
    } else {
      push(params, paramName, token);
    }
    push(offers, extensionName, params);
  }

  return offers;
}

/**
 * Serializes a parsed `Sec-WebSocket-Extensions` header to a string.
 *
 * @param {Object} value The object to format
 * @return {String} A string representing the given value
 * @public
 */
function format (value) {
  return Object.keys(value).map((token) => {
    var paramsList = value[token];
    if (!Array.isArray(paramsList)) paramsList = [paramsList];
    return paramsList.map((params) => {
      return [token].concat(Object.keys(params).map((k) => {
        var p = params[k];
        if (!Array.isArray(p)) p = [p];
        return p.map((v) => v === true ? k : `${k}=${v}`).join('; ');
      })).join('; ');
    }).join(', ');
  }).join(', ');
}

module.exports = { format, parse };


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */



const safeBuffer = __webpack_require__(89);

const PerMessageDeflate = __webpack_require__(91);
const isValidUTF8 = __webpack_require__(141);
const bufferUtil = __webpack_require__(96);
const ErrorCodes = __webpack_require__(112);
const constants = __webpack_require__(97);

const Buffer = safeBuffer.Buffer;

const GET_INFO = 0;
const GET_PAYLOAD_LENGTH_16 = 1;
const GET_PAYLOAD_LENGTH_64 = 2;
const GET_MASK = 3;
const GET_DATA = 4;
const INFLATING = 5;

/**
 * HyBi Receiver implementation.
 */
class Receiver {
  /**
   * Creates a Receiver instance.
   *
   * @param {Object} extensions An object containing the negotiated extensions
   * @param {Number} maxPayload The maximum allowed message length
   * @param {String} binaryType The type for binary data
   */
  constructor (extensions, maxPayload, binaryType) {
    this._binaryType = binaryType || constants.BINARY_TYPES[0];
    this._extensions = extensions || {};
    this._maxPayload = maxPayload | 0;

    this._bufferedBytes = 0;
    this._buffers = [];

    this._compressed = false;
    this._payloadLength = 0;
    this._fragmented = 0;
    this._masked = false;
    this._fin = false;
    this._mask = null;
    this._opcode = 0;

    this._totalPayloadLength = 0;
    this._messageLength = 0;
    this._fragments = [];

    this._cleanupCallback = null;
    this._hadError = false;
    this._dead = false;
    this._loop = false;

    this.onmessage = null;
    this.onclose = null;
    this.onerror = null;
    this.onping = null;
    this.onpong = null;

    this._state = GET_INFO;
  }

  /**
   * Consumes bytes from the available buffered data.
   *
   * @param {Number} bytes The number of bytes to consume
   * @return {Buffer} Consumed bytes
   * @private
   */
  readBuffer (bytes) {
    var offset = 0;
    var dst;
    var l;

    this._bufferedBytes -= bytes;

    if (bytes === this._buffers[0].length) return this._buffers.shift();

    if (bytes < this._buffers[0].length) {
      dst = this._buffers[0].slice(0, bytes);
      this._buffers[0] = this._buffers[0].slice(bytes);
      return dst;
    }

    dst = Buffer.allocUnsafe(bytes);

    while (bytes > 0) {
      l = this._buffers[0].length;

      if (bytes >= l) {
        this._buffers[0].copy(dst, offset);
        offset += l;
        this._buffers.shift();
      } else {
        this._buffers[0].copy(dst, offset, 0, bytes);
        this._buffers[0] = this._buffers[0].slice(bytes);
      }

      bytes -= l;
    }

    return dst;
  }

  /**
   * Checks if the number of buffered bytes is bigger or equal than `n` and
   * calls `cleanup` if necessary.
   *
   * @param {Number} n The number of bytes to check against
   * @return {Boolean} `true` if `bufferedBytes >= n`, else `false`
   * @private
   */
  hasBufferedBytes (n) {
    if (this._bufferedBytes >= n) return true;

    this._loop = false;
    if (this._dead) this.cleanup(this._cleanupCallback);
    return false;
  }

  /**
   * Adds new data to the parser.
   *
   * @public
   */
  add (data) {
    if (this._dead) return;

    this._bufferedBytes += data.length;
    this._buffers.push(data);
    this.startLoop();
  }

  /**
   * Starts the parsing loop.
   *
   * @private
   */
  startLoop () {
    this._loop = true;

    while (this._loop) {
      switch (this._state) {
        case GET_INFO:
          this.getInfo();
          break;
        case GET_PAYLOAD_LENGTH_16:
          this.getPayloadLength16();
          break;
        case GET_PAYLOAD_LENGTH_64:
          this.getPayloadLength64();
          break;
        case GET_MASK:
          this.getMask();
          break;
        case GET_DATA:
          this.getData();
          break;
        default: // `INFLATING`
          this._loop = false;
      }
    }
  }

  /**
   * Reads the first two bytes of a frame.
   *
   * @private
   */
  getInfo () {
    if (!this.hasBufferedBytes(2)) return;

    const buf = this.readBuffer(2);

    if ((buf[0] & 0x30) !== 0x00) {
      this.error(new Error('RSV2 and RSV3 must be clear'), 1002);
      return;
    }

    const compressed = (buf[0] & 0x40) === 0x40;

    if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
      this.error(new Error('RSV1 must be clear'), 1002);
      return;
    }

    this._fin = (buf[0] & 0x80) === 0x80;
    this._opcode = buf[0] & 0x0f;
    this._payloadLength = buf[1] & 0x7f;

    if (this._opcode === 0x00) {
      if (compressed) {
        this.error(new Error('RSV1 must be clear'), 1002);
        return;
      }

      if (!this._fragmented) {
        this.error(new Error(`invalid opcode: ${this._opcode}`), 1002);
        return;
      } else {
        this._opcode = this._fragmented;
      }
    } else if (this._opcode === 0x01 || this._opcode === 0x02) {
      if (this._fragmented) {
        this.error(new Error(`invalid opcode: ${this._opcode}`), 1002);
        return;
      }

      this._compressed = compressed;
    } else if (this._opcode > 0x07 && this._opcode < 0x0b) {
      if (!this._fin) {
        this.error(new Error('FIN must be set'), 1002);
        return;
      }

      if (compressed) {
        this.error(new Error('RSV1 must be clear'), 1002);
        return;
      }

      if (this._payloadLength > 0x7d) {
        this.error(new Error('invalid payload length'), 1002);
        return;
      }
    } else {
      this.error(new Error(`invalid opcode: ${this._opcode}`), 1002);
      return;
    }

    if (!this._fin && !this._fragmented) this._fragmented = this._opcode;

    this._masked = (buf[1] & 0x80) === 0x80;

    if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
    else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
    else this.haveLength();
  }

  /**
   * Gets extended payload length (7+16).
   *
   * @private
   */
  getPayloadLength16 () {
    if (!this.hasBufferedBytes(2)) return;

    this._payloadLength = this.readBuffer(2).readUInt16BE(0, true);
    this.haveLength();
  }

  /**
   * Gets extended payload length (7+64).
   *
   * @private
   */
  getPayloadLength64 () {
    if (!this.hasBufferedBytes(8)) return;

    const buf = this.readBuffer(8);
    const num = buf.readUInt32BE(0, true);

    //
    // The maximum safe integer in JavaScript is 2^53 - 1. An error is returned
    // if payload length is greater than this number.
    //
    if (num > Math.pow(2, 53 - 32) - 1) {
      this.error(new Error('max payload size exceeded'), 1009);
      return;
    }

    this._payloadLength = (num * Math.pow(2, 32)) + buf.readUInt32BE(4, true);
    this.haveLength();
  }

  /**
   * Payload length has been read.
   *
   * @private
   */
  haveLength () {
    if (this._opcode < 0x08 && this.maxPayloadExceeded(this._payloadLength)) {
      return;
    }

    if (this._masked) this._state = GET_MASK;
    else this._state = GET_DATA;
  }

  /**
   * Reads mask bytes.
   *
   * @private
   */
  getMask () {
    if (!this.hasBufferedBytes(4)) return;

    this._mask = this.readBuffer(4);
    this._state = GET_DATA;
  }

  /**
   * Reads data bytes.
   *
   * @private
   */
  getData () {
    var data = constants.EMPTY_BUFFER;

    if (this._payloadLength) {
      if (!this.hasBufferedBytes(this._payloadLength)) return;

      data = this.readBuffer(this._payloadLength);
      if (this._masked) bufferUtil.unmask(data, this._mask);
    }

    if (this._opcode > 0x07) {
      this.controlMessage(data);
    } else if (this._compressed) {
      this._state = INFLATING;
      this.decompress(data);
    } else if (this.pushFragment(data)) {
      this.dataMessage();
    }
  }

  /**
   * Decompresses data.
   *
   * @param {Buffer} data Compressed data
   * @private
   */
  decompress (data) {
    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];

    perMessageDeflate.decompress(data, this._fin, (err, buf) => {
      if (err) {
        this.error(err, err.closeCode === 1009 ? 1009 : 1007);
        return;
      }

      if (this.pushFragment(buf)) this.dataMessage();
      this.startLoop();
    });
  }

  /**
   * Handles a data message.
   *
   * @private
   */
  dataMessage () {
    if (this._fin) {
      const messageLength = this._messageLength;
      const fragments = this._fragments;

      this._totalPayloadLength = 0;
      this._messageLength = 0;
      this._fragmented = 0;
      this._fragments = [];

      if (this._opcode === 2) {
        var data;

        if (this._binaryType === 'nodebuffer') {
          data = toBuffer(fragments, messageLength);
        } else if (this._binaryType === 'arraybuffer') {
          data = toArrayBuffer(toBuffer(fragments, messageLength));
        } else {
          data = fragments;
        }

        this.onmessage(data);
      } else {
        const buf = toBuffer(fragments, messageLength);

        if (!isValidUTF8(buf)) {
          this.error(new Error('invalid utf8 sequence'), 1007);
          return;
        }

        this.onmessage(buf.toString());
      }
    }

    this._state = GET_INFO;
  }

  /**
   * Handles a control message.
   *
   * @param {Buffer} data Data to handle
   * @private
   */
  controlMessage (data) {
    if (this._opcode === 0x08) {
      if (data.length === 0) {
        this.onclose(1000, '');
        this._loop = false;
        this.cleanup(this._cleanupCallback);
      } else if (data.length === 1) {
        this.error(new Error('invalid payload length'), 1002);
      } else {
        const code = data.readUInt16BE(0, true);

        if (!ErrorCodes.isValidErrorCode(code)) {
          this.error(new Error(`invalid status code: ${code}`), 1002);
          return;
        }

        const buf = data.slice(2);

        if (!isValidUTF8(buf)) {
          this.error(new Error('invalid utf8 sequence'), 1007);
          return;
        }

        this.onclose(code, buf.toString());
        this._loop = false;
        this.cleanup(this._cleanupCallback);
      }

      return;
    }

    if (this._opcode === 0x09) this.onping(data);
    else this.onpong(data);

    this._state = GET_INFO;
  }

  /**
   * Handles an error.
   *
   * @param {Error} err The error
   * @param {Number} code Close code
   * @private
   */
  error (err, code) {
    this.onerror(err, code);
    this._hadError = true;
    this._loop = false;
    this.cleanup(this._cleanupCallback);
  }

  /**
   * Checks payload size, disconnects socket when it exceeds `maxPayload`.
   *
   * @param {Number} length Payload length
   * @private
   */
  maxPayloadExceeded (length) {
    if (length === 0 || this._maxPayload < 1) return false;

    const fullLength = this._totalPayloadLength + length;

    if (fullLength <= this._maxPayload) {
      this._totalPayloadLength = fullLength;
      return false;
    }

    this.error(new Error('max payload size exceeded'), 1009);
    return true;
  }

  /**
   * Appends a fragment in the fragments array after checking that the sum of
   * fragment lengths does not exceed `maxPayload`.
   *
   * @param {Buffer} fragment The fragment to add
   * @return {Boolean} `true` if `maxPayload` is not exceeded, else `false`
   * @private
   */
  pushFragment (fragment) {
    if (fragment.length === 0) return true;

    const totalLength = this._messageLength + fragment.length;

    if (this._maxPayload < 1 || totalLength <= this._maxPayload) {
      this._messageLength = totalLength;
      this._fragments.push(fragment);
      return true;
    }

    this.error(new Error('max payload size exceeded'), 1009);
    return false;
  }

  /**
   * Releases resources used by the receiver.
   *
   * @param {Function} cb Callback
   * @public
   */
  cleanup (cb) {
    this._dead = true;

    if (!this._hadError && (this._loop || this._state === INFLATING)) {
      this._cleanupCallback = cb;
    } else {
      this._extensions = null;
      this._fragments = null;
      this._buffers = null;
      this._mask = null;

      this._cleanupCallback = null;
      this.onmessage = null;
      this.onclose = null;
      this.onerror = null;
      this.onping = null;
      this.onpong = null;

      if (cb) cb();
    }
  }
}

module.exports = Receiver;

/**
 * Makes a buffer from a list of fragments.
 *
 * @param {Buffer[]} fragments The list of fragments composing the message
 * @param {Number} messageLength The length of the message
 * @return {Buffer}
 * @private
 */
function toBuffer (fragments, messageLength) {
  if (fragments.length === 1) return fragments[0];
  if (fragments.length > 1) return bufferUtil.concat(fragments, messageLength);
  return constants.EMPTY_BUFFER;
}

/**
 * Converts a buffer to an `ArrayBuffer`.
 *
 * @param {Buffer} The buffer to convert
 * @return {ArrayBuffer} Converted buffer
 */
function toArrayBuffer (buf) {
  if (buf.byteOffset === 0 && buf.byteLength === buf.buffer.byteLength) {
    return buf.buffer;
  }

  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */



module.exports = {
  isValidErrorCode: function (code) {
    return (code >= 1000 && code <= 1013 && code !== 1004 && code !== 1005 && code !== 1006) ||
      (code >= 3000 && code <= 4999);
  },
  1000: 'normal',
  1001: 'going away',
  1002: 'protocol error',
  1003: 'unsupported data',
  1004: 'reserved',
  1005: 'reserved for extensions',
  1006: 'reserved for extensions',
  1007: 'inconsistent or invalid data',
  1008: 'policy violation',
  1009: 'message too big',
  1010: 'extension handshake missing',
  1011: 'an unexpected condition prevented the request from being fulfilled',
  1012: 'service restart',
  1013: 'try again later'
};


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */



const safeBuffer = __webpack_require__(89);
const crypto = __webpack_require__(14);

const PerMessageDeflate = __webpack_require__(91);
const bufferUtil = __webpack_require__(96);
const ErrorCodes = __webpack_require__(112);

const Buffer = safeBuffer.Buffer;

/**
 * HyBi Sender implementation.
 */
class Sender {
  /**
   * Creates a Sender instance.
   *
   * @param {net.Socket} socket The connection socket
   * @param {Object} extensions An object containing the negotiated extensions
   */
  constructor (socket, extensions) {
    this._extensions = extensions || {};
    this._socket = socket;

    this._firstFragment = true;
    this._compress = false;

    this._bufferedBytes = 0;
    this._deflating = false;
    this._queue = [];
  }

  /**
   * Frames a piece of data according to the HyBi WebSocket protocol.
   *
   * @param {Buffer} data The data to frame
   * @param {Object} options Options object
   * @param {Number} options.opcode The opcode
   * @param {Boolean} options.readOnly Specifies whether `data` can be modified
   * @param {Boolean} options.fin Specifies whether or not to set the FIN bit
   * @param {Boolean} options.mask Specifies whether or not to mask `data`
   * @param {Boolean} options.rsv1 Specifies whether or not to set the RSV1 bit
   * @return {Buffer[]} The framed data as a list of `Buffer` instances
   * @public
   */
  static frame (data, options) {
    const merge = data.length < 1024 || (options.mask && options.readOnly);
    var offset = options.mask ? 6 : 2;
    var payloadLength = data.length;

    if (data.length >= 65536) {
      offset += 8;
      payloadLength = 127;
    } else if (data.length > 125) {
      offset += 2;
      payloadLength = 126;
    }

    const target = Buffer.allocUnsafe(merge ? data.length + offset : offset);

    target[0] = options.fin ? options.opcode | 0x80 : options.opcode;
    if (options.rsv1) target[0] |= 0x40;

    if (payloadLength === 126) {
      target.writeUInt16BE(data.length, 2, true);
    } else if (payloadLength === 127) {
      target.writeUInt32BE(0, 2, true);
      target.writeUInt32BE(data.length, 6, true);
    }

    if (!options.mask) {
      target[1] = payloadLength;
      if (merge) {
        data.copy(target, offset);
        return [target];
      }

      return [target, data];
    }

    const mask = crypto.randomBytes(4);

    target[1] = payloadLength | 0x80;
    target[offset - 4] = mask[0];
    target[offset - 3] = mask[1];
    target[offset - 2] = mask[2];
    target[offset - 1] = mask[3];

    if (merge) {
      bufferUtil.mask(data, mask, target, offset, data.length);
      return [target];
    }

    bufferUtil.mask(data, mask, data, 0, data.length);
    return [target, data];
  }

  /**
   * Sends a close message to the other peer.
   *
   * @param {(Number|undefined)} code The status code component of the body
   * @param {String} data The message component of the body
   * @param {Boolean} mask Specifies whether or not to mask the message
   * @param {Function} cb Callback
   * @public
   */
  close (code, data, mask, cb) {
    if (code !== undefined && (typeof code !== 'number' || !ErrorCodes.isValidErrorCode(code))) {
      throw new Error('first argument must be a valid error code number');
    }

    const buf = Buffer.allocUnsafe(2 + (data ? Buffer.byteLength(data) : 0));

    buf.writeUInt16BE(code || 1000, 0, true);
    if (buf.length > 2) buf.write(data, 2);

    if (this._deflating) {
      this.enqueue([this.doClose, buf, mask, cb]);
    } else {
      this.doClose(buf, mask, cb);
    }
  }

  /**
   * Frames and sends a close message.
   *
   * @param {Buffer} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @param {Function} cb Callback
   * @private
   */
  doClose (data, mask, cb) {
    this.sendFrame(Sender.frame(data, {
      fin: true,
      rsv1: false,
      opcode: 0x08,
      mask,
      readOnly: false
    }), cb);
  }

  /**
   * Sends a ping message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @public
   */
  ping (data, mask) {
    var readOnly = true;

    if (!Buffer.isBuffer(data)) {
      if (data instanceof ArrayBuffer) {
        data = Buffer.from(data);
      } else if (ArrayBuffer.isView(data)) {
        data = viewToBuffer(data);
      } else {
        data = Buffer.from(data);
        readOnly = false;
      }
    }

    if (this._deflating) {
      this.enqueue([this.doPing, data, mask, readOnly]);
    } else {
      this.doPing(data, mask, readOnly);
    }
  }

  /**
   * Frames and sends a ping message.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @param {Boolean} readOnly Specifies whether `data` can be modified
   * @private
   */
  doPing (data, mask, readOnly) {
    this.sendFrame(Sender.frame(data, {
      fin: true,
      rsv1: false,
      opcode: 0x09,
      mask,
      readOnly
    }));
  }

  /**
   * Sends a pong message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @public
   */
  pong (data, mask) {
    var readOnly = true;

    if (!Buffer.isBuffer(data)) {
      if (data instanceof ArrayBuffer) {
        data = Buffer.from(data);
      } else if (ArrayBuffer.isView(data)) {
        data = viewToBuffer(data);
      } else {
        data = Buffer.from(data);
        readOnly = false;
      }
    }

    if (this._deflating) {
      this.enqueue([this.doPong, data, mask, readOnly]);
    } else {
      this.doPong(data, mask, readOnly);
    }
  }

  /**
   * Frames and sends a pong message.
   *
   * @param {*} data The message to send
   * @param {Boolean} mask Specifies whether or not to mask `data`
   * @param {Boolean} readOnly Specifies whether `data` can be modified
   * @private
   */
  doPong (data, mask, readOnly) {
    this.sendFrame(Sender.frame(data, {
      fin: true,
      rsv1: false,
      opcode: 0x0a,
      mask,
      readOnly
    }));
  }

  /**
   * Sends a data message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Object} options Options object
   * @param {Boolean} options.compress Specifies whether or not to compress `data`
   * @param {Boolean} options.binary Specifies whether `data` is binary or text
   * @param {Boolean} options.fin Specifies whether the fragment is the last one
   * @param {Boolean} options.mask Specifies whether or not to mask `data`
   * @param {Function} cb Callback
   * @public
   */
  send (data, options, cb) {
    var opcode = options.binary ? 2 : 1;
    var rsv1 = options.compress;
    var readOnly = true;

    if (!Buffer.isBuffer(data)) {
      if (data instanceof ArrayBuffer) {
        data = Buffer.from(data);
      } else if (ArrayBuffer.isView(data)) {
        data = viewToBuffer(data);
      } else {
        data = Buffer.from(data);
        readOnly = false;
      }
    }

    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];

    if (this._firstFragment) {
      this._firstFragment = false;
      if (rsv1 && perMessageDeflate) {
        rsv1 = data.length >= perMessageDeflate._threshold;
      }
      this._compress = rsv1;
    } else {
      rsv1 = false;
      opcode = 0;
    }

    if (options.fin) this._firstFragment = true;

    if (perMessageDeflate) {
      const opts = {
        fin: options.fin,
        rsv1,
        opcode,
        mask: options.mask,
        readOnly
      };

      if (this._deflating) {
        this.enqueue([this.dispatch, data, this._compress, opts, cb]);
      } else {
        this.dispatch(data, this._compress, opts, cb);
      }
    } else {
      this.sendFrame(Sender.frame(data, {
        fin: options.fin,
        rsv1: false,
        opcode,
        mask: options.mask,
        readOnly
      }), cb);
    }
  }

  /**
   * Dispatches a data message.
   *
   * @param {Buffer} data The message to send
   * @param {Boolean} compress Specifies whether or not to compress `data`
   * @param {Object} options Options object
   * @param {Number} options.opcode The opcode
   * @param {Boolean} options.readOnly Specifies whether `data` can be modified
   * @param {Boolean} options.fin Specifies whether or not to set the FIN bit
   * @param {Boolean} options.mask Specifies whether or not to mask `data`
   * @param {Boolean} options.rsv1 Specifies whether or not to set the RSV1 bit
   * @param {Function} cb Callback
   * @private
   */
  dispatch (data, compress, options, cb) {
    if (!compress) {
      this.sendFrame(Sender.frame(data, options), cb);
      return;
    }

    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];

    this._deflating = true;
    perMessageDeflate.compress(data, options.fin, (_, buf) => {
      options.readOnly = false;
      this.sendFrame(Sender.frame(buf, options), cb);
      this._deflating = false;
      this.dequeue();
    });
  }

  /**
   * Executes queued send operations.
   *
   * @private
   */
  dequeue () {
    while (!this._deflating && this._queue.length) {
      const params = this._queue.shift();

      this._bufferedBytes -= params[1].length;
      params[0].apply(this, params.slice(1));
    }
  }

  /**
   * Enqueues a send operation.
   *
   * @param {Array} params Send operation parameters.
   * @private
   */
  enqueue (params) {
    this._bufferedBytes += params[1].length;
    this._queue.push(params);
  }

  /**
   * Sends a frame.
   *
   * @param {Buffer[]} list The frame to send
   * @param {Function} cb Callback
   * @private
   */
  sendFrame (list, cb) {
    if (list.length === 2) {
      this._socket.write(list[0]);
      this._socket.write(list[1], cb);
    } else {
      this._socket.write(list[0], cb);
    }
  }
}

module.exports = Sender;

/**
 * Converts an `ArrayBuffer` view into a buffer.
 *
 * @param {(DataView|TypedArray)} view The view to convert
 * @return {Buffer} Converted view
 * @private
 */
function viewToBuffer (view) {
  const buf = Buffer.from(view.buffer);

  if (view.byteLength !== view.buffer.byteLength) {
    return buf.slice(view.byteOffset, view.byteOffset + view.byteLength);
  }

  return buf;
}


/***/ }),
/* 114 */
/***/ (function(module, exports) {

throw new Error("Module parse failed: Unexpected token (208:25)\nYou may need an appropriate loader to handle this file type.\n| function createMessageInstanceIdFn(filename, fileStrings) {\n|   /** @type {Record<string, string>} */\n|   const mergedStrings = {...UIStrings, ...fileStrings};\n| \n|   /** @param {string} icuMessage @param {*} [values] */");

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */


const statistics = __webpack_require__(148);
const Util = __webpack_require__(116);

const DEFAULT_PASS = 'defaultPass';

/**
 * Clamp figure to 2 decimal places
 * @param {number} val
 * @return {number}
 */
const clampTo2Decimals = val => Math.round(val * 100) / 100;

class Audit {
  /**
   * @return {string}
   */
  static get DEFAULT_PASS() {
    return DEFAULT_PASS;
  }

  /**
   * @return {LH.Audit.ScoreDisplayModes}
   */
  static get SCORING_MODES() {
    return {
      NUMERIC: 'numeric',
      BINARY: 'binary',
      MANUAL: 'manual',
      INFORMATIVE: 'informative',
      NOT_APPLICABLE: 'not-applicable',
      ERROR: 'error',
    };
  }

  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    throw new Error('Audit meta information must be overridden.');
  }

  /**
   * @return {Object}
   */
  static get defaultOptions() {
    return {};
  }

  /* eslint-disable no-unused-vars */

  /**
   *
   * @param {LH.Artifacts} artifacts
   * @param {LH.Audit.Context} context
   * @return {LH.Audit.Product|Promise<LH.Audit.Product>}
   */
  static audit(artifacts, context) {
    throw new Error('audit() method must be overriden');
  }

  /* eslint-enable no-unused-vars */

  /**
   * Computes a clamped score between 0 and 1 based on the measured value. Score is determined by
   * considering a log-normal distribution governed by the two control points, point of diminishing
   * returns and the median value, and returning the percentage of sites that have higher value.
   *
   * @param {number} measuredValue
   * @param {number} diminishingReturnsValue
   * @param {number} medianValue
   * @return {number}
   */
  static computeLogNormalScore(measuredValue, diminishingReturnsValue, medianValue) {
    const distribution = statistics.getLogNormalDistribution(
      medianValue,
      diminishingReturnsValue
    );

    let score = distribution.computeComplementaryPercentile(measuredValue);
    score = Math.min(1, score);
    score = Math.max(0, score);
    return clampTo2Decimals(score);
  }

  /**
   * @param {typeof Audit} audit
   * @param {string} errorMessage
   * @return {LH.Audit.Result}
   */
  static generateErrorAuditResult(audit, errorMessage) {
    return Audit.generateAuditResult(audit, {
      rawValue: null,
      errorMessage,
    });
  }

  /**
   * @param {Array<LH.Audit.Heading>} headings
   * @param {Array<Object<string, LH.Audit.DetailsItem>>} results
   * @param {LH.Audit.DetailsRendererDetailsSummary=} summary
   * @return {LH.Audit.DetailsRendererDetailsJSON}
   */
  static makeTableDetails(headings, results, summary) {
    if (results.length === 0) {
      return {
        type: 'table',
        headings: [],
        items: [],
        summary,
      };
    }

    return {
      type: 'table',
      headings: headings,
      items: results,
      summary,
    };
  }

  /**
   * @param {Array<LH.ResultLite.Audit.ColumnHeading>} headings
   * @param {Array<LH.ResultLite.Audit.WastedBytesDetailsItem>|Array<LH.ResultLite.Audit.WastedTimeDetailsItem>} items
   * @param {number} overallSavingsMs
   * @param {number=} overallSavingsBytes
   * @return {LH.Result.Audit.OpportunityDetails}
   */
  static makeOpportunityDetails(headings, items, overallSavingsMs, overallSavingsBytes) {
    return {
      type: 'opportunity',
      headings: items.length === 0 ? [] : headings,
      items,
      overallSavingsMs,
      overallSavingsBytes,
    };
  }

  /**
   * @param {typeof Audit} audit
   * @param {LH.Audit.Product} result
   * @return {{score: number|null, scoreDisplayMode: LH.Audit.ScoreDisplayMode}}
   */
  static _normalizeAuditScore(audit, result) {
    // Cast true/false to 1/0
    let score = result.score === undefined ? Number(result.rawValue) : result.score;

    if (!Number.isFinite(score)) throw new Error(`Invalid score: ${score}`);
    if (score > 1) throw new Error(`Audit score for ${audit.meta.id} is > 1`);
    if (score < 0) throw new Error(`Audit score for ${audit.meta.id} is < 0`);

    score = clampTo2Decimals(score);

    const scoreDisplayMode = audit.meta.scoreDisplayMode || Audit.SCORING_MODES.BINARY;

    return {
      score,
      scoreDisplayMode,
    };
  }

  /**
   * @param {typeof Audit} audit
   * @param {LH.Audit.Product} result
   * @return {LH.Audit.Result}
   */
  static generateAuditResult(audit, result) {
    if (typeof result.rawValue === 'undefined') {
      throw new Error('generateAuditResult requires a rawValue');
    }

    // TODO(bckenny): cleanup the flow of notApplicable/error/binary/numeric
    let {score, scoreDisplayMode} = Audit._normalizeAuditScore(audit, result);

    // If the audit was determined to not apply to the page, set score display mode appropriately
    if (result.notApplicable) {
      scoreDisplayMode = Audit.SCORING_MODES.NOT_APPLICABLE;
      result.rawValue = true;
    }

    if (result.errorMessage) {
      scoreDisplayMode = Audit.SCORING_MODES.ERROR;
    }

    let auditTitle = audit.meta.title;
    if (audit.meta.failureTitle) {
      if (Number(score) < Util.PASS_THRESHOLD) {
        auditTitle = audit.meta.failureTitle;
      }
    }

    if (scoreDisplayMode !== Audit.SCORING_MODES.BINARY &&
        scoreDisplayMode !== Audit.SCORING_MODES.NUMERIC) {
      score = null;
    }

    return {
      id: audit.meta.id,
      title: auditTitle,
      description: audit.meta.description,

      score,
      scoreDisplayMode,
      rawValue: result.rawValue,

      displayValue: result.displayValue,
      explanation: result.explanation,
      errorMessage: result.errorMessage,
      warnings: result.warnings,

      details: result.details,
    };
  }
}

module.exports = Audit;


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/* globals self URL */

const ELLIPSIS = '\u2026';
const NBSP = '\xa0';
const PASS_THRESHOLD = 0.9;

const RATINGS = {
  PASS: {label: 'pass', minScore: PASS_THRESHOLD},
  AVERAGE: {label: 'average', minScore: 0.5},
  FAIL: {label: 'fail'},
  ERROR: {label: 'error'},
};

class Util {
  static get PASS_THRESHOLD() {
    return PASS_THRESHOLD;
  }

  static get MS_DISPLAY_VALUE() {
    return `%10d${NBSP}ms`;
  }

  /**
   * Returns a new LHR that's reshaped for slightly better ergonomics within the report rendereer.
   * Also, sets up the localized UI strings used within renderer and number/date formatting
   * The LHR passed in is not mutated.
   * TODO(team): we all agree the LHR shape change is technical debt we should fix
   * @param {LH.Result} result
   * @return {LH.ReportResult}
   */
  static prepareReportResult(result) {
    // If any mutations happen to the report within the renderers, we want the original object untouched
    const clone = /** @type {LH.ReportResult} */ (JSON.parse(JSON.stringify(result)));

    // If LHR is older (≤3.0.3), it has no locale setting. Set default.
    if (!clone.configSettings.locale) {
      clone.configSettings.locale = 'en';
    }
    Util.setNumberDateLocale(clone.configSettings.locale);
    if (clone.i18n && clone.i18n.rendererFormattedStrings) {
      Util.updateAllUIStrings(clone.i18n.rendererFormattedStrings);
    }

    if (typeof clone.categories !== 'object') throw new Error('No categories provided.');
    clone.reportCategories = Object.values(clone.categories);

    // For convenience, smoosh all AuditResults into their auditDfn (which has just weight & group)
    for (const category of clone.reportCategories) {
      category.auditRefs.forEach(auditMeta => {
        const result = clone.audits[auditMeta.id];
        auditMeta.result = result;
      });
    }

    return clone;
  }


  /**
   * @param {LH.I18NRendererStrings} rendererFormattedStrings
   */
  static updateAllUIStrings(rendererFormattedStrings) {
    // TODO(i18n): don't mutate these here but on the LHR and pass that around everywhere
    for (const [key, value] of Object.entries(rendererFormattedStrings)) {
      Util.UIStrings[key] = value;
    }
  }

  /**
   * @param {string|Array<string|number>=} displayValue
   * @return {string}
   */
  static formatDisplayValue(displayValue) {
    if (typeof displayValue === 'string') return displayValue;
    if (!displayValue) return '';

    const replacementRegex = /%([0-9]*(\.[0-9]+)?d|s)/;
    const template = /** @type {string} */ (displayValue[0]);
    if (typeof template !== 'string') {
      // First value should always be the format string, but we don't want to fail to build
      // a report, return a placeholder.
      return 'UNKNOWN';
    }

    let output = template;
    for (const replacement of displayValue.slice(1)) {
      if (!replacementRegex.test(output)) {
        // eslint-disable-next-line no-console
        console.warn('Too many replacements given');
        break;
      }

      output = output.replace(replacementRegex, match => {
        const granularity = Number(match.match(/[0-9.]+/)) || 1;
        return match === '%s' ?
          replacement.toLocaleString() :
          (Math.round(Number(replacement) / granularity) * granularity).toLocaleString();
      });
    }

    if (replacementRegex.test(output)) {
      // eslint-disable-next-line no-console
      console.warn('Not enough replacements given');
    }

    return output;
  }

  /**
   * Used to determine if the "passed" for the purposes of showing up in the "failed" or "passed"
   * sections of the report.
   *
   * @param {{score: (number|null), scoreDisplayMode: string}} audit
   * @return {boolean}
   */
  static showAsPassed(audit) {
    switch (audit.scoreDisplayMode) {
      case 'manual':
      case 'not-applicable':
        return true;
      case 'error':
      case 'informative':
        return false;
      case 'numeric':
      case 'binary':
      default:
        return Number(audit.score) >= RATINGS.PASS.minScore;
    }
  }

  /**
   * Convert a score to a rating label.
   * @param {number|null} score
   * @param {string=} scoreDisplayMode
   * @return {string}
   */
  static calculateRating(score, scoreDisplayMode) {
    // Handle edge cases first, manual and not applicable receive 'pass', errored audits receive 'error'
    if (scoreDisplayMode === 'manual' || scoreDisplayMode === 'not-applicable') {
      return RATINGS.PASS.label;
    } else if (scoreDisplayMode === 'error') {
      return RATINGS.ERROR.label;
    } else if (score === null) {
      return RATINGS.FAIL.label;
    }

    // At this point, we're rating a standard binary/numeric audit
    let rating = RATINGS.FAIL.label;
    if (score >= RATINGS.PASS.minScore) {
      rating = RATINGS.PASS.label;
    } else if (score >= RATINGS.AVERAGE.minScore) {
      rating = RATINGS.AVERAGE.label;
    }
    return rating;
  }

  /**
   * Format number.
   * @param {number} number
   * @param {number=} granularity Number of decimal places to include. Defaults to 0.1.
   * @return {string}
   */
  static formatNumber(number, granularity = 0.1) {
    const coarseValue = Math.round(number / granularity) * granularity;
    return coarseValue.toLocaleString(Util.numberDateLocale);
  }

  /**
   * @param {number} size
   * @param {number=} granularity Controls how coarse the displayed value is, defaults to .01
   * @return {string}
   */
  static formatBytesToKB(size, granularity = 0.1) {
    const kbs = (Math.round(size / 1024 / granularity) * granularity)
      .toLocaleString(Util.numberDateLocale);
    return `${kbs}${NBSP}KB`;
  }

  /**
   * @param {number} ms
   * @param {number=} granularity Controls how coarse the displayed value is, defaults to 10
   * @return {string}
   */
  static formatMilliseconds(ms, granularity = 10) {
    const coarseTime = Math.round(ms / granularity) * granularity;
    return `${coarseTime.toLocaleString(Util.numberDateLocale)}${NBSP}ms`;
  }

  /**
   * @param {number} ms
   * @param {number=} granularity Controls how coarse the displayed value is, defaults to 0.1
   * @return {string}
   */
  static formatSeconds(ms, granularity = 0.1) {
    const coarseTime = Math.round(ms / 1000 / granularity) * granularity;
    return `${coarseTime.toLocaleString(Util.numberDateLocale)}${NBSP}s`;
  }

  /**
   * Format time.
   * @param {string} date
   * @return {string}
   */
  static formatDateTime(date) {
    /** @type {Intl.DateTimeFormatOptions} */
    const options = {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: 'numeric', timeZoneName: 'short',
    };
    let formatter = new Intl.DateTimeFormat(Util.numberDateLocale, options);

    // Force UTC if runtime timezone could not be detected.
    // See https://github.com/GoogleChrome/lighthouse/issues/1056
    const tz = formatter.resolvedOptions().timeZone;
    if (!tz || tz.toLowerCase() === 'etc/unknown') {
      options.timeZone = 'UTC';
      formatter = new Intl.DateTimeFormat(Util.numberDateLocale, options);
    }
    return formatter.format(new Date(date));
  }
  /**
   * Converts a time in milliseconds into a duration string, i.e. `1d 2h 13m 52s`
   * @param {number} timeInMilliseconds
   * @return {string}
   */
  static formatDuration(timeInMilliseconds) {
    let timeInSeconds = timeInMilliseconds / 1000;
    if (Math.round(timeInSeconds) === 0) {
      return 'None';
    }

    /** @type {Array<string>} */
    const parts = [];
    const unitLabels = /** @type {Object<string, number>} */ ({
      d: 60 * 60 * 24,
      h: 60 * 60,
      m: 60,
      s: 1,
    });

    Object.keys(unitLabels).forEach(label => {
      const unit = unitLabels[label];
      const numberOfUnits = Math.floor(timeInSeconds / unit);
      if (numberOfUnits > 0) {
        timeInSeconds -= numberOfUnits * unit;
        parts.push(`${numberOfUnits}\xa0${label}`);
      }
    });

    return parts.join(' ');
  }

  /**
   * @param {URL} parsedUrl
   * @param {{numPathParts?: number, preserveQuery?: boolean, preserveHost?: boolean}=} options
   * @return {string}
   */
  static getURLDisplayName(parsedUrl, options) {
    // Closure optional properties aren't optional in tsc, so fallback needs undefined  values.
    options = options || {numPathParts: undefined, preserveQuery: undefined,
      preserveHost: undefined};
    const numPathParts = options.numPathParts !== undefined ? options.numPathParts : 2;
    const preserveQuery = options.preserveQuery !== undefined ? options.preserveQuery : true;
    const preserveHost = options.preserveHost || false;

    let name;

    if (parsedUrl.protocol === 'about:' || parsedUrl.protocol === 'data:') {
      // Handle 'about:*' and 'data:*' URLs specially since they have no path.
      name = parsedUrl.href;
    } else {
      name = parsedUrl.pathname;
      const parts = name.split('/').filter(part => part.length);
      if (numPathParts && parts.length > numPathParts) {
        name = ELLIPSIS + parts.slice(-1 * numPathParts).join('/');
      }

      if (preserveHost) {
        name = `${parsedUrl.host}/${name.replace(/^\//, '')}`;
      }
      if (preserveQuery) {
        name = `${name}${parsedUrl.search}`;
      }
    }

    const MAX_LENGTH = 64;
    // Always elide hexadecimal hash
    name = name.replace(/([a-f0-9]{7})[a-f0-9]{13}[a-f0-9]*/g, `$1${ELLIPSIS}`);
    // Also elide other hash-like mixed-case strings
    name = name.replace(/([a-zA-Z0-9-_]{9})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9-_]{10,}/g,
      `$1${ELLIPSIS}`);
    // Also elide long number sequences
    name = name.replace(/(\d{3})\d{6,}/g, `$1${ELLIPSIS}`);
    // Merge any adjacent ellipses
    name = name.replace(/\u2026+/g, ELLIPSIS);

    // Elide query params first
    if (name.length > MAX_LENGTH && name.includes('?')) {
      // Try to leave the first query parameter intact
      name = name.replace(/\?([^=]*)(=)?.*/, `?$1$2${ELLIPSIS}`);

      // Remove it all if it's still too long
      if (name.length > MAX_LENGTH) {
        name = name.replace(/\?.*/, `?${ELLIPSIS}`);
      }
    }

    // Elide too long names next
    if (name.length > MAX_LENGTH) {
      const dotIndex = name.lastIndexOf('.');
      if (dotIndex >= 0) {
        name = name.slice(0, MAX_LENGTH - 1 - (name.length - dotIndex)) +
          // Show file extension
          `${ELLIPSIS}${name.slice(dotIndex)}`;
      } else {
        name = name.slice(0, MAX_LENGTH - 1) + ELLIPSIS;
      }
    }

    return name;
  }

  /**
   * Split a URL into a file, hostname and origin for easy display.
   * @param {string} url
   * @return {{file: string, hostname: string, origin: string}}
   */
  static parseURL(url) {
    const parsedUrl = new URL(url);
    return {
      file: Util.getURLDisplayName(parsedUrl),
      hostname: parsedUrl.hostname,
      origin: parsedUrl.origin,
    };
  }

  /**
   * @param {LH.Config.Settings} settings
   * @return {Array<{name: string, description: string}>}
   */
  static getEnvironmentDisplayValues(settings) {
    const emulationDesc = Util.getEmulationDescriptions(settings);

    return [
      {
        name: 'Device',
        description: emulationDesc.deviceEmulation,
      },
      {
        name: 'Network throttling',
        description: emulationDesc.networkThrottling,
      },
      {
        name: 'CPU throttling',
        description: emulationDesc.cpuThrottling,
      },
    ];
  }

  /**
   * @param {LH.Config.Settings} settings
   * @return {{deviceEmulation: string, networkThrottling: string, cpuThrottling: string, summary: string}}
   */
  static getEmulationDescriptions(settings) {
    let cpuThrottling;
    let networkThrottling;
    let summary;

    const throttling = settings.throttling;

    switch (settings.throttlingMethod) {
      case 'provided':
        cpuThrottling = 'Provided by environment';
        networkThrottling = 'Provided by environment';
        summary = 'No throttling applied';
        break;
      case 'devtools': {
        const {cpuSlowdownMultiplier, requestLatencyMs} = throttling;
        cpuThrottling = `${Util.formatNumber(cpuSlowdownMultiplier)}x slowdown (DevTools)`;
        networkThrottling = `${Util.formatNumber(requestLatencyMs)}${NBSP}ms HTTP RTT, ` +
          `${Util.formatNumber(throttling.downloadThroughputKbps)}${NBSP}Kbps down, ` +
          `${Util.formatNumber(throttling.uploadThroughputKbps)}${NBSP}Kbps up (DevTools)`;
        summary = 'Throttled Fast 3G network';
        break;
      }
      case 'simulate': {
        const {cpuSlowdownMultiplier, rttMs, throughputKbps} = throttling;
        cpuThrottling = `${Util.formatNumber(cpuSlowdownMultiplier)}x slowdown (Simulated)`;
        networkThrottling = `${Util.formatNumber(rttMs)}${NBSP}ms TCP RTT, ` +
          `${Util.formatNumber(throughputKbps)}${NBSP}Kbps throughput (Simulated)`;
        summary = 'Simulated Fast 3G network';
        break;
      }
      default:
        cpuThrottling = 'Unknown';
        networkThrottling = 'Unknown';
        summary = 'Unknown';
    }

    let deviceEmulation = 'No emulation';
    if (!settings.disableDeviceEmulation) {
      if (settings.emulatedFormFactor === 'mobile') deviceEmulation = 'Emulated Nexus 5X';
      if (settings.emulatedFormFactor === 'desktop') deviceEmulation = 'Emulated Desktop';
    }

    return {
      deviceEmulation,
      cpuThrottling,
      networkThrottling,
      summary: `${deviceEmulation}, ${summary}`,
    };
  }

  /**
   * Set the locale to be used for Util's number and date formatting functions.
   * @param {LH.Locale} locale
   */
  static setNumberDateLocale(locale) {
    Util.numberDateLocale = locale;

    // When testing, use a locale with more exciting numeric formatting
    if (Util.numberDateLocale === 'en-XA') Util.numberDateLocale = 'de';
  }
}

/**
 * This value is updated on each run to the locale of the report
 * @type {LH.Locale}
 */
Util.numberDateLocale = 'en';

/**
 * Report-renderer-specific strings.
 * @type {LH.I18NRendererStrings}
 */
Util.UIStrings = {
  /** Disclaimer shown to users below the metric values (First Contentful Paint, Time to Interactive, etc) to warn them that the numbers they see will likely change slightly the next time they run Lighthouse. */
  varianceDisclaimer: 'Values are estimated and may vary.',
  /** Column heading label for the listing of opportunity audits. Each audit title represents an opportunity. There are only 2 columns, so no strict character limit.  */
  opportunityResourceColumnLabel: 'Opportunity',
  /** Column heading label for the estimated page load savings of opportunity audits. Estimated Savings is the total amount of time (in seconds) that Lighthouse computed could be reduced from the total page load time, if the suggested action is taken. There are only 2 columns, so no strict character limit. */
  opportunitySavingsColumnLabel: 'Estimated Savings',

  /** An error string displayed next to a particular audit when it has errored, but not provided any specific error message. */
  errorMissingAuditInfo: 'Report error: no audit information',
  /** A label, shown next to an audit title or metric title, indicating that there was an error computing it. The user can hover on the label to reveal a tooltip with the extended error message. Translation should be short (< 20 characters). */
  errorLabel: 'Error!',
  /** This label is shown above a bulleted list of warnings. It is shown directly below an audit that produced warnings. Warnings describe situations the user should be aware of, as Lighthouse was unable to complete all the work required on this audit. For example, The 'Unable to decode image (biglogo.jpg)' warning may show up below an image encoding audit. */
  warningHeader: 'Warnings: ',
  /** The tooltip text on an expandable chevron icon. Clicking the icon expands a section to reveal a list of audit results that was hidden by default. */
  auditGroupExpandTooltip: 'Show audits',
  /** Section heading shown above a list of audits that are passing. 'Passed' here refers to a passing grade. This section is collapsed by default, as the user should be focusing on the failed audits instead. Users can click this heading to reveal the list. */
  passedAuditsGroupTitle: 'Passed audits',
  /** Section heading shown above a list of audits that do not apply to the page. For example, if an audit is 'Are images optimized?', but the page has no images on it, the audit will be marked as not applicable. This is neither passing or failing. This section is collapsed by default, as the user should be focusing on the failed audits instead. Users can click this heading to reveal the list. */
  notApplicableAuditsGroupTitle: 'Not applicable',
  /** Section heading shown above a list of audits that were not computed by Lighthouse. They serve as a list of suggestions for the user to go and manually check. For example, Lighthouse can't automate testing cross-browser compatibility, so that is listed within this section, so the user is reminded to test it themselves. This section is collapsed by default, as the user should be focusing on the failed audits instead. Users can click this heading to reveal the list. */
  manualAuditsGroupTitle: 'Additional items to manually check',

  /** Label shown preceding any important warnings that may have invalidated the entire report. For example, if the user has Chrome extensions installed, they may add enough performance overhead that Lighthouse's performance metrics are unreliable. If shown, this will be displayed at the top of the report UI. */
  toplevelWarningsMessage: 'There were issues affecting this run of Lighthouse:',
  /** Label preceding a pictorial explanation of the scoring scale: 0-50 is red (bad), 50-90 is orange (ok), 90-100 is green (good). These colors are used throughout the report to provide context for how good/bad a particular result is. */
  scorescaleLabel: 'Score scale:',

  /** String of text shown in a graphical representation of the flow of network requests for the web page. This label represents the initial network request that fetches an HTML page. This navigation may be redirected (eg. Initial navigation to http://example.com redirects to https://www.example.com). */
  crcInitialNavigation: 'Initial Navigation',
  /** Label of value shown in the summary of critical request chains. Refers to the total amount of time (milliseconds) of the longest critical path chain/sequence of network requests. Example value: 2310 ms */
  crcLongestDurationLabel: 'Maximum critical path latency:',

  /** Explanation shown to users below performance results to inform them that the test was done with a 3G network connection and to warn them that the numbers they see will likely change slightly the next time they run Lighthouse. 'Lighthouse' becomes link text to additional documentation. */
  lsPerformanceCategoryDescription: '[Lighthouse](https://developers.google.com/web/tools/lighthouse/) analysis of the current page on emulated 3G. Values are estimated and may vary.',
  /** Title of the lab data section of the Performance category. Within this section are various speed metrics which quantify the pageload performance into values presented in seconds and milliseconds. "Lab" is an abbreviated form of "laboratory", and refers to the fact that the data is from a controlled test of a website, not measurements from real users visiting that site.  */
  labDataTitle: 'Lab Data',
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Util;
} else {
  self.Util = Util;
}


/***/ }),
/* 117 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 117;

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */


const NetworkRecorder = __webpack_require__(149);
const emulation = __webpack_require__(150);
const Element = __webpack_require__(151);
const LHError = __webpack_require__(95);
const NetworkRequest = __webpack_require__(152);
const EventEmitter = __webpack_require__(7).EventEmitter;
const URL = __webpack_require__(99);
const constants = __webpack_require__(98);

const log = __webpack_require__(87);
const DevtoolsLog = __webpack_require__(153);

const pageFunctions = __webpack_require__(154);

// Pulled in for Connection type checking.
// eslint-disable-next-line no-unused-vars
const Connection = __webpack_require__(107);

// Controls how long to wait after onLoad before continuing
const DEFAULT_PAUSE_AFTER_LOAD = 0;
// Controls how long to wait between network requests before determining the network is quiet
const DEFAULT_NETWORK_QUIET_THRESHOLD = 5000;
// Controls how long to wait between longtasks before determining the CPU is idle, off by default
const DEFAULT_CPU_QUIET_THRESHOLD = 0;

/**
 * @typedef {LH.Protocol.StrictEventEmitter<LH.CrdpEvents>} CrdpEventEmitter
 */

class Driver {
  /**
   * @param {Connection} connection
   */
  constructor(connection) {
    this._traceCategories = Driver.traceCategories;
    /**
     * An event emitter that enforces mapping between Crdp event names and payload types.
     */
    this._eventEmitter = /** @type {CrdpEventEmitter} */ (new EventEmitter());
    this._connection = connection;
    // currently only used by WPT where just Page and Network are needed
    this._devtoolsLog = new DevtoolsLog(/^(Page|Network)\./);
    this.online = true;
    /** @type {Map<string, number>} */
    this._domainEnabledCounts = new Map();
    /** @type {number|undefined} */
    this._isolatedExecutionContextId = undefined;

    /**
     * Used for monitoring network status events during gotoURL.
     * @type {?NetworkRecorder}
     * @private
     */
    this._networkStatusMonitor = null;

    /**
     * Used for monitoring url redirects during gotoURL.
     * @type {?string}
     * @private
     */
    this._monitoredUrl = null;

    connection.on('protocolevent', event => {
      this._devtoolsLog.record(event);
      if (this._networkStatusMonitor) {
        this._networkStatusMonitor.dispatch(event);
      }

      // @ts-ignore TODO(bckenny): tsc can't type event.params correctly yet,
      // typing as property of union instead of narrowing from union of
      // properties. See https://github.com/Microsoft/TypeScript/pull/22348.
      this._eventEmitter.emit(event.method, event.params);
    });
  }

  static get traceCategories() {
    return [
      '-*', // exclude default
      'toplevel',
      'v8.execute',
      'blink.console',
      'blink.user_timing',
      'benchmark',
      'loading',
      'latencyInfo',
      'devtools.timeline',
      'disabled-by-default-devtools.timeline',
      'disabled-by-default-devtools.timeline.frame',
      'disabled-by-default-devtools.timeline.stack',
      // Flipped off until bugs.chromium.org/p/v8/issues/detail?id=5820 is fixed in Stable
      // 'disabled-by-default-v8.cpu_profiler',
      // 'disabled-by-default-v8.cpu_profiler.hires',
      'disabled-by-default-devtools.screenshot',
    ];
  }

  /**
   * @return {Promise<string>}
   */
  getUserAgent() {
    // FIXME: use Browser.getVersion instead
    return this.evaluateAsync('navigator.userAgent');
  }

  /**
   * Computes the ULTRADUMB™ benchmark index to get a rough estimate of device class.
   * @return {Promise<number>}
   */
  getBenchmarkIndex() {
    return this.evaluateAsync(`(${pageFunctions.ultradumbBenchmarkString})()`);
  }

  /**
   * @return {Promise<void>}
   */
  connect() {
    return this._connection.connect();
  }

  /**
   * @return {Promise<void>}
   */
  disconnect() {
    return this._connection.disconnect();
  }

  /**
   * Get the browser WebSocket endpoint for devtools protocol clients like Puppeteer.
   * Only works with WebSocket connection, not extension or devtools.
   * @return {Promise<string>}
   */
  wsEndpoint() {
    return this._connection.wsEndpoint();
  }

  /**
   * Bind listeners for protocol events.
   * @template {keyof LH.CrdpEvents} E
   * @param {E} eventName
   * @param {(...args: LH.CrdpEvents[E]) => void} cb
   */
  on(eventName, cb) {
    if (this._eventEmitter === null) {
      throw new Error('connect() must be called before attempting to listen to events.');
    }

    // log event listeners being bound
    log.formatProtocol('listen for event =>', {method: eventName}, 'verbose');
    this._eventEmitter.on(eventName, cb);
  }

  /**
   * Bind a one-time listener for protocol events. Listener is removed once it
   * has been called.
   * @template {keyof LH.CrdpEvents} E
   * @param {E} eventName
   * @param {(...args: LH.CrdpEvents[E]) => void} cb
   */
  once(eventName, cb) {
    if (this._eventEmitter === null) {
      throw new Error('connect() must be called before attempting to listen to events.');
    }
    // log event listeners being bound
    log.formatProtocol('listen once for event =>', {method: eventName}, 'verbose');
    this._eventEmitter.once(eventName, cb);
  }

  /**
   * Unbind event listener.
   * @template {keyof LH.CrdpEvents} E
   * @param {E} eventName
   * @param {Function} cb
   */
  off(eventName, cb) {
    if (this._eventEmitter === null) {
      throw new Error('connect() must be called before attempting to remove an event listener.');
    }

    this._eventEmitter.removeListener(eventName, cb);
  }

  /**
   * Debounce enabling or disabling domains to prevent driver users from
   * stomping on each other. Maintains an internal count of the times a domain
   * has been enabled. Returns false if the command would have no effect (domain
   * is already enabled or disabled), or if command would interfere with another
   * user of that domain (e.g. two gatherers have enabled a domain, both need to
   * disable it for it to be disabled). Returns true otherwise.
   * @param {string} domain
   * @param {boolean} enable
   * @return {boolean}
   * @private
   */
  _shouldToggleDomain(domain, enable) {
    const enabledCount = this._domainEnabledCounts.get(domain) || 0;
    const newCount = enabledCount + (enable ? 1 : -1);
    this._domainEnabledCounts.set(domain, Math.max(0, newCount));

    // Switching to enabled or disabled, respectively.
    if ((enable && newCount === 1) || (!enable && newCount === 0)) {
      log.verbose('Driver', `${domain}.${enable ? 'enable' : 'disable'}`);
      return true;
    } else {
      if (newCount < 0) {
        log.error('Driver', `Attempted to disable domain '${domain}' when already disabled.`);
      }
      return false;
    }
  }

  /**
   * Call protocol methods.
   * @template {keyof LH.CrdpCommands} C
   * @param {C} method
   * @param {LH.CrdpCommands[C]['paramsType']} params,
   * @return {Promise<LH.CrdpCommands[C]['returnType']>}
   */
  sendCommand(method, ...params) {
    const domainCommand = /^(\w+)\.(enable|disable)$/.exec(method);
    if (domainCommand) {
      const enable = domainCommand[2] === 'enable';
      if (!this._shouldToggleDomain(domainCommand[1], enable)) {
        return Promise.resolve();
      }
    }

    return this._connection.sendCommand(method, ...params);
  }

  /**
   * Returns whether a domain is currently enabled.
   * @param {string} domain
   * @return {boolean}
   */
  isDomainEnabled(domain) {
    // Defined, non-zero elements of the domains map are enabled.
    return !!this._domainEnabledCounts.get(domain);
  }

  /**
   * Add a script to run at load time of all future page loads.
   * @param {string} scriptSource
   * @return {Promise<LH.Crdp.Page.AddScriptToEvaluateOnLoadResponse>} Identifier of the added script.
   */
  evaluateScriptOnNewDocument(scriptSource) {
    return this.sendCommand('Page.addScriptToEvaluateOnLoad', {
      scriptSource,
    });
  }

  /**
   * Evaluate an expression in the context of the current page. If useIsolation is true, the expression
   * will be evaluated in a content script that has access to the page's DOM but whose JavaScript state
   * is completely separate.
   * Returns a promise that resolves on the expression's value.
   * @param {string} expression
   * @param {{useIsolation?: boolean}=} options
   * @return {Promise<*>}
   */
  evaluateAsync(expression, options = {}) {
    // tsc won't convert {Promise<number>|Promise<undefined>}, so cast manually.
    // https://github.com/Microsoft/TypeScript/issues/7294
    /** @type {Promise<number|undefined>} */
    const contextIdPromise = options.useIsolation ?
        this._getOrCreateIsolatedContextId() :
        Promise.resolve(undefined);
    return contextIdPromise.then(contextId => this._evaluateInContext(expression, contextId));
  }

  /**
   * Evaluate an expression in the given execution context; an undefined contextId implies the main
   * page without isolation.
   * @param {string} expression
   * @param {number|undefined} contextId
   * @return {Promise<*>}
   */
  _evaluateInContext(expression, contextId) {
    return new Promise((resolve, reject) => {
      // If this gets to 60s and it hasn't been resolved, reject the Promise.
      const asyncTimeout = setTimeout(
        (_ => reject(new Error('The asynchronous expression exceeded the allotted time of 60s'))),
        60000
      );

      const evaluationParams = {
        // We need to explicitly wrap the raw expression for several purposes:
        // 1. Ensure that the expression will be a native Promise and not a polyfill/non-Promise.
        // 2. Ensure that errors in the expression are captured by the Promise.
        // 3. Ensure that errors captured in the Promise are converted into plain-old JS Objects
        //    so that they can be serialized properly b/c JSON.stringify(new Error('foo')) === '{}'
        expression: `(function wrapInNativePromise() {
          const __nativePromise = window.__nativePromise || Promise;
          const URL = window.__nativeURL || window.URL;
          return new __nativePromise(function (resolve) {
            return __nativePromise.resolve()
              .then(_ => ${expression})
              .catch(${pageFunctions.wrapRuntimeEvalErrorInBrowserString})
              .then(resolve);
          });
        }())`,
        includeCommandLineAPI: true,
        awaitPromise: true,
        returnByValue: true,
        contextId,
      };

      this.sendCommand('Runtime.evaluate', evaluationParams).then(response => {
        clearTimeout(asyncTimeout);

        if (response.exceptionDetails) {
          // An error occurred before we could even create a Promise, should be *very* rare
          return reject(new Error(`Evaluation exception: ${response.exceptionDetails.text}`));
        }

        // Protocol should always return a 'result' object, but it is sometimes undefined.  See #6026.
        if (response.result === undefined) {
          return reject(new Error('Runtime.evaluate response did not contain a "result" object'));
        }

        const value = response.result.value;

        if (value && value.__failedInBrowser) {
          return reject(Object.assign(new Error(), value));
        } else {
          resolve(value);
        }
      }).catch(err => {
        clearTimeout(asyncTimeout);
        reject(err);
      });
    });
  }

  /**
   * @return {Promise<{url: string, data: string}|null>}
   */
  getAppManifest() {
    return this.sendCommand('Page.getAppManifest')
      .then(response => {
        // We're not reading `response.errors` however it may contain critical and noncritical
        // errors from Blink's manifest parser:
        //   https://chromedevtools.github.io/debugger-protocol-viewer/tot/Page/#type-AppManifestError
        if (!response.data) {
          // If the data is empty, the page had no manifest.
          return null;
        }

        return /** @type {Required<LH.Crdp.Page.GetAppManifestResponse>} */ (response);
      });
  }

  /**
   * @return {Promise<LH.Crdp.ServiceWorker.WorkerVersionUpdatedEvent>}
   */
  getServiceWorkerVersions() {
    return new Promise((resolve, reject) => {
      /**
       * @param {LH.Crdp.ServiceWorker.WorkerVersionUpdatedEvent} data
       */
      const versionUpdatedListener = data => {
        // find a service worker with runningStatus that looks like active
        // on slow connections the serviceworker might still be installing
        const activateCandidates = data.versions.filter(sw => {
          return sw.status !== 'redundant';
        });
        const hasActiveServiceWorker = activateCandidates.find(sw => {
          return sw.status === 'activated';
        });

        if (!activateCandidates.length || hasActiveServiceWorker) {
          this.off('ServiceWorker.workerVersionUpdated', versionUpdatedListener);
          this.sendCommand('ServiceWorker.disable')
            .then(_ => resolve(data), reject);
        }
      };

      this.on('ServiceWorker.workerVersionUpdated', versionUpdatedListener);

      this.sendCommand('ServiceWorker.enable').catch(reject);
    });
  }

  /**
   * @return {Promise<LH.Crdp.ServiceWorker.WorkerRegistrationUpdatedEvent>}
   */
  getServiceWorkerRegistrations() {
    return new Promise((resolve, reject) => {
      this.once('ServiceWorker.workerRegistrationUpdated', data => {
        this.sendCommand('ServiceWorker.disable')
          .then(_ => resolve(data), reject);
      });

      this.sendCommand('ServiceWorker.enable').catch(reject);
    });
  }

  /**
   * Rejects if any open tabs would share a service worker with the target URL.
   * This includes the target tab, so navigation to something like about:blank
   * should be done before calling.
   * @param {string} pageUrl
   * @return {Promise<void>}
   */
  assertNoSameOriginServiceWorkerClients(pageUrl) {
    /** @type {Array<LH.Crdp.ServiceWorker.ServiceWorkerRegistration>} */
    let registrations;
    /** @type {Array<LH.Crdp.ServiceWorker.ServiceWorkerVersion>} */
    let versions;

    return this.getServiceWorkerRegistrations().then(data => {
      registrations = data.registrations;
    }).then(_ => this.getServiceWorkerVersions()).then(data => {
      versions = data.versions;
    }).then(_ => {
      const origin = new URL(pageUrl).origin;

      registrations
        .filter(reg => {
          const swOrigin = new URL(reg.scopeURL).origin;

          return origin === swOrigin;
        })
        .forEach(reg => {
          versions.forEach(ver => {
            // Ignore workers unaffiliated with this registration
            if (ver.registrationId !== reg.registrationId) {
              return;
            }

            // Throw if service worker for this origin has active controlledClients.
            if (ver.controlledClients && ver.controlledClients.length > 0) {
              throw new Error('You probably have multiple tabs open to the same origin.');
            }
          });
        });
    });
  }

  /**
   * Returns a promise that resolves when the network has been idle (after DCL) for
   * `networkQuietThresholdMs` ms and a method to cancel internal network listeners/timeout.
   * @param {number} networkQuietThresholdMs
   * @return {{promise: Promise<void>, cancel: function(): void}}
   * @private
   */
  _waitForNetworkIdle(networkQuietThresholdMs) {
    /** @type {NodeJS.Timer|undefined} */
    let idleTimeout;
    /** @type {(() => void)} */
    let cancel = () => {
      throw new Error('_waitForNetworkIdle.cancel() called before it was defined');
    };

    // Check here for _networkStatusMonitor to satisfy type checker. Any further race condition
    // will be caught at runtime on calls to it.
    if (!this._networkStatusMonitor) {
      throw new Error('Driver._waitForNetworkIdle called with no networkStatusMonitor');
    }
    const networkStatusMonitor = this._networkStatusMonitor;

    const promise = new Promise((resolve, reject) => {
      const onIdle = () => {
        // eslint-disable-next-line no-use-before-define
        networkStatusMonitor.once('network-2-busy', onBusy);
        idleTimeout = setTimeout(_ => {
          cancel();
          resolve();
        }, networkQuietThresholdMs);
      };

      const onBusy = () => {
        networkStatusMonitor.once('network-2-idle', onIdle);
        idleTimeout && clearTimeout(idleTimeout);
      };

      const domContentLoadedListener = () => {
        if (networkStatusMonitor.is2Idle()) {
          onIdle();
        } else {
          onBusy();
        }
      };

      this.once('Page.domContentEventFired', domContentLoadedListener);
      cancel = () => {
        idleTimeout && clearTimeout(idleTimeout);
        this.off('Page.domContentEventFired', domContentLoadedListener);
        networkStatusMonitor.removeListener('network-2-busy', onBusy);
        networkStatusMonitor.removeListener('network-2-idle', onIdle);
      };
    });

    return {
      promise,
      cancel,
    };
  }

  /**
   * Resolves when there have been no long tasks for at least waitForCPUQuiet ms.
   * @param {number} waitForCPUQuiet
   * @return {{promise: Promise<void>, cancel: function(): void}}
   */
  _waitForCPUIdle(waitForCPUQuiet) {
    if (!waitForCPUQuiet) {
      return {
        promise: Promise.resolve(),
        cancel: () => undefined,
      };
    }

    /** @type {NodeJS.Timer|undefined} */
    let lastTimeout;
    let cancelled = false;

    const checkForQuietExpression = `(${pageFunctions.checkTimeSinceLastLongTaskString})()`;
    /**
     * @param {Driver} driver
     * @param {() => void} resolve
     */
    function checkForQuiet(driver, resolve) {
      if (cancelled) return;

      return driver.evaluateAsync(checkForQuietExpression)
        .then(timeSinceLongTask => {
          if (cancelled) return;

          if (typeof timeSinceLongTask === 'number') {
            if (timeSinceLongTask >= waitForCPUQuiet) {
              log.verbose('Driver', `CPU has been idle for ${timeSinceLongTask} ms`);
              resolve();
            } else {
              log.verbose('Driver', `CPU has been idle for ${timeSinceLongTask} ms`);
              const timeToWait = waitForCPUQuiet - timeSinceLongTask;
              lastTimeout = setTimeout(() => checkForQuiet(driver, resolve), timeToWait);
            }
          }
        });
    }

    /** @type {(() => void)} */
    let cancel = () => {
      throw new Error('_waitForCPUIdle.cancel() called before it was defined');
    };
    const promise = new Promise((resolve, reject) => {
      checkForQuiet(this, resolve);
      cancel = () => {
        cancelled = true;
        if (lastTimeout) clearTimeout(lastTimeout);
        reject(new Error('Wait for CPU idle cancelled'));
      };
    });

    return {
      promise,
      cancel,
    };
  }

  /**
   * Return a promise that resolves `pauseAfterLoadMs` after the load event
   * fires and a method to cancel internal listeners and timeout.
   * @param {number} pauseAfterLoadMs
   * @return {{promise: Promise<void>, cancel: function(): void}}
   * @private
   */
  _waitForLoadEvent(pauseAfterLoadMs) {
    /** @type {(() => void)} */
    let cancel = () => {
      throw new Error('_waitForLoadEvent.cancel() called before it was defined');
    };

    const promise = new Promise((resolve, reject) => {
      /** @type {NodeJS.Timer|undefined} */
      let loadTimeout;
      const loadListener = function() {
        loadTimeout = setTimeout(resolve, pauseAfterLoadMs);
      };
      this.once('Page.loadEventFired', loadListener);

      cancel = () => {
        this.off('Page.loadEventFired', loadListener);
        loadTimeout && clearTimeout(loadTimeout);
      };
    });

    return {
      promise,
      cancel,
    };
  }

  /**
   * Returns a promise that resolves when:
   * - All of the following conditions have been met:
   *    - pauseAfterLoadMs milliseconds have passed since the load event.
   *    - networkQuietThresholdMs milliseconds have passed since the last network request that exceeded
   *      2 inflight requests (network-2-quiet has been reached).
   *    - cpuQuietThresholdMs have passed since the last long task after network-2-quiet.
   * - maxWaitForLoadedMs milliseconds have passed.
   * See https://github.com/GoogleChrome/lighthouse/issues/627 for more.
   * @param {number} pauseAfterLoadMs
   * @param {number} networkQuietThresholdMs
   * @param {number} cpuQuietThresholdMs
   * @param {number} maxWaitForLoadedMs
   * @return {Promise<void>}
   * @private
   */
  async _waitForFullyLoaded(pauseAfterLoadMs, networkQuietThresholdMs, cpuQuietThresholdMs,
      maxWaitForLoadedMs) {
    /** @type {NodeJS.Timer|undefined} */
    let maxTimeoutHandle;

    // Listener for onload. Resolves pauseAfterLoadMs ms after load.
    const waitForLoadEvent = this._waitForLoadEvent(pauseAfterLoadMs);
    // Network listener. Resolves when the network has been idle for networkQuietThresholdMs.
    const waitForNetworkIdle = this._waitForNetworkIdle(networkQuietThresholdMs);
    // CPU listener. Resolves when the CPU has been idle for cpuQuietThresholdMs after network idle.
    /** @type {{promise: Promise<void>, cancel: function(): void}|null} */
    let waitForCPUIdle = null;

    // Wait for both load promises. Resolves on cleanup function the clears load
    // timeout timer.
    const loadPromise = Promise.all([
      waitForLoadEvent.promise,
      waitForNetworkIdle.promise,
    ]).then(() => {
      waitForCPUIdle = this._waitForCPUIdle(cpuQuietThresholdMs);
      return waitForCPUIdle.promise;
    }).then(() => {
      return function() {
        log.verbose('Driver', 'loadEventFired and network considered idle');
        maxTimeoutHandle && clearTimeout(maxTimeoutHandle);
      };
    });

    // Last resort timeout. Resolves maxWaitForLoadedMs ms from now on
    // cleanup function that removes loadEvent and network idle listeners.
    const maxTimeoutPromise = new Promise((resolve, reject) => {
      maxTimeoutHandle = setTimeout(resolve, maxWaitForLoadedMs);
    }).then(_ => {
      return function() {
        log.warn('Driver', 'Timed out waiting for page load. Moving on...');
        waitForLoadEvent.cancel();
        waitForNetworkIdle.cancel();
        waitForCPUIdle && waitForCPUIdle.cancel();
      };
    });

    // Wait for load or timeout and run the cleanup function the winner returns.
    const cleanupFn = await Promise.race([
      loadPromise,
      maxTimeoutPromise,
    ]);
    cleanupFn();
  }

  /**
   * Set up listener for network quiet events and URL redirects. Passed in URL
   * will be monitored for redirects, with the final loaded URL passed back in
   * _endNetworkStatusMonitoring.
   * @param {string} startingUrl
   * @return {Promise<void>}
   * @private
   */
  _beginNetworkStatusMonitoring(startingUrl) {
    this._networkStatusMonitor = new NetworkRecorder();

    // Update startingUrl if it's ever redirected.
    this._monitoredUrl = startingUrl;
    /** @param {LH.Artifacts.NetworkRequest} redirectRequest */
    const requestLoadedListener = redirectRequest => {
      // Ignore if this is not a redirected request.
      if (!redirectRequest.redirectSource) {
        return;
      }
      const earlierRequest = redirectRequest.redirectSource;
      if (earlierRequest.url === this._monitoredUrl) {
        this._monitoredUrl = redirectRequest.url;
      }
    };
    this._networkStatusMonitor.on('requestloaded', requestLoadedListener);

    return this.sendCommand('Network.enable');
  }

  /**
   * End network status listening. Returns the final, possibly redirected,
   * loaded URL starting with the one passed into _endNetworkStatusMonitoring.
   * @return {string}
   * @private
   */
  _endNetworkStatusMonitoring() {
    this._networkStatusMonitor = null;
    const finalUrl = this._monitoredUrl;
    this._monitoredUrl = null;

    if (!finalUrl) {
      throw new Error('Network Status Monitoring ended with an undefined finalUrl');
    }

    return finalUrl;
  }

  /**
   * Returns the cached isolated execution context ID or creates a new execution context for the main
   * frame. The cached execution context is cleared on every gotoURL invocation, so a new one will
   * always be created on the first call on a new page.
   * @return {Promise<number>}
   */
  async _getOrCreateIsolatedContextId() {
    if (typeof this._isolatedExecutionContextId === 'number') {
      return this._isolatedExecutionContextId;
    }

    const resourceTreeResponse = await this.sendCommand('Page.getResourceTree');
    const mainFrameId = resourceTreeResponse.frameTree.frame.id;

    const isolatedWorldResponse = await this.sendCommand('Page.createIsolatedWorld', {
      frameId: mainFrameId,
      worldName: 'lighthouse_isolated_context',
    });

    this._isolatedExecutionContextId = isolatedWorldResponse.executionContextId;
    return isolatedWorldResponse.executionContextId;
  }

  _clearIsolatedContextId() {
    this._isolatedExecutionContextId = undefined;
  }

  /**
   * Navigate to the given URL. Direct use of this method isn't advised: if
   * the current page is already at the given URL, navigation will not occur and
   * so the returned promise will only resolve after the MAX_WAIT_FOR_FULLY_LOADED
   * timeout. See https://github.com/GoogleChrome/lighthouse/pull/185 for one
   * possible workaround.
   * Resolves on the url of the loaded page, taking into account any redirects.
   * @param {string} url
   * @param {{waitForLoad?: boolean, passContext?: LH.Gatherer.PassContext}} options
   * @return {Promise<string>}
   */
  async gotoURL(url, options = {}) {
    const waitForLoad = options.waitForLoad || false;
    const passContext = /** @type {Partial<LH.Gatherer.PassContext>} */ (options.passContext || {});
    const disableJS = passContext.disableJavaScript || false;

    await this._beginNetworkStatusMonitoring(url);
    await this._clearIsolatedContextId();

    // These can 'race' and that's OK.
    // We don't want to wait for Page.navigate's resolution, as it can now
    // happen _after_ onload: https://crbug.com/768961
    this.sendCommand('Page.enable');
    this.sendCommand('Emulation.setScriptExecutionDisabled', {value: disableJS});
    this.sendCommand('Page.navigate', {url});

    if (waitForLoad) {
      const passConfig = /** @type {Partial<LH.Config.Pass>} */ (passContext.passConfig || {});
      let {pauseAfterLoadMs, networkQuietThresholdMs, cpuQuietThresholdMs} = passConfig;
      let maxWaitMs = passContext.settings && passContext.settings.maxWaitForLoad;

      /* eslint-disable max-len */
      if (typeof pauseAfterLoadMs !== 'number') pauseAfterLoadMs = DEFAULT_PAUSE_AFTER_LOAD;
      if (typeof networkQuietThresholdMs !== 'number') networkQuietThresholdMs = DEFAULT_NETWORK_QUIET_THRESHOLD;
      if (typeof cpuQuietThresholdMs !== 'number') cpuQuietThresholdMs = DEFAULT_CPU_QUIET_THRESHOLD;
      if (typeof maxWaitMs !== 'number') maxWaitMs = constants.defaultSettings.maxWaitForLoad;
      /* eslint-enable max-len */

      await this._waitForFullyLoaded(pauseAfterLoadMs, networkQuietThresholdMs, cpuQuietThresholdMs,
          maxWaitMs);
    }

    return this._endNetworkStatusMonitoring();
  }

  /**
   * @param {string} objectId Object ID for the resolved DOM node
   * @param {string} propName Name of the property
   * @return {Promise<string|null>} The property value, or null, if property not found
  */
  async getObjectProperty(objectId, propName) {
    const propertiesResponse = await this.sendCommand('Runtime.getProperties', {
      objectId,
      accessorPropertiesOnly: true,
      generatePreview: false,
      ownProperties: false,
    });

    const propertyForName = propertiesResponse.result
        .find(property => property.name === propName);

    if (propertyForName && propertyForName.value) {
      return propertyForName.value.value;
    } else {
      return null;
    }
  }

  /**
   * Return the body of the response with the given ID. Rejects if getting the
   * body times out.
   * @param {string} requestId
   * @param {number} [timeout]
   * @return {Promise<string>}
   */
  getRequestContent(requestId, timeout = 1000) {
    requestId = NetworkRequest.getRequestIdForBackend(requestId);

    return new Promise((resolve, reject) => {
      // If this takes more than 1s, reject the Promise.
      // Why? Encoding issues can lead to hanging getResponseBody calls: https://github.com/GoogleChrome/lighthouse/pull/4718
      const err = new LHError(LHError.errors.REQUEST_CONTENT_TIMEOUT);
      const asyncTimeout = setTimeout((_ => reject(err)), timeout);

      this.sendCommand('Network.getResponseBody', {requestId}).then(result => {
        clearTimeout(asyncTimeout);
        // Ignoring result.base64Encoded, which indicates if body is already encoded
        resolve(result.body);
      }).catch(e => {
        clearTimeout(asyncTimeout);
        reject(e);
      });
    });
  }

  /**
   * @param {string} name The name of API whose permission you wish to query
   * @return {Promise<string>} The state of permissions, resolved in a promise.
   *    See https://developer.mozilla.org/en-US/docs/Web/API/Permissions/query.
   */
  queryPermissionState(name) {
    const expressionToEval = `
      navigator.permissions.query({name: '${name}'}).then(result => {
        return result.state;
      })
    `;

    return this.evaluateAsync(expressionToEval);
  }

  /**
   * @param {string} selector Selector to find in the DOM
   * @return {Promise<Element|null>} The found element, or null, resolved in a promise
   */
  async querySelector(selector) {
    const documentResponse = await this.sendCommand('DOM.getDocument');
    const rootNodeId = documentResponse.root.nodeId;

    const targetNode = await this.sendCommand('DOM.querySelector', {
      nodeId: rootNodeId,
      selector,
    });

    if (targetNode.nodeId === 0) {
      return null;
    }
    return new Element(targetNode, this);
  }

  /**
   * @param {string} selector Selector to find in the DOM
   * @return {Promise<Array<Element>>} The found elements, or [], resolved in a promise
   */
  async querySelectorAll(selector) {
    const documentResponse = await this.sendCommand('DOM.getDocument');
    const rootNodeId = documentResponse.root.nodeId;

    const targetNodeList = await this.sendCommand('DOM.querySelectorAll', {
      nodeId: rootNodeId,
      selector,
    });

    /** @type {Array<Element>} */
    const elementList = [];
    targetNodeList.nodeIds.forEach(nodeId => {
      if (nodeId !== 0) {
        elementList.push(new Element({nodeId}, this));
      }
    });
    return elementList;
  }

  /**
   * Returns the flattened list of all DOM elements within the document.
   * @param {boolean=} pierce Whether to pierce through shadow trees and iframes.
   *     True by default.
   * @return {Promise<Array<Element>>} The found elements, or [], resolved in a promise
   */
  getElementsInDocument(pierce = true) {
    return this.getNodesInDocument(pierce)
      .then(nodes => nodes
        .filter(node => node.nodeType === 1)
        .map(node => new Element({nodeId: node.nodeId}, this))
      );
  }

  /**
   * Returns the flattened list of all DOM nodes within the document.
   * @param {boolean=} pierce Whether to pierce through shadow trees and iframes.
   *     True by default.
   * @return {Promise<Array<LH.Crdp.DOM.Node>>} The found nodes, or [], resolved in a promise
   */
  async getNodesInDocument(pierce = true) {
    const flattenedDocument = await this.sendCommand('DOM.getFlattenedDocument',
        {depth: -1, pierce});

    return flattenedDocument.nodes ? flattenedDocument.nodes : [];
  }

  /**
   * @param {{additionalTraceCategories?: string|null}=} settings
   * @return {Promise<void>}
   */
  beginTrace(settings) {
    const additionalCategories = (settings && settings.additionalTraceCategories &&
        settings.additionalTraceCategories.split(',')) || [];
    const traceCategories = this._traceCategories.concat(additionalCategories);
    const uniqueCategories = Array.from(new Set(traceCategories));

    // Check any domains that could interfere with or add overhead to the trace.
    if (this.isDomainEnabled('Debugger')) {
      throw new Error('Debugger domain enabled when starting trace');
    }
    if (this.isDomainEnabled('CSS')) {
      throw new Error('CSS domain enabled when starting trace');
    }
    if (this.isDomainEnabled('DOM')) {
      throw new Error('DOM domain enabled when starting trace');
    }

    // Enable Page domain to wait for Page.loadEventFired
    return this.sendCommand('Page.enable')
      .then(_ => this.sendCommand('Tracing.start', {
        categories: uniqueCategories.join(','),
        options: 'sampling-frequency=10000', // 1000 is default and too slow.
      }));
  }

  /**
   * @return {Promise<LH.Trace>}
   */
  endTrace() {
    /** @type {Array<LH.TraceEvent>} */
    const traceEvents = [];

    /**
     * Listener for when dataCollected events fire for each trace chunk
     * @param {LH.Crdp.Tracing.DataCollectedEvent} data
     */
    const dataListener = function(data) {
      traceEvents.push(...data.value);
    };
    this.on('Tracing.dataCollected', dataListener);

    return new Promise((resolve, reject) => {
      this.once('Tracing.tracingComplete', _ => {
        this.off('Tracing.dataCollected', dataListener);
        resolve({traceEvents});
      });

      return this.sendCommand('Tracing.end').catch(reject);
    });
  }

  /**
   * Begin recording devtools protocol messages.
   */
  beginDevtoolsLog() {
    this._devtoolsLog.reset();
    this._devtoolsLog.beginRecording();
  }

  /**
   * Stop recording to devtoolsLog and return log contents.
   * @return {LH.DevtoolsLog}
   */
  endDevtoolsLog() {
    this._devtoolsLog.endRecording();
    return this._devtoolsLog.messages;
  }

  /**
   * @return {Promise<void>}
   */
  enableRuntimeEvents() {
    return this.sendCommand('Runtime.enable');
  }

  /**
   * @param {LH.Config.Settings} settings
   * @return {Promise<void>}
   */
  async beginEmulation(settings) {
    // TODO(phulce): remove this flag on next breaking change
    if (!settings.disableDeviceEmulation) {
      if (settings.emulatedFormFactor === 'mobile') {
        await emulation.enableNexus5X(this);
      } else if (settings.emulatedFormFactor === 'desktop') {
        await emulation.enableDesktop(this);
      }
    }

    await this.setThrottling(settings, {useThrottling: true});
  }

  /**
   * @param {LH.Config.Settings} settings
   * @param {{useThrottling?: boolean}} passConfig
   * @return {Promise<void>}
   */
  async setThrottling(settings, passConfig) {
    if (settings.throttlingMethod !== 'devtools') {
      return emulation.clearAllNetworkEmulation(this);
    }

    const cpuPromise = passConfig.useThrottling ?
        emulation.enableCPUThrottling(this, settings.throttling) :
        emulation.disableCPUThrottling(this);
    const networkPromise = passConfig.useThrottling ?
        emulation.enableNetworkThrottling(this, settings.throttling) :
        emulation.clearAllNetworkEmulation(this);

    await Promise.all([cpuPromise, networkPromise]);
  }

  /**
   * Emulate internet disconnection.
   * @return {Promise<void>}
   */
  async goOffline() {
    await this.sendCommand('Network.enable');
    await emulation.goOffline(this);
    this.online = false;
  }

  /**
   * Enable internet connection, using emulated mobile settings if applicable.
   * @param {{settings: LH.Config.Settings, passConfig: LH.Config.Pass}} options
   * @return {Promise<void>}
   */
  async goOnline(options) {
    await this.setThrottling(options.settings, options.passConfig);
    this.online = true;
  }

  /**
   * Emulate internet disconnection.
   * @return {Promise<void>}
   */
  cleanBrowserCaches() {
    // Wipe entire disk cache
    return this.sendCommand('Network.clearBrowserCache')
      // Toggle 'Disable Cache' to evict the memory cache
      .then(_ => this.sendCommand('Network.setCacheDisabled', {cacheDisabled: true}))
      .then(_ => this.sendCommand('Network.setCacheDisabled', {cacheDisabled: false}));
  }

  /**
   * @param {LH.Crdp.Network.Headers|null} headers key/value pairs of HTTP Headers.
   * @return {Promise<void>}
   */
  async setExtraHTTPHeaders(headers) {
    if (!headers) {
      return;
    }

    return this.sendCommand('Network.setExtraHTTPHeaders', {headers});
  }

  /**
   * @param {string} url
   * @return {Promise<void>}
   */
  clearDataForOrigin(url) {
    const origin = new URL(url).origin;

    // Clear all types of storage except cookies, so the user isn't logged out.
    //   https://chromedevtools.github.io/debugger-protocol-viewer/tot/Storage/#type-StorageType
    const typesToClear = [
      'appcache',
      // 'cookies',
      'file_systems',
      'indexeddb',
      'local_storage',
      'shader_cache',
      'websql',
      'service_workers',
      'cache_storage',
    ].join(',');

    return this.sendCommand('Storage.clearDataForOrigin', {
      origin: origin,
      storageTypes: typesToClear,
    });
  }

  /**
   * Cache native functions/objects inside window
   * so we are sure polyfills do not overwrite the native implementations
   * @return {Promise<void>}
   */
  async cacheNatives() {
    await this.evaluateScriptOnNewDocument(`window.__nativePromise = Promise;
        window.__nativeError = Error;
        window.__nativeURL = URL;`);
  }

  /**
   * Install a performance observer that watches longtask timestamps for waitForCPUIdle.
   * @return {Promise<void>}
   */
  async registerPerformanceObserver() {
    const scriptStr = `(${pageFunctions.registerPerformanceObserverInPageString})()`;
    await this.evaluateScriptOnNewDocument(scriptStr);
  }

  /**
   * @param {Array<string>} urls URL patterns to block. Wildcards ('*') are allowed.
   * @return {Promise<void>}
   */
  blockUrlPatterns(urls) {
    return this.sendCommand('Network.setBlockedURLs', {urls})
      .catch(err => {
        // TODO: remove this handler once m59 hits stable
        if (!/wasn't found/.test(err.message)) {
          throw err;
        }
      });
  }

  /**
   * Dismiss JavaScript dialogs (alert, confirm, prompt), providing a
   * generic promptText in case the dialog is a prompt.
   * @return {Promise<void>}
   */
  async dismissJavaScriptDialogs() {
    await this.sendCommand('Page.enable');

    this.on('Page.javascriptDialogOpening', data => {
      log.warn('Driver', `${data.type} dialog opened by the page automatically suppressed.`);

      // rejection intentionally unhandled
      this.sendCommand('Page.handleJavaScriptDialog', {
        accept: true,
        promptText: 'Lighthouse prompt response',
      });
    });
  }
}

module.exports = Driver;


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// import createLighthouse from "lighthouse-lambda";
const launchChrome = __webpack_require__(120);
const lighthouse = __webpack_require__(136);
/* export our lambda function as named "handler" export */
exports.handler = (() => {
  var _ref = _asyncToGenerator(function* (event, context, callback) {
    const chrome = yield launchChrome({
      flags: ["--window-size=1280,1696", "--hide-scrollbars"]
    });

    const opts = {
      chromeFlags: ["--show-paint-rects"],
      port: chrome.port
    };

    const lighthouseResp = yield lighthouse("https://github.com", opts, null);

    yield chrome.kill();
    return {
      statusCode: 200,
      body: JSON.stringify(lighthouseResp.lhr)
    };
    // Chrome didn't launch correctly 😢
    // console.log("no").catch(callback);
  });

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
})();

/***/ }),
/* 120 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_child_process__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_child_process___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_child_process__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_path__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_path__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_fs__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_fs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_fs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_net__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_net___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_net__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_http__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_http___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_http__);






function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function clearConnection(client) {
  if (client) {
    client.removeAllListeners();
    client.end();
    client.destroy();
    client.unref();
  }
}

function debug(...args) {
  return process.env.DEBUG ? console.log('@serverless-chrome/lambda:', ...args) : undefined;
}

let delay = (() => {
  var _ref = _asyncToGenerator(function* (time) {
    return new Promise(function (resolve) {
      return setTimeout(resolve, time);
    });
  });

  return function delay(_x) {
    return _ref.apply(this, arguments);
  };
})();

function makeTempDir() {
  return Object(__WEBPACK_IMPORTED_MODULE_0_child_process__["execSync"])('mktemp -d -t chrome.XXXXXXX').toString().trim();
}

/**
 * Checks if a process currently exists by process id.
 * @param pid number process id to check if exists
 * @returns boolean true if process exists, false if otherwise
 */
function processExists(pid) {
  let exists = true;
  try {
    process.kill(pid, 0);
  } catch (error) {
    exists = false;
  }
  return exists;
}

const LOGGING_FLAGS = process.env.DEBUG ? ['--enable-logging', '--log-level=0', '--v=99'] : [];

var DEFAULT_CHROME_FLAGS = [...LOGGING_FLAGS, '--disable-dev-shm-usage', // disable /dev/shm tmpfs usage on Lambda

// @TODO: review if these are still relevant:
'--disable-gpu', '--single-process', // Currently wont work without this :-(

// https://groups.google.com/a/chromium.org/d/msg/headless-dev/qqbZVZ2IwEw/Y95wJUh2AAAJ
'--no-zygote', // helps avoid zombies

'--no-sandbox'];

function _asyncToGenerator$1(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const CHROME_PATH = __WEBPACK_IMPORTED_MODULE_1_path___default.a.resolve(__dirname, './headless-chromium');

class Launcher {
  constructor(options = {}) {
    const {
      chromePath = CHROME_PATH,
      chromeFlags = [],
      startingUrl = 'about:blank',
      port = 0
    } = options;

    this.tmpDirandPidFileReady = false;
    this.pollInterval = 500;
    this.pidFile = '';
    this.startingUrl = 'about:blank';
    this.outFile = null;
    this.errFile = null;
    this.chromePath = CHROME_PATH;
    this.chromeFlags = [];
    this.requestedPort = 0;
    this.userDataDir = '';
    this.port = 9222;
    this.pid = null;
    this.chrome = undefined;

    this.options = options;
    this.startingUrl = startingUrl;
    this.chromeFlags = chromeFlags;
    this.chromePath = chromePath;
    this.requestedPort = port;
  }

  get flags() {
    return [...DEFAULT_CHROME_FLAGS, `--remote-debugging-port=${this.port}`, `--user-data-dir=${this.userDataDir}`, '--disable-setuid-sandbox', ...this.chromeFlags, this.startingUrl];
  }

  prepare() {
    this.userDataDir = this.options.userDataDir || makeTempDir();
    this.outFile = __WEBPACK_IMPORTED_MODULE_2_fs___default.a.openSync(`${this.userDataDir}/chrome-out.log`, 'a');
    this.errFile = __WEBPACK_IMPORTED_MODULE_2_fs___default.a.openSync(`${this.userDataDir}/chrome-err.log`, 'a');
    this.pidFile = '/tmp/chrome.pid';
    this.tmpDirandPidFileReady = true;
  }

  // resolves if ready, rejects otherwise
  isReady() {
    return new Promise((resolve, reject) => {
      const client = __WEBPACK_IMPORTED_MODULE_3_net___default.a.createConnection(this.port);

      client.once('error', error => {
        clearConnection(client);
        reject(error);
      });

      client.once('connect', () => {
        clearConnection(client);
        resolve();
      });
    });
  }

  // resolves when debugger is ready, rejects after 10 polls
  waitUntilReady() {
    const launcher = this;

    return new Promise((resolve, reject) => {
      let retries = 0;
      (function poll() {
        debug('Waiting for Chrome', retries);

        launcher.isReady().then(() => {
          debug('Started Chrome');
          resolve();
        }).catch(error => {
          retries += 1;

          if (retries > 10) {
            return reject(error);
          }

          return delay(launcher.pollInterval).then(poll);
        });
      })();
    });
  }

  // resolves when chrome is killed, rejects  after 10 polls
  waitUntilKilled() {
    return Promise.all([new Promise((resolve, reject) => {
      let retries = 0;
      const server = __WEBPACK_IMPORTED_MODULE_4_http___default.a.createServer();

      server.once('listening', () => {
        debug('Confirmed Chrome killed');
        server.close(resolve);
      });

      server.on('error', () => {
        retries += 1;

        debug('Waiting for Chrome to terminate..', retries);

        if (retries > 10) {
          reject(new Error('Chrome is still running after 10 retries'));
        }

        setTimeout(() => {
          server.listen(this.port);
        }, this.pollInterval);
      });

      server.listen(this.port);
    }), new Promise(resolve => {
      this.chrome.on('close', resolve);
    })]);
  }

  spawn() {
    var _this = this;

    return _asyncToGenerator$1(function* () {
      const spawnPromise = new Promise((() => {
        var _ref = _asyncToGenerator$1(function* (resolve) {
          if (_this.chrome) {
            debug(`Chrome already running with pid ${_this.chrome.pid}.`);
            return resolve(_this.chrome.pid);
          }

          const chrome = Object(__WEBPACK_IMPORTED_MODULE_0_child_process__["spawn"])(_this.chromePath, _this.flags, {
            detached: true,
            stdio: ['ignore', _this.outFile, _this.errFile]
          });

          _this.chrome = chrome;

          // unref the chrome instance, otherwise the lambda process won't end correctly
          if (chrome.chrome) {
            chrome.chrome.removeAllListeners();
            chrome.chrome.unref();
          }

          __WEBPACK_IMPORTED_MODULE_2_fs___default.a.writeFileSync(_this.pidFile, chrome.pid.toString());

          debug('Launcher', `Chrome running with pid ${chrome.pid} on port ${_this.port}.`);

          return resolve(chrome.pid);
        });

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      })());

      const pid = yield spawnPromise;
      yield _this.waitUntilReady();
      return pid;
    })();
  }

  launch() {
    var _this2 = this;

    return _asyncToGenerator$1(function* () {
      if (_this2.requestedPort !== 0) {
        _this2.port = _this2.requestedPort;

        // If an explict port is passed first look for an open connection...
        try {
          return yield _this2.isReady();
        } catch (err) {
          debug('ChromeLauncher', `No debugging port found on port ${_this2.port}, launching a new Chrome.`);
        }
      }

      if (!_this2.tmpDirandPidFileReady) {
        _this2.prepare();
      }

      _this2.pid = yield _this2.spawn();
      return Promise.resolve();
    })();
  }

  kill() {
    var _this3 = this;

    return new Promise((() => {
      var _ref2 = _asyncToGenerator$1(function* (resolve, reject) {
        if (_this3.chrome) {
          debug('Trying to terminate Chrome instance');

          try {
            process.kill(-_this3.chrome.pid);

            debug('Waiting for Chrome to terminate..');
            yield _this3.waitUntilKilled();
            debug('Chrome successfully terminated.');

            _this3.destroyTemp();

            delete _this3.chrome;
            return resolve();
          } catch (error) {
            debug('Chrome could not be killed', error);
            return reject(error);
          }
        } else {
          // fail silently as we did not start chrome
          return resolve();
        }
      });

      return function (_x2, _x3) {
        return _ref2.apply(this, arguments);
      };
    })());
  }

  destroyTemp() {
    return new Promise(resolve => {
      // Only clean up the tmp dir if we created it.
      if (this.userDataDir === undefined || this.options.userDataDir !== undefined) {
        return resolve();
      }

      if (this.outFile) {
        __WEBPACK_IMPORTED_MODULE_2_fs___default.a.closeSync(this.outFile);
        delete this.outFile;
      }

      if (this.errFile) {
        __WEBPACK_IMPORTED_MODULE_2_fs___default.a.closeSync(this.errFile);
        delete this.errFile;
      }

      return Object(__WEBPACK_IMPORTED_MODULE_0_child_process__["execSync"])(`rm -Rf ${this.userDataDir}`, resolve);
    });
  }
}

function _asyncToGenerator$2(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const DEVTOOLS_PORT = 9222;
const DEVTOOLS_HOST = 'http://127.0.0.1';

// Prepend NSS related libraries and binaries to the library path and path respectively on lambda.
/* if (process.env.AWS_EXECUTION_ENV) {
  const nssSubPath = fs.readFileSync(path.join(__dirname, 'nss', 'latest'), 'utf8').trim();
  const nssPath = path.join(__dirname, 'nss', subnssSubPathPath);

  process.env.LD_LIBRARY_PATH = path.join(nssPath, 'lib') +  ':' + process.env.LD_LIBRARY_PATH;
  process.env.PATH = path.join(nssPath, 'bin') + ':' + process.env.PATH;
} */

// persist the instance across invocations
// when the *lambda* container is reused.
let chromeInstance;

var index = (() => {
  var _ref = _asyncToGenerator$2(function* ({
    flags = [],
    chromePath,
    port = DEVTOOLS_PORT,
    forceLambdaLauncher = false
  } = {}) {
    const chromeFlags = [...DEFAULT_CHROME_FLAGS, ...flags];

    if (!chromeInstance || !processExists(chromeInstance.pid)) {
      if (process.env.AWS_EXECUTION_ENV || forceLambdaLauncher) {
        chromeInstance = new Launcher({
          chromePath,
          chromeFlags,
          port
        });
      } else {
        // This let's us use chrome-launcher in local development,
        // but omit it from the lambda function's zip artefact
        try {
          // eslint-disable-next-line
          const { Launcher: LocalChromeLauncher } = __webpack_require__(121);
          chromeInstance = new LocalChromeLauncher({
            chromePath,
            chromeFlags: flags,
            port
          });
        } catch (error) {
          throw new Error('@serverless-chrome/lambda: Unable to find "chrome-launcher". ' + "Make sure it's installed if you wish to develop locally.");
        }
      }
    }

    debug('Spawning headless shell');

    const launchStartTime = Date.now();

    try {
      yield chromeInstance.launch();
    } catch (error) {
      debug('Error trying to spawn chrome:', error);

      if (process.env.DEBUG) {
        debug('stdout log:', __WEBPACK_IMPORTED_MODULE_2_fs___default.a.readFileSync(`${chromeInstance.userDataDir}/chrome-out.log`, 'utf8'));
        debug('stderr log:', __WEBPACK_IMPORTED_MODULE_2_fs___default.a.readFileSync(`${chromeInstance.userDataDir}/chrome-err.log`, 'utf8'));
      }

      throw new Error('Unable to start Chrome. If you have the DEBUG env variable set,' + 'there will be more in the logs.');
    }

    const launchTime = Date.now() - launchStartTime;

    debug(`It took ${launchTime}ms to spawn chrome.`);

    // unref the chrome instance, otherwise the lambda process won't end correctly
    /* @TODO: make this an option?
      There's an option to change callbackWaitsForEmptyEventLoop in the Lambda context
      http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
      Which means you could log chrome output to cloudwatch directly
      without unreffing chrome.
    */
    if (chromeInstance.chrome) {
      chromeInstance.chrome.removeAllListeners();
      chromeInstance.chrome.unref();
    }

    return {
      pid: chromeInstance.pid,
      port: chromeInstance.port,
      url: `${DEVTOOLS_HOST}:${chromeInstance.port}`,
      log: `${chromeInstance.userDataDir}/chrome-out.log`,
      errorLog: `${chromeInstance.userDataDir}/chrome-err.log`,
      pidFile: `${chromeInstance.userDataDir}/chrome.pid`,
      metaData: {
        launchTime,
        didLaunch: !!chromeInstance.pid
      },
      kill() {
        return _asyncToGenerator$2(function* () {
          // Defer killing chrome process to the end of the execution stack
          // so that the node process doesn't end before chrome exists,
          // avoiding chrome becoming orphaned.
          setTimeout(_asyncToGenerator$2(function* () {
            chromeInstance.kill();
            chromeInstance = undefined;
          }), 0);
        })();
      }
    };
  });

  function launch() {
    return _ref.apply(this, arguments);
  }

  return launch;
})();

/* harmony default export */ __webpack_exports__["default"] = (index);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, "../node_modules/@serverless-chrome/lambda/dist"))

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(122));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx1Q0FBa0MifQ==

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const childProcess = __webpack_require__(90);
const fs = __webpack_require__(1);
const net = __webpack_require__(35);
const rimraf = __webpack_require__(123);
const chromeFinder = __webpack_require__(130);
const random_port_1 = __webpack_require__(134);
const flags_1 = __webpack_require__(135);
const utils_1 = __webpack_require__(105);
const log = __webpack_require__(87);
const spawn = childProcess.spawn;
const execSync = childProcess.execSync;
const isWsl = utils_1.getPlatform() === 'wsl';
const isWindows = utils_1.getPlatform() === 'win32';
const _SIGINT = 'SIGINT';
const _SIGINT_EXIT_CODE = 130;
const _SUPPORTED_PLATFORMS = new Set(['darwin', 'linux', 'win32', 'wsl']);
const instances = new Set();
const sigintListener = () => __awaiter(this, void 0, void 0, function* () {
    for (const instance of instances) {
        try {
            yield instance.kill();
        }
        catch (err) {
        }
    }
    process.exit(_SIGINT_EXIT_CODE);
});
function launch(opts = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        opts.handleSIGINT = utils_1.defaults(opts.handleSIGINT, true);
        const instance = new Launcher(opts);
        // Kill spawned Chrome process in case of ctrl-C.
        if (opts.handleSIGINT && instances.size === 0) {
            process.on(_SIGINT, sigintListener);
        }
        instances.add(instance);
        yield instance.launch();
        const kill = () => __awaiter(this, void 0, void 0, function* () {
            instances.delete(instance);
            if (instances.size === 0) {
                process.removeListener(_SIGINT, sigintListener);
            }
            return instance.kill();
        });
        return { pid: instance.pid, port: instance.port, kill, process: instance.chrome };
    });
}
exports.launch = launch;
class Launcher {
    constructor(opts = {}, moduleOverrides = {}) {
        this.opts = opts;
        this.tmpDirandPidFileReady = false;
        this.fs = moduleOverrides.fs || fs;
        this.rimraf = moduleOverrides.rimraf || rimraf;
        this.spawn = moduleOverrides.spawn || spawn;
        log.setLevel(utils_1.defaults(this.opts.logLevel, 'silent'));
        // choose the first one (default)
        this.startingUrl = utils_1.defaults(this.opts.startingUrl, 'about:blank');
        this.chromeFlags = utils_1.defaults(this.opts.chromeFlags, []);
        this.requestedPort = utils_1.defaults(this.opts.port, 0);
        this.chromePath = this.opts.chromePath;
        this.enableExtensions = utils_1.defaults(this.opts.enableExtensions, false);
        this.connectionPollInterval = utils_1.defaults(this.opts.connectionPollInterval, 500);
        this.maxConnectionRetries = utils_1.defaults(this.opts.maxConnectionRetries, 50);
        this.envVars = utils_1.defaults(opts.envVars, Object.assign({}, process.env));
        if (typeof this.opts.userDataDir === 'boolean') {
            if (!this.opts.userDataDir) {
                this.useDefaultProfile = true;
                this.userDataDir = undefined;
            }
            else {
                throw new utils_1.InvalidUserDataDirectoryError();
            }
        }
        else {
            this.useDefaultProfile = false;
            this.userDataDir = this.opts.userDataDir;
        }
    }
    get flags() {
        let flags = flags_1.DEFAULT_FLAGS.concat([`--remote-debugging-port=${this.port}`]);
        // Place Chrome profile in a custom location we'll rm -rf later
        if (!this.useDefaultProfile) {
            // If in WSL, we need to use the Windows format
            flags.push(`--user-data-dir=${isWsl ? utils_1.toWinDirFormat(this.userDataDir) : this.userDataDir}`);
        }
        if (this.enableExtensions) {
            flags = flags.filter(flag => flag !== '--disable-extensions');
        }
        if (utils_1.getPlatform() === 'linux') {
            flags.push('--disable-setuid-sandbox');
        }
        flags.push(...this.chromeFlags);
        flags.push(this.startingUrl);
        return flags;
    }
    // Wrapper function to enable easy testing.
    makeTmpDir() {
        return utils_1.makeTmpDir();
    }
    prepare() {
        const platform = utils_1.getPlatform();
        if (!_SUPPORTED_PLATFORMS.has(platform)) {
            throw new utils_1.UnsupportedPlatformError();
        }
        this.userDataDir = this.userDataDir || this.makeTmpDir();
        this.outFile = this.fs.openSync(`${this.userDataDir}/chrome-out.log`, 'a');
        this.errFile = this.fs.openSync(`${this.userDataDir}/chrome-err.log`, 'a');
        // fix for Node4
        // you can't pass a fd to fs.writeFileSync
        this.pidFile = `${this.userDataDir}/chrome.pid`;
        log.verbose('ChromeLauncher', `created ${this.userDataDir}`);
        this.tmpDirandPidFileReady = true;
    }
    launch() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.requestedPort !== 0) {
                this.port = this.requestedPort;
                // If an explict port is passed first look for an open connection...
                try {
                    return yield this.isDebuggerReady();
                }
                catch (err) {
                    log.log('ChromeLauncher', `No debugging port found on port ${this.port}, launching a new Chrome.`);
                }
            }
            if (this.chromePath === undefined) {
                const installations = yield chromeFinder[utils_1.getPlatform()]();
                if (installations.length === 0) {
                    throw new utils_1.ChromeNotInstalledError();
                }
                this.chromePath = installations[0];
            }
            if (!this.tmpDirandPidFileReady) {
                this.prepare();
            }
            this.pid = yield this.spawnProcess(this.chromePath);
            return Promise.resolve();
        });
    }
    spawnProcess(execPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const spawnPromise = (() => __awaiter(this, void 0, void 0, function* () {
                if (this.chrome) {
                    log.log('ChromeLauncher', `Chrome already running with pid ${this.chrome.pid}.`);
                    return this.chrome.pid;
                }
                // If a zero value port is set, it means the launcher
                // is responsible for generating the port number.
                // We do this here so that we can know the port before
                // we pass it into chrome.
                if (this.requestedPort === 0) {
                    this.port = yield random_port_1.getRandomPort();
                }
                log.verbose('ChromeLauncher', `Launching with command:\n"${execPath}" ${this.flags.join(' ')}`);
                const chrome = this.spawn(execPath, this.flags, { detached: true, stdio: ['ignore', this.outFile, this.errFile], env: this.envVars });
                this.chrome = chrome;
                this.fs.writeFileSync(this.pidFile, chrome.pid.toString());
                log.verbose('ChromeLauncher', `Chrome running with pid ${chrome.pid} on port ${this.port}.`);
                return chrome.pid;
            }))();
            const pid = yield spawnPromise;
            yield this.waitUntilReady();
            return pid;
        });
    }
    cleanup(client) {
        if (client) {
            client.removeAllListeners();
            client.end();
            client.destroy();
            client.unref();
        }
    }
    // resolves if ready, rejects otherwise
    isDebuggerReady() {
        return new Promise((resolve, reject) => {
            const client = net.createConnection(this.port);
            client.once('error', err => {
                this.cleanup(client);
                reject(err);
            });
            client.once('connect', () => {
                this.cleanup(client);
                resolve();
            });
        });
    }
    // resolves when debugger is ready, rejects after 10 polls
    waitUntilReady() {
        const launcher = this;
        return new Promise((resolve, reject) => {
            let retries = 0;
            let waitStatus = 'Waiting for browser.';
            const poll = () => {
                if (retries === 0) {
                    log.log('ChromeLauncher', waitStatus);
                }
                retries++;
                waitStatus += '..';
                log.log('ChromeLauncher', waitStatus);
                launcher.isDebuggerReady()
                    .then(() => {
                    log.log('ChromeLauncher', waitStatus + `${log.greenify(log.tick)}`);
                    resolve();
                })
                    .catch(err => {
                    if (retries > launcher.maxConnectionRetries) {
                        log.error('ChromeLauncher', err.message);
                        const stderr = this.fs.readFileSync(`${this.userDataDir}/chrome-err.log`, { encoding: 'utf-8' });
                        log.error('ChromeLauncher', `Logging contents of ${this.userDataDir}/chrome-err.log`);
                        log.error('ChromeLauncher', stderr);
                        return reject(err);
                    }
                    utils_1.delay(launcher.connectionPollInterval).then(poll);
                });
            };
            poll();
        });
    }
    kill() {
        return new Promise((resolve, reject) => {
            if (this.chrome) {
                this.chrome.on('close', () => {
                    delete this.chrome;
                    this.destroyTmp().then(resolve);
                });
                log.log('ChromeLauncher', `Killing Chrome instance ${this.chrome.pid}`);
                try {
                    if (isWindows) {
                        execSync(`taskkill /pid ${this.chrome.pid} /T /F`);
                    }
                    else {
                        process.kill(-this.chrome.pid);
                    }
                }
                catch (err) {
                    const message = `Chrome could not be killed ${err.message}`;
                    log.warn('ChromeLauncher', message);
                    reject(new Error(message));
                }
            }
            else {
                // fail silently as we did not start chrome
                resolve();
            }
        });
    }
    destroyTmp() {
        return new Promise(resolve => {
            // Only clean up the tmp dir if we created it.
            if (this.userDataDir === undefined || this.opts.userDataDir !== undefined) {
                return resolve();
            }
            if (this.outFile) {
                this.fs.closeSync(this.outFile);
                delete this.outFile;
            }
            if (this.errFile) {
                this.fs.closeSync(this.errFile);
                delete this.errFile;
            }
            this.rimraf(this.userDataDir, () => resolve());
        });
    }
}
exports.Launcher = Launcher;
;
exports.default = Launcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hyb21lLWxhdW5jaGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Nocm9tZS1sYXVuY2hlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7OztHQUlHO0FBQ0gsWUFBWSxDQUFDOzs7Ozs7Ozs7O0FBRWIsOENBQThDO0FBQzlDLHlCQUF5QjtBQUN6QiwyQkFBMkI7QUFDM0IsaUNBQWlDO0FBQ2pDLGdEQUFnRDtBQUNoRCwrQ0FBNEM7QUFDNUMsbUNBQXNDO0FBQ3RDLG1DQUFtSztBQUVuSyxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUN6QyxNQUFNLEtBQUssR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDO0FBQ2pDLE1BQU0sUUFBUSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUM7QUFDdkMsTUFBTSxLQUFLLEdBQUcsbUJBQVcsRUFBRSxLQUFLLEtBQUssQ0FBQztBQUN0QyxNQUFNLFNBQVMsR0FBRyxtQkFBVyxFQUFFLEtBQUssT0FBTyxDQUFDO0FBQzVDLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQztBQUN6QixNQUFNLGlCQUFpQixHQUFHLEdBQUcsQ0FBQztBQUM5QixNQUFNLG9CQUFvQixHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUkxRSxNQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBNkI1QixNQUFNLGNBQWMsR0FBRyxHQUFTLEVBQUU7SUFDaEMsR0FBRyxDQUFDLENBQUMsTUFBTSxRQUFRLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUM7WUFDSCxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN4QixDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNmLENBQUM7SUFDSCxDQUFDO0lBQ0QsT0FB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

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = rimraf
rimraf.sync = rimrafSync

var assert = __webpack_require__(92)
var path = __webpack_require__(3)
var fs = __webpack_require__(1)
var glob = __webpack_require__(100)
var _0666 = parseInt('666', 8)

var defaultGlobOpts = {
  nosort: true,
  silent: true
}

// for EMFILE handling
var timeout = 0

var isWindows = (process.platform === "win32")

function defaults (options) {
  var methods = [
    'unlink',
    'chmod',
    'stat',
    'lstat',
    'rmdir',
    'readdir'
  ]
  methods.forEach(function(m) {
    options[m] = options[m] || fs[m]
    m = m + 'Sync'
    options[m] = options[m] || fs[m]
  })

  options.maxBusyTries = options.maxBusyTries || 3
  options.emfileWait = options.emfileWait || 1000
  if (options.glob === false) {
    options.disableGlob = true
  }
  options.disableGlob = options.disableGlob || false
  options.glob = options.glob || defaultGlobOpts
}

function rimraf (p, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }

  assert(p, 'rimraf: missing path')
  assert.equal(typeof p, 'string', 'rimraf: path should be a string')
  assert.equal(typeof cb, 'function', 'rimraf: callback function required')
  assert(options, 'rimraf: invalid options argument provided')
  assert.equal(typeof options, 'object', 'rimraf: options should be object')

  defaults(options)

  var busyTries = 0
  var errState = null
  var n = 0

  if (options.disableGlob || !glob.hasMagic(p))
    return afterGlob(null, [p])

  options.lstat(p, function (er, stat) {
    if (!er)
      return afterGlob(null, [p])

    glob(p, options.glob, afterGlob)
  })

  function next (er) {
    errState = errState || er
    if (--n === 0)
      cb(errState)
  }

  function afterGlob (er, results) {
    if (er)
      return cb(er)

    n = results.length
    if (n === 0)
      return cb()

    results.forEach(function (p) {
      rimraf_(p, options, function CB (er) {
        if (er) {
          if ((er.code === "EBUSY" || er.code === "ENOTEMPTY" || er.code === "EPERM") &&
              busyTries < options.maxBusyTries) {
            busyTries ++
            var time = busyTries * 100
            // try again, with the same exact callback as this one.
            return setTimeout(function () {
              rimraf_(p, options, CB)
            }, time)
          }

          // this one won't happen if graceful-fs is used.
          if (er.code === "EMFILE" && timeout < options.emfileWait) {
            return setTimeout(function () {
              rimraf_(p, options, CB)
            }, timeout ++)
          }

          // already gone
          if (er.code === "ENOENT") er = null
        }

        timeout = 0
        next(er)
      })
    })
  }
}

// Two possible strategies.
// 1. Assume it's a file.  unlink it, then do the dir stuff on EPERM or EISDIR
// 2. Assume it's a directory.  readdir, then do the file stuff on ENOTDIR
//
// Both result in an extra syscall when you guess wrong.  However, there
// are likely far more normal files in the world than directories.  This
// is based on the assumption that a the average number of files per
// directory is >= 1.
//
// If anyone ever complains about this, then I guess the strategy could
// be made configurable somehow.  But until then, YAGNI.
function rimraf_ (p, options, cb) {
  assert(p)
  assert(options)
  assert(typeof cb === 'function')

  // sunos lets the root user unlink directories, which is... weird.
  // so we have to lstat here and make sure it's not a dir.
  options.lstat(p, function (er, st) {
    if (er && er.code === "ENOENT")
      return cb(null)

    // Windows can EPERM on stat.  Life is suffering.
    if (er && er.code === "EPERM" && isWindows)
      fixWinEPERM(p, options, er, cb)

    if (st && st.isDirectory())
      return rmdir(p, options, er, cb)

    options.unlink(p, function (er) {
      if (er) {
        if (er.code === "ENOENT")
          return cb(null)
        if (er.code === "EPERM")
          return (isWindows)
            ? fixWinEPERM(p, options, er, cb)
            : rmdir(p, options, er, cb)
        if (er.code === "EISDIR")
          return rmdir(p, options, er, cb)
      }
      return cb(er)
    })
  })
}

function fixWinEPERM (p, options, er, cb) {
  assert(p)
  assert(options)
  assert(typeof cb === 'function')
  if (er)
    assert(er instanceof Error)

  options.chmod(p, _0666, function (er2) {
    if (er2)
      cb(er2.code === "ENOENT" ? null : er)
    else
      options.stat(p, function(er3, stats) {
        if (er3)
          cb(er3.code === "ENOENT" ? null : er)
        else if (stats.isDirectory())
          rmdir(p, options, er, cb)
        else
          options.unlink(p, cb)
      })
  })
}

function fixWinEPERMSync (p, options, er) {
  assert(p)
  assert(options)
  if (er)
    assert(er instanceof Error)

  try {
    options.chmodSync(p, _0666)
  } catch (er2) {
    if (er2.code === "ENOENT")
      return
    else
      throw er
  }

  try {
    var stats = options.statSync(p)
  } catch (er3) {
    if (er3.code === "ENOENT")
      return
    else
      throw er
  }

  if (stats.isDirectory())
    rmdirSync(p, options, er)
  else
    options.unlinkSync(p)
}

function rmdir (p, options, originalEr, cb) {
  assert(p)
  assert(options)
  if (originalEr)
    assert(originalEr instanceof Error)
  assert(typeof cb === 'function')

  // try to rmdir first, and only readdir on ENOTEMPTY or EEXIST (SunOS)
  // if we guessed wrong, and it's not a directory, then
  // raise the original error.
  options.rmdir(p, function (er) {
    if (er && (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM"))
      rmkids(p, options, cb)
    else if (er && er.code === "ENOTDIR")
      cb(originalEr)
    else
      cb(er)
  })
}

function rmkids(p, options, cb) {
  assert(p)
  assert(options)
  assert(typeof cb === 'function')

  options.readdir(p, function (er, files) {
    if (er)
      return cb(er)
    var n = files.length
    if (n === 0)
      return options.rmdir(p, cb)
    var errState
    files.forEach(function (f) {
      rimraf(path.join(p, f), options, function (er) {
        if (errState)
          return
        if (er)
          return cb(errState = er)
        if (--n === 0)
          options.rmdir(p, cb)
      })
    })
  })
}

// this looks simpler, and is strictly *faster*, but will
// tie up the JavaScript thread and fail on excessively
// deep directory trees.
function rimrafSync (p, options) {
  options = options || {}
  defaults(options)

  assert(p, 'rimraf: missing path')
  assert.equal(typeof p, 'string', 'rimraf: path should be a string')
  assert(options, 'rimraf: missing options')
  assert.equal(typeof options, 'object', 'rimraf: options should be object')

  var results

  if (options.disableGlob || !glob.hasMagic(p)) {
    results = [p]
  } else {
    try {
      options.lstatSync(p)
      results = [p]
    } catch (er) {
      results = glob.sync(p, options.glob)
    }
  }

  if (!results.length)
    return

  for (var i = 0; i < results.length; i++) {
    var p = results[i]

    try {
      var st = options.lstatSync(p)
    } catch (er) {
      if (er.code === "ENOENT")
        return

      // Windows can EPERM on stat.  Life is suffering.
      if (er.code === "EPERM" && isWindows)
        fixWinEPERMSync(p, options, er)
    }

    try {
      // sunos lets the root user unlink directories, which is... weird.
      if (st && st.isDirectory())
        rmdirSync(p, options, null)
      else
        options.unlinkSync(p)
    } catch (er) {
      if (er.code === "ENOENT")
        return
      if (er.code === "EPERM")
        return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er)
      if (er.code !== "EISDIR")
        throw er

      rmdirSync(p, options, er)
    }
  }
}

function rmdirSync (p, options, originalEr) {
  assert(p)
  assert(options)
  if (originalEr)
    assert(originalEr instanceof Error)

  try {
    options.rmdirSync(p)
  } catch (er) {
    if (er.code === "ENOENT")
      return
    if (er.code === "ENOTDIR")
      throw originalEr
    if (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM")
      rmkidsSync(p, options)
  }
}

function rmkidsSync (p, options) {
  assert(p)
  assert(options)
  options.readdirSync(p).forEach(function (f) {
    rimrafSync(path.join(p, f), options)
  })

  // We only end up here once we got ENOTEMPTY at least once, and
  // at this point, we are guaranteed to have removed all the kids.
  // So, we know that it won't be ENOENT or ENOTDIR or anything else.
  // try really hard to delete stuff on windows, because it has a
  // PROFOUNDLY annoying habit of not closing handles promptly when
  // files are deleted, resulting in spurious ENOTEMPTY errors.
  var retries = isWindows ? 100 : 1
  var i = 0
  do {
    var threw = true
    try {
      var ret = options.rmdirSync(p, options)
      threw = false
      return ret
    } finally {
      if (++i < retries && threw)
        continue
    }
  } while (true)
}


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var pathModule = __webpack_require__(3);
var isWindows = process.platform === 'win32';
var fs = __webpack_require__(1);

// JavaScript implementation of realpath, ported from node pre-v6

var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);

function rethrow() {
  // Only enable in debug mode. A backtrace uses ~1000 bytes of heap space and
  // is fairly slow to generate.
  var callback;
  if (DEBUG) {
    var backtrace = new Error;
    callback = debugCallback;
  } else
    callback = missingCallback;

  return callback;

  function debugCallback(err) {
    if (err) {
      backtrace.message = err.message;
      err = backtrace;
      missingCallback(err);
    }
  }

  function missingCallback(err) {
    if (err) {
      if (process.throwDeprecation)
        throw err;  // Forgot a callback but don't know where? Use NODE_DEBUG=fs
      else if (!process.noDeprecation) {
        var msg = 'fs: missing callback ' + (err.stack || err.message);
        if (process.traceDeprecation)
          console.trace(msg);
        else
          console.error(msg);
      }
    }
  }
}

function maybeCallback(cb) {
  return typeof cb === 'function' ? cb : rethrow();
}

var normalize = pathModule.normalize;

// Regexp that finds the next partion of a (partial) path
// result is [base_with_slash, base], e.g. ['somedir/', 'somedir']
if (isWindows) {
  var nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
} else {
  var nextPartRe = /(.*?)(?:[\/]+|$)/g;
}

// Regex to find the device root, including trailing slash. E.g. 'c:\\'.
if (isWindows) {
  var splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
} else {
  var splitRootRe = /^[\/]*/;
}

exports.realpathSync = function realpathSync(p, cache) {
  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return cache[p];
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstatSync(base);
      knownHard[base] = true;
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  // NB: p.length changes.
  while (pos < p.length) {
    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      continue;
    }

    var resolvedLink;
    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // some known symbolic link.  no need to stat again.
      resolvedLink = cache[base];
    } else {
      var stat = fs.lstatSync(base);
      if (!stat.isSymbolicLink()) {
        knownHard[base] = true;
        if (cache) cache[base] = base;
        continue;
      }

      // read the link if it wasn't read before
      // dev/ino always return 0 on windows, so skip the check.
      var linkTarget = null;
      if (!isWindows) {
        var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
        if (seenLinks.hasOwnProperty(id)) {
          linkTarget = seenLinks[id];
        }
      }
      if (linkTarget === null) {
        fs.statSync(base);
        linkTarget = fs.readlinkSync(base);
      }
      resolvedLink = pathModule.resolve(previous, linkTarget);
      // track this, if given a cache.
      if (cache) cache[base] = resolvedLink;
      if (!isWindows) seenLinks[id] = linkTarget;
    }

    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }

  if (cache) cache[original] = p;

  return p;
};


exports.realpath = function realpath(p, cache, cb) {
  if (typeof cb !== 'function') {
    cb = maybeCallback(cache);
    cache = null;
  }

  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return process.nextTick(cb.bind(null, null, cache[p]));
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstat(base, function(err) {
        if (err) return cb(err);
        knownHard[base] = true;
        LOOP();
      });
    } else {
      process.nextTick(LOOP);
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  function LOOP() {
    // stop if scanned past end of path
    if (pos >= p.length) {
      if (cache) cache[original] = p;
      return cb(null, p);
    }

    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      return process.nextTick(LOOP);
    }

    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // known symbolic link.  no need to stat again.
      return gotResolvedLink(cache[base]);
    }

    return fs.lstat(base, gotStat);
  }

  function gotStat(err, stat) {
    if (err) return cb(err);

    // if not a symlink, skip to the next path part
    if (!stat.isSymbolicLink()) {
      knownHard[base] = true;
      if (cache) cache[base] = base;
      return process.nextTick(LOOP);
    }

    // stat & read the link if not read before
    // call gotTarget as soon as the link target is known
    // dev/ino always return 0 on windows, so skip the check.
    if (!isWindows) {
      var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
      if (seenLinks.hasOwnProperty(id)) {
        return gotTarget(null, seenLinks[id], base);
      }
    }
    fs.stat(base, function(err) {
      if (err) return cb(err);

      fs.readlink(base, function(err, target) {
        if (!isWindows) seenLinks[id] = target;
        gotTarget(err, target);
      });
    });
  }

  function gotTarget(err, target, base) {
    if (err) return cb(err);

    var resolvedLink = pathModule.resolve(previous, target);
    if (cache) cache[base] = resolvedLink;
    gotResolvedLink(resolvedLink);
  }

  function gotResolvedLink(resolvedLink) {
    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }
};


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

var concatMap = __webpack_require__(126);
var balanced = __webpack_require__(127);

module.exports = expandTop;

var escSlash = '\0SLASH'+Math.random()+'\0';
var escOpen = '\0OPEN'+Math.random()+'\0';
var escClose = '\0CLOSE'+Math.random()+'\0';
var escComma = '\0COMMA'+Math.random()+'\0';
var escPeriod = '\0PERIOD'+Math.random()+'\0';

function numeric(str) {
  return parseInt(str, 10) == str
    ? parseInt(str, 10)
    : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash)
            .split('\\{').join(escOpen)
            .split('\\}').join(escClose)
            .split('\\,').join(escComma)
            .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\')
            .split(escOpen).join('{')
            .split(escClose).join('}')
            .split(escComma).join(',')
            .split(escPeriod).join('.');
}


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
  if (!str)
    return [''];

  var parts = [];
  var m = balanced('{', '}', str);

  if (!m)
    return str.split(',');

  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(',');

  p[p.length-1] += '{' + body + '}';
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length-1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}

function expandTop(str) {
  if (!str)
    return [];

  // I don't know why Bash 4.3 does this, but it does.
  // Anything starting with {} will have the first two bytes preserved
  // but *only* at the top level, so {},a}b will not expand to anything,
  // but a{},b}c will be expanded to [a}c,abc].
  // One could argue that this is a bug in Bash, but since the goal of
  // this module is to match Bash's rules, we escape a leading {}
  if (str.substr(0, 2) === '{}') {
    str = '\\{\\}' + str.substr(2);
  }

  return expand(escapeBraces(str), true).map(unescapeBraces);
}

function identity(e) {
  return e;
}

function embrace(str) {
  return '{' + str + '}';
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}

function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}

function expand(str, isTop) {
  var expansions = [];

  var m = balanced('{', '}', str);
  if (!m || /\$$/.test(m.pre)) return [str];

  var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
  var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
  var isSequence = isNumericSequence || isAlphaSequence;
  var isOptions = m.body.indexOf(',') >= 0;
  if (!isSequence && !isOptions) {
    // {a},b}
    if (m.post.match(/,.*\}/)) {
      str = m.pre + '{' + m.body + escClose + m.post;
      return expand(str);
    }
    return [str];
  }

  var n;
  if (isSequence) {
    n = m.body.split(/\.\./);
  } else {
    n = parseCommaParts(m.body);
    if (n.length === 1) {
      // x{{a,b}}y ==> x{a}y x{b}y
      n = expand(n[0], false).map(embrace);
      if (n.length === 1) {
        var post = m.post.length
          ? expand(m.post, false)
          : [''];
        return post.map(function(p) {
          return m.pre + n[0] + p;
        });
      }
    }
  }

  // at this point, n is the parts, and we know it's not a comma set
  // with a single entry.

  // no need to expand pre, since it is guaranteed to be free of brace-sets
  var pre = m.pre;
  var post = m.post.length
    ? expand(m.post, false)
    : [''];

  var N;

  if (isSequence) {
    var x = numeric(n[0]);
    var y = numeric(n[1]);
    var width = Math.max(n[0].length, n[1].length)
    var incr = n.length == 3
      ? Math.abs(numeric(n[2]))
      : 1;
    var test = lte;
    var reverse = y < x;
    if (reverse) {
      incr *= -1;
      test = gte;
    }
    var pad = n.some(isPadded);

    N = [];

    for (var i = x; test(i, y); i += incr) {
      var c;
      if (isAlphaSequence) {
        c = String.fromCharCode(i);
        if (c === '\\')
          c = '';
      } else {
        c = String(i);
        if (pad) {
          var need = width - c.length;
          if (need > 0) {
            var z = new Array(need + 1).join('0');
            if (i < 0)
              c = '-' + z + c.slice(1);
            else
              c = z + c;
          }
        }
      }
      N.push(c);
    }
  } else {
    N = concatMap(n, function(el) { return expand(el, false) });
  }

  for (var j = 0; j < N.length; j++) {
    for (var k = 0; k < post.length; k++) {
      var expansion = pre + N[j] + post[k];
      if (!isTop || isSequence || expansion)
        expansions.push(expansion);
    }
  }

  return expansions;
}



/***/ }),
/* 126 */
/***/ (function(module, exports) {

module.exports = function (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x)) res.push.apply(res, x);
        else res.push(x);
    }
    return res;
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = balanced;
function balanced(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);

  var r = range(a, b, str);

  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}

function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}

balanced.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;

  if (ai >= 0 && bi > 0) {
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [ begs.pop(), bi ];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) {
      result = [ left, right ];
    }
  }

  return result;
}


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = globSync
globSync.GlobSync = GlobSync

var fs = __webpack_require__(1)
var rp = __webpack_require__(101)
var minimatch = __webpack_require__(93)
var Minimatch = minimatch.Minimatch
var Glob = __webpack_require__(100).Glob
var util = __webpack_require__(0)
var path = __webpack_require__(3)
var assert = __webpack_require__(92)
var isAbsolute = __webpack_require__(94)
var common = __webpack_require__(102)
var alphasort = common.alphasort
var alphasorti = common.alphasorti
var setopts = common.setopts
var ownProp = common.ownProp
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

function globSync (pattern, options) {
  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  return new GlobSync(pattern, options).found
}

function GlobSync (pattern, options) {
  if (!pattern)
    throw new Error('must provide pattern')

  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  if (!(this instanceof GlobSync))
    return new GlobSync(pattern, options)

  setopts(this, pattern, options)

  if (this.noprocess)
    return this

  var n = this.minimatch.set.length
  this.matches = new Array(n)
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false)
  }
  this._finish()
}

GlobSync.prototype._finish = function () {
  assert(this instanceof GlobSync)
  if (this.realpath) {
    var self = this
    this.matches.forEach(function (matchset, index) {
      var set = self.matches[index] = Object.create(null)
      for (var p in matchset) {
        try {
          p = self._makeAbs(p)
          var real = rp.realpathSync(p, self.realpathCache)
          set[real] = true
        } catch (er) {
          if (er.syscall === 'stat')
            set[self._makeAbs(p)] = true
          else
            throw er
        }
      }
    })
  }
  common.finish(this)
}


GlobSync.prototype._process = function (pattern, index, inGlobStar) {
  assert(this instanceof GlobSync)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === 'string') {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // See if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index)
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var remain = pattern.slice(n)

  // get the list of entries.
  var read
  if (prefix === null)
    read = '.'
  else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix
    read = prefix
  } else
    read = prefix

  var abs = this._makeAbs(read)

  //if ignored, skip processing
  if (childrenIgnored(this, read))
    return

  var isGlobStar = remain[0] === minimatch.GLOBSTAR
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar)
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar)
}


GlobSync.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar) {
  var entries = this._readdir(abs, inGlobStar)

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0]
  var negate = !!this.minimatch.negate
  var rawGlob = pn._glob
  var dotOk = this.dot || rawGlob.charAt(0) === '.'

  var matchedEntries = []
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i]
    if (e.charAt(0) !== '.' || dotOk) {
      var m
      if (negate && !prefix) {
        m = !e.match(pn)
      } else {
        m = e.match(pn)
      }
      if (m)
        matchedEntries.push(e)
    }
  }

  var len = matchedEntries.length
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null)

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i]
      if (prefix) {
        if (prefix.slice(-1) !== '/')
          e = prefix + '/' + e
        else
          e = prefix + e
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e)
      }
      this._emitMatch(index, e)
    }
    // This was the last one, and no stats were needed
    return
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift()
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i]
    var newPattern
    if (prefix)
      newPattern = [prefix, e]
    else
      newPattern = [e]
    this._process(newPattern.concat(remain), index, inGlobStar)
  }
}


GlobSync.prototype._emitMatch = function (index, e) {
  if (isIgnored(this, e))
    return

  var abs = this._makeAbs(e)

  if (this.mark)
    e = this._mark(e)

  if (this.absolute) {
    e = abs
  }

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true

  if (this.stat)
    this._stat(e)
}


GlobSync.prototype._readdirInGlobStar = function (abs) {
  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false)

  var entries
  var lstat
  var stat
  try {
    lstat = fs.lstatSync(abs)
  } catch (er) {
    if (er.code === 'ENOENT') {
      // lstat failed, doesn't exist
      return null
    }
  }

  var isSym = lstat && lstat.isSymbolicLink()
  this.symlinks[abs] = isSym

  // If it's not a symlink or a dir, then it's definitely a regular file.
  // don't bother doing a readdir in that case.
  if (!isSym && lstat && !lstat.isDirectory())
    this.cache[abs] = 'FILE'
  else
    entries = this._readdir(abs, false)

  return entries
}

GlobSync.prototype._readdir = function (abs, inGlobStar) {
  var entries

  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE')
      return null

    if (Array.isArray(c))
      return c
  }

  try {
    return this._readdirEntries(abs, fs.readdirSync(abs))
  } catch (er) {
    this._readdirError(abs, er)
    return null
  }
}

GlobSync.prototype._readdirEntries = function (abs, entries) {
  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i]
      if (abs === '/')
        e = abs + e
      else
        e = abs + '/' + e
      this.cache[e] = true
    }
  }

  this.cache[abs] = entries

  // mark and cache dir-ness
  return entries
}

GlobSync.prototype._readdirError = function (f, er) {
  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        throw error
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false
      if (this.strict)
        throw er
      if (!this.silent)
        console.error('glob error', er)
      break
  }
}

GlobSync.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar) {

  var entries = this._readdir(abs, inGlobStar)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1)
  var gspref = prefix ? [ prefix ] : []
  var noGlobStar = gspref.concat(remainWithoutGlobStar)

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false)

  var len = entries.length
  var isSym = this.symlinks[abs]

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return

  for (var i = 0; i < len; i++) {
    var e = entries[i]
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true)
  }
}

GlobSync.prototype._processSimple = function (prefix, index) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var exists = this._stat(prefix)

  if (!this.matches[index])
    this.matches[index] = Object.create(null)

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix)
    } else {
      prefix = path.resolve(this.root, prefix)
      if (trail)
        prefix += '/'
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/')

  // Mark this as a match
  this._emitMatch(index, prefix)
}

// Returns either 'DIR', 'FILE', or false
GlobSync.prototype._stat = function (f) {
  var abs = this._makeAbs(f)
  var needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength)
    return false

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c))
      c = 'DIR'

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return c

    if (needDir && c === 'FILE')
      return false

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists
  var stat = this.statCache[abs]
  if (!stat) {
    var lstat
    try {
      lstat = fs.lstatSync(abs)
    } catch (er) {
      if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
        this.statCache[abs] = false
        return false
      }
    }

    if (lstat && lstat.isSymbolicLink()) {
      try {
        stat = fs.statSync(abs)
      } catch (er) {
        stat = lstat
      }
    } else {
      stat = lstat
    }
  }

  this.statCache[abs] = stat

  var c = true
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE'

  this.cache[abs] = this.cache[abs] || c

  if (needDir && c === 'FILE')
    return false

  return c
}

GlobSync.prototype._mark = function (p) {
  return common.mark(this, p)
}

GlobSync.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

var wrappy = __webpack_require__(103)
var reqs = Object.create(null)
var once = __webpack_require__(104)

module.exports = wrappy(inflight)

function inflight (key, cb) {
  if (reqs[key]) {
    reqs[key].push(cb)
    return null
  } else {
    reqs[key] = [cb]
    return makeres(key)
  }
}

function makeres (key) {
  return once(function RES () {
    var cbs = reqs[key]
    var len = cbs.length
    var args = slice(arguments)

    // XXX It's somewhat ambiguous whether a new callback added in this
    // pass should be queued for later execution if something in the
    // list of callbacks throws, or if it should just be discarded.
    // However, it's such an edge case that it hardly matters, and either
    // choice is likely as surprising as the other.
    // As it happens, we do go ahead and schedule it for later execution.
    try {
      for (var i = 0; i < len; i++) {
        cbs[i].apply(null, args)
      }
    } finally {
      if (cbs.length > len) {
        // added more in the interim.
        // de-zalgo, just in case, but don't call again.
        cbs.splice(0, len)
        process.nextTick(function () {
          RES.apply(null, args)
        })
      } else {
        delete reqs[key]
      }
    }
  })
}

function slice (args) {
  var length = args.length
  var array = []

  for (var i = 0; i < length; i++) array[i] = args[i]
  return array
}


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(1);
const path = __webpack_require__(3);
const execSync = __webpack_require__(90).execSync;
const execFileSync = __webpack_require__(90).execFileSync;
const log = __webpack_require__(87);
const utils_1 = __webpack_require__(105);
const newLineRegex = /\r?\n/;
function darwin() {
    const suffixes = ['/Contents/MacOS/Google Chrome Canary', '/Contents/MacOS/Google Chrome'];
    const LSREGISTER = '/System/Library/Frameworks/CoreServices.framework' +
        '/Versions/A/Frameworks/LaunchServices.framework' +
        '/Versions/A/Support/lsregister';
    const installations = [];
    const customChromePath = resolveChromePath();
    if (customChromePath) {
        installations.push(customChromePath);
    }
    execSync(`${LSREGISTER} -dump` +
        ' | grep -i \'google chrome\\( canary\\)\\?.app$\'' +
        ' | awk \'{$1=""; print $0}\'')
        .toString()
        .split(newLineRegex)
        .forEach((inst) => {
        suffixes.forEach(suffix => {
            const execPath = path.join(inst.trim(), suffix);
            if (canAccess(execPath)) {
                installations.push(execPath);
            }
        });
    });
    // Retains one per line to maintain readability.
    // clang-format off
    const priorities = [
        { regex: new RegExp(`^${process.env.HOME}/Applications/.*Chrome.app`), weight: 50 },
        { regex: new RegExp(`^${process.env.HOME}/Applications/.*Chrome Canary.app`), weight: 51 },
        { regex: /^\/Applications\/.*Chrome.app/, weight: 100 },
        { regex: /^\/Applications\/.*Chrome Canary.app/, weight: 101 },
        { regex: /^\/Volumes\/.*Chrome.app/, weight: -2 },
        { regex: /^\/Volumes\/.*Chrome Canary.app/, weight: -1 },
    ];
    if (process.env.LIGHTHOUSE_CHROMIUM_PATH) {
        priorities.unshift({ regex: new RegExp(`${process.env.LIGHTHOUSE_CHROMIUM_PATH}`), weight: 150 });
    }
    if (process.env.CHROME_PATH) {
        priorities.unshift({ regex: new RegExp(`${process.env.CHROME_PATH}`), weight: 151 });
    }
    // clang-format on
    return sort(installations, priorities);
}
exports.darwin = darwin;
function resolveChromePath() {
    if (canAccess(`${process.env.CHROME_PATH}`)) {
        return process.env.CHROME_PATH;
    }
    if (canAccess(`${process.env.LIGHTHOUSE_CHROMIUM_PATH}`)) {
        log.warn('ChromeLauncher', 'LIGHTHOUSE_CHROMIUM_PATH is deprecated, use CHROME_PATH env variable instead.');
        return process.env.LIGHTHOUSE_CHROMIUM_PATH;
    }
    return undefined;
}
/**
 * Look for linux executables in 3 ways
 * 1. Look into CHROME_PATH env variable
 * 2. Look into the directories where .desktop are saved on gnome based distro's
 * 3. Look for google-chrome-stable & google-chrome executables by using the which command
 */
function linux() {
    let installations = [];
    // 1. Look into CHROME_PATH env variable
    const customChromePath = resolveChromePath();
    if (customChromePath) {
        installations.push(customChromePath);
    }
    // 2. Look into the directories where .desktop are saved on gnome based distro's
    const desktopInstallationFolders = [
        path.join(__webpack_require__(36).homedir(), '.local/share/applications/'),
        '/usr/share/applications/',
    ];
    desktopInstallationFolders.forEach(folder => {
        installations = installations.concat(findChromeExecutables(folder));
    });
    // Look for google-chrome(-stable) & chromium(-browser) executables by using the which command
    const executables = [
        'google-chrome-stable',
        'google-chrome',
        'chromium-browser',
        'chromium',
    ];
    executables.forEach((executable) => {
        try {
            const chromePath = execFileSync('which', [executable], { stdio: 'pipe' }).toString().split(newLineRegex)[0];
            if (canAccess(chromePath)) {
                installations.push(chromePath);
            }
        }
        catch (e) {
            // Not installed.
        }
    });
    if (!installations.length) {
        throw new utils_1.ChromePathNotSetError();
    }
    const priorities = [
        { regex: /chrome-wrapper$/, weight: 51 },
        { regex: /google-chrome-stable$/, weight: 50 },
        { regex: /google-chrome$/, weight: 49 },
        { regex: /chromium-browser$/, weight: 48 },
        { regex: /chromium$/, weight: 47 },
    ];
    if (process.env.LIGHTHOUSE_CHROMIUM_PATH) {
        priorities.unshift({ regex: new RegExp(`${process.env.LIGHTHOUSE_CHROMIUM_PATH}`), weight: 100 });
    }
    if (process.env.CHROME_PATH) {
        priorities.unshift({ regex: new RegExp(`${process.env.CHROME_PATH}`), weight: 101 });
    }
    return sort(uniq(installations.filter(Boolean)), priorities);
}
exports.linux = linux;
function wsl() {
    // Manually populate the environment variables assuming it's the default config
    process.env.LOCALAPPDATA = utils_1.getLocalAppDataPath(`${process.env.PATH}`);
    process.env.PROGRAMFILES = '/mnt/c/Program Files';
    process.env['PROGRAMFILES(X86)'] = '/mnt/c/Program Files (x86)';
    return win32();
}
exports.wsl = wsl;
function win32() {
    const installations = [];
    const suffixes = [
        `${path.sep}Google${path.sep}Chrome SxS${path.sep}Application${path.sep}chrome.exe`,
        `${path.sep}Google${path.sep}Chrome${path.sep}Application${path.sep}chrome.exe`
    ];
    const prefixes = [
        process.env.LOCALAPPDATA, process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)']
    ].filter(Boolean);
    const customChromePath = resolveChromePath();
    if (customChromePath) {
        installations.push(customChromePath);
    }
    prefixes.forEach(prefix => suffixes.forEach(suffix => {
        const chromePath = path.join(prefix, suffix);
        if (canAccess(chromePath)) {
            installations.push(chromePath);
        }
    }));
    return installations;
}
exports.win32 = win32;
function sort(installations, priorities) {
    const defaultPriority = 10;
    return installations
        .map((inst) => {
        for (const pair of priorities) {
            if (pair.regex.test(inst)) {
                return { path: inst, weight: pair.weight };
            }
        }
        return { path: inst, weight: defaultPriority };
    })
        .sort((a, b) => (b.weight - a.weight))
        .map(pair => pair.path);
}
function canAccess(file) {
    if (!file) {
        return false;
    }
    try {
        fs.accessSync(file);
        return true;
    }
    catch (e) {
        return false;
    }
}
function uniq(arr) {
    return Array.from(new Set(arr));
}
function findChromeExecutables(folder) {
    const argumentsRegex = /(^[^ ]+).*/; // Take everything up to the first space
    const chromeExecRegex = '^Exec=\/.*\/(google-chrome|chrome|chromium)-.*';
    let installations = [];
    if (canAccess(folder)) {
        // Output of the grep & print looks like:
        //    /opt/google/chrome/google-chrome --profile-directory
        //    /home/user/Downloads/chrome-linux/chrome-wrapper %U
        let execPaths;
        // Some systems do not support grep -R so fallback to -r.
        // See https://github.com/GoogleChrome/chrome-launcher/issues/46 for more context.
        try {
            execPaths = execSync(`grep -ER "${chromeExecRegex}" ${folder} | awk -F '=' '{print $2}'`);
        }
        catch (e) {
            execPaths = execSync(`grep -Er "${chromeExecRegex}" ${folder} | awk -F '=' '{print $2}'`);
        }
        execPaths = execPaths.toString()
            .split(newLineRegex)
            .map((execPath) => execPath.replace(argumentsRegex, '$1'));
        execPaths.forEach((execPath) => canAccess(execPath) && installations.push(execPath));
    }
    return installations;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hyb21lLWZpbmRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jaHJvbWUtZmluZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0dBSUc7QUFDSCxZQUFZLENBQUM7O0FBRWIsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pCLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsUUFBUSxDQUFDO0FBQ25ELE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxZQUFZLENBQUM7QUFDM0QsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFFekMsbUNBQW1FO0FBRW5FLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQztBQUk3QjtJQUNFLE1BQU0sUUFBUSxHQUFHLENBQUMsc0NBQXNDLEVBQUUsK0JBQStCLENBQUMsQ0FBQztJQUUzRixNQUFNLFVBQVUsR0FBRyxtREFBbUQ7UUFDbEUsaURBQWlEO1FBQ2pELGdDQUFnQyxDQUFDO0lBRXJDLE1BQU0sYUFBYSxHQUFrQixFQUFFLENBQUM7SUFFeEMsTUFBTSxnQkFBZ0IsR0FBRyxpQkFBaUIsRUFBRSxDQUFDO0lBQzdDLEVBQUUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztRQUNyQixhQUFhLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELFFBQVEsQ0FDSixHQUFHLFVBQVUsUUFBUTtRQUNyQixtREFBbUQ7UUFDbkQsOEJBQThCLENBQUM7U0FDOUIsUUFBUSxFQUFFO1NBQ1YsS0FBSyxDQUFDLFlBQVksQ0FBQztTQUNuQixPQUFPLENBQUMsQ0FBQyxJQUFZLEVBQUUsRUFBRTtRQUN4QixRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3hCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ2hELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDL0IsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFUCxnREFBZ0Q7SUFDaEQsbUJBQW1CO0lBQ25CLE1BQU0sVUFBVSxHQUFlO1FBQzdCLEVBQUMsS0FBSyxFQUFFLElBQUksTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLDRCQUE0QixDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBQztRQUNqRixFQUFDLEtBQUssRUFBRSxJQUFJLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxtQ0FBbUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUM7UUFDeEYsRUFBQyxLQUFLLEVBQUUsK0JBQStCLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBQztRQUNyRCxFQUFDLEtBQUssRUFBRSxzQ0FBc0MsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFDO1FBQzVELEVBQUMsS0FBSyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBQztRQUMvQyxFQUFDLEtBQUssRUFBRSxpQ0FBaUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUM7S0FDdkQsQ0FBQztJQUVGLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBQyxLQUFLLEVBQUUsSUFBSSxNQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztJQUNsRyxDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzVCLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBQyxLQUFLLEVBQUUsSUFBSSxNQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUM7SUFDckYsQ0FBQztJQUVELGtCQUFrQjtJQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN6QyxDQUFDO0FBbERELHdCQWtEQztBQUVEO0lBQ0UsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUM7SUFDakMsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6RCxHQUFHLENBQUMsSUFBSSxDQUNKLGdCQUFnQixFQUNoQiwrRUFBK0UsQ0FBQyxDQUFDO1FBQ3JGLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDO0lBQzlDLENBQUM7SUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ25CLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNIO0lBQ0UsSUFBSSxhQUFhLEdBQWEsRUFBRSxDQUFDO0lBRWpDLHdDQUF3QztJQUN4QyxNQUFNLGdCQUFnQixHQUFHLGlCQUFpQixFQUFFLENBQUM7SUFDN0MsRUFBRSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLGFBQWEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQsZ0ZBQWdGO0lBQ2hGLE1BQU0sMEJBQTBCLEdBQUc7UUFDakMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsNEJBQTRCLENBQUM7UUFDaEUsMEJBQTBCO0tBQzNCLENBQUM7SUFDRiwwQkFBMEIsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDMUMsYUFBYSxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUN0RSxDQUFDLENBQUMsQ0FBQztJQUVILDhGQUE4RjtJQUM5RixNQUFNLFdBQVcsR0FBRztRQUNsQixzQkFBc0I7UUFDdEIsZUFBZTtRQUNmLGtCQUFrQjtRQUNsQixVQUFVO0tBQ1gsQ0FBQztJQUNGLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFrQixFQUFFLEVBQUU7UUFDekMsSUFBSSxDQUFDO1lBQ0gsTUFBTSxVQUFVLEdBQ1osWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTNGLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDakMsQ0FBQztRQUNILENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1gsaUJBQWlCO1FBQ25CLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDMUIsTUFBTSxJQUFJLDZCQUFxQixFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUVELE1BQU0sVUFBVSxHQUFlO1FBQzdCLEVBQUMsS0FBSyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUM7UUFDdEMsRUFBQyxLQUFLLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBQztRQUM1QyxFQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFDO1FBQ3JDLEVBQUMsS0FBSyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUM7UUFDeEMsRUFBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUM7S0FDakMsQ0FBQztJQUVGLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBQyxLQUFLLEVBQUUsSUFBSSxNQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztJQUNsRyxDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzVCLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBQyxLQUFLLEVBQUUsSUFBSSxNQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUM7SUFDckYsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMvRCxDQUFDO0FBM0RELHNCQTJEQztBQUVEO0lBQ0UsK0VBQStFO0lBQy9FLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLDJCQUFtQixDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3RFLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxHQUFHLHNCQUFzQixDQUFDO0lBQ2xELE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsR0FBRyw0QkFBNEIsQ0FBQztJQUVoRSxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDakIsQ0FBQztBQVBELGtCQU9DO0FBRUQ7SUFDRSxNQUFNLGFBQWEsR0FBa0IsRUFBRSxDQUFDO0lBQ3hDLE1BQU0sUUFBUSxHQUFHO1FBQ2YsR0FBRyxJQUFJLENBQUMsR0FBRyxTQUFTLElBQUksQ0FBQyxHQUFHLGFBQWEsSUFBSSxDQUFDLEdBQUcsY0FBYyxJQUFJLENBQUMsR0FBRyxZQUFZO1FBQ25GLEdBQUcsSUFBSSxDQUFDLEdBQUcsU0FBUyxJQUFJLENBQUMsR0FBRyxTQUFTLElBQUksQ0FBQyxHQUFHLGNBQWMsSUFBSSxDQUFDLEdBQUcsWUFBWTtLQUNoRixDQUFDO0lBQ0YsTUFBTSxRQUFRLEdBQUc7UUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDO0tBQ3JGLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRWxCLE1BQU0sZ0JBQWdCLEdBQUcsaUJBQWlCLEVBQUUsQ0FBQztJQUM3QyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7UUFDckIsYUFBYSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUNuRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM3QyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFCLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDakMsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDSixNQUFNLENBQUMsYUFBYSxDQUFDO0FBQ3ZCLENBQUM7QUF0QkQsc0JBc0JDO0FBRUQsY0FBYyxhQUF1QixFQUFFLFVBQXNCO0lBQzNELE1BQU0sZUFBZSxHQUFHLEVBQUUsQ0FBQztJQUMzQixNQUFNLENBQUMsYUFBYTtTQUVmLEdBQUcsQ0FBQyxDQUFDLElBQVksRUFBRSxFQUFFO1FBQ3BCLEdBQUcsQ0FBQyxDQUFDLE1BQU0sSUFBSSxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDOUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixNQUFNLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFDLENBQUM7WUFDM0MsQ0FBQztRQUNILENBQUM7UUFDRCxNQUFNLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUMsQ0FBQztJQUMvQyxDQUFDLENBQUM7U0FFRCxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBRXJDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixDQUFDO0FBRUQsbUJBQW1CLElBQVk7SUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ1YsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCxJQUFJLENBQUM7UUFDSCxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDZixDQUFDO0FBQ0gsQ0FBQztBQUVELGNBQWMsR0FBZTtJQUMzQixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLENBQUM7QUFFRCwrQkFBK0IsTUFBYztJQUMzQyxNQUFNLGNBQWMsR0FBRyxZQUFZLENBQUMsQ0FBQyx3Q0FBd0M7SUFDN0UsTUFBTSxlQUFlLEdBQUcsZ0RBQWdELENBQUM7SUFFekUsSUFBSSxhQUFhLEdBQWtCLEVBQUUsQ0FBQztJQUN0QyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLHlDQUF5QztRQUN6QywwREFBMEQ7UUFDMUQseURBQXlEO1FBQ3pELElBQUksU0FBUyxDQUFDO1FBRWQseURBQXlEO1FBQ3pELGtGQUFrRjtRQUNsRixJQUFJLENBQUM7WUFDSCxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsZUFBZSxLQUFLLE1BQU0sNEJBQTRCLENBQUMsQ0FBQztRQUM1RixDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNYLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxlQUFlLEtBQUssTUFBTSw0QkFBNEIsQ0FBQyxDQUFDO1FBQzVGLENBQUM7UUFFRCxTQUFTLEdBQUcsU0FBUyxDQUFDLFFBQVEsRUFBRTthQUNmLEtBQUssQ0FBQyxZQUFZLENBQUM7YUFDbkIsR0FBRyxDQUFDLENBQUMsUUFBZ0IsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUVuRixTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBZ0IsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUMvRixDQUFDO0lBRUQsTUFBTSxDQUFDLGFBQWEsQ0FBQztBQUN2QixDQUFDIn0=

/***/ }),
/* 131 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mark", function() { return mark; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stop", function() { return stop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getEntries", function() { return getEntries; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clear", function() { return clear; });
/* global performance */
var perf = typeof performance !== 'undefined' && performance;

var nowForNode;

{
  // implementation borrowed from:
  // https://github.com/myrne/performance-now/blob/6223a0d544bae1d5578dd7431f78b4ec7d65b15c/src/performance-now.coffee
  var hrtime = process.hrtime;
  var getNanoSeconds = function () {
    var hr = hrtime();
    return hr[0] * 1e9 + hr[1]
  };
  var loadTime = getNanoSeconds();
  nowForNode = function () { return ((getNanoSeconds() - loadTime) / 1e6); };
}

var now = nowForNode;

function throwIfEmpty (name) {
  if (!name) {
    throw new Error('name must be non-empty')
  }
}

// simple binary sort insertion
function insertSorted (arr, item) {
  var low = 0;
  var high = arr.length;
  var mid;
  while (low < high) {
    mid = (low + high) >>> 1; // like (num / 2) but faster
    if (arr[mid].startTime < item.startTime) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  arr.splice(low, 0, item);
}

var mark;
var stop;
var getEntries;
var clear;

if (perf && perf.mark) {
  mark = function (name) {
    throwIfEmpty(name);
    perf.mark(("start " + name));
  };
  stop = function (name) {
    throwIfEmpty(name);
    perf.mark(("end " + name));
    perf.measure(name, ("start " + name), ("end " + name));
    var entries = perf.getEntriesByName(name);
    return entries[entries.length - 1]
  };
  getEntries = function () { return perf.getEntriesByType('measure'); };
  clear = function () {
    perf.clearMarks();
    perf.clearMeasures();
  };
} else {
  var marks = {};
  var entries = [];
  mark = function (name) {
    throwIfEmpty(name);
    var startTime = now();
    marks['$' + name] = startTime;
  };
  stop = function (name) {
    throwIfEmpty(name);
    var endTime = now();
    var startTime = marks['$' + name];
    if (!startTime) {
      throw new Error(("no known mark: " + name))
    }
    var entry = {
      startTime: startTime,
      name: name,
      duration: endTime - startTime,
      entryType: 'measure'
    };
    // per the spec this should be at least 150:
    // https://www.w3.org/TR/resource-timing-1/#extensions-performance-interface
    // we just have no limit, per Chrome and Edge's de-facto behavior
    insertSorted(entries, entry);
    return entry
  };
  getEntries = function () { return entries; };
  clear = function () {
    marks = {};
    entries = [];
  };
}




/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(3);
var fs = __webpack_require__(1);
var _0777 = parseInt('0777', 8);

module.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;

function mkdirP (p, opts, f, made) {
    if (typeof opts === 'function') {
        f = opts;
        opts = {};
    }
    else if (!opts || typeof opts !== 'object') {
        opts = { mode: opts };
    }
    
    var mode = opts.mode;
    var xfs = opts.fs || fs;
    
    if (mode === undefined) {
        mode = _0777 & (~process.umask());
    }
    if (!made) made = null;
    
    var cb = f || function () {};
    p = path.resolve(p);
    
    xfs.mkdir(p, mode, function (er) {
        if (!er) {
            made = made || p;
            return cb(null, made);
        }
        switch (er.code) {
            case 'ENOENT':
                mkdirP(path.dirname(p), opts, function (er, made) {
                    if (er) cb(er, made);
                    else mkdirP(p, opts, cb, made);
                });
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                xfs.stat(p, function (er2, stat) {
                    // if the stat fails, then that's super weird.
                    // let the original error be the failure reason.
                    if (er2 || !stat.isDirectory()) cb(er, made)
                    else cb(null, made);
                });
                break;
        }
    });
}

mkdirP.sync = function sync (p, opts, made) {
    if (!opts || typeof opts !== 'object') {
        opts = { mode: opts };
    }
    
    var mode = opts.mode;
    var xfs = opts.fs || fs;
    
    if (mode === undefined) {
        mode = _0777 & (~process.umask());
    }
    if (!made) made = null;

    p = path.resolve(p);

    try {
        xfs.mkdirSync(p, mode);
        made = made || p;
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT' :
                made = sync(path.dirname(p), opts, made);
                sync(p, opts, made);
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                var stat;
                try {
                    stat = xfs.statSync(p);
                }
                catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) throw err0;
                break;
        }
    }

    return made;
};


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const os = __webpack_require__(36);
const fs = __webpack_require__(1);

const isWsl = () => {
	if (process.platform !== 'linux') {
		return false;
	}

	if (os.release().includes('Microsoft')) {
		return true;
	}

	try {
		return fs.readFileSync('/proc/version', 'utf8').includes('Microsoft');
	} catch (err) {
		return false;
	}
};

if (process.env.__IS_WSL_TEST__) {
	module.exports = isWsl;
} else {
	module.exports = isWsl();
}


/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __webpack_require__(9);
/**
 * Return a random, unused port.
 */
function getRandomPort() {
    return new Promise((resolve, reject) => {
        const server = http_1.createServer();
        server.listen(0);
        server.once('listening', () => {
            const port = server.address().port;
            server.close(() => resolve(port));
        });
        server.once('error', reject);
    });
}
exports.getRandomPort = getRandomPort;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZG9tLXBvcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcmFuZG9tLXBvcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRztBQUNILFlBQVksQ0FBQzs7QUFFYiwrQkFBa0M7QUFFbEM7O0dBRUc7QUFDSDtJQUNFLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUNyQyxNQUFNLE1BQU0sR0FBRyxtQkFBWSxFQUFFLENBQUM7UUFDOUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7WUFDNUIsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQztZQUNuQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDL0IsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBVkQsc0NBVUMifQ==

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_FLAGS = [
    // Disable built-in Google Translate service
    '--disable-translate',
    // Disable all chrome extensions entirely
    '--disable-extensions',
    // Disable various background network services, including extension updating,
    //   safe browsing service, upgrade detector, translate, UMA
    '--disable-background-networking',
    // Disable fetching safebrowsing lists, likely redundant due to disable-background-networking
    '--safebrowsing-disable-auto-update',
    // Disable syncing to a Google account
    '--disable-sync',
    // Disable reporting to UMA, but allows for collection
    '--metrics-recording-only',
    // Disable installation of default apps on first run
    '--disable-default-apps',
    // Mute any audio
    '--mute-audio',
    // Skip first run wizards
    '--no-first-run',
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxhZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZmxhZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRztBQUNILFlBQVksQ0FBQzs7QUFFQSxRQUFBLGFBQWEsR0FBRztJQUMzQiw0Q0FBNEM7SUFDNUMscUJBQXFCO0lBQ3JCLHlDQUF5QztJQUN6QyxzQkFBc0I7SUFDdEIsNkVBQTZFO0lBQzdFLDREQUE0RDtJQUM1RCxpQ0FBaUM7SUFDakMsNkZBQTZGO0lBQzdGLG9DQUFvQztJQUNwQyxzQ0FBc0M7SUFDdEMsZ0JBQWdCO0lBQ2hCLHNEQUFzRDtJQUN0RCwwQkFBMEI7SUFDMUIsb0RBQW9EO0lBQ3BELHdCQUF3QjtJQUN4QixpQkFBaUI7SUFDakIsY0FBYztJQUNkLHlCQUF5QjtJQUN6QixnQkFBZ0I7Q0FDakIsQ0FBQyJ9

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */


const Runner = __webpack_require__(106);
const log = __webpack_require__(87);
const ChromeProtocol = __webpack_require__(137);
const Config = __webpack_require__(143);

const URL = __webpack_require__(99);
const LHError = __webpack_require__(95);

/** @typedef {import('./gather/connections/connection.js')} Connection */

/*
 * The relationship between these root modules:
 *
 *   index.js  - the require('lighthouse') hook for Node modules (including the CLI)
 *
 *   runner.js - marshalls the actions that must be taken (Gather / Audit)
 *               config file is used to determine which of these actions are needed
 *
 *         lighthouse-cli \
 *                         -- core/index.js ----> runner.js ----> [Gather / Audit]
 *   lighthouse-extension /
 */

/**
 * Run Lighthouse.
 * @param {string=} url The URL to test. Optional if running in auditMode.
 * @param {LH.Flags=} flags Optional settings for the Lighthouse run. If present,
 *   they will override any settings in the config.
 * @param {LH.Config.Json=} configJSON Configuration for the Lighthouse run. If
 *   not present, the default config is used.
 * @param {Connection=} connection
 * @return {Promise<LH.RunnerResult|undefined>}
 */
async function lighthouse(url, flags = {}, configJSON, connection) {
  // verify the url is valid and that protocol is allowed
  if (url && (!URL.isValid(url) || !URL.isProtocolAllowed(url))) {
    throw new LHError(LHError.errors.INVALID_URL);
  }

  // set logging preferences, assume quiet
  flags.logLevel = flags.logLevel || 'error';
  log.setLevel(flags.logLevel);

  const config = generateConfig(configJSON, flags);

  connection = connection || new ChromeProtocol(flags.port, flags.hostname);

  // kick off a lighthouse run
  return Runner.run(connection, {url, config});
}

/**
 * Generate a Lighthouse Config.
 * @param {LH.Config.Json=} configJson Configuration for the Lighthouse run. If
 *   not present, the default config is used.
 * @param {LH.Flags=} flags Optional settings for the Lighthouse run. If present,
 *   they will override any settings in the config.
 * @return {Config}
 */
function generateConfig(configJson, flags) {
  return new Config(configJson, flags);
}

lighthouse.generateConfig = generateConfig;
lighthouse.getAuditList = Runner.getAuditList;
lighthouse.traceCategories = __webpack_require__(118).traceCategories;
lighthouse.Audit = __webpack_require__(115);
lighthouse.Gatherer = __webpack_require__(155);

module.exports = lighthouse;


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */


const Connection = __webpack_require__(107);
const WebSocket = __webpack_require__(138);
const http = __webpack_require__(9);
const log = __webpack_require__(87);

const DEFAULT_HOSTNAME = 'localhost';
const CONNECT_TIMEOUT = 10000;
const DEFAULT_PORT = 9222;

class CriConnection extends Connection {
  /**
   * @param {number=} port Optional port number. Defaults to 9222;
   * @param {string=} hostname Optional hostname. Defaults to localhost.
   * @constructor
   */
  constructor(port = DEFAULT_PORT, hostname = DEFAULT_HOSTNAME) {
    super();
    this.port = port;
    this.hostname = hostname;
    this._ws = null;
    this._pageId = null;
  }

  /**
   * @override
   * @return {Promise<void>}
   */
  connect() {
    return this._runJsonCommand('new')
      .then(response => this._connectToSocket(/** @type {LH.DevToolsJsonTarget} */(response)))
      .catch(_ => {
        // Compat: headless didn't support `/json/new` before m59. (#970, crbug.com/699392)
        // If no support, we fallback and reuse an existing open tab
        log.warn('CriConnection', 'Cannot create new tab; reusing open tab.');
        return this._runJsonCommand('list').then(tabs => {
          if (!Array.isArray(tabs) || tabs.length === 0) {
            return Promise.reject(new Error('Cannot create new tab, and no tabs already open.'));
          }
          const firstTab = tabs[0];
          // first, we activate it to a foreground tab, then we connect
          return this._runJsonCommand(`activate/${firstTab.id}`)
              .then(() => this._connectToSocket(firstTab));
        });
      });
  }

  /**
   * @param {LH.DevToolsJsonTarget} response
   * @return {Promise<void>}
   * @private
   */
  _connectToSocket(response) {
    const url = response.webSocketDebuggerUrl;
    this._pageId = response.id;

    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url, {
        perMessageDeflate: false,
      });
      ws.on('open', () => {
        this._ws = ws;
        resolve();
      });
      ws.on('message', data => this.handleRawMessage(/** @type {string} */ (data)));
      ws.on('close', this.dispose.bind(this));
      ws.on('error', reject);
    });
  }

  /**
   * @param {string} command
   * @return {Promise<LH.DevToolsJsonTarget | Array<LH.DevToolsJsonTarget> | {message: string}>}
   * @private
   */
  _runJsonCommand(command) {
    // TODO(bckenny): can base type on command once conditional types land in TS
    return new Promise((resolve, reject) => {
      const request = http.get({
        hostname: this.hostname,
        port: this.port,
        path: '/json/' + command,
      }, response => {
        let data = '';
        response.on('data', chunk => {
          data += chunk;
        });
        response.on('end', () => {
          if (response.statusCode === 200) {
            try {
              resolve(JSON.parse(data));
              return;
            } catch (e) {
              // In the case of 'close' & 'activate' Chromium returns a string rather than JSON: goo.gl/7v27xD
              if (data === 'Target is closing' || data === 'Target activated') {
                return resolve({message: data});
              }
              return reject(e);
            }
          }
          reject(new Error(`Protocol JSON API error (${command}), status: ${response.statusCode}`));
        });
      });

      request.setTimeout(CONNECT_TIMEOUT, () => {
        request.abort();

        // After aborting, we expect an ECONNRESET error. Ignore.
        request.on('error', err => {
          if (err.code !== 'ECONNRESET') {
            throw err;
          }
        });

        // TODO: Replace this with an LHError on next major version bump
        // Reject on error with code specifically indicating timeout in connection setup.
        const err = new Error('Timeout waiting for initial Debugger Protocol connection.');
        err.code = 'CRI_TIMEOUT';
        log.error('CriConnection', err.message);
        reject(err);
      });
    });
  }

  /**
   * @override
   * @return {Promise<void>}
   */
  disconnect() {
    if (!this._ws) {
      log.warn('CriConnection', 'disconnect() was called without an established connection.');
      return Promise.resolve();
    }

    return this._runJsonCommand(`close/${this._pageId}`).then(_ => {
      if (this._ws) {
        this._ws.removeAllListeners();
        this._ws.close();
        this._ws = null;
      }
      this._pageId = null;
    });
  }

  /**
   * @override
   * @return {Promise<string>}
   */
  wsEndpoint() {
    return this._runJsonCommand('version').then(response => {
      return /** @type {LH.DevToolsJsonTarget} */ (response).webSocketDebuggerUrl;
    });
  }


  /**
   * @override
   * @param {string} message
   * @protected
   */
  sendRawMessage(message) {
    if (!this._ws) {
      log.error('CriConnection', 'sendRawMessage() was called without an established connection.');
      throw new Error('sendRawMessage() was called without an established connection.');
    }
    this._ws.send(message);
  }
}

module.exports = CriConnection;


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */



const WebSocket = __webpack_require__(108);

WebSocket.Server = __webpack_require__(142);
WebSocket.Receiver = __webpack_require__(111);
WebSocket.Sender = __webpack_require__(113);

module.exports = WebSocket;


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function Queue(options) {
  if (!(this instanceof Queue)) {
    return new Queue(options);
  }

  options = options || {};
  this.concurrency = options.concurrency || Infinity;
  this.pending = 0;
  this.jobs = [];
  this.cbs = [];
  this._done = done.bind(this);
}

var arrayAddMethods = [
  'push',
  'unshift',
  'splice'
];

arrayAddMethods.forEach(function(method) {
  Queue.prototype[method] = function() {
    var methodResult = Array.prototype[method].apply(this.jobs, arguments);
    this._run();
    return methodResult;
  };
});

Object.defineProperty(Queue.prototype, 'length', {
  get: function() {
    return this.pending + this.jobs.length;
  }
});

Queue.prototype._run = function() {
  if (this.pending === this.concurrency) {
    return;
  }
  if (this.jobs.length) {
    var job = this.jobs.shift();
    this.pending++;
    job(this._done);
    this._run();
  }

  if (this.pending === 0) {
    while (this.cbs.length !== 0) {
      var cb = this.cbs.pop();
      process.nextTick(cb);
    }
  }
};

Queue.prototype.onDone = function(cb) {
  if (typeof cb === 'function') {
    this.cbs.push(cb);
    this._run();
  }
};

function done() {
  this.pending--;
  this._run();
}

module.exports = Queue;


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Class representing an event.
 *
 * @private
 */
class Event {
  /**
   * Create a new `Event`.
   *
   * @param {String} type The name of the event
   * @param {Object} target A reference to the target to which the event was dispatched
   */
  constructor (type, target) {
    this.target = target;
    this.type = type;
  }
}

/**
 * Class representing a message event.
 *
 * @extends Event
 * @private
 */
class MessageEvent extends Event {
  /**
   * Create a new `MessageEvent`.
   *
   * @param {(String|Buffer|ArrayBuffer|Buffer[])} data The received data
   * @param {WebSocket} target A reference to the target to which the event was dispatched
   */
  constructor (data, target) {
    super('message', target);

    this.data = data;
  }
}

/**
 * Class representing a close event.
 *
 * @extends Event
 * @private
 */
class CloseEvent extends Event {
  /**
   * Create a new `CloseEvent`.
   *
   * @param {Number} code The status code explaining why the connection is being closed
   * @param {String} reason A human-readable string explaining why the connection is closing
   * @param {WebSocket} target A reference to the target to which the event was dispatched
   */
  constructor (code, reason, target) {
    super('close', target);

    this.wasClean = code === undefined || code === 1000 || (code >= 3000 && code <= 4999);
    this.reason = reason;
    this.code = code;
  }
}

/**
 * Class representing an open event.
 *
 * @extends Event
 * @private
 */
class OpenEvent extends Event {
  /**
   * Create a new `OpenEvent`.
   *
   * @param {WebSocket} target A reference to the target to which the event was dispatched
   */
  constructor (target) {
    super('open', target);
  }
}

/**
 * This provides methods for emulating the `EventTarget` interface. It's not
 * meant to be used directly.
 *
 * @mixin
 */
const EventTarget = {
  /**
   * Register an event listener.
   *
   * @param {String} method A string representing the event type to listen for
   * @param {Function} listener The listener to add
   * @public
   */
  addEventListener (method, listener) {
    if (typeof listener !== 'function') return;

    function onMessage (data) {
      listener.call(this, new MessageEvent(data, this));
    }

    function onClose (code, message) {
      listener.call(this, new CloseEvent(code, message, this));
    }

    function onError (event) {
      event.type = 'error';
      event.target = this;
      listener.call(this, event);
    }

    function onOpen () {
      listener.call(this, new OpenEvent(this));
    }

    if (method === 'message') {
      onMessage._listener = listener;
      this.on(method, onMessage);
    } else if (method === 'close') {
      onClose._listener = listener;
      this.on(method, onClose);
    } else if (method === 'error') {
      onError._listener = listener;
      this.on(method, onError);
    } else if (method === 'open') {
      onOpen._listener = listener;
      this.on(method, onOpen);
    } else {
      this.on(method, listener);
    }
  },

  /**
   * Remove an event listener.
   *
   * @param {String} method A string representing the event type to remove
   * @param {Function} listener The listener to remove
   * @public
   */
  removeEventListener (method, listener) {
    const listeners = this.listeners(method);

    for (var i = 0; i < listeners.length; i++) {
      if (listeners[i] === listener || listeners[i]._listener === listener) {
        this.removeListener(method, listeners[i]);
      }
    }
  }
};

module.exports = EventTarget;


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */



try {
  const isValidUTF8 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"utf-8-validate\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

  module.exports = typeof isValidUTF8 === 'object'
    ? isValidUTF8.Validation.isValidUTF8 // utf-8-validate@<3.0.0
    : isValidUTF8;
} catch (e) /* istanbul ignore next */ {
  module.exports = () => true;
}


/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */



const safeBuffer = __webpack_require__(89);
const EventEmitter = __webpack_require__(7);
const crypto = __webpack_require__(14);
const Ultron = __webpack_require__(109);
const http = __webpack_require__(9);
const url = __webpack_require__(4);

const PerMessageDeflate = __webpack_require__(91);
const Extensions = __webpack_require__(110);
const constants = __webpack_require__(97);
const WebSocket = __webpack_require__(108);

const Buffer = safeBuffer.Buffer;

/**
 * Class representing a WebSocket server.
 *
 * @extends EventEmitter
 */
class WebSocketServer extends EventEmitter {
  /**
   * Create a `WebSocketServer` instance.
   *
   * @param {Object} options Configuration options
   * @param {String} options.host The hostname where to bind the server
   * @param {Number} options.port The port where to bind the server
   * @param {http.Server} options.server A pre-created HTTP/S server to use
   * @param {Function} options.verifyClient An hook to reject connections
   * @param {Function} options.handleProtocols An hook to handle protocols
   * @param {String} options.path Accept only connections matching this path
   * @param {Boolean} options.noServer Enable no server mode
   * @param {Boolean} options.clientTracking Specifies whether or not to track clients
   * @param {(Boolean|Object)} options.perMessageDeflate Enable/disable permessage-deflate
   * @param {Number} options.maxPayload The maximum allowed message size
   * @param {Function} callback A listener for the `listening` event
   */
  constructor (options, callback) {
    super();

    options = Object.assign({
      maxPayload: 100 * 1024 * 1024,
      perMessageDeflate: false,
      handleProtocols: null,
      clientTracking: true,
      verifyClient: null,
      noServer: false,
      backlog: null, // use default (511 as implemented in net.js)
      server: null,
      host: null,
      path: null,
      port: null
    }, options);

    if (options.port == null && !options.server && !options.noServer) {
      throw new TypeError('missing or invalid options');
    }

    if (options.port != null) {
      this._server = http.createServer((req, res) => {
        const body = http.STATUS_CODES[426];

        res.writeHead(426, {
          'Content-Length': body.length,
          'Content-Type': 'text/plain'
        });
        res.end(body);
      });
      this._server.allowHalfOpen = false;
      this._server.listen(options.port, options.host, options.backlog, callback);
    } else if (options.server) {
      this._server = options.server;
    }

    if (this._server) {
      this._ultron = new Ultron(this._server);
      this._ultron.on('listening', () => this.emit('listening'));
      this._ultron.on('error', (err) => this.emit('error', err));
      this._ultron.on('upgrade', (req, socket, head) => {
        this.handleUpgrade(req, socket, head, (client) => {
          this.emit('connection', client, req);
        });
      });
    }

    if (options.perMessageDeflate === true) options.perMessageDeflate = {};
    if (options.clientTracking) this.clients = new Set();
    this.options = options;
  }

  /**
   * Close the server.
   *
   * @param {Function} cb Callback
   * @public
   */
  close (cb) {
    //
    // Terminate all associated clients.
    //
    if (this.clients) {
      for (const client of this.clients) client.terminate();
    }

    const server = this._server;

    if (server) {
      this._ultron.destroy();
      this._ultron = this._server = null;

      //
      // Close the http server if it was internally created.
      //
      if (this.options.port != null) return server.close(cb);
    }

    if (cb) cb();
  }

  /**
   * See if a given request should be handled by this server instance.
   *
   * @param {http.IncomingMessage} req Request object to inspect
   * @return {Boolean} `true` if the request is valid, else `false`
   * @public
   */
  shouldHandle (req) {
    if (this.options.path && url.parse(req.url).pathname !== this.options.path) {
      return false;
    }

    return true;
  }

  /**
   * Handle a HTTP Upgrade request.
   *
   * @param {http.IncomingMessage} req The request object
   * @param {net.Socket} socket The network socket between the server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @param {Function} cb Callback
   * @public
   */
  handleUpgrade (req, socket, head, cb) {
    socket.on('error', socketError);

    const version = +req.headers['sec-websocket-version'];
    const extensions = {};

    if (
      req.method !== 'GET' || req.headers.upgrade.toLowerCase() !== 'websocket' ||
      !req.headers['sec-websocket-key'] || (version !== 8 && version !== 13) ||
      !this.shouldHandle(req)
    ) {
      return abortConnection(socket, 400);
    }

    if (this.options.perMessageDeflate) {
      const perMessageDeflate = new PerMessageDeflate(
        this.options.perMessageDeflate,
        true,
        this.options.maxPayload
      );

      try {
        const offers = Extensions.parse(
          req.headers['sec-websocket-extensions']
        );

        if (offers[PerMessageDeflate.extensionName]) {
          perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
          extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
        }
      } catch (err) {
        return abortConnection(socket, 400);
      }
    }

    var protocol = (req.headers['sec-websocket-protocol'] || '').split(/, */);

    //
    // Optionally call external protocol selection handler.
    //
    if (this.options.handleProtocols) {
      protocol = this.options.handleProtocols(protocol, req);
      if (protocol === false) return abortConnection(socket, 401);
    } else {
      protocol = protocol[0];
    }

    //
    // Optionally call external client verification handler.
    //
    if (this.options.verifyClient) {
      const info = {
        origin: req.headers[`${version === 8 ? 'sec-websocket-origin' : 'origin'}`],
        secure: !!(req.connection.authorized || req.connection.encrypted),
        req
      };

      if (this.options.verifyClient.length === 2) {
        this.options.verifyClient(info, (verified, code, message) => {
          if (!verified) return abortConnection(socket, code || 401, message);

          this.completeUpgrade(
            protocol,
            extensions,
            version,
            req,
            socket,
            head,
            cb
          );
        });
        return;
      }

      if (!this.options.verifyClient(info)) return abortConnection(socket, 401);
    }

    this.completeUpgrade(protocol, extensions, version, req, socket, head, cb);
  }

  /**
   * Upgrade the connection to WebSocket.
   *
   * @param {String} protocol The chosen subprotocol
   * @param {Object} extensions The accepted extensions
   * @param {Number} version The WebSocket protocol version
   * @param {http.IncomingMessage} req The request object
   * @param {net.Socket} socket The network socket between the server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @param {Function} cb Callback
   * @private
   */
  completeUpgrade (protocol, extensions, version, req, socket, head, cb) {
    //
    // Destroy the socket if the client has already sent a FIN packet.
    //
    if (!socket.readable || !socket.writable) return socket.destroy();

    const key = crypto.createHash('sha1')
      .update(req.headers['sec-websocket-key'] + constants.GUID, 'binary')
      .digest('base64');

    const headers = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${key}`
    ];

    if (protocol) headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
    if (extensions[PerMessageDeflate.extensionName]) {
      const params = extensions[PerMessageDeflate.extensionName].params;
      const value = Extensions.format({
        [PerMessageDeflate.extensionName]: [params]
      });
      headers.push(`Sec-WebSocket-Extensions: ${value}`);
    }

    //
    // Allow external modification/inspection of handshake headers.
    //
    this.emit('headers', headers, req);

    socket.write(headers.concat('\r\n').join('\r\n'));

    const client = new WebSocket([socket, head], null, {
      maxPayload: this.options.maxPayload,
      protocolVersion: version,
      extensions,
      protocol
    });

    if (this.clients) {
      this.clients.add(client);
      client.on('close', () => this.clients.delete(client));
    }

    socket.removeListener('error', socketError);
    cb(client);
  }
}

module.exports = WebSocketServer;

/**
 * Handle premature socket errors.
 *
 * @private
 */
function socketError () {
  this.destroy();
}

/**
 * Close the connection when preconditions are not fulfilled.
 *
 * @param {net.Socket} socket The socket of the upgrade request
 * @param {Number} code The HTTP response status code
 * @param {String} [message] The HTTP response body
 * @private
 */
function abortConnection (socket, code, message) {
  if (socket.writable) {
    message = message || http.STATUS_CODES[code];
    socket.write(
      `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r\n` +
      'Connection: close\r\n' +
      'Content-type: text/html\r\n' +
      `Content-Length: ${Buffer.byteLength(message)}\r\n` +
      '\r\n' +
      message
    );
  }

  socket.removeListener('error', socketError);
  socket.destroy();
}


/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */


const defaultConfigPath = './default-config.js';
const defaultConfig = __webpack_require__(144);
const fullConfig = __webpack_require__(145);
const constants = __webpack_require__(98);
const i18n = __webpack_require__(114);

const isDeepEqual = __webpack_require__(146);
const log = __webpack_require__(87);
const path = __webpack_require__(3);
const Audit = __webpack_require__(115);
const Runner = __webpack_require__(106);

/** @typedef {typeof import('../gather/gatherers/gatherer.js')} GathererConstructor */
/** @typedef {InstanceType<GathererConstructor>} Gatherer */

/**
 * @param {Config['passes']} passes
 * @param {Config['audits']} audits
 */
function validatePasses(passes, audits) {
  if (!Array.isArray(passes)) {
    return;
  }

  const requiredGatherers = Config.getGatherersNeededByAudits(audits);

  // Log if we are running gathers that are not needed by the audits listed in the config
  passes.forEach(pass => {
    pass.gatherers.forEach(gathererDefn => {
      const gatherer = gathererDefn.instance;
      const isGatherRequiredByAudits = requiredGatherers.has(gatherer.name);
      if (!isGatherRequiredByAudits) {
        const msg = `${gatherer.name} gatherer requested, however no audit requires it.`;
        log.warn('config', msg);
      }
    });
  });

  // Passes must have unique `passName`s. Throw otherwise.
  const usedNames = new Set();
  passes.forEach(pass => {
    const passName = pass.passName;
    if (usedNames.has(passName)) {
      throw new Error(`Passes must have unique names (repeated passName: ${passName}.`);
    }
    usedNames.add(passName);
  });
}

/**
 * @param {Config['categories']} categories
 * @param {Config['audits']} audits
 * @param {Config['groups']} groups
 */
function validateCategories(categories, audits, groups) {
  if (!categories) {
    return;
  }

  Object.keys(categories).forEach(categoryId => {
    categories[categoryId].auditRefs.forEach((auditRef, index) => {
      if (!auditRef.id) {
        throw new Error(`missing an audit id at ${categoryId}[${index}]`);
      }

      const audit = audits && audits.find(a => a.implementation.meta.id === auditRef.id);
      if (!audit) {
        throw new Error(`could not find ${auditRef.id} audit for category ${categoryId}`);
      }

      const auditImpl = audit.implementation;
      const isManual = auditImpl.meta.scoreDisplayMode === 'manual';
      if (categoryId === 'accessibility' && !auditRef.group && !isManual) {
        throw new Error(`${auditRef.id} accessibility audit does not have a group`);
      }

      if (auditRef.weight > 0 && isManual) {
        throw new Error(`${auditRef.id} is manual but has a positive weight`);
      }

      if (auditRef.group && (!groups || !groups[auditRef.group])) {
        throw new Error(`${auditRef.id} references unknown group ${auditRef.group}`);
      }
    });
  });
}

/**
 * @param {typeof Audit} auditDefinition
 * @param {string=} auditPath
 */
function assertValidAudit(auditDefinition, auditPath) {
  const auditName = auditPath ||
    (auditDefinition && auditDefinition.meta && auditDefinition.meta.id);

  if (typeof auditDefinition.audit !== 'function' || auditDefinition.audit === Audit.audit) {
    throw new Error(`${auditName} has no audit() method.`);
  }

  if (typeof auditDefinition.meta.id !== 'string') {
    throw new Error(`${auditName} has no meta.id property, or the property is not a string.`);
  }

  if (typeof auditDefinition.meta.title !== 'string') {
    throw new Error(
      `${auditName} has no meta.title property, or the property is not a string.`
    );
  }

  // If it'll have a ✔ or ✖ displayed alongside the result, it should have failureTitle
  if (typeof auditDefinition.meta.failureTitle !== 'string' &&
    auditDefinition.meta.scoreDisplayMode === Audit.SCORING_MODES.BINARY) {
    throw new Error(`${auditName} has no failureTitle and should.`);
  }

  if (typeof auditDefinition.meta.description !== 'string') {
    throw new Error(
      `${auditName} has no meta.description property, or the property is not a string.`
    );
  } else if (auditDefinition.meta.description === '') {
    throw new Error(
      `${auditName} has an empty meta.description string. Please add a description for the UI.`
    );
  }

  if (!Array.isArray(auditDefinition.meta.requiredArtifacts)) {
    throw new Error(
      `${auditName} has no meta.requiredArtifacts property, or the property is not an array.`
    );
  }
}

/**
 * @param {Gatherer} gathererInstance
 * @param {string=} gathererName
 */
function assertValidGatherer(gathererInstance, gathererName) {
  gathererName = gathererName || gathererInstance.name || 'gatherer';

  if (typeof gathererInstance.beforePass !== 'function') {
    throw new Error(`${gathererName} has no beforePass() method.`);
  }

  if (typeof gathererInstance.pass !== 'function') {
    throw new Error(`${gathererName} has no pass() method.`);
  }

  if (typeof gathererInstance.afterPass !== 'function') {
    throw new Error(`${gathererName} has no afterPass() method.`);
  }
}

/**
 * Creates a settings object from potential flags object by dropping all the properties
 * that don't exist on Config.Settings.
 * @param {Partial<LH.Flags>=} flags
 * @return {RecursivePartial<LH.Config.Settings>}
*/
function cleanFlagsForSettings(flags = {}) {
  /** @type {RecursivePartial<LH.Config.Settings>} */
  const settings = {};

  for (const key of Object.keys(flags)) {
    // @ts-ignore - intentionally testing some keys not on defaultSettings to discard them.
    if (typeof constants.defaultSettings[key] !== 'undefined') {
      // Cast since key now must be able to index both Flags and Settings.
      const safekey = /** @type {Extract<keyof LH.Flags, keyof LH.Config.Settings>} */ (key);
      settings[safekey] = flags[safekey];
    }
  }

  return settings;
}

// TODO(phulce): disentangle this merge function
/**
 * More widely typed than exposed merge() function, below.
 * @param {Object<string, any>|Array<any>|undefined|null} base
 * @param {Object<string, any>|Array<any>} extension
 * @param {boolean=} overwriteArrays
 */
function _merge(base, extension, overwriteArrays = false) {
  // If the default value doesn't exist or is explicitly null, defer to the extending value
  if (typeof base === 'undefined' || base === null) {
    return extension;
  } else if (typeof extension === 'undefined') {
    return base;
  } else if (Array.isArray(extension)) {
    if (overwriteArrays) return extension;
    if (!Array.isArray(base)) throw new TypeError(`Expected array but got ${typeof base}`);
    const merged = base.slice();
    extension.forEach(item => {
      if (!merged.some(candidate => isDeepEqual(candidate, item))) merged.push(item);
    });

    return merged;
  } else if (typeof extension === 'object') {
    if (typeof base !== 'object') throw new TypeError(`Expected object but got ${typeof base}`);
    if (Array.isArray(base)) throw new TypeError('Expected object but got Array');
    Object.keys(extension).forEach(key => {
      const localOverwriteArrays = overwriteArrays ||
        (key === 'settings' && typeof base[key] === 'object');
      base[key] = _merge(base[key], extension[key], localOverwriteArrays);
    });
    return base;
  }

  return extension;
}

/**
 * Until support of jsdoc templates with constraints, type in config.d.ts.
 * See https://github.com/Microsoft/TypeScript/issues/24283
 * @type {LH.Config.Merge}
 */
const merge = _merge;

/**
 * @template T
 * @param {Array<T>} array
 * @return {Array<T>}
 */
function cloneArrayWithPluginSafety(array) {
  return array.map(item => {
    if (typeof item === 'object') {
      // Return copy of instance and prototype chain (in case item is instantiated class).
      return Object.assign(
        Object.create(
          Object.getPrototypeOf(item)
        ),
        item
      );
    }

    return item;
  });
}

/**
 * // TODO(bckenny): could adopt "jsonified" type to ensure T will survive JSON
 * round trip: https://github.com/Microsoft/TypeScript/issues/21838
 * @template T
 * @param {T} json
 * @return {T}
 */
function deepClone(json) {
  return JSON.parse(JSON.stringify(json));
}

/**
 * Deep clone a ConfigJson, copying over any "live" gatherer or audit that
 * wouldn't make the JSON round trip.
 * @param {LH.Config.Json} json
 * @return {LH.Config.Json}
 */
function deepCloneConfigJson(json) {
  const cloned = deepClone(json);

  // Copy arrays that could contain plugins to allow for programmatic
  // injection of plugins.
  if (Array.isArray(cloned.passes) && Array.isArray(json.passes)) {
    for (let i = 0; i < cloned.passes.length; i++) {
      const pass = cloned.passes[i];
      pass.gatherers = cloneArrayWithPluginSafety(json.passes[i].gatherers || []);
    }
  }

  if (Array.isArray(json.audits)) {
    cloned.audits = cloneArrayWithPluginSafety(json.audits);
  }

  return cloned;
}

/**
 * If any items with identical `path` properties are found in the input array,
 * merge their `options` properties into the first instance and then discard any
 * other instances.
 * Until support of jsdoc templates with constraints, type in config.d.ts.
 * See https://github.com/Microsoft/TypeScript/issues/24283
 * @type {LH.Config.MergeOptionsOfItems}
 */
const mergeOptionsOfItems = (function(items) {
  /** @type {Array<{path?: string, options?: Object<string, any>}>} */
  const mergedItems = [];

  for (const item of items) {
    const existingItem = item.path && mergedItems.find(candidate => candidate.path === item.path);
    if (!existingItem) {
      mergedItems.push(item);
      continue;
    }

    existingItem.options = Object.assign({}, existingItem.options, item.options);
  }

  return mergedItems;
});

class Config {
  /**
   * @constructor
   * @implements {LH.Config.Json}
   * @param {LH.Config.Json=} configJSON
   * @param {LH.Flags=} flags
   */
  constructor(configJSON, flags) {
    let configPath = flags && flags.configPath;

    if (!configJSON) {
      configJSON = defaultConfig;
      configPath = path.resolve(__dirname, defaultConfigPath);
    }

    if (configPath && !path.isAbsolute(configPath)) {
      throw new Error('configPath must be an absolute path.');
    }

    // We don't want to mutate the original config object
    configJSON = deepCloneConfigJson(configJSON);

    // Extend the default or full config if specified
    if (configJSON.extends === 'lighthouse:full') {
      const explodedFullConfig = Config.extendConfigJSON(deepCloneConfigJson(defaultConfig),
          deepCloneConfigJson(fullConfig));
      configJSON = Config.extendConfigJSON(explodedFullConfig, configJSON);
    } else if (configJSON.extends) {
      configJSON = Config.extendConfigJSON(deepCloneConfigJson(defaultConfig), configJSON);
    }

    // The directory of the config path, if one was provided.
    const configDir = configPath ? path.dirname(configPath) : undefined;

    const settings = Config.initSettings(configJSON.settings, flags);

    // Augment passes with necessary defaults and require gatherers.
    const passesWithDefaults = Config.augmentPassesWithDefaults(configJSON.passes);
    Config.adjustDefaultPassForThrottling(settings, passesWithDefaults);
    const passes = Config.requireGatherers(passesWithDefaults, configDir);

    /** @type {LH.Config.Settings} */
    this.settings = settings;
    /** @type {?Array<LH.Config.Pass>} */
    this.passes = passes;
    /** @type {?Array<LH.Config.AuditDefn>} */
    this.audits = Config.requireAudits(configJSON.audits, configDir);
    /** @type {?Record<string, LH.Config.Category>} */
    this.categories = configJSON.categories || null;
    /** @type {?Record<string, LH.Config.Group>} */
    this.groups = configJSON.groups || null;

    Config.filterConfigIfNeeded(this);

    validatePasses(this.passes, this.audits);
    validateCategories(this.categories, this.audits, this.groups);

    // TODO(bckenny): until tsc adds @implements support, assert that Config is a ConfigJson.
    /** @type {LH.Config.Json} */
    const configJson = this; // eslint-disable-line no-unused-vars
  }

  /**
   * Provides a cleaned-up, stringified version of this config. Gatherer and
   * Audit `implementation` and `instance` do not survive this process.
   * @return {string}
   */
  getPrintString() {
    const jsonConfig = deepClone(this);

    if (jsonConfig.passes) {
      for (const pass of jsonConfig.passes) {
        for (const gathererDefn of pass.gatherers) {
          gathererDefn.implementation = undefined;
          // @ts-ignore Breaking the Config.GathererDefn type.
          gathererDefn.instance = undefined;
          if (Object.keys(gathererDefn.options).length === 0) {
            // @ts-ignore Breaking the Config.GathererDefn type.
            gathererDefn.options = undefined;
          }
        }
      }
    }

    if (jsonConfig.audits) {
      for (const auditDefn of jsonConfig.audits) {
        // @ts-ignore Breaking the Config.AuditDefn type.
        auditDefn.implementation = undefined;
        if (Object.keys(auditDefn.options).length === 0) {
          // @ts-ignore Breaking the Config.AuditDefn type.
          auditDefn.options = undefined;
        }
      }
    }

    // Printed config is more useful with localized strings.
    i18n.replaceIcuMessageInstanceIds(jsonConfig, jsonConfig.settings.locale);

    return JSON.stringify(jsonConfig, null, 2);
  }

  /**
   * @param {LH.Config.Json} baseJSON The JSON of the configuration to extend
   * @param {LH.Config.Json} extendJSON The JSON of the extensions
   * @return {LH.Config.Json}
   */
  static extendConfigJSON(baseJSON, extendJSON) {
    if (extendJSON.passes && baseJSON.passes) {
      for (const pass of extendJSON.passes) {
        // use the default pass name if one is not specified
        const passName = pass.passName || constants.defaultPassConfig.passName;
        const basePass = baseJSON.passes.find(candidate => candidate.passName === passName);

        if (!basePass) {
          baseJSON.passes.push(pass);
        } else {
          merge(basePass, pass);
        }
      }

      delete extendJSON.passes;
    }

    return merge(baseJSON, extendJSON);
  }

  /**
   * @param {LH.Config.Json['passes']} passes
   * @return {?Array<Required<LH.Config.PassJson>>}
   */
  static augmentPassesWithDefaults(passes) {
    if (!passes) {
      return null;
    }

    const {defaultPassConfig} = constants;
    return passes.map(pass => merge(deepClone(defaultPassConfig), pass));
  }

  /**
   * @param {LH.Config.SettingsJson=} settingsJson
   * @param {LH.Flags=} flags
   * @return {LH.Config.Settings}
   */
  static initSettings(settingsJson = {}, flags) {
    // If a locale is requested in flags or settings, use it. A typical CLI run will not have one,
    // however `lookupLocale` will always determine which of our supported locales to use (falling
    // back if necessary).
    const locale = i18n.lookupLocale((flags && flags.locale) || settingsJson.locale);

    // Fill in missing settings with defaults
    const {defaultSettings} = constants;
    const settingWithDefaults = merge(deepClone(defaultSettings), settingsJson, true);

    // Override any applicable settings with CLI flags
    const settingsWithFlags = merge(settingWithDefaults || {}, cleanFlagsForSettings(flags), true);

    // Locale is special and comes only from flags/settings/lookupLocale.
    settingsWithFlags.locale = locale;

    return settingsWithFlags;
  }

  /**
   * Expands the audits from user-specified JSON to an internal audit definition format.
   * @param {LH.Config.Json['audits']} audits
   * @return {?Array<{path: string, options?: {}} | {implementation: typeof Audit, path?: string, options?: {}}>}
   */
  static expandAuditShorthand(audits) {
    if (!audits) {
      return null;
    }

    const newAudits = audits.map(audit => {
      if (typeof audit === 'string') {
        // just 'path/to/audit'
        return {path: audit, options: {}};
      } else if ('implementation' in audit && typeof audit.implementation.audit === 'function') {
        // {implementation: AuditClass, ...}
        return audit;
      } else if ('path' in audit && typeof audit.path === 'string') {
        // {path: 'path/to/audit', ...}
        return audit;
      } else if ('audit' in audit && typeof audit.audit === 'function') {
        // just AuditClass
        return {implementation: audit, options: {}};
      } else {
        throw new Error('Invalid Audit type ' + JSON.stringify(audit));
      }
    });

    return newAudits;
  }

  /**
   * Expands the gatherers from user-specified to an internal gatherer definition format.
   *
   * Input Examples:
   *  - 'my-gatherer'
   *  - class MyGatherer extends Gatherer { }
   *  - {instance: myGathererInstance}
   *
   * @param {Array<LH.Config.GathererJson>} gatherers
   * @return {Array<{instance?: Gatherer, implementation?: GathererConstructor, path?: string, options?: {}}>} passes
   */
  static expandGathererShorthand(gatherers) {
    const expanded = gatherers.map(gatherer => {
      if (typeof gatherer === 'string') {
        // just 'path/to/gatherer'
        return {path: gatherer, options: {}};
      } else if ('implementation' in gatherer || 'instance' in gatherer) {
        // {implementation: GathererConstructor, ...} or {instance: GathererInstance, ...}
        return gatherer;
      } else if ('path' in gatherer) {
        // {path: 'path/to/gatherer', ...}
        if (typeof gatherer.path !== 'string') {
          throw new Error('Invalid Gatherer type ' + JSON.stringify(gatherer));
        }
        return gatherer;
      } else if (typeof gatherer === 'function') {
        // just GathererConstructor
        return {implementation: gatherer, options: {}};
      } else if (gatherer && typeof gatherer.beforePass === 'function') {
        // just GathererInstance
        return {instance: gatherer, options: {}};
      } else {
        throw new Error('Invalid Gatherer type ' + JSON.stringify(gatherer));
      }
    });

    return expanded;
  }

  /**
   * Observed throttling methods (devtools/provided) require at least 5s of quiet for the metrics to
   * be computed. This method adjusts the quiet thresholds to the required minimums if necessary.
   * @param {LH.Config.Settings} settings
   * @param {?Array<Required<LH.Config.PassJson>>} passes
   */
  static adjustDefaultPassForThrottling(settings, passes) {
    if (!passes ||
        (settings.throttlingMethod !== 'devtools' && settings.throttlingMethod !== 'provided')) {
      return;
    }

    const defaultPass = passes.find(pass => pass.passName === 'defaultPass');
    if (!defaultPass) return;
    const overrides = constants.nonSimulatedPassConfigOverrides;
    defaultPass.pauseAfterLoadMs =
      Math.max(overrides.pauseAfterLoadMs, defaultPass.pauseAfterLoadMs);
    defaultPass.cpuQuietThresholdMs =
      Math.max(overrides.cpuQuietThresholdMs, defaultPass.cpuQuietThresholdMs);
    defaultPass.networkQuietThresholdMs =
      Math.max(overrides.networkQuietThresholdMs, defaultPass.networkQuietThresholdMs);
  }

  /**
   * Filter out any unrequested items from the config, based on requested categories or audits.
   * @param {Config} config
   */
  static filterConfigIfNeeded(config) {
    const settings = config.settings;
    if (!settings.onlyCategories && !settings.onlyAudits && !settings.skipAudits) {
      return;
    }

    // 1. Filter to just the chosen categories/audits
    const {categories, requestedAuditNames} = Config.filterCategoriesAndAudits(config.categories,
      settings);

    // 2. Resolve which audits will need to run
    const audits = config.audits && config.audits.filter(auditDefn =>
        requestedAuditNames.has(auditDefn.implementation.meta.id));

    // 3. Resolve which gatherers will need to run
    const requiredGathererIds = Config.getGatherersNeededByAudits(audits);

    // 4. Filter to only the neccessary passes
    const passes = Config.generatePassesNeededByGatherers(config.passes, requiredGathererIds);

    config.categories = categories;
    config.audits = audits;
    config.passes = passes;
  }

  /**
   * Filter out any unrequested categories or audits from the categories object.
   * @param {Config['categories']} oldCategories
   * @param {LH.Config.Settings} settings
   * @return {{categories: Config['categories'], requestedAuditNames: Set<string>}}
   */
  static filterCategoriesAndAudits(oldCategories, settings) {
    if (!oldCategories) {
      return {categories: null, requestedAuditNames: new Set()};
    }

    if (settings.onlyAudits && settings.skipAudits) {
      throw new Error('Cannot set both skipAudits and onlyAudits');
    }

    /** @type {NonNullable<Config['categories']>} */
    const categories = {};
    const filterByIncludedCategory = !!settings.onlyCategories;
    const filterByIncludedAudit = !!settings.onlyAudits;
    const categoryIds = settings.onlyCategories || [];
    const auditIds = settings.onlyAudits || [];
    const skipAuditIds = settings.skipAudits || [];

    // warn if the category is not found
    categoryIds.forEach(categoryId => {
      if (!oldCategories[categoryId]) {
        log.warn('config', `unrecognized category in 'onlyCategories': ${categoryId}`);
      }
    });

    // warn if the audit is not found in a category or there are overlaps
    const auditsToValidate = new Set(auditIds.concat(skipAuditIds));
    for (const auditId of auditsToValidate) {
      const foundCategory = Object.keys(oldCategories).find(categoryId => {
        const auditRefs = oldCategories[categoryId].auditRefs;
        return !!auditRefs.find(candidate => candidate.id === auditId);
      });

      if (!foundCategory) {
        const parentKeyName = skipAuditIds.includes(auditId) ? 'skipAudits' : 'onlyAudits';
        log.warn('config', `unrecognized audit in '${parentKeyName}': ${auditId}`);
      } else if (auditIds.includes(auditId) && categoryIds.includes(foundCategory)) {
        log.warn('config', `${auditId} in 'onlyAudits' is already included by ` +
            `${foundCategory} in 'onlyCategories'`);
      }
    }

    const includedAudits = new Set(auditIds);
    skipAuditIds.forEach(id => includedAudits.delete(id));

    Object.keys(oldCategories).forEach(categoryId => {
      const category = deepClone(oldCategories[categoryId]);

      if (filterByIncludedCategory && filterByIncludedAudit) {
        // If we're filtering to the category and audit whitelist, include the union of the two
        if (!categoryIds.includes(categoryId)) {
          category.auditRefs = category.auditRefs.filter(audit => auditIds.includes(audit.id));
        }
      } else if (filterByIncludedCategory) {
        // If we're filtering to just the category whitelist and the category is not included, skip it
        if (!categoryIds.includes(categoryId)) {
          return;
        }
      } else if (filterByIncludedAudit) {
        category.auditRefs = category.auditRefs.filter(audit => auditIds.includes(audit.id));
      }

      // always filter to the audit blacklist
      category.auditRefs = category.auditRefs.filter(audit => !skipAuditIds.includes(audit.id));

      if (category.auditRefs.length) {
        categories[categoryId] = category;
        category.auditRefs.forEach(audit => includedAudits.add(audit.id));
      }
    });

    return {categories, requestedAuditNames: includedAudits};
  }

  /**
   * @param {LH.Config.Json} config
   * @return {Array<{id: string, title: string}>}
   */
  static getCategories(config) {
    const categories = config.categories;
    if (!categories) {
      return [];
    }

    return Object.keys(categories).map(id => {
      const title = categories[id].title;
      return {id, title};
    });
  }

  /**
   * From some requested audits, return names of all required artifacts
   * @param {Config['audits']} audits
   * @return {Set<string>}
   */
  static getGatherersNeededByAudits(audits) {
    // It's possible we weren't given any audits (but existing audit results), in which case
    // there is no need to do any work here.
    if (!audits) {
      return new Set();
    }

    return audits.reduce((list, auditDefn) => {
      auditDefn.implementation.meta.requiredArtifacts.forEach(artifact => list.add(artifact));
      return list;
    }, new Set());
  }

  /**
   * Filters to only required passes and gatherers, returning a new passes array.
   * @param {Config['passes']} passes
   * @param {Set<string>} requiredGatherers
   * @return {Config['passes']}
   */
  static generatePassesNeededByGatherers(passes, requiredGatherers) {
    if (!passes) {
      return null;
    }

    const auditsNeedTrace = requiredGatherers.has('traces');
    const filteredPasses = passes.map(pass => {
      // remove any unncessary gatherers from within the passes
      pass.gatherers = pass.gatherers.filter(gathererDefn => {
        const gatherer = gathererDefn.instance;
        return requiredGatherers.has(gatherer.name);
      });

      // disable the trace if no audit requires a trace
      if (pass.recordTrace && !auditsNeedTrace) {
        const passName = pass.passName || 'unknown pass';
        log.warn('config', `Trace not requested by an audit, dropping trace in ${passName}`);
        pass.recordTrace = false;
      }

      return pass;
    }).filter(pass => {
      // remove any passes lacking concrete gatherers, unless they are dependent on the trace
      if (pass.recordTrace) return true;
      // Always keep defaultPass
      if (pass.passName === 'defaultPass') return true;
      return pass.gatherers.length > 0;
    });
    return filteredPasses;
  }

  /**
   * Take an array of audits and audit paths and require any paths (possibly
   * relative to the optional `configPath`) using `Runner.resolvePlugin`,
   * leaving only an array of AuditDefns.
   * @param {LH.Config.Json['audits']} audits
   * @param {string=} configPath
   * @return {Config['audits']}
   */
  static requireAudits(audits, configPath) {
    const expandedAudits = Config.expandAuditShorthand(audits);
    if (!expandedAudits) {
      return null;
    }

    const coreList = Runner.getAuditList();
    const auditDefns = expandedAudits.map(audit => {
      let implementation;
      if ('implementation' in audit) {
        implementation = audit.implementation;
      } else {
        // See if the audit is a Lighthouse core audit.
        const auditPathJs = `${audit.path}.js`;
        const coreAudit = coreList.find(a => a === auditPathJs);
        let requirePath = `../audits/${audit.path}`;
        if (!coreAudit) {
          // Otherwise, attempt to find it elsewhere. This throws if not found.
          requirePath = Runner.resolvePlugin(audit.path, configPath, 'audit');
        }
        implementation = /** @type {typeof Audit} */ (!(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
      }

      return {
        implementation,
        path: audit.path,
        options: audit.options || {},
      };
    });

    const mergedAuditDefns = mergeOptionsOfItems(auditDefns);
    mergedAuditDefns.forEach(audit => assertValidAudit(audit.implementation, audit.path));
    return mergedAuditDefns;
  }

  /**
   * @param {string} path
   * @param {{}=} options
   * @param {Array<string>} coreAuditList
   * @param {string=} configPath
   * @return {LH.Config.GathererDefn}
   */
  static requireGathererFromPath(path, options, coreAuditList, configPath) {
    const coreGatherer = coreAuditList.find(a => a === `${path}.js`);

    let requirePath = `../gather/gatherers/${path}`;
    if (!coreGatherer) {
      // Otherwise, attempt to find it elsewhere. This throws if not found.
      requirePath = Runner.resolvePlugin(path, configPath, 'gatherer');
    }

    const GathererClass = /** @type {GathererConstructor} */ (!(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

    return {
      instance: new GathererClass(),
      implementation: GathererClass,
      path,
      options: options || {},
    };
  }

  /**
   * Takes an array of passes with every property now initialized except the
   * gatherers and requires them, (relative to the optional `configPath` if
   * provided) using `Runner.resolvePlugin`, returning an array of full Passes.
   * @param {?Array<Required<LH.Config.PassJson>>} passes
   * @param {string=} configPath
   * @return {Config['passes']}
   */
  static requireGatherers(passes, configPath) {
    if (!passes) {
      return null;
    }

    const coreList = Runner.getGathererList();
    const fullPasses = passes.map(pass => {
      const gathererDefns = Config.expandGathererShorthand(pass.gatherers).map(gathererDefn => {
        if (gathererDefn.instance) {
          return {
            instance: gathererDefn.instance,
            implementation: gathererDefn.implementation,
            path: gathererDefn.path,
            options: gathererDefn.options || {},
          };
        } else if (gathererDefn.implementation) {
          const GathererClass = gathererDefn.implementation;
          return {
            instance: new GathererClass(),
            implementation: gathererDefn.implementation,
            path: gathererDefn.path,
            options: gathererDefn.options || {},
          };
        } else if (gathererDefn.path) {
          const path = gathererDefn.path;
          const options = gathererDefn.options;
          return Config.requireGathererFromPath(path, options, coreList, configPath);
        } else {
          throw new Error('Invalid expanded Gatherer: ' + JSON.stringify(gathererDefn));
        }
      });

      const mergedDefns = mergeOptionsOfItems(gathererDefns);
      mergedDefns.forEach(gatherer => assertValidGatherer(gatherer.instance, gatherer.path));

      return Object.assign(pass, {gatherers: mergedDefns});
    });

    return fullPasses;
  }
}

module.exports = Config;

/* WEBPACK VAR INJECTION */}.call(exports, "../node_modules/lighthouse/lighthouse-core/config"))

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__filename) {/**
 * @license Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */


/* eslint-disable max-len */

const constants = __webpack_require__(98);
const i18n = __webpack_require__(114);

const UIStrings = {
  /** Title of the Performance category of audits. Equivalent to 'Web performance', this term is inclusive of all web page speed and loading optimization topics. Also used as a label of a score gauge; try to limit to 20 characters. */
  performanceCategoryTitle: 'Performance',
  /** Title of the speed metrics section of the Performance category. Within this section are various speed metrics which quantify the pageload performance into values presented in seconds and milliseconds. */
  metricGroupTitle: 'Metrics',
  /** Title of the opportunity section of the Performance category. Within this section are audits with imperative titles that suggest actions the user can take to improve the loading performance of their web page. 'Suggestion'/'Optimization'/'Recommendation' are reasonable synonyms for 'opportunity' in this case. */
  loadOpportunitiesGroupTitle: 'Opportunities',
  /** Description of the opportunity section of the Performance category. 'Optimizations' could also be 'recommendations' or 'suggestions'. Within this section are audits with imperative titles that suggest actions the user can take to improve the loading performance of their web page. */
  loadOpportunitiesGroupDescription: 'These optimizations can speed up your page load.',
  /** Title of an opportunity sub-section of the Performance category. Within this section are audits with imperative titles that suggest actions the user can take to improve the time of the first initial render of the webpage. */
  firstPaintImprovementsGroupTitle: 'First Paint Improvements',
  /** Description of an opportunity sub-section of the Performance category. Within this section are audits with imperative titles that suggest actions the user can take to improve the time of the first initial render of the webpage. */
  firstPaintImprovementsGroupDescription: 'The most critical aspect of performance is how quickly pixels are rendered onscreen. Key metrics: First Contentful Paint, First Meaningful Paint',
  /** Title of an opportunity sub-section of the Performance category. Within this section are audits with imperative titles that suggest actions the user can take to improve the overall loading performance of their web page. */
  overallImprovementsGroupTitle: 'Overall Improvements',
  /** Description of an opportunity sub-section of the Performance category. Within this section are audits with imperative titles that suggest actions the user can take to improve the overall loading performance of their web page. */
  overallImprovementsGroupDescription: 'Enhance the overall loading experience, so the page is responsive and ready to use as soon as possible. Key metrics: Time to Interactive, Speed Index',
  /** Title of the diagnostics section of the Performance category. Within this section are audits with non-imperative titles that provide more detail on the page's page load performance characteristics. Whereas the 'Opportunities' suggest an action along with expected time savings, diagnostics do not. Within this section, the user may read the details and deduce additional actions they could take. */
  diagnosticsGroupTitle: 'Diagnostics',
  /** Description of the diagnostics section of the Performance category. Within this section are audits with non-imperative titles that provide more detail on the page's page load performance characteristics. Whereas the 'Opportunities' suggest an action along with expected time savings, diagnostics do not. Within this section, the user may read the details and deduce additional actions they could take. */
  diagnosticsGroupDescription: 'More information about the performance of your application.',
};

const str_ = i18n.createMessageInstanceIdFn(__filename, UIStrings);

/** @type {LH.Config.Json} */
const defaultConfig = {
  settings: constants.defaultSettings,
  passes: [{
    passName: 'defaultPass',
    recordTrace: true,
    useThrottling: true,
    pauseAfterLoadMs: 1000,
    networkQuietThresholdMs: 1000,
    cpuQuietThresholdMs: 1000,
    gatherers: [
      'scripts',
      'css-usage',
      'viewport',
      'viewport-dimensions',
      'theme-color',
      'manifest',
      'runtime-exceptions',
      'chrome-console-messages',
      'image-usage',
      'accessibility',
      'dobetterweb/anchors-with-no-rel-noopener',
      'dobetterweb/appcache',
      'dobetterweb/doctype',
      'dobetterweb/domstats',
      'dobetterweb/js-libraries',
      'dobetterweb/optimized-images',
      'dobetterweb/password-inputs-with-prevented-paste',
      'dobetterweb/response-compression',
      'dobetterweb/tags-blocking-first-paint',
      'dobetterweb/websql',
      'seo/meta-description',
      'seo/font-size',
      'seo/crawlable-links',
      'seo/meta-robots',
      'seo/hreflang',
      'seo/embedded-content',
      'seo/canonical',
      'seo/robots-txt',
      'fonts',
    ],
  },
  {
    passName: 'offlinePass',
    gatherers: [
      'service-worker',
      'offline',
      'start-url',
    ],
  },
  {
    passName: 'redirectPass',
    // Speed up the redirect pass by blocking stylesheets, fonts, and images
    blockedUrlPatterns: ['*.css', '*.jpg', '*.jpeg', '*.png', '*.gif', '*.svg', '*.ttf', '*.woff', '*.woff2'],
    gatherers: [
      'http-redirect',
      'html-without-javascript',
    ],
  }],
  audits: [
    'is-on-https',
    'redirects-http',
    'service-worker',
    'works-offline',
    'viewport',
    'without-javascript',
    'metrics/first-contentful-paint',
    'metrics/first-meaningful-paint',
    'load-fast-enough-for-pwa',
    'metrics/speed-index',
    'screenshot-thumbnails',
    'final-screenshot',
    'metrics/estimated-input-latency',
    'errors-in-console',
    'time-to-first-byte',
    'metrics/first-cpu-idle',
    'metrics/interactive',
    'user-timings',
    'critical-request-chains',
    'redirects',
    'webapp-install-banner',
    'splash-screen',
    'themed-omnibox',
    'manifest-short-name-length',
    'content-width',
    'image-aspect-ratio',
    'deprecations',
    'mainthread-work-breakdown',
    'bootup-time',
    'uses-rel-preload',
    'uses-rel-preconnect',
    'font-display',
    'network-requests',
    'metrics',
    'manual/pwa-cross-browser',
    'manual/pwa-page-transitions',
    'manual/pwa-each-page-has-url',
    'accessibility/accesskeys',
    'accessibility/aria-allowed-attr',
    'accessibility/aria-required-attr',
    'accessibility/aria-required-children',
    'accessibility/aria-required-parent',
    'accessibility/aria-roles',
    'accessibility/aria-valid-attr-value',
    'accessibility/aria-valid-attr',
    'accessibility/audio-caption',
    'accessibility/button-name',
    'accessibility/bypass',
    'accessibility/color-contrast',
    'accessibility/definition-list',
    'accessibility/dlitem',
    'accessibility/document-title',
    'accessibility/duplicate-id',
    'accessibility/frame-title',
    'accessibility/html-has-lang',
    'accessibility/html-lang-valid',
    'accessibility/image-alt',
    'accessibility/input-image-alt',
    'accessibility/label',
    'accessibility/layout-table',
    'accessibility/link-name',
    'accessibility/list',
    'accessibility/listitem',
    'accessibility/meta-refresh',
    'accessibility/meta-viewport',
    'accessibility/object-alt',
    'accessibility/tabindex',
    'accessibility/td-headers-attr',
    'accessibility/th-has-data-cells',
    'accessibility/valid-lang',
    'accessibility/video-caption',
    'accessibility/video-description',
    'accessibility/manual/custom-controls-labels',
    'accessibility/manual/custom-controls-roles',
    'accessibility/manual/focus-traps',
    'accessibility/manual/focusable-controls',
    'accessibility/manual/heading-levels',
    'accessibility/manual/interactive-element-affordance',
    'accessibility/manual/logical-tab-order',
    'accessibility/manual/managed-focus',
    'accessibility/manual/offscreen-content-hidden',
    'accessibility/manual/use-landmarks',
    'accessibility/manual/visual-order-follows-dom',
    'byte-efficiency/uses-long-cache-ttl',
    'byte-efficiency/total-byte-weight',
    'byte-efficiency/offscreen-images',
    'byte-efficiency/render-blocking-resources',
    'byte-efficiency/unminified-css',
    'byte-efficiency/unminified-javascript',
    'byte-efficiency/unused-css-rules',
    'byte-efficiency/uses-webp-images',
    'byte-efficiency/uses-optimized-images',
    'byte-efficiency/uses-text-compression',
    'byte-efficiency/uses-responsive-images',
    'byte-efficiency/efficient-animated-content',
    'dobetterweb/appcache-manifest',
    'dobetterweb/doctype',
    'dobetterweb/dom-size',
    'dobetterweb/external-anchors-use-rel-noopener',
    'dobetterweb/geolocation-on-start',
    'dobetterweb/no-document-write',
    'dobetterweb/no-vulnerable-libraries',
    'dobetterweb/js-libraries',
    'dobetterweb/no-websql',
    'dobetterweb/notification-on-start',
    'dobetterweb/password-inputs-can-be-pasted-into',
    'dobetterweb/uses-http2',
    'dobetterweb/uses-passive-event-listeners',
    'seo/meta-description',
    'seo/http-status-code',
    'seo/font-size',
    'seo/link-text',
    'seo/is-crawlable',
    'seo/robots-txt',
    'seo/hreflang',
    'seo/plugins',
    'seo/canonical',
    'seo/manual/mobile-friendly',
    'seo/manual/structured-data',
  ],

  groups: {
    'metrics': {
      title: str_(UIStrings.metricGroupTitle),
    },
    'load-opportunities': {
      title: str_(UIStrings.loadOpportunitiesGroupTitle),
      description: str_(UIStrings.loadOpportunitiesGroupDescription),
    },
    'diagnostics': {
      title: str_(UIStrings.diagnosticsGroupTitle),
      description: str_(UIStrings.diagnosticsGroupDescription),
    },
    'a11y-color-contrast': {
      title: 'Color Contrast Is Satisfactory',
      description: 'These are opportunities to improve the legibility of your content.',
    },
    'a11y-describe-contents': {
      title: 'Elements Describe Contents Well',
      description: 'These are opportunities to make your content easier to understand for a user of assistive technology, like a screen reader.',
    },
    'a11y-well-structured': {
      title: 'Elements Are Well Structured',
      description: 'These are opportunities to make sure your HTML is appropriately structured.',
    },
    'a11y-aria': {
      title: 'ARIA Attributes Follow Best Practices',
      description: 'These are opportunities to improve the usage of ARIA in your application which may enhance the experience for users of assistive technology, like a screen reader.',
    },
    'a11y-correct-attributes': {
      title: 'Elements Use Attributes Correctly',
      description: 'These are opportunities to improve the configuration of your HTML elements.',
    },
    'a11y-element-names': {
      title: 'Elements Have Discernible Names',
      description: 'These are opportunities to improve the semantics of the controls in your application. This may enhance the experience for users of assistive technology, like a screen reader.',
    },
    'a11y-language': {
      title: 'Page Specifies Valid Language',
      description: 'These are opportunities to improve the interpretation of your content by users in different locales.',
    },
    'a11y-meta': {
      title: 'Meta Tags Used Properly',
      description: 'These are opportunities to improve the user experience of your site.',
    },
    'seo-mobile': {
      title: 'Mobile Friendly',
      description: 'Make sure your pages are mobile friendly so users don’t have to pinch or zoom ' +
          'in order to read the content pages. [Learn more](https://developers.google.com/search/mobile-sites/).',
    },
    'seo-content': {
      title: 'Content Best Practices',
      description: 'Format your HTML in a way that enables crawlers to better understand your app’s content.',
    },
    'seo-crawl': {
      title: 'Crawling and Indexing',
      description: 'To appear in search results, crawlers need access to your app.',
    },
  },
  categories: {
    'performance': {
      title: str_(UIStrings.performanceCategoryTitle),
      auditRefs: [
        {id: 'first-contentful-paint', weight: 3, group: 'metrics'},
        {id: 'first-meaningful-paint', weight: 1, group: 'metrics'},
        {id: 'speed-index', weight: 4, group: 'metrics'},
        {id: 'interactive', weight: 5, group: 'metrics'},
        {id: 'first-cpu-idle', weight: 2, group: 'metrics'},
        {id: 'estimated-input-latency', weight: 0, group: 'metrics'},

        {id: 'render-blocking-resources', weight: 0, group: 'load-opportunities'},
        {id: 'uses-responsive-images', weight: 0, group: 'load-opportunities'},
        {id: 'offscreen-images', weight: 0, group: 'load-opportunities'},
        {id: 'unminified-css', weight: 0, group: 'load-opportunities'},
        {id: 'unminified-javascript', weight: 0, group: 'load-opportunities'},
        {id: 'unused-css-rules', weight: 0, group: 'load-opportunities'},
        {id: 'uses-optimized-images', weight: 0, group: 'load-opportunities'},
        {id: 'uses-webp-images', weight: 0, group: 'load-opportunities'},
        {id: 'uses-text-compression', weight: 0, group: 'load-opportunities'},
        {id: 'uses-rel-preconnect', weight: 0, group: 'load-opportunities'},
        {id: 'time-to-first-byte', weight: 0, group: 'load-opportunities'},
        {id: 'redirects', weight: 0, group: 'load-opportunities'},
        {id: 'uses-rel-preload', weight: 0, group: 'load-opportunities'},
        {id: 'efficient-animated-content', weight: 0, group: 'load-opportunities'},
        {id: 'total-byte-weight', weight: 0, group: 'diagnostics'},
        {id: 'uses-long-cache-ttl', weight: 0, group: 'diagnostics'},
        {id: 'dom-size', weight: 0, group: 'diagnostics'},
        {id: 'critical-request-chains', weight: 0, group: 'diagnostics'},
        {id: 'network-requests', weight: 0},
        {id: 'metrics', weight: 0},
        {id: 'user-timings', weight: 0, group: 'diagnostics'},
        {id: 'bootup-time', weight: 0, group: 'diagnostics'},
        {id: 'screenshot-thumbnails', weight: 0},
        {id: 'final-screenshot', weight: 0},
        {id: 'mainthread-work-breakdown', weight: 0, group: 'diagnostics'},
        {id: 'font-display', weight: 0, group: 'diagnostics'},
      ],
    },
    'pwa': {
      title: 'Progressive Web App',
      description: 'These checks validate the aspects of a Progressive Web App, as specified by the baseline [PWA Checklist](https://developers.google.com/web/progressive-web-apps/checklist).',
      manualDescription: 'These checks are required by the baseline ' +
          '[PWA Checklist](https://developers.google.com/web/progressive-web-apps/checklist) but are ' +
          'not automatically checked by Lighthouse. They do not affect your score but it\'s important that you verify them manually.',
      auditRefs: [
        // Most difficult and critical for good UX
        {id: 'load-fast-enough-for-pwa', weight: 7}, // can't be green in the category without being fast
        {id: 'works-offline', weight: 5},
        // Encompasses most of the other checks
        {id: 'webapp-install-banner', weight: 3},
        // Important but not too difficult
        {id: 'is-on-https', weight: 2},
        {id: 'redirects-http', weight: 2},
        {id: 'viewport', weight: 2},
        // Relatively easy checkboxes to tick with minimal value on their own
        {id: 'service-worker', weight: 1},
        {id: 'without-javascript', weight: 1},
        {id: 'splash-screen', weight: 1},
        {id: 'themed-omnibox', weight: 1},
        {id: 'content-width', weight: 1},
        {id: 'manifest-short-name-length', weight: 0},
        // Manual audits
        {id: 'pwa-cross-browser', weight: 0},
        {id: 'pwa-page-transitions', weight: 0},
        {id: 'pwa-each-page-has-url', weight: 0},
      ],
    },
    'accessibility': {
      title: 'Accessibility',
      description: 'These checks highlight opportunities to [improve the accessibility of your web app](https://developers.google.com/web/fundamentals/accessibility). Only a subset of accessibility issues can be automatically detected so manual testing is also encouraged.',
      manualDescription: 'These items address areas which an automated testing tool cannot cover. Learn more in our guide on [conducting an accessibility review](https://developers.google.com/web/fundamentals/accessibility/how-to-review).',
      auditRefs: [
        {id: 'accesskeys', weight: 1, group: 'a11y-correct-attributes'},
        {id: 'aria-allowed-attr', weight: 3, group: 'a11y-aria'},
        {id: 'aria-required-attr', weight: 2, group: 'a11y-aria'},
        {id: 'aria-required-children', weight: 5, group: 'a11y-aria'},
        {id: 'aria-required-parent', weight: 2, group: 'a11y-aria'},
        {id: 'aria-roles', weight: 3, group: 'a11y-aria'},
        {id: 'aria-valid-attr-value', weight: 2, group: 'a11y-aria'},
        {id: 'aria-valid-attr', weight: 5, group: 'a11y-aria'},
        {id: 'audio-caption', weight: 4, group: 'a11y-correct-attributes'},
        {id: 'button-name', weight: 10, group: 'a11y-element-names'},
        {id: 'bypass', weight: 10, group: 'a11y-describe-contents'},
        {id: 'color-contrast', weight: 6, group: 'a11y-color-contrast'},
        {id: 'definition-list', weight: 1, group: 'a11y-well-structured'},
        {id: 'dlitem', weight: 1, group: 'a11y-well-structured'},
        {id: 'document-title', weight: 2, group: 'a11y-describe-contents'},
        {id: 'duplicate-id', weight: 5, group: 'a11y-well-structured'},
        {id: 'frame-title', weight: 5, group: 'a11y-describe-contents'},
        {id: 'html-has-lang', weight: 4, group: 'a11y-language'},
        {id: 'html-lang-valid', weight: 1, group: 'a11y-language'},
        {id: 'image-alt', weight: 8, group: 'a11y-correct-attributes'},
        {id: 'input-image-alt', weight: 1, group: 'a11y-correct-attributes'},
        {id: 'label', weight: 10, group: 'a11y-describe-contents'},
        {id: 'layout-table', weight: 1, group: 'a11y-describe-contents'},
        {id: 'link-name', weight: 9, group: 'a11y-element-names'},
        {id: 'list', weight: 5, group: 'a11y-well-structured'},
        {id: 'listitem', weight: 4, group: 'a11y-well-structured'},
        {id: 'meta-refresh', weight: 1, group: 'a11y-meta'},
        {id: 'meta-viewport', weight: 3, group: 'a11y-meta'},
        {id: 'object-alt', weight: 4, group: 'a11y-describe-contents'},
        {id: 'tabindex', weight: 4, group: 'a11y-correct-attributes'},
        {id: 'td-headers-attr', weight: 1, group: 'a11y-correct-attributes'},
        {id: 'th-has-data-cells', weight: 1, group: 'a11y-correct-attributes'},
        {id: 'valid-lang', weight: 1, group: 'a11y-language'},
        {id: 'video-caption', weight: 4, group: 'a11y-describe-contents'},
        {id: 'video-description', weight: 3, group: 'a11y-describe-contents'},
        // Manual audits
        {id: 'logical-tab-order', weight: 0},
        {id: 'focusable-controls', weight: 0},
        {id: 'interactive-element-affordance', weight: 0},
        {id: 'managed-focus', weight: 0},
        {id: 'focus-traps', weight: 0},
        {id: 'custom-controls-labels', weight: 0},
        {id: 'custom-controls-roles', weight: 0},
        {id: 'visual-order-follows-dom', weight: 0},
        {id: 'offscreen-content-hidden', weight: 0},
        {id: 'heading-levels', weight: 0},
        {id: 'use-landmarks', weight: 0},
      ],
    },
    'best-practices': {
      title: 'Best Practices',
      auditRefs: [
        {id: 'appcache-manifest', weight: 1},
        {id: 'no-websql', weight: 1},
        {id: 'is-on-https', weight: 1},
        {id: 'uses-http2', weight: 1},
        {id: 'uses-passive-event-listeners', weight: 1},
        {id: 'no-document-write', weight: 1},
        {id: 'external-anchors-use-rel-noopener', weight: 1},
        {id: 'geolocation-on-start', weight: 1},
        {id: 'doctype', weight: 1},
        {id: 'no-vulnerable-libraries', weight: 1},
        {id: 'js-libraries', weight: 0},
        {id: 'notification-on-start', weight: 1},
        {id: 'deprecations', weight: 1},
        {id: 'password-inputs-can-be-pasted-into', weight: 1},
        {id: 'errors-in-console', weight: 1},
        {id: 'image-aspect-ratio', weight: 1},
      ],
    },
    'seo': {
      title: 'SEO',
      description: 'These checks ensure that your page is optimized for search engine results ranking. ' +
          'There are additional factors Lighthouse does not check that may affect your search ranking. ' +
          '[Learn more](https://support.google.com/webmasters/answer/35769).',
      manualDescription: 'Run these additional validators on your site to check additional SEO best practices.',
      auditRefs: [
        {id: 'viewport', weight: 1, group: 'seo-mobile'},
        {id: 'document-title', weight: 1, group: 'seo-content'},
        {id: 'meta-description', weight: 1, group: 'seo-content'},
        {id: 'http-status-code', weight: 1, group: 'seo-crawl'},
        {id: 'link-text', weight: 1, group: 'seo-content'},
        {id: 'is-crawlable', weight: 1, group: 'seo-crawl'},
        {id: 'robots-txt', weight: 1, group: 'seo-crawl'},
        {id: 'hreflang', weight: 1, group: 'seo-content'},
        {id: 'canonical', weight: 1, group: 'seo-content'},
        {id: 'font-size', weight: 1, group: 'seo-mobile'},
        {id: 'plugins', weight: 1, group: 'seo-content'},
        // Manual audits
        {id: 'mobile-friendly', weight: 0},
        {id: 'structured-data', weight: 0},
      ],
    },
  },
};

module.exports = defaultConfig;

// Use `defineProperty` so that the strings are accesible from original but ignored when we copy it
Object.defineProperty(module.exports, 'UIStrings', {
  enumerable: false,
  get: () => UIStrings,
});

/* WEBPACK VAR INJECTION */}.call(exports, "/index.js"))

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */


/** @type {LH.Config.Json} */
const fullConfig = {
  extends: 'lighthouse:default',
  settings: {},
  passes: [
    {
      passName: 'extraPass',
      gatherers: [
        'js-usage',
      ],
    },
  ],
  audits: [
    'byte-efficiency/unused-javascript',
  ],
  // @ts-ignore TODO(bckenny): type extended Config where e.g. category.title isn't required
  categories: {
    'performance': {
      auditRefs: [
        {id: 'unused-javascript', weight: 0, group: 'load-opportunities'},
      ],
    },
  },
};

module.exports = fullConfig;


/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/**
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    asyncTag = '[object AsyncFunction]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    nullTag = '[object Null]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    proxyTag = '[object Proxy]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    undefinedTag = '[object Undefined]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice,
    symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = isEqual;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(147)(module)))

/***/ }),
/* 147 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */


/**
 * Approximates the Gauss error function, the probability that a random variable
 * from the standard normal distribution lies within [-x, x]. Moved from
 * traceviewer.b.math.erf, based on Abramowitz and Stegun, formula 7.1.26.
 * @param {number} x
 * @return {number}
 */
function erf(x) {
  // erf(-x) = -erf(x);
  const sign = Math.sign(x);
  x = Math.abs(x);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * x);
  const y = t * (a1 + t * (a2 + t * (a3 + t * (a4 + t * a5))));
  return sign * (1 - y * Math.exp(-x * x));
}

/**
 * Creates a log-normal distribution à la traceviewer's statistics package.
 * Specified by providing the median value, at which the score will be 0.5,
 * and the falloff, the initial point of diminishing returns where any
 * improvement in value will yield increasingly smaller gains in score. Both
 * values should be in the same units (e.g. milliseconds). See
 *   https://www.desmos.com/calculator/tx1wcjk8ch
 * for an interactive view of the relationship between these parameters and
 * the typical parameterization (location and shape) of the log-normal
 * distribution.
 * @param {number} median
 * @param {number} falloff
 * @return {{computeComplementaryPercentile: function(number): number}}
 */
function getLogNormalDistribution(median, falloff) {
  const location = Math.log(median);

  // The "falloff" value specified the location of the smaller of the positive
  // roots of the third derivative of the log-normal CDF. Calculate the shape
  // parameter in terms of that value and the median.
  const logRatio = Math.log(falloff / median);
  const shape = Math.sqrt(1 - 3 * logRatio - Math.sqrt((logRatio - 3) * (logRatio - 3) - 8)) / 2;

  return {
    computeComplementaryPercentile(x) {
      const standardizedX = (Math.log(x) - location) / (Math.SQRT2 * shape);
      return (1 - erf(standardizedX)) / 2;
    },
  };
}

/**
 * Interpolates the y value at a point x on the line defined by (x0, y0) and (x1, y1)
 * @param {number} x0
 * @param {number} y0
 * @param {number} x1
 * @param {number} y1
 * @param {number} x
 * @return {number}
 */
function linearInterpolation(x0, y0, x1, y1, x) {
  const slope = (y1 - y0) / (x1 - x0);
  return y0 + (x - x0) * slope;
}

module.exports = {
  linearInterpolation,
  getLogNormalDistribution,
};


/***/ }),
/* 149 */
/***/ (function(module, exports) {

throw new Error("Module parse failed: Unexpected token (216:6)\nYou may need an appropriate loader to handle this file type.\n|     // Update/finish the previous network request and create a new one for the redirect.\n|     const modifiedData = {\n|       ...data,\n|       // Copy over the initiator as well to match DevTools behavior\n|       // TODO(phulce): abandon this DT hack and update Lantern graph to handle it");

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */


/** @typedef {import('../gather/driver.js')} Driver */

/**
 * Nexus 5X metrics adapted from emulated_devices/module.json
 * @type {LH.Crdp.Emulation.SetDeviceMetricsOverrideRequest}
 */
const NEXUS5X_EMULATION_METRICS = {
  mobile: true,
  screenWidth: 412,
  screenHeight: 732,
  width: 412,
  height: 732,
  positionX: 0,
  positionY: 0,
  scale: 1,
  deviceScaleFactor: 2.625,
  screenOrientation: {
    angle: 0,
    type: 'portraitPrimary',
  },
};

/**
 * Desktop metrics adapted from emulated_devices/module.json
 * @type {LH.Crdp.Emulation.SetDeviceMetricsOverrideRequest}
 */
const DESKTOP_EMULATION_METRICS = {
  mobile: false,
  width: 1350,
  height: 940,
  deviceScaleFactor: 1,
};

const NEXUS5X_USERAGENT = {
  userAgent: 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5 Build/MRA58N) AppleWebKit/537.36' +
    '(KHTML, like Gecko) Chrome/71.0.3559.0 Mobile Safari/537.36',
};

const DESKTOP_USERAGENT = {
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/71.0.3559.0 Safari/537.36',
};

const OFFLINE_METRICS = {
  offline: true,
  // values of 0 remove any active throttling. crbug.com/456324#c9
  latency: 0,
  downloadThroughput: 0,
  uploadThroughput: 0,
};

const NO_THROTTLING_METRICS = {
  latency: 0,
  downloadThroughput: 0,
  uploadThroughput: 0,
  offline: false,
};

const NO_CPU_THROTTLE_METRICS = {
  rate: 1,
};

/**
 * @param {Driver} driver
 * @return {Promise<void>}
 */
async function enableNexus5X(driver) {
  await Promise.all([
    driver.sendCommand('Emulation.setDeviceMetricsOverride', NEXUS5X_EMULATION_METRICS),
    // Network.enable must be called for UA overriding to work
    driver.sendCommand('Network.enable'),
    driver.sendCommand('Network.setUserAgentOverride', NEXUS5X_USERAGENT),
    driver.sendCommand('Emulation.setTouchEmulationEnabled', {enabled: true}),
  ]);
}

/**
 * @param {Driver} driver
 * @return {Promise<void>}
 */
async function enableDesktop(driver) {
  await Promise.all([
    driver.sendCommand('Emulation.setDeviceMetricsOverride', DESKTOP_EMULATION_METRICS),
    // Network.enable must be called for UA overriding to work
    driver.sendCommand('Network.enable'),
    driver.sendCommand('Network.setUserAgentOverride', DESKTOP_USERAGENT),
    driver.sendCommand('Emulation.setTouchEmulationEnabled', {enabled: false}),
  ]);
}

/**
 * @param {Driver} driver
 * @param {Required<LH.ThrottlingSettings>} throttlingSettings
 * @return {Promise<void>}
 */
function enableNetworkThrottling(driver, throttlingSettings) {
  /** @type {LH.Crdp.Network.EmulateNetworkConditionsRequest} */
  const conditions = {
    offline: false,
    latency: throttlingSettings.requestLatencyMs || 0,
    downloadThroughput: throttlingSettings.downloadThroughputKbps || 0,
    uploadThroughput: throttlingSettings.uploadThroughputKbps || 0,
  };

  // DevTools expects throughput in bytes per second rather than kbps
  conditions.downloadThroughput = Math.floor(conditions.downloadThroughput * 1024 / 8);
  conditions.uploadThroughput = Math.floor(conditions.uploadThroughput * 1024 / 8);
  return driver.sendCommand('Network.emulateNetworkConditions', conditions);
}

/**
 * @param {Driver} driver
 * @return {Promise<void>}
 */
function clearAllNetworkEmulation(driver) {
  return driver.sendCommand('Network.emulateNetworkConditions', NO_THROTTLING_METRICS);
}

/**
 * @param {Driver} driver
 * @return {Promise<void>}
 */
function goOffline(driver) {
  return driver.sendCommand('Network.emulateNetworkConditions', OFFLINE_METRICS);
}

/**
 * @param {Driver} driver
 * @param {Required<LH.ThrottlingSettings>} throttlingSettings
 * @return {Promise<void>}
 */
function enableCPUThrottling(driver, throttlingSettings) {
  const rate = throttlingSettings.cpuSlowdownMultiplier;
  return driver.sendCommand('Emulation.setCPUThrottlingRate', {rate});
}

/**
 * @param {Driver} driver
 * @return {Promise<void>}
 */
function disableCPUThrottling(driver) {
  return driver.sendCommand('Emulation.setCPUThrottlingRate', NO_CPU_THROTTLE_METRICS);
}

module.exports = {
  enableNexus5X,
  enableDesktop,
  enableNetworkThrottling,
  clearAllNetworkEmulation,
  enableCPUThrottling,
  disableCPUThrottling,
  goOffline,
};


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */


const Driver = __webpack_require__(118); // eslint-disable-line no-unused-vars

class Element {
  /**
   * @param {{nodeId: number}} element
   * @param {Driver} driver
   */
  constructor(element, driver) {
    if (!element || !driver) {
      throw Error('Driver and element required to create Element');
    }
    this.driver = driver;
    this.element = element;
  }

  /**
   * @param {string} name Attribute name
   * @return {Promise<?string>} The attribute value or null if not found
   */
  getAttribute(name) {
    return this.driver
      .sendCommand('DOM.getAttributes', {
        nodeId: this.element.nodeId,
      })
      /**
       * @param resp The element attribute names & values are interleaved
       */
      .then(resp => {
        const attrIndex = resp.attributes.indexOf(name);
        if (attrIndex === -1) {
          return null;
        }

        return resp.attributes[attrIndex + 1];
      });
  }

  /**
   * @return {number}
   */
  getNodeId() {
    return this.element.nodeId;
  }

  /**
   * @param {string} propName Property name
   * @return {Promise<?string>} The property value
   */
  getProperty(propName) {
    return this.driver
      .sendCommand('DOM.resolveNode', {
        nodeId: this.element.nodeId,
      })
      .then(resp => {
        if (!resp.object.objectId) {
          return null;
        }
        return this.driver.getObjectProperty(resp.object.objectId, propName);
      })
      .catch(() => null);
  }
}

module.exports = Element;


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */


/**
 * @fileoverview Fills most of the role of NetworkManager and NetworkRequest classes from DevTools.
 * @see https://cs.chromium.org/chromium/src/third_party/blink/renderer/devtools/front_end/sdk/NetworkRequest.js
 * @see https://cs.chromium.org/chromium/src/third_party/blink/renderer/devtools/front_end/sdk/NetworkManager.js
 */

const URL = __webpack_require__(99);

const SECURE_SCHEMES = ['data', 'https', 'wss', 'blob', 'chrome', 'chrome-extension', 'about'];

/**
 * @typedef HeaderEntry
 * @property {string} name
 * @property {string} value
 */

/**
 * @typedef ParsedURL
 * @property {string} scheme
 * @property {string} host
 * @property {string} securityOrigin
 */

/** @type {SelfMap<LH.Crdp.Page.ResourceType>} */
const RESOURCE_TYPES = {
  XHR: 'XHR',
  Fetch: 'Fetch',
  EventSource: 'EventSource',
  Script: 'Script',
  Stylesheet: 'Stylesheet',
  Image: 'Image',
  Media: 'Media',
  Font: 'Font',
  Document: 'Document',
  TextTrack: 'TextTrack',
  WebSocket: 'WebSocket',
  Other: 'Other',
  Manifest: 'Manifest',
  SignedExchange: 'SignedExchange',
  Ping: 'Ping',
  CSPViolationReport: 'CSPViolationReport',
};

module.exports = class NetworkRequest {
  constructor() {
    this.requestId = '';
    // TODO(phulce): remove default DevTools connectionId
    this.connectionId = '0';
    this.connectionReused = false;

    this.url = '';
    this.protocol = '';
    this.isSecure = false;
    this.parsedURL = /** @type {ParsedURL} */ ({scheme: ''});
    this.documentURL = '';

    this.startTime = -1;
    /** @type {number} */
    this.endTime = -1;
    /** @type {number} */
    this.responseReceivedTime = -1;

    this.transferSize = 0;
    this.resourceSize = 0;
    this.fromDiskCache = false;
    this.fromMemoryCache = false;

    this.finished = false;
    this.requestMethod = '';
    this.statusCode = -1;
    /** @type {NetworkRequest|undefined} The network request that redirected to this one */
    this.redirectSource = undefined;
    /** @type {NetworkRequest|undefined} The network request that this one redirected to */
    this.redirectDestination = undefined;
    /** @type {NetworkRequest[]|undefined} The chain of network requests that redirected to this one */
    this.redirects = undefined;
    this.failed = false;
    this.localizedFailDescription = '';

    this.initiator = /** @type {LH.Crdp.Network.Initiator} */ ({type: 'other'});
    /** @type {LH.Crdp.Network.ResourceTiming|undefined} */
    this.timing = undefined;
    /** @type {LH.Crdp.Page.ResourceType|undefined} */
    this.resourceType = undefined;
    this.mimeType = '';
    /** @type {LH.Crdp.Network.ResourcePriority} */
    this.priority = 'Low';
    /** @type {NetworkRequest|undefined} */
    this.initiatorRequest = undefined;
    /** @type {HeaderEntry[]} */
    this.responseHeaders = [];
    /** @type {string} */
    this.responseHeadersText = '';

    this.fetchedViaServiceWorker = false;
    /** @type {string|undefined} */
    this.frameId = '';
    this.isLinkPreload = false;
  }

  /**
   * @return {boolean}
   */
  hasErrorStatusCode() {
    return this.statusCode >= 400;
  }

  /**
   * @param {NetworkRequest} initiator
   */
  setInitiatorRequest(initiator) {
    this.initiatorRequest = initiator;
  }

  /**
   * @param {LH.Crdp.Network.RequestWillBeSentEvent} data
   */
  onRequestWillBeSent(data) {
    this.requestId = data.requestId;

    const url = new URL(data.request.url);
    this.url = data.request.url;
    this.documentURL = data.documentURL;
    this.parsedURL = {
      scheme: url.protocol.split(':')[0],
      // Intentional, DevTools uses different terminology
      host: url.hostname,
      securityOrigin: url.origin,
    };
    this.isSecure = SECURE_SCHEMES.includes(this.parsedURL.scheme);

    this.startTime = data.timestamp;

    this.requestMethod = data.request.method;

    this.initiator = data.initiator;
    this.resourceType = data.type && RESOURCE_TYPES[data.type];
    this.priority = data.request.initialPriority;

    this.frameId = data.frameId;
    this.isLinkPreload = data.initiator.type === 'preload' || !!data.request.isLinkPreload;
  }

  onRequestServedFromCache() {
    this.fromMemoryCache = true;
  }

  /**
   * @param {LH.Crdp.Network.ResponseReceivedEvent} data
   */
  onResponseReceived(data) {
    this._onResponse(data.response, data.timestamp, data.type);
    this.frameId = data.frameId;
  }

  /**
   * @param {LH.Crdp.Network.DataReceivedEvent} data
   */
  onDataReceived(data) {
    this.resourceSize += data.dataLength;
    if (data.encodedDataLength !== -1) {
      this.transferSize += data.encodedDataLength;
    }
  }

  /**
   * @param {LH.Crdp.Network.LoadingFinishedEvent} data
   */
  onLoadingFinished(data) {
    // On some requests DevTools can send duplicate events, prefer the first one for best timing data
    if (this.finished) return;

    this.finished = true;
    this.endTime = data.timestamp;
    if (data.encodedDataLength >= 0) {
      this.transferSize = data.encodedDataLength;
    }

    this._updateResponseReceivedTimeIfNecessary();
    this._updateTransferSizeForLightRiderIfNecessary();
  }

  /**
   * @param {LH.Crdp.Network.LoadingFailedEvent} data
   */
  onLoadingFailed(data) {
    // On some requests DevTools can send duplicate events, prefer the first one for best timing data
    if (this.finished) return;

    this.finished = true;
    this.endTime = data.timestamp;

    this.failed = true;
    this.resourceType = data.type && RESOURCE_TYPES[data.type];
    this.localizedFailDescription = data.errorText;

    this._updateResponseReceivedTimeIfNecessary();
  }

  /**
   * @param {LH.Crdp.Network.ResourceChangedPriorityEvent} data
   */
  onResourceChangedPriority(data) {
    this.priority = data.newPriority;
  }

  /**
   * @param {LH.Crdp.Network.RequestWillBeSentEvent} data
   */
  onRedirectResponse(data) {
    if (!data.redirectResponse) throw new Error('Missing redirectResponse data');
    this._onResponse(data.redirectResponse, data.timestamp, data.type);
    this.resourceType = undefined;
    this.finished = true;
    this.endTime = data.timestamp;

    this._updateResponseReceivedTimeIfNecessary();
  }

  /**
   * @param {LH.Crdp.Network.Response} response
   * @param {number} timestamp
   * @param {LH.Crdp.Network.ResponseReceivedEvent['type']=} resourceType
   */
  _onResponse(response, timestamp, resourceType) {
    this.url = response.url;

    this.connectionId = String(response.connectionId);
    this.connectionReused = response.connectionReused;

    if (response.protocol) this.protocol = response.protocol;

    this.responseReceivedTime = timestamp;

    this.transferSize = response.encodedDataLength;
    if (typeof response.fromDiskCache === 'boolean') this.fromDiskCache = response.fromDiskCache;

    this.statusCode = response.status;

    this.timing = response.timing;
    if (resourceType) this.resourceType = RESOURCE_TYPES[resourceType];
    this.mimeType = response.mimeType;
    this.responseHeadersText = response.headersText || '';
    this.responseHeaders = NetworkRequest._headersDictToHeadersArray(response.headers);

    this.fetchedViaServiceWorker = !!response.fromServiceWorker;

    if (this.fromMemoryCache) this.timing = undefined;
    if (this.timing) this._recomputeTimesWithResourceTiming(this.timing);

    this._updateTransferSizeForLightRiderIfNecessary();
  }

  /**
   * Resolve differences between conflicting timing signals. Based on the property setters in DevTools.
   * @see https://github.com/ChromeDevTools/devtools-frontend/blob/56a99365197b85c24b732ac92b0ac70feed80179/front_end/sdk/NetworkRequest.js#L485-L502
   * @param {LH.Crdp.Network.ResourceTiming} timing
   */
  _recomputeTimesWithResourceTiming(timing) {
    // Take startTime and responseReceivedTime from timing data for better accuracy.
    // Timing's requestTime is a baseline in seconds, rest of the numbers there are ticks in millis.
    this.startTime = timing.requestTime;
    const headersReceivedTime = timing.requestTime + timing.receiveHeadersEnd / 1000;
    if (!this.responseReceivedTime || this.responseReceivedTime < 0) {
      this.responseReceivedTime = headersReceivedTime;
    }

    this.responseReceivedTime = Math.min(this.responseReceivedTime, headersReceivedTime);
    this.responseReceivedTime = Math.max(this.responseReceivedTime, this.startTime);
    this.endTime = Math.max(this.endTime, this.responseReceivedTime);
  }

  /**
   * Update responseReceivedTime to the endTime if endTime is earlier.
   * A response can't be received after the entire request finished.
   */
  _updateResponseReceivedTimeIfNecessary() {
    this.responseReceivedTime = Math.min(this.endTime, this.responseReceivedTime);
  }

  /**
   * LR loses transfer size information, but passes it in the 'X-TotalFetchedSize' header.
   */
  _updateTransferSizeForLightRiderIfNecessary() {
    // Bail if we're not in LightRider, this only applies there.
    if (!global.isLightRider) return;
    // Bail if we somehow already have transfer size data.
    if (this.transferSize) return;

    const totalFetchedSize = this.responseHeaders.find(item => item.name === 'X-TotalFetchedSize');
    // Bail if the header was missing.
    if (!totalFetchedSize) return;
    this.transferSize = parseFloat(totalFetchedSize.value);
  }

  /**
   * Convert the requestId to backend-version by removing the `:redirect` portion
   *
   * @param {string} requestId
   * @return {string}
   */
  static getRequestIdForBackend(requestId) {
    return requestId.replace(/(:redirect)+$/, '');
  }

  /**
   * Based on DevTools NetworkManager.
   * @see https://github.com/ChromeDevTools/devtools-frontend/blob/3415ee28e86a3f4bcc2e15b652d22069938df3a6/front_end/sdk/NetworkManager.js#L285-L297
   * @param {LH.Crdp.Network.Headers} headersDict
   * @return {Array<HeaderEntry>}
   */
  static _headersDictToHeadersArray(headersDict) {
    const result = [];
    for (const name of Object.keys(headersDict)) {
      const values = headersDict[name].split('\n');
      for (let i = 0; i < values.length; ++i) {
        result.push({name: name, value: values[i]});
      }
    }
    return result;
  }

  static get TYPES() {
    return RESOURCE_TYPES;
  }
};


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */


/**
 * @fileoverview This class saves all protocol messages whose method match a particular
 *    regex filter. Used when saving assets for later analysis by another tool such as
 *    Webpagetest.
 */
class DevtoolsLog {
  /**
   * @param {RegExp=} regexFilter
   */
  constructor(regexFilter) {
    this._filter = regexFilter;

    /** @type {LH.DevtoolsLog} */
    this._messages = [];
    this._isRecording = false;
  }

  /**
   * @return {LH.DevtoolsLog}
   */
  get messages() {
    return this._messages;
  }

  reset() {
    this._messages = [];
  }

  beginRecording() {
    this._isRecording = true;
  }

  endRecording() {
    this._isRecording = false;
  }

  /**
   * Records a message if method matches filter and recording has been started.
   * @param {LH.Protocol.RawEventMessage} message
   */
  record(message) {
    if (this._isRecording && (!this._filter || this._filter.test(message.method))) {
      this._messages.push(message);
    }
  }
}

module.exports = DevtoolsLog;


/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
// @ts-nocheck


/* global window document */

/**
 * Helper functions that are passed by `toString()` by Driver to be evaluated in target page.
 */

/**
 * The `exceptionDetails` provided by the debugger protocol does not contain the useful
 * information such as name, message, and stack trace of the error when it's wrapped in a
 * promise. Instead, map to a successful object that contains this information.
 * @param {string|Error} err The error to convert
 */
/* istanbul ignore next */
function wrapRuntimeEvalErrorInBrowser(err) {
  err = err || new Error();
  const fallbackMessage = typeof err === 'string' ? err : 'unknown error';

  return {
    __failedInBrowser: true,
    name: err.name || 'Error',
    message: err.message || fallbackMessage,
    stack: err.stack || (new Error()).stack,
  };
}

/**
 * Used by _waitForCPUIdle and executed in the context of the page, updates the ____lastLongTask
 * property on window to the end time of the last long task.
 */
/* istanbul ignore next */
function registerPerformanceObserverInPage() {
  window.____lastLongTask = window.performance.now();
  const observer = new window.PerformanceObserver(entryList => {
    const entries = entryList.getEntries();
    for (const entry of entries) {
      if (entry.entryType === 'longtask') {
        const taskEnd = entry.startTime + entry.duration;
        window.____lastLongTask = Math.max(window.____lastLongTask, taskEnd);
      }
    }
  });

  observer.observe({entryTypes: ['longtask']});
  // HACK: A PerformanceObserver will be GC'd if there are no more references to it, so attach it to
  // window to ensure we still receive longtask notifications. See https://crbug.com/742530.
  // For an example test of this behavior see https://gist.github.com/patrickhulce/69d8bed1807e762218994b121d06fea6.
  //   FIXME COMPAT: This hack isn't neccessary as of Chrome 62.0.3176.0
  //   https://bugs.chromium.org/p/chromium/issues/detail?id=742530#c7
  window.____lhPerformanceObserver = observer;
}

/**
 * Used by _waitForCPUIdle and executed in the context of the page, returns time since last long task.
 */
/* istanbul ignore next */
function checkTimeSinceLastLongTask() {
  // Wait for a delta before returning so that we're sure the PerformanceObserver
  // has had time to register the last longtask
  return new Promise(resolve => {
    const timeoutRequested = window.performance.now() + 50;

    setTimeout(() => {
      // Double check that a long task hasn't happened since setTimeout
      const timeoutFired = window.performance.now();
      const timeSinceLongTask = timeoutFired - timeoutRequested < 50 ?
          timeoutFired - window.____lastLongTask : 0;
      resolve(timeSinceLongTask);
    }, 50);
  });
}

/**
 * @param {string=} selector Optional simple CSS selector to filter nodes on.
 *     Combinators are not supported.
 * @return {Array<Element>}
 */
/* istanbul ignore next */
function getElementsInDocument(selector) {
  /** @type {Array<Element>} */
  const results = [];

  /** @param {NodeListOf<Element>} nodes */
  const _findAllElements = nodes => {
    for (let i = 0, el; el = nodes[i]; ++i) {
      if (!selector || el.matches(selector)) {
        results.push(el);
      }
      // If the element has a shadow root, dig deeper.
      if (el.shadowRoot) {
        _findAllElements(el.shadowRoot.querySelectorAll('*'));
      }
    }
  };
  _findAllElements(document.querySelectorAll('*'));

  return results;
}

/**
 * Gets the opening tag text of the given node.
 * @param {Element} element
 * @param {Array<string>=} ignoreAttrs An optional array of attribute tags to not include in the HTML snippet.
 * @return {string}
 */
/* istanbul ignore next */
function getOuterHTMLSnippet(element, ignoreAttrs=[]) {
  const clone = element.cloneNode();

  ignoreAttrs.forEach(attribute =>{
    clone.removeAttribute(attribute);
  });

  const reOpeningTag = /^.*?>/;
  const match = clone.outerHTML.match(reOpeningTag);

  return (match && match[0]) || '';
}

/**
 * Computes a memory/CPU performance benchmark index to determine rough device class.
 * @see https://docs.google.com/spreadsheets/d/1E0gZwKsxegudkjJl8Fki_sOwHKpqgXwt8aBAfuUaB8A/edit?usp=sharing
 *
 * The benchmark creates a string of length 100,000 in a loop.
 * The returned index is the number of times per second the string can be created.
 *
 *  - 750+ is a desktop-class device, Core i3 PC, iPhone X, etc
 *  - 300+ is a high-end Android phone, Galaxy S8, low-end Chromebook, etc
 *  - 75+ is a mid-tier Android phone, Nexus 5X, etc
 *  - <75 is a budget Android phone, Alcatel Ideal, Galaxy J2, etc
 */
/* istanbul ignore next */
function ultradumbBenchmark() {
  const start = Date.now();
  let iterations = 0;

  while (Date.now() - start < 500) {
    let s = ''; // eslint-disable-line no-unused-vars
    for (let j = 0; j < 100000; j++) s += 'a';

    iterations++;
  }

  const durationInSeconds = (Date.now() - start) / 1000;
  return iterations / durationInSeconds;
}

module.exports = {
  wrapRuntimeEvalErrorInBrowserString: wrapRuntimeEvalErrorInBrowser.toString(),
  registerPerformanceObserverInPageString: registerPerformanceObserverInPage.toString(),
  checkTimeSinceLastLongTaskString: checkTimeSinceLastLongTask.toString(),
  getElementsInDocumentString: getElementsInDocument.toString(),
  getOuterHTMLSnippetString: getOuterHTMLSnippet.toString(),
  getOuterHTMLSnippet: getOuterHTMLSnippet,
  ultradumbBenchmark: ultradumbBenchmark,
  ultradumbBenchmarkString: ultradumbBenchmark.toString(),
};


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */


/** @typedef {void|LH.GathererArtifacts[keyof LH.GathererArtifacts]} PhaseResult */

/**
 * Base class for all gatherers; defines pass lifecycle methods. The artifact
 * from the gatherer is the last not-undefined value returned by a lifecycle
 * method. All methods can return the artifact value directly or return a
 * Promise that resolves to that value.
 *
 * If an Error is thrown (or a Promise that rejects on an Error), the
 * GatherRunner will check for a `fatal` property on the Error. If not set to
 * `true`, the runner will treat it as an error internal to the gatherer and
 * continue execution of any remaining gatherers.
 */
class Gatherer {
  /**
   * @return {keyof LH.GathererArtifacts}
   */
  get name() {
    // @ts-ignore - assume that class name has been added to LH.GathererArtifacts.
    return this.constructor.name;
  }

  /* eslint-disable no-unused-vars */

  /**
   * Called before navigation to target url.
   * @param {LH.Gatherer.PassContext} passContext
   * @return {PhaseResult|Promise<PhaseResult>}
   */
  beforePass(passContext) { }

  /**
   * Called after target page is loaded. If a trace is enabled for this pass,
   * the trace is still being recorded.
   * @param {LH.Gatherer.PassContext} passContext
   * @return {PhaseResult|Promise<PhaseResult>}
   */
  pass(passContext) { }

  /**
   * Called after target page is loaded, all gatherer `pass` methods have been
   * executed, and — if generated in this pass — the trace is ended. The trace
   * and record of network activity are provided in `loadData`.
   * @param {LH.Gatherer.PassContext} passContext
   * @param {LH.Gatherer.LoadData} loadData
   * @return {PhaseResult|Promise<PhaseResult>}
   */
  afterPass(passContext, loadData) { }

  /* eslint-enable no-unused-vars */
}

module.exports = Gatherer;


/***/ })
/******/ ])));