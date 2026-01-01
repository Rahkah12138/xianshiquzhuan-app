<template>
	
	<view class="register">
		   <view class="status_bar">
		          <!-- 这里是状态栏 -->
		    </view>
		<view class="back">
			<view class="item">
				<view class="row">
					<image src="/static/login/icon_name.png" class="row_img" mode=""></image>
					<input class="row_ipt" type="text" placeholder="请输入昵称" v-model="nickname" />
					<image src="/static/login/img_cloose.png" class="row_img1" @click="cloosea" mode=""></image>
					</view>
					<view class="row_sj">
						<image src="/static/login/icon_sj.png" class="sj_img" mode=""></image>
						<input type="number" class="sj_ipt" placeholder="请输入手机号" v-model="phone" />
						<image src="/static/login/img_cloose.png" class="sj_img1" @click="clooseb" mode=""></image>
						</view>
						<view class="code" v-show="needCode==true">
							<image  class="code_img" src="/static/login/icon_yzm@2x.png" mode=""></image>
							<input type="number" class="code_ipt" placeholder="请输入验证码" v-model="code" />
							<view class="yan" v-if="!flag" @click="getTime">发送验证码</view>
							<view class="yan" v-else>{{miao+' S'}}</view>
						</view> 
						
				<view class="pass_box">
					<image src="/static/login/icon_mm.png" class="pass_img" mode=""></image>
					<input type="password" class="pass_ipt" placeholder="请输入密码" v-model="password" />
					<image src="/static/login/img_cloose.png" class="sj_img1" @click="cloosec" mode=""></image>
					</view>
				<view class="passa_box">
					<image src="/static/login/icon_mm.png" class="pass_img" mode=""></image>
					<input type="password" placeholder="请确认密码"class="pass_ipt" v-model="ispass" />
					<image src="/static/login/img_cloose.png" class="sj_img1" @click="cloosed" mode=""></image>
					</view>
				<view class="btn" @click="Register">注册</view>
			</view>
			<view class="bot_box">
				
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				code: '', // 验证码
				phone: '', // 手机号
				ispass: '', // 确认密码
				password: '', // 密码
				nickname: '', // 昵称
				miao: 60, // 倒计秒
				flag: false, // 标记
        needCode:false,
			}
		},
		onLoad() {
      this.initNeedCode();
		},
		methods: {
      initNeedCode(){
        let that = this;
        uni.request({
        	url: that.global.url + '/api/sms/registerconfig',
        	method: 'POST',
        	header: {
        		'content-type': 'application/x-www-form-urlencoded'
        	},
        	data: {
        		event: 'register' 
        	}, 
        	success: (res) => { 
            if(res.data.code == 1){
              that.needCode = res.data.needCode;
            }
        	}
        });
      },
			// 倒计时60S
			getTime() {
				let that = this;
				that.flag = true;
				that.getCode();
				let count = setInterval(() => {
					if (that.miao != 0) {
						that.miao -= 1;
					} else {
						clearInterval(count);
						that.flag = false;
						that.miao = 60;
					}
				}, 1000);
			},
			// 获取验证码
			getCode() {
				let that = this;
				uni.request({
					url: that.global.url + '/api/sms/send',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						type: 1,
						event: 'register',
						mobile: that.phone
					},
					success: (res) => {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
					}
				});
			},
			// 用户注册
			Register() {
				let that = this;
				if (that.nickname == '') {
					uni.showToast({
						title: '请输入昵称',
						icon: 'none'
					});
				} else if (that.password == '') {
					uni.showToast({
						title: '请输入密码',
						icon: 'none'
					});
				} else if (that.ispass == '') {
					uni.showToast({
						title: '请确认密码',
						icon: 'none'
					});
				} else if (that.ispass != that.password) {
					uni.showToast({
						title: '两次密码不一致',
						icon: 'none'
					});
				} else if (that.phone == '') {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					});
				} else if (that.code == '' && that.needCode) {
					uni.showToast({
						title: '请输入验证码',
						icon: 'none'
					});
				} else {
					uni.request({
						url: that.global.url + '/api/user/register',
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							parentId: 0,
							code: that.code,
							mobile: that.phone,
							username: that.nickname,
							password: that.password
						},
						success: (res) => {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
							if (res.data.code == 1) {
								uni.reLaunch({
									url: '/pages/home/login/login'
								});
							}
						}
					});
				}
			},
			cloosea(){
				this.nickname = ''; 
			},
			clooseb(){
				this.phone = '';
			},
			cloosec(){
				this.password = ''
			},
			cloosed(){
				this.ispass = ''
			}
		}
	}
</script>

<style scoped lang="scss">
	.register{
		width: 100%;
		height: calc(100vh - 90rpx );
		// background-image: linear-gradient(#017ff0db,#017ff0);
		background-image: url('../../../static/login/bg3.png');
		background-size: 100% calc(100vh - 90rpx );
		 background:#fff;
		overflow: hidden;
	}
	 .status_bar {
	    height: var(--status-bar-height);
	    width: 100%;
	  }
	.back {
		width: 90%;
		border-radius: 0 0 10% 10%;
		margin: 165rpx auto 0;
	}

	.item {
		width: 680rpx;
		height: 841rpx;
		margin: 0 auto;
		// background: #FFFFFF;
		// border-radius: 20rpx;
		// box-shadow: 0 0 20rpx #ddd;
		 padding: 40rpx 0 40rpx 0;
	}

	.row { 
		width: 560rpx;
		height: 88rpx;
		background-color: #F6F6F6;
		border-radius: 50rpx;
		margin: 40rpx auto 0;
		.row_img{
			width: 30rpx;
			height: 33rpx;
			float: left;
			margin-left: 43rpx;
			margin-top: 23rpx;
			margin-right: 20rpx;
		}
		.row_ipt{
			width: 400rpx;
			height: 100%;
			float: left;
			font-size: 30rpx;
		}
		.row_img1{
			width: 28rpx;
			height: 28rpx;
			float: left;
			margin-top: 30rpx;
		}
	}
	.row_sj{
		width: 560rpx;
		height: 88rpx;
		background-color: #F6F6F6;
		border-radius: 50rpx;
		margin: 48rpx auto 0;
		.sj_img{
			width: 30rpx;
			height: 38rpx;
			float: left;
			margin-left: 43rpx;
			margin-top: 23rpx;
			margin-right: 20rpx;
		}
		.sj_ipt{
			width: 400rpx;
			height: 100%;
			float: left;
			font-size: 30rpx;
		}
		.sj_img1{
			width: 28rpx;
			height: 28rpx;
			float: left;
			margin-top: 30rpx;
		}
	}
	.code{
		width: 560rpx;
		height: 88rpx;
		background-color: #F6F6F6;
		border-radius: 50rpx;
		margin: 48rpx auto 0;
		.code_img{
			width: 30rpx;
			height: 38rpx;
			float: left;
			margin-left: 43rpx;
			margin-top: 23rpx;
			margin-right: 20rpx;
		}
		.code_ipt{
			width: 280rpx;
			height: 100%;
			float: left;
			font-size: 30rpx;
		}
		.yan{
			width: 160rpx;
			height: 56rpx;
			float: left;
			line-height: 56rpx;
			text-align: center;
			border-radius: 40rpx;
			border: 1px solid #017ff0;
			font-size: 24rpx;
			color: #017ff0;
			margin-top: 18rpx;
		}
	}
	.pass_box{
		width: 560rpx;
		height: 88rpx;
		background-color: #F6F6F6;
		border-radius: 50rpx;
		margin: 48rpx auto 0;
		.pass_img{
			width: 30rpx;
			height: 38rpx;
			float: left;
			margin-left: 43rpx;
			margin-top: 23rpx;
			margin-right: 20rpx;
		}
		.pass_ipt{
			width: 400rpx;
			height: 100%;
			float: left;
			font-size: 30rpx;
		}
		.sj_img1{
			width: 28rpx;
			height: 28rpx;
			float: left;
			margin-top: 30rpx; 
		}
	}
	.passa_box{
		width: 560rpx;
		height: 88rpx;
		background-color: #F6F6F6;
		border-radius: 50rpx;
		margin: 48rpx auto 0;
		.pass_img{
			width: 30rpx;
			height: 38rpx;
			float: left;
			margin-left: 43rpx;
			margin-top: 23rpx;
			margin-right: 20rpx;
		}
		.pass_ipt{
			width: 400rpx;
			height: 100%;
			float: left;
			font-size: 30rpx;
		}
		.sj_img1{
			width: 28rpx;
			height: 28rpx;
			float: left;
			margin-top: 30rpx; 
		}
	}
	.bot_box{
		width: 90%;
		height: 74rpx;
		// background-color: #017ff0;
		border-radius: 0 0 20rpx 20rpx;
		margin: 0 auto;
	}
	.btn {
		width: 540rpx;
		height: 88rpx;
		margin: 100rpx auto 0;
		color: #FFFFFF;
		font-size: 30rpx;
		line-height: 88rpx;
		text-align: center;
	background-image:linear-gradient(to right,#017ff0,#ffc375 ) ;
	background-image: linear-gradient(to right, #017ff0db, #017ff0);
		border-radius: 60rpx;
		
	}
</style>
