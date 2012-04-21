var http = require('http')
  , routes = require('./routes')
  , utils = require('./lib/utils')
  , getHandler = utils.getHandler
  , handlers = utils.buildHandlers(routes, {append_slash: true});

var app = function(req, res) {

  var pathAndQuery = req.url.split('?', 2);
  var path = req.path = pathAndQuery[0];
  req.querystring = pathAndQuery[1];

  (handlers[path] || getHandler(path, routes))(req, res);

}

http.createServer(app).listen(3000)
