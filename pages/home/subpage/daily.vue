<template>
	<view class="daily-task-container">
		<!-- 头部 -->
		<view class="header-section">
			<view class="nav-bar">
				<image src="/static/noviciate/left.png" @click="fan" class="back-icon" mode=""></image>
				<view class="title">每日任务</view>
			</view>
			<view class="countdown-timer">
				<text>每日重置倒计时</text>
				<text class="time-value">{{hour}}:{{minute}}:{{second}}</text>
			</view>
		</view>

		<!-- 任务列表 -->
		<view class="task-list-wrapper">
			<!-- Skeleton Loading -->
			<view v-if="isLoading">
				<view class="skeleton-task-card" v-for="i in 3" :key="i">
					<view class="skeleton-info-section">
						<view class="skeleton-line skeleton-animate" style="width: 50%; height: 30rpx;"></view>
						<view class="skeleton-line skeleton-animate" style="width: 70%; margin-top: 10rpx;"></view>
						<view class="skeleton-line skeleton-animate" style="width: 40%; margin-top: 10rpx;"></view>
					</view>
					<view class="skeleton-action-section">
						<view class="skeleton-button skeleton-animate"></view>
					</view>
				</view>
			</view>

			<view v-else class="task-list-wrapper">
				<view class="task-card" v-for="(a,i) in dataList" :key="i">
					<image class="card-bg-icon" src="/static/today/img.png" mode="widthFix"></image>
					<view class="task-content">
						<view class="info-section">
							<view class="task-title">
								完成{{a.num}}个悬赏
								<view class="reward-tag">
									<image src="/static/today/price.png" mode="widthFix"></image>
									+{{a.jiangli}}元
								</view>
							</view>
							<view class="task-description">{{a.msg}}</view>
							<view class="task-progress">已完成：{{user.new_today_over_task || 0}}/{{a.num}}</view>
						</view>
						<view class="action-section">
							<button class="action-btn completed" v-if="a.state && a.is_ling">已完成</button>
							<button class="action-btn claimable" v-else-if="a.state && !a.is_ling" @click="navToTask(1,a.id)">待领取</button>
							<button class="action-btn to-complete" v-else @click="navToTask(0)">去完成</button>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isLoading: true,
				dataList: [],
				user: {},
				hour: '00',
				minute: '00',
				second: '00',
				timer: null
			}
		},
		onShow() {
			this.getdata();
			this.startCountdown();
		},
		onHide() {
			clearInterval(this.timer);
		},
		onUnload() {
			clearInterval(this.timer);
		},
		methods: {
			startCountdown() {
				const now = new Date();
				const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
				let remainingSeconds = Math.round((tomorrow.getTime() - now.getTime()) / 1000);

				this.timer = setInterval(() => {
					if (remainingSeconds > 0) {
						remainingSeconds--;
						const h = Math.floor(remainingSeconds / 3600);
						const m = Math.floor((remainingSeconds / 60) % 60);
						const s = Math.floor(remainingSeconds % 60);

						this.hour = h < 10 ? "0" + h : h;
						this.minute = m < 10 ? "0" + m : m;
						this.second = s < 10 ? "0" + s : s;
					} else {
						clearInterval(this.timer);
						// Optional: refresh data when countdown ends
						this.getdata();
						this.startCountdown();
					}
				}, 1000);
			},
			getdata() {
				let that = this;
				uni.request({
					url: that.global.url + '/api/user/jlinfo',
					method: "GET",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token
					},
					success(res) {
						if (res.data.code === 1) {
							that.dataList = res.data.data.jiangli.filter(item => item.type == 4);
							that.user = res.data.data.user;
							that.dataList.forEach(item => {
								item.state = (that.user.new_today_over_task >= item.num) ? 1 : 0;
							});
						}
					},
					fail(res) {},
					complete: () => {
						that.isLoading = false;
					}
				});
			},
			navToTask(type, myid) {
				if (!type) {
					uni.switchTab({
						url: '/pages/task/task'
					});
				} else {
					uni.request({
						url: this.global.url + '/api/user/login_jl',
						method: "POST",
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							token: uni.getStorageSync('token').token,
							id: myid,
							type: 4
						},
						success: (res) => {
							if (res.data.code === 1) {
								uni.showToast({
									title: "领取成功"
								});
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'error'
								});
							}
							this.getdata();
						},
						fail: (res) => {
							uni.showToast({
								title: "领取失败"
							});
						}
					});
				}
			},
			fan() {
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* Skeleton Styles */
	.skeleton-animate {
		background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
		background-size: 200% 100%;
		animation: skeleton-shimmer 1.5s infinite linear;
	}
	
	@keyframes skeleton-shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	.skeleton-task-card {
		background-color: #fff;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
		padding: 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.skeleton-info-section {
		flex: 1;
	}

	.skeleton-line {
		height: 24rpx;
		border-radius: 8rpx;
		margin-bottom: 10rpx;
	}

	.skeleton-button {
		width: 140rpx;
		height: 60rpx;
		border-radius: 30rpx;
	}

	.daily-task-container {
		width: 100%;
		min-height: 100vh;
		background-color: #f7f8fa;
	}

	.header-section {
		background: $uni-color-primary;
		padding-top: var(--status-bar-height);
		height: 280rpx;
		border-radius: 0 0 40rpx 40rpx;
		color: #fff;
	}

	.nav-bar {
		position: relative;
		height: 88rpx;
		display: flex;
		align-items: center;
		justify-content: center;

		.back-icon {
			position: absolute;
			left: 30rpx;
			width: 50rpx;
			height: 50rpx;
		}

		.title {
			font-size: 36rpx;
			font-weight: bold;
		}
	}

	.countdown-timer {
		text-align: center;
		margin-top: 10rpx;
		font-size: 28rpx;

		.time-value {
			display: block;
			font-size: 40rpx;
			font-weight: bold;
			margin-top: 10rpx;
		}
	}

	.task-list-wrapper {
		padding: 0 30rpx;
		margin-top: -80rpx;
		position: relative;
		z-index: 10;
	}

	.task-card {
		background-color: #fff;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
		position: relative;
		overflow: hidden;
	}

	.card-bg-icon {
		position: absolute;
		right: 0;
		top: 0;
		width: 120rpx;
		height: 120rpx;
		opacity: 0.1;
	}

	.task-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx;
		position: relative;
		z-index: 1;
	}

	.info-section {
		flex: 1;
		.task-title {
			display: flex;
			align-items: center;
			font-size: 30rpx;
			font-weight: bold;
			color: #333;

			.reward-tag {
				display: flex;
				align-items: center;
				background-color: #fdecec;
				color: $uni-color-primary;
				font-size: 24rpx;
				padding: 4rpx 12rpx;
				border-radius: 20rpx;
				margin-left: 16rpx;

				image {
					width: 28rpx;
					height: 28rpx;
					margin-right: 8rpx;
				}
			}
		}

		.task-description {
			font-size: 24rpx;
			color: #999;
			margin-top: 10rpx;
		}

		.task-progress {
			font-size: 24rpx;
			color: #666;
			margin-top: 10rpx;
		}
	}

	.action-section {
		margin-left: 20rpx;
		.action-btn {
			width: 140rpx;
			height: 60rpx;
			line-height: 60rpx;
			font-size: 26rpx;
			border-radius: 30rpx;
			margin: 0;
			padding: 0;

			&.to-complete {
				background-color: $uni-color-primary;
				color: #fff;
			}

			&.claimable {
				background-color: #fdecec;
				color: $uni-color-primary;
				border: 1rpx solid $uni-color-primary;
			}

			&.completed {
				background-color: #e0e0e0;
				color: #999;
				border: none;
			}
		}
	}
</style>
