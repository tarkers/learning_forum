'use strict';
var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var uri = "mongodb://localhost:27017/";
var core_ID = 'admin';
var core_password = '0000';

//function
function IsPasswordRight(req,res,next,other) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("people").collection("manager_information");
        var findThing = { board_ID: req.body.board_ID };
        table.find(findThing, { projection: { _id: 0 } }).toArray(function (err, result) {
            if (result[0]['password_private'] == req.body.password)
                next(req, res, other);
        });
    });
}

function Render(req, res, other) {
    res.render(other, { board_ID: req.body.board_ID, password: req.body.password });
}

function ReJSON(req, res, other) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("board").collection(req.body.board_ID);
        var findThing = { };
        table.find(findThing, { projection: { _id: 0 } }).toArray(function (err, result) {
            res.json({ data: result });
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
    if (req.body.board_ID == core_ID && req.body.password == core_password)
        Render(req, res, 'Page8');
});
//(AJAX) 個人下載自己看板的資料
router.post('/download', function (req, res) {
    IsPasswordRight(req, res, ReJSON, 'null');
});
//(AJAX) 核心管理者下載目標看板的資料
router.post('/core_download', function (req, res) {
    if (req.body.board_ID == core_ID && req.body.password == core_password)
        ReJSON(req, res, 'null');
});

module.exports = router;
