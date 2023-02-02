<template>
	<view class="content">
		<view class="logo">
			<image src="@/static/dog.png" mode=""></image>
		</view>
		<view class="my-form">
			<uni-forms ref="form" :modelValue="formData" label-position="left" labelWidth="100" labelAlign="right" validateTrigger="blur">
				<uni-forms-item name="name" required label="宠物昵称">
						<uni-easyinput type="text" v-model="formData.name" placeholder="请输入爱宠名称" />
				</uni-forms-item>
				<uni-forms-item name="petSpecies" required label="爱宠属性">
						<uni-data-checkbox mode="tag" v-model="formData.petSpecies" :localdata="petSpecies"></uni-data-checkbox>
				</uni-forms-item>
				<uni-forms-item name="sex" label="爱宠性别">
					<uni-data-checkbox mode="default" v-model="formData.sex" :localdata="sex"></uni-data-checkbox>
				</uni-forms-item>
				<uni-forms-item name="weight" label="爱宠体重">
					<view style="display: inline-block; margin-right: 10px;"><uni-number-box v-model="formData.weight" :step="0.1" /></view> kg
				</uni-forms-item>
				<uni-forms-item name="date" label="到家日期">
					<uni-datetime-picker v-model="formData.date" />
				</uni-forms-item>
				<uni-forms-item name="age"  label="出生日">
					<uni-datetime-picker v-model="formData.age" />
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
					name:'',
					owner_id:123,
					weight:0,
					age:'',
					date:'',
					petSpecies:'',
					sex:''
				},
				petSpecies: [{
					text: '修猫咪',
					value: 0
				}, {
					text: '修狗狗',
					value: 1
				}, {
					text: '未知',
					value: 2
				}],
				sex: [{
					text: '小王子',
					value: 0
				}, {
					text: '小公主',
					value: 1
				}, {
					text: '未知',
					value: 2
				}],
				  rules:{
					  name:{
						  rules:[{required:true,errorMessage:'需要给宝贝起个名字哦'}]
					  },
					  petSpecies:{
						  rules:[{
							  required:true,
							  errorMessage:'属性不能为空'
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
					content: '内容尚未保存，是否退出？',
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
						if(this.formData.pet_id){
							uni.request({
									url: 'http://localhost:3001/api/editPet',
									method: 'post',
									data: {
										petInfo:this.formData
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
									url: 'http://localhost:3001/api/addPet',
									method: 'post',
									data: {
										petInfo:this.formData
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
	padding: 20px 10px;
	width: 90%;
	border: 1.7px solid #75655D;
	border-radius: 14px;
}
</style>
