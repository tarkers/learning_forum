'use strict';
var http = require('http');
var querystring = require('querystring');
var util = require('util');
var port = process.env.PORT || 1339;


http.createServer(function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.url == '/'  && req.method == 'GET') {
        res.writeHeader(200, { 'Content-Type': 'text/html;charset=utf-8' });
        res.end('Here are NCKU SSF\'s support server\n');
    }
    else if (req.url == '/json') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ message: "json servr test" }));
        res.end();
    }
    else if ( req.method == 'POST') {
        if (req.url == '/getTable') {
            let post = '';

            // 通?req的data事件?听函?，每?接受到?求体的?据，就累加到post?量中
            req.on('data', function (chunk) {
                post += chunk;
            });

            // 在end事件触?后，通?querystring.parse?post解析?真正的POST?求格式，然后向客?端返回。
            req.on('end', function () {
                post = querystring.parse(post);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                console.log(post['file']);
                res.end(util.inspect(post));
            });
        }
        else if (req.url == '/getImg') {
            let post = '';

            // 通?req的data事件?听函?，每?接受到?求体的?据，就累加到post?量中
            req.on('data', function (chunk) {
                post += chunk;
            });

            // 在end事件触?后，通?querystring.parse?post解析?真正的POST?求格式，然后向客?端返回。
            req.on('end', function () {
                post = querystring.parse(post);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                console.log(post['file']);
                res.end(util.inspect(post));
            });
        }
    }
}).listen(port);
