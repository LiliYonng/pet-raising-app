<template>
	<view class="content">
		<view class="uni_list">
			<uni-card :title="item.title" :isFull="true" :sub-title="item.title+'。。。'" :extra="new Date(item.created_at).toLocaleDateString()" :thumbnail="item.cover"
			v-for="(item,index) in news" :key="index" @tap="openinfo(item.post_id)"
			>
				<!-- <text class="uni-body">{{item.title}}</text> -->
					<template v-slot:actions>
						<view class="card-actions">
							<view class="card-actions-item" @click.stop="actionsClick('点赞',index)">
								<uni-icons type="heart" size="18" :color="item.heart ? 'red' : '#999'"></uni-icons>
								<text class="card-actions-item-text">点赞</text>
							</view>
							<view class="card-actions-item" @click.stop="actionsClick('收藏',index)">
								<uni-icons type="star" size="18" :color="item.star ? 'red' : '#999'"></uni-icons>
								<text class="card-actions-item-text">收藏</text>
							</view>
							<view class="card-actions-item" @click.stop="inputDialogToggle(item.post_id)">
								<uni-icons type="minus" size="18" color="#999"></uni-icons>
								<text class="card-actions-item-text">举报</text>
							</view>
						</view>
					</template>
			</uni-card>
		</view>
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose"  mode="reportData.reason" title="举报文章" value="请输入举报原因"
				placeholder="请输入举报原因" @confirm="dialogInputConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				news : [],
				reportData:{
					report_post_id:'',
					time:'',
					reason:''
				}
			};
		},
		onLoad:function(){
			uni.showLoading({
				title:"加载中...."
			})
			uni.request({
				url: 'http://localhost:3001/api/getNews',
				method: 'GET',
				data: {},
				success: res => {
					this.news = res.data.newsData;
					console.log(res.data.newsData)
					uni.hideLoading();
				},
				fail: () => {},
				complete: () => {}
			});
		},
		methods: {
			openinfo(id) {
				uni.navigateTo({
					url: './info/info?newsid='+id
				});
			},
			actionsClick(opr,index){
				if(opr == "点赞")
					this.news[index].heart = !this.news[index].heart
				else{
					this.news[index].star = !this.news[index].star
				}
				uni.request({
					url: 'http://localhost:3001/api/news/operateNews',
					method: 'post',
					data: {
						item:{
							Opost_id:this.news[index].post_id,
							user_id:123,
							star:Number(this.news[index].star),
							heart:Number(this.news[index].heart)
						}
					},
					success: res => {
						console.log(res.data)
						uni.hideLoading();
					},
					fail: () => {},
					complete: () => {}
				});
				
			},
			inputDialogToggle (post_id) {
				this.$refs.inputDialog.open()
				this.reportData.report_post_id = post_id;
				this.reportData.time = new Date();
				
			},
			dialogInputConfirm () {
				uni.request({
					url: 'http://localhost:3001/api/news/report',
					method: 'post',
					data: {
						item:this.reportData
					},
					success: res => {
						uni.showToast({
							title: '操作成功',
							duration: 1000,
							position:'top',
						});
						uni.hideLoading();
					},
					fail: () => {},
					complete: () => {}
				});
			}
		},

	}
</script>

<style lang="scss" scoped>
	::v-deep .uni-card__content{
		display: none;
	}
	.card-actions{
		display: flex;
		justify-content: space-around;
		align-items: center;
		.card-actions-item{
			display: inline-block;
		}
	}
	.dialog-box{
		display: none;
	}
</style>
