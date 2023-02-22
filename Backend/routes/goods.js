var express = require('express');
var router = express.Router();
var url = require('url');
const moment = require('moment');
const{ connection} = require('../db.js');
const { createSecretKey } = require('crypto');

router.get('/getGoodsList', function(req, res, next) {
    let sql = 'select * from  goods';
    connection.query(sql,(err,results,fields)=>{
      if(err) throw err;
      let goodsList= [...results];
      res.json({code:0,goodsList})});
  });
  router.post('/getGoodsListbyOrder', function(req, res, next) {
    const {price,sales} = req.body;
    let sql;
    if(price){
        sql = price==1?"select * from goods order by priceMin asc":'select * from goods order by priceMin desc'
    }
    else if(sales){
        sql = sales==1?"select * from goods order by sales asc":'select * from goods order by sales desc'
    }
    else{
        res.status(302).send('error');
    }
    connection.query(sql,(err,results,fields)=>{
      if(err) throw err;
      let goodsList= [...results];
      res.json({code:0,goodsList})});
  });
router.get('/getGoodsDetail', function(req, res, next) {
    let {gid} = req.query;
    let sql = 'select * from  goods where gid = ?';
    connection.query(sql,gid,(err,results,fields)=>{
        if(err) throw err;
        let goodsInfo= results[0];
        res.json({code:0,goodsInfo})});
});

router.post('/getStore',function(req,res,next) {
    const {gid,color,size} = req.body;
    if(!gid)
        res.status(302).send('error');
    let sql = 'select * from  goodsStore where gid = ? and color = ? and size = ?';
    //'update newsOperation set ? where post_id = ?'
    connection.query(sql,[gid,color,size],(err,results,fields)=>{
      if(err) throw err;
      let data = {...results[0]};
      res.json({code:0,data})
    })
})

router.post('/order',function(req,res,next) {
    const orderInfo = req.body;
    if(!orderInfo.goods_core)
    {
        res.status(302).send('error');
        return;
    }
    let time = new Date();
    let sn = "";   //定义订单编号
    for (var i = 0; i < 4; i++) //4位随机数，用以加在时间戳后面。
    {
        sn += Math.floor(Math.random() * 10);
    }
    sn =  time.getTime() + sn;  //时间戳，用来生成订单编号。
    let created = moment(time).format('YYYY-MM-DD HH:mm:ss')
    // let specText = color+size
    let item = {
        sn,
        created,
        status:1,
        ...orderInfo,
    }
    // connection.escape(item);
    connection.query('insert into orderList set ?',item,(err,results,fields)=>{
      if(err) throw err;
      res.json({code:0,sn})
    return
    });
})

router.post('/getOrderDetail',function(req,res,next) {
    const {sn} = req.body;
    if(!sn)
        res.status(302).send('error');
    connection.query('select * from orderList where sn = ?',sn,(err,results,fields)=>{
      if(err) throw err;
      let orderInfo = {...results[0]};
      connection.query('select name,cover,priceMax from goods where gid = ?',orderInfo.goodsId,(err,results,fields)=>{
        if(err) throw err;
        let goods = results[0]
        orderInfo.name = goods.name
        orderInfo.cover = goods.cover
        orderInfo.priceMax = goods.priceMax
        res.json({code:0,data:orderInfo})
      })
    })
})
module.exports = router;    