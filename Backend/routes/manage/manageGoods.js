var express = require('express');
var router = express.Router();
var url = require('url');
const moment = require('moment');
const{ connection} = require('../../db.js');
const { createSecretKey } = require('crypto');

router.get('/getMalls', function(req, res, next) {
  let {name} = url.parse(req.url,true).query;
  let sql;
  if(!name)
    sql  = 'select * from (select * from goods) AS a join (select gid,sum(store) AS sum_store,sum(sale) AS sum_sale from goodsStore GROUP BY gid) AS b ON a.gid = b.gid'
  else{
    connection.escape(name);
    sql  = `select * from (select * from goods where name like '%${name}%') AS a join (select gid,sum(store) AS sum_store,sum(sale) AS sum_sale from goodsStore GROUP BY gid) AS b ON a.gid = b.gid`
  }
  connection.query(sql,(err,results,fields)=>{
    if(err) throw err;
    let mallData= [...results];
    res.json(JSON.stringify({code:0,mallData}))});
});

 router.post('/add',function(req,res,next){
  const form = req.body;
  connection.escape(form);
  connection.query('insert into goods set ?',form,(err,results,fields)=>{
    if(err) throw err;
    res.status(200).send('ok');
  })
 });

 router.post('/delete',function(req,res,next){
  const {gid} = req.body;
  connection.escape(gid);
  connection.query('delete from goods where gid =?',[gid],(err,results,fields)=>{
    if(err) throw err;
    res.status(200).send('ok');
  })
 });
 router.post('/edit',function(req,res,next){
  const {priceMin,name,onSale,gid,goods_core,sum_store} = req.body;
  // 能改变的只有priceMin, name,onSale,
  connection.query('update goods set priceMin = ?,name = ?,onSale = ? where gid = ?',[priceMin,name,onSale,gid],(err,results,fields)=>{
    if(err) throw err;
    if(goods_core){
      connection.query('update goodsStore set store = ? where goods_core = ?',[sum_store,goods_core],(err,results,fields)=>{
        if(err) throw err;
      })
    }
    res.status(200).send('ok');
  })
 });
 router.post('/changeState',function(req,res,next){
  const {gid,onSale} = req.body;
  connection.escape(gid,onSale);
  connection.query('update goods set onSale= ? where gid = ?',[onSale,gid],(err,results,fields)=>{
    if(err) throw err;
    res.status(200).send('ok');
  })
 });

 router.post('/getStore',function(req,res,next){
  const data = req.body;
  connection.escape(data);
  connection.query('select * from goodsStore where gid = ? and color = ? and size = ?',[data.gid,data.color,data.size],(err,results,fields)=>{
    if(err) throw err;
    let resData= [...results];
    res.json(JSON.stringify({code:0,resData}))
  })
 });

module.exports = router;