'use strict';
var express = require('express');
var router = express.Router();
console.log(router);
/* GET home page. */
router.get('/', function (_req, res) {
    res.render('Page1', {
        title: '<h1>express</h1>', include: "<h1>主題</h1> <p> 內容大綱</p> <img src='https://i.imgur.com/y6b7eZX.jpg' style='width:300px' />"
    });
});
router.get('/2', function (_req, res) {
    res.render('Page2', {
        title: '<h1>express</h1>', include: "<h1>主題</h1> <p> 內容大綱</p> <img src='https://i.imgur.com/y6b7eZX.jpg' style='width:300px' />"
    });
});
router.get('/3', function (_req, res) {
    res.render('Page3', {
        board_ID: 12346,
        password: 1235486
    });
});
router.get('/4', function (_req, res) {
    res.render('Page4', {
        board_ID: 12346,
        password: 1235486
    });
});
router.get('/5', function (_req, res) {
    res.render('Page5', {
        board_ID: 1354,
        password: 156,
        data: [
            {
                'num': 1,
                'ID': 'S2243',
                'title': '我是標題',
                'include': '<label>tes家田軌t</label>',
                'hide': false,
                '1': '我是第一則留言 (D)',
                '2': '我是第二則留言 (D)',
                '3': '我是第三則留言 (D)'
            },
            {
                'num': 2,
                ID: 'S2243',
                title: '我是標題',
                include: '<label>864wfww玩家</label>',
                hide: true,
                1: '我是第一則留言 (D)',
                2: '我是第二則留言 (D)',
                3: '我是第三則留言 (D)'
            },
            {
                'num': 3,
                ID: 'F46541',
                title: '我是標題',
                include: '<label>推推玩家</label>',
                hide: false,
                1: '我是第一則留言 (D)',
                2: '我是第二則留言 (D)',
                3: '我是第三則留言 (D)'
            }]
    });
});
router.get('/6', function (_req, res) {
    res.render('Page6', {
        board_ID: 1425,
        password: 156,
        data: [
            {
                'board_ID': '3',
                'title': '我是標題',
            }, {
                'board_ID': '2',
                'title': '共軸應用',
            }, {
                'board_ID': '4',
                'title': '共享應用',
            }, {
                'board_ID': '5',
                'title': '標題test',
            }, {
                'board_ID': '25',
                'title': '過程濾EIG5e',
            }, {
                'board_ID': '82',
                'title': '過濾測試',
            },]
    });
});
router.get('/7', function (_req, res) {
    res.render('Page7', {
        board_ID: 12345,
        password: 12,
    });
});
router.get('/8', function (_req, res) {
    res.render('Page8', {
        // board_ID:12345,
        password: 12,
    });
});
router.get('/9', function (_req, res) {
    res.render('Page9', {
        board_ID: 12345,
        password: 12,
    });
});
router.post('/BM/get_information', function (_req, res) {

    res.status(200).send({
        data: {
            'board_ID': 135864,
            'password': 135864,
            'board': 135864,
            'type': 135864,
            'title': 135864,
            'introduce': 135864,
            'name': 135864,
            'school': 135864,
            'class': 135864,
            'password_private': 135864,
            'password_public': 165,
            'tab': 164546,
            'include': '1965153饕',
        },
    });
});
router.get('/10', function (_req, res) {
    res.render('Page10', {
        board_ID: 12345,
        password: 12,
        board: null,

    });
});
router.post('/GBD/download', function (_req, res) {
    console.log(_req.body);
    res.status(200).send({  //test code
        data: [{
            "title": "8645123",
            "description": "Advertise here with BSA Apple cancelled its scheduled sale of iPhone 4S in one of its stores in China’s capital Beijing on January 13. Crowds outside the store in the Sanlitun district were waiting on queues overnight. There were incidents of scuffle between shoppers and the store’s security staff when shoppers, hundreds of them, were told that the sales [...]Source : Design You TrustExplore : iPhone, iPhone 4, Phone",
            "link": "http://wik.io/info/US/309201303",
            "timestamp": 1326439500,
            "image": null,
            "embed": null,
            "language": null,
            "user": null,
            "user_image": null,
            "user_link": null,
            "user_id": null,
            "geo": null,
            "source": "wikio",
            "favicon": "http://wikio.com/favicon.ico",
            "type": "blogs",
            "domain": "wik.io",
            "id": "2388575404943858468"
        },
        {
            "title": "16515165",
            "description": "Advertise here with BSA Apple cancelled its scheduled sale of iPhone 4S in one of its stores in China’s capital Beijing on January 13. Crowds outside the store in the Sanlitun district were waiting on queues overnight. There were incidents of scuffle between shoppers and the store’s security staff when shoppers, hundreds of them, were told that the sales [...]Source : Design You TrustExplore : iPhone, iPhone 4, Phone",
            "link": "http://wik.io/info/US/309201303",
            "timestamp": 1326439500,
            "image": null,
            "embed": null,
            "language": null,
            "user": null,
            "user_image": null,
            "user_link": null,
            "user_id": null,
            "geo": null,
            "source": "wikio",
            "favicon": "http://wikio.com/favicon.ico",
            "type": "blogs",
            "domain": "wik.io",
            "id": "2388575404943858468"
        }]
    });
});
module.exports = router;
