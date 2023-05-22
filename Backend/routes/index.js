var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const moment = require('moment');
const SECRET = 'jiflsfdjslkdaklddsal';
const{ connection} = require('../db.js');

const query = require('../query');
/* GET home page. */
router.post('/login', function(req, res, next) {
  const {account,psw} = req.body;
  connection.escape(account);
  connection.escape(psw);
  let sql = 'SELECT * FROM user WHERE userId = ? AND userPwd =?';
  let results = {};
  connection.query(sql,[account,psw],(err,results,fields)=>{
    if(err) throw err;
    let data= [...results];
    if(!data.length)
      res.status('403').send('密码账号错误')
    else{
      res.status('200').send('ok')
    }
});
});
router.get('/getNews', function(req, res, next) {
  let sql = 'select * from  newsList left join newsOperation on newslist.post_id = newsoperation.Opost_id';
  connection.query(sql,(err,results,fields)=>{
    if(err) throw err;
    let newsData= [...results];

    res.json({code:0,newsData})});
});
router.get('/getContent', function(req, res, next) {
  let {postId} = req.query;
  let sql;
  if(!postId)
    res.status(404).send('error')
  else
   { 
    connection.escape(postId);
    sql =`select * from newsList where post_id = ?`;}
 
  connection.query(sql,postId,(err,results,fields)=>{
    if(err) throw err;
    let news= [...results];

    res.json(news)});
});

router.post('/setRemind',function(req,res,next) {
  const{item} = req.body;
  item.done=1;
  connection.escape(item);
  connection.query('insert into remindlist set ?',item,(err,results,fields)=>{
    if(err) throw err;
    res.status(200).send('ok');
  })
});
router.post('/updateRemindList',function(req,res,next) {
  const {item} = req.body;
  item.done = item.done?1:0;
  item.dateTime = moment(new Date(item.dateTime)).format('YYYY-MM-DD HH:mm:ss')
  connection.escape(item);
  connection.query('update remindlist set ? where remind_id = ?',[item,item.remind_id],(err,results,fields)=>{
    if(err) throw err;
    res.status(200).send('ok');
  })

});
router.post('/deleteRemindItem',function(req,res,next){
  const {remind_id} = req.body;
  connection.escape(remind_id);
  connection.query('delete from remindlist where remind_id =?',[remind_id],(err,results,fields)=>{
    if(err) throw err;
    res.status(200).send('ok');
  })
 });
router.get('/getAllRemind',function(req,res,next) {
  connection.query('select * from remindlist',(err,results,fields)=>{
    if(err) throw err;
    let remindList= [...results];
    res.json(remindList)});
});

router.get('/getAllRecord',function(req,res,next) {
  let {pet_id} = req.query;
  pet_id = Number(pet_id)
  console.log(req.query)
  connection.query('select * from dailyList where pet_id = ? order by create_time desc ',pet_id,(err,results,fields)=>{
    if(err) throw err;
    let list= [...results];
    res.json(list)});
});
router.post('/addDaily',function(req,res,next) {
  const{daily} = req.body;
  connection.escape(daily);
  connection.query('insert into dailyList set ?',daily,(err,results,fields)=>{
    if(err) throw err;
    res.status(200).send('ok');
  })
});
router.post('/editDaily',function(req,res,next) {
  const{daily} = req.body;
  connection.escape(daily);
  daily.create_time = moment(new Date(daily.create_time)).format('YYYY-MM-DD HH:mm:ss')
  connection.escape(daily);
  connection.query('update dailyList set ? where daily_id = ?',[daily,daily.daily_id],(err,results,fields)=>{
    if(err) throw err;
    res.status(200).send('ok');
  })
});
router.post('/deleteDaily',function(req,res,next){
  const {daily_id} = req.body;
  console.log(req.body)
  connection.escape(daily_id);
  connection.query('delete from dailyList where daily_id =?',[daily_id],(err,results,fields)=>{
    if(err) throw err;
    res.status(200).send('ok');
  })
 });
 router.get('/getDaily', function(req, res, next) {
  let {daily_id} = req.query;
  let sql = 'select * from  dailyList where daily_id=?';
  connection.query(sql,daily_id,(err,results,fields)=>{
    if(err) throw err;
    let data= [...results];

    res.json(data)});
});
router.post('/addPet',function(req,res,next) {
  const{petInfo} = req.body;
  connection.escape(petInfo);
  connection.query('insert into petList set ?',petInfo,(err,results,fields)=>{
    if(err) throw err;
    res.status(200).send('ok');
  })
});
router.post('/editPet',function(req,res,next) {
  const{petInfo} = req.body;
  petInfo.date = moment(new Date(daily.date)).format('YYYY-MM-DD HH:mm:ss');
  petInfo.age = moment(new Date(daily.age)).format('YYYY-MM-DD HH:mm:ss');
  if(!petInfo.sex) petInfo.sex = 2;
  connection.escape(petInfo);
  connection.query('update petList set ? where pet_id = ?',[petInfo,petInfo.pet_id],(err,results,fields)=>{
    if(err) throw err;
    res.status(200).send('ok');
  })
});
router.post('/deletePet',function(req,res,next){
  const {pet_id} = req.body;
  console.log(pet_id)
  connection.escape(pet_id);
  connection.query('delete from petList where pet_id =?',[pet_id],(err,results,fields)=>{
    if(err) throw err;
    res.status(200).send('ok');
  })
 });
 router.get('/getPet', function(req, res, next) {
  let {pet_id} = req.query;
  let sql = 'select * from  petList';
  if(pet_id)
  {
    sql = 'select * from  petList where pet_id =?';
  }
  connection.query(sql,pet_id,(err,results,fields)=>{
    if(err) throw err;
    let data= [...results];

    res.json(data)});
});
module.exports = router;
