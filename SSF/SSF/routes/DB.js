'use strict';
var express = require('express');
var router = express.Router();
var urlencode = require('urlencode');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var uri = "mongodb://localhost:27017/";

//function block

//post public && post private

function getPassword_private(req,res) {
    MongoClient.connect(uri , { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("people").collection("manager_information");
        var findThing = { board_ID: req.body.board_ID };
        table.find(findThing, { projection: { _id: 0 } }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            console.log(result);
            if (result.length > 0) {
                console.log(result[0]['password_public'] == req.body.board_password)
                if (result[0]['password_public'] == req.body.board_password) {
                    getCount_public(req, res);
                }
            }
        });
    });
}

function getCount_public(req,res) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("board").collection(req.body.board_ID);
        var findThing = {};
        table.find(findThing, { projection: { _id: 0 } }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            console.log(result);
            insert_public(req, res, result.length);
        });
    });
}

function plus_follower(req, num) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("follow").collection(req.body.board_ID);
        var insertThing = { num: (num + 1).toString() };
        insertThing[req.body.ID] = req.body.ID;
        table.insertOne(insertThing, function (err, result) {
            if (err) throw err;
            db.close();
            //console.log(result);
        });
    });
}

function insert_public(req, res,num) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("board").collection(req.body.board_ID);
        var insertThing = { num: (num + 1).toString(), ID: req.body.ID, title: req.body.title, include: req.body.include, hide: 'false' };
        table.insertOne(insertThing, function (err, result) {
            if (err) throw err;
            db.close();
            console.log(result);
            plus_follower(req, num);
            jumpPublic(req,req.body.board_ID, req.body.ID, res);
        });
    });
}

function jumpPublic(req,board_ID, ID, res) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("board").collection(board_ID);
        var findThing = { hide: 'false' };
        table.find(findThing, { projection: { _id: 0} }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            console.log(result);
            var pkg = { board_ID: board_ID, ID: ID, data: result, num: result.length };
            if (req.body.place)
                pkg['place'] = req.body.place;
            else
                pkg['place'] = 'NA';
            res.render('Page8', pkg);
        });
    });
}

//add lover
function add_lover(req,res) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("people").collection("personal_lover");
        var filter = { ID: req.query.ID };
        var goal = {};
        goal[req.query.board_ID] = req.query.board_ID;
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
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("board").collection(req.body.board_ID);
        var findThing = { num: req.body.num };
        table.find(findThing, { projection: { _id: 0 } }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            console.log(result);
            discuss_update(req, res, Object.keys(result[0]).length - 5 + 1);
        });
    });
}

function discuss_update(req, res, num) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("board").collection(req.body.board_ID);
        var filter = { num: req.body.num };
        var goal = {};
        goal[num.toString()] = req.body.ID + ':' + req.body.include;
        table.updateOne(filter, { $set: goal }, function (err, result) {
            if (err) {
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
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("follow").collection(req.body.board_ID);
        var findThing = { num: req.body.num };
        table.find(findThing, { projection: { _id: 0,num:0 } }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            //console.log(result);
            discuss_notice_add(req, result[0]);
        });
    });
}

function discuss_notice_add(req,data) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("follow").collection(req.body.board_ID);
        var filter = { num: req.body.num };
        var goal = {};
        goal[req.body.ID] = req.body.ID;
        table.updateOne(filter, { $set: goal }, function (err, result) {
            if (err) { throw err;}
            db.close();
            //console.log(result);
            var list = Object.keys(data);
            for (var i in list) 
                discuss_notice_send(i, req.body.board_ID + '_' + req.body.num);
        });
    });
}

function discuss_notice_send(id,key) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("people").collection("personal_notice");
        var filter = { ID: id };
        var goal = {};
        goal[key] = key;
        table.updateOne(filter, { $set: goal }, function (err, result) {
            if (err) { throw err; }
            db.close();
            console.log(id+'->' + key);
        });
    });
}

//router block
router.post('/post_public', function (req, res) {
    //console.log(req.body);
    getCount_public(req, res);
});

router.post('/post_private', function (req, res) {
    console.log(req.body);
    getPassword_private(req, res);
});

router.get('/post_preview', function (req, res) {
    res.render('preview', { html: urlencode.decode(req.query.html) });
});

router.get('/add_lover', function (req, res) {
    //res.render('preview', { html: urlencode.decode(req.query.html) });
    console.log(req.query);
    add_lover(req, res);
});

router.post('/discuss', function (req, res) {
    console.log(req.body);
    discuss_getNum(req, res);
});

module.exports = router;