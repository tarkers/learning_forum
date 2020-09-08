'use strict';
var express = require('express');
const { GetUrl } = require('./database_url');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

require("dotenv/config")


/* GET home page. */
//*
router.get('/', function (req, res) {
        MongoClient.connect(GetUrl("data"), {
            useUnifiedTopology: true
        }, function (err, db) {
            if (err) throw err;
            //console.log("index.js:connect DB!");
            var found_database = db.db("data");
            found_database.collection("page1").find().toArray(function (err, found_data) {
                if (err) throw err;
                console.log("title>>")
                console.log(found_data[0]['title'])
                console.log("include>>")
                console.log(found_data[1]['include'])
                res.render('Page1', {
                    title: found_data[0]['title'],
                    include: found_data[1]['include']
                });
                db.close();
            });
        })
    });
//*/

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