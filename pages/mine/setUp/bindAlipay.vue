<template>
	<view class="bind-alipay-container">
		<view class="input-group">
			<view class="input-row">
				<text class="label">真实姓名</text>
				<input class="input" :disabled="is_certify == 1" type="text" placeholder="请输入真实姓名" v-model="name" />
			</view>
			<view class="input-row">
				<text class="label">支付宝账号</text>
				<input class="input" type="text" :disabled="is_certify == 1" placeholder="请输入支付宝账号" v-model="account" />
			</view>
			<view class="input-row">
				<text class="label">身份证号</text>
				<input class="input" type="text" :disabled="is_certify == 1" placeholder="请输入身份证号" v-model="certify_id" />
			</view>
		</view>
		<button class="confirm-btn" @click="confirm" type="primary" v-show="is_certify == 0">绑定</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				certify_id: '',
				account: "",
				name: "",
				is_certify: 0
			}
		},
		onLoad() {
			this.getInfo();
		},
		methods: {
			getInfo() {
				let that = this;
				uni.request({
					url: that.global.url + '/api/user/userinfo',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token,
					},
					success: (res) => {
						if (res.data.code == 1) {
							that.account = res.data.data.account;
							that.name = res.data.data.name;
							that.certify_id = res.data.data.certify_id;
							that.is_certify = res.data.data.is_certify;
						}
					}
				})
			},
			confirm() {
				let that = this;
				if (!that.name) {
					uni.showToast({
						title: '真实姓名不能为空',
						icon: 'none'
					})
					return;
				}
				if (!that.account) {
					uni.showToast({
						title: '支付宝账号不能为空',
						icon: 'none'
					})
					return;
				}
				let acc = /^(?:1[3-9]\d{9}|[a-zA-Z\d._-]*\@[a-zA-Z\d.-]{1,10}\.[a-zA-Z\d]{1,20})$/
				if (!acc.test(that.account)) {
					uni.showToast({
						title: '请输入正确的支付宝账号',
						icon: 'none'
					})
					return
				}
				uni.request({
					url: this.global.url + '/api/user/bindAli',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token,
						account: that.account,
						name: that.name,
						certify_id: that.certify_id,
					},
					success: (res) => {
						if (res.data.code == 1) {
							uni.showToast({
								title: "绑定成功"
							})
							uni.navigateBack()
						} else {
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bind-alipay-container {
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
		width: 180rpx;
		font-size: 32rpx;
		color: #333;
	}

	.input {
		flex: 1;
		font-size: 32rpx;
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
