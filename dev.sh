#! /bin/sh
nodemon --watch static --exec 'jade -o {title:"kickstart"} -O public/' static/*.jade &
node-dev app.js
