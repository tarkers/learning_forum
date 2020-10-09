'use strict';
var express = require('express');
//const { GetUrl } = require('./database_url');
var router = express.Router();
const { GetUrl } = require('./database_url');
var uri = GetUrl('null');
var MongoClient = require('mongodb').MongoClient;

//require("dotenv/config")
//mode 0:  1:密碼錯誤或帳號不存在,按上一頁再試一次 2:伺服器連線問題請,請按上一頁再試一次 3:操作不合法,請聯絡網站管理者
function warming(res, mode) {
    var str = ['', '密碼錯誤或帳號不存在,按上一頁再試一次', '伺服器連線問題,請按上一頁再試一次', '操作不合法,請聯絡網站管理者'];
    res.render('warming', { warming: str[mode] });
}

/* GET home page. */
router.get('/', function (req, res) {
    MongoClient.connect(uri, {
        useUnifiedTopology: true
    }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        //console.log("index.js:connect DB!");
        var found_database = db.db("data");
        found_database.collection("page1").find({}, { projection: { _id: 0 } }).toArray(function (err, found_data) {
            if (err) { warming(res, 2); throw err; }
            //console.log(found_data);
            //console.log("title>>")
            //console.log(found_data[0]['title'])
            //console.log("include>>")
            //console.log(found_data[1]['include'])
            res.render('Page1', {
                ID: '',
                password: '',
                name: '',
                mail: '',
                school: '',
                gender: '',
                title: found_data[0]['title'],
                include: found_data[1]['include'],
                result: '第一次進入'
            });
            db.close();
        });
    })
});

//  /*
//var ID=""//test code
///* GET home page. */
//router.get('/', function (_req, res) {
//    res.render('page1', {
//        title: '<h1>express</h1>', include: "<h1>主題</h1> <p> 內容大綱</p> <img src='https://i.imgur.com/y6b7eZX.jpg' style='width:300px' />"
//    });
//});
///* GET Page 3*/
//router.get('/CB/direct_to_3', function (_req, res) {
//    res.render('Page3', {ID:"undefined", header: "主題", data: ['<h1>第一頁<h1>', '<h1>第二頁<h1>', '<h1>第三頁<h1>'] });
//});

//router.get('/CB/direct_to_3', function (_req, res) {
//    res.render('Page3', { ID: "undefined", header: "主題", data: ['<h1>第一頁<h1>', '<h1>第二頁<h1>', '<h1>第三頁<h1>'] });
//});


///* POST Page 1 -register/sign_in*/
//router.post("/SAN/:mode", function (_req, res) {
//    console.log(_req.params.mode);
//    res.render('page1', {
//        title: '<h1>express</h1>', include: "<h1>主題</h1> <p> 內容大綱</p> <img src='https://i.imgur.com/y6b7eZX.jpg' style='width:300px' />"
//    });
//});

///* POST Page 4 -register/sign_in*/
//router.post('/CB/direct_to_4', function (_req, res) {
//    res.render('Page4', {
//        ID: 'a0001', 
//        data: ["ps", "econ", "psy", "law", "yt"] ,
//        image:["http://localhost:1337/images/ttt.jpg","http://localhost:1337/images/ttt.jpg","http://localhost:1337/images/ttt.jpg","http://localhost:1337/images/ttt.jpg","http://localhost:1337/images/ttt.jpg"],
//        title:["PS", "ECON", "PSY", "LAW", "YT"],
//        nick_name:["政治系", "經濟系", "心理系", "法律系", "你的老師"]});
//});

/* POST Page 5 Page6 -teacher department*/
//router.post('/CB/department/:de_title', function (_req, res) {
//    var de_title = _req.params.de_title;
//    var de_name =_req.body.nick_name;
//    if (de_title === "YT") {
//        res.render('Page5', { ID: 'a0001' });
//    }
//    else {
//        res.render('Page6', {
//            ID: 'a0001',
//            DE: de_name,
//            introduce:"系的介紹----------",
//            keywords: [ 'AI',  'IOT', 'ML', '機器學習','姆咪','嘻嘻' ], 
//            tabs: ['全部', '固力',  '熱流', '控制', '設計', '製造' ],
//            boards: [{ 'board_ID': 'public_2235', 'title': '三軸機械手臂的自動控制', 'tab': '控制', 'include': '我隨便亂打asdasdasdasd' },
//                { 'board_ID': 'public_2235', 'title': '測試檔', 'tab': '控制', 'include': '解釋' },
//            { 'board_ID': 'public_2235', 'title': '第三島機器學習', 'tab': '熱流', 'include': '解釋' },
//                { 'board_ID': 'public_2235', 'title': 'IOT大大', 'tab': '控制', 'include': '解釋' },
//                { 'board_ID': 'public_2235', 'title': 'XIOT', 'tab': '固力', 'include': '頁面所有的文字' },
//            { 'board_ID': 'public_8', 'title': 'XIOT', 'tab': '固力', 'include': '4684' },
//            { 'board_ID': 'public_58', 'title': '設計', 'tab': '固力', 'include': '頁面4684所有的文字' },
//            { 'board_ID': 'public_5758', 'title': 'XIOT', 'tab': '固力', 'include': '568468' },
//            { 'board_ID': 'public_85', 'title': '姆咪', 'tab': '固力', 'include': '568468' },
//            { 'board_ID': 'public_5578', 'title': 'OPE', 'tab': '固力', 'include': '568468' }]
//        });
//    }
//});
//router.post('/JB/to_public_board', function (_req, res) {
//    res.render('page1', { title: '<h1>express</h1>', num: 3 });
//}); 
//router.post('/JB/to_private_board', function (_req, res) {
//    res.render('page1', { title: '<h1>express</h1>', num: 3 });
//});*/

module.exports = router;


/*
const mongoose = require("mongoose");
var g_database = mongoose.createConnection();
g_database.on('error', console.error.bind(console, 'connection error:'))
g_database.on('open', () => {
    console.log('Mongoose open');
})
g_database.on('connecting', () => {
    console.log('Mongoose connecting...');
});
g_database.on('connected', () => {
    console.log('Mongoose connected');
});
g_database.on('disconnecting', () => {
    console.log('Mongoose disconnecting...');
});
g_database.on('disconnected', () => {
    console.log('Mongoose disconnected');
});
g_database.on('close', () => {
    console.log('Mongoose close');
})
*/
/*
mongoose.connect(process.env.DB_CONNECTION, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}, () => {})
//*/
/*
//Mongoose version...
router.get('/', async (req, res) => {
    try {
        mongoose.connect(process.env.DB_CONNECTION, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        const page_model = require('../models/data/page1')
        const found_data = await page_model.find()
        mongoose.disconnect()
        res.render('Page1', {
            title: found_data[0]['title'],
            include: found_data[1]['include'],
            num: 1
        });
        //res.json(found_data)
    } catch (err) {
        res.json({
            message: err
        })
    }
});
//*/
