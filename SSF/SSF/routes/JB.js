﻿'use strict';
var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
const { GetUrl } = require('./database_url');
var uri = GetUrl('null');

//mode 0:  1:密碼錯誤或帳號不存在,按上一頁再試一次 2:伺服器連線問題請,請按上一頁再試一次 3:操作不合法,請聯絡網站管理者
function warming(res, mode) {
    var str = ['', '密碼錯誤或帳號(版號)不存在,按上一頁再試一次', '伺服器連線問題,請按上一頁再試一次', '操作不合法,請聯絡網站管理者'];
    res.render('warming', { warming: str[mode] });
}

//to public & private board

function test_type(req, res, type) {
    MongoClient.connect(uri +"people", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("people").collection("manager_information");
        var findThing = { board_ID: req.body.board_ID };
        table.findOne(findThing, { projection: { _id: 0 } },function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            //console.log(result);
            if (result != null) {
                if (result['type'] == type && type == 'public') {
                    jumpboard(req, res, result['type']);
                }
                else if (result['type'] == type && type == 'private' && result['password_public'] == req.body.board_password) {
                    jumpboard(req, res, result['type']);
                }
                else
                    warming(res, 1);
            }
            else
                warming(res, 3);
        });
    });
}

function jumpboard(req, res, type) {
    MongoClient.connect(uri +"board", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("board").collection(req.body.board_ID);
        var findThing = { hide: 'false' };
        table.find(findThing, { projection: { _id: 0 } }).toArray(function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            //console.log(result);
            var pkg = { board_ID: req.body.board_ID, ID: req.body.ID, data: result, num: result.length, password: req.body.password };
            if (req.body.place)
                pkg['place'] = req.body.place;
            else
                pkg['place'] = 'NA';
            if (type == "private")
                pkg['board_password'] = req.body.board_password;
            else
                pkg['board_password'] = 'NA';
            res.render('Page8', pkg);
        });
    });
}

//get introduce
function get_board_information(req, res) {
    MongoClient.connect(uri +"board", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("board").collection('all_board_number');
        var findThing = { board_ID: req.query.board_ID };
        table.findOne(findThing, { projection: { _id: 0 } },function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            //console.log(result);
            if (result != null)
                res.send({ title: result['title'], introduce: result['introduce'], type: result['type'] });
            else
                warming(res, 3);
        });
    });
}

//to post

router.post('/to_public_board', function (req, res) {
    //console.log(req.body);
    test_type(req, res, 'public');
});

router.post('/to_private_board', function (req, res) {
    //console.log(req.body);
    test_type(req, res, 'private');
});

router.get('/get_board_introduce', function (req, res) {
    //console.log(req.query);
    get_board_information(req, res);
});

router.post('/to_post_page', function (req, res) {
    //console.log(req.body);
    res.render('Page9', { ID: req.body.ID, board_ID: req.body.board_ID, type: req.body.type, personal_password: req.body.personal_password, board_password: req.body.board_password});
    //res.render('Page9', { ID: 'leon1234858', board_ID: 'private_0002', type: 'private' });
});

module.exports = router;