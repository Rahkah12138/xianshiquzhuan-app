<template>
	<view class="forget-container">
		<view class="forget-box">
			<view class="title">重设密码</view>
			<view class="input-item">
				<image src="/static/login/icon_sj.png" class="icon" mode=""></image>
				<input type="number" class="input" placeholder="请输入手机号" v-model="phone" />
				<image src="/static/login/img_cloose.png" class="clear-icon" @click="clooseb" v-if="phone" mode=""></image>
			</view>
			<view class="input-item">
				<image src="/static/login/icon_yzm@2x.png" class="icon" mode=""></image>
				<input type="number" class="input" placeholder="请输入验证码" v-model="code" />
				<view class="yan-btn" v-if="!flag" @click="getTime">发送验证码</view>
				<view class="yan-btn disabled" v-else>{{miao+' S'}}</view>
			</view>
			<view class="input-item">
				<image src="/static/login/icon_mm.png" class="icon" mode=""></image>
				<input type="password" class="input" placeholder="请输入新密码" v-model="password" />
				<image src="/static/login/img_cloose.png" class="clear-icon" @click="cloosec" v-if="password" mode=""></image>
			</view>
			<view class="input-item">
				<image src="/static/login/icon_mm.png" class="icon" mode=""></image>
				<input type="password" placeholder="请确认密码" class="input" v-model="ispass" />
				<image src="/static/login/img_cloose.png" class="clear-icon" @click="cloosed" v-if="ispass" mode=""></image>
			</view>
			<view class="submit-btn" @click="resetpwd">确定</view>
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
				password: '', // 新密码
				miao: 60, // 倒计秒
				flag: false, // 标记
				
			}
		},
		onLoad() {

		},
		methods: {
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
						type: 2,
						event: 'resetpwd',
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
			resetpwd() {
				let that = this;
				if (that.phone == '') {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					});
				} else if (!(/^1[345678]\d{9}$/).test(that.phone)) {
					uni.showToast({
						title: '手机号码有误，请重填',
						icon: 'none'
					});
				} else if (that.code == '') {
					uni.showToast({
						title: '请输入验证码',
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
				} else {
					uni.request({
						url: that.global.url + '/api/user/resetpwd',
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							type: 'mobile',
							captcha: that.code,
							mobile: that.phone,
							newpassword: that.password
						},
						success: (res) => {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
							if (res.data.code == 1) {
								uni.removeStorageSync('isname');
								uni.removeStorageSync('ispass');
								uni.removeStorageSync('token');
								uni.reLaunch({
									url: '/pages/home/login/login'
								});
							}
						}
					});
				}
			},
			clooseb(){
				this.phone = ''
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

<style lang="scss" scoped>
	.forget-container {
		width: 100vw;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 40rpx;
		box-sizing: border-box;
		background: #f7f8fa;
	}

	.forget-box {
		width: 85%;
		background: #ffffff;
		border-radius: 20rpx;
		padding: 40rpx;
		box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
	}

	.title {
		font-size: 48rpx;
		font-weight: bold;
		text-align: center;
		margin-bottom: 50rpx;
		color: #333;
	}

	.input-item {
		display: flex;
		align-items: center;
		background-color: #f7f7f7;
		border-radius: 50rpx;
		padding: 0 30rpx;
		margin-bottom: 30rpx;
		height: 90rpx;

		.icon {
			width: 32rpx;
			height: 40rpx;
			margin-right: 20rpx;
		}

		.input {
			flex: 1;
			font-size: 30rpx;
			color: #333;
		}

		.clear-icon {
			width: 30rpx;
			height: 30rpx;
		}

		.yan-btn {
			padding: 15rpx 25rpx;
			font-size: 24rpx;
			color: #ffffff;
			background-color: $uni-color-primary;
			border-radius: 40rpx;
			white-space: nowrap;

			&.disabled {
				background-color: #e0e0e0;
                color: #999;
			}
		}
	}

	.submit-btn {
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		font-size: 32rpx;
		color: #ffffff;
		background: $uni-color-primary;
		border-radius: 50rpx;
		margin-top: 50rpx;
		box-shadow: 0 5rpx 15rpx rgba(230, 57, 70, 0.4);
	}
</style>
