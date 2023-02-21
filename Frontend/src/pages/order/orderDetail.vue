<template>
	<view class="page-content" :style="'padding-bottom: calc(14.6667vw + '+safeBottom+'px)'">
		<view class="page-bg"></view>
		<!-- 底栏 START -->
		<view class="bottom-bar flex" :style="'padding-bottom:'+safeBottom+'px'">
			<view class="bottom-bar-inner" v-if="orderData.status == 0">
				<view class="flex">
					<view class="cancel-btn link flex" @click="cancelOrder(oid)">
						取消订单
					</view>
					<view class="buy-btn link flex" @click="pay()">
						去付款
					</view>
				</view>
			</view>
			<view class="bottom-bar-inner" v-if="orderData.status == 3">
				<view class="flex">
					<view class="buy-btn link flex" @click="goReturn()">归还</view>
				</view>
			</view>
		
		</view>
		<!-- 底栏 END -->
		<view class="container">
			<view class="order-brief">
				<view class="flex">
					<view class="status">{{STATUS[orderData.status]}}</view>
					<view class="timer"><text>{{showTime}}</text></view>
				</view>
				<view class="order-desc">
				{{orderData.alipayAuthStatus!=1?'您的订单还未进行押金减免，请及时处理':'您的订单已进行押金减免'}}
					
				</view>
			</view>
			<view class="addr-box box">
				<view class="name" v-if="orderData.sendName">
					{{orderData.sendName}}
					{{orderData.sendTel.substr(0,3)}}*****{{orderData.sendTel.substr(8,3)}}
				</view>
				<view class="address">{{orderData.sendRegion}} {{orderData.sendAddr}}</view>
				<view style="margin:1vw">{{orderData.userMsg}}</view>
			</view>
			<view class="goods-box flex box">
				<image :src="orderData.goodsInfo.cover" mode="aspectFit"></image>
				<view class="goods-text">
					<view class="name">{{orderData.goodsInfo.name}}</view>
					<view class="spec"{{orderData.specText}}</view>
					<view class="num">数量：{{orderData.num}}</view>
				</view>
			</view>
			<view class="order-info box">
				<view class="row bold">
					<view class="row-title">首月实付金额</view>
					<view class="price">¥ <text>{{orderData.firstPay}}</text></view>
				</view>
				<view class="row">
					<view class="row-title">尾期租金</view>
					<view>{{orderData.lastPay}}</view>
				</view>
				<view class="row">
					<view class="row-title">剩余租期</view>
					<view>￥{{orderData.monthPrice}}x{{orderData.stageNum}}期 </view>
				</view>
				<view class="row">
					<view class="row-title">总租金</view>
					<view>￥{{orderData.totalRent}}</view>
				</view>
				<view class="row">
					<view class="row-title">优惠券</view>
					<view class="coupon red">- ¥{{orderData.discount}}</view>
				</view>
				<view class="row">
					<view class="row-title">配送方式</view>
					<view>顺丰快递 | 寄出包邮 | 归还自费</view>
				</view>
				<view class="row">
					<view class="row-title">买断尾款</view>
					<view> ¥{{orderData.buyPrice}}</view>
				</view>
			</view>
			<view class="order-info box">
				<view class="row">
					<view class="row-title">平台规则减免</view>
					<view>￥80.0</view>
				</view>
				<view class="row">
					<view class="row-title">芝麻信用减免</view>
					<view>￥1080.0</view>
				</view>
				<view class="row">
					<view class="row-title">押金冻结方式</view>
					<view class="flex"><text>支付宝资金授权</text><image src="/static/images/order/question.svg" mode="aspectFit" class="link"></image></view>
				</view>
				<view class="desc">提示：以上平台规则减免显示的额度，以最终发货审核为准</view>
			</view>
			<view class="order-info box">
				<view class="row">
					<view class="row-title">交易快照</view>
					<view class="flex link"><text>查看快照</text><image src="/static/images/order/arrow-right.svg" mode="aspectFit" class="link"></image></view>
				</view>
				<view class="row">
					<view class="row-title">租赁协议</view>
					<view class="flex link"><text>查看协议</text><image src="/static/images/order/arrow-right.svg" mode="aspectFit" class="link"></image></view>
				</view>
				<view class="row">
					<view class="row-title">订单编号</view>
					<view>{{orderData.sn}}<image src="/static/images/copy.svg" mode="aspectFit" class="link" @click="copy('54564561321564652198')"></image></view>
				</view>
				<view class="row">
					<view class="row-title">创建时间</view>
					<view>{{orderData.created}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				safeBottom: 0,
				oid:null,
				orderData:{
					buyPrice: "0.01"
					created: "2023-01-17 00:50"
					discount: "0.00"
					goodsCore:'10001'
					num: "1"
					sendAddr: "广东省 广州市 越秀区 黄花岗街道环市东路463号广东工业大学生活区"
					sendName: "A"
					sendNo: null
					sendRegion: "广东省 广州市 越秀区 "
					sendTel: "19924689037"
					sent: null
					sn: "T202301170050398689"
					specText: "亮黑色,8GB+128GB"
					stageNum: "3"
					status: "1"
					userMsg: "超长备注超长备注超长备注超长备注超长超长备注超长备注超长备注超长备注超长备注超长超长备注超长备注超超长备注超长备注超长超长备注超长备注超长备注备注长备注"
				},
				endTime:'',
				showTime:'',
				payTimer:'',
				STATUS:[
					'待支付','待发货','待收货','待归还','归还中','已完成','已取消'
				]
			}
		},
		onLoad(e){
			let safeBottom = 0;
			if(app.globalData.sysInfo.safeArea){
				safeBottom = app.globalData.sysInfo.safeArea.bottom;
			} else {
				if(app.globalData.sysInfo.platform == 'ios') safeBottom = 34;
			}
			this.$data.safeBottom = safeBottom;
			this.oid = e.id
			// this.loadData()

			// if(e.type)//type=1时，立即付款
			// {
			// 	this.pay()
			// }
		},
		onHide(){
			this.payTimer && clearInterval(this.payTimer);
		},
		onShow(){
			if(this.orderData.status == 0)
				this.payTimer = setInterval(() => {
					return this.countDown()
				}, 1000);
		},
		methods: {
			copy(str){
				uni.setClipboardData({
					data: str,
					success: ()=>{
						uni.showToast({
							title: '已复制'
						})
					}
				})
			},
			loadData(){
				this.$api.getOrderDetail({oid:this.oid}).then(res=>{
					this.orderData = res.data
					if(this.orderData.status == 0){ //待支付订单设置倒计时
						const time = this.dayjs(this.orderData.created).add(30, 'm')
						this.endTime = time.valueOf()
						this.payTimer = setInterval(() => {
						return this.countDown()
						}, 1000);
					}
				})
			},
			countDown(){
				const diffTime = this.dayjs.duration(this.endTime-this.dayjs())
				const mi =  diffTime.minutes() % 60
				const minutes = mi< 10 ? '0' + mi : mi
				const se = diffTime.seconds() % 60
            	const seconds =  se < 10 ? '0' + se : se
				
				if ( minutes <= 0 && seconds <= 0) {
					clearInterval(this.payTimer);
				} else {
					this.showTime = `${minutes}:${seconds} 后失效`;
				}
			},
			pay(){
				// 获取订单授权
				my.getAuthCode({
				scopes: ['order_service'],
				success: (res) => {
					this.$api.payOrder({oid:this.oid}).then(res=>{
						this.trade(res.data.tradeNo )
					})
				},
				fail: (res) => {
					uni.showToast({
						title: '请授权后下单',
						icon: 'fail',
						duration:500,
					})
				},
				});
			},
			trade(tn){
				my.tradePay({
				// 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
				tradeNO: tn,
				success: (res) => {
					if(res.resultCode == 9000){
						uni.showToast({
							title:'支付成功',
							icon:'success'
						})
					}
				},
				fail: (res) => {
						uni.showToast({
							title:'支付失败，请重新付款',
							icon:'fail'
						})
				},
				complete: (res) =>{
						setTimeout( () => {
							uni.redirectTo({
							url: '/pages/order/detail?id=' + this.oid
							});	
						}, 500)
				}
				});
			},
			cancelOrder(id){
				const oid = id
				uni.showModal({
					title: '取消订单',
					content: '确认当前订单？',
					success: res=>{
						if(res.confirm){
							this.comfirmCancle(oid)
						}
					}
				})
			},
			comfirmCancle(id){
				this.$api.cancelOrder({oid:id}).then(res=>{
					if(res.code==0){
						uni.showToast({
							title:'取消成功',
							icon:'success'
						})
					}
					else{
						uni.showToast({
							title:'订单异常',
							icon:'fail'
						})
					}
					this.loadData()
					this.payTimer && clearInterval(this.payTimer);
					this.showTime=null
				})
			},
			goReturn() {
				this.$api.returnGoods({oid:this.oid}).then(
					res=>{
						uni.showToast({
						title: '归还成功',
						icon: 'success',
						mask: true,
						duration:500,
					})
					this.loadData()
					}
				).catch(err=>{
					uni.showToast({
						title: err,
						icon: 'fail',
						mask: true
					})
				})
			}
		}
	}
</script>

<style>
	.order-info .desc {
		color: #999;
		font-size: 22rpx;
	}
	.order-info .row image {
		width: 3.7333vw;
		height: 3.7333vw;
		margin-left: 0.5333vw;
	}
	
	.order-info .row.bold .price {
		font-size: 24rpx!important;
	}
	.order-info .row.bold .price text {
		font-size: 32rpx!important;
	}
	.order-info .row view.coupon.red {
		color: #CB0000;
	}
	.order-info .row view.row-title {
		color: #666;
		display: inline-block;
	}
	.order-info .row view.row-title .badge {
		color: #FFD23D;
		font-weight: normal;
		padding: 0 1.6vw;
		margin-left: 1.8vw;
		display: inline-block;
		background: linear-gradient(90deg, #222222 0%, #3C3C3C 67%, #222222 100%);
		border-radius: .533vw;
		font-size: 21rpx;
		vertical-align: text-bottom;
	}
	.order-info .row view {
		color: #222;
	}
	.order-info .row view image {
		/* vertical-align: unset; */
	}
	.order-info .row.bold view {
		font-weight: bold;
		font-size: 32rpx;
		color: #000;
	}
	.order-info .row {
		margin-bottom: 1.06667vw;
		display: flex;
		align-items: center;
		justify-content: space-between;
		line-height: 1.84;
		font-size: 27rpx;
	}
	.order-info {
		padding: 4.8vw 4.2667vw;
		color: #222;
	}
	.addr-box .address {
		color: #999;
		font-size: 24rpx;
	}
	.addr-box .name {
		font-weight: bold;
		font-size: 32rpx;
		margin-bottom: 1.06667vw;
	}
	.addr-box view {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 100%;
	}
	.addr-box {
		padding: 3.7333vw 5.333vw;
		background-repeat: repeat-x;
		background-size: 150%;
		background-position: 50% 100%;
		background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQ1IiBoZWlnaHQ9IjIiIHZpZXdCb3g9IjAgMCAzNDUgMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgaWQ9Ik1hc2sgR3JvdXAiPgo8ZyBpZD0iR3JvdXAgNTUiPgo8ZyBpZD0iRnJhbWUgMTEyNiI+CjxwYXRoIGlkPSJSZWN0YW5nbGUgMjMzIiBkPSJNNyAwSDE2TDE1IDJINkw3IDBaIiBmaWxsPSIjRUQ0RTRFIi8+CjxwYXRoIGlkPSJSZWN0YW5nbGUgMjM0IiBkPSJNMjMgMEgzMkwzMSAySDIyTDIzIDBaIiBmaWxsPSIjRkZEMjNEIi8+CjxwYXRoIGlkPSJSZWN0YW5nbGUgMjM1IiBkPSJNMzkgMEg0OEw0NyAySDM4TDM5IDBaIiBmaWxsPSIjRUQ0RTRFIi8+CjxwYXRoIGlkPSJSZWN0YW5nbGUgMjM2IiBkPSJNNTUgMEg2NEw2MyAySDU0TDU1IDBaIiBmaWxsPSIjRkZEMjNEIi8+CjxwYXRoIGlkPSJSZWN0YW5nbGUgMjM3IiBkPSJNNzEgMEg4MEw3OSAySDcwTDcxIDBaIiBmaWxsPSIjRUQ0RTRFIi8+CjxwYXRoIGlkPSJSZWN0YW5nbGUgMjM4IiBkPSJNODcgMEg5Nkw5NSAySDg2TDg3IDBaIiBmaWxsPSIjRkZEMjNEIi8+CjxwYXRoIGlkPSJSZWN0YW5nbGUgMjM5IiBkPSJNMTAzIDBIMTEyTDExMSAySDEwMkwxMDMgMFoiIGZpbGw9IiNFRDRFNEUiLz4KPHBhdGggaWQ9IlJlY3RhbmdsZSAyNDAiIGQ9Ik0xMTkgMEgxMjhMMTI3IDJIMTE4TDExOSAwWiIgZmlsbD0iI0ZGRDIzRCIvPgo8cGF0aCBpZD0iUmVjdGFuZ2xlIDI0MSIgZD0iTTEzNSAwSDE0NEwxNDMgMkgxMzRMMTM1IDBaIiBmaWxsPSIjRUQ0RTRFIi8+CjxwYXRoIGlkPSJSZWN0YW5nbGUgMjQyIiBkPSJNMTUxIDBIMTYwTDE1OSAySDE1MEwxNTEgMFoiIGZpbGw9IiNGRkQyM0QiLz4KPHBhdGggaWQ9IlJlY3RhbmdsZSAyNDMiIGQ9Ik0xNjcgMEgxNzZMMTc1IDJIMTY2TDE2NyAwWiIgZmlsbD0iI0VENEU0RSIvPgo8cGF0aCBpZD0iUmVjdGFuZ2xlIDI0NCIgZD0iTTE4MyAwSDE5MkwxOTEgMkgxODJMMTgzIDBaIiBmaWxsPSIjRkZEMjNEIi8+CjxwYXRoIGlkPSJSZWN0YW5nbGUgMjQ1IiBkPSJNMTk5IDBIMjA4TDIwNyAySDE5OEwxOTkgMFoiIGZpbGw9IiNFRDRFNEUiLz4KPHBhdGggaWQ9IlJlY3RhbmdsZSAyNDYiIGQ9Ik0yMTUgMEgyMjRMMjIzIDJIMjE0TDIxNSAwWiIgZmlsbD0iI0ZGRDIzRCIvPgo8cGF0aCBpZD0iUmVjdGFuZ2xlIDI0NyIgZD0iTTIzMSAwSDI0MEwyMzkgMkgyMzBMMjMxIDBaIiBmaWxsPSIjRUQ0RTRFIi8+CjxwYXRoIGlkPSJSZWN0YW5nbGUgMjQ4IiBkPSJNMjQ3IDBIMjU2TDI1NSAySDI0NkwyNDcgMFoiIGZpbGw9IiNGRkQyM0QiLz4KPHBhdGggaWQ9IlJlY3RhbmdsZSAyNTAiIGQ9Ik0yNjMgMEgyNzJMMjcxIDJIMjYyTDI2MyAwWiIgZmlsbD0iI0VENEU0RSIvPgo8cGF0aCBpZD0iUmVjdGFuZ2xlIDI1MiIgZD0iTTI3OSAwSDI4OEwyODcgMkgyNzhMMjc5IDBaIiBmaWxsPSIjRkZEMjNEIi8+CjxwYXRoIGlkPSJSZWN0YW5nbGUgMjU0IiBkPSJNMjk1IDBIMzA0TDMwMyAySDI5NEwyOTUgMFoiIGZpbGw9IiNFRDRFNEUiLz4KPHBhdGggaWQ9IlJlY3RhbmdsZSAyNTYiIGQ9Ik0zMTEgMEgzMjBMMzE5IDJIMzEwTDMxMSAwWiIgZmlsbD0iI0ZGRDIzRCIvPgo8cGF0aCBpZD0iUmVjdGFuZ2xlIDI1OCIgZD0iTTMyNyAwSDMzNkwzMzUgMkgzMjZMMzI3IDBaIiBmaWxsPSIjRUQ0RTRFIi8+CjxwYXRoIGlkPSJSZWN0YW5nbGUgMjYwIiBkPSJNMzQzIDBIMzUyTDM1MSAySDM0MkwzNDMgMFoiIGZpbGw9IiNGRkQyM0QiLz4KPC9nPgo8L2c+CjwvZz4KPC9zdmc+Cg==);
	}
	.goods-box {
		padding: 4.2667vw 5vw;
	}
	.goods-box .goods-text view {
		width: 100%;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.goods-box .goods-text .name {
		color: #222;
		font-weight: bold;
	}
	.goods-box .goods-text {
		font-size: 26rpx;
		color: #666;
		line-height: 1.8;
		width: 40vw;
	}
	.goods-box .num{
		font-size:0.26rem;
	}
	.goods-box image {
		width: 20.2667vw;
		height: 20.2667vw;
		border-radius: 2.133vw;
		margin-right: 3.4667vw;
	}
	.goods-box {
		margin-bottom: 3.733vw;
		justify-content: flex-start;
	}
	.order-brief .order-desc {
		color: #222;
		font-size: 25rpx;
	}
	.order-brief .timer text {
		color: #C3381E;
		margin-right: .8vw;
	}
	.order-brief .timer {
		font-size: 25rpx;
	}
	.order-brief .status {
		color: #000;
		font-size: 40rpx;
		margin-bottom: .8vw;
		font-weight: bold;
	}
	.order-brief {
		margin-bottom: 3.2vw;
	}
	.box {
		background-color: #fff;
		border-radius: 2.1333vw;
		overflow: hidden;
		margin-bottom: 3.2vw;
	}
	.container {
		padding-top: 26.9333vw;
		margin: 0 4vw;
		color: #222;
	}
	.page-bg {
		width: 100vw;
		height: 69vw;
		position: absolute;
		top: 0;
		left: 0;
		background: linear-gradient(180deg, #FFD23D 58%, rgba(255,210,61,0) 100%);
		z-index: -1;
	}
	.bottom-bar-inner .flex .link{
		margin-left: 3.2vw;
	}
	.bottom-bar .cancel-btn {
		padding: 0 6.4vw;
		height: 10.667vw;
		background-color: #eee;
		color: #999;
		font-size: 32rpx;
		border-radius: 1.0667vw;
	}
	.bottom-bar .buy-btn {
		padding: 0 8.8vw;
		height: 10.667vw;
		background-color: #222;
		color: #FFD23D;
		font-size: 32rpx;
		border-radius: 1.0667vw;
	}
	.bottom-bar .buy-btn-box {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.bottom-bar .bottom-bar-inner {
		height: 14.66667vw;
		padding: 0 4vw;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100vw;
		box-sizing: border-box;
		background-color: #fff;
		border-top: 0.1rpx solid #F4F4F4;
		color: #222;
		z-index: 999;
	}
</style>
