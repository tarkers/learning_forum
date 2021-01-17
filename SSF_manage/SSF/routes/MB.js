'use strict';
var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
const { GetUrl } = require('./database_url');
const uri = GetUrl('null');
const core_ID = GetUrl('core_ID');
const core_password = GetUrl('core_password');

//function

//mode 0:  1:密碼錯誤或帳號不存在,按上一頁再試一次 2:伺服器連線問題請,請按上一頁再試一次 3:操作不合法,請聯絡網站管理者
function warming(res, mode) {
    var str = ['', '密碼錯誤或帳號不存在,按上一頁再試一次', '伺服器連線問題,請按上一頁再試一次', '操作不合法,請聯絡網站管理者'];
    res.render('warming', { warming: str[mode] });
}

function IsPasswordRight(req, res, next, other) {
    MongoClient.connect(uri + "people", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("people").collection("manager_information");
        var findThing = { board_ID: req.body.board_ID };
        table.findOne(findThing, { projection: { _id: 0 } }, function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            if (result != null) {
                if (result['password_private'] == req.body.password)
                    next(req, res, other);
                else
                    warming(res, 1);
            } else
                warming(res, 1);
        });
    });
}

function ReJSON(req, res) {
    MongoClient.connect(uri + "people", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("people").collection("manager_information");
        var findThing = { board_ID: req.body.board_ID };
        table.findOne(findThing, { projection: { _id: 0 } }, function (err, result) {
            if (err) {
                res.json({ result: 'error' })
                throw err;
            }
            db.close();
            //console.log(result[0]);
            if (result != null)
                res.json({ data: result, result: 'success' });
            else
                warming(res, 1);
        });
    });
}

function Render(req, res, other) {
    MongoClient.connect(uri + "board", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("board").collection(req.body.board_ID);
        var findThing = {};
        table.find(findThing, { projection: { _id: 0 } }).sort({ _id: 1 }).toArray(function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            res.render(other, { board_ID: req.body.board_ID, password: req.body.password, data: result });
        });
    });
}

function RenderAll(req, res, other) {
    MongoClient.connect(uri + "board", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("board").collection("all_board_number");
        var findThing = {};
        table.find(findThing, { projection: { _id: 0 } }).sort({ _id: 1 }).toArray(function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            res.render(other, { board_ID: req.body.board_ID, password: req.body.password, data: result });
        });
    });
}

function get_password(req, res) {
    MongoClient.connect(uri + "people", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("people").collection("manager_information");
        var findThing = { board_ID: req.body.board };
        table.findOne(findThing, { projection: { _id: 0 } }, function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            if (result != null) {
                force_jump(req, res, result['password_private']);
            }
            else
                warming(res, 1);
        });
    });
}

function force_jump(req, res, new_password) {
    MongoClient.connect(uri + "board", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("board").collection(req.body.board);
        var findThing = {};
        table.find(findThing, { projection: { _id: 0 } }).sort({ _id: 1 }).toArray(function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            res.render('Page5', { board_ID: req.body.board, password: new_password, data: result });
        });
    });
}

function hideUpdate(req, res) {
    MongoClient.connect(uri + "board", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("board").collection(req.body.board_ID);
        var filter = { num: req.body.num };
        var goal = { hide: req.body.hide };
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

function board_update_getClassAndpassword(req, res) {
    MongoClient.connect(uri + "people", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("people").collection("manager_information");
        var findThing = { board_ID: req.body.board_ID };
        table.findOne(findThing, { projection: { _id: 0 } }, function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            if (result != null) {
                if (result['password_private'] == req.body.password) {
                    board_update_updateMain(req, res, req.body.type, result['class'], result['type']);
                }
                else
                    warming(res, 1);
            }
            else
                warming(res, 1);
        });
    });
}

function board_update_updateMain(req, res, type, name, right) {
    MongoClient.connect(uri + "people", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("people").collection("manager_information");
        var filter = { board_ID: req.body.board_ID };
        var goal = {};
        goal[req.body.type] = req.body.include;
        table.updateOne(filter, { $set: goal }, function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            switch (type) {
                case 'title':
                    board_update_updateTwo(req, res, "data", name + '_board', type, right);
                    break;
                case 'include':
                case 'tab':
                    if (right == 'public')
                        board_update_updateOne(req, res, "data", name + '_board', type);
                    else
                        res.json({ result: 'success' });
                    break;
                case 'introduce':
                    board_update_updateOne(req, res, "board", 'all_board_number', type);
                    break;
                default:
                    warming(res, 3);
                    break;
            }
        });
    });
}

function board_update_updateTwo(req, res, database, collection, type, right) {
    MongoClient.connect(uri + "board", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db('board').collection('all_board_number');
        var filter = { board_ID: req.body.board_ID };
        var goal = {};
        goal[type] = req.body.include;
        table.updateOne(filter, { $set: goal }, function (err, result) {
            if (err) {
                res.json({ result: 'error' });
                throw err;
            }
            db.close();
            //console.log(result);
            if (right == 'public')
                board_update_updateOne(req, res, database, collection, type);
            else
                res.json({ result: 'success' });
        });
    });
}

function board_update_updateOne(req, res, database, collection, type) {
    MongoClient.connect(uri + database, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db(database).collection(collection);
        var filter = { board_ID: req.body.board_ID };
        var goal = {};
        goal[type] = req.body.include;
        table.updateOne(filter, { $set: goal }, function (err, result) {
            if (err) {
                console.log(err);
                res.json({ result: 'error' });
                throw err;
            }
            db.close();
            //console.log(result);
            res.json({ result: 'success' });
        });
    });
}
//router
//前往個人看板管理
router.post('/to_personal_manage', function (req, res) {
    IsPasswordRight(req, res, Render, 'Page5');
});
//前往全體看板管理頁
router.post('/to_all_manage', function (req, res) {
    if (req.body.board_ID == core_ID && req.body.password == core_password)
        RenderAll(req, res, 'Page6');
    else
        warming(res, 1);
});
//從全體看板管理頁指定個人看版管理頁跳躍
router.post('/force_to_personal_manage', function (req, res) {
    if (req.body.board_ID == core_ID && req.body.password == core_password)
        get_password(req, res);
    else
        warming(res, 1);
});
//變更看板hide 屬性
router.post('/post_display', function (req, res) {
    IsPasswordRight(req, res, hideUpdate, 'null');
});
//更改看板相關資訊
router.post('/board_update', function (req, res) {
    board_update_getClassAndpassword(req, res);
});
//取得看板資訊
router.post('/board_information', function (req, res) {
    ReJSON(req, res);
});

module.exports = router;
