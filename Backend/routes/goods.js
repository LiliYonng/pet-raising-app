var express = require('express');
var router = express.Router();
var url = require('url');
const moment = require('moment');
const{ connection} = require('../db.js');

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
module.exports = router;    