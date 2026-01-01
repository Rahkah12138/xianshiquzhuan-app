<template>
	<view class="user-profile-container">
		<!-- Skeleton Loading -->
		<view v-if="isLoading">
			<!-- Header Skeleton -->
			<view class="header-section">
				<view class="user-info">
					<view class="skeleton-avatar skeleton-animate"></view>
					<view class="user-details">
						<view class="skeleton-line skeleton-animate" style="width: 150rpx; height: 36rpx;"></view>
						<view class="skeleton-line skeleton-animate" style="width: 120rpx; margin-top: 15rpx;"></view>
					</view>
				</view>
			</view>

			<!-- Stats Card Skeleton -->
			<view class="stats-card">
				<view class="wallet-section">
					<view class="wallet-item" v-for="i in 2" :key="i">
						<view class="skeleton-line skeleton-animate" style="width: 100rpx; height: 36rpx;"></view>
						<view class="skeleton-line skeleton-animate" style="width: 120rpx; margin: 15rpx 0;"></view>
						<view class="skeleton-line skeleton-animate" style="width: 150rpx; height: 48rpx; border-radius: 30rpx;"></view>
					</view>
				</view>
				<view class="management-section">
					<view class="management-item" v-for="i in 2" :key="i">
						<view class="skeleton-icon skeleton-animate"></view>
						<view class="skeleton-line skeleton-animate" style="width: 180rpx; margin-top: 10rpx;"></view>
					</view>
				</view>
			</view>

			<!-- Membership Banner Skeleton -->
			<view class="membership-banner skeleton-animate" style="height: 80rpx;"></view>

			<!-- Services List Skeleton -->
			<view class="services-list">
				<view class="service-item" v-for="i in 5" :key="i">
					<view class="service-info">
						<view class="skeleton-icon skeleton-animate" style="width: 40rpx; height: 40rpx;"></view>
						<view class="skeleton-line skeleton-animate" style="width: 200rpx; margin-left: 20rpx;"></view>
					</view>
					<view class="skeleton-line skeleton-animate" style="width: 36rpx; height: 36rpx;"></view>
				</view>
			</view>
		</view>

		<template v-else>
			<!-- Header -->
			<view class="header-section">
				<view class="user-info">
				<image :src="userList.avatar" class="avatar"></image>
				<view class="user-details">
					<view class="username-row">
						<text class="username">{{ userList.nickname }}</text>
						<image :src="getImgUrl(userList.level_image)" class="level-badge"></image>
					</view>
					<text class="user-id">ID: {{ userList.id }}</text>
				</view>
				<view class="shop-link" @click="goSeverPage('/pages/task/user?id=', 10)">
					<image src="/static/user/dianpu.png" class="shop-icon"></image>
					<text>我的店铺</text>
				</view>
			</view>
		</view>

		<!-- Wallet & Stats -->
		<view class="stats-card">
			<view class="wallet-section">
				<view class="wallet-item">
					<text class="wallet-value primary">{{ userList.today_profit }}</text>
					<text class="wallet-label">今日收入</text>
					<button class="wallet-action" @click="jinrishouyi">去提现</button>
				</view>
				<view class="wallet-item">
					<text class="wallet-value primary">{{ userList.money }}</text>
					<text class="wallet-label">账户余额</text>
					<button class="wallet-action" @click="jinrishouyi">提现/充值</button>
				</view>
			</view>
			<view class="management-section">
				<view class="management-item" @click="lookOrder(5)">
					<view class="management-icon-wrapper">
						<image src='/static/user/rw.png' class="management-icon"></image>
					</view>
					<text class="management-label">我的报名</text>
					<text class="management-value">{{ userList.myorder }}</text>
				</view>
				<view class="management-item" @click="look(1)">
					<view class="management-icon-wrapper">
						<image src='/static/user/fb.png' class="management-icon"></image>
					</view>
					<text class="management-label">发布/管理任务</text>
					<text class="management-value">{{ userList.mytask }}</text>
				</view>
			</view>
		</view>

		<!-- Membership Banner -->
		<view class="membership-banner" @click="center">
			<image src="/static/wode/vip.png" class="vip-icon"></image>
			<text class="vip-text">会员等级越高 收益越高</text>
			<text class="vip-action">立即开通 ></text>
		</view>

		<!-- Services List -->
		<view class="services-list">
			<view class="service-item" v-for="(item, index) in serveList" :key="index" @click="goSeverPage(item.url, index, item.type)">
				<view class="service-info">
					<image :src="item.imgUrl" class="service-icon"></image>
					<text class="service-label">{{ item.text }}</text>
				</view>
				<view class="service-action">
					<view class="notification-badge" v-if="notice && item.is_notice">{{ notice }}</view>
					<image src="/static/user/zhan.png" class="arrow-icon"></image>
				</view>
			</view>
			<view class="service-item" @click="goSeverPage('/pages/mine/setUp/setUp', -1, null)">
				<view class="service-info">
					<image src="/static/my/7.png" class="service-icon"></image>
					<text class="service-label">设置中心</text>
				</view>
				<view class="service-action">
					<image src="/static/user/zhan.png" class="arrow-icon"></image>
				</view>
			</view>
		</view>
		</template>
		<custom-tab-bar current="user"></custom-tab-bar>
	</view>
</template>

<script>
	import customTabBar from '@/components/custom-tab-bar.vue';
	export default {
		components: {
			customTabBar
		},
		data() {
			return {
				isLoading: true,
				notice: 0,
				userList: {},
				serveList: [{
						imgUrl: "/static/my/1.png",
						text: "邀请好友赢万元大奖",
						url: "/pages/home/subpage/subPagesShare/invite",
					},
					{
						imgUrl: "/static/my/2.png",
						text: "我的推广好友",
						url: "/pages/mine/subPage/myTeam"
					},
					{
						imgUrl: "/static/my/3.png",
						text: "举报维权",
						url: "/pages/mine/report/report",
						type: 1,
					},
					{
						imgUrl: "/static/my/4.png",
						text: "消息中心",
						url: "/pages/home/subpage/news",
						is_notice: 1,
					},
					{
						imgUrl: "/static/my/5.png",
						text: "帮助中心",
						url: "/pages/home/subpage/help"
					},
					{
						imgUrl: "/static/my/6.png",
						text: "违规名单",
						url: "/pages/mine/subPage/blackHouse"
					},
					{
						imgUrl: "/static/my/8.png",
						text: "客服中心",
						url: "/pages/home/subpage/customer",
						type: 4,
					},
					{
						imgUrl: "/static/my/7.png",
						text: "设置中心",
						url: "/pages/mine/setUp/setUp"
					},
				],
			}
		},
		onShow() {
			this.init();
		},
		methods: {
			init() {
				this.userInfo();
				this.get_huoweidu();
			},
			get_huoweidu() {
				// Mocking unread count
			},
			center() {
				uni.navigateTo({
					url: "/pages/member/member"
				});
			},
			jinrishouyi() {
				uni.navigateTo({
					url: "/pages/mine/wallet/myWallet"
				});
			},
			look(i) {
				uni.navigateTo({
					url: `/pages/mine/rewardManagement/rewardManagement?type=${i}`
				});
			},
			lookOrder(i) {
				uni.navigateTo({
					url: `/pages/mine/myOrder/myOrder?type=${i}`
				});
			},
			goSeverPage(url, index, type) {
				if (type === 4) {
					this.goKefu();
					return;
				}
				if (index === 10) { // Assuming this is "My Shop"
					let id = uni.getStorageSync('user1').id;
					uni.navigateTo({
						url: `${url}${id}`
					});
				} else {
					uni.navigateTo({
						url: url
					});
				}
			},
			goKefu() {
				uni.request({
					url: `${this.global.url}/api/message/createRoom`,
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
						id: 'kefu',
					},
					success: (res) => {
						if (res.data.code === 1) {
							uni.navigateTo({
								url: `/pages/home/subpage/consultDetail?room_id=${res.data.data.room_id}`
							});
						}
					}
				});
			},
			userInfo() {
				uni.request({
					url: `${this.global.url}/api/user/index`,
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
					},
					success: (res) => {
						if (res.data && res.data.code === 1 && res.data.data) {
							this.notice = res.data.data.notice;
							this.userList = res.data.data;
							uni.setStorageSync('user1', res.data.data);
						} else if (res.data && res.data.code === 401) {
							uni.clearStorageSync();
							uni.reLaunch({
								url: '/pages/home/login/login'
							});
						}
					},
					complete: () => {
						this.isLoading = false;
					}
				});
			},
			getImgUrl(imae) {
				return this.global.url + imae;
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

	.skeleton-avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
	}

	.skeleton-line {
		height: 28rpx;
		border-radius: 8rpx;
	}

	.skeleton-icon {
		width: 48rpx;
		height: 48rpx;
		border-radius: 8rpx;
	}

	.user-profile-container {
		background-color: #f7f8fa;
		min-height: 100vh;
	}

	.header-section {
		background: $uni-color-primary;
		padding: 80rpx 30rpx 120rpx;
		border-bottom-left-radius: 50rpx;
		border-bottom-right-radius: 50rpx;
		color: #fff;
	}

	.user-info {
		display: flex;
		align-items: center;
	}

	.avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		border: 4rpx solid rgba(255, 255, 255, 0.5);
	}

	.user-details {
		flex: 1;
		margin-left: 20rpx;
	}

	.username-row {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.username {
		font-size: 36rpx;
		font-weight: bold;
	}

	.level-badge {
		width: 40rpx;
		height: 40rpx;
		margin-left: 15rpx;
	}

	.user-id {
		font-size: 26rpx;
		opacity: 0.8;
	}

	.shop-link {
		display: flex;
		align-items: center;
		background-color: rgba(255, 255, 255, 0.2);
		padding: 10rpx 20rpx;
		border-radius: 30rpx;
		font-size: 24rpx;

		.shop-icon {
			width: 36rpx;
			height: 36rpx;
			margin-right: 10rpx;
		}
	}

	.stats-card {
		background: #fff;
		margin: -80rpx 30rpx 30rpx;
		border-radius: 20rpx;
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.08);
		padding: 30rpx;
	}

	.wallet-section {
		display: flex;
		text-align: center;
		padding-bottom: 30rpx;
		border-bottom: 1px solid #f5f5f5;
	}

	.wallet-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;

		.wallet-value {
			font-size: 36rpx;
			font-weight: 700;

			&.primary {
				color: $uni-color-primary;
			}
		}

		.wallet-label {
			font-size: 26rpx;
			color: #666;
			margin: 10rpx 0;
		}

		.wallet-action {
			font-size: 24rpx;
			color: $uni-color-primary;
			background-color: #ffeeed;
			padding: 6rpx 18rpx;
			border-radius: 30rpx;
			line-height: 1.5;
		}
	}

	.management-section {
		display: flex;
		text-align: center;
		padding-top: 30rpx;
	}

	.management-item {
		flex: 1;
		border-right: 1px solid #f5f5f5;

		&:last-child {
			border-right: none;
		}

		.management-icon-wrapper {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 10rpx;
		}

		.management-icon {
			width: 48rpx;
			height: 48rpx;
		}

		.management-label {
			font-size: 26rpx;
			color: #333;
		}

		.management-value {
			font-size: 28rpx;
			color: $uni-color-primary;
			font-weight: bold;
			display: block;
			margin-top: 5rpx;
		}
	}

	.membership-banner {
		display: flex;
		align-items: center;
		background: linear-gradient(90deg, #434343, #000000);
		color: #fff;
		margin: 0 30rpx 30rpx;
		padding: 20rpx 30rpx;
		border-radius: 16rpx;

		.vip-icon {
			width: 40rpx;
			height: 40rpx;
			margin-right: 15rpx;
		}

		.vip-text {
			font-size: 26rpx;
			opacity: 0.8;
		}

		.vip-action {
			margin-left: auto;
			font-size: 24rpx;
			background: linear-gradient(90deg, #fde3b6, #ffd182);
			color: #3d2400;
			padding: 8rpx 16rpx;
			border-radius: 30rpx;
		}
	}

	.services-list {
		background: #fff;
		margin: 0 30rpx;
		border-radius: 20rpx;
		padding: 10rpx 30rpx;
	}

	.service-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 0;
		border-bottom: 1px solid #f5f5f5;

		&:last-child {
			border-bottom: none;
		}
	}

	.service-info {
		display: flex;
		align-items: center;
	}

	.service-icon {
		width: 40rpx;
		height: 40rpx;
		margin-right: 20rpx;
	}

	.service-label {
		font-size: 30rpx;
		color: #333;
	}

	.service-action {
		display: flex;
		align-items: center;
	}

	.notification-badge {
		background-color: red;
		color: #fff;
		font-size: 22rpx;
		min-width: 36rpx;
		height: 36rpx;
		line-height: 36rpx;
		text-align: center;
		border-radius: 50%;
		margin-right: 15rpx;
	}

	.arrow-icon {
		width: 36rpx;
		height: 36rpx;
		opacity: 0.5;
	}
</style>
