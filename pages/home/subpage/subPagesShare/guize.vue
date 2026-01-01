<template>
	<view class="rule-container">
		<!-- 背景装饰 -->
		<view class="bg-decoration">
			<view class="circle circle-1"></view>
			<view class="circle circle-2"></view>
			<view class="circle circle-3"></view>
		</view>

		<!-- 顶部导航 -->
		<view class="nav-bar" :style="{ paddingTop: (statusBarHeight + 15) + 'px' }">
			<view class="nav-back" @click="back">
				<view class="back-arrow"></view>
			</view>
			<text class="nav-title">邀请规则</text>
			<view class="nav-placeholder"></view>
		</view>

		<!-- 头部装饰 -->
		<view class="header-section animate-fade-in">
			<view class="header-icon">📜</view>
			<text class="header-subtitle">了解规则，轻松邀请好友赚收益</text>
		</view>

		<!-- 规则内容 -->
		<view class="content-section">
			<view class="rule-card animate-slide-up" v-if="detail">
				<view class="card-glow"></view>
				<view class="card-header">
					<view class="card-icon">📋</view>
					<text class="card-title">活动规则</text>
				</view>
				<view class="card-divider"></view>
				<view class="rule-content">
					<view class="rule-text" v-html="detail.invitation_rules"></view>
				</view>
			</view>

			<!-- 加载状态 -->
			<view class="loading-card" v-else>
				<view class="loading-spinner">
					<view class="spinner-ring"></view>
				</view>
				<text class="loading-text">加载中...</text>
			</view>

			<!-- 温馨提示 -->
			<view class="tips-card animate-slide-up" style="animation-delay: 0.15s">
				<view class="tips-icon">💡</view>
				<text class="tips-text">邀请越多，收益越高！快去分享给好友吧~</text>
			</view>
		</view>
	</view>
</template>

<script>
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight || 0;

	export default {
		data() {
			return {
				statusBarHeight: statusBarHeight,
				detail: ''
			}
		},
		onLoad() {
			this.get_detail();
		},
		methods: {
			back() {
				uni.navigateBack();
			},
			get_detail() {
				uni.request({
					url: this.global.url + '/api/user/builds',
					method: 'GET',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						if (res.data.code == 1) {
							this.detail = res.data.data
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	$primary-color: #E63946;
	$primary-light: #FF6B7A;
	$bg-gradient: linear-gradient(135deg, #E63946 0%, #FF6B7A 50%, #FF8E9E 100%);

	// 动画定义
	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(-20rpx); }
		to { opacity: 1; transform: translateY(0); }
	}

	@keyframes slideUp {
		from { opacity: 0; transform: translateY(60rpx); }
		to { opacity: 1; transform: translateY(0); }
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-15rpx); }
	}

	@keyframes circleFloat {
		0%, 100% { transform: translate(0, 0); }
		25% { transform: translate(20rpx, -20rpx); }
		50% { transform: translate(0, -40rpx); }
		75% { transform: translate(-20rpx, -20rpx); }
	}

	@keyframes glow {
		0%, 100% { opacity: 0.3; }
		50% { opacity: 0.6; }
	}

	.animate-fade-in {
		animation: fadeIn 0.5s ease-out forwards;
		opacity: 0;
	}

	.animate-slide-up {
		animation: slideUp 0.6s ease-out forwards;
		opacity: 0;
	}

	.rule-container {
		min-height: 100vh;
		background: $bg-gradient;
		position: relative;
		overflow: hidden;
	}

	// 背景装饰
	.bg-decoration {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.circle {
		position: absolute;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.1);

		&.circle-1 {
			width: 300rpx;
			height: 300rpx;
			top: -100rpx;
			right: -100rpx;
			animation: circleFloat 8s ease-in-out infinite;
		}

		&.circle-2 {
			width: 200rpx;
			height: 200rpx;
			bottom: 300rpx;
			left: -80rpx;
			animation: circleFloat 10s ease-in-out infinite 2s;
		}

		&.circle-3 {
			width: 150rpx;
			height: 150rpx;
			top: 50%;
			right: -50rpx;
			animation: circleFloat 6s ease-in-out infinite 1s;
		}
	}

	// 导航栏
	.nav-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 30rpx;
		position: relative;
		z-index: 10;
	}

	.nav-back {
		width: 70rpx;
		height: 70rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		backdrop-filter: blur(10px);
		transition: all 0.2s ease;

		&:active {
			transform: scale(0.9);
			background: rgba(255, 255, 255, 0.3);
		}
	}

	.back-arrow {
		width: 20rpx;
		height: 20rpx;
		border-left: 4rpx solid #fff;
		border-bottom: 4rpx solid #fff;
		transform: rotate(45deg);
		margin-left: 6rpx;
	}

	.nav-title {
		color: #fff;
		font-size: 36rpx;
		font-weight: bold;
		text-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.2);
	}

	.nav-placeholder {
		width: 70rpx;
	}

	// 头部装饰区域
	.header-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40rpx 30rpx 60rpx;
	}

	.header-icon {
		font-size: 80rpx;
		margin-bottom: 20rpx;
		animation: float 3s ease-in-out infinite;
	}

	.header-subtitle {
		color: rgba(255, 255, 255, 0.9);
		font-size: 28rpx;
	}

	// 内容区域
	.content-section {
		padding: 0 30rpx 40rpx;
	}

	// 规则卡片
	.rule-card {
		position: relative;
		background: rgba(255, 255, 255, 0.95);
		border-radius: 30rpx;
		padding: 40rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
		overflow: hidden;
	}

	.card-glow {
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle, rgba($primary-color, 0.1) 0%, transparent 70%);
		animation: glow 4s ease-in-out infinite;
		pointer-events: none;
	}

	.card-header {
		display: flex;
		align-items: center;
		margin-bottom: 24rpx;
		position: relative;
		z-index: 1;
	}

	.card-icon {
		font-size: 48rpx;
		margin-right: 16rpx;
	}

	.card-title {
		font-size: 34rpx;
		font-weight: bold;
		color: #333;
	}

	.card-divider {
		height: 2rpx;
		background: linear-gradient(90deg, $primary-color, $primary-light, transparent);
		margin-bottom: 30rpx;
		border-radius: 2rpx;
	}

	.rule-content {
		position: relative;
		z-index: 1;
	}

	.rule-text {
		font-size: 28rpx;
		line-height: 1.9;
		color: #555;
	}

	.rule-text ::v-deep p {
		margin-bottom: 20rpx;
	}

	.rule-text ::v-deep strong,
	.rule-text ::v-deep b {
		color: $primary-color;
		font-weight: 600;
	}

	// 加载状态
	.loading-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 100rpx 0;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 30rpx;
		margin-bottom: 30rpx;
	}

	.loading-spinner {
		width: 80rpx;
		height: 80rpx;
		margin-bottom: 20rpx;
	}

	.spinner-ring {
		width: 100%;
		height: 100%;
		border: 6rpx solid rgba(255, 255, 255, 0.3);
		border-top-color: #fff;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	.loading-text {
		color: rgba(255, 255, 255, 0.8);
		font-size: 28rpx;
	}

	// 温馨提示
	.tips-card {
		display: flex;
		align-items: center;
		padding: 30rpx;
		background: rgba(255, 255, 255, 0.15);
		border-radius: 20rpx;
		backdrop-filter: blur(10px);
	}

	.tips-icon {
		font-size: 40rpx;
		margin-right: 16rpx;
	}

	.tips-text {
		flex: 1;
		color: rgba(255, 255, 255, 0.95);
		font-size: 26rpx;
		line-height: 1.5;
	}
</style>
