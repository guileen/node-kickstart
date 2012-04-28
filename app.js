var http = require('http')
  , routes = require('./routes')
  , utils = require('./lib/utils')
  , getHandler = utils.getHandler
  , handlers = utils.buildHandlers(routes, {append_slash: true});

// import response utilities
require('./lib/response');

var app = function(req, res) {

  res.req = req;

  var pathAndQuery = req.url.split('?', 2);
  var path = req.path = pathAndQuery[0];
  req.querystring = pathAndQuery[1];

  (handlers[path] || getHandler(path, routes))(req, res);

}

if(module.parent) {
  module.exports = app
} else {
  http.createServer(app).listen(3000)
}
