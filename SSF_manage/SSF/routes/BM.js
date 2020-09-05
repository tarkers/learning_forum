'use strict';
var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var uri = "mongodb://localhost:27017/";
var core_ID = 'admin';
var core_password = '0000';

//function



//router
//前往管理者建立頁
router.post('/to_manager_build', function (req, res) {
    
});
//前往管理者資料更新頁
router.post('/to_manager_update', function (req, res) {

});
//管理者註冊(建立)
router.post('/build', function (req, res) {

});
//(AJAX)更新管理者註冊資料
router.post('/update', function (req, res) {

});
//(AJAX)獲得管理者註冊資料
router.post('/get_information', function (req, res) {

});
//管理者登入
router.post('/login', function (req, res) {

});
//核心管理者登入
router.post('/core_login', function (req, res) {

});

module.exports = router;
