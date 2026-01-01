<template>
	<view class="construction-container">
		<view class="animation-wrapper">
			<view class="gear gear-one"></view>
			<view class="gear gear-two"></view>
			<view class="wrench"></view>
		</view>
		<view class="message-box">
			<text class="title">正在火速开发中</text>
			<text class="subtitle">敬请期待，即将上线...</text>
		</view>
		<custom-tab-bar current="xuanshangwa"></custom-tab-bar>
	</view>
</template>

<script>
	import customTabBar from '@/components/custom-tab-bar.vue';
	export default {
		components: {
			customTabBar
		},
		data() {
			return {}
		},
		methods: {}
	}
</script>

<style lang="scss" scoped>
	.construction-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		background-color: #f7f8fa;
		text-align: center;
	}

	.animation-wrapper {
		position: relative;
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 60rpx;
	}

	.gear {
		position: absolute;
		width: 120rpx;
		height: 120rpx;
		background-color: $uni-color-primary;
		border-radius: 50%;
		animation: rotate 8s linear infinite;

		&::before {
			content: '';
			position: absolute;
			width: 140rpx;
			height: 140rpx;
			top: -10rpx;
			left: -10rpx;
			border-radius: 50%;
			border: 10rpx solid $uni-color-primary;
			border-top-color: transparent;
			border-bottom-color: transparent;
		}
	}

	.gear-one {
		top: 0;
		left: 0;
	}

	.gear-two {
		bottom: 0;
		right: 0;
		width: 80rpx;
		height: 80rpx;
		animation: rotate-reverse 6s linear infinite;

		&::before {
			width: 100rpx;
			height: 100rpx;
		}
	}

	.wrench {
		position: absolute;
		width: 30rpx;
		height: 100rpx;
		background-color: #c0c0c0;
		border-radius: 8rpx;
		top: 50%;
		left: 50%;
		transform-origin: bottom center;
		animation: swing 2s ease-in-out infinite;

		&::before {
			content: '';
			position: absolute;
			top: -30rpx;
			left: -15rpx;
			width: 60rpx;
			height: 40rpx;
			border: 10rpx solid #c0c0c0;
			border-radius: 10rpx 10rpx 0 0;
			border-bottom: none;
		}
	}

	.message-box {
		.title {
			display: block;
			font-size: 40rpx;
			font-weight: bold;
			color: #333;
		}

		.subtitle {
			display: block;
			font-size: 28rpx;
			color: #999;
			margin-top: 20rpx;
		}
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes rotate-reverse {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(-360deg);
		}
	}

	@keyframes swing {
		0%, 100% {
			transform: translate(-50%, -100%) rotate(30deg);
		}
		50% {
			transform: translate(-50%, -100%) rotate(-30deg);
		}
	}
</style>
