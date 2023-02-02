<template>
    <view class="login">
        <view class="top_item">
            <text style="color: #000000;font-size: 22px;font-weight: bold;">密码登录</text>
            <text style="color: #000000;font-size: 20px;margin-right: 10px" @click="handleClick">验证码></text>
        </view>
        <view class="input-item" style="margin-top: 80rpx;">
            <view class="title-content">
                <text class="title">账号</text>
            </view>
            <uni-easyinput class="input" v-model="account" placeholder="账号/邮箱" style="margin-left: 40rpx;" />
        </view>
        <view class="input-item">
            <view class="title-content">
                <text class="title">密码</text>
            </view>
			<uni-easyinput class='input' type="password" v-model="psw" placeholder="请输入密码" style="margin-left: 40rpx;"/>

        </view>
        <view class="button" @click="login">登录</view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                title: 'Hello',
				psw:'',
				account:'',
            }
        },
        onLoad() {

        },
        methods: {
            login() {
				if(this.psw && this.account)
				{
					uni.request({
						url: 'http://localhost:3001/api/login',
						method: 'post',
						data: {
							account:this.account,
							psw:this.psw
						},
						success: res => {
							console.log(res)
							if(res.statusCode =='200')
							{
								uni.showToast({
									title: '登录成功',
									duration: 500,
									position:'top',
								});
								setTimeout(function(){
									uni.switchTab({
										url:"/pages/index/index"
									});
								},1500)	
							}
							else{
								uni.showToast({
									title:'账号或密码错误',
									duration:1500,
									position:'top',
									icon:'error'
								})
							}
						},
						fail: () => {},
						complete: () => {}
					});
				}
				else{
					uni.showToast({
						title: '账号和密码不能为空',
						icon:'error',
						duration: 1500,
						position:'top',
					});
				}
            },
        }
    }
</script>

<style lang="scss">
    .top_item {
        display: flex;
        margin-top: 40rpx;
        margin-left: 32rpx;
        margin-right: 32rpx;
        justify-content: space-between;
    }

    .input-item {
        display: flex;
        margin-left: 32rpx;
        margin-right: 32rpx;
        height: 50px;
        align-items: center;
        border-bottom: 1px solid #efeff4;
        margin-bottom: 20rpx;

        .title-content {
            display: flex;
            justify-content: flex-start;
            align-items: center;

            .title {
                font-size: 18px;
            }
        }

        .input {
            flex: 1;
        }
    }

    .button {
        height: 50px;
        line-height: 50px;
        margin-top: 60rpx;
        margin-left: 32rpx;
        margin-right: 32rpx;
        border-radius: 50rpx;
        font-size: 20px;
        background-color: #008AFE;
        color: #FFFFFF;
        text-align: center;
    }
</style>