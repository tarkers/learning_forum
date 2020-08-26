'use strict';
var express = require('express');
var router = express.Router();
var urlencode = require('urlencode');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
//updataNum
function getCount_public(req,res) {
    MongoClient.connect("mongodb://localhost:27017/", { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("board").collection(req.body.board_ID);
        var findThing = {};
        table.find(findThing, { projection: { _id: 0 } }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            insert_public(req, res, result.length);
        });
    });
}
//insert public
function insert_public(req, res,num) {
    MongoClient.connect("mongodb://localhost:27017/", { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("board").collection(req.body.board_ID);
        var insertThing = { num: num+1 ,ID: req.body.ID, title: req.body.title, include: req.body.include };
        table.insertOne(insertThing, function (err, result) {
            if (err) throw err;
            db.close();
            jumpPublic(req.body.board_ID, req.body.ID, res);
        });
    });
}
//jump to public board
function jumpPublic(board_ID, ID, res) {
    MongoClient.connect("mongodb://localhost:27017/", { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("board").collection(board_ID);
        var findThing = {};
        table.find(findThing, { projection: { _id: 0} }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            res.render('Page8', { ID : ID, data: result, num: result.length });
        });
    });
}
//router.post('/to_post_page', function (req, res) {
router.post('/post_public', function (req, res) {
    console.log(req.body);
    getCount_public(req, res);
});

router.post('/post_private', function (req, res) {
    //res.render('Page9', { ID: req.body.ID, board_ID: req.body.board_ID ,type: req.body.type});
    console.log(req.body);
});

router.get('/post_preview', function (req, res) {
    //render('preview', { html: req.params.html });
    res.render('preview', { html: urlencode.decode(req.query.html) });
});

router.get('/get_board_introduce', function (req, res) {
    //render('preview', { html: req.params.html });
    MongoClient.connect("mongodb://localhost:27017/", { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("board").collection('all_board_number');
        var findThing = { ID: req.query.board_ID };
        table.find(findThing, { projection: { _id: 0 } }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            console.log(result);
            res.send({ data: result, num: result.length });
        });
    });
});

module.exports = router;