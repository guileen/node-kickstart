var utils = require('../lib/utils')
  , should = require('should');

var routes = function() {}
routes.index = function() {}
routes.user = function() {}
routes.user.index = function() {}
routes.user.test = function(){}

describe('buildHandlers', function() {
    var handlers = utils.buildHandlers(routes);
    handlers['/'].should.equal(routes.index);
    handlers['/user/'].should.equal(routes.user.index);
    handlers['/user/test'].should.equal(routes.user.test);
})

describe('getHandler', function() {
    utils.getHandler('/js/jquery.js', routes).should.equal(routes);
    utils.getHandler('/user/foo', routes).should.equal(routes.user);
})
