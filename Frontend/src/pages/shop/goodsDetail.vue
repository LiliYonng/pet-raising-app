<template>
	<view class="page-content" :style="'padding-bottom: calc(15vw + '+safeBottom+'px)'" v-if="goodsInfo.name">
        <view :class="'popup-container'+(popupShow?' show':'')">
			<view class="mask" @click="closePopup"></view>
			<view class="popup">
				<image class="link close-btn" src="/static/goods/popup-close.svg" mode="aspectFit" @click="closePopup"></image>
				<view class="popup-header flex">
					<image :src="goodsInfo.cover" mode="aspectFit" ></image>
					<view class="popup-info">
						<view class="info-price flex">¥<text style="font-size: 75rpx;">{{goodsInfo.price}}</text></view>
						<view class="info-spec">{{specText ? specText :'请选择：地址、颜色、尺码' }}</view>
					</view>
				</view>
                <view class="addr-box flex box link" @click="pickAddr()">
                        <image src="/static/goods/addr.svg" mode="aspectFit" class="icon"></image>
                        <view class="addr-info">
                            <block v-if="addr.sendName">
                                <view>{{addr.sendName}} {{addr.sendTel.substr(0,3)}}*****{{addr.sendTel.substr(8,3)}}</view>
                                <text>{{addr.sendRegion}}{{addr.sendAddr}}</text>
                                </block>
                                <block v-else>
                                <view>收货地址</view>
                                <text>请选择地址</text>
                            </block>
                        </view>
                    <image src="/static/goods/arrow-right.svg" mode="aspectFit" class="arrow"></image>
                </view>
				<view class="spec-content">
					<view class="spec-row">
						<view class="spec-title">颜色分类</view>
						<view class="spec-list">
							<view v-for="(color,ind) in goodsInfo.color"
                             @click="selectedColor =ind" :class="selectedColor == ind ? 'active' :''">{{color}}</view>
						</view>
                    </view>
                    <view class="spec-row">
						<view class="spec-title">尺码</view>
						<view class="spec-list">
                            <view v-for="(size,ind) in goodsInfo.size"
                             @click="selectedSize =ind" :class="selectedSize == ind ? 'active' :''">{{size}}</view>
						</view>
                    </view>
                    <view class="msg box flex">
                        <view>备注</view>
                        <input placeholder="在这里留下您的备注" v-model="userMsg" placeholder-class="placeholder" type="text" maxlength="128">
                    </view>
                    <view class="num-row flex">
						<view class="num-title">
							<view>租赁数量</view>
							<text>库存{{order.stock ? order.stock : 'xx'}}</text>
						</view>
                        <view class="num-action flex">
                        <image class="link" src="/static/goods/minus.svg" mode="aspectFit" @click="goodsNum > 1 && goodsNum--"></image>
                        <input type="number" v-model="goodsNum" @input="changeNum"  />
                        <image class="link" src="/static/goods/plus.svg" mode="aspectFit"@click="goodsNum < order.stock && goodsNum++"></image>
                        </view>
					</view>
				</view>
				<view class="link confirm-btn" @click="doBuy()">去支付</view>
			</view>
        </view>
        <!-- 底栏 START -->
		<view class="bottom-bar flex" :style="'padding-bottom:'+safeBottom+'px'">
			<view class="bottom-bar-inner flex">
				<view class="flex">
					<view class="bottom-btn link" @click="toService">
						<image src="/static/goods/bottom-service.svg" mode="aspectFit"></image>
						<text>客服</text>
					</view>
					<view class="bottom-btn link fav-icon" @click="favGoods">
						<image color="red" :src="goodsInfo.faved?'/static/goods/bottom-fav-1.svg':'/static/goods/bottom-fav.svg'" mode="aspectFit"></image>
						<text>{{goodsInfo.faved?'已收藏':'收藏'}}</text>
					</view>
				</view>
				<view class="buy-btn flex link" @click="openPopup()">
                立即购买
				</view>
			</view>
		</view>
		<!-- 底栏 END -->
		<swiper class="goods-gallery" @change="bannerChange">
			<swiper-item v-for="(img, index) in goodsInfo.imgs" :key="index">
				<image :src="img" mode="aspectFit"></image>
			</swiper-item>
		</swiper>
		<view class="notification">
			<view class="flex"><image src="/static/goods/zhima-red.svg"></image><text>微信信用 · 600分以上有机会免押</text></view>
		</view>
		<view class="notification-index">{{bannerIndex+1}}/{{goodsInfo.imgs.length}}</view>
		<view class="goods-detail">
			<view class="goods-info-box">
				<view class="flex price-box">
					<view>
						<view class="price">¥<text>{{goodsInfo.priceMin}}</text></view>
						<view class="market-price">¥{{goodsInfo.priceMax}}</view>
					</view>
				</view>
				<view class="flex coupon-box link">
					<view>8折折扣券</view>
					<view class="get-btn flex">领取<image src="/static/goods/arrow-right.svg"></image></view>
				</view>
				<view class="goods-name">
				{{goodsInfo.name}}
					<!-- <rich-text :nodes="goodsInfo.content"></rich-text> -->
				</view>
				<view class="goods-detail-bottom flex">
					<view class="flex"><image src="/static/goods/zhima-badge.svg"></image></view>
					<view><text>官方保障 假一赔十 </text></view>
				</view>
			</view>
			<view class="select-list">
				<view class="select-item flex">
					<view class="label">发货</view>
					<view class="value">广东深圳 17:00前下单，今日顺丰发货</view>
					<image src="/static/goods/arrow-right-gray.svg" mode="aspectFit" style="opacity:0"></image>
				</view>
				<view class="select-item flex">
					<view class="label">参数</view>
					<view class="value">商品名称：AppleiPhone 14 Pro Max</view>
					<image src="/static/goods/arrow-right-gray.svg" mode="aspectFit" style="opacity:0"></image>
				</view>
				<view class="select-item flex">
					<view class="label">保障</view>
					<view class="value">运费险，七天无理由退货...</view>
					<image src="/static/goods/arrow-right-gray.svg" mode="aspectFit" style="opacity:0"></image>
				</view>
			</view>
			<!-- <view class="goods-info-box" v-html="goodsInfo.content">
			</view> -->
		</view>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
                addr: {},
				specText: '',
				safeBottom: 34,
				bannerIndex: 0,
				goodsNum: 1,
                popupShow: false,
				goodsInfo: {
                    content: "<p>iPhone 12简单介绍</p>",
                    cover: "https://g-search2.alicdn.com/img/bao/uploaded/i4/i1/2215425659358/O1CN01MD8wky2J01C8JEOO7_!!2215425659358.jpg_580x580Q90.jpg_.webp",
                    faved: 1,
                    imgs: ['https://g-search2.alicdn.com/img/bao/uploaded/i4/i1/2215425659358/O1CN01MD8wky2J01C8JEOO7_!!2215425659358.jpg_580x580Q90.jpg_.webp'],
                    name: "iPhone 12",
                    priceMax: "88.60",
                    priceMin: "38.80",
                    tags: ["99新", "性价比"],
                    color:['红色','黑色'],
                    size:['80x10cm','60x20cm']
                },
				goodsDesc: {},
				shopInfo: {},
				goodsId:'',
				subSpecsId:0,
				formatPrice:[],
				specsAry:[],
				order:{},
				type:null,
				daysInd:null,
				daysList:['90','180','365'],
				customDays:null,
				showDatePicker:false,
			}
		},
		onReachBottom(){
			if(this.$data.goodsDesc === {}){
				this.loadGoodsDesc();
			} else if(this.$data.shopInfo === {}){
				this.loadShopInfo();
			}
		},
		onLoad(e){
			let safeBottom = 0;
			// if(app.globalData.sysInfo.safeArea){
			// 	safeBottom = app.globalData.sysInfo.safeArea.bottom;
			// } else {
			// 	if(app.globalData.sysInfo.platform == 'ios') safeBottom = 34;
			// }
			// this.$data.safeBottom = safeBottom;
			this.goodsId = e.gid;
			// this.loadGoods();
		},
		methods: {
			loadGoods(){
				this.$api.getGoodsDetail({gid:this.goodsId}).then(res=>{
					this.goodsInfo = res.data
					this.specsAry.length = this.goodsInfo.specs.length
					this.formatPrice = this.goodsInfo.priceMin.split('.')
					this.order.dayPrice = [...this.formatPrice]
				})
			},
			logining(){ 
				if(!app.checkLogin()){ //未登录状态，登录获取token后继续操作
					return this.$refs.showLoginModal.open()
				}else{ //已登录状态，继续操作
					return Promise.resolve()
				}
			},
			loadGoodsDesc(){
				
			},
			loadShopInfo(){
				
			},
            openPopup(){
				this.$data.popupShow = true;
			},
			closePopup(){
				this.$data.popupShow = false;
			},
			doBuy(){
				const ary = this.specsAry.filter(Boolean)
				if(!this.type || ary.length != this.goodsInfo.specs.length)
				{
					uni.showToast({
						title:'请选择规格',
						icon:'fail'
					})
					return
				}
				if(typeof(this.daysInd) != 'number' || (this.daysInd==-1 && !this.customDays)){
					uni.showToast({
						title:'请选择租期',
						icon:'fail'
					})
					return
				}
				if(this.daysInd == -1 && Number(this.customDays) < Number(this.goodsInfo.startDays) )
				{
					uni.showToast({
						title:'租期不得低于起租期'+this.goodsInfo.startDays+'天',
						icon:'fail'
					})
					return
				}
				if(this.order.stock && Number(this.goodsNum) > Number(this.order.stock)){
					uni.showToast({
						title:'超出库存量'+this.order.stock,
						icon:'fail'
					})
					return
				}
				const days = this.daysInd == -1 ? this.customDays :this.daysList[this.daysInd]
				const data = {
					type: this.type,
					stid:this.order.stid,
					gid:this.goodsId,
					num:this.goodsNum,
					days:days,
					goodsName:this.goodsInfo.name,
					cover:this.goodsInfo.cover
				}
				this.logining().then(res=>{
				setTimeout(()=>{
					uni.navigateTo({
						url: '/pages/goods/buy?data='+encodeURIComponent(JSON.stringify(data))
					})
				},500)
				})

			},
			bannerChange(e){
				this.$data.bannerIndex = e.detail.current;
			},
			chooseSpec(row,gsid,title){
				// this.specsAry[row] = gsids
				this.specsAry.splice(row, 1, gsid)
				this.specText += title+' '
				const arr = this.specsAry.filter(Boolean)
				if (arr.length === this.goodsInfo.specs.length)
				{
					this.getStorga()
				}
			},
			getStorga(){
				const str = this.specsAry.join(',')
				this.$api.getOrderData({gsids:str}).then(res=>{
					this.order = res.data
					this.order.dayPrice = this.order.dayPrice ? res.data.dayPrice.split('.') : ''
				})
			},
			favGoods(){
				this.goodsInfo.faved = !this.goodsInfo.faved
				this.$api.toggleFav({gid:this.goodsId}).then(res=>{
					uni.showToast({
						title: res.data,
						icon: 'success',
					})
				})
			},
			toService(){
				uni.switchTab({ url: '/pages/service/index'})
			},
			changeNum(option){
				let value = option.target.value
				if(this.order.stock && Number(value)> Number(this.order.stock)){
					uni.showToast({
						title: '超出库存量',
						icon: 'fail',
					})
					this.$nextTick(()=>{
						this.goodsNum = this.order.stock
					})
				}
			},
			pickDate(){
				this.daysInd=-1
				this.showDatePicker=true
			},
			selectDate(value){
				const date = value[0]
				const now = this.dayjs().format('YYYY-MM-DD')
				const days = this.dayjs(date).diff(now, 'day')
				if((Number(days) < Number(this.goodsInfo.startDays))){
					uni.showToast({
						title: '不能低于最低租期'+this.goodsInfo.startDays,
						icon: 'fali',
						mask: true
					})
				}
				else{
					uni.showToast({
						title: '选择租期为 '+days+' 天',
						icon: 'success',
						mask: true
					})
					this.customDays = days
					this.showDatePicker = false
				}
			}
		}
	}
</script>

<style scoped lang="scss">
.flex{
    display:flex;
    align-items:center;
    justify-content:space-between;
}
.link {
    will-change: opacity;
    opacity: 1;
    transition: all .15s 0s ease;
}
.link:active {
    opacity: .38;
}
.popup .spec-content {
    padding: 4.8vw 0;
    height: calc(100% - 60vw);
    overflow-y: scroll;
    margin-bottom:50vw;
}
.popup .confirm-btn {
    border-radius: 1.0667vw;
    background-color: #222;
    color: #FFD23D;
    font-size: 30rpx;
    height: 10.667vw;
    margin: 2vw auto;
    font-weight: bold;
    width:90%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0;
    position:absolute;
    bottom:5vw;
}
.popup .num-row .num-action image {
    width: 5.333vw;
    height: 5.333vw;
}
.popup .num-row .num-action input {
    width: 10.667vw;
    text-align: center;
    font-weight: bold;
    font-size: 36rpx;
}
.popup .num-row .num-title view {
    font-weight: bold;
    margin-right: 1.0667vw;
    color: #222;
}
.popup .num-row .num-title {
    color: #999;
    font-size: 30rpx;
    display: flex;
    align-items: center;
}
.popup .num-row {
    
}
.popup .spec-row .spec-list view.active {
    border: 1px solid #222;
    font-weight: bold;
    background-position: 101.6% 101.2%;
}
.popup .spec-row .spec-list view {
    height: 10vw;
    padding: 0 2.667vw;
    border: 1rpx solid #e3e3e3;
    border-radius: 1.0667vw;
    font-weight: normal;
    font-size: 26rpx;
    margin-right: 2.667vw;
    margin-bottom: 2.667vw;
    display: inline-flex;
    align-items: center;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTEiIHZpZXdCb3g9IjAgMCAxNiAxMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgaWQ9IkZyYW1lIDE0NDkiPgo8cGF0aCBpZD0iUmVjdGFuZ2xlIDc3MSIgZD0iTTAgNkMwIDIuNjg2MjkgMi42ODYyOSAwIDYgMEgxNlYxMUgwVjZaIiBmaWxsPSIjMjIyMjIyIi8+CjxwYXRoIGlkPSJVbmlvbiIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMyAzLjkyOTRMMTEuOTE2IDNMOC4yNTIxOCA2LjE0MTIxTDYuMDg0MDMgNC4yODI0MUw1IDUuMjExODFMNy4xNjgxNSA3LjA3MDZMOC4yNTIxOCA4TDkuMzM2MiA3LjA3MDZMMTMgMy45Mjk0WiIgZmlsbD0iI0ZGRDIzRCIvPgo8L2c+Cjwvc3ZnPgo=);
    background-position: 101.6% 150%;
    background-size: 4.267vw;
    background-repeat: no-repeat;
    transition: all 0.3s 0s ease;
    justify-content: center;
    min-width: 14vw;
    box-sizing: border-box;
}
.popup .spec-row .spec-list view:last-child {
    margin-right: 0;
}
.popup .spec-row .spec-list .customInput{
    border:none;
    border-top: 1rpx solid #e3e3e3;
    border-radius: 1.0667vw;
    width:5vw;
    margin:0;
    padding:0
}
.popup .spec-row .spec-title {
    font-weight: bold;
    font-size: 30rpx;
    margin-bottom: 2.667vw;
}
.popup .spec-row {
    margin-bottom: 4.333vw;
}
.popup .popup-header image {
    width: 20.2667vw;
    height: 20.2667vw;
    margin-right: 3.4666vw;
    border-radius: 2.1333vw;
}
.popup .popup-header .popup-info .info-spec {
    font-size: 28rpx;
    margin-top: 1vw;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 66vw;
    white-space: nowrap;
}
.popup .popup-header .popup-info .info-price text {
    font-size: 55rpx;
    /* margin: 0 .75vw; */
}
.popup .popup-header .popup-info .info-price view:after {
    content: '';
    display: block;
    width: 95%;
    height: 1.6vw;
    background-color: #FFD23D;
    margin: 0 auto;
    margin-top: -3.28vw;
    position: static;
}
.popup .popup-header .popup-info .info-price {
    color: #000;
    font-size: 32rpx;
    font-weight: bold;
    justify-content: flex-start;
    align-items: baseline;
}
.popup .popup-header .popup-info {
    
}
.popup .popup-header {
    justify-content: flex-start;
    padding-bottom: 4.8vw;
    border-bottom: 0.2rpx solid #FAFAFA;
}
.popup .close-btn {
    width: 4.2667vw;
    height: 4.2667vw;
    position: absolute;
    right: 5.333vw;
    top: 5.333vw;
}
.popup-container .mask {
    background-color: rgba(0,0,0,0.5);
    width: 100%;
    height: 100%;
}
.popup-container.show .popup {
    top: 32.2667vw;
}
.popup-container .popup {
    top: 100vh;
    border-radius: 4.2667vw 4.2667vw 0 0;
    width: 100%;
    height: calc(100vh - 32.2667vw);
    background-color: #fff;
    position: absolute;
    padding: 6.1333vw 4.5333vw;
    color: #222;
    box-sizing: border-box;
    transition: top 0.3s 0s ease-out;
    overflow: hidden;
}
.popup-container {
    width: 100vw;
    height: 100vh;
    z-index: -1;
    position: fixed;
    opacity: 0;
    transition: all 0.3s 0s ease;
}
.popup-container.show {
    z-index: 9999;
    transition: opacity 0.3s 0s ease;
    opacity: 1;
}
.bottom-bar .buy-btn text {
    margin: 0 2vw;
    font-weight: normal;
    font-size: 20rpx;
}
.bottom-bar .buy-btn {
    padding: 0 10.667vw;
    height: 10.667vw;
    background-color: #fbbc60;
    border-radius:10rpx;
    color: #fff;
    font-size: 34rpx;
    font-weight:500;
    border-radius: 10vw;
}
.bottom-bar .bottom-btn text {
    font-size: 22rpx;
    color: #222;
}
.bottom-bar .bottom-btn image {
    width: 6.4vw;
    height: 6.4vw;
}
.bottom-bar .bottom-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 7.5vw;
}
.bottom-bar .bottom-btn.fav-icon{
    width: 12vw;
    text-align: center;
}
.bottom-bar .bottom-bar-inner {
    height: 14.66667vw;
    padding: 0 4vw;
    width: 100%;
}
.bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    box-sizing: border-box;
    background-color: #fff;
    border-top: 0.1rpx solid #F4F4F4;
    z-index: 999;
}
.goods-info-title {
    font-weight: bold;
    font-size: 30rpx;
    color: #222;
    margin-bottom: 2vw;
}
.select-list {
    font-size: 28rpx;
    color: #222;
    border-radius: 2.1333vw;
    background-color: #fff;
    margin-bottom: 3.2vw;
}
.select-list .select-item {
    height: 13.333vw;
    padding: 0 4.2666vw;
    border-bottom: .1333vw solid #F8F8F8;
}
.select-list .select-item:last-child {
    border-bottom: 0;
}
.select-list .select-item .label {
    font-weight: bold;
}
.select-list .select-item .value {
    width: 64.2666vw;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.select-list .select-item image {
    width: 3.2vw;
    height: 3.2vw;
}
.goods-detail-bottom image {
    width: 15.7333vw;
    height: 4.8vw;
    margin-right: 3vw;
}
.goods-detail-bottom {
    font-size: 24rpx;
    color: #999;
}
.goods-name {
    margin: 2.4vw 0;
    color: #222;
    font-size: 35rpx;
    font-weight: bold;
}
.coupon-box image {
    width: 3.2vw;
    height: 3.2vw;
}
.coupon-box .get-btn {
    font-weight: normal;
}
.coupon-box {
    margin-top: 2.1333vw;
    height: 8.5333vw;
    padding-left: 4.6vw;
    padding-right: 2.9333vw;
    font-weight: bold;
    font-size: 26rpx;
    color: #ED8240;
    background: linear-gradient(260deg, #FBF6E6 0%, #FBE7E8 100%);
    border-radius: 1.066vw;
}
.price-box {
    color: #000;
}
.market-price {
    color: #999;
    margin-left: 3.466vw;
    text-decoration: line-through;
    display: inline-block;
}
.status-text {
    font-size: 38rpx;
    font-weight: bold;
}
.price {
    font-size: 32rpx;
    display: inline-block;
}
.price text {
    /* margin: 0 .75vw; */
    font-weight: bold;
    font-size: 55rpx;
}
.goods-info-box {
    padding: 2.666vw 3.2vw;
    background-color: #fff;
    border-radius: 1.066vw;
    margin-bottom: 3.2vw;
}
.goods-detail {
    padding: 2.4vw 4vw;
    background-color: #F8F8F8;
}
swiper,
swiper-item {
    height: auto;
}
.notification-index {
    margin-top: -8.4vw;
    padding: 1vw 2.666vw;
    right: 3.4666vw;
    display: inline;
    background: rgba(255,255,255,0.5);
    font-size: 0.26rem;
    font-weight: bold;
    color: #C2982A;
    float: right;
    border-radius: 5.8666vw;
    z-index: 99;
    position: relative;
}
.notification view image {
    width: 5.333vw;
    height: 5.333vw;
    margin-right: 1.4vw;
}
.notification {
    height: 10.666vw;
}
.notification view {
    padding: 0 4.2666vw;
    color: #ED8240;
    font-size: 28rpx;
    height: 10.666vw;
    background: linear-gradient(260deg, #FBF6E6 0%, #FBE7E8 100%);
    justify-content: flex-start!important;
}
.goods-gallery {
    width: 100vw;
    height:88vw;
}
.goods-gallery image {
    width: 100%;
    height: 88vw;
    background-color:#fff;
}
.shop-info{
    background-color: blue;
}
.msg.box {
    padding: 3.46666vw 0;
}
.box{
    background-color: #fff;
    border-radius: 2.1333vw;
    overflow: hidden;
    margin-bottom: 3.2vw;
}
.msg view {
    color: #000;
    font-size: 32rpx;
}
.msg input {
    width: calc(100% - 4em);
    text-align: right;
    font-size: 28rpx;
}
.addr-box image.arrow {
    width: 4.266vw;
    height: 4.266vw;
    margin-right: 3.2vw;
}
.addr-box .addr-info text {
    color: #999;
    font-size: 24rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
}
.addr-box .addr-info view {
    color: #222;
    font-weight: bold;
    font-size: 32rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.addr-box .addr-info {
    width: 70vw;
}
.addr-box {
    padding: 1.8vw 0;
    background-repeat: repeat-x;
    background-size: 150%;
    background-position: 50% 100%;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQ1IiBoZWlnaHQ9IjIiIHZpZXdCb3g9IjAgMCAzNDUgMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgaWQ9Ik1hc2sgR3JvdXAiPgo8ZyBpZD0iR3JvdXAgNTUiPgo8ZyBpZD0iRnJhbWUgMTEyNiI+CjxwYXRoIGlkPSJSZWN0YW5nbGUgMjMzIiBkPSJNNyAwSDE2TDE1IDJINkw3IDBaIiBmaWxsPSIjRUQ0RTRFIi8+CjxwYXRoIGlkPSJSZWN0YW5nbGUgMjM0IiBkPSJNMjMgMEgzMkwzMSAySDIyTDIzIDBaIiBmaWxsPSIjRkZEMjNEIi8+CjxwYXRoIGlkPSJSZWN0YW5nbGUgMjM1IiBkPSJNMzkgMEg0OEw0NyAySDM4TDM5IDBaIiBmaWxsPSIjRUQ0RTRFIi8+CjxwYXRoIGlkPSJSZWN0YW5nbGUgMjM2IiBkPSJNNTUgMEg2NEw2MyAySDU0TDU1IDBaIiBmaWxsPSIjRkZEMjNEIi8+CjxwYXRoIGlkPSJSZWN0YW5nbGUgMjM3IiBkPSJNNzEgMEg4MEw3OSAySDcwTDcxIDBaIiBmaWxsPSIjRUQ0RTRFIi8+CjxwYXRoIGlkPSJSZWN0YW5nbGUgMjM4IiBkPSJNODcgMEg5Nkw5NSAySDg2TDg3IDBaIiBmaWxsPSIjRkZEMjNEIi8+CjxwYXRoIGlkPSJSZWN0YW5nbGUgMjM5IiBkPSJNMTAzIDBIMTEyTDExMSAySDEwMkwxMDMgMFoiIGZpbGw9IiNFRDRFNEUiLz4KPHBhdGggaWQ9IlJlY3RhbmdsZSAyNDAiIGQ9Ik0xMTkgMEgxMjhMMTI3IDJIMTE4TDExOSAwWiIgZmlsbD0iI0ZGRDIzRCIvPgo8cGF0aCBpZD0iUmVjdGFuZ2xlIDI0MSIgZD0iTTEzNSAwSDE0NEwxNDMgMkgxMzRMMTM1IDBaIiBmaWxsPSIjRUQ0RTRFIi8+CjxwYXRoIGlkPSJSZWN0YW5nbGUgMjQyIiBkPSJNMTUxIDBIMTYwTDE1OSAySDE1MEwxNTEgMFoiIGZpbGw9IiNGRkQyM0QiLz4KPHBhdGggaWQ9IlJlY3RhbmdsZSAyNDMiIGQ9Ik0xNjcgMEgxNzZMMTc1IDJIMTY2TDE2NyAwWiIgZmlsbD0iI0VENEU0RSIvPgo8cGF0aCBpZD0iUmVjdGFuZ2xlIDI0NCIgZD0iTTE4MyAwSDE5MkwxOTEgMkgxODJMMTgzIDBaIiBmaWxsPSIjRkZEMjNEIi8+CjxwYXRoIGlkPSJSZWN0YW5nbGUgMjQ1IiBkPSJNMTk5IDBIMjA4TDIwNyAySDE5OEwxOTkgMFoiIGZpbGw9IiNFRDRFNEUiLz4KPHBhdGggaWQ9IlJlY3RhbmdsZSAyNDYiIGQ9Ik0yMTUgMEgyMjRMMjIzIDJIMjE0TDIxNSAwWiIgZmlsbD0iI0ZGRDIzRCIvPgo8cGF0aCBpZD0iUmVjdGFuZ2xlIDI0NyIgZD0iTTIzMSAwSDI0MEwyMzkgMkgyMzBMMjMxIDBaIiBmaWxsPSIjRUQ0RTRFIi8+CjxwYXRoIGlkPSJSZWN0YW5nbGUgMjQ4IiBkPSJNMjQ3IDBIMjU2TDI1NSAySDI0NkwyNDcgMFoiIGZpbGw9IiNGRkQyM0QiLz4KPHBhdGggaWQ9IlJlY3RhbmdsZSAyNTAiIGQ9Ik0yNjMgMEgyNzJMMjcxIDJIMjYyTDI2MyAwWiIgZmlsbD0iI0VENEU0RSIvPgo8cGF0aCBpZD0iUmVjdGFuZ2xlIDI1MiIgZD0iTTI3OSAwSDI4OEwyODcgMkgyNzhMMjc5IDBaIiBmaWxsPSIjRkZEMjNEIi8+CjxwYXRoIGlkPSJSZWN0YW5nbGUgMjU0IiBkPSJNMjk1IDBIMzA0TDMwMyAySDI5NEwyOTUgMFoiIGZpbGw9IiNFRDRFNEUiLz4KPHBhdGggaWQ9IlJlY3RhbmdsZSAyNTYiIGQ9Ik0zMTEgMEgzMjBMMzE5IDJIMzEwTDMxMSAwWiIgZmlsbD0iI0ZGRDIzRCIvPgo8cGF0aCBpZD0iUmVjdGFuZ2xlIDI1OCIgZD0iTTMyNyAwSDMzNkwzMzUgMkgzMjZMMzI3IDBaIiBmaWxsPSIjRUQ0RTRFIi8+CjxwYXRoIGlkPSJSZWN0YW5nbGUgMjYwIiBkPSJNMzQzIDBIMzUyTDM1MSAySDM0MkwzNDMgMFoiIGZpbGw9IiNGRkQyM0QiLz4KPC9nPgo8L2c+CjwvZz4KPC9zdmc+Cg==);
}
.addr-box image.icon {
    width: 8.5333vw;
    height: 8.5333vw;
    margin-right: 0.2vw;
    margin-left: 2.8vw;
}
</style>
