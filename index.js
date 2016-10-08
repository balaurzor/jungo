'use strict';
var compression = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var querystring = require('querystring');
var server = require('express')();
var cors = require('cors');

server.use(cors({origin: ['http://localhost:8082', 'http://localhost:8080', 'http://themove.dk', 'http://themove.dk/admin', 'http://beta.themove.dk/admin']}));

server.use(compression());
server.use(cookieParser());

server.use(bodyParser.json()); // for parsing application/json
server.use(bodyParser.urlencoded({
    extended: true
})); // for parsing


// Start server
var listener = server.listen(process.env.PORT || 8888, () => {
    console.log(`server running on ${listener.address().port}`);
});

server.post('/login', function(req, res, next) {
    console.log(req.body);
    var promise = doHTTPrequest(req);
    Promise.all([promise]).then(function(response) {
        var data = response[0];
        res.status(data.status).send(data.response);
        return data;
    }).catch(next);
});

server.get('/cookie', function(req, res) {
    console.log("Cookies :  ", req.cookies);
});

server.get('/clearcookie', function(req, res) {
    clearCookie('cookie_name');
    res.send('Cookie deleted');
});

function creatOptions(req, post_data) {
    return {
        host: req.get('Host').split(':')[0],
        port: '8081',
        path: '/api' + req.url,
        method: req.method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(post_data)
        }
    }
}

function doHTTPrequest(req) {
    return new Promise((resolve) => {
        var post_data = querystring.stringify(req.body);
        var post_options = creatOptions(req, post_data);

        // Set up the request
        var post_req = http.request(post_options, function(res) {
            res.setEncoding('utf8');

            res.on('data', function(chunk) {
                resolve({
                    status: res.statusCode,
                    response: chunk
                });
            });
        });

        // post the data
        post_req.write(post_data);
        post_req.end();
    });
}
