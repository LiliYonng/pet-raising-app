<template>
	<view class="content">
			<view class="bg-div">
				<v-tabs class="pet-tab" v-model="current" :tabs="tabs" :pills="true" bgColor="#FFCE86" line-height="0" pillsColor="#d89635" activeColor="#fff" @change="changeTab"></v-tabs>
				<view class="pet-wrap">
					<view class="pet-info">
						<image :src="petImg[currentPet.petSpecies]" class="pet-img img" mode=""></image>
						<view class="info-text">
							<h3>{{currentPet.name}}</h3>
							<p>{{species[currentPet.petSpecies]}}  {{currentPet.age ? new Date(currentPet.age).getDay() : 'n'}}个月啦 {{currentPet.weight}}kg</p>
						</view>
					</view>
					<div class="days-info">和{{currentPet.name}}的第{{currentPet.date ? new Date(currentPet.date).getDay() : 123}}天啦~</div>
				</view>
			</view>
			<view class="main">
				<view class="reminder">
					<header class="my-header">
						<p class="title">健康提醒</p>
						<image src="../../static/icon/addition.png" mode="" @tap="setRemind"></image>
					</header>
					<scroll-view class="reminder-list" scroll-x="true" @scroll="scroll" scroll-left="120">
						<view id="demo1" class="list-item" v-for="(item,index) in remindList" :Key="item.remind_id">
							<view class="item-info">
								<image :src="iconList[item.category]" class="reminder-img" mode=""></image>
								<view class="info-text">
									<uni-dateformat class="remind-time":date="item.dateTime" format="yy/MM/dd" :threshold="[0, 3600000000000]"></uni-dateformat>
									<p class="remind-content">{{item.content}}</p>
								</view>
								<view class="icon_box">
									<icon v-if="item.done"type="success" size=20 color="rgb(178,172,172)" class="todo-icon" @click="changeTodo(index)"></icon>
									<icon v-else type="success" size=20 color="#FFCE86" class="todo-icon" @click="changeTodo(index)"></icon>
									<icon type="clear" size=20 color="rgb(178,172,172)" class="clear-icon" @click="clearItem(index)"></icon>
								</view>
								
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="record">
					<header class="my-header">
						<p class="title">2022年</p>
						<p class='p_text' @click="addDaily">添加记录</p>
					</header>
					<view class="record-list">
						<view class="list-item" v-for="(item,index) in recordList" :key="item.daily_id">
							<view class="date">
								<uni-dateformat style="display: block; margin-bottom: 10px;" :date="item.create_time" format="MM/dd" :threshold="[0,0]"></uni-dateformat>
								<uni-icons @click="editDaily(item.daily_id)" type="compose" size="20" color="orange"></uni-icons>
								<uni-icons @click="deleteDaily(index)" type="trash" size="20" color="red"></uni-icons>
								
							</view>
							<view class="record-info">
								<div class="info-text">
									<h3 class="head">{{item.title}}</h3>
									<p class="content">{{item.content}}</p>
								</div>
								<image :src="item.cover" style="width:52px; height:52px;"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				iconList:['../../static/icon/addition.png','../../static/icon/xizao.png','../../static/icon/yimiao.png'],
				remindList:[],
				recordList:[],
				current: 0,
				currentPet:{},
				tabs: [],
				petList:[],
				species:[
					'修猫咪',
					'修狗狗',
					'爱宠'
				],
				petImg:[
					'../../static/cat.png',
					'../../static/dog.png',
					'../../static/more.png'
				],
			}
		},
		onShow() {
			this.getPet()
			this.getAllRemind();
			this.getAllRecord();
		},
		methods: {
			    changeTab(index) {
					this.currentPet = this.petList[index];
			    },
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
							this.tabs = this.petList.map((item)=>{
								return item.name;
							})
							this.currentPet = this.petList[0];
							console.log(res.data)
							uni.hideLoading();
						},
						fail: () => {},
						complete: () => {}
					});
				},
			getAllRemind() {
				uni.request({
					url: 'http://localhost:3001/api/getAllRemind',
					method: 'GET',
					data: {},
					success: res => {
						console.log(res.data)
						this.remindList=res.data;
						uni.hideLoading();
					},
					fail: () => {},
					complete: () => {}
				});
			},
			getAllRecord() {
				uni.request({
					url: 'http://localhost:3001/api/getAllRecord',
					method: 'GET',
					data: {},
					success: res => {
						console.log(res.data)
						this.recordList=res.data;
						uni.hideLoading();
					},
					fail: () => {},
					complete: () => {}
				});
			},
			setRemind() {
				uni.navigateTo({
					url: './setRemind/setRemind'
				});
			},
			addDaily() {
				uni.navigateTo({
					url: './dailyDetail/addDaily'
				});
			},
			changeTodo(index) {
				this.remindList[index].done = !this.remindList[index].done;
				this.updateItem(index)
				uni.showToast({
					title: '设置成功',
					duration: 500,
					position:'top',
				});
			},
			clearItem(index) {
				const me = this;
				uni.showModal({
					title: '警告',
					content: '确认是否删除？',
					confirmColor: 'red',
					confirmText:'确认',
					cancelText:'取消',
					success: function (res) {
						if (res.confirm) {
							me.deleteItem(index)
							me.remindList.splice(1,index)
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			updateItem(index) {
				uni.request({
					url: 'http://localhost:3001/api/updateRemindList',
					method: 'post',
					data: {
						item:this.remindList[index]
					},
					success: res => {
						console.log(res)
						this.getAllRemind()
						uni.hideLoading();
					},
					fail: () => {},
					complete: () => {}
				});
			},
			deleteItem(index) {
				uni.request({
						url: 'http://localhost:3001/api/deleteRemindItem',
						method: 'post',
						data: {
							remind_id:this.remindList[index].remind_id
						},
						success: res => {
							console.log(res)
							this.getAllRemind()
							uni.hideLoading();
						},
						fail: () => {},
						complete: () => {}
					});
			},
			editDaily(id) {
				uni.navigateTo({
					url: './dailyDetail/addDaily?dailyId='+id
				});
			},
			deleteDaily(index) {
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
									url: 'http://localhost:3001/api/deleteDaily',
									method: 'post',
									data: {
										daily_id:me.recordList[index].daily_id
									},
									success: res => {
										console.log(res)
										me.getAllRecord()
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
			}
	}
	}
</script>

<style lang="scss">
.bg-div{
	/* Rectangle 63 */
	display: inline-block;
	width: 100%;
	height: 233px;
	background: #FFCE86;
	border-radius: 0px 0px 32px 47px;
}
.pet-tab{
    margin-top: 10%;
	padding:0 10px;
	width:80%;
}
.pet-wrap{
	margin-top:10px;
	margin-left:5%;
	padding-left: 10%;
    width: 80%;
    border-radius: 20px;
    height: 150px;
    background-color: #fff;
	box-shadow: 0px 4px 21px #E5EEF1;
	overflow: hidden;
	.pet-info{
		display: flex;
		align-items: center;
		margin-top: 15%;
	}
	.days-info{
		margin-top:15px;
		background: #FFE6D5;
		border-radius: 34px;
		display: inline-block;
		width: 80%;
		padding:10px 15px;
		color: #7B4521;
		font-size: 0.85em;
	}
	.pet-img{
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
		margin-right:50upx;
	}
	.info-text{
		display: inline-block;
	p{
		font-size: 0.8em;
		color: #867D7D;
	}
	}
}
.my-header{
	display: flex;
	justify-content: space-between;
	padding:5px 10px;
	.title{
		font-weight: 600;
		font-size: 18px;
		color:#544F47;
	}
	.p_text{
		border: 1px solid #867D7D;
		padding:2px 5px;
	}
	image{
		cursor: pointer;
		width: 32px;
		height: 32px;
	}
}
.reminder{
	padding: 10px 10px;
	.reminder-list {
		white-space: nowrap;
		width: 100%;
	.list-item {
		display: inline-block;
		text-align: center;
		width: 150px;
		padding: 5px 10px;
			.item-info{
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: row;
				height: 60px;
				background: #FEF9F0;
				box-shadow: 0px 2px 8px #FEE5B6;
				border-radius: 19px;
				color: #936401;
			image{
				width: 32px;
				height: 32px;
				border-radius: 50%;
				margin-right: 10px;
			}
			.icon_box{
				margin-left:10px;
			}
			.clear-icon{
				margin-top:5px;
				display: block;
			}
			.remind-content{
				font-weight: 200;
				color:#9A7A37;
			}
		}
	}
	}
}
.record{
	padding:10px 10px;
	.record-list{
		overflow: hidden auto;
	.list-item{
		width:100%;
		height: 80px;
		overflow: hidden;
		display:flex;
		padding: 10px 0 10px 10px;
		.date{
			display:inline-block;
			margin-right: 10px;
		}
		.record-info{
			padding:15px 10px;
			background-color: #FAEDE2;
			width:250px;
			display:flex;
			justify-content: space-between;
			.info-text{
				display:inline-block;
				width:75%;
				.head{
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					font-size: 14px;
					font-weight: 600;
				}
				.content{
					padding-top:5px;
					 text-indent:2em;
					font-size:13px;
					color:#524641;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				image{
					margin-right: 10px;
				}
			}
		}
	}
	}
	
	
}
</style>
