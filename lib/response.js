/*!
 * Kickstart - response
 * Copyright(c) 2012 Gui Lin <guileen@gmail.com>
 * MIT Licensed
 */

var fs = require('fs')
  , http = require('http')
  , path = require('path')
  , normalize = path.normalize
  , connect = require('connect')
  , utils = connect.utils
  , mime = require('mime')
  , config = require('../config')
  , zlib = require('zlib')
  ;

/**
 * Response prototype.
 */
var res = http.ServerResponse.prototype;

res.endjson = function(obj) {
  this.end(JSON.stringify(obj));
}

res.error = function(err) {
  this.writeHead(500, 'Internal server error');
  this.end('<h1>500 Internal server error');
  console.log(err);
}

var staticFileCache = {};
var watchingFiles = {};
var waitingFiles = {};

function updateStaticCache(path, callback) {
  path = normalize(path);

  if(callback) {
    if(!waitingFiles[path]) {
      waitingFiles[path] = [];
    }
    waitingFiles[path].push(callback);
  }

  if(!watchingFiles[path]) {
    fs.watch(path, function(event){
        console.log(event)
        statFile();
    });
    statFile();
    watchingFiles[path] = true;
  }

  function doCallback(err, data){
    if(waitingFiles[path]) {
      waitingFiles[path].forEach(function(listen){
          listen(err, data);
      });
    }
    waitingFiles[path] = null;
  }

  function statFile(){
    console.log('stating file')

    fs.stat(path, function(err, stat) {
        if(err) return doCallback(err);

        if(stat.isDirectory()) {
          console.log('Not support directory');
          return;
        }

        var type = mime.lookup(path)
          , charset = mime.charsets.lookup(type)
          ;

        fs.readFile(path, function(err, buf) {

            if(err) return doCallback(err);

            var data = staticFileCache[path] = {
              lastModified: stat.mtime.toUTCString()
            , contentType:  type + (charset ? '; charset=' + charset : '')
            , rawLength: stat.size
            , rawBuf: buf.toString('binary')
            }

            if(type.match(/json|text|javascript/) && false) {

              zlib.gzip(buf, function(err, gzipbuf) {

                  data.gzipLength = gzipbuf.length;
                  data.gzipBuf = gzipbuf.toString('binary');
                  doCallback(null, data);
              });
            } else {

              doCallback(null, data);
            }

        });

    });

  }

}

function responseStaticCache(data, req, res, options) {

  var headers = options.headers || {}
    , accept = req.headers['accept-encoding']
    , maxAge = options.maxAge || 0
    ;

  headers['date'] = new Date().toUTCString();
  headers['cache-control'] = 'public, max-age=' + (maxAge / 1000);
  headers['last-modified'] = data.lastModified;
  headers['content-type'] = data.contentType;

  // conditional GET support
  if (utils.conditionalGET(req)) {
    if (!utils.modified(req, res)) {
      return utils.notModified(res);
    }
  }

  var statusCode = options.statusCode || 200;

  var body;
  if(accept && ~accept.indexOf('gzip') && data.gzipLength) {

    headers['content-encoding'] = 'gzip';
    headers['content-length'] = data.gzipLength;
    body = data.gzipBuf;
  } else {

    headers['content-length'] = data.rawLength;
    body = data.rawBuf;
  }

  res.writeHead(statusCode, headers);
  if(req.method == 'HEAD') return res.end();
  res.end(body);
}

/**
 * very fast static file response, store in memory.
 * be careful about memory.
 *
 */
res.staticCache = function(path, options) {

  var req = this.req
    , res = this
    , options = options || {}
    , root = options.root || config.response.static_root
    , path = normalize(root + '/' + path);

  var data = staticFileCache[path];

  if(data) {
    responseStaticCache(data, req, res, options);
  } else {
    updateStaticCache(path, function(err, data) {
        if(err) return res.error(err);
        responseStaticCache(data, req, res, options);
    });
  }

}
