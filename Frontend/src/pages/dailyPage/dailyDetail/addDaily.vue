<template>
	<view class="content">
		<view class="logo">
			<image src="@/static/img/cartoon.png" mode=""></image>
		</view>

		<u-datetime-picker
                :show="show"
				@confirm="pickDate"
				@cancel="show=false"
                mode="date"
				:previewFullImage="true"
        ></u-datetime-picker>
		<view class="my-form">
				<view class="nav">
			<text @click="onSubmit" style="padding-right: 10px; font-size:14px;
					color: #e06666;">保存</text>
			<text @click="onCancle" style="font-size:10.5px;">取消</text>
		</view>
			<u--input
				style="font-weight:bold;"
				placeholder="请输入标题"
				v-model="formData.title"
				border="bottom"
			></u--input>
			<view class="date" @click="show = true">
				<image src="/static/icon/clender.svg" mode="aspectFit" style="width:15px;height:15px;"></image>
				<text style="padding-left:2px">
					{{$u.timeFormat(formData.create_time, 'yyyy/mm/dd')}}
				</text>
			</view>
			<u--textarea placeholder="请输入内容" v-model="formData.content" border="none"></u--textarea>
			<view class="cover">			
				<u-upload
					:fileList="fileList1"
					@afterRead="afterRead"
					@delete="deletePic"
					name="1"
					multiple
					:maxCount="1"
				></u-upload></view>
			<uni-icons class="delIcon" @click="deleteDaily(index)" type="trash" size="20" color="red"></uni-icons>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				daily_id:'',
				pet_id:'',
				show:false,
				name:"hello",
				formData:{
					user_id:123,
					title:"",
					content:'',
					create_time:'',
					cover:'',
					pet_id:'',
				},
				fileList1:[]
			}
		},
		onLoad:function(e){
			if(e.dailyId)
			{
				this.daily_id = e.dailyId
				uni.request({
					url: 'http://localhost:3001/api/getDaily',
					method: 'GET',
					data: {
						daily_id:e.dailyId
					},
					success: res => {
						this.formData = {...res.data[0]}
						this.formData.user_id = 123
						this.pet_id = this.formData.pet_id
						this.formData.create_time = new Date(this.formData.create_time)
						this.fileList1.push({url:this.formData.cover})
						uni.hideLoading();
					},
					fail: () => {},
					complete: () => {}
				});
			}
			else{
				this.formData.pet_id = e.pet_id
				console.log(e.pet_id)
				this.formData.create_time = this.$u.timeFormat('', 'yyyy/mm/dd')
			}
		},
		methods: {
			pickDate(e){
				this.show=false;
				this.formData.create_time = this.$u.timeFormat(e.value, 'yyyy/mm/dd')
				console.log(this.formData.create_time)
				console.log(e)
			},
			onCancle(e) {
				const me = this;
				uni.showModal({
					title: '警告',
					content: '已编辑内容未保存，是否退出？',
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
				console.log('baocun')
				if(this.formData.title && this.formData.content && this.formData.create_time){
						uni.showToast({
							title: '保存成功',
							duration: 1000,
							position:'top',
						});
						
						if(this.daily_id){
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
				}
			},

			// 图片相关
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			// 新增图片
			async afterRead(event) {
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: 'http://192.168.2.21:7001/upload', // 仅为示例，非真实的接口地址
						filePath: url,
						name: 'file',
						formData: {
							user: 'test'
						},
						success: (res) => {
							setTimeout(() => {
								resolve(res.data.data)
							}, 1000)
						}
					});
				})
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
										daily_id:me.daily_id
									},
									success: res => {
										console.log(res)
										uni.navigateBack({delta:1})
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
	top:-10px;
	left: 10px;
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
	margin:20% auto;
	padding: 20px 21px;
	width: 80%;
	height:350px;
	border: 1.7px solid #75655D;
	border-radius: 14px;
	position:relative;
}
.cover{
	position:absolute;
	bottom:10px;
}
.date{
	display:inline-block;
	border: 1px solid black;
    border-radius: 20px;
    padding: 2px 12px;
	margin:5px 0;
	font-size:12px;
	width:auto;
}
.delIcon{
	position:absolute;
	bottom:15px;
	right:15px;
}
.nav{
	position:absolute;
	top:5px;
	right:10px;
}
</style>
