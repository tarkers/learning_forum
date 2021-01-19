'use strict';
var express = require('express');
const {
    GetUrl, GetSAN
} = require('./database_url');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');
var mailTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: { // 要用來發信的帳號及密碼，後面可以改用 dotenv 來傳入，進而保護自己的帳密
        user: GetSAN('Gmail_ID'),
        pass: GetSAN('Gmail_password'),
    }
});
const local_uri = GetSAN('local_uri');
const sendMailer = GetSAN('sendMailer');

//寄 e-mail for 註冊(reigister)
function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****預設去掉了容易混淆的字元oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++)
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    var date = new Date();
    return Date.parse(date) + pwd;
}

function sendEmail(req, res, mailTransport, title, include) {
    var token = randomString(32);
    var URL = local_uri + token;
    // 設置發信內容
    var mailOtions = {
        form: sendMailer, // 發信者是誰
        to: req.body.mail, // 發給誰，用逗號分開
        subject: '高中教師社會科學增能平台帳號啟用信', // 信件標題
        //text: 'XXXX', // 單純文字內容
        html: '<h1>親愛的使用者您好</h1><h2>我們是高中教師社會科學增能平台, 您註冊了本平台會員, 但帳號屬於未啟用狀態,點擊下方連接, 啟用留言與發文功能。</h2>' + '<a href="' + URL + '">請點我(Click ME) [啟用後帳號可以獲得發文與留言權限]</a>'// 可寫入 HTML 格式
    }

    MongoClient.connect(GetUrl("people"), { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 2); throw err; }
        var table = db.db("people").collection("token");
        table.insertOne({ ID: req.body.ID, token: token }, function (err, result) {
            if (err) { warming(res, 2); throw err; }
            db.close();
            // 準備發送信件
            mailTransport.sendMail(mailOtions, function (error, info) {
                if (error) { warming(res, 2); throw error; }
                // 發信成功就轉回
                //console.log("send to " + req.body.mail);
                res.render('Page1', {
                    ID: '',
                    password: '',
                    name: '',
                    mail: '',
                    school: '',
                    gender: '',
                    title: title,
                    include: include,
                    result: '帳號註冊成功, 需進行e-mail認證才可以進行留言與發文, 且若長時間未進行郵箱認證將刪除此帳號'
                });
            });
        });
    });
}

//mode 0:  1:密碼錯誤或帳號不存在,按上一頁再試一次 2:伺服器連線問題請,請按上一頁再試一次 3:操作不合法,請聯絡網站管理者
function warming(res, mode) {
    var str = ['認證成功', '密碼錯誤或帳號(版號)不存在,按上一頁再試一次', '伺服器連線問題,請按上一頁再試一次', '操作不合法,請聯絡網站管理者'];
    res.render('warming', { warming: str[mode] });
}

/******************
/SAN/toManageMode
******************/

router.get('/toManageMode', function (req, res) {
    res.render('jump', { URL: GetSAN('managePage') });
});

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
                    found_connect.close();
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
                                found_connect.close();
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
                        found_connect.close();
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
            found_database.collection("personal_information").findOne(
                { $or: [{ ID: req.body.ID }, { mail: req.body.mail }] }
                , { projection: { _id: 0 } }, function (err, found_personal_information) {
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
                            gender: req.body.gender,
                            activate: false
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
                                    render_database.collection("page1").find({}, { projection: { _id: 0 } }).sort({ _id: 1 }).toArray(function (err, found_data) {
                                        if (err) { warming(router_result, 2); throw err; }
                                        //console.log("title>>")
                                        //console.log(found_data[0]['title'])
                                        //console.log("include>>")
                                        //console.log(found_data[1]['include'])
                                        sendEmail(req, router_result, mailTransport, found_data[0]['title'], found_data[1]['include']);
                                        found_connect.close();
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
                        var pkg = {
                            ID: req.body.ID,
                            password: req.body.password,
                            name: req.body.name,
                            mail: req.body.mail,
                            school: req.body.school,
                            gender: req.body.gender,
                            include: '<h1>重新進入網站可以再一次看到介紹</h1>',
                            result: '帳號或郵箱已存在 請更改後再試一次'
                        };
                        if (found_personal_information.ID == req.body.ID)
                            pkg['title'] = "帳號已存在 請更改帳號再試一次";
                        else
                            pkg['title'] = "電子郵箱已存在 請更改郵箱再試一次";
                        router_result.render('Page1', pkg);
                        found_connect.close();
                    }

                })

        });
    } catch (err) {
        if (err) { warming(router_result, 2); throw err; }
    }
})

/******************
./SAN/activate
******************/
function findToken(db, token) {
    return new Promise((resolve, reject) => {
        var table = db.db("people").collection("token");
        table.findOne({ token: token }, { projection: { _id: 0 } }, function (err, result) {
            if (err) { reject({ err: 'error' }); throw err; }
            //console.log(result['ID']);
            result == null ? reject({}) : resolve({ ID: result['ID'] });
        });
    });
}
function activateID(db, pkg) {
    return new Promise((resolve, reject) => {
        var table = db.db("people").collection("personal_information");
        table.updateOne({ ID: pkg.ID }, { $set: { 'activate': true } }, function (err, result) {
            if (err) { reject({ err: 'error' }); throw err; }
            resolve({});
        });
    });
}
function deleteToken(db, token) {
    return new Promise((resolve, reject) => {
        var table = db.db("people").collection("token");
        table.deleteOne({ token: token }, function (err) {
            if (err) { reject({ err: 'error' }); throw err; }
            resolve({});
        });
    });
}
router.get('/activate/:token', function (req, res) {
    var token = req.params.token.toString();
    MongoClient.connect(GetUrl("people"), { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { warming(res, 3); throw err; }
        findToken(db, token).then(pkg => activateID(db, pkg))
            .then(deleteToken(db, token))
            .then(warming(res, 0))
            .catch(err => warming(res, 3))
            .finally(pkg => db.close());
    });
})

/******************
./SAN/ReSendMail
******************/
//1.看ID是否存在
//2.看是否已有token,有跳3, 無跳4
//3.取得與寄信
//4.建立與寄信
function GetID(db, ID) {
    return new Promise((resolve, reject) => {
        var table = db.db("people").collection("personal_information");
        table.findOne({ ID: ID }, { projection: { _id: 0 } }, function (err, result) {
            if (err) { reject({ result: 'error' }); throw err; }
            if (result == null)
                reject({ result: "null" });
            else
                if (result.activate)
                    reject({ result: "already" });
                else
                    resolve({ mail: result.mail });
        });
    });
}
function GetToken(db, ID, pkg) {
    return new Promise((resolve, reject) => {
        var table = db.db("people").collection("token");
        table.findOne({ ID: ID }, { projection: { _id: 0 } }, function (err, result) {
            if (err) { reject({ result: 'error' }); throw err; }
            if (result == null)
                resolve({ token: 'NA', mail: pkg.mail });
            else
                resolve({ token: result.token, mail: pkg.mail });
        });
    });
}
function build(db, ID, pkg) {
    if (pkg.token == 'NA')
        return new Promise((resolve, reject) => {
            var token = randomString(32);
            var table = db.db("people").collection("token");
            table.insertOne({ ID: ID, token: token }, function (err, result) {
                if (err) { reject({ result: 'error' }); throw err; }
                pkg['token'] = token;
                resolve(pkg);
            });
        });
    else
        return new Promise((resolve, reject) => {
            resolve(pkg);
        });
}
function sendSecConfirmMail(pkg) {
    return new Promise((resolve, reject) => {
        var URL = local_uri + pkg.token;
        // 設置發信內容
        var mailOtions = {
            form: sendMailer, // 發信者是誰
            to: pkg.mail, // 發給誰，用逗號分開
            subject: '高中教師社會科學增能平台帳號啟用信', // 信件標題
            //text: 'XXXX', // 單純文字內容
            html: '<h1>親愛的使用者您好</h1><h2>我們是高中教師社會科學增能平台, 您註冊了本平台會員, 但帳號屬於未啟用狀態,點擊下方連接, 啟用留言與發文功能。</h2>' + '<a href="' + URL + '">請點我(Click ME) [啟用後帳號可以獲得發文與留言權限]</a>'// 可寫入 HTML 格式
        }
        mailTransport.sendMail(mailOtions, function (error, info) {
            if (error) { reject({ result: 'error' }); throw error; }
            // 發信成功就轉回
            resolve({ result: 'success' });
        });
    });
}
router.post('/ReSendMail', function (req, res) {
    var ID = req.body.ID;
    MongoClient.connect(GetUrl("people"), { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { res.json({ result: 'error' }); throw err; }
        //findToken(db, token).then(pkg => activateID(db, pkg)).then(deleteToken(db, token)).then(warming(res, 0)).catch(err => warming(res, 3));
        GetID(db, ID).then(pkg => GetToken(db, ID, pkg))
            .then(pkg => build(db, ID, pkg))
            .then(pkg => sendSecConfirmMail(pkg))
            .then(pkg => res.json(pkg))
            .catch(error => res.json(error))
            .finally(pkg => db.close());
    });
})


/******************
./SAN/ForgetPassword
******************/
//不可預期錯誤:error
//1.看是否存在,存在就取得密碼與信箱與激活狀態
//不存在:null, 未認證: already
//2.寄出密碼 成功:success
function GetPasswordAndMail(db, ID) {
    return new Promise((resolve, reject) => {
        var table = db.db("people").collection("personal_information");
        table.findOne({ ID: ID }, { projection: { _id: 0 } }, function (err, result) {
            if (err) { reject({ result: 'error' }); throw err; }
            if (result == null)
                reject({ result: "null" });
            else
                if (!result.activate)
                    reject({ result: "already" });
                else
                    resolve({ password: result.password, mail: result.mail });
        });
    });
}
function sendPassword(pkg) {
    return new Promise((resolve, reject) => {
        // 設置發信內容
        var mailOtions = {
            form: sendMailer, // 發信者是誰
            to: pkg.mail, // 發給誰，用逗號分開
            subject: '高中教師社會科學增能平台密碼通知信', // 信件標題
            //text: 'XXXX', // 單純文字內容
            html: '<h1>親愛的使用者您好</h1><h2>我們是高中教師社會科學增能平台, 您使用了本平台會員密碼通知功能, 您的密碼是<strong>' + pkg.password + '</strong>,謝謝您的使用</h2>'
        }
        mailTransport.sendMail(mailOtions, function (error, info) {
            if (error) { reject({ result: 'error' }); throw error; }
            // 發信成功就轉回
            resolve({ result: 'success' });
        });
    });
}
router.post('/ForgetPassword', function (req, res) {
    var ID = req.body.ID;
    MongoClient.connect(GetUrl("people"), { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
        if (err) { res.json({ result: 'error' }); throw err; }
        GetPasswordAndMail(db, ID)
            .then(pkg => sendPassword(pkg))
            .then(pkg => res.json(pkg))
            .catch(error => res.json(error))
            .finally(pkg => db.close());
    });
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
                        found_connect.close();
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
                        found_connect.close();
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
                        found_connect.close();
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
                                found_connect.close();
                            })
                        } else { //Wrong password
                            //console.log("Wrong password")
                            res.json({ result: "error" });
                            found_connect.close();
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

