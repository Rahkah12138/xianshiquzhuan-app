<template>
	<view class="page-container">
		<!-- Loading Skeleton -->
		<view v-if="loading" class="skeleton-container">
			<view class="skeleton-item" v-for="n in 5" :key="n">
				<view class="skeleton-avatar"></view>
				<view class="skeleton-info">
					<view class="skeleton-name"></view>
					<view class="skeleton-id"></view>
				</view>
			</view>
		</view>

		<!-- User List -->
		<scroll-view v-else-if="list.length > 0" scroll-y="true" class="user-list-container">
			<view class="user-card" v-for="(item, index) in list" :key="item.id" @click="toDetail(item.id)" :style="{ animationDelay: (index * 0.1) + 's' }">
				<image v-if="item.toUser && item.toUser.avatar" :src="item.toUser.avatar" mode="aspectFill" class="avatar"></image>
				<view v-else class="avatar-placeholder"></view>
				<view class="info">
					<view class="name" v-if="item.toUser && item.toUser.nickname">{{item.toUser.nickname}}</view>
					<view class="id" v-if="item.toUser && item.toUser.id">ID: {{item.toUser.id}}</view>
				</view>
			</view>
		</scroll-view>

		<!-- Empty State -->
		<view v-else class="empty-container">
			<image src="/static/common/empty.png" class="empty-icon" mode="widthFix"></image>
			<text class="empty-text">暂无成员</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				loading: true, // Add loading state
				room_id: null
			}
		},
		onLoad(option) {
			this.room_id = option.room_id
			this.getUnreadList();
		},
		methods: {
			getUnreadList() {
				this.loading = true;
				uni.request({
					url: this.global.url + '/api/message/getChatList',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						room_id: this.room_id,
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						if (res.data && res.data.code == 1 && Array.isArray(res.data.data)) {
							// Filter out items that don't have a valid user object or user id
							this.list = res.data.data.filter(item => item.toUser && item.toUser.id);
						} else {
							this.list = [];
							uni.showToast({
								title: '加载失败：' + (res.data.msg || '数据格式错误'),
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						this.list = [];
						uni.showToast({
							title: '网络请求失败',
							icon: 'none'
						});
					},
					complete: () => {
						this.loading = false; // Stop loading in any case
					}
				})
			},
			toDetail(id) {
				uni.navigateTo({
					url: "/pages/home/subpage/consultDetail?room_id=" + id
				})
			}
		}
	}
</script>

<style scoped>
	.page-container {
		background-color: #f7f8fa;
		min-height: 100vh;
	}

	/* --- Skeleton Loader --- */
	.skeleton-container {
		padding: 30rpx;
	}
	.skeleton-item {
		display: flex;
		align-items: center;
		padding: 20rpx;
		background-color: #ffffff;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
	}
	.skeleton-avatar {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		background-color: #e9e9e9;
		margin-right: 20rpx;
		animation: shimmer 1.5s infinite linear;
	}
	.skeleton-info {
		flex: 1;
	}
	.skeleton-name {
		width: 40%;
		height: 30rpx;
		background-color: #e9e9e9;
		border-radius: 8rpx;
		margin-bottom: 20rpx;
		animation: shimmer 1.5s infinite linear;
	}
	.skeleton-id {
		width: 60%;
		height: 24rpx;
		background-color: #e9e9e9;
		border-radius: 8rpx;
		animation: shimmer 1.5s infinite linear;
	}
	@keyframes shimmer {
		0% { background-color: #e9e9e9; }
		50% { background-color: #f5f5f5; }
		100% { background-color: #e9e9e9; }
	}

	/* --- User List --- */
	.user-list-container {
		padding: 20rpx;
		box-sizing: border-box;
	}
	.user-card {
		display: flex;
		align-items: center;
		background-color: #ffffff;
		padding: 30rpx;
		border-radius: 20rpx;
		margin-bottom: 25rpx;
		box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
		opacity: 0; /* Initial state for animation */
		transform: translateY(20px); /* Initial state for animation */
		animation: slide-in-bottom 0.5s forwards;
	}
	.avatar {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		margin-right: 25rpx;
		background-color: #f0f0f0;
	}
	.info {
		flex: 1;
	}
	.name {
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 10rpx;
	}
	.id {
		font-size: 26rpx;
		color: #999;
	}
	@keyframes slide-in-bottom {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* --- Empty State --- */
	.empty-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 200rpx;
		opacity: 0.7;
	}
	.empty-icon {
		width: 280rpx;
	}
	.empty-text {
		font-size: 28rpx;
		color: #999;
		margin-top: 20rpx;
	}
</style>
