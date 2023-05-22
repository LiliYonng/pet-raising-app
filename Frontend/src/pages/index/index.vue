<template>
	<view class="content">
		<view>
			<view class="switch_icon">
				<switch checked color="#FFCE86" />
			</view>
			<view>
				<view class="remindBox" v-if="showRemind">
					<view class="box1" v-if="showBox==1">
						<view class="boxText">{{boxData.boxText}}</view>
						<view class="btnBox">
							<span class="btn" v-for="(item,index) in boxData.btnAry" @click="selectBtn(index)">{{item.btnText}}</span>
						</view>
					</view>
					<view class ="box2" v-else-if="showBox==2">
					<view class="selectedBtn">{{selectedItem.btnText}}</view>
					<view class="detailText">{{selectedItem.detailText}}</view>
					<view class="link" @click="toLink">->查看相关文章</view>
					</view>
				</view>
				<view class="promptInfo" v-else>
					<text class="innerText">轻点我的身体，看看可能会出现哪些不适</text>
				</view>
			</view>
			<view class="main">
				<view class="pet">
					<!-- <view class="display_pet">					
						<image src="../../static/img/dog.png" mode=""></image>
					</view> -->
					<ModelComponent @showText="showText"></ModelComponent>
				</view>
				<view class="icon_tab">
					<view class="btn_box">
						<p>疾病查询</p>
						<view class="icon_box">
						<image src="../../static/zhibing.png" class="icon_btn" mode=""></image></view>
					</view>
					<view class="btn_box" @click="toNews()">
						<p>每日小知识</p>
						<image src="../../static/zhishi.png"  @click="toNews" class="icon_btn" mode=""></image>
					</view>
					<view class="btn_box" @click='toShop()'>
						<p>购买用具</p>
						<image src="../../static/add.png" class="icon_btn" mode=""></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import ModelComponent from 'common/ModelComponent.vue'
	export default {
		data() {
			return {
				title: '这里是首页',
				firstShow:true,
				showRemind:false,
				showBox:false,
				selectedItem:{},
				boxData:{},
				duziData:{
					boxText:"狗狗在腹部不适时常做“下犬式”的趴伏动作以减缓不适。常见的症状有：",
					btnAry:[
					{
						btnText:"胀大",
						detailText:"腹部胀大常见原因：1.狗狗饭后消化不良：需要避免过多肉类、面食类进食，考虑是否更换狗粮。2.腹水：触摸狗狗腹部有液体波动且狗狗进食活动大幅减少，需要及时送医检查治疗"
					},
					{
						btnText:"疼痛",
						detailText:"腹部疼痛常见原因：1.狗狗饭后消化不良：需要避免过多肉类、面食类进食，考虑是否更换狗粮。2.腹水：触摸狗狗腹部有液体波动且狗狗进食活动大幅减少，需要及时送医检查治疗"
					},
					{
						btnText:"其他",
						detailText:"常见其他原因：1.狗狗饭后消化不良：需要避免过多肉类、面食类进食，考虑是否更换狗粮。2.腹水：触摸狗狗腹部有液体波动且狗狗进食活动大幅减少，需要及时送医检查治疗"
					}
					
					]
				},
				faceData:{
					boxText:"狗狗脸部肿胀变形或发红等症状，常见原因有：",
					btnAry:[
					{
						btnText:"感染",
						detailText:"狗狗脸部感染细菌会导致脸部肿胀，可以处理以下措施进行缓解：1.配合抗生素进行治疗，2.挤出脓液。3.情况严重及时送医"
					},
					{
						btnText:"过敏",
						detailText:"狗狗过敏会导致脸部肿胀或发红，可以处理以下措施进行缓解：1.清查过敏源，对最近更换的玩具或食品进行排查 2.根据过敏程度及时送医"
					},
					{
						btnText:"发炎",
						detailText:"狗狗脸部发炎会导致脸部肿胀：1.狗狗饭后消化不良：需要避免过多肉类、面食类进食，考虑是否更换狗粮。2.腹水：触摸狗狗腹部有液体波动且狗狗进食活动大幅减少，需要及时送医检查治疗"
					}
					
					]
				},
				legData:{
					boxText:"狗狗腿部不适的常见的症状有：",
					btnAry:[
					{
						btnText:"无力",
						detailText:"腹部胀大常见原因：1.狗狗饭后消化不良：需要避免过多肉类、面食类进食，考虑是否更换狗粮。2.腹水：触摸狗狗腹部有液体波动且狗狗进食活动大幅减少，需要及时送医检查治疗"
					},
					{
						btnText:"僵直",
						detailText:"腹部疼痛常见原因：1.狗狗饭后消化不良：需要避免过多肉类、面食类进食，考虑是否更换狗粮。2.腹水：触摸狗狗腹部有液体波动且狗狗进食活动大幅减少，需要及时送医检查治疗"
					},
					{
						btnText:"其他",
						detailText:"常见其他原因：1.狗狗饭后消化不良：需要避免过多肉类、面食类进食，考虑是否更换狗粮。2.腹水：触摸狗狗腹部有液体波动且狗狗进食活动大幅减少，需要及时送医检查治疗"
					}
					
					]
				}
			}
		},
		components:{
			ModelComponent,
		},
		onLoad() {

		},
		onHide(){
			this.$children[0].cancleAnimation()
			this.firstShow = false;
		},
		onShow(){
			if(!this.firstShow)
			this.$children[0].activeAnimation()
		},
		methods: {
			showText(type){
					if(!type){
						this.showRemind = false;
						return;
					}
					this.showRemind = true
					this.showBox = 1
					if(type == 'face'){
						this.boxData = {...this.faceData}
					}
					else if(type == 'leg')
						this.boxData = {...this.legData}
					else if (type == 'duzi')
						this.boxData = {...this.duziData}
			},
			selectBtn(ind){
				this.showBox = 2
				this.selectedItem = this.boxData.btnAry[ind]
			},
			toLink(){
				uni.navigateTo({
					url: '../newsPage/info/info?newsid='+10011
				});
			},
			toNews(){
				console.log('tonews')
				uni.navigateTo({
					url: '../newsPage/newsPage'
				});
			},
			toShop(){
				console.log('toshop')
				uni.switchTab({ url: '/pages/shop/shop' })
			}
		}
	}
</script>

<style lang="scss">
	.content{
		// background-color: #FFF8EB;
	}
	.switch_icon{
		position: absolute;
		z-index: 100;
		top:20px;
		left:10px;
	}
	.main{
		// overflow: hidden;
		.pet{
			width:100%;
			// height: 500px;
			margin-top:250px;
			// background: url("../../static/img/dog.png");
			// background-size: cover;
			.display_pet{
				width: 100%;
				height: 100%;
				border-radius: 50%;
				background-color: #FFF8EB;
			}
			image{
				margin-left: -50px;
				margin-top:50px;
				width: 500px;
				height: 250px;
			}
		}
		.icon_tab{
			display: flex;
			position: absolute;
			bottom: 50px;
			width: 100%;
			border-radius: 2px;
			justify-content: space-around;
			align-items: center;
			.btn_box{
				color: #a7a7a7;
				text-align: center;
			}
			.icon_btn{
				width: 32px;
				height: 32px;
			}
		}
	}
  .remindBox{
    position: absolute;
    width: 293px;
    height: 130px;
    left: 54px;
    top: 104px;
    background: rgba(255, 206, 134, 0.47);
    border: 1px solid #FFFFFF;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 50px;
    color: rgba(39, 39, 39, 0.67);
  }
  .boxText{
    padding:20px 20px 5px 20px;
  }
  .btnBox{
    display:flex;
    align-items:center;
    justify-content:space-around;
  }
  .btn{
    text-align:center;
    background: #FBCF8E;
    border: 2px solid #FFEFD7;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    color:#fff;
    border-radius: 50px;
    width: 52px;
    height: 30px;
  }
  .selectedBtn{
    margin-left:20px;
    width: 89px;
    height: 27px;
    text-align:center;
    background: #FBCF8E;
    border: 2px solid #FFEFD7;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    color:#fff;
    border-radius: 50px;
  }
  .detailText{
    font-size: 12px;
    line-height: 17px;
    color: #686868;
    padding:10px 10px;
  }
  .link{
    position: absolute;
    right:20px;
    bottom: 10px;
    font-size: 10px;
    line-height: 14px;
    text-decoration-line: underline;
    color: rgba(255, 174, 55, 0.86);
  }
  	.promptInfo{
		width:250px;
		height:200px;
		background-image: url("/static/img/yun.png");
		background-size: cover;
		background-repeat: no-repeat;
		position: absolute;
		top:30px;
		.innerText{
			position: absolute;
			font-size: 0.8em;
			top:50%;
			left:20%;
			display: inline-block;
			color:#a7a7a7;
			width: 150px;
			text-align: center;
		}
	}
</style>
