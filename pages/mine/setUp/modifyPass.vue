<template>
	<view class="modify-pass-container">
		<view class="input-group">
			<view class="input-row">
				<text class="label">原密码</text>
				<input class="input" password placeholder="请输入原密码" v-model="oldPass" />
			</view>
			<view class="input-row">
				<text class="label">新密码</text>
				<input class="input" password placeholder="请输入新密码" v-model="newPass" />
			</view>
		</view>
		<button class="confirm-btn" @click="confirm" type="primary">确认修改</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				oldPass: '',
				newPass: '',
			}
		},
		methods: {
			confirm() {
				if (this.oldPass == '') {
					uni.showToast({
						title: '原密码不能为空',
						icon: "none"
					})
				} else if (this.newPass == '') {
					uni.showToast({
						title: '请填写新密码',
						icon: "none"
					})
				} else {
					uni.request({
						url: this.global.url + '/api/user/profile',
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							password: this.oldPass,
							newpassword: this.newPass,
							token: uni.getStorageSync('token').token
						},
						success: (res) => {
							if (res.data.code == 1) {
								uni.showToast({
									title: res.data.msg + ',请重新登录',
									icon: "none"
								})
								setTimeout(() => {
									uni.clearStorageSync();
									uni.navigateTo({
										url: "/pages/home/login/login"
									})
								}, 2000)
							} else {
								uni.showToast({
									title: '原' + res.data.msg,
									icon: "none"
								})
							}
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.modify-pass-container {
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

	.confirm-btn {
		margin-top: 80rpx;
		background: linear-gradient(135deg, #E63946, #FC5C7D);
		color: #ffffff;
		border-radius: 50rpx;
		font-size: 32rpx;
		box-shadow: 0 10px 20px rgba(230, 57, 70, 0.3);
	}
</style>
