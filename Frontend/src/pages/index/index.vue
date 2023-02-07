<template>
	<view class="content">
		<view>
			<view class="switch_icon">
				<switch checked color="#FFCE86" />
			</view>
			<div class="remindText">
				<text class="innerText">轻点我的身体，看看可能会出现哪些不适</text>
			</div>
			<view class="main">
				<view class="pet">
					<!-- <view class="display_pet">					
						<image src="../../static/img/dog.png" mode=""></image>
					</view> -->
					<ModelComponent/>
				</view>
				<view class="icon_tab">
					<view class="btn_box">
						<p>疾病查询</p>
						<view class="icon_box">
						<image src="../../static/zhibing.png" class="icon_btn" mode=""></image></view>
					</view>
					<view class="btn_box">
						<p>每日小知识</p>
						<image src="../../static/zhishi.png" class="icon_btn" mode=""></image>
					</view>
					<view class="btn_box">
						<p>添加提醒</p>
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
				title: '这里是首页'
			}
		},
		components:{
			ModelComponent,
		},
		onLoad() {

		},
		methods: {

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
	.remindText{
		width:250px;
		height:200px;
		background-image: url("../../static/img/yun.png");
		background-size: cover;
		background-repeat: no-repeat;
		position: absolute;
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
	.main{
		overflow: hidden;
		.pet{
			width:100%;
			// height: 500px;
			margin-top:100px;
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
			bottom: 10px;
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
</style>
