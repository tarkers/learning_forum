'use strict';

var express = require('express');

var router = express.Router();
/* GET home page. */

router.get('/', function (_req, res) {
  res.render('page1', {
    title: '<h1>express</h1>',
    include: "<h1>主題</h1> <p> 內容大綱</p> <img src='https://i.imgur.com/y6b7eZX.jpg' style='width:300px' />"
  });
});
/* GET Page 3*/

router.get('/CB/direct_to_3', function (_req, res) {
  res.render('Page3', {
    ID: "undefined",
    header: "主題",
    data: ['<h1>第一頁<h1>', '<h1>第二頁<h1>', '<h1>第三頁<h1>']
  });
});
/* POST Page 1 -register/sign_in*/

router.post("/SAN/:mode", function (_req, res) {
  console.log(_req.params.mode);
  res.render('page1', {
    title: '<h1>express</h1>',
    include: "<h1>主題</h1> <p> 內容大綱</p> <img src='https://i.imgur.com/y6b7eZX.jpg' style='width:300px' />"
  });
});
/* POST Page 4 -register/sign_in*/

router.post('/CB/direct_to_4', function (_req, res) {
  res.render('Page4', {
    data: ["ps", "econ", "psy", "law", "yt"]
  });
});
/* POST Page 5 Page6 -teacher department*/

router.post('/CB/department/:de_Name', function (_req, res) {
  var de_Name = _req.params.de_Name;

  if (de_Name === "YT") {
    res.render('Page5', {
      ID: 123456
    });
  } else {
    res.render('Page6', {
      DE: de_Name,
      keywords: {
        1: 'AI',
        2: 'IOT',
        3: 'ML',
        4: '機器學習',
        5: '姆咪',
        6: '嘻嘻'
      },
      tabs: {
        1: '全部',
        2: '固力',
        3: '熱流',
        4: '控制',
        5: '設計',
        6: '製造'
      },
      boards: [{
        'board_ID': 1234,
        'title': '三軸機械手臂的自動控制',
        'tab': '控制',
        'include': '我隨便亂打asdasdasdasd'
      }, {
        'board_ID': 135486,
        'title': '測試檔',
        'tab': '控制',
        'include': '解釋'
      }, {
        'board_ID': 4864,
        'title': '第三島機器學習',
        'tab': '熱流',
        'include': '解釋'
      }, {
        'board_ID': 47,
        'title': 'IOT大大',
        'tab': '控制',
        'include': '解釋'
      }, {
        'board_ID': 48,
        'title': 'XIOT',
        'tab': '固力',
        'include': '頁面所有的文字'
      }, {
        'board_ID': 8,
        'title': 'XIOT',
        'tab': '固力',
        'include': '4684'
      }, {
        'board_ID': 58,
        'title': '設計',
        'tab': '固力',
        'include': '頁面4684所有的文字'
      }, {
        'board_ID': 5758,
        'title': 'XIOT',
        'tab': '固力',
        'include': '568468'
      }, {
        'board_ID': 85,
        'title': '姆咪',
        'tab': '固力',
        'include': '568468'
      }, {
        'board_ID': 5578,
        'title': 'OPE',
        'tab': '固力',
        'include': '568468'
      }]
    });
  }
});
router.post('/JB/to_public_board', function (_req, res) {
  res.render('page1', {
    title: '<h1>express</h1>',
    num: 3
  });
});
router.post('/JB/to_private_board', function (_req, res) {
  res.render('page1', {
    title: '<h1>express</h1>',
    num: 3
  });
});
module.exports = router;