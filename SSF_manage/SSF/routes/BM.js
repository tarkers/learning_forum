'use strict';
var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var uri = "mongodb://localhost:27017/";
var core_ID = 'admin';
var core_password = '0000';

//function
function login(req, res) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("people").collection("manager_information");
        var findThing = { board_ID: req.body.board_ID };
        table.find(findThing, { projection: { _id: 0 } }).toArray(function (err, result) {
            if (result[0]['password_private'] == req.body.password)
                res.render('Page3', { board_ID: req.body.board_ID, password: req.body.password });
        });
    });
}

function build_getCount(req, res) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("board").collection("all_board_number");
        var findThing = {};
        table.find(findThing, { projection: { _id: 0 } }).toArray(function (err, result) {
            build_insertManagerInformation(req, res, req.body.type + '_' + (result.length + 1).toString());
        });
    });
}

function build_insertManagerInformation(req, res, new_board_ID) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("people").collection('manager_information');
        var insertThing = {
            board_ID: new_board_ID, type: req.body.type,
            title: req.body.title, introduce: req.body.introduce,
            name: req.body.name, school: req.body.school, class: req.body.class,
            password_private: req.body.password_private, password_public: req.body.password_public,
            tab: req.body.tab, include: req.body.include
        };
        table.insertOne(insertThing, function (err, result) {
            if (err) throw err;
            db.close();
            build_insertAllBoardNumber(req, res, new_board_ID);
        });
    });
}

function build_insertAllBoardNumber(req, res,new_board_ID) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("board").collection('all_board_number');
        var insertThing = {
            board_ID: new_board_ID, introduce: req.body.introduce, title: req.body.title, type: req.body.type
        };
        table.insertOne(insertThing, function (err, result) {
            if (err) throw err;
            db.close();
            if (req.body.type == 'public')
                build_insertClass(req, res, new_board_ID);
            else
                render('Page10', { board_ID: req.body.board_ID, password: req.body.password, board: new_board_ID })
        });
    });
}

function build_insertClass(req, res, new_board_ID) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("data").collection(req.body.class + '_board');
        var insertThing = {
            board_ID: new_board_ID, include: req.body.include, title: req.body.title, tab: req.body.tab
        };
        table.insertOne(insertThing, function (err, result) {
            if (err) throw err;
            db.close();
            res.render('Page10', { board_ID: req.body.board_ID, password: req.body.password, board: new_board_ID });
        });
    });
}

function update_managerInformation(req, res) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("people").collection("manager_information");
        var filter = { board_ID: req.body.board };
        var goal = {
            title: req.body.title, introduce: req.body.introduce,
            name: req.body.name, school: req.body.school,
            class: req.body.class, password_private: req.body.password_private,
            password_public: req.body.password_public,
            tab: req.body.tab, include: req.body.include
        };
        table.updateOne(filter, { $set: goal }, function (err, result) {
            if (err) {
                res.json({ result: 'error' });
                throw err;
            }
            db.close();
            //console.log(result);
            update_AllBoardNumber(res, req);
        });
    });
}

function update_AllBoardNumber(req, res) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("board").collection("all_board_number");
        var filter = { board_ID: req.body.board };
        var goal = { title: req.body.title, introduce: req.body.introduce };
        table.updateOne(filter, { $set: goal }, function (err, result) {
            if (err) {
                res.json({ result: 'error' });
                throw err;
            }
            db.close();
            //console.log(result);
            if (req.body.type == 'public')
                update_ClassBoard(res, req);
            else
                res.json({ result: 'success' });
        });
    });
}

function update_ClassBoard(req, res) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db('data').collection(req.body.class + '_board');
        var filter = { board_ID: req.body.board };
        var goal = { title: req.body.title, tab: req.body.tab, include: req.body.include};
        table.updateOne(filter, { $set: goal }, function (err, result) {
            if (err) {
                res.json({ result: 'error' });
                throw err;
            }
            db.close();
            //console.log(result);
            res.json({ result: 'success' });
        });
    });
}

function get_information(req, res) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("people").collection("manager_information");
        var findThing = { board_ID: req.body.board };
        table.find(findThing, { projection: { _id: 0 } }).toArray(function (err, result) {
            if (err) {
                res.json({ result: error });
                throw err;
            }
            res.json({ result: success,data:result[0] });
        });
    });
}

//router
//前往管理者建立頁
router.post('/to_manager_build', function (req, res) {
    if (req.body.board_ID == core_ID && req.body.password == core_password)
        res.render('Page9', { board_ID: req.body.board_ID, password: req.body.password });
});
//前往管理者資料更新頁
router.post('/to_manager_update', function (req, res) {
    if (req.body.board_ID == core_ID && req.body.password == core_password)
        res.render('Page10', { board_ID: req.body.board_ID, password: req.body.password });
});
//管理者註冊(建立)
router.post('/build', function (req, res) {
    build_getCount(req, res);
});
//(AJAX)更新管理者註冊資料
router.post('/update', function (req, res) {
    if (req.body.board_ID == core_ID && req.body.password == core_password)
        update_managerInformation(res, req);
});
//(AJAX)獲得管理者註冊資料
router.post('/get_information', function (req, res) {
    if (req.body.board_ID == core_ID && req.body.password == core_password)
        get_information(req,res);
});
//管理者登入
router.post('/login', function (req, res) {
    login(req, res);
});
//核心管理者登入
router.post('/core_login', function (req, res) {
    if (req.body.board_ID == core_ID && req.body.password == core_password)
        res.render('Page4', { board_ID: req.body.board_ID, password: req.body.password });
});

module.exports = router;
