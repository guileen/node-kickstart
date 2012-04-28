var siege = require('siege')

var http = require('http')
http.maxSockets = 100

siege(__dirname + '/../app.js')
  .on(4000)
  .for(10000).times
  .concurrent(100)
  .get('/')
  .get('/api/json')
  .get('/user/')
  .get('/foo')
  .attack()
