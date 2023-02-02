var express = require('express');
var router = express.Router();
var url = require('url');
const moment = require('moment');
const{ connection} = require('../db.js');

router.post('/operateNews',function(req,res,next) {
    const {item} = req.body;
    if(!item.Opost_id)
        res.status(302).send('error');
    connection.escape(item);
    let sql = 'REPLACE INTO newsOperation set ?'
    //'update newsOperation set ? where post_id = ?'
    connection.query(sql,[item],(err,results,fields)=>{
      if(err) throw err;
    res.status(200).send('ok');
    })
  
  })
  router.post('/report',function(req,res,next) {
    const {item} = req.body;
    console.log(item.time)
    item.time = moment(item.time).format('YYYY-MM-DD HH:mm:ss');
    console.log('1111')
    connection.escape(item);
    let sql = 'insert into reportList set ?'
    //'update newsOperation set ? where post_id = ?'
    connection.query(sql,[item],(err,results,fields)=>{
      if(err) throw err;
    res.status(200).send('ok');
    })
  })
  router.get('/getComment', function(req, res, next) {
    let {postId} = req.query;
    console.log(postId)
    let sql = 'select * from  commentList where c_post_id = ? order by comment_time desc';
    connection.query(sql,postId,(err,results,fields)=>{
      if(err) throw err;
      let data= [...results];
  
      res.json(data);
  });})
  router.post('/addComment', function(req, res, next) {
    let {item} = req.body;
    console.log(item)
    item.comment_time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    let sql = 'insert into commentList set ?';
    connection.query(sql,item,(err,results,fields)=>{
      if(err) throw err;
      res.status(200).send('ok')
  });})
  
module.exports = router;