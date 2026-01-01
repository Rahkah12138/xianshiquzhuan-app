<template>
	<view class="noviciate-container">
		<view class="nav-bar">
			<image class="back-icon" src="/static/noviciate/left.png" mode="widthFix" @click="back"></image>
		</view>

		<!-- 内容区 -->
		<view class="content-wrapper">
			<!-- Skeleton Loading -->
			<view v-if="isLoading" class="content-box">
				<view class="skeleton-task-list">
					<view class="skeleton-task-card" v-for="i in 3" :key="i">
						<view class="skeleton-card-left">
							<view class="skeleton-icon skeleton-animate"></view>
							<view class="skeleton-task-info">
								<view class="skeleton-line skeleton-animate" style="width: 60%; height: 30rpx;"></view>
								<view class="skeleton-line skeleton-animate" style="width: 80%; margin-top: 10rpx;"></view>
							</view>
						</view>
						<view class="skeleton-card-right">
							<view class="skeleton-line skeleton-animate" style="width: 120rpx; height: 40rpx;"></view>
							<view class="skeleton-button skeleton-animate"></view>
						</view>
					</view>
				</view>
			</view>
			
			<view v-else class="content-box">
				<view class="countdown-timer">
					<text v-if="is_exp">限新注册用户48小时内领取</text>
					<view v-else class="timer">
						<text>新人倒计时</text>
						<text class="time-value">{{hour}}:{{minute}}:{{second}}</text>
					</view>
				</view>
				<view class="task-list">
					<view class="task-card" v-for="(item,index) in dataList" :key="index">
						<view class="card-left">
							<image class="task-icon" src="/static/noviciate/icon_1.png" mode="widthFix"></image>
							<view class="task-info">
								<view class="task-title">{{item.msg}}</view>
								<view class="task-desc">{{item.content}}</view>
								<view class="task-progress" v-if="item.type == 1">已完成：{{user.new_first_login || 0}}/{{item.num}}</view>
								<view class="task-progress" v-else-if="item.type == 2">已完成：{{user.new_over_task || 0}}/{{item.num}}</view>
								<view class="task-progress" v-else-if="item.type == 3">已完成：{{user.new_first_tixian || 0}}/{{item.num}}</view>
							</view>
						</view>
						<view class="card-right">
							<view class="reward">
								<image class="reward-icon" src="/static/noviciate/icon_jb.png" mode="widthFix"></image>
								<text class="reward-amount">{{item.jiangli}}元</text>
							</view>
							<button class="action-btn" :class="getButtonClass(item)" @click="tiao(item.id,item.type,item.state,item.is_ling)">
								{{getButtonText(item)}}
							</button>
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
				hour: '00',
				minute: '00',
				second: '00',
				dataList: [],
				user: {},
				is_exp: 1,
				leftTime: 0,
				itl: '',
			}
		},
		onShow() {
			this.getdata();
		},
		onHide() {
			clearInterval(this.itl);
		},
		onUnload() {
			clearInterval(this.itl);
		},
		methods: {
			countDown() {
				if (this.leftTime <= 0) {
					this.hour = '00';
					this.minute = '00';
					this.second = '00';
					clearInterval(this.itl);
					return;
				}
				let times = this.leftTime;
				let h = Math.floor(times / 3600);
				let m = Math.floor((times / 60) % 60);
				let s = Math.floor(times % 60);

				this.hour = h < 10 ? "0" + h : h;
				this.minute = m < 10 ? "0" + m : m;
				this.second = s < 10 ? "0" + s : s;
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
							const data = res.data.data;
							that.is_exp = data.is_exp;
							that.leftTime = data.leftTime;
							that.user = data.user;
							that.dataList = data.jiangli.filter(item => item.type != 4);

							that.dataList.forEach(item => {
								if (item.type == 1) {
									item.state = (that.user.new_first_login >= item.num) ? 1 : 0;
								} else if (item.type == 2) {
									item.state = (that.user.new_over_task >= item.num) ? 1 : 0;
								} else if (item.type == 3) {
									item.state = (that.user.new_first_tixian >= item.num) ? 1 : 0;
								}
							});

							if (that.is_exp == 0) {
								that.countDown();
								that.itl = setInterval(() => {
									that.leftTime--;
									that.countDown();
								}, 1000);
							}
						}
					},
					fail(res) {},
					complete: () => {
						that.isLoading = false;
					}
				});
			},
			back() {
				uni.navigateBack({
					delta: 1
				});
			},
			tiao(myid, index, state, isling) {
				if (state && isling) {
					return; // 已领取
				} else if (!state) { // 去完成
					if (index == 2) {
						return uni.switchTab({
							url: "/pages/task/task"
						});
					} else if (index == 3) {
						return uni.navigateTo({
							url: "/pages/mine/wallet/withdrawal"
						});
					}
				} else if (state && !isling) { // 待领取
					uni.request({
						url: this.global.url + '/api/user/login_jl',
						method: "POST",
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							token: uni.getStorageSync('token').token,
							id: myid,
							type: index
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
			getButtonClass(item) {
				if (item.state && item.is_ling) {
					return 'completed';
				} else if (item.state && !item.is_ling) {
					return 'claimable';
				} else {
					return 'to-complete';
				}
			},
			getButtonText(item) {
				if (item.state && item.is_ling) {
					return '已领取';
				} else if (item.state && !item.is_ling) {
					return '领取';
				} else {
					return '去完成';
				}
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

	.skeleton-task-list {
		padding-top: 20rpx;
	}

	.skeleton-task-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.skeleton-card-left {
		display: flex;
		align-items: center;
	}

	.skeleton-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 16rpx;
		margin-right: 20rpx;
	}

	.skeleton-line {
		height: 24rpx;
		border-radius: 8rpx;
	}

	.skeleton-card-right {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 15rpx;
	}

	.skeleton-button {
		width: 120rpx;
		height: 56rpx;
		border-radius: 28rpx;
	}


	.noviciate-container {
		width: 100%;
		min-height: 100vh;
		background: url('../../../static/today/xinren.png') no-repeat;
		background-size: 100% 100%;
		padding-top: var(--status-bar-height);
		box-sizing: border-box;
	}

	.nav-bar {
		position: relative;
		height: 88rpx;
		display: flex;
		align-items: center;

		.back-icon {
			position: absolute;
			left: 28rpx;
			width: 60rpx;
			height: 60rpx;
		}
	}

	.content-wrapper {
		padding: 0 30rpx;
		margin-top: 320rpx;
	}

	.content-box {
		background-color: #fff;
		border-radius: 24rpx;
		padding: 20rpx 30rpx 30rpx;
		box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);
	}

	.countdown-timer {
		text-align: center;
		font-size: 28rpx;
		color: #666;
		padding: 20rpx 0;

		.timer {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 10rpx;
		}

		.time-value {
			font-size: 32rpx;
			font-weight: bold;
			color: $uni-color-primary;
		}
	}
	
	.task-list {
		max-height: calc(100vh - 600rpx);
		overflow-y: auto;
	}

	.task-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0;
		border-bottom: 1rpx solid #f0f0f0;
		&:last-child {
			border-bottom: none;
		}
	}

	.card-left {
		display: flex;
		align-items: center;

		.task-icon {
			width: 80rpx;
			height: 80rpx;
			margin-right: 20rpx;
			flex-shrink: 0;
		}

		.task-info {
			.task-title {
				font-size: 30rpx;
				font-weight: bold;
				color: #333;
			}

			.task-desc {
				font-size: 24rpx;
				color: #999;
				margin-top: 8rpx;
			}

			.task-progress {
				font-size: 24rpx;
				color: #666;
				margin-top: 8rpx;
			}
		}
	}

	.card-right {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10rpx;

		.reward {
			display: flex;
			align-items: center;
			color: $uni-color-primary;
			font-weight: bold;

			.reward-icon {
				width: 30rpx;
				height: 30rpx;
				margin-right: 8rpx;
			}

			.reward-amount {
				font-size: 32rpx;
			}
		}

		.action-btn {
			height: 56rpx;
			line-height: 56rpx;
			font-size: 24rpx;
			border-radius: 28rpx;
			padding: 0 30rpx;
			margin: 0;
			
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
