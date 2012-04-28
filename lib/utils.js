var mime = require('mime');
var exports = module.exports = require('connect').utils;
var normalize = require('path').normalize;
var fs = require('fs');
var isdev = process.env.NODE_ENV != 'production'

var cache = {};
var defaultRoot = normalize( __dirname + '/../public/' )


// NOTE it should use nginx to serve static files
exports.staticCache = function(res, path, headers, statusCode) {

  var content = cache[path];
  if(!headers) headers = {};
  headers['Content-Type'] = mime.lookup(path);
  res.writeHead(statusCode || 200, headers);

  if(content) {
    res.end(content);
  } else {
    fs.readFile(normalize(defaultRoot + path), 'utf8', function(err, data) {
        cache[path] = data;
        res.end(data);
    })
  }
}

/**
 * use connect middlewares
 *
 */
exports.use = function() {

  var middlewares = [].slice.apply(arguments);
  return function(req, res) {

    var index = 0;
    next();

    function next(err) {
      if(err) {
        return res.error(err);
      }

      if(index >= middlewares.length) {
        // reach the end
        return res.end('not found', 404);
      }

      var middleware = middlewares[index++];
      middleware.call(null, req, res, next);
    }

  }

}

/**
 * build routes map for fast load
 *   url: /           ->  routes.index
 *   url: /foo        ->  routes.foo
 *   url: /api/bar    ->  routes.api.bar
 */
exports.buildHandlers = function(routes, options) {

  var handlers = {};
  options = options || {};

  // prevent circulation
  var allHandlers = [];

  function buildHandlers(routes, path) {
    for (var name in routes) {
      var handler = routes[name];

      // prevent circulation
      if(allHandlers.indexOf(handler) >= 0) continue;

      if(typeof handler == 'function') {
        handlers[path + '/' + name] = handler;

        if(name == 'index') {
          handlers[path + '/'] = handler;

          if(options.append_slash){
            handlers[path] = handler;
          }

        }

        buildHandlers(handler, path + '/' + name);
      }

      if(typeof handler == 'object') {
        buildHandlers(handler, path + '/' + name);
      }
    }
  }

  buildHandlers(routes, '');
  return handlers;
}

/**
 * get handler for path, try to find the moest deep handler
 *
 *    url: /user/123456/edit  -> routes.user
 *    url: /js/jquery.js      -> routes
 *
 *    TODO
 *    url: /user/123456/edit  -> routes.user['*'].edit
 *
 */
exports.getHandler = function (urlpath, routes) {
  var paths = urlpath.split('/')
    , lastHandler = routes
    , handler = routes
    , path;

  for(var i = 1; i < paths.length; i++) {
    path = paths[i] || 'index';
    handler = handler[path];
    if(typeof handler == 'function') {
      lastHandler = handler;
    }
    if(!handler) return lastHandler;
  }
  return lastHandler;
}
