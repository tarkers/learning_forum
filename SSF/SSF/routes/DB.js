'use strict';
var express = require('express');
var router = express.Router();
var urlencode = require('urlencode');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;

//jump to public board
function jumpPublic(board_ID,ID,res) {
    MongoClient.connect("mongodb://localhost:27017/", { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("board").collection(board_ID);
        var findThing = {};
        table.find(findThing, { projection: { _id: 0} }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            console.log(result);
            res.render('Page8', { ID : ID, data: result, num: result.length });
        });
    });
}
//router.post('/to_post_page', function (req, res) {
router.post('/post_public', function (req, res) {
    console.log(req.body);
    MongoClient.connect("mongodb://localhost:27017/", { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("board").collection(req.body.board_ID);
        var insertThing = { ID: req.body.ID, title: req.body.title, include: req.body.include };
        table.insertOne( insertThing , function (err, result) {
            if (err) throw err;
            db.close();
            console.log(result);
            jumpPublic(req.body.board_ID, req.body.ID,res);
        });
    });
});

router.post('/post_private', function (req, res) {
    //res.render('Page9', { ID: req.body.ID, board_ID: req.body.board_ID ,type: req.body.type});
    console.log(req.body);
});

router.get('/post_preview', function (req, res) {
    //render('preview', { html: req.params.html });
    res.render('preview', { html: urlencode.decode(req.query.html) });
});

module.exports = router;