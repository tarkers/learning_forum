'use strict';
var express = require('express');
var router = express.Router();
var urlencode = require('urlencode');
/* GET users listing. */

//router.post('/to_post_page', function (req, res) {
router.post('/post_public', function (req, res) {
    //res.render('Page9', { ID: req.body.ID, board_ID: req.body.board_ID ,type: req.body.type});
    console.log(req.body);
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