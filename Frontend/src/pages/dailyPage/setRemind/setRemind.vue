<template>
	<view>
		<view class="logo">
			<image src="@/static/dog.png" mode=""></image>
		</view>
		<view class="my-form">
			<uni-forms ref="form" :modelValue="formData" label-position="left" labelWidth="100" labelAlign="right" validateTrigger="blur">
				<uni-forms-item name="category" label="提醒类型">
					    <uni-data-select
					      v-model="formData.category"
					      :localdata="range"
					    ></uni-data-select>
				</uni-forms-item>
				<uni-forms-item required label="提醒内容" name="content">
					<uni-easyinput type="text" v-model="formData.content" placeholder="请输入内容" />
					</uni-forms-item>
				<uni-forms-item required name="dateTime" label="提醒时间">
					<uni-datetime-picker v-model="formData.dateTime" />
				</uni-forms-item>
			</uni-forms>
		</view>
		
		<button class="subBtn" @click="onSubmit">设置</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name:"hello",
				formData:{
					userId:123,
					category:"",
					content:'',
					dateTime:''
				},
				  range: [
					{ value: 0, text: "日常提醒" },
					{ value: 1, text: "健康提醒" },
					{ value: 2, text: "其他提醒" },
				  ],
				  rules:{
					  content:{
						  rules:[{required:true,errorMessage:'内容不能为空'}]
					  },
					  dateTime:{
						  rules:[{
							  required:true,
							  errorMessage:'时间不能为空'
						  }]
					  }
				  }
			}
		},
		onReady() {
			// 需要在onReady中设置规则
			this.$refs.form.setRules(this.rules)
		},

		methods: {
			onSubmit(e) {
				this.$refs.form.validate().then(res=>{
						uni.showToast({
							title: '设置成功',
							duration: 1000,
							position:'top',
						});
							uni.request({
									url: 'http://localhost:3001/api/setRemind',
									method: 'post',
									data: {
										item:this.formData
									},
									success: res => {
										console.log(res)
										uni.hideLoading();
									},
									fail: () => {},
									complete: () => {
										setTimeout(function() {
											uni.navigateBack({delta:2})
										},1000)
									}
								});
				}).catch(err=>{
					console.log(err)
				})
			}
		}
	}
</script>

<style lang="scss">
.logo{
	text-align: center;
	margin-top: 10%;
	image{
		width: 100px;
		height: 100px;
	}
}
.subBtn{
	background: #FFCE86;
	border-radius: 32px;
	width: 70%;
}
.my-form{
	margin:15% auto;
	padding: 20px 21px;
	width: 280px;
	border: 1.7px solid #75655D;
	border-radius: 14px;
}
</style>
