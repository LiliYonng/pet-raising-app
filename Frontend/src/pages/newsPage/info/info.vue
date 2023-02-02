<template>
	<view class="content">
		<view class="title">{{title}}...</view>
		<view class="art-content">
			<rich-text class="richText" :nodes="strings"></rich-text>
		</view>
		<view class="comment">
			<h3>评论区</h3>
			<view class="comment-list">
				<uni-list>
					<uni-list-item :title="item.author" :note="item.comment" 
						thumb="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/460d46d0-4fcc-11eb-8ff1-d5dcf8779628.png"
						thumb-size="sm" :rightText="FormatDate(item.comment_time)" 
						v-for="(item,index) in commentList"
						/>
				</uni-list>
			</view>
			<view class="input-wrap">
				张三 ：
				<view class="input-box">
						<uni-easyinput v-model="commentData.comment" placeholder="快来发言吧" />
				</view>
				<text class="btn" @click="addComment">评论</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '',
				strings : '',
				commentList:[],
				postId:'',
				commentData:{
					author:'张三',
					author_id:123,
					comment:'',
					c_post_id:'',
				}
			}
		},
		onLoad:function(e){
			this.postId = e.newsid;
			console.log(e);
			uni.request({
				url: 'http://localhost:3001/api/getContent',
				method: 'GET',
				data: {
					postId:e.newsid
				},
				success: res => {
					console.log(res.data);
					this.title = res.data[0].title;
					this.strings = res.data[0].content;
				},
				fail: () => {},
				complete: () => {}
			});
			this.getComment()
		},
		methods:{
			getComment() {
				uni.request({
					url: 'http://localhost:3001/api/news/getComment',
					method: 'GET',
					data: {
						postId:this.postId
					},
					success: res => {
						console.log(res);
						this.commentList=res.data;
					},
					fail: () => {},
					complete: () => {}
				});
			},
			FormatDate(time) {
			  let date = new Date(time),
			    year = date.getFullYear(), //获取完整的年份(4位)
			    month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
			    strDate = date.getDate() // 获取当前日(1-31)
			  if (month < 10) month = `0${month}` // 如果月份是个位数，在前面补0
			  if (strDate < 10) strDate = `0${strDate}` // 如果日是个位数，在前面补0
			 
			  return `${year}-${month}-${strDate}`
			  },
			  addComment() {
				  const me = this;
				  this.commentData.c_post_id = this.postId
				  uni.request({
				  	url: 'http://localhost:3001/api/news/addComment',
				  	method: 'post',
				  	data: {
				  		item:this.commentData
				  	},
				  	success: res => {
				  		console.log(res);
						me.getComment()
						this.commentData.comment=""
						uni.showToast({
							title: '评论成功',
							duration: 1000,
							position:'top',
						});
				  	},
				  	fail: () => {},
				  	complete: () => {}
				  });
			  }
		}
	}
</script>

<style>
.content{padding:10upx 2%; width: 96%; flex-wrap:wrap;}
.title{line-height:2em; font-weight:700; font-size:38upx;}
.art-content{line-height:2em;}
.slot-image{
	width: 32px;
	height: 32px;
}
.input-wrap{
	margin-top: 10px;
}
.comment-list{
	margin-top: 10px;
}
.input-box{
	display: inline-block;
	width:60%;
}
.btn{
	display: inline-block;
	border: 1px solid black;
	margin-left: 10px;
	font-size: 0.6em;
	padding:7px 15px
}
</style>
