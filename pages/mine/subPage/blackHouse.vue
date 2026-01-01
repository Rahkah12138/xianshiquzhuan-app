<template>
	<view class="blackhouse-container">
		<view v-if="loading" class="skeleton">
			<view class="skeleton-item" v-for="n in 3" :key="n"></view>
		</view>
		<view v-else class="user-list">
			<view class="user-card" v-for="(item, index) in blackList" :key="index" :style="{ animationDelay: index * 0.1 + 's' }">
				<view class="card-header">
					<image :src="getImgUrl(item.avatar)" class="avatar"></image>
					<view class="user-info">
						<view class="id">ID: {{ item.id }}</view>
						<view class="time">拉黑时间: {{ item.frozentime }}</view>
					</view>
				</view>
				<view class="card-body">
					<view class="reason">
						<view class="label">拉黑原因：</view>
						<view class="text">{{ item.reason }}</view>
					</view>
					<view class="punishment">
						<view class="label">拉黑惩罚：</view>
						<view class="text">{{ item.punishment }}</view>
					</view>
					<view class="punishment-details">
						<view class="label">详细惩罚：</view>
						<view class="text">禁止登录，禁止接单，禁止提现，禁止发单</view>
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
				blackList: [],
				page: 1,
				totalPage: "",
				loading: true,
			}
		},
		onLoad() {
			this.getHouse(1)
		},
		onReachBottom() {
			if (this.page >= this.totalPage) {
				uni.showToast({
					title: "已加载全部数据",
					icon: 'none'
				})
			} else {
				this.page++;
				this.getHouse(this.page)
			}
		},
		methods: {
			getHouse(page) {
				let that = this;
				uni.request({
					url: that.global.url + "/api/user/black_house",
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
						page: that.page
					},
					success: (res) => {
						if (res.data.code == 1) {
							that.totalPage = res.data.data.last_page;
							that.blackList = that.blackList.concat(res.data.data.data);
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: "none"
							})
						}
						that.loading = false;
					}
				})
			},
			getImgUrl(imae) {
				if (imae.includes('http')) {
					return imae;
				} else {
					return this.global.url + imae;
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.blackhouse-container {
		background-color: #f5f5f5;
		min-height: 100vh;
		padding: 30rpx;
	}

	.skeleton {
		padding-top: 30rpx;
	}

	.skeleton-item {
		height: 300rpx;
		background-color: #e9e9e9;
		border-radius: 20rpx;
		margin-bottom: 30rpx;
		animation: pulse 1.5s infinite ease-in-out;
	}

	.user-card {
		background-color: #ffffff;
		border-radius: 20rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
		animation: fade-in 0.5s ease-out forwards;
		opacity: 0;
	}

	.card-header {
		display: flex;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1rpx solid #eee;
	}

	.avatar {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		margin-right: 30rpx;
	}

	.user-info {
		font-size: 28rpx;
	}

	.id {
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
	}

	.time {
		color: #999;
	}

	.card-body {
		padding: 30rpx;
		font-size: 28rpx;
		color: #666;
	}

	.reason,
	.punishment,
	.punishment-details {
		display: flex;
		margin-bottom: 20rpx;
	}

	.label {
		font-weight: bold;
		color: #333;
		margin-right: 10rpx;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(20px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes pulse {
		0% {
			background-color: #e9e9e9;
		}

		50% {
			background-color: #f5f5f5;
		}

		100% {
			background-color: #e9e9e9;
		}
	}
</style>
