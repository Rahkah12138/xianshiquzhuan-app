<template>
	<view class="login-container">
		<view class="header">
			<image class="logo" src="/static/logo.png"></image>
			<view class="title-main" :class="{ 'hidden': bit }">
				<text class="title">您好</text>
				<text class="subtitle">欢迎回来</text>
			</view>
			<view class="title-main" :class="{ 'hidden': !bit }">
				<text class="title">您好</text>
				<text class="subtitle">欢迎加入我们</text>
			</view>
		</view>

		<!-- 登录 -->
		<view class="form-wrapper" :class="{ 'hidden': bit }">
			<view class="form-title">欢迎登录</view>
			<view class="input-group">
				<input v-model="username" class="input-field" placeholder="请输入手机号" placeholder-class="input-placeholder" />
			</view>
			<view class="input-group">
				<input v-model="password" class="input-field" type="password" placeholder="输入密码哦" placeholder-class="input-placeholder" />
			</view>
			<button class="submit-btn" @click="scsLogin">登录</button>
			<view class="actions">
				<text class="action-link" @click="enrollTo">我要注册</text>
				<text class="action-link" @click="navToForgetPass">忘记密码</text>
			</view>
			<view class="social-login">
				<image src="/static/loginimg/wx.png" class="social-icon" @click="appLogin"></image>
			</view>
		</view>

		<!-- 注册 -->
		<view class="form-wrapper" :class="{ 'hidden': !bit }">
			<view class="form-title">欢迎注册</view>
			<view class="input-group">
				<input v-model="phone" class="input-field" placeholder="请输入手机号" placeholder-class="input-placeholder" />
			</view>
			<view class="input-group code" v-if="needCode">
				<input type="number" class="input-field" placeholder="请输入验证码" v-model="code" placeholder-class="input-placeholder" />
				<view class="yan" v-if="!flag" @click="getTime">发送验证码</view>
				<view class="yan" v-else>{{miao + 's'}}</view>
			</view>
			<view class="input-group">
				<input v-model="password1" class="input-field" type="password" placeholder="请输入密码" placeholder-class="input-placeholder" />
			</view>
			<view class="input-group">
				<input v-model="password2" class="input-field" type="password" placeholder="请确认密码" placeholder-class="input-placeholder" />
			</view>
			<button class="submit-btn" @click="scsenrollTo">注册</button>
			<view class="actions">
				<text class="action-link" @click="login">已有账号？去登录</text>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				needCode: false,
				phone: '',
				nickname: '',
				bit: false, // false for login, true for register
				username: '',
				password: '',
				password1: '',
				password2: '',
				code: '',
				miao: 60,
				flag: false,
			}
		},
		onLoad() {
			this.initNeedCode();
		},
		methods: {
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
			initNeedCode() {
				uni.request({
					url: this.global.url + '/api/sms/registerconfig',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						event: 'register'
					},
					success: (res) => {
						if (res.data.code == 1) {
							this.needCode = res.data.needCode;
						}
					}
				});
			},
			appLogin() {
				uni.login({
					provider: 'weixin',
					onlyAuthorize: true,
					success: (loginRes) => {
						this.appWechatLogin({
							code: loginRes.code
						});
					},
					fail: (res) => {
						uni.showToast({
							title: '微信登录失败',
							icon: 'none'
						});
					}
				});
			},
			appWechatLogin(param) {
				uni.request({
					url: this.global.url + '/api/user/wx_login',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						code: param.code
					},
					success: (res) => {
						if (res.data.code == 1) {
							uni.setStorageSync('token', res.data.data.userinfo);
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/index/index'
								});
							}, 1500);
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						uni.showToast({
							title: '登录请求失败',
							icon: 'none'
						});
					}
				});
			},
			navToForgetPass() {
				uni.navigateTo({
					url: '/pages/home/login/forget'
				});
			},
			enrollTo() {
				this.bit = true;
				this.emptys();
			},
			login() {
				this.bit = false;
				this.emptys();
			},
			scsLogin() {
				if (!this.username || !this.password) {
					return uni.showToast({
						title: '请输入手机号和密码',
						icon: 'none'
					});
				}
				uni.request({
					url: this.global.url + '/api/user/login',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						account: this.username,
						password: this.password
					},
					success: (res) => {
						if (res.data.code == 1) {
							uni.setStorageSync('token', res.data.data.userinfo);
							uni.showToast({
								title: '登录成功',
								icon: 'success',
								duration: 2000,
							});
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/index/index'
								});
							}, 2000);
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
						}
					}
				});
			},
			scsenrollTo() {
				if (!this.phone) return uni.showToast({
					title: '请输入手机号',
					icon: 'none'
				});
				if (this.needCode && !this.code) return uni.showToast({
					title: '请输入验证码',
					icon: 'none'
				});
				if (!this.password1) return uni.showToast({
					title: '请输入密码',
					icon: 'none'
				});
				if (this.password1 !== this.password2) return uni.showToast({
					title: '两次密码不一致',
					icon: 'none'
				});

				uni.request({
					url: this.global.url + '/api/user/register',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						parentId: 0,
						code: this.code,
						mobile: this.phone,
						username: this.nickname,
						password: this.password1
					},
					success: (res) => {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
						if (res.data.code == 1) {
							this.bit = false; // Switch to login view
							this.emptys();
						}
					}
				});
			},
			emptys() {
				this.username = '';
				this.password = '';
				this.password1 = '';
				this.password2 = '';
				this.phone = '';
				this.code = '';
				this.nickname = '';
			}
		}
	}
</script>
<style lang="scss">
	.login-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100vw;
		min-height: 100vh;
		padding: 40rpx;
		box-sizing: border-box;
		background: #f7f8fa;
	}

	.header {
		width: 100%;
		text-align: center;
		padding: 80rpx 0;
	}

	.logo {
		width: 120rpx;
		height: 120rpx;
		border-radius: 10%;
		margin-bottom: 40rpx;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.title-main {
		text-align: center;
		transition: all 0.3s ease-in-out;
	}

	.title {
		font-size: 52rpx;
		font-weight: bold;
		color: #333;
		display: block;
	}

	.subtitle {
		font-size: 32rpx;
		color: #999;
		margin-top: 10rpx;
	}

	.form-wrapper {
		width: 100%;
		background-color: #fff;
		padding: 60rpx 40rpx;
		border-radius: 24rpx;
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
		transition: all 0.3s ease-in-out;
	}

	.form-wrapper.hidden,
	.title-main.hidden {
		opacity: 0;
		transform: scale(0.95);
		display: none;
	}

	.form-title {
		font-size: 40rpx;
		font-weight: bold;
		color: $uni-color-primary;
		text-align: center;
		margin-bottom: 60rpx;
	}

	.input-group {
		margin-bottom: 40rpx;
		position: relative;
	}

	.input-field {
		width: 100%;
		height: 96rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		color: #333;
		background-color: #f7f8fa;
		border-radius: 16rpx;
		border: 1px solid transparent;
		transition: border-color 0.3s;

		&:focus {
			border-color: $uni-color-primary;
		}
	}

	.input-placeholder {
		color: #bbb;
	}

	.code {
		display: flex;
		align-items: center;
		.input-field {
			flex: 1;
		}
		.yan{
			flex-shrink: 0;
			width: 160rpx;
			height: 56rpx;
			line-height: 56rpx;
			text-align: center;
			border-radius: 40rpx;
			border: 1px solid $uni-color-primary;
			font-size: 24rpx;
			color: $uni-color-primary;
			margin-left: 20rpx;
		}
	}

	.submit-btn {
		width: 100%;
		height: 96rpx;
		line-height: 96rpx;
		font-size: 32rpx;
		font-weight: bold;
		color: #fff;
		background: $uni-color-primary;
		border-radius: 16rpx;
		margin-top: 20rpx;
		transition: opacity 0.2s;

		&:active {
			opacity: 0.8;
		}
	}

	.actions {
		display: flex;
		justify-content: space-between;
		margin-top: 40rpx;
	}

	.action-link {
		font-size: 26rpx;
		color: #999;
		cursor: pointer;

		&:hover {
			color: $uni-color-primary;
		}
	}

	.social-login {
		margin-top: 80rpx;
		text-align: center;
	}

	.social-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		cursor: pointer;
		transition: transform 0.2s;

		&:hover {
			transform: scale(1.1);
		}
	}
</style>
