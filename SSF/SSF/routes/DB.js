'use strict';
var express = require('express');
var router = express.Router();
var urlencode = require('urlencode');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var uri = "mongodb://localhost:27017/";
//getpassword
function getPassword_private(req,res) {
    MongoClient.connect(uri , { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("board").collection("all_board_number");
        var findThing = { board_ID: req.body.board_ID };
        table.find(findThing, { projection: { _id: 0 } }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            console.log(result[0]['password'] == req.body.board_password)
            if (result[0]['password'] == req.body.board_password) {
                getCount_public(req, res);
            }
        });
    });
}
//updataNum
function getCount_public(req,res) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("board").collection(req.body.board_ID);
        var findThing = {};
        table.find(findThing, { projection: { _id: 0 } }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            //console.log(result);
            insert_public(req, res, result.length);
        });
    });
}
//insert public
function insert_public(req, res,num) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("board").collection(req.body.board_ID);
        var insertThing = { num: num+1 ,ID: req.body.ID, title: req.body.title, include: req.body.include };
        table.insertOne(insertThing, function (err, result) {
            if (err) throw err;
            db.close();
            //console.log(result);
            jumpPublic(req.body.board_ID, req.body.ID, res);
        });
    });
}
//jump to public board
function jumpPublic(board_ID, ID, res) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("board").collection(board_ID);
        var findThing = {};
        table.find(findThing, { projection: { _id: 0} }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            //console.log(result);
            res.render('Page8', { board_ID: board_ID , ID: ID, data: result, num: result.length });
        });
    });
}
//router.post('/to_post_page', function (req, res) {
router.post('/post_public', function (req, res) {
    console.log(req.body);
    getCount_public(req, res);
});

router.post('/post_private', function (req, res) {
    console.log(req.body);
    getPassword_private(req, res);
});

router.get('/post_preview', function (req, res) {
    res.render('preview', { html: urlencode.decode(req.query.html) });
});
//test data  { "_id" : ObjectId("5f467c9f452c6bd802ab5974"), "board_ID" : "private_0002", "type" : "private", "title" : "test", "introduce" : "<h1>testtesttest</h1>", "password" : "0000" }
router.get('/get_board_introduce', function (req, res) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("board").collection('all_board_number');
        var findThing = { board_ID: req.query.board_ID };
        table.find(findThing, { projection: { _id: 0 } }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            console.log(result);
            res.send({ data: result, num: result.length });
        });
    });
});

router.post('/discuss', function (req, res) {
    console.log(req.body);
});

module.exports = router;