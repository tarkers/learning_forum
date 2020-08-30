'use strict';
var express = require('express');
var router = express.Router();
var urlencode = require('urlencode');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var uri = "mongodb://localhost:27017/";

//function block

//getpassword
function getPassword_private(req,res) {
    MongoClient.connect(uri , { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("board").collection("all_board_number");
        var findThing = { board_ID: req.body.board_ID };
        table.find(findThing, { projection: { _id: 0 } }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            console.log(result[0]['password'] == req.body.board_password)
            if (result[0]['password'] == req.body.board_password) {
                getCount_public(req, res);
            }
        });
    });
}
//updataNum
function getCount_public(req,res) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("board").collection(req.body.board_ID);
        var findThing = {};
        table.find(findThing, { projection: { _id: 0 } }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            //console.log(result);
            insert_public(req, res, result.length);
        });
    });
}
//plus follower 建立追蹤者區
function plus_follower(req, num) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("follow").collection(req.body.board_ID);
        var insertThing = { num: num + 1 };
        insertThing[req.body.ID] = req.body.ID;
        table.insertOne(insertThing, function (err, result) {
            if (err) throw err;
            db.close();
        });
    });
}
//insert public + plus  follower block
function insert_public(req, res,num) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("board").collection(req.body.board_ID);
        var insertThing = { num: num+1 ,ID: req.body.ID, title: req.body.title, include: req.body.include, hide: 'false'};
        table.insertOne(insertThing, function (err, result) {
            if (err) throw err;
            db.close();
            //console.log(result);
            plus_follower(req, num);
            jumpPublic(req.body.board_ID, req.body.ID, res);
        });
    });
}
//jump to public board
function jumpPublic(board_ID, ID, res) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("board").collection(board_ID);
        var findThing = { hide: 'false' };
        table.find(findThing, { projection: { _id: 0} }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            //console.log(result);
            res.render('Page8', { board_ID: board_ID , ID: ID, data: result, num: result.length });
        });
    });
}



//router block

//post: ‘./DB/post_public’, parameter -> ID, board_ID, title, include
//tmp1 = board.p_board_ID.find()
//num = tmp1.length + 1 //知道是該版第幾則貼文
//board.p_board_ID.insert({ num: num, ID: p_ID, title: p_title, include: p_include, hide: false })
//follow.p_board_ID.insert({ num: num })
//tmp2 = board.p_board_ID.find(hide == false)
//render('page8', { data: tmp2, num: tmp2.length, board_ID: p_board_ID, ID: p_ID })
router.post('/post_public', function (req, res) {
    console.log(req.body);
    getCount_public(req, res);
});


//post: ‘./DB/post_private’, parameter -> ID, board_ID, title, include, password
//tmp1 = people.manager_information.find(board_ID == p_board_ID)
//if tmp1['password_public'] == p_password && tmp1.length > 0
//    tmp2 = board.p_board_ID.find()
//num = tmp2.length + 1 //知道是該版第幾則貼文
//board.p_board_ID.insert({ num: num, ID: p_ID, title: p_title, include: p_include, hide: false })
//follow.p_board_ID.insert({ num: num })
//tmp3 = board.p_board_ID.find(hide == false)
//render('page8', { data: tmp3, num: tmp3.length, board_ID: p_board_ID, ID: p_ID })
router.post('/post_private', function (req, res) {
    console.log(req.body);
    getPassword_private(req, res);
});

//get: ‘./DB/post_preview’ parameter -> html
//render('preview', { html: p_html })
router.get('/post_preview', function (req, res) {
    res.render('preview', { html: urlencode.decode(req.query.html) });
});


//get: ‘./DB/add_lover’ , parameter -> ID, board_ID
//filter < - ID == p_ID
//goal = {}
//goal[p_board_ID] = p_board_ID
//people.personal_lover.update(filter, goal)
//if success -> return { result: success }(用 res.end(JSON))
//else -> return { result: error }
router.get('/add_lover', function (req, res) {
    res.render('preview', { html: urlencode.decode(req.query.html) });
});


//get: ‘./DB/discuss’ parameter -> num, ID, board_ID, include
//tmp1 = board.p_board_ID.find(num == p_num)
//count = tmp1.length - 5 + 1 //因為有五個非留言參數
//filter < - num = p_num
//goal = {}
//goal[count] = include
//board.p_board_ID.update(filter, $set(goal))
////以上完成留言,以下進行通知
//tmp2 = follow.p_board_ID.find({ 不顯示num }, num == p_num)
//goal2 = {}
//str = p_board + '_' + p_num
//goal2[str] = str
//for (i in tmp2)
//    filter < - ID == i
//people.personal_notice.updateOne(filter, $set(goal2))
//goal3 = {}
//goal3[p_ID] = p_ID
//follow.p_board_ID.updateOne({ num == p_num}, $set{ goal3 })
router.post('/discuss', function (req, res) {
    console.log(req.body);
});

module.exports = router;