#! /bin/sh
nodemon --watch static --exec 'jade -O public/' static/*.jade &
node-dev app.js
