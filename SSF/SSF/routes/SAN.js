'use strict';
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

const mongoose = require("mongoose");
require("dotenv/config")

var g_database = mongoose.connection;
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

/*
mongoose.connect(process.env.DB_CONNECTION, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}, () => {})
//*/

const peaple_model=require('../models/people')



/* GET home page. */
router.post('/', async (req, res) => {
    const post_data = new peaple_model({
        ID: req.body.ID,
        password: req.body.password,
        name: req.body.name,
        mail: req.body.mail,
        school: req.body.school,
        gender: req.body.gender
    })
    try {
        //if 
        const post_result = await post_data.save()
        res.json(post_result)
    } catch (err) {
        res.json({
            message: err
        })
    }
})


//查詢資料庫所有資料
router.get('/all', async (req, res) => {
    try {
        const found_data = await peaple_model.find()
        res.json(found_data)
    } catch (err) {
        res.json({
            message: err
        })
    }
})
//查找對應id的資料
router.get('/:postId', async (req, res) => {
    try {
        const findPost = await peaple_model.findById(req.params.postId)
        console.log("test2")
        res.json(findPost)
    } catch (err) {
        res.json({
            message: err
        })
    }
})

//刪除資料
router.delete('/:postId', async (req, res) => {
    try {
        const remove_result = await peaple_model.deleteOne({
            _id: req.params.postId
        })
        res.json(remove_result)
    } catch (err) {
        res.json({
            message: err
        })
    }
})
//修改資料
router.patch('/:postId', async (req, res) => {
    try {
        const updatePost = await peaple_model.updateOne({
            _id: req.params.postId
        }, {
            $set: {
                //title: req.body.title
                ID: req.body.ID,
                password: req.body.password,
                name: req.body.name,
                mail: req.body.mail,
                school: req.body.school,
                gender: req.body.gender
            }
        })
        res.json(updatePost)
    } catch (err) {
        res.json({
            message: err
        })
    }
})

module.exports = router;