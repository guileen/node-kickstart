#! /bin/sh
nodemon --watch static --exec 'jade -O public/' static/*.jade &
nodemon -w routes -w app.js app.js
