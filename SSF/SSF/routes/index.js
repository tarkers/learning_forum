'use strict';
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

const mongoose = require("mongoose");
require("dotenv/config")

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

/*
mongoose.connect(process.env.DB_CONNECTION, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}, () => {})
//*/


/* GET home page. */
//*
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
/*
router.get('/', function (req, res) {
        MongoClient.connect(process.env.DB_CONNECTION, {
            useUnifiedTopology: true
        }, function (err, db) {
            if (err) throw err;
            //console.log("index.js:connect DB!");
            var found_database = db.db("db1");
            found_database.collection("page1").find().toArray(function (err, found_data) {
                if (err) throw err;
                res.render('Page1', {
                    title: found_data[0]['title'],
                    include: found_data[1]['include'],
                    num: 1
                });
                db.close();
            });
        })
    });
//*/

module.exports = router;