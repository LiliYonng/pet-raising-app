const Mock = require('mockjs')
let List = [];
for (let i = 0; i < 7; i++) {
    List.push(
      Mock.mock({
        宠物粮: Mock.Random.float(100, 8000, 0, 0),
        宠物玩具: Mock.Random.float(100, 8000, 0, 0),
        宠物饰品: Mock.Random.float(100, 8000, 0, 0),
        宠物用具: Mock.Random.float(100, 8000, 0, 0),
        相关文创: Mock.Random.float(100, 8000, 0, 0),
        其他: Mock.Random.float(100, 8000, 0, 0)
      })
    )
  }
const videoData =  {
    title: '月销量百分比',
    data: [
      {
        name: '宠物粮',
        value: 2999
      },
      {
        name: '宠物玩具',
        value: 5999
      },
      {
        name: '宠物饰品',
        value: 1500
      },
      {
        name: '相关文创',
        value: 1999
      },
      {
        name: '宠物用具',
        value: 2200
      },
      {
        name: '其他',
        value: 4500
      }
    ]
  }
const userData = {
    title: '用户量',
    data: [
      {
        date: '周一',
        new: 5,
        active: 200
      },
      {
        date: '周二',
        new: 10,
        active: 500
      },
      {
        date: '周三',
        new: 12,
        active: 550
      },
      {
        date: '周四',
        new: 60,
        active: 800
      },
      {
        date: '周五',
        new: 65,
        active: 550
      },
      {
        date: '周六',
        new: 53,
        active: 770
      },
      {
        date: '周日',
        new: 33,
        active: 170
      }
    ]
  };
const orderData = {
    title: '近期销量',
    date: [
      '20220801',
      '20220802',
      '20220803',
      '20220804',
      '20220805',
      '20220806',
      '20220807'
    ],
    data: List
  };
const tableData =[
    {
      name: '宠物粮',
      todayBuy: 322,
      monthBuy: 2523,
      totalBuy: 5320
    },
    {
      name: '宠物用品',
      todayBuy: 203,
      monthBuy: 122,
      totalBuy: 2101
    },
    {
      name: '宠物饰品',
      todayBuy: 812,
      monthBuy: 3212,
      totalBuy: 6512
    },
    {
      name: '相关文创',
      todayBuy: 123,
      monthBuy: 221,
      totalBuy: 3221
    },
    {
      name: '宠物玩具',
      todayBuy: 522,
      monthBuy: 2120,
      totalBuy: 3230
    },
    {
        name: '其他',
        todayBuy: 212,
        monthBuy: 2333,
        totalBuy: 3230
      },
  ];
const tableLabel = {
    name: '商品名称',
    todayBuy: '今日销量',
    monthBuy: '本月销量',
    totalBuy: '总销量'
  };
const countData = [
    {
      name: '今日支付订单',
      value: 314,
      icon: 'SuccessFilled',
      color: '#2ec7c9'
    },
    {
      name: '今日收藏订单',
      value: 23,
      icon: 'StarFilled',
      color: '#ffb980'
    },
    {
      name: '今日未支付订单',
      value: 42,
      icon: 'GoodsFilled',
      color: '#5ab1ef'
    },
    {
      name: '本月支付订单',
      value: 2134,
      icon: 'SuccessFilled',
      color: '#2ec7c9'
    },
    {
      name: '本月收藏订单',
      value: 210,
      icon: 'StarFilled',
      color: '#ffb980'
    },
    {
      name: '本月未支付订单',
      value: 634,
      icon: 'GoodsFilled',
      color: '#5ab1ef'
    }
  ];

module.exports ={videoData,userData,orderData,tableData,tableLabel,countData};