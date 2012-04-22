var path = require('path')
  , join = path.join
  ;

var exports = module.exports = {
  response : {
    static_root: join(__dirname, 'public')
  }
}
