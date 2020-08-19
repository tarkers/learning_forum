'use strict';
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('Page1', { title: '<h1>Express</h1>' ,num:3});
});

module.exports = router;
