var mime = require('mime');
var utils = require('connect').utils;
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

  if(content && !isdev) {
    res.end(content);
  } else {
    fs.readFile(normalize(defaultRoot + path), 'utf8', function(err, data) {
        cache[path] = data;
        res.end(data);
    })
  }
}
