<template>
	<view class="settings-container">
		<view class="settings-group">
			<view class="settings-item" @click="chooseImg">
				<text class="item-label">头像</text>
				<view class="item-content">
					<image :src="userinfo.avatar" class="avatar"></image>
					<image src="/static/index/kuo.png" class="arrow-icon"></image>
				</view>
			</view>
			<view class="settings-item" @click="setName">
				<text class="item-label">用户昵称</text>
				<view class="item-content">
					<text>{{ userList.nickname }}</text>
					<image src="/static/index/kuo.png" class="arrow-icon"></image>
				</view>
			</view>
			<view class="settings-item" @click="aboutsj">
				<text class="item-label">修改手机号</text>
				<image src="/static/index/kuo.png" class="arrow-icon"></image>
			</view>
			<view class="settings-item" @click="aboutPass">
				<text class="item-label">修改密码</text>
				<image src="/static/index/kuo.png" class="arrow-icon"></image>
			</view>
			<view class="settings-item" @click="bdzhb">
				<text class="item-label">绑定支付宝</text>
				<image src="/static/index/kuo.png" class="arrow-icon"></image>
			</view>
		</view>

		<view class="settings-group">
			<view class="settings-item" @click="aboutMe">
				<text class="item-label">关于我们</text>
				<image src="/static/index/kuo.png" class="arrow-icon"></image>
			</view>
			<view class="settings-item" @click="showDeleteAccount">
				<text class="item-label delete-label">注销账号</text>
				<image src="/static/index/kuo.png" class="arrow-icon"></image>
			</view>
		</view>

		<view class="logout-btn-container">
			<button type="primary" @click="logOut" class="logout-btn">退出登录</button>
		</view>

		<view class="agreement">
			<text @click.stop="agreementa">《服务协议》</text>
			<text class="separator">|</text>
			<text @click.stop="agreementb">《隐私协议》</text>
		</view>

		<view class="copyright">
			<view>Copyright © 2025</view>
			<view>闲时快赚 版权所有</view>
		</view>

		<view v-show="isJoin" @touchmove.stop.prevent="stopSlide">
			<view class="mask" @click="isJoin = false"></view>
			<view class="prompt-box">
				<view class="prompt-title">
					<image src="../../../static/release/yellow.png"></image>
					<text>提示</text>
				</view>
				<view class="prompt-text">是否要退出登录</view>
				<view class="prompt-buttons">
					<view @click="qx">取消</view>
					<view class="confirm-btn" @click="join">确认</view>
				</view>
			</view>
		</view>

		<!-- 注销账号弹窗 -->
		<view v-show="showDeletePopup" @touchmove.stop.prevent="stopSlide">
			<view class="mask" @click="showDeletePopup = false"></view>
			<view class="prompt-box delete-box">
				<view class="prompt-title">
					<image src="../../../static/release/yellow.png"></image>
					<text>注销账号</text>
				</view>
				<view class="prompt-text delete-text">
					<text>注销账号后：</text>
					<text class="delete-item">• 您的账号信息将被永久删除</text>
					<text class="delete-item">• 账号内的余额、积分等将被清零</text>
					<text class="delete-item">• 历史任务记录将无法恢复</text>
					<text class="delete-warning">此操作不可逆，请谨慎操作！</text>
				</view>
				<view class="prompt-buttons">
					<view @click="showDeletePopup = false">取消</view>
					<view class="delete-btn" @click="confirmDeleteAccount">确认注销</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isJoin: false,
				showDeletePopup: false,
				userinfo: uni.getStorageSync('token'),
				userList: {}
			}
		},
		onLoad() {
			this.userInfo();
		},
		onShow() {
			this.userInfo();
		},
		methods: {
			userInfo() {
				let that = this;
				uni.request({
					url: that.global.url + "/api/user/index",
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
					},
					success: (res) => {
						if (res.data.code == 1) {
							that.userList = res.data.data;
							that.userinfo.avatar = that.userList.avatar;
						}
					}
				})
			},
			qx() {
				this.isJoin = false;
			},
			join() {
				uni.request({
					url: this.global.url + "/api/user/logout",
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
					},
					success: (res) => {
						if (res.data.code == 1) {
							uni.clearStorageSync();
							uni.reLaunch({
								url: "/pages/home/login/login"
							})
						}
					}
				})
			},
			logOut() {
				this.isJoin = true;
			},
			setName() {
				uni.navigateTo({
					url: "/pages/mine/setUp/setName"
				})
			},
			bdzhb() {
				uni.navigateTo({
					url: "/pages/mine/setUp/bindAlipay"
				})
			},
			aboutMe() {
				uni.navigateTo({
					url: "/pages/mine/subPage/aboutMe"
				})
			},
			aboutsj() {
				uni.navigateTo({
					url: "/pages/mine/setUp/modifyPhone"
				})
			},
			aboutPass() {
				uni.navigateTo({
					url: "/pages/mine/setUp/modifyPass"
				})
			},
			chooseImg() {
				let that = this;
				uni.chooseImage({
					count: 1,
					success: (res) => {
						uni.uploadFile({
							url: this.global.url + '/api/user/profile?token=' + uni.getStorageSync('token').token,
							filePath: res.tempFilePaths[0],
							name: 'file',
							success: (resimg) => {
								if (JSON.parse(resimg.data).code == 1) {
									that.userinfo.avatar = that.global.url + JSON.parse(resimg.data).data;
									uni.showToast({
										title: '修改成功',
										icon: 'success'
									})
								}
							}
						});
					}
				});
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
			},
			showDeleteAccount() {
				this.showDeletePopup = true;
			},
			confirmDeleteAccount() {
				uni.showLoading({
					title: '正在注销...'
				});
				uni.request({
					url: this.global.url + "/api/user/cancellation",
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						userId: uni.getStorageSync("token").user_id,
					},
					success: (res) => {
						uni.hideLoading();
						if (res.data.code == 1) {
							uni.showToast({
								title: '账号注销成功',
								icon: 'success',
								duration: 2000
							});
							setTimeout(() => {
								uni.clearStorageSync();
								uni.reLaunch({
									url: "/pages/home/login/login"
								});
							}, 2000);
						} else {
							uni.showToast({
								title: res.data.msg || '注销失败',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						uni.hideLoading();
						uni.showToast({
							title: '网络错误，请重试',
							icon: 'none'
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	@keyframes fadeInUp {
		from {
			transform: translateY(20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.settings-group,
	.logout-btn-container,
	.agreement,
	.copyright {
		animation: fadeInUp 0.5s ease-out forwards;
	}

	.settings-container {
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	.settings-group {
		background-color: #ffffff;
		margin-top: 20rpx;
		padding-left: 30rpx;
	}

	.settings-item {
		display: flex;
		align-items: center;
		padding: 30rpx 0;
		border-bottom: 1rpx solid #eee;

		&:last-child {
			border-bottom: none;
		}
	}

	.item-label {
		flex: 1;
		font-size: 32rpx;
		color: #333;
	}

	.item-content {
		display: flex;
		align-items: center;
		color: #999;
		font-size: 28rpx;
	}

	.avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.arrow-icon {
		width: 30rpx;
		height: 30rpx;
		margin-left: 20rpx;
		margin-right: 30rpx;
	}

	.logout-btn-container {
		padding: 50rpx 30rpx;
	}

	.logout-btn {
		background: linear-gradient(135deg, #E63946, #FC5C7D);
		color: #ffffff;
		border-radius: 50rpx;
		font-size: 32rpx;
		box-shadow: 0 10px 20px rgba(230, 57, 70, 0.3);
	}

	.agreement {
		text-align: center;
		color: #999;
		font-size: 24rpx;
		margin-top: 100rpx;

		text {
			color: #E63946;
		}

		.separator {
			margin: 0 20rpx;
			color: #999;
		}
	}

	.copyright {
		text-align: center;
		color: #ccc;
		font-size: 20rpx;
		margin-top: 20rpx;
	}

	.mask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 999;
	}

	.prompt-box {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 80%;
		background-color: #ffffff;
		border-radius: 20rpx;
		padding: 40rpx;
		z-index: 1000;
	}

	.prompt-title {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 34rpx;
		font-weight: bold;
		margin-bottom: 40rpx;

		image {
			width: 60rpx;
			height: 60rpx;
			margin-right: 20rpx;
		}
	}

	.prompt-text {
		text-align: center;
		margin-bottom: 40rpx;
		font-size: 28rpx;
	}

	.prompt-buttons {
		display: flex;
		justify-content: space-between;

		view {
			flex: 1;
			text-align: center;
			padding: 20rpx;
			border-radius: 50rpx;
			margin: 0 10rpx;
			background-color: #f0f0f0;
		}

		.confirm-btn {
			background-color: #E63946;
			color: #ffffff;
		}

		.delete-btn {
			background-color: #ff4444;
			color: #ffffff;
		}
	}

	.delete-label {
		color: #ff4444;
	}

	.delete-box {
		.delete-text {
			text-align: left;
			display: flex;
			flex-direction: column;
			gap: 16rpx;

			.delete-item {
				color: #666;
				font-size: 26rpx;
				padding-left: 20rpx;
			}

			.delete-warning {
				color: #ff4444;
				font-size: 26rpx;
				margin-top: 20rpx;
				text-align: center;
				font-weight: bold;
			}
		}
	}
</style>
