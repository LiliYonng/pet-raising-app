var express = require('express');
var router = express.Router();
var url = require('url');
const{ connection} = require('../../db.js');
const jwt = require('jsonwebtoken');
const SECRET = 'jiflsfdjslkdaklddsal';
//鉴权
function auth(req,res,next){
  let raw = String(req.headers.authorization).split(' ').pop();
  jwt.verify(raw,SECRET,function(err,decoded){
    if(err)
    {
      res.status(401).send({msg:'登录失效，请重新登录111'});
      return;
    }
      let {account} = decoded;
      connection.escape(account);
      var sql = 'select account from adminList where account = ?';
      connection.query(sql,[account],(err,results,fields)=>{
        if(err) throw err;
       if(results.length == 0)
       {
        res.status(401).send({msg:'登录失效，请重新登录222'});
        return;
       }
       else{
        req.account = results[0];
        next();
       }
      })
  });


};

router.use(auth);
/* GET users listing. */

// router.get('/getData', function(req, res, next) {
//   let sql = 'select * from goodsList';
//   connection.query(sql,(err,results,fields)=>{
//     if(err) throw err;
//     let userData= [...results];

//     res.json(JSON.stringify({code:0,userData}))});

// });
router.get('/getData', function(req, res, next) {
  let {name} = url.parse(req.url,true).query;
  let sql;
  if(!name)
    sql = 'select * from userData order by id desc';
  else
   { 
    connection.escape(name);
    sql =`select * from userData where name like '${name}%'`;}
 
  connection.query(sql,(err,results,fields)=>{
    if(err) throw err;
    let userData= [...results];

    res.json(JSON.stringify({code:0,userData}))});
});

 router.post('/add',function(req,res,next){
  const form = req.body;
  connection.escape(form);
  connection.query('insert into userData set ?',form,(err,results,fields)=>{
    if(err) throw err;
    res.status(200).send('ok');
  })
 });

 router.post('/delete',function(req,res,next){
  const {id} = req.body;
  connection.escape(id);
  connection.query('delete from userData where id =?',[id],(err,results,fields)=>{
    if(err) throw err;
    res.status(200).send('ok');
  })
 });
 router.post('/edit',function(req,res,next){
  const form = req.body;
  console.log(form);
  connection.escape(form);
  connection.query('update userData set ? where id = ?',[form,form.id],(err,results,fields)=>{
    if(err) throw err;
    res.status(200).send('ok');
  })
 });

 //返回折线图模拟数据
const {videoData,userData,orderData,tableData,tableLabel,countData} = require('./mockData');
 router.get('/getChartData', function(req, res, next) {
  res.status(200).json({code:0,data:{
    videoData,userData,orderData,tableData,tableLabel,countData
  }})
})


module.exports = router;
