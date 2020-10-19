'use strict';
var http = require('http');
var querystring = require('querystring');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var nStatic = require('node-static');
var fileServer = new nStatic.Server('./uploadImg');
var port = process.env.PORT || 1339; //port要改
const hashnumber = 17;
const baseURL = 'http://140.116.183.54:1339'; //自己在哪個domain


function createCSV(origin_data) {
    var returnStr;
    //console.log(origin_data);
    for (var i in origin_data) {
        var len = Object.keys(origin_data[i]).length;
        returnStr += origin_data[i]['num'] + ',';
        returnStr += origin_data[i]['title'] + ',';
        returnStr += origin_data[i]['include'] + ',';
        returnStr += origin_data[i]['ID'] + ',';
        returnStr += origin_data[i]['hide'];
        if (len - 5 > 0)
            returnStr += origin_data[i]['hide'] += ',';
        for (var j = 1; j <= len - 5; j++) {
            if (j < len - 5)
                returnStr += origin_data[i][j.toString()] + ',';
            else
                returnStr += origin_data[i][j.toString()];
        }
        returnStr += '\r\n';
    }
    //console.log(returnStr);
    return returnStr;
}

http.createServer(function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', /*'140.116.*'*/ '*'); //跨域允許要加限制
    if (req.method == 'GET') {
        fileServer.serve(req, res);
    }
    else if ( req.method == 'POST') {
        if (req.url == '/getTable' && req.method == 'POST') {
            let post = '';

            req.on('data', function (chunk) {
                post += chunk;
            });

            req.on('end', function () {
                post = querystring.parse(post);
                res.writeHead(200, { 'Content-Type': 'html/text' });
                var origin_data = JSON.parse(post['data']);
                //console.log(origin_data);
                res.end(createCSV(origin_data));
            });
        }
        else if (req.url == '/getImg' && req.method == 'POST') {
            var form = formidable.IncomingForm();
            var random = parseInt(Math.random() * 10000);
            var place = (random % hashnumber).toString();
            // set save to where
            form.uploadDir = '.\\uploadImg\\'+ place;
            form.parse(req, function (err, fields, files) {
                // all information of picture are in files.file
                //console.log(files)
                //console.log(files.file.path);
                if (err) {throw err;}
                // __dirname is where server is, get the path of file
                if (files.file != null) {
                    var oldpath = __dirname + "\\" + files.file.path;
                    //console.log(oldpath);
                    // time
                    var time = +new Date();
                    // .jpg .png ......
                    var extname = path.extname(files.file.name);
                    // new name
                    var newpath = __dirname + '\\uploadImg\\' + place + '\\' + time + random + extname;
                    var returnpath ='/' + place + '/' + time + random + extname;
                    //console.log(newpath);
                    fs.rename(oldpath, newpath, function (err) {
                        if (err) {
                            console.log(err.message);
                            res.end("error");
                            throw Error("false");
                        }
                        res.end(baseURL + returnpath);
                    });
                }
                else
                    res.end("error");
            });
        }
    }
}).listen(port);
