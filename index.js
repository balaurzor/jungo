'use strict';
var compression = require('compression');
var cookieParser = require('cookie-parser');
var http = require('http');
var querystring = require('querystring');
var server = require('express')();

server.use(compression());
server.use(cookieParser());

// Start server
var listener = server.listen(process.env.PORT || 8888, () => {
    console.log(`server running on ${listener.address().port}`);
});

server.get('/login', function(req, res) {
    res.cookie('cake' , 'cookie_value').send('Cookie is set');
});

server.get('/cookie', function(req, res) {
    console.log("Cookies :  ", req.cookies);
});

server.get('/clearcookie', function (req, res) {
     clearCookie('cookie_name');
     res.send('Cookie deleted');
});
