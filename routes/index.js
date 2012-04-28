var connect = require('connect')
  , path = require('path')
  , utils = require('../lib/utils')
  ;

// default static files
var app = module.exports = utils.use(
  connect.favicon()
, connect.static(path.join(__dirname, '../public'))
, connect.staticCache()
, function(req, res, next) {
    res.writeHead(404);
    res.end('Not Found');
  }
);

// url /
app.index = function(req, res) {
  res.staticCache('index.html')
  // utils.staticCache(res, 'index.html')
  // slow version
  // req.url = '/index.html'
  // static.handle(req, res);
}

app.login = function(req, res) {
  res.staticCache('login.html')
}

app.user = require('./user');
app.api = require('./api');
