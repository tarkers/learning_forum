'use strict';
var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
const { GetUrl } = require('./database_url');
const uri = GetUrl('null');
const core_ID = GetUrl('core_ID');
const core_password = GetUrl('core_password');
const supuri = GetUrl('supServer');
//function
//mode 0:  1:密碼錯誤或帳號不存在,按上一頁再試一次 2:伺服器連線問題請,請按上一頁再試一次 3:操作不合法,請聯絡網站管理者
function warming(res, mode) {
    var str = { 1: '密碼錯誤或帳號不存在,按上一頁再試一次', 2:'伺服器連線問題,請按上一頁再試一次', 3:'操作不合法,請聯絡網站管理者'};
    res.render('warming', { warming: str[mode] });
}

function login(req, res) {
    MongoClient.connect(uri +"people", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("people").collection("manager_information");
        var findThing = { board_ID: req.body.board_ID };
        table.findOne(findThing, { projection: { _id: 0 } },function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            if (result != null) {
                if (result['password_private'] == req.body.password)
                    res.render('Page3', { board_ID: req.body.board_ID, password: req.body.password });
                else
                    warming(res, 1);
            }
            else
                warming(res, 3);
        });
    });
}

function build_getCount(req, res) {
    //console.log({ board_ID: req.body.board_ID, password: req.body.password});
    MongoClient.connect(uri +"lock", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("lock").collection("totalboard");
        var findThing = { tag: 1 };
        var updateThing = { $inc: { count: 1 } };
        var set = { projection: { _id: 0 } };
        table.findOneAndUpdate(findThing, updateThing, set, function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            if (result.ok == 1)
                build_setLockboard(req, res, result.value.count);
            else
                warming(res, 2);
        });
    });
}

function build_setLockboard(req, res, num) {
    MongoClient.connect(uri +"lock", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("lock").collection("board");
        var insertThing = { board_ID: req.body.type + '_' + (num).toString(), count: 1 };
        table.insertOne(insertThing, function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            //console.log(result);
            build_insertManagerInformation(req, res, req.body.type + '_' + (num).toString());
        });
    });
}

function build_insertManagerInformation(req, res, new_board_ID) {
    //console.log({ board_ID: req.body.board_ID, password: req.body.password});
    MongoClient.connect(uri +"people", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("people").collection('manager_information');
        var insertThing = {
            board_ID: new_board_ID, type: req.body.type,
            title: req.body.title, introduce: req.body.introduce,
            name: req.body.name, school: req.body.school, class: req.body.class,
            password_private: req.body.password_private, password_public: req.body.password_public,
            tab: req.body.tab, include: req.body.include
        };
        table.insertOne(insertThing, function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            build_insertAllBoardNumber(req, res, new_board_ID);
        });
    });
}

function build_insertAllBoardNumber(req, res, new_board_ID) {
    //console.log({ board_ID: req.body.board_ID, password: req.body.password});
    MongoClient.connect(uri +"board", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("board").collection('all_board_number');
        var insertThing = {
            board_ID: new_board_ID, introduce: req.body.introduce, title: req.body.title, type: req.body.type
        };
        table.insertOne(insertThing, function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            if (req.body.type == 'public')
                build_insertClass(req, res, new_board_ID);
            else
                res.render('Page10', { board_ID: req.body.board_ID, password: req.body.password, board: new_board_ID })
        });
    });
}

function build_insertClass(req, res, new_board_ID) {
    //console.log({ board_ID: req.body.board_ID, password: req.body.password });
    MongoClient.connect(uri +"data", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("data").collection(req.body.class + '_board');
        var insertThing = {
            board_ID: new_board_ID, include: req.body.include, title: req.body.title, tab: req.body.tab
        };
        table.insertOne(insertThing, function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            res.render('Page10', { board_ID: req.body.board_ID, password: req.body.password, board: new_board_ID });
            //console.log({ board_ID: req.body.board_ID, password: req.body.password, board: new_board_ID });
        });
    });
}

function update_managerInformation(req, res) {
    MongoClient.connect(uri +"people", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("people").collection("manager_information");
        var filter = { board_ID: req.body.board };
        var goal = {
            title: req.body.title, introduce: req.body.introduce,
            name: req.body.name, school: req.body.school,
            password_private: req.body.password_private,
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
            update_AllBoardNumber(req, res);
        });
    });
}

function update_AllBoardNumber(req, res) {
    MongoClient.connect(uri +"board", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("board").collection("all_board_number");
        var filter = { board_ID: req.body.board };
        var goal = { title: req.body.title, introduce: req.body.introduce };
        table.updateOne(filter, { $set: goal }, function (err, result) {
            if (err) {
                res.json({ result: 'error' });
                throw err;
            }
            //console.log(result);
            db.close();
            if (req.body.type == 'public')
                update_ClassBoard(req, res);
            else
                res.json({ result: 'success' });
        });
    });
}

function update_ClassBoard(req, res) {
    MongoClient.connect(uri +"data", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
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
    MongoClient.connect(uri +"people", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("people").collection("manager_information");
        var findThing = { board_ID: req.body.board };
        table.findOne(findThing, { projection: { _id: 0 } },function (err, result) {
            if (err) {
                res.json({ result: 'error' });
                throw err;
            }
            db.close();
            if (result != null)
                res.json({ result: 'success', data: result });
            else
                warming(res, 3);
        });
    });
}

//router
//前往管理者建立頁
router.post('/to_manager_build', function (req, res) {
    if (req.body.board_ID == core_ID && req.body.password == core_password)
        res.render('Page9', { board_ID: req.body.board_ID, password: req.body.password });
    else
        warming(res, 1);
});
//前往管理者資料更新頁
router.post('/to_manager_update', function (req, res) {
    if (req.body.board_ID == core_ID && req.body.password == core_password)
        res.render('Page10', { board_ID: req.body.board_ID, password: req.body.password, board: '不是建立看板後跳來,不提供預設看板號' });
    else
        warming(res, 1);
});
//管理者註冊(建立)
router.post('/build', function (req, res) {
    //console.log({ board_ID: req.body.board_ID, password: req.body.password});
    if (req.body.board_ID == core_ID && req.body.password == core_password)
        build_getCount(req, res);
    else
        warming(res, 1);
});
//(AJAX)更新管理者註冊資料
router.post('/update', function (req, res) {
    //console.log(req.body);
    if (req.body.board_ID == core_ID && req.body.password == core_password)
        update_managerInformation(req, res);
    else
        warming(res, 1);
});
//(AJAX)獲得管理者註冊資料
router.post('/get_information', function (req, res) {
    //console.log(req.body);
    if (req.body.board_ID == core_ID && req.body.password == core_password)
        get_information(req, res);
    else
        warming(res, 1);
});
//管理者登入
router.post('/login', function (req, res) {
    login(req, res);
});
//核心管理者登入
router.post('/core_login', function (req, res) {
    if (req.body.board_ID == core_ID && req.body.password == core_password)
        res.render('Page4', { board_ID: req.body.board_ID, password: req.body.password });
    else
        warming(res, 1);
});
//前往文字to html編輯器
router.get('/writer', function (req, res) {
    res.render('writer', { uri: supuri});
});
module.exports = router;
