<template>
	<view class="set-name-container">
		<view class="input-card">
			<text class="label">昵称</text>
			<input v-model="nickname" class="input" :placeholder="nickname" type="text" />
		</view>
		<button class="confirm-btn" @click="confirm" type="primary">确认修改</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nickname: "",
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
							that.nickname = res.data.data.nickname;
						}
					}
				})
			},
			confirm() {
				let that = this;
				let nickname1 = that.nickname;
				if (nickname1 == "") {
					uni.showToast({
						title: "请输入用户昵称",
						icon: "none"
					})
					return;
				}
				if (nickname1.length > 8) {
					uni.showToast({
						title: "用户昵称最多八个字",
						icon: "none"
					})
					return;
				}
				uni.request({
					url: that.global.url + '/api/user/profile',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token,
						nickname: nickname1,
					},
					success: (res) => {
						if (res.data.code == 1) {
							uni.showToast({
								title: '修改成功',
								icon: 'success',
								duration: 2000
							})
							setTimeout(() => {
								uni.navigateBack();
							}, 2000)
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.set-name-container {
		background-color: #f5f5f5;
		min-height: 100vh;
		padding: 40rpx;
	}

	.input-card {
		display: flex;
		align-items: center;
		background-color: #ffffff;
		border-radius: 20rpx;
		padding: 30rpx;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
	}

	.label {
		width: 120rpx;
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
