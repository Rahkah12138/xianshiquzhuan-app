<template>
	<view class="privacy-mask" v-if="visible" @touchmove.stop.prevent>
		<view class="privacy-popup">
			<view class="popup-title">用户协议与隐私政策</view>
			<view class="popup-content">
				<scroll-view scroll-y class="scroll-content">
					<view class="content-text">
						<text>欢迎使用闲时快赚！</text>
						<text>\n\n在使用我们的服务前，请您仔细阅读并同意</text>
						<text class="link" @click="openService">《用户服务协议》</text>
						<text>和</text>
						<text class="link" @click="openPrivacy">《隐私政策》</text>
						<text>。</text>
						<text>\n\n我们将严格按照上述协议为您提供服务，保护您的个人信息安全。</text>
						<text>\n\n如您同意以上协议，请点击"同意并继续"开始使用我们的服务。</text>
					</view>
				</scroll-view>
			</view>
			<view class="popup-buttons">
				<view class="btn-cancel" @click="handleDisagree">不同意</view>
				<view class="btn-agree" @click="handleAgree">同意并继续</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'PrivacyPopup',
	props: {
		visible: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		openService() {
			uni.navigateTo({
				url: '/pages/home/login/service'
			})
		},
		openPrivacy() {
			uni.navigateTo({
				url: '/pages/home/login/privacy'
			})
		},
		handleAgree() {
			// 存储同意状态
			uni.setStorageSync('privacy_agreed', true)
			uni.setStorageSync('has_read_privacy', true)
			// 触发同意事件
			this.$emit('agree')
		},
		handleDisagree() {
			uni.showModal({
				title: '温馨提示',
				content: '您需要同意用户协议和隐私政策才能使用本应用',
				showCancel: true,
				cancelText: '退出应用',
				confirmText: '查看协议',
				success: (res) => {
					if (res.confirm) {
						this.openPrivacy()
					} else {
						// 退出应用
						// #ifdef APP-PLUS
						plus.runtime.quit()
						// #endif
					}
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.privacy-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.6);
	z-index: 9999;
	display: flex;
	justify-content: center;
	align-items: center;
}

.privacy-popup {
	width: 85%;
	max-width: 600rpx;
	background-color: #ffffff;
	border-radius: 24rpx;
	overflow: hidden;
	animation: popup-in 0.3s ease-out;
}

@keyframes popup-in {
	from {
		opacity: 0;
		transform: scale(0.9);
	}
	to {
		opacity: 1;
		transform: scale(1);
	}
}

.popup-title {
	text-align: center;
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	padding: 40rpx 30rpx 20rpx;
}

.popup-content {
	padding: 0 30rpx;
	max-height: 500rpx;
}

.scroll-content {
	max-height: 500rpx;
}

.content-text {
	font-size: 28rpx;
	color: #666;
	line-height: 1.8;

	.link {
		color: #E63946;
	}
}

.popup-buttons {
	display: flex;
	padding: 30rpx;
	gap: 20rpx;
}

.btn-cancel {
	flex: 1;
	text-align: center;
	padding: 24rpx 0;
	border-radius: 44rpx;
	font-size: 30rpx;
	color: #666;
	background-color: #f5f5f5;
}

.btn-agree {
	flex: 1;
	text-align: center;
	padding: 24rpx 0;
	border-radius: 44rpx;
	font-size: 30rpx;
	color: #ffffff;
	background: linear-gradient(135deg, #E63946, #FC5C7D);
}
</style>
