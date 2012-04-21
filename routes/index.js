var connect = require('connect')
  , path = require('path')
  , utils = require('./utils')
  ;

// default static files
var static = connect()
  .use(connect.favicon())
  .use(connect.static(path.join(__dirname, '../public')))
  .use(connect.staticCache())
  ;

var app = module.exports = function(req, res) {
  static.handle(req, res);
}

// url /
app.index = function(req, res, next) {
  utils.staticCache(res, 'index.html')
  // you can also use below code, just for NOTE
  // req.url = '/index.html'
  // static.handle(req, res);
}

app.user = require('./user')
app.api = require('./api');
