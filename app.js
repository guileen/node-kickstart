var http = require('http');
var routes = require('./routes');

var APPEND_SLASH = true;

var handlers = {};

// prevent circulation
var allHandlers = [];

/**
 * build routes map for fast load
 *   url: /           ->  routes.index
 *   url: /foo        ->  routes.foo
 *   url: /api/bar    ->  routes.api.bar
 */
function buildHandlers(routes, path) {
  for (var name in routes) {
    var handler = routes[name];

    // prevent circulation
    if(allHandlers.indexOf(handler) >= 0) continue;

    if(typeof handler == 'function') {
      handlers[path + '/' + name] = handler;

      if(name == 'index') {
        handlers[path] = handlers[path + '/'] = handler;

        if(APPEND_SLASH){
          handlers[path] = handlers[path] = handler;
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

/**
 * get handler for path, try to find the moest deep handler
 *
 *    url: /user/123456/edit  -> routes.user
 *    url: /js/jquery.js      -> routes
 *
 */
function getHandler(urlpath) {
  var paths = urlpath.split('/')
    , lastHandler = module = routes
    , path;

  for(var i = 1; i < paths.length; i++) {
    path = paths[i] || 'index';
    module = module[path];
    if(typeof module == 'function') {
      lastHandler = module;
    }
    if(!module) return lastHandler;
  }
  return lastHandler;
}

var app = function(req, res) {
  var pathAndQuery = req.url.split('?', 2);
  var path = req.path = pathAndQuery[0];
  req.querystring = pathAndQuery[1];
  (handlers[path] || getHandler(path))(req, res);
}

http.createServer(app).listen(3000)
