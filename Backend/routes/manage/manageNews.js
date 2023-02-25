var express = require('express');
var router = express.Router();
var url = require('url');
const moment = require('moment');
const{ connection} = require('../../db.js');
const { createSecretKey } = require('crypto');

router.post('/getNewsData', function(req, res, next) {
  let {title} = url.parse(req.url,true).query;
  let sql;
  if(!title)
    sql  = 'select * from newsList'
  else{
    connection.escape(title);
    sql  = `select * from newsList where title like '%${title}%'`
  }
  connection.query(sql,(err,results,fields)=>{
    if(err) throw err;
    let newsData= [...results];
    res.json(JSON.stringify({code:0,newsData}))});
});

module.exports = router;