'use strict';
var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
const { GetUrl } = require('./database_url');
var uri = GetUrl('null');
var core_ID = 'admin';
var core_password = '0000';

//function

function warming(res, mode) {
     var str = ['', '密碼錯誤或帳號不存在,按上一頁再試一次', '伺服器連線問題,請按上一頁再試一次', '操作不合法,請聯絡網站管理者'];
    res.render('warming', { warming: str[mode] });
}

function IsPasswordRight(req,res,next,other) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("people").collection("manager_information");
        var findThing = { board_ID: req.body.board_ID };
        table.find(findThing, { projection: { _id: 0 } }).toArray(function (err, result) {
            if (err) { warming(res, 2); throw err; }
            if (result.length > 0) {
                if (result[0]['password_private'] == req.body.password)
                    next(req, res, other);
                else
                    warming(res, 1);
            }
            else
                warming(res, 1);
        });
    });
}

function Render(req, res, other) {
    res.render(other, { board_ID: req.body.board_ID, password: req.body.password });
}

function ReJSON(req, res, other) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var which = '';
        other == 'core' ? which = req.body.board : which = req.body.board_ID;
        var table = db.db("board").collection(which);
        var findThing = { };
        table.find(findThing, { projection: { _id: 0 } }).toArray(function (err, result) {
            if (err) { warming(res, 2); throw err; }
            //console.log(result);
            res.json({ data: result });
        });
    });
}
//week3 new function
function GetAllCollection(req, res) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db(req.body.DB).collection(req.body.collection);
        var findThing = {};
        table.find(findThing).toArray(function (err, result) {
            if (err) { warming(res, 2); throw err; }
            //console.log(result);
            if (result.length > 0)
                res.json({ data: result });
            else
                res.json({ data: [{ result: 'empty' }] });
        });
    });
}

function ChangeAllCollection(req, res) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db(req.body.DB).collection(req.body.collection);
        var saveThing = req.body.data;
        table.save(saveThing, function (err, result) {
            if (err) { res.json({ result:"error" }); }
            res.json({ result:"success" });
        });
    });
}
//route
//個人前往個人資料下載頁面
router.post('/to_personal_data', function (req, res) {
    IsPasswordRight(req, res, Render, 'Page7');
});
//核心管理者獲得看板所有資料
router.post('/to_all_data', function (req, res) {
    //console.log("in to to all board");
    //console.log(req.body);
    if (req.body.board_ID == core_ID && req.body.password == core_password)
        Render(req, res, 'Page8');
    else
        warming(res, 1);
});
//(AJAX) 個人下載自己看板的資料
router.post('/download', function (req, res) {
    IsPasswordRight(req, res, ReJSON, 'null');
});
//(AJAX) 核心管理者下載目標看板的資料
router.post('/core_download', function (req, res) {
    if (req.body.board_ID == core_ID && req.body.password == core_password)
        ReJSON(req, res, 'core');
    else
        warming(res, 1);
});
//(AJAX)得到一個表格的所有東西(JSON List to CSV)
router.post('/call_all_document', function (req, res) {
    //console.log(req.body);
    if (req.body.board_ID == core_ID && req.body.password == core_password)
        GetAllCollection(req, res);
    else
        warming(res, 1);
});
//(AJAX)把一堆東西存入一個表格(CSV to JSON List)
router.post('/change_all_document', function (req, res) {
    if (req.body.board_ID == core_ID && req.body.password == core_password)
        ChangeAllCollection(req, res);
    else
        warming(res, 1);
});

module.exports = router;
