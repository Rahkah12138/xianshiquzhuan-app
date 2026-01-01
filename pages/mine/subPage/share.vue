<template>
	<view class="share-container">
		<!-- 背景装饰 -->
		<view class="bg-decoration">
			<view class="circle circle-1"></view>
			<view class="circle circle-2"></view>
			<view class="circle circle-3"></view>
		</view>

		<!-- 顶部导航 -->
		<view class="nav-bar" :style="{ paddingTop: (statusBarHeight + 15) + 'px' }">
			<view class="nav-back" @click="navToParent">
				<view class="back-arrow"></view>
			</view>
			<text class="nav-title">专属海报</text>
			<view class="nav-placeholder"></view>
		</view>

		<!-- 海报展示区域 -->
		<view class="poster-section">
			<view class="poster-card animate-float-in" v-if="poster">
				<view class="poster-glow"></view>
				<image :src="poster" class="poster-image" mode="widthFix" @load="onPosterLoad"></image>
				<view class="poster-badge">
					<text>限时专属</text>
				</view>
			</view>
			<!-- 加载状态 -->
			<view class="poster-loading" v-else>
				<view class="loading-spinner">
					<view class="spinner-ring"></view>
				</view>
				<text class="loading-text">海报生成中...</text>
			</view>
		</view>

		<!-- 提示文字 -->
		<view class="tips-section animate-fade-in">
			<text class="tips-icon">💡</text>
			<text class="tips-text">分享海报邀请好友，一起赚赏金</text>
		</view>

		<!-- 底部操作按钮 -->
		<view class="action-section">
			<view class="action-btn save-btn animate-slide-up" @click="shareType(0)">
				<view class="btn-icon-wrapper save-icon-bg">
					<text class="btn-icon">📥</text>
				</view>
				<text class="btn-text">保存图片</text>
			</view>
			<view class="action-btn share-btn animate-slide-up" style="animation-delay: 0.1s" @click="isJoin = true">
				<view class="btn-icon-wrapper share-icon-bg">
					<text class="btn-icon">🚀</text>
				</view>
				<text class="btn-text">立即分享</text>
			</view>
		</view>

		<!-- 分享弹窗 -->
		<view class="share-popup" v-show="isJoin" @touchmove.stop.prevent="stopSlide">
			<view class="popup-mask" :class="{ 'mask-show': isJoin }" @click="cloose"></view>
			<view class="popup-content" :class="{ 'content-show': isJoin }">
				<view class="popup-header">
					<text class="popup-title">分享至</text>
					<view class="popup-close" @click="cloose">
						<text>×</text>
					</view>
				</view>
				<view class="share-grid">
					<view
						class="share-item"
						v-for="(item, index) in shareOptions"
						:key="index"
						@click="shareType(index)"
					>
						<view class="share-icon-wrapper" :class="'share-bg-' + index">
							<text class="share-icon">{{ item.icon }}</text>
						</view>
						<text class="share-name">{{ item.name }}</text>
					</view>
				</view>
				<view class="popup-divider"></view>
				<view class="cancel-btn" @click="cloose">
					<text>取消</text>
				</view>
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
				poster: '',
				shareUrl: '',
				isJoin: false,
				posterLoaded: false,
				shareOptions: [
					{ name: '保存图片', icon: '💾' },
					{ name: '复制链接', icon: '🔗' },
					{ name: '微信好友', icon: '💬' }
				]
			}
		},
		onLoad() {
			this.getUserBuildl()
		},
		methods: {
			onPosterLoad() {
				this.posterLoaded = true
			},
			shareType(index) {
				if (index == 0) {
					// #ifdef APP-PLUS
					uni.downloadFile({
						url: this.poster,
						success: res => {
							if (res.statusCode === 200) {
								uni.saveImageToPhotosAlbum({
									filePath: res.tempFilePath,
									success() {
										uni.showToast({
											title: "保存成功",
											icon: "success"
										})
									},
									fail() {
										uni.showToast({
											title: "保存失败",
											icon: "none"
										})
									}
								})
							}
						},
						fail: err => {
							console.log(err);
						}
					})
					// #endif
					// #ifdef H5
					uni.showToast({
						title: '请长按图片保存',
						icon: 'none'
					})
					// #endif
				} else if (index == 1) {
					//#ifdef APP-PLUS
					uni.setClipboardData({
						data: '【赚不停】帮人忙，赚赏金！就来赏帮赚，复制链接，去浏览器中打开↓↓↓\n' + this.shareUrl,
						success: function() {
							uni.showToast({
								title: '复制成功',
								icon: 'success'
							})
						}
					});
					//#endif
					//#ifdef H5
					var inp = document.createElement('input')
					document.body.appendChild(inp)
					inp.setAttribute('value', this.shareUrl)
					inp.select()
					if (document.execCommand('copy')) {
						document.execCommand('copy')
						uni.showToast({
							title: '复制成功',
							icon: 'success'
						})
					}
					document.body.removeChild(inp)
					//#endif
				} else if (index == 2) {
					//#ifdef H5
					uni.showToast({
						title: '请截图保存后分享',
						icon: 'none'
					})
					//#endif
					//#ifdef APP-PLUS
					uni.share({
						provider: "weixin",
						scene: "WXSceneSession",
						type: 2,
						imageUrl: this.poster,
						success: function(res) {
							console.log('成功', res)
						},
						fail: function(res) {
							console.log('失败', res);
						}
					})
					//#endif
				}
				this.isJoin = false
			},
			cloose() {
				this.isJoin = false
			},
			navToParent() {
				uni.navigateBack();
			},
			getUserBuildl() {
				uni.request({
					url: this.global.url + '/api/user/build',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						if (res.data.code == 1) {
							this.shareUrl = res.data.data.url;
							for (let i in res.data.data.poster) {
								this.poster = res.data.data.poster[i]
							}
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
	$primary-dark: #C41E3A;
	$bg-gradient: linear-gradient(135deg, #E63946 0%, #FF6B7A 50%, #FF8E9E 100%);

	// 动画定义
	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-10rpx); }
	}

	@keyframes floatIn {
		from {
			opacity: 0;
			transform: translateY(60rpx) scale(0.9);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(40rpx);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes pulse {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.05); }
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	@keyframes glow {
		0%, 100% { opacity: 0.5; transform: scale(1); }
		50% { opacity: 0.8; transform: scale(1.05); }
	}

	@keyframes circleFloat {
		0%, 100% { transform: translate(0, 0); }
		25% { transform: translate(20rpx, -20rpx); }
		50% { transform: translate(0, -40rpx); }
		75% { transform: translate(-20rpx, -20rpx); }
	}

	.animate-float-in {
		animation: floatIn 0.6s ease-out forwards;
	}

	.animate-slide-up {
		animation: slideUp 0.5s ease-out forwards;
		opacity: 0;
	}

	.animate-fade-in {
		animation: fadeIn 0.5s ease-out 0.3s forwards;
		opacity: 0;
	}

	.share-container {
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
			bottom: 200rpx;
			left: -80rpx;
			animation: circleFloat 10s ease-in-out infinite 2s;
		}

		&.circle-3 {
			width: 150rpx;
			height: 150rpx;
			top: 40%;
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

	// 海报区域
	.poster-section {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40rpx;
		min-height: 60vh;
	}

	.poster-card {
		position: relative;
		width: 85%;
		max-width: 600rpx;
		border-radius: 30rpx;
		overflow: visible;
		animation: float 4s ease-in-out infinite;
	}

	.poster-glow {
		position: absolute;
		top: -20rpx;
		left: -20rpx;
		right: -20rpx;
		bottom: -20rpx;
		background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
		border-radius: 40rpx;
		animation: glow 3s ease-in-out infinite;
		z-index: -1;
	}

	.poster-image {
		width: 100%;
		border-radius: 30rpx;
		box-shadow:
			0 30rpx 60rpx rgba(0, 0, 0, 0.3),
			0 10rpx 20rpx rgba(0, 0, 0, 0.2);
	}

	.poster-badge {
		position: absolute;
		top: -15rpx;
		right: 30rpx;
		background: linear-gradient(135deg, #FFD700, #FFA500);
		padding: 10rpx 30rpx;
		border-radius: 30rpx;
		box-shadow: 0 8rpx 20rpx rgba(255, 165, 0, 0.4);

		text {
			color: #fff;
			font-size: 24rpx;
			font-weight: bold;
		}
	}

	// 加载状态
	.poster-loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.loading-spinner {
		width: 100rpx;
		height: 100rpx;
		position: relative;
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
		margin-top: 30rpx;
	}

	// 提示区域
	.tips-section {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20rpx 40rpx;

		.tips-icon {
			font-size: 32rpx;
			margin-right: 12rpx;
		}

		.tips-text {
			color: rgba(255, 255, 255, 0.9);
			font-size: 26rpx;
		}
	}

	// 操作按钮区域
	.action-section {
		display: flex;
		justify-content: center;
		gap: 40rpx;
		padding: 40rpx 40rpx 60rpx;
		padding-bottom: calc(60rpx + env(safe-area-inset-bottom));
	}

	.action-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 30rpx 50rpx;
		border-radius: 30rpx;
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(10px);
		transition: all 0.3s ease;

		&:active {
			transform: scale(0.95);
			background: rgba(255, 255, 255, 0.25);
		}
	}

	.btn-icon-wrapper {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 16rpx;
		box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.2);
	}

	.save-icon-bg {
		background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
	}

	.share-icon-bg {
		background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
	}

	.btn-icon {
		font-size: 48rpx;
	}

	.btn-text {
		color: #fff;
		font-size: 28rpx;
		font-weight: 500;
	}

	// 分享弹窗
	.share-popup {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1000;
		display: flex;
		align-items: flex-end;
	}

	.popup-mask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0);
		transition: background 0.3s ease;

		&.mask-show {
			background: rgba(0, 0, 0, 0.5);
		}
	}

	.popup-content {
		position: relative;
		width: 100%;
		background: #fff;
		border-radius: 40rpx 40rpx 0 0;
		padding: 40rpx;
		padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
		transform: translateY(100%);
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

		&.content-show {
			transform: translateY(0);
		}
	}

	.popup-header {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		margin-bottom: 40rpx;
	}

	.popup-title {
		font-size: 34rpx;
		font-weight: bold;
		color: #333;
	}

	.popup-close {
		position: absolute;
		right: 0;
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f5f5f5;
		border-radius: 50%;

		text {
			font-size: 40rpx;
			color: #999;
			line-height: 1;
		}
	}

	.share-grid {
		display: flex;
		justify-content: space-around;
		padding: 20rpx 0;
	}

	.share-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		transition: transform 0.2s ease;

		&:active {
			transform: scale(0.9);
		}
	}

	.share-icon-wrapper {
		width: 120rpx;
		height: 120rpx;
		border-radius: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 16rpx;

		&.share-bg-0 {
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		}

		&.share-bg-1 {
			background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
		}

		&.share-bg-2 {
			background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
		}
	}

	.share-icon {
		font-size: 52rpx;
	}

	.share-name {
		font-size: 26rpx;
		color: #666;
	}

	.popup-divider {
		height: 1rpx;
		background: #eee;
		margin: 30rpx 0;
	}

	.cancel-btn {
		text-align: center;
		padding: 20rpx;

		text {
			font-size: 32rpx;
			color: #999;
		}

		&:active {
			background: #f5f5f5;
			border-radius: 20rpx;
		}
	}
</style>
