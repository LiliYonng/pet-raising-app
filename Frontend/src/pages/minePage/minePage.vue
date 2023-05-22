<template>
	<view class="content">
		<view class="bg-div">
			<view class="user-info">
				<image src="http://localhost:8080/Images/userImg.jpg" class="user-img img" mode=""></image>
				<view class="info-text">
					<h3>猫主子</h3>
					<p>我是修猫咪爱好者！</p>
				</view>
			</view>
		</view>
		<view class="main">
			<p class="head">我的宠物</p>
			<view class="pet-list">
				<view class="my-pet" v-for="(item,index) in petList" :key="item.pet_id">
					<view class="pet-info">
						<image :src="petImg[item.petSpecies]" class="pet-img img" mode=""></image>
						<view class="info-text">
							<div class="head-box">
									<text class="pet-name">{{item.name}}</text>
									<uni-icons type="trash" size="15" @click="deletePet(index)"></uni-icons>
							</div>
							<p>{{species[item.petSpecies]}} {{item.age ? new Date(item.age).getDay() : 'n'}}个月</p>
						</view>
					</view>
				</view>
				<view class="my-pet">
					<view class="pet-info">
						<image src="../../static/add.png" class="add-img" mode=""></image>
						<view class="info-text">
							<h3 class="pet-name" @click="addPet">添加宠物</h3>
						</view>
					</view>
				</view>
			</view>
			<view class=setting>
				<view class="setting-item">
					<view class="setting-content">
						<image src="../../static/setting.png" class="setting-icon"mode=""></image>
						<p>账号设置</p>
					</view>
					<image src="../../static/more.png" mode="" class="more-icon"></image>
				</view>
								<view class="setting-item">
					<view class="setting-content">
						<image src="../../static/collect.png" class="setting-icon"mode=""></image>
						<p>我的收藏</p>
					</view>
					<image src="../../static/more.png" mode="" class="more-icon"></image>
				</view>
								<view class="setting-item">
					<view class="setting-content">
						<image src="../../static/zan.png" class="setting-icon"mode=""></image>
						<p>我赞过的</p>
					</view>
					<image src="../../static/more.png" mode="" class="more-icon"></image>
				</view>
								<view class="setting-item">
					<view class="setting-content">
						<image src="../../static/order.png" class="setting-icon"mode=""></image>
						<p>我的订单</p>
					</view>
					<image src="../../static/more.png" mode="" class="more-icon"></image>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				petList:[],
				petImg:[
					'../../static/cat.png',
					'../../static/dog.png',
					'../../static/more.png'
				],
				species:[
					'修猫咪',
					'修狗狗',
					'爱宠'
				],
				sex:[
					'小公主',
					'小王子',
					'保密'
				]
			}
		},
		onShow() {
			this.getPet();
		},
		methods: {
			getPet() {
				uni.showLoading({
					title:"加载中...."
				})
				uni.request({
					url: 'http://localhost:3001/api/getPet',
					method: 'GET',
					data: {},
					success: res => {
						this.petList = res.data;
						console.log(res.data)
						uni.hideLoading();
					},
					fail: () => {},
					complete: () => {}
				});
			},
			deletePet(index) {
				const me = this;
				uni.showModal({
					title: '警告',
					content: '确认是否删除？',
					confirmColor: 'red',
					confirmText:'确认',
					cancelText:'取消',
					success: function (res) {
						if (res.confirm) {
							uni.request({
								url: 'http://localhost:3001/api/deletePet',
								method: 'post',
								data: {
									pet_id:me.petList[index].pet_id
								},
								success: res => {
									console.log(res)
									me.getPet()
									uni.hideLoading();
								},
								fail: () => {},
								complete: () => {}
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			addPet() {
				uni.navigateTo({
					url: './petInfo/petInfo'
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
.img{
	width:100upx;
	height: 100upx;
}
.bg-div{
	/* Rectangle 63 */
	overflow: hidden;
	width: 100%;
	height: 187px;
	background: #FFCE86;
	border-radius: 0px 0px 32px 47px;
}
	
.user-info{
    margin-top: 20%;
	margin-left:5%;
	padding-left: 10%;
    width: 80%;
    border-radius: 20px;
    height: 101px;
    background-color: #fff;
	box-shadow: 0px 4px 21px #E5EEF1;
	display: flex;
	align-items: center;
}
.user-img{
	border-radius: 50%;
	margin-right:50upx;
}
.info-text{
	display: inline-block;
	.head-box{
		display: flex;
		justify-content: space-between;
	}
}
.info-text p{
	font-size: 0.8em;
}
.main{
	padding:6%;
}
.pet-list{
	    flex-wrap: wrap;
	    display: flex;
}
.my-pet{
    display: inline-block;
    margin-top: 20px;
    width: 42%;
    margin-right: 7%;
}
.pet-info{
	display: flex;
	align-items: center;
	justify-content: center;
	height: 60px;
	background: #FEF9F0;
	box-shadow: 0px 2px 8px #FEE5B6;
	border-radius: 19px;
	color: #936401;
}
.pet-info image{
	width: 36px;
	height: 36px;
	border-radius: 50%;
	margin-right: 5px;
}
.pet-name{
	font-size: 0.8em;
	font-weight: 500;
}
.head{
	color:#8a785e;
	font-weight: 600;
	font-size: 1.2em;
}
.setting{
	margin-top: 80upx;
}
.setting-item{
	margin-top:20px;
	display: flex;
	justify-content: space-between;
	background-color: #FFFCF8;
}
.setting-content{
	display: flex;
	justify-content: center;
	align-items: center;
}
.setting-icon{
	height: 36px;
	width: 36px;
	margin-right: 20upx;
}
.more-icon{
	width:36px;
	height: 36px;
}
</style>