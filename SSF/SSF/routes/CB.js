'use strict';
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

const {
    GetUrl
} = require('./database_url');


//mode 0:  1:密碼錯誤或帳號不存在,按上一頁再試一次 2:伺服器連線問題請,請按上一頁再試一次 3:操作不合法,請聯絡網站管理者
function warming(res, mode) {
    var str = ['', '密碼錯誤或帳號(版號)不存在,按上一頁再試一次', '伺服器連線問題,請按上一頁再試一次', '操作不合法,請聯絡網站管理者'];
    res.render('warming', { warming: str[mode] });
}

/******************
./CB
******************/
router.get('/', function (req, res) {
    MongoClient.connect(GetUrl("data"), {
        useUnifiedTopology: true
    }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        //console.log("index.js:connect DB!");
        var found_database = db.db("data");
        found_database.collection("page1").find({}, { projection: { _id: 0 } }).toArray(function (err, found_data) {
            if (err) { warming(res, 2); throw err; }
            //console.log("title>>");
            //console.log(found_data[0]['title']);
            //console.log("include>>");
            //console.log(found_data[1]['include']);
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
    });
});
//*/

/******************
./CB/direct_to_3
******************/
router.get('/direct_to_3', async (req, res) => {
    MongoClient.connect(GetUrl("data"), {
        useUnifiedTopology: true
    }, function (err, found_connect) {
        if (err) { warming(res, 2); throw err; }
        var found_database = found_connect.db("data");
        found_database.collection("page3").find({}, { projection: { _id: 0 } }).toArray(function (err, found_data) {
            if (err) { warming(res, 2); throw err; }
            //console.log('getting data>>')
            //console.log(found_data[0]['data'])
            res.render('Page3', {
                ID: '匿名者',
                data: found_data[0]['data']
            });
        })
    });
});

/******************
./CB/to_3
******************/
router.post('/to_3', async (req, res) => {
    //console.log(req.body);
    MongoClient.connect(GetUrl("data"), {
        useUnifiedTopology: true
    }, function (err, found_connect) {
        if (err) { warming(res, 2); throw err; }
        var found_database = found_connect.db("data");
        found_database.collection("page3").find({}, { projection: { _id: 0 } }).toArray(function (err, found_data) {
            if (err) { warming(res, 2); throw err; }
            //console.log('getting ID>>')
            //console.log(req.body.ID)

            if (found_data.length < 1) {
                //console.log("Cannot find any document in data.page3...")
                res.render('Page3', {
                    data: "",
                    ID: req.body.ID
                });
            } else {
                //console.log('getting data>>')
                //console.log(found_data)
                res.render('Page3', {
                    ID: req.body.ID,
                    data: found_data
                });
            }
        })
    });
});

/******************
./CB/direct_to_4
******************/
router.post('/to_4', async (req, res) => {
    //console.log(req.body);
    try {
        MongoClient.connect(GetUrl("data"), {
            useUnifiedTopology: true
        }, async (err, created_connect) => {
            if (err) { warming(res, 2); throw err; }
            var found_database = created_connect.db("data");
            var information = {};

            found_database.collection("page4", function (err, found_collection) {
                if (err) { warming(res, 2); throw err; }
                found_collection.findOne({
                    type: 'data'
                }, { projection: { _id: 0, type: 0 } }, function (err, found_data) {
                    if (err) { warming(res, 2); throw err; }
                    information['data'] = found_data;
                    found_collection.findOne({
                        type: 'image'
                    }, { projection: { _id: 0, type: 0 } }, function (err, found_data) {
                        if (err) { warming(res, 2); throw err; }
                        information['image'] = found_data;
                        found_collection.findOne({
                            type: 'title'
                        }, { projection: { _id: 0, type: 0 } }, function (err, found_data) {
                            if (err) { warming(res, 2); throw err; }
                            information['title'] = found_data;
                            found_collection.findOne({
                                type: 'nick_name'
                            }, { projection: { _id: 0, type: 0 } }, function (err, found_data) {
                                information['nick_name'] = found_data;

                                //console.log('getting ID>>%s', req.body.ID)
                                //console.log('data>>\n' + information.data['1'])
                                //console.log('image>>\n' + information.image['1'])
                                //console.log('title>>\n' + information.title['1'])
                                //console.log('nick_name>>\n' + information.nick_name['1'])

                                res.render('Page4', {
                                    data: information.data,
                                    image: information.image,
                                    title: information.title,
                                    nick_name: information.nick_name,
                                    ID: req.body.ID
                                });
                            });
                        });
                    });
                });
            });
        });
    } catch (err) {
        if (err) { warming(res, 2); throw err; }
    }
});

/************************************************
./CB/department/(abbreviation od department)
************************************************/
router.post('/department/:postId', async (req, res) => {
    //console.log(req.body);
    try {
        var department_name = req.params.postId.toString()
        var department_board_name = department_name + "_board";
        //console.log("department name>>" + department_name)
        //console.log("board name>>" + department_board_name)

        if (department_name == 'YT') {
            res.render('Page5', {
                ID: req.body.ID,
                password: req.body.password
            })
        } else {
            MongoClient.connect(GetUrl("data"), {
                useUnifiedTopology: true,
                useNewUrlParser: true
            }, async (err, db) => {
                if (err) { warming(res, 2); throw err; }

                var information = {};
                var found_database = db.db("data");
                found_database.collection(department_name).findOne({
                    type: "department_introduce"
                }, { projection: { _id: 0, type: 0 } }, async (err, found_data) => {
                    if (err) { warming(res, 2); throw err; }
                    information['introduce'] = (found_data == null) ? "" : found_data['text'];

                    found_database.collection(department_name).findOne({
                        type: "department_keywords"
                    }, { projection: { _id: 0, type: 0 } }, async (err, found_data) => {
                        if (err) { warming(res, 2); throw err; }
                        information['keyword'] = (found_data == null) ? "" : found_data;

                        found_database.collection(department_name).findOne({
                            type: "department_tabs"
                        }, { projection: { _id: 0, type: 0 } }, async (err, found_data) => {
                            if (err) { warming(res, 2); throw err; }
                            information['tabs'] = (found_data == null) ? "" : found_data;

                            found_database.collection(department_board_name).find({}, { projection: { _id: 0 } }).toArray(async (err, found_data) => {
                                if (err) { warming(res, 2); throw err; }

                                db.close();
                                //console.log(information)
                                //console.log('data>>')
                                //console.log(found_data)

                                res.render('Page6', {
                                    ID: req.body.ID,
                                    DE: department_name,
                                    introduce: information.introduce,
                                    keywords: information.keyword,
                                    tabs: information.tabs,
                                    boards: found_data,
                                    password: req.body.password
                                });
                            })

                        })
                    })
                })
            })

        }
    } catch (err) {
        if (err) { warming(res, 2); throw err; }
    }
});

module.exports = router;
///********************
// * Mongoose Version
// *******************/
///*

//const mongoose = require("mongoose");
//require("dotenv/config")

//var g_database = mongoose.createConnection();
//g_database.on('error', console.error.bind(console, 'connection error:'))
//g_database.on('open', () => {
//    console.log('Mongoose open');
//})
//g_database.on('connecting', () => {
//    console.log('Mongoose connecting...');
//});
//g_database.on('connected', () => {
//    console.log('Mongoose connected');
//});
//g_database.on('disconnecting', () => {
//    console.log('Mongoose disconnecting...');
//});
//g_database.on('disconnected', () => {
//    console.log('Mongoose disconnected');
//});
//g_database.on('close', () => {
//    console.log('Mongoose close');
//})

//router.get('/', async (req, res) => {
//    try {
//        mongoose.connect(GetUrl("data"), {
//            useUnifiedTopology: true,
//            useNewUrlParser: true
//        }, () => {})
//        const page1_model = require('../models/data/page1')
//        const found_data = await page1_model.find()
//        mongoose.disconnect()
//        res.render('Page1', {
//            title: found_data[0]['title'],
//            include: found_data[1]['include'],
//            num: 1
//        });
//        //res.json(found_data)
//    } catch (err) {
//        mongoose.disconnect()
//        res.json({
//            message: err
//        })
//    }
//});

//router.get('/direct_to_3', async (req, res) => {
//    try {
//        await mongoose.connect(GetUrl("data"), {
//            useUnifiedTopology: true,
//            useNewUrlParser: true
//        })

//        const page3_model = require('../models/data/page3')
//        const found_data = await page3_model.find()
//        console.log('getting data>>')
//        console.log(found_data[0]['data'])
//        mongoose.disconnect()
//        res.render('Page3', {
//            data: found_data[0]['data']
//        });
//        //res.json(found_data)
//    } catch (err) {
//        mongoose.disconnect()
//        res.json({
//            message: err
//        })
//    }
//});

//router.post('/to_3', async (req, res) => {
//    try {
//        await mongoose.connect(GetUrl("data"), {
//            useUnifiedTopology: true,
//            useNewUrlParser: true
//        })

//        const page3_model = require('../models/data/page3')
//        const found_data = await page3_model.find({}, function (err) {
//            if (err) {
//                console.log("page3_model.find() error...")
//                throw "finding error!!";
//            }
//        })
//        console.log('getting ID>>')
//        console.log(req.body.ID)
//        mongoose.disconnect()
//        if (found_data.length < 1) {
//            console.log("Cannot find any document in data.page3...")
//            res.render('Page3', {
//                data: "",
//                ID: req.body.ID
//            });
//        } else {
//            console.log('getting data>>')
//            console.log(found_data[0]['data'])
//            res.render('Page3', {
//                data: found_data[0]['data'],
//                ID: req.body.ID
//            });
//        }
//        //res.json(found_data)
//    } catch (err) {
//        mongoose.disconnect()
//        res.json({
//            message: err
//        })
//    }
//});

//router.post('/direct_to_4', async (req, res) => {
//    try {
//        await mongoose.connect(GetUrl("data"), {
//            useUnifiedTopology: true,
//            useNewUrlParser: true
//        })

//        const page_model = require('../models/data/page4')
//        var found_data_1 = await page_model.findOne({
//            type: 'data'
//        })
//        var found_data_2 = await page_model.findOne({
//            type: 'image'
//        })
//        var found_data_3 = await page_model.findOne({
//            type: 'title'
//        })
//        var found_data_4 = await page_model.findOne({
//            type: 'nick_name'
//        })
//        var found_data = {
//            data: "",
//            image: "",
//            title: "",
//            nick_name: ""
//        };

//        mongoose.disconnect()

//        found_data.data = (found_data_1 == null) ? "" : found_data_1['1'];
//        found_data.image = (found_data_2 == null) ? "" : found_data_2['1'];
//        found_data.title = (found_data_3 == null) ? "" : found_data_3['1'];
//        found_data.nick_name = (found_data_4 == null) ? "" : found_data_4['1'];

//        console.log('getting ID>>%s', req.body.ID)
//        console.log('data>>\n' + found_data.data)
//        console.log('image>>\n' + found_data.image)
//        console.log('title>>\n' + found_data.title)
//        console.log('nick_name>>\n' + found_data.nick_name)

//        res.render('Page4', {
//            data: found_data.data,
//            image: found_data.image,
//            title: found_data.title,
//            nick_name: found_data.nick_name,
//            ID: req.body.ID
//        });
//    } catch (err) {
//        mongoose.disconnect()
//        res.json({
//            message: err
//        })
//    }
//});
//*/


///***********************
//function for developer
//***********************/
//router.get('/test', async (req, res) => {
//    try {
//        /*
//                const page1_model = require('../models/data/page1')
//                const found_data = await page1_model.find()
//                mongoose.disconnect()
//                res.render('Page1', {
//                    title: found_data[0]['title'],
//                    include: found_data[1]['include'],
//                    num: 1
//                });
//                //*/
//        console.log('test1')
//        await mongoose.connect(GetUrl("data"), {
//            useUnifiedTopology: true,
//            useNewUrlParser: true
//        })
//        console.log('test2')

//        var test_schema = new mongoose.Schema({
//            title: {
//                type: String,
//                required: true
//            },
//            include: {
//                type: String,
//                required: true
//            }
//        });
//        console.log('test3');
//        const test_model = require('../models/data/psy.js')

//        console.log('test4')

//        //var found_introduce = await test_model.find({});
//        var found_introduce = await test_model.find({});
//        console.log('test5')
//        mongoose.disconnect()

//        console.log("found_introduce>>")
//        console.log(found_introduce)

//        //var final_result={introduce:"",keyword:"",tab:""}
//        //final_result.introduce=(found_introduce==null)?"":found_introduce['text'];

//        //console.log("final introduction>>"+final_result.introduce)

//        res.render('Page6', {
//            //data: found_data.data,
//            //image:found_data.image,
//            //title:found_data.title,
//            //nick_name:found_data.nick_name,
//        });
//        console.log('test6')
//    } catch (err) {
//        mongoose.disconnect()
//        res.json({
//            message: err
//        })
//    }
//});


////新增資料
//router.post('/', async (req, res) => {
//    const post_data = new page1_model({
//        title: req.body.title,
//        include: req.body.include
//    })
//    try {
//        const post_result = await post_data.save()
//        res.json(post_result)
//    } catch (err) {
//        res.json({
//            message: err
//        })
//    }
//})

////查詢資料庫所有資料
////*
//router.get('/all', async (req, res) => {
//    try {
//        const found_data = await page1_model.find()
//        res.json(found_data)
//    } catch (err) {
//        res.json({
//            message: err
//        })
//    }
//})
////*/

////查找對應id的資料
//router.get('/:postId', async (req, res) => {
//    try {
//        const findPost = await page1_model.findById(req.params.postId)
//        console.log("test2")
//        res.json(findPost)
//    } catch (err) {
//        res.json({
//            message: err
//        })
//    }
//})

////刪除資料
//router.delete('/:postId', async (req, res) => {
//    try {
//        const remove_result = await page1_model.deleteOne({
//            _id: req.params.postId
//        })
//        res.json(remove_result)
//    } catch (err) {
//        res.json({
//            message: err
//        })
//    }
//})
////修改資料
//router.patch('/:postId', async (req, res) => {
//    try {
//        console.log("Change one data from DataBase!")

//        const updatePost = await page1_model.updateOne({
//            _id: req.params.postId
//        }, {
//                $set: {
//                    title: req.body.title
//                }
//            })
//        res.json(updatePost)
//    } catch (err) {
//        res.json({
//            message: err
//        })
//    }
//})

///*****Using of Promise*****

//        function promise(run_function){
//            return new Promise((resolve,reject)=>{
//                console.log('running function...')
//                run_function()
//                resolve()
//            })
//        };
//        promise(function(){console.log('第一次成功')})
//        .then(async()=>{
//            return promise(function(){console.log('第二次成功')});
//        })
//        .then(async()=>{
//            return promise(function(){console.log('第三次成功')});
//        })
//        .catch(fail=>{
//            console.log(fail)
//        })
//**************************/
