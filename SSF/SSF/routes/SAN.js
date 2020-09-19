'use strict';
var express = require('express');
const {
    GetUrl
} = require('./database_url');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;


//mode 0:  1:密碼錯誤或帳號不存在,按上一頁再試一次 2:伺服器連線問題請,請按上一頁再試一次 3:操作不合法,請聯絡網站管理者
function warming(res, mode) {
    var str = ['', '密碼錯誤或帳號(版號)不存在,按上一頁再試一次', '伺服器連線問題,請按上一頁再試一次', '操作不合法,請聯絡網站管理者'];
    res.render('warming', { warming: str[mode] });
}

/******************
./SAN/sign_in
******************/
router.post('/sign_in', async (req, res) => {
    try {
        MongoClient.connect(GetUrl("people"), {
            useUnifiedTopology: true
        }, function (err, found_connect) {
            if (err) { warming(res, 2); throw err; }
            var found_database = found_connect.db("people");
            found_database.collection("personal_information").findOne({
                ID: req.body.ID
            }, function (err, found_personal_information) {
                if (err) { warming(res, 2); throw err; }

                //console.log("Input ID>>" + req.body.ID);
                //console.log("Input password>>" + req.body.password);
                if (found_personal_information == null) { //No user in database
                    //console.log("No user in database");
                    res.render('Page1', {
                        ID: '',
                        password: '',
                        name: '',
                        mail: '',
                        school: '',
                        gender: '',
                        title: "帳號不存在 請更改帳號再試一次",
                        include: '<h1>重新進入網站可以再一次看到介紹</h1>',
                        result: "帳號不存在"
                    });
                } else { //Found user in database
                    //console.log('ID information>>');
                    //console.log(found_personal_information);
                    if (found_personal_information['password'] == req.body.password) { //Right password

                        found_database.collection("personal_lover").findOne({
                            ID: req.body.ID
                        }, { projection: { _id: 0, ID: 0 } }, function (err, found_lover) {
                            if (err) { warming(res, 2); throw err; }
                            found_database.collection("personal_notice").findOne({
                                ID: req.body.ID
                            }, { projection: { _id: 0, ID: 0 } }, function (err, found_notice) {
                                if (err) { warming(res, 2); throw err; }
                                //console.log("lover>>");
                                //console.log(found_lover);
                                //console.log("notice>>");
                                //console.log(found_notice);

                                res.render('Page2', {
                                    ID: req.body.ID,
                                    information: found_personal_information,
                                    lover: found_lover,
                                    notice: found_notice
                                });
                            })
                        })
                    } else { //Wrong password
                        //console.log("Wrong password")
                        res.render('Page1', {
                            ID: '',
                            password: '',
                            name: '',
                            mail: '',
                            school: '',
                            gender: '',
                            title: "密碼錯誤 請更改密碼再試一次",
                            include: '<h1>重新進入網站可以再一次看到介紹</h1>',
                            result: "密碼錯誤"
                        });
                    }
                }
            })
        });
    } catch (err) {
        if (err) { warming(res, 2); throw err; }
    }
})

/******************
./SAN/register
******************/
router.post('/register', async (req, router_result) => {
    try {
        MongoClient.connect(GetUrl("people"), {
            useUnifiedTopology: true
        }, function (err, found_connect) {
            if (err) { warming(router_result, 2); throw err; }
            var found_database = found_connect.db("people");
            found_database.collection("personal_information").findOne({
                ID: req.body.ID
            }, { projection: { _id: 0 } }, function (err, found_personal_information) {
                if (err) { warming(router_result, 2); throw err; }

                //console.log("Input ID >>\t\t\"%s\"", req.body.ID);
                //console.log("Input password >>\t\"%s\"", req.body.password);
                //console.log("Input name >>\t\t\"%s\"", req.body.name);
                //console.log("Input mail >>\t\t\"%s\"", req.body.mail);
                //console.log("Input school >>\t\t\"%s\"", req.body.school);
                //console.log("Input gender >>\t\t\"%s\"", req.body.gender);
                if (found_personal_information == null) { //No user in database
                    //console.log("No user in database");

                    found_database.collection("personal_information").insertOne({
                        ID: req.body.ID,
                        password: req.body.password,
                        name: req.body.name,
                        mail: req.body.mail,
                        school: req.body.school,
                        gender: req.body.gender
                    }, function (err, res) {
                        if (err) { warming(router_result, 2); throw err; }
                        found_database.collection("personal_lover").insertOne({
                            ID: req.body.ID
                        }, function (err, res) {
                            if (err) { warming(router_result, 2); throw err; }
                            found_database.collection("personal_notice").insertOne({
                                ID: req.body.ID
                            }, function (err, res) {
                                if (err) { warming(router_result, 2); throw err; }

                                var render_database = found_connect.db("data");
                                render_database.collection("page1").find({}, { projection: { _id: 0 } }).toArray(function (err, found_data) {
                                    if (err) { warming(router_result, 2); throw err; }
                                    //console.log("title>>")
                                    //console.log(found_data[0]['title'])
                                    //console.log("include>>")
                                    //console.log(found_data[1]['include'])
                                    router_result.render('Page1', {
                                        ID: '',
                                        password: '',
                                        name: '',
                                        mail: '',
                                        school: '',
                                        gender: '',
                                        title: found_data[0]['title'],
                                        include: found_data[1]['include'],
                                        result: '帳號註冊成功'
                                    });
                                });
                                //render_database.collection("page1").findOne({}, function (err, render_page) {
                                //    if (err) throw err;
                                //    console.log("title>>");
                                //    console.log(render_page['title']);
                                //    console.log("include>>");
                                //    console.log(render_page['include']);
                                //    router_result.render('Page1', {
                                //        title: render_page['title'],
                                //        include: render_page['include']
                                //    });
                                //})
                            })
                        })
                    })
                } else { //Found user in database
                    //console.log('ID has been registered');

                    router_result.render('Page1', {
                        ID: req.body.ID,
                        password: req.body.password,
                        name: req.body.name,
                        mail: req.body.mail,
                        school: req.body.school,
                        gender: req.body.gender,
                        title: "帳號已存在 請更改帳號再試一次",
                        include: '<h1>重新進入網站可以再一次看到介紹</h1>',
                        result: '帳號已存在 請更改帳號再試一次'
                    });
                }
            })
        });
    } catch (err) {
        if (err) { warming(router_result, 2); throw err; }
    }
})

/******************
./SAN/delete_lover
******************/
router.post('/delete_lover', async (req, router_result) => {
    try {
        MongoClient.connect(GetUrl("people"), {
            useUnifiedTopology: true
        }, function (err, found_connect) {
            if (err) { warming(router_result, 2); throw err; }
            //console.log("Input ID >>\t\t\"%s\"", req.body.ID);
            //console.log("Input borad_ID >>\t\"%s\"", req.body.board_ID);

            var found_database = found_connect.db("people");
            var filter1 = {
                ID: req.body.ID
            };
            var filter2 = {
                ID: req.body.ID
            };
            var goal = {};
            filter1[req.body.board_ID] = req.body.board_ID;
            goal[req.body.board_ID] = "";

            found_database.collection("personal_lover").findOne(filter1, function (err, ret) {
                if (err) { warming(router_result, 2); throw err; }
                if (ret == null) {
                    router_result.json({
                        result: "error"
                    });
                } else {
                    found_database.collection("personal_lover").updateOne(filter2, {
                        "$unset": goal
                    }, function (err, ret) {
                        if (err) { warming(router_result, 2); throw err; }

                        router_result.json({
                            result: "success"
                        })
                    })

                }
            })
        });
    } catch (err) {
        if (err) { warming(router_result, 2); throw err; }
    }
})

/******************
./SAN/delete_notice
******************/
router.post('/delete_notice', async (req, router_result) => {
    try {
        MongoClient.connect(GetUrl("people"), {
            useUnifiedTopology: true
        }, function (err, found_connect) {
            if (err) { warming(router_result, 2); throw err; }

            var goal_key_name = req.body.board_ID + "_" + req.body.place;
            //console.log("Input ID >>\t\t\"%s\"", req.body.ID);
            //console.log("Input borad_ID >>\t\"%s\"", req.body.board_ID);
            //console.log("Input place >>\t\"%s\"", req.body.place);
            //console.log("goal key name >>\t\"%s\"", goal_key_name);

            var found_database = found_connect.db("people");
            var filter1 = {
                ID: req.body.ID
            };
            var filter2 = {
                ID: req.body.ID
            };
            var goal = {};
            filter1[goal_key_name] = goal_key_name;
            goal[goal_key_name] = "";

            found_database.collection("personal_notice").findOne(filter1, function (err, ret) {
                if (err) { warming(router_result, 2); throw err; }
                if (ret == null) {
                    router_result.json({
                        result: "error"
                    });
                } else {
                    found_database.collection("personal_notice").updateOne(filter2, {
                        "$unset": goal
                    }, function (err, ret) {
                        if (err) { warming(router_result, 2); throw err; }

                        router_result.json({
                            result: "success"
                        })
                    })

                }
            })
        });
    } catch (err) {
        if (err) { warming(router_result, 2); throw err; }
    }
})

/******************
./SAN/ChangeMe
******************/
router.post('/ChangeMe', async (req, res) => {
    //console.log(req.body);
    if (req.body.type != "ID") {
        try {
            MongoClient.connect(GetUrl("people"), {
                useUnifiedTopology: true
            }, function (err, found_connect) {
                if (err) { warming(res, 2); throw err; }
                var found_database = found_connect.db("people");
                found_database.collection("personal_information").findOne({
                    ID: req.body.ID
                }, function (err, found_personal_information) {
                    if (err) { warming(res, 2); throw err; }
                    //console.log("Input ID>>" + req.body.ID);
                    //console.log("Input password>>" + req.body.password);
                    if (found_personal_information == null) { //No user in database
                        //console.log("No user in database");
                        warming(res, 3);
                    } else { //Found user in database
                        //console.log('ID information>>');
                        //console.log(found_personal_information);
                        var goal = {};
                        goal[req.body.type] = req.body.include;
                        if (found_personal_information['password'] == req.body.password) { //Right password
                            found_database.collection("personal_information").updateOne({ ID: req.body.ID }, {
                                $set: goal
                            }, function (err, ret) {
                                if (err) { res.json({ result: "error" }); throw err; }
                                else res.json({ result: "success" });
                            })
                        } else { //Wrong password
                            //console.log("Wrong password")
                            res.json({ result: "error" });
                        }
                    }
                })
            });
        } catch (err) {
            if (err) { warming(res, 2); throw err; }
        }
    }
    else
        warming(res, 3);
})


module.exports = router;
///*
//const mongoose = require("mongoose");
//require("dotenv/config")

//var g_database = mongoose.connection;
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
//mongoose.connect(process.env.DB_CONNECTION, {
//    useUnifiedTopology: true,
//    useNewUrlParser: true
//}, () => {})
//const peaple_model=require('../models/people')
////*/


////查詢資料庫所有資料
//router.get('/all', async (req, res) => {
//    try {
//        const found_data = await peaple_model.find()
//        res.json(found_data)
//    } catch (err) {
//        res.json({
//            message: err
//        })
//    }
//})
////查找對應id的資料
//router.get('/:postId', async (req, res) => {
//    try {
//        const findPost = await peaple_model.findById(req.params.postId)
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
//        const remove_result = await peaple_model.deleteOne({
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
//        const updatePost = await peaple_model.updateOne({
//            _id: req.params.postId
//        }, {
//                $set: {
//                    //title: req.body.title
//                    ID: req.body.ID,
//                    password: req.body.password,
//                    name: req.body.name,
//                    mail: req.body.mail,
//                    school: req.body.school,
//                    gender: req.body.gender
//                }
//            })
//        res.json(updatePost)
//    } catch (err) {
//        res.json({
//            message: err
//        })
//    }
//})

