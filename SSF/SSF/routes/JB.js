'use strict';
var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var uri = "mongodb://localhost:27017/";
/* GET users listing. */
function jumpPublic(board_ID, ID, res) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("board").collection(board_ID);
        var findThing = {};
        table.find(findThing, { projection: { _id: 0 } }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            //console.log(result);
            res.render('Page8', { board_ID: board_ID, ID: ID, data: result, num: result.length });
        });
    });
}
router.post('/to_post_page', function (req, res) {
//router.get('/to_post_page', function (req, res) {
    //res.render('Page9', { ID: req.body.ID, board_ID: req.body.board_ID ,type: req.body.type});
    res.render('Page9', { ID: 'leon1234858', board_ID: 'private_0002', type: 'private' });
});

//router.post('/to_post_page', function (req, res) {
router.get('/to_public_board', function (req, res) {
    jumpPublic('private_0002', 'leon1234858', res);
});

module.exports = router;