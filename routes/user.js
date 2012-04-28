var utils = require('../lib/utils');

// url: /user/*
var user = module.exports = function(req, res) {
  // TODO load user id
  res.end(req.url)
}

// url: /user/
user.index = function(req, res) {
  res.staticCache('/user.html');
}

user._userid = {
  edit: function()
, delete: function()
}
