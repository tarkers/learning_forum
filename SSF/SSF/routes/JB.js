'use strict';
var express = require('express');
var router = express.Router();
/* GET users listing. */
//router.post('/to_post_page', function (req, res) {
router.get('/to_post_page', function (req, res) {
    //res.render('Page9', { ID: req.body.ID, board_ID: req.body.board_ID ,type: req.body.type});
    res.render('Page9', { ID: 'leon1234858', board_ID: 'public_0001', type: 'public' });
});

module.exports = router;