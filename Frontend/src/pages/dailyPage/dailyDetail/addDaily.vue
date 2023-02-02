<template>
	<view class="content">
		<view class="logo">
			<image src="@/static/dog.png" mode=""></image>
		</view>
		<view class="my-form">
			<uni-forms ref="form" :modelValue="formData" label-position="left" labelWidth="100" labelAlign="right" validateTrigger="blur">
				<uni-forms-item name="category" required label="日志标题">
						<uni-easyinput type="text" v-model="formData.title" placeholder="请输入标题" />
				</uni-forms-item>
				<uni-forms-item name="cover" label="日志封面">
						<uni-easyinput type="text" v-model="formData.cover" placeholder="图片链接" />
				</uni-forms-item>
				<uni-forms-item required name="create_time" label="记录日期">
					<uni-datetime-picker v-model="formData.create_time" />
				</uni-forms-item>
				<uni-forms-item label="日志内容" name="content">
					<uni-easyinput class="area" type="textarea" v-model="formData.content" placeholder="请输入内容"></uni-easyinput>
				</uni-forms-item>
			</uni-forms>
		</view>
		
		<button class="subBtn" @click="onSubmit">保存</button>
		<button class="cancleBtn" @click="onCancle">取消</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name:"hello",
				formData:{
					user_id:123,
					title:"",
					content:'',
					create_time:'',
					cover:''
				},
				  rules:{
					  title:{
						  rules:[{required:true,errorMessage:'内容不能为空'}]
					  },
					  create_time:{
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
		onLoad:function(e){
			if(e.dailyId)
			{
				uni.request({
					url: 'http://localhost:3001/api/getDaily',
					method: 'GET',
					data: {
						daily_id:e.dailyId
					},
					success: res => {
						this.formData = {...res.data[0]}
						this.formData.user_id = 123
						this.formData.create_time = new Date(this.formData.create_time)
						console.log(res.data[0])
						uni.hideLoading();
					},
					fail: () => {},
					complete: () => {}
				});
			}
		},
		methods: {
			onCancle(e) {
				const me = this;
				uni.showModal({
					title: '警告',
					content: '退出将清空内容，是否退出？',
					confirmColor: 'red',
					confirmText:'确认',
					cancelText:'取消',
					success: function (res) {
						if (res.confirm) {
							uni.navigateBack({delta:1})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			onSubmit(e) {
				this.$refs.form.validate().then(res=>{
						uni.showToast({
							title: '保存成功',
							duration: 1000,
							position:'top',
						});
						if(this.formData.daily_id){
							uni.request({
									url: 'http://localhost:3001/api/editDaily',
									method: 'post',
									data: {
										daily:this.formData
									},
									success: res => {
										uni.hideLoading();
									},
									fail: () => {},
									complete: () => {
										setTimeout(function() {
											uni.navigateBack({delta:1})
										},1000)
									}
								});
						}
						else{
							uni.request({
									url: 'http://localhost:3001/api/addDaily',
									method: 'post',
									data: {
										daily:this.formData
									},
									success: res => {
										uni.hideLoading();
									},
									fail: () => {},
									complete: () => {
										setTimeout(function() {
											uni.navigateBack({delta:1})
										},1000)
									}
								});
						}
				}).catch(err=>{
					console.log(err)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.content{
	height: 100%;
	overflow: hidden;
}

::v-deep .uni-easyinput__content-textarea {
	height:130px;
}

.logo{
	position: absolute;
	z-index: 100;
	text-align: right;
	top:10px;
	right: 10px;
	image{
		width: 50px;
		height: 50px;
	}
}
.subBtn{
	background: #FFCE86;
	border-radius: 32px;
	width: 70%;
}
.my-form{
	margin:20% auto;
	padding: 20px 21px;
	width: 80%;
	border: 1.7px solid #75655D;
	border-radius: 14px;
}
</style>
