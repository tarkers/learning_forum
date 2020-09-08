'use strict';
var express = require('express');
var router = express.Router();
/* go to web page */
router.get('/', function (req, res) {
    res.render('Page1');
});
router.get('/manager', function (req, res) {
    res.render('Page1');
});
router.get('/core_manager', function (req, res) {
    res.render('Page2');
});

module.exports = router;
