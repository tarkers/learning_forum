'use strict';
var express = require('express');
var router = express.Router();
var urlencode = require('urlencode');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
const {GetUrl} = require('./database_url');
var uri = GetUrl('null');
//function block
//mode 0:  1:密碼錯誤或帳號不存在,按上一頁再試一次 2:伺服器連線問題請,請按上一頁再試一次 3:操作不合法,請聯絡網站管理者
function warming(res, mode) {
    var str = ['', '密碼錯誤或帳號不存在,按上一頁再試一次', '伺服器連線問題,請按上一頁再試一次', '操作不合法,請聯絡網站管理者'];
    res.render('warming', { warming: str[mode] });
}

//test personal_password

function test_personal_password(req, res, callback) {
    MongoClient.connect(uri + "people", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("people").collection("personal_information");
        var findThing = { ID: req.body.ID };
        table.findOne(findThing, { projection: { _id: 0 } },function (err, result) {
            if (err) { warming(res, 2); throw err; }
            //console.log(result);
            if (result != null) {
                if (result['password'] == req.body.personal_password) {
                    callback(req, res);
                }
                else
                    warming(res, 1);
            }
            else
                warming(res, 3);
        });
    });
}

//post public && post private

function getPassword_private(req, res) {
    MongoClient.connect(uri + "people", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("people").collection("manager_information");
        var findThing = { board_ID: req.body.board_ID };
        table.findOne(findThing, { projection: { _id: 0 } },function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            //console.log(result);
            if (result != null) {
                //console.log(result[0]['password_public'] == req.body.board_password)
                if (result['password_public'] == req.body.board_password) {
                    getCount_public(req, res);
                }
                else
                    warming(res, 1);
            }
            else
                warming(res, 1);
        });
    });
}

function getCount_public(req, res) {
    MongoClient.connect(uri + "lock", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("lock").collection("board");
        var findThing = { board_ID: req.body.board_ID };
        var updateThing = { $inc: { count: 1 } };
        var set = { projection: { _id: 0 } };
        table.findOneAndUpdate(findThing, updateThing, set ,function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            if (result.ok == 1)
                add_lockForboardID(req, res, result.value.count);
            else
                warming(res, 2);
        });
    });
}

function add_lockForboardID(req, res, num) {
    MongoClient.connect(uri + "lock", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("lock").collection(req.body.board_ID);
        var insertThing = { num: (num).toString(), count:1 };
        table.insertOne(insertThing, function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            //console.log(result);
            insert_public(req, res, num);
        });
    });
}

function plus_follower(req, res, num) {
    MongoClient.connect(uri + "follow", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("follow").collection(req.body.board_ID);
        var insertThing = { num: (num).toString() };
        insertThing[req.body.ID] = req.body.ID;
        table.insertOne(insertThing, function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            //console.log(result);
        });
    });
}

function insert_public(req, res, num) {
    MongoClient.connect(uri +"board", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("board").collection(req.body.board_ID);
        var insertThing = { num: (num).toString(), ID: req.body.ID, title: req.body.title, include: req.body.include, hide: 'false' };
        table.insertOne(insertThing, function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            //console.log(result);
            plus_follower(req, res, num);
            jumpPublic(req, req.body.board_ID, req.body.ID, res);
        });
    });
}

function jumpPublic(req, board_ID, ID, res) {
    MongoClient.connect(uri +"board", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("board").collection(board_ID);
        var findThing = { hide: 'false' };
        table.find(findThing, { projection: { _id: 0 } }).toArray(function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            //console.log(result);
            var pkg = { board_ID: board_ID, ID: ID, data: result, num: result.length, board_password: req.body.board_password, password: req.body.personal_password};
            if (req.body.place)
                pkg['place'] = req.body.place;
            else
                pkg['place'] = 'NA';
            res.render('Page8', pkg);
        });
    });
}

//add lover
function add_lover(req, res) {
    MongoClient.connect(uri +"people", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("people").collection("personal_lover");
        var filter = { ID: req.query.ID };
        var goal = {};
        goal[req.query.board_ID] = req.query.board_ID;
        //console.log(filter);
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

//discuss
function discuss_getNum(req, res) {
    MongoClient.connect(uri +"lock", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("lock").collection(req.body.board_ID);
        var findThing = { num: req.body.num };
        var updateThing = { $inc: { count: 1 } };
        var set = { projection: { _id: 0 } };
        table.findOneAndUpdate(findThing, updateThing, set , function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            //console.log(result);
            if (result.ok == 1)
                discuss_update(req, res, result.value.count);
            else
                warming(res, 3);
        });
    });
}

function discuss_update(req, res, num) {
    MongoClient.connect(uri +"board", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("board").collection(req.body.board_ID);
        var filter = { num: req.body.num };
        var goal = {};
        goal[num.toString()] = req.body.ID + ':' + req.body.include;
        //console.log(goal);
        table.updateOne(filter, { $set: goal }, function (err, result) {
            if (err) {
                //console.log(err);
                res.json({ result: 'error' });
                throw err;
            }
            db.close();
            //console.log(result);
            discuss_notice(req);
            res.json({ result: 'success' });
        });
    });
}

function discuss_notice(req) {
    MongoClient.connect(uri +"follow", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("follow").collection(req.body.board_ID);
        var findThing = { num: req.body.num };
        table.findOne(findThing, { projection: { _id: 0, num: 0 } }, function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            //console.log(result[0]);
            if (result != null)
                discuss_notice_add(req, result);
            else
                warming(res, 3);
        });
    });
}

function discuss_notice_add(req, data) {
    MongoClient.connect(uri +"follow", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("follow").collection(req.body.board_ID);
        var filter = { num: req.body.num };
        var goal = {};
        goal[req.body.ID] = req.body.ID;
        table.updateOne(filter, { $set: goal }, function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            //console.log(result);
            var list = Object.keys(data);
            //console.log(list);
            for (var i in list)
                if (list[i] != req.body.ID)
                    discuss_notice_send(list[i], req.body.board_ID + '_' + req.body.num);
        });
    });
}

function discuss_notice_send(id, key) {
    MongoClient.connect(uri +"people", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("people").collection("personal_notice");
        var filter = { ID: id };
        var goal = {};
        goal[key] = key;
        table.updateOne(filter, { $set: goal }, function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            //console.log(id+'->' + key);
        });
    });
}

//ReWrite

function to_rewrite(req, res) {
    MongoClient.connect(uri +"people", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("people").collection("personal_information");
        var findThing = { ID: req.body.ID };
        table.findOne(findThing, { projection: { _id: 0 } },function (err, result) {
            if (err) { warming(res, 2); throw err; }
            //console.log(result);
            db.close();
            if (result != null) {
                if (result['password'] == req.body.password) {
                    to_rewrite_check_numID(req, res);
                }
                else
                    warming(res, 1);
            }
            else
                warming(res, 1);
        });
    });
}

function to_rewrite_check_numID(req,res) {
    MongoClient.connect(uri +"board", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("board").collection(req.body.board_ID);
        var findThing = { num: req.body.num };
        table.findOne(findThing, { projection: { _id: 0 } },function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            //console.log(result[0]['include']);
            if (result != null) {
                if (result['ID'] == req.body.ID) {
                    res.render('Page10', {
                        board_ID: req.body.board_ID,
                        ID: req.body.ID, password: req.body.password,
                        num: req.body.num, include_origin: result['include'],
                        board_password: req.body.board_password,
                        password: req.body.password
                    })
                }
                else
                    warming(res, 3);
            }
            else
                warming(res, 3);
        });
    });
}

function rewrite_check_password(req, res) {
    MongoClient.connect(uri +"people", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("people").collection("personal_information");
        var findThing = { ID: req.body.ID };
        table.findOne(findThing, { projection: { _id: 0 } },function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            //console.log(result);
            if (result != null) {
                if (result['password'] == req.body.password) {
                    rewrite_checknum(req, res);
                }
                else
                    warming(res, 1);
            }
            else
                warming(res, 3);
        });
    });
}

function rewrite_checknum(req, res) {
    MongoClient.connect(uri +"board", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("board").collection(req.body.board_ID);
        var findThing = { num: req.body.num };
        table.findOne(findThing, { projection: { _id: 0 } },function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            //console.log(result);
            if (result != null) {
                if (result['ID'] == req.body.ID) {
                    rewrite_update(req, res);
                }
                else
                    warming(res, 3);
            }
            else
                warming(res, 3);
        });
    });
}

function rewrite_update(req, res) {
    MongoClient.connect(uri +"board", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("board").collection(req.body.board_ID);
        var filter = { num: req.body.num };
        var goal = {};
        goal['include'] = req.body.include;
        table.updateOne(filter, { $set: goal }, function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            //console.log(result);
            rewrite_return_board(req, res);
        });
    });
}

function rewrite_return_board(req, res) {
    MongoClient.connect(uri +"board", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("board").collection(req.body.board_ID);
        var findThing = { hide: 'false' };
        table.find(findThing, { projection: { _id: 0 } }).toArray(function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            //console.log(result);
            var pkg = {
                board_ID: req.body.board_ID, ID: req.body.ID,
                data: result, num: result.length,
                place: req.body.num,
                board_password: req.body.board_password,
                password: req.body.password
            };
            res.render('Page8', pkg);
        });
    });
}

//refresh

function discuss_refresh(req, res) {
    MongoClient.connect(uri +"board", { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("board").collection(req.body.board_ID);
        var findThing = { num: req.body.num };
        table.findOne(findThing, { projection: { _id: 0, num: 0, ID: 0, title: 0, include: 0, hide: 0 } },function (err, result) {
            if (err) {
                res.json({ result: 'error' ,data:'NA'});
                throw err;
            }
            db.close();
            //console.log(result);
            res.json({ result: 'success', data: result});
        });
    });
}

//router block
router.post('/post_public', function (req, res) {
    //console.log(req.body);
    test_personal_password(req, res, getCount_public);
});

router.post('/post_private', function (req, res) {
    //console.log(req.body);
    test_personal_password(req, res, getPassword_private);
});

router.get('/post_preview', function (req, res) {
    res.render('preview', { html: urlencode.decode(req.query.html) });
});

router.get('/add_lover', function (req, res) {
    //res.render('preview', { html: urlencode.decode(req.query.html) });
    //console.log(req.query);
    add_lover(req, res);
});

router.post('/discuss', function (req, res) {
    //console.log(req.body);
    test_personal_password(req, res, discuss_getNum);
});

router.post('/to_ReWrite', function (req, res) {
    //console.log(req.body);
    to_rewrite(req, res);
});

router.post('/ReWrite', function (req, res) {
    //console.log(req.body);
    rewrite_check_password(req, res);
});

router.post('/discuss_refresh', function (req, res) {
    //console.log(req.body);
    discuss_refresh(req, res);
});

module.exports = router;