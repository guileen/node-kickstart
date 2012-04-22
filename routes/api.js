// var msgpack = require('msgpack');

// url /api/*
var api = exports = module.exports;

// url /api/json
api.json = function(req, res) {
  res.endjson({
      id: 'id'
    , msg: 'i am json'
  })
}

// url /api/msgpack
api.msgpack = function(req, res) {
  res.end(msgpack.pack({
        id: 'id'
      , msg: 'I am msgpack'
  }))
}
