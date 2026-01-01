<template>
	<view class="publish-task-container">
		<!-- 头部 -->
		<view class="header-section">
			<view class="status-bar"></view>
			<view class="nav-bar">
				<view class="title">发布任务</view>
			</view>
			<view class="intro-text">
				<view class="main-title">选择任务类型</view>
				<view class="subtitle">开启您的悬赏发布之旅</view>
			</view>
		</view>

		<!-- 任务类型 -->
		<view class="task-type-wrapper">
			<view class="type-grid">
				<view class="type-item" v-for="(a,i) in custom" :key="i" @click="navToRelease(a.id)" :style="{ animationDelay: i * 0.05 + 's' }">
					<view class="icon-wrapper">
						<image class="type-icon" :src="url+a.image" mode="aspectFill"></image>
					</view>
					<text class="type-name">{{a.name}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				custom: [], // 自定义任务
				url: '',
			}
		},
		onLoad() {
			let token = uni.getStorageSync('token');
			if (!token) {
				uni.navigateTo({
					url: '/pages/home/login/login'
				});
				return;
			}
			this.getTaskType();
			this.url = this.global.url;
		},
		methods: {
			getTaskType() {
				uni.request({
					url: this.global.url + '/api/task/tasktype',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						if (res.data.code === 1) {
							this.custom = res.data.data.custom;
						}
					}
				});
			},
			navToRelease(id) {
				uni.navigateTo({
					url: '/pages/release/release?id=' + id
				});
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f7f8fa;
	}

	.publish-task-container {
		width: 100%;
		min-height: 100vh;
		position: relative;
	}

	.header-section {
		background: $uni-color-primary;
		height: 320rpx;
		border-radius: 0 0 60rpx 60rpx;
		color: #fff;
		padding: 0 30rpx;
		box-sizing: border-box;

		.status-bar {
			height: var(--status-bar-height);
		}
	}

	.nav-bar {
		position: relative;
		height: 88rpx;
		display: flex;
		align-items: center;
		justify-content: center;

		.title {
			font-size: 36rpx;
			font-weight: bold;
		}
	}
	
	.intro-text {
		text-align: center;
		margin-top: 10rpx;
		.main-title {
			font-size: 44rpx;
			font-weight: bold;
		}
		.subtitle {
			font-size: 28rpx;
			opacity: 0.8;
			margin-top: 10rpx;
		}
	}

	.task-type-wrapper {
		padding: 0 30rpx;
		margin-top: -80rpx;
		position: relative;
		z-index: 10;
	}

	.type-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 30rpx;
	}

	.type-item {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 40rpx 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.06);
		opacity: 0;
		animation: fadeInUp 0.4s ease-out forwards;
		transition: transform 0.2s;

		&:active {
			transform: scale(0.95);
		}
	}
	
	.icon-wrapper {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f7f8fa;
		margin-bottom: 20rpx;

		.type-icon {
			width: 60rpx;
			height: 60rpx;
		}
	}

	.type-name {
		font-size: 28rpx;
		font-weight: 500;
		color: #333;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
