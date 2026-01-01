<template>
	<view class="modify-phone-container">
		<view class="input-group">
			<view class="input-row">
				<text class="label">手机号</text>
				<input class="input" type="number" placeholder="请输入手机号" v-model="phone" @blur="sjPhone" />
			</view>
			<view class="input-row">
				<text class="label">验证码</text>
				<input class="input" type="number" placeholder="请输入验证码" v-model="code" />
				<view class="code-btn" v-if="!flag" @click="getTime">发送验证码</view>
				<view class="code-btn disabled" v-else>{{ miao }} S</view>
			</view>
		</view>
		<button class="confirm-btn" @click="confirm" type="primary">确认修改</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone: '',
				code: '',
				flag: false,
				miao: 60,
			}
		},
		methods: {
			sjPhone() {
				if (!(/^1[345678]\d{9}$/).test(this.phone)) {
					uni.showToast({
						title: '手机号码有误，请重填',
						icon: 'none'
					});
				}
			},
			getTime() {
				if (this.phone == '') {
					uni.showToast({
						title: "请先填写手机号",
						icon: "none"
					})
				} else if (!(/^1[345678]\d{9}$/).test(this.phone)) {
					uni.showToast({
						title: '手机号码有误，请重填',
						icon: 'none'
					});
				} else {
					this.flag = true;
					this.getCode();
					let count = setInterval(() => {
						if (this.miao != 0) {
							this.miao -= 1;
						} else {
							clearInterval(count);
							this.flag = false;
							this.miao = 60;
						}
					}, 1000);
				}
			},
			getCode() {
				uni.request({
					url: this.global.url + '/api/sms/send',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						type: 1,
						event: 'changemobile',
						mobile: this.phone
					},
					success: (res) => {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
					}
				});
			},
			confirm() {
				if (this.phone == '') {
					uni.showToast({
						title: "请先填写手机号",
						icon: "none"
					})
				} else if (!(/^1[345678]\d{9}$/).test(this.phone)) {
					uni.showToast({
						title: '手机号码有误，请重填',
						icon: 'none'
					});
				} else if (this.code == '') {
					uni.showToast({
						title: '请填写验证码',
						icon: 'none'
					});
				} else {
					uni.request({
						url: this.global.url + '/api/user/changemobile',
						method: "POST",
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							mobile: this.phone,
							captcha: this.code,
							token: uni.getStorageSync('token').token
						},
						success: (res) => {
							uni.showToast({
								title: res.data.msg,
								icon: "none"
							})
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.modify-phone-container {
		background-color: #f5f5f5;
		min-height: 100vh;
		padding: 40rpx;
	}

	.input-group {
		background-color: #ffffff;
		border-radius: 20rpx;
		padding: 0 30rpx;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
	}

	.input-row {
		display: flex;
		align-items: center;
		height: 120rpx;
		border-bottom: 1rpx solid #eee;

		&:last-child {
			border-bottom: none;
		}
	}

	.label {
		width: 140rpx;
		font-size: 32rpx;
		color: #333;
	}

	.input {
		flex: 1;
		font-size: 32rpx;
	}

	.code-btn {
		width: 200rpx;
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;
		background-color: #E63946;
		color: #ffffff;
		border-radius: 40rpx;
		font-size: 28rpx;

		&.disabled {
			background-color: #ccc;
		}
	}

	.confirm-btn {
		margin-top: 80rpx;
		background: linear-gradient(135deg, #E63946, #FC5C7D);
		color: #ffffff;
		border-radius: 50rpx;
		font-size: 32rpx;
		box-shadow: 0 10px 20px rgba(230, 57, 70, 0.3);
	}
</style>
