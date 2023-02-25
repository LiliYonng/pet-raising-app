var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const SECRET = 'jiflsfdjslkdaklddsal';
const{ connection} = require('../../db.js');

const query = require('../../query');

var mallRouter = require('./manageGoods');
var newsRouter = require('./manageNews');
var userRouter = require('./manageUsers')
router.use('/mall',mallRouter);
router.use('/news',newsRouter);
router.use('/user',userRouter);
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

function newToekn(id){
  const accessToken = jwt.sign({
    account:String(id),
  },SECRET,{expiresIn:'10m'});
  const refreshToken = jwt.sign({
    account:String(id),
  },SECRET,{expiresIn:'1d'});
  return {accessToken,refreshToken};
};
router.get('/refreshToken',function(req,res,fields){
  const raw = String(req.headers.authorization).split(' ').pop();
  let decoded =null;
  try{
    decoded=  jwt.verify(raw,SECRET);
  }
  catch(err)
  {
    res.status(401).send({msg:'登录失效，请重新登录'});
    return;
  }
  let {account} = decoded;
  connection.escape(account);
  var sql = 'select account from adminList where account = ?';
  connection.query(sql,[account],(err,results,fields)=>{
    if(err) throw err;
   if(results.length == 0)
   {
    res.status(401).send({msg:'登录失效，请重新登录'});
    return;
   }
   else
   {
    const accessToken = jwt.sign({
      account:String(account),
    },SECRET,{expiresIn:'10m'});
    res.json({code:0,accessToken:accessToken});
   }
 
})  

});
const Manage =  {editMall:true,addMall:true,delMall:true,editUser:true,addUser:true,delUser:true};
const Normal = 	{editMall:true};
router.post('/login', function(req, res, next) {
  const {account,psw} = req.body;
  connection.escape(account);
  connection.escape(psw);
  let sql = 'SELECT * FROM adminList AS a INNER JOIN adminInfo AS b ON a.account = b.account WHERE a.account = ? AND a.psw =?';
  let results = {};
    query(sql,[account,psw],function(err,vals,fields){
     if(err) throw err;
     if(vals.length==0)
    {     
     res.status(400).send({msg:'账号或密码错误'});
     return;}
     let {name,lastDate,lastLocation,identity} = vals[0];
     //设置权限
     const token = newToekn(account);
     results.token = token;
     results.userInfo = {name,lastDate,lastLocation,identity};  
     //根据权限查找菜单数据
     results.permission = identity?Manage:Normal;
     let menuSql = 'select * from menu where identity <= ?';
     query(menuSql,identity,function(err,vals,fields){
      if(err) throw err;
      results.menu = vals;
    //返回数据
      res.json({code:0,data:results});
    })
    });
  });
  module.exports = router;