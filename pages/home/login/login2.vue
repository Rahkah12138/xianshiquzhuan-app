<template>
	<view style="background:#fff;" >
	<view class="login_box" v-show="isShow">
			
		
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		<view class="back">
			<view style="font-weight: bold;font-size:36rpx;">欢迎登陆闲时快赚平台</view>
			<view style="width:100%;justify-content: center;text-align: center;margin-top: 100rpx;">
				<image src="/static//logo.png" style="width:160rpx;height:160rpx;"></image>
			</view>
			<view class="item">
				<view class="row">
					<image src="/static/login/icon_name.png" class="row_img" mode=""></image>
					<input class="row_ipt" type="text" placeholder="请输入手机号" v-model="name" />
					<image src="/static/login/img_cloose.png" class="row_img1" @click="cloosea" mode=""></image>
				</view>
				<view class="pass_box">
					<image src="/static/login/icon_mm.png" class="pass_img" mode=""></image>
					<input type="password" class="pass_ipt" placeholder="请输入密码" v-model="pass" />
					<image src="/static/login/img_cloose.png" class="sj_img1" @click="cloosec" mode=""></image>
				</view>
				<view class="pass_con">
					<view class="pava" style="display: flex;justify-content: space-between;">
						<checkbox-group @change="checkboxChange">
							<label>
								<checkbox class="box" :checked="isname" value="1" /><text>记住账号</text>
							</label>
						</checkbox-group>
						<checkbox-group @change="checkboxChangea" style="margin-left: 20rpx;">
							<label>
								<checkbox class="box" :checked="ispass" value="2" /><text>记住密码</text>
							</label>
						</checkbox-group>
						<text class="pass_word" @click="navToForgetPass">忘记密码？</text>
					</view>
				</view>
				<view class="btn" @click="clickLogin">登录</view>
				<view class="btn2"  @click="navToRegister">还没有账号？点击<text>立即注册</text></view>
				<view class="agreement_box" @click="agreementShow=!agreementShow">
					<view class="agreement-checkbox" :class="{'checked': agreementShow}">
						<view class="checkmark"></view>
					</view>
					<text class="agreement-text">我已经详细阅读</text>
					<text class="agreement-link" @click.stop="agreementa">《服务协议》</text>
					<text class="agreement-text">和</text>
					<text class="agreement-link" @click.stop="agreementb">《隐私协议》</text>
				</view>
			</view>
		</view>
		<!-- <view class="bot_box">
		</view> -->
    <!-- #ifdef APP-PLUS -->
      <view class="wx" v-if="hideShow">
        <image class="wx1" src="/static/index/login-wx.png" mode="aspectFill" @click="navTowxchat"></image>
      </view>
    <!-- #endif -->
    <!-- #ifdef H5 -->
    <!--  <view class="wx" @click="downloadApp"><view style="color:#fff;white-space: nowrap;">下载APP</view></view> -->
    <!-- #endif -->
		<down ref="downMask"></down>

	</view>
	</view>
</template>

<script>
	import down from '@/components/downMask.vue'
	export default {
		components: {
			down
		},
		data() {
			return {
				isShow:false,
				name: '', // 手机号
				pass: '', // 密码
				isname: false, // 记住账号
				ispass: false, // 记住密码
				token: '', //获取本地的token
				val: [],
				firstOpen: true,
				hideShow: '',
				downloadlink:'',
				agreementShow: false,
			}
		},
		onReady() {
				this.isShow=true
		},
		onLoad() {
			let that = this;
			that.isname = uni.getStorageSync('isname') != '' ? true : false;
			that.ispass = uni.getStorageSync('ispass') != '' ? true : false;
			that.name = uni.getStorageSync('isname') != '' ? uni.getStorageSync('isname') : '';
			that.pass = uni.getStorageSync('ispass') != '' ? uni.getStorageSync('ispass') : '';
			that.token = uni.getStorageSync('token');
			if (uni.getStorageSync('firstOpen') == '') {
				uni.setStorageSync('firstOpen', that.firstOpen)
			}
			// that.$nextTick(() => {
			// 	console.log(11)
			// 	that.$refs.downMask.init();
			// })
			let token=uni.getStorageSync('token');
			console.log('homr')
			if(token){
				uni.reLaunch({
					url:'/pages/home/home'
				})
			}else{
			
					
			 
			
				
			}
			
		},
		async onShow() {
			let _this = this
			let num = await _this.init()
			if (num == 1) {
				this.hideShow = true
			} else {
				this.hideShow = false
			}
		},
		methods: {
		  downloadApp(){
			window.open(this.downloadlink);
		  },
			init() {
				let _this = this;
				return new Promise((resolve, reject) => {
					uni.request({
						url: _this.global.url + '/api/index/switchOn',
						method: "POST",
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						success(res) {
							console.log(res);
							if (res.data.code == 1) {
								_this.downloadlink = res.data.data.downloadlink;
								resolve(res.data.data.wechat_authorization)

							}
						}
					})
				})

			},
			// 点击登录
			clickLogin() {

				let that = this;
				if (that.name == '') {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					});
				} else if (that.pass == '') {
					uni.showToast({
						title: '请输入密码',
						icon: 'none'
					});
				} else {

					uni.setStorageSync('isname', that.isname ? that.name : '');
					uni.setStorageSync('ispass', that.ispass ? that.pass : '');
					
					
					if (this.agreementShow == false) {
					
						uni.showModal({
							title: '提示',
							content: '同意服务协议和隐私协议吗？',
							confirmText:'同意',
							success: function (res) {
								if (res.confirm) {
									that.agreementShow=true
									that.doLogin()
									
								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							}
						});

						
					} else {
							this.doLogin()
					}

				}
			},
			doLogin(){
				let that=this
				uni.request({
					url: that.global.url + '/api/user/login',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						account: that.name,
						password: that.pass
					},
					success: (res) => {
						console.log(res)
						if (res.data.code == 1) {
							uni.setStorageSync('token', res.data.data.userinfo);
							uni.request({
								url: that.global.url + '/api/user/rong_token',
								method: 'POST',
								header: {
									'content-type': 'application/x-www-form-urlencoded'
								},
								data: {
									token: res.data.data.userinfo.token,
									userId: res.data.data.userinfo.id
								},
								success: (res2) => {
									uni.setStorageSync('rongtoken',res2.data.data.token)
								
									setTimeout(() => {
										uni.switchTab({
											url: '/pages/home/home'
										});
										uni.showToast({
											title: res2.data.msg,
											icon: 'none'
										});
									}, 0)
								}
							});
							
							
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
						}
					}
				});
			},
			// 跳转注册
			navToRegister() {
				uni.navigateTo({
					url: '/pages/home/login/register'
				});
			},
			// 微信第三方登录
			navTowxchat() {
				uni.showToast({
					title: '开发中',
					icon: 'none'
				});
			},
			// 跳转忘记密码
			navToForgetPass() {
				uni.navigateTo({
					url: '/pages/home/login/forget'
				});
			},
			checkboxChange(e) {
				this.isname = !this.isname;
				if (this.isname == true) {
					// this.isShowa = true

				} else {
					// this.isShowa = false
					this.ispass = false
				}
			},
			checkboxChangea() {
				if (this.isname == false) {
					this.ispass = false
				} else {
					this.ispass = !this.ispass
				}
			},
			cloosea() {
				this.name = '';
			},
			cloosec() {
				this.pass = ''
			},
			radioChange(e) {
				this.agreementShow = !this.agreementShow;
			},
			agreementa() {
				uni.navigateTo({
					url: "/pages/home/login/service"
				})
			},
			agreementb() {
				uni.navigateTo({
					url: "/pages/home/login/privacy"
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.login_box {
		width: 100%;
		height: 100vh;
		background: url('../../../static/login/login.svg');
		background-size: 100% 500rpx;
		background-repeat: no-repeat;
		overflow: hidden;
		  background:#fff;
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
		height: 800rpx;
		margin: 0 auto;
		// background: #FFFFFF;
		// border-radius: 20rpx;
		// box-shadow: 0 0 20rpx #ddd;
		padding: 40rpx 0 40rpx 0;
		position:fixed;
		bottom:0;
	}

	.row {
		width: 560rpx;
		height: 88rpx;
		 background-color: #F6F6F6;
		// background-color: #fff;
		border-radius: 50rpx;
		margin: 60rpx auto 0;

		.row_img {
			width: 30rpx;
			height: 33rpx;
			float: left;
			margin-left: 43rpx;
			margin-top: 23rpx;
			margin-right: 20rpx;
		}

		.row_ipt {
			width: 400rpx;
			height: 100%;
			float: left;
			font-size: 30rpx;
		}

		.row_img1 {
			width: 28rpx;
			height: 28rpx;
			float: left;
			margin-top: 30rpx;
		}
	}

	.pass_box {
		width: 560rpx;
		height: 88rpx;
		 background-color: #F6F6F6;
		// background-color: #fff;
		border-radius: 50rpx;
		margin: 46rpx auto 0;

		.pass_img {
			width: 30rpx;
			height: 38rpx;
			float: left;
			margin-left: 43rpx;
			margin-top: 23rpx;
			margin-right: 20rpx;
		}

		.pass_ipt {
			width: 400rpx;
			height: 100%;
			float: left;
			font-size: 30rpx;
		}

		.sj_img1 {
			width: 28rpx;
			height: 28rpx;
			float: left;
			margin-top: 30rpx;
		}
	}

	.bot_box {
		width: 70%;
		height: 74rpx;
		background-color: #017ff0;
		border-radius: 0 0 20rpx 20rpx;
		margin: 0 auto;
	}

	.pass_con {
		width: 90%;
		margin: 60rpx auto 0;

		.pass_word {
			color: #017ff0;
			font-size: 26rpx;
			margin-top: 10rpx;
		}
	}

	.btn {
		width: 80%;
		height: 88rpx;
		margin: 60rpx auto 0;
		color: #FFFFFF;
		font-size: 30rpx;
		line-height: 88rpx;
		text-align: center;
		background-image: linear-gradient(to right, #017ff0db, #017ff0);
		border-radius: 60rpx;

	}

	.btn2 {
		text-align: center;
		font-size: 26rpx;
		color: #017ff0;
		margin-top: 40rpx;
	}

	.wx {
		width: 100rpx;
		height: 100rpx;
		margin: 40rpx auto 0;

		.wx1 {
			width: 100%;
			height: 100%;
		}
	}

	.agreement_box {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		margin-top: 40rpx;

		.agreement-checkbox {
			position: relative;
			width: 36rpx;
			height: 36rpx;
			border: 2rpx solid #dcdfe6;
			border-radius: 8rpx;
			margin-right: 12rpx;
			background-color: #fff;
			transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
			flex-shrink: 0;

			&:active {
				transform: scale(0.9);
			}

			.checkmark {
				position: absolute;
				top: 50%;
				left: 50%;
				width: 10rpx;
				height: 18rpx;
				border: solid #fff;
				border-width: 0 3rpx 3rpx 0;
				transform: translate(-50%, -60%) rotate(45deg) scale(0);
				opacity: 0;
				transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
			}

			&.checked {
				background: linear-gradient(135deg, #017ff0 0%, #4facfe 100%);
				border-color: #017ff0;
				box-shadow: 0 4rpx 12rpx rgba(1, 127, 240, 0.35);

				.checkmark {
					transform: translate(-50%, -60%) rotate(45deg) scale(1);
					opacity: 1;
					animation: checkBounce 0.3s cubic-bezier(0.4, 0, 0.2, 1);
				}
			}
		}

		.agreement-text {
			color: #666;
		}

		.agreement-link {
			color: #017ff0;
		}
	}

	@keyframes checkBounce {
		0% {
			transform: translate(-50%, -60%) rotate(45deg) scale(0);
		}
		50% {
			transform: translate(-50%, -60%) rotate(45deg) scale(1.2);
		}
		100% {
			transform: translate(-50%, -60%) rotate(45deg) scale(1);
		}
	}
</style>
<style>
	/deep/ .uni-checkbox-input {
		width: 30rpx;
		height: 30rpx;

	}

	/deep/ .uni-label-pointer {
		font-size: 26rpx;
	}
</style>
