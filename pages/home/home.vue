<template>
	<view class="home-container">
		<!-- Skeleton Screen -->
		<view class="skeleton" v-if="isLoading">
			<view class="skeleton-header"></view>
			<view class="skeleton-grid"></view>
			<view class="skeleton-bar"></view>
			<view class="skeleton-list"></view>
		</view>

		<!-- Header -->
		<view class="header-section" :style="{ paddingTop: statusBarHeight + 'px' }">
			<view class="search-bar">
				<view class="search-input-wrapper" @click="navToSearch">
					<image src="/static/index/search.png" class="search-icon"></image>
					<input type="text" placeholder="任务标题、编号、用户ID、项目名" disabled />
				</view>
				<view class="publish-btn" @click="newCourse">
					<image src="/static/releaseImg.png" class="publish-icon"></image>
					<text>发布悬赏</text>
				</view>
			</view>
		</view>

		<!-- Main Content -->
		<scroll-view class="scroll-view" scroll-y :refresher-enabled="true" :refresher-triggered="isRefreshing" @refresherrefresh="onRefresh">
			<!-- Top Tasks (只在推荐悬赏标签下显示) -->
			<view class="top-tasks-grid" v-if="listQuantity === 0">
				<view class="task-card-sm" v-for="(task, index) in showList.slice(0, 6)" :key="`top-${index}`" @click="navToDetail(task.id, task.type)">
					<image class="top-badge" src="/static/top.png"></image>
					<image :src="task.avatar.includes('http') ? task.avatar : global.url + task.avatar" class="task-avatar-sm"></image>
					<text class="task-title-sm">{{ task.title }}</text>
					<view class="task-info-sm">
						<text>{{ task.received }}人已赚</text>
						<text>剩余{{ task.surplus }}</text>
					</view>
					<view class="task-tags-sm">
						<text class="tag">{{ task.tasktypename }}</text>
						<text class="tag">{{ task.entryname }}</text>
					</view>
					<view class="task-price-sm">
						<text class="price-icon">赏</text>
						<text>￥{{ task.price }}</text>
					</view>
				</view>
			</view>

			<!-- Categories -->
			<view class="category-section">
				<view class="category-grid">
					<view class="category-item" v-for="(c, i) in classifyArr1" :key="i" @click="navToPlat(c)">
						<image :src="c.image" class="category-icon"></image>
						<text class="category-name">{{ c.name }}</text>
					</view>
				</view>
			</view>

			<!-- Announcements -->
			<view class="announcement-bar">
				<image src="/static/index/messa.png" class="announcement-icon"></image>
				<text class="announcement-title">公告</text>
				<swiper class="announcement-swiper" autoplay vertical circular interval="3000">
					<swiper-item v-for="(b, i) in msgArr" :key="i" @click="newsDetail(b.id)">
						<text class="announcement-text">{{ b.name }}</text>
					</swiper-item>
				</swiper>
			</view>

			<!-- Task List -->
			<view class="task-list-section">
				<view class="list-tabs">
					<view class="tab-item" :class="{ active: listQuantity === 0 }" @click="go(0)">
						<text>推荐悬赏</text>
						<view class="active-indicator" v-if="listQuantity === 0"></view>
					</view>
					<view class="tab-item" :class="{ active: listQuantity === 1 }" @click="go(1)">
						<text>急速快审</text>
						<view class="active-indicator" v-if="listQuantity === 1"></view>
					</view>
				</view>

				<view class="task-list">
					<view class="task-card-lg" v-for="(task, index) in (listQuantity === 0 ? showList.slice(6) : showList)" :key="`task-${index}`" @click="navToDetail(task.id, task.type)">
						<image :src="task.avatar ? task.avatar : '/static/default-avatar.png'" class="task-avatar-lg"></image>
						<view class="task-details">
							<view class="task-header">
								<text class="task-title-lg">{{ task.title }}</text>
								<view class="task-badges">
									<image v-if="task.bond > 0" src="/static/index/bao.png" class="badge-icon"></image>
									<image v-if="task.top === 1" src="/static/index/ding.png" class="badge-icon"></image>
									<image v-if="task.is_jisu === 1" src="/static/index/kuaishen.png" class="badge-icon"></image>
									<image v-if="task.recommend === 1" src="/static/shouye/icon_tui@2x.png" class="badge-icon"></image>
								</view>
								<view class="task-price-lg">
									<text class="price-symbol">+</text>
									<text class="price-amount">{{ task.price }}</text>
									<text>元</text>
								</view>
							</view>
							<view class="task-footer">
								<view class="task-tags-lg">
									<text class="tag">{{ task.tasktypename }}</text>
									<text class="tag">{{ task.entryname }}</text>
								</view>
								<view class="task-stats">
									<text>{{ task.received }}人已赚</text>
									<text class="separator">|</text>
									<text>剩余：{{ task.surplus }}个</text>
								</view>
							</view>
						</view>
					</view>
					<loading v-show="isloading && !isRefreshing"></loading>
				</view>
			</view>
		</scroll-view>

		<!-- Floating Action Buttons -->
		<view class="fab-container">
			<view class="fab-item" @click="randomNavToDetail">
				<image src="/static/zhuanqian.png" class="fab-icon animated"></image>
			</view>
			<view class="fab-item" @click="goConsult()">
				<view class="unread-badge" v-if="unreadTotal > 0">{{ unreadTotal }}</view>
				<image src="/static/chuli.png" class="fab-icon"></image>
			</view>
		</view>
		<down ref="downMask"></down>
		<custom-tab-bar current="home"></custom-tab-bar>
	</view>
</template>

<script>
	import customTabBar from '@/components/custom-tab-bar.vue'
	import down from '@/components/downMask.vue'
	import loading from '@/components/loading/loading'
	import aloysTab from "@/components/aloys-tab/aloys-tab.vue";
	// #ifdef APP-PLUS
	const xuanshangModule = uni.requireNativePlugin('LingKu-XuanShangModule');
	// #endif
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;

	export default {
		components: {
			down,
			loading,
			aloysTab,
			customTabBar
		},
		data() {
			return {
				isLoading: true,
				isloading: false,
				isRefreshing: false,
				userInfo: {},
				msgArr: [],
				taskArr: [],
				bannerArr: [],
				classifyArr1: [],
				statusBarHeight: statusBarHeight,
				listQuantity: 0,
				jisutaskList: [],
				showList: [],
				recommend_task: '',
				shop_recommend: '',
				ul: '',
				page: 1,
				jisu_page: 1,
				is_over: false,
				jisu_over: false,
				unreadTotal: '',
			}
		},
		onShow() {
			this.init();
		},
		onReachBottom() {
			if (this.listQuantity === 0) {
				if (!this.is_over) {
					this.page++;
					this.getIndex();
				}
			} else {
				if (!this.jisu_over) {
					this.jisu_page++;
					this.getJisu();
				}
			}
		},
		onLoad() {
			this.ul = this.global.url;
		},
		methods: {
			init() {
				let token = uni.getStorageSync('token');
				if (!token) {
					uni.reLaunch({
						url: '/pages/home/login/login'
					});
					return;
				}
				this.userInfo = token;
				this.getUserInfo();
				this.initData();
				// 检查版本更新
				// #ifdef APP-PLUS
				this.$nextTick(() => {
					if (this.$refs.downMask) {
						this.$refs.downMask.init();
					}
				});
				// #endif
			},
			onRefresh() {
				this.isRefreshing = true;
				this.initData();
			},
			initData() {
				this.is_over = false;
				this.jisu_over = false;
				this.page = 1;
				this.jisu_page = 1;
				this.taskArr = [];
				this.jisutaskList = [];
				if (this.listQuantity === 0) {
					this.getIndex();
				} else {
					this.getJisu();
				}
				this.getUnreadList();
			},
			getUnreadList() {
				uni.request({
					url: this.global.url + '/api/Notice/dealingList',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: this.userInfo.token
					},
					success: (res) => {
						if (res.data && res.data.data) {
							this.unreadTotal = res.data.data.unreadTotal || 0;
						}
					}
				});
			},
			getUserInfo() {
				uni.request({
					url: this.global.url + "/api/user/index",
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: this.userInfo.token,
					},
					success: (res) => {
						if (res.data.code === 401) {
							uni.reLaunch({
								url: '/pages/home/login/login'
							});
						}
					}
				});
			},
			getIndex() {
				this.isloading = this.page > 1;
				uni.request({
					url: this.global.url + '/api/index/index',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						page: this.page,
					},
					success: (res) => {
						if (!res.data || !res.data.data) return;
						const data = res.data.data;
						this.msgArr = data.notice || [];
						this.bannerArr = data.carousel || [];
						if (data.category && this.classifyArr1.length < 1) {
							this.classifyArr1 = data.category.filter(item => item.id !== 18).slice(0, 10);
						}
						if (data.recommend && data.recommend.data) {
							const list = data.recommend.data;
							if (this.page === 1) {
								this.taskArr = list;
							} else {
								this.taskArr = this.taskArr.concat(list);
							}
							this.showList = this.taskArr;
							if (data.recommend.last_page === data.recommend.current_page) {
								this.is_over = true;
							}
						}
					},
					complete: () => {
						this.isloading = false;
						this.isRefreshing = false;
						this.isLoading = false;
					}
				});
			},
			getJisu() {
				this.isloading = this.jisu_page > 1;
				uni.request({
					url: this.global.url + '/api/index/jisu',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						page: this.jisu_page,
						token: this.userInfo.token,
					},
					success: (res) => {
						if (res.data.code === 401) {
							uni.reLaunch({
								url: '/pages/home/login/login'
							});
							return;
						}
						const list = res.data.data.jisutask.data;
						if (this.jisu_page === 1) {
							this.jisutaskList = list;
						} else {
							this.jisutaskList = this.jisutaskList.concat(list);
						}
						this.showList = this.jisutaskList;
						if (res.data.data.jisutask.last_page === res.data.data.jisutask.current_page) {
							this.jisu_over = true;
						}
					},
					complete: () => {
						this.isloading = false;
						this.isRefreshing = false;
						this.isLoading = false;
					}
				});
			},
			go(index) {
				this.listQuantity = index;
				if (index === 1) {
					if (this.jisutaskList.length === 0) this.getJisu();
					else this.showList = this.jisutaskList;
				} else {
					if (this.taskArr.length === 0) this.getIndex();
					else this.showList = this.taskArr;
				}
			},
			navToDetail(id, type) {
				// #ifdef APP-PLUS
				if (type === 2) {
					xuanshangModule.show({
						userId: this.userInfo.user_id,
						pageRouter: `task_union_detail?task_id=${id}`
					});
				} else {
					uni.navigateTo({
						url: `/pages/task/detail?id=${id}`
					});
				}
				// #endif
				// #ifndef APP-PLUS
				uni.navigateTo({
					url: `/pages/task/detail?id=${id}`
				});
				// #endif
			},
			navToSearch() {
				uni.navigateTo({
					url: '/pages/home/subpage/search'
				});
			},
			newCourse() {
				uni.navigateTo({
					url: '/pages/pagesFind/publishTask/publishTask'
				});
			},
			newsDetail(id) {
				uni.navigateTo({
					url: `/pages/home/subpage/newdetail?id=${id}`
				});
			},
			navToPlat(obj) {
				if (!this.userInfo) {
					return uni.reLaunch({
						url: '/pages/home/login/login'
					});
				}
				// #ifdef APP-PLUS
				if (obj.id === 22) {
					return xuanshangModule.show({
						userId: this.userInfo.user_id
					});
				}
				// #endif
				if (obj.jump_type === 1) uni.switchTab({
					url: obj.jump_url
				});
				else if (obj.jump_type === 2 || obj.jump_type === 3) uni.navigateTo({
					url: obj.jump_url
				});
				else if (obj.jump_type === 4) {
					// #ifdef APP-PLUS
					plus.runtime.openURL(obj.jump_url);
					// #endif
				}
			},
			goConsult() {
				uni.navigateTo({
					url: "/pages/home/subpage/dealing"
				});
			},
			randomNavToDetail() {
				if (this.showList.length > 0) {
					const randomIndex = Math.floor(Math.random() * this.showList.length);
					const task = this.showList[randomIndex];
					this.navToDetail(task.id, task.type);
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.skeleton {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #f7f8fa;
		z-index: 999;
		padding: 20rpx 30rpx;
		box-sizing: border-box;

		.skeleton-header, .skeleton-grid, .skeleton-bar, .skeleton-list {
			background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
			background-size: 200% 100%;
			animation: skeleton-animation 1.5s infinite linear;
		}

		.skeleton-header {
			height: 120rpx;
			border-radius: 10rpx;
			margin-bottom: 20rpx;
		}

		.skeleton-grid {
			height: 200rpx;
			border-radius: 20rpx;
			margin-bottom: 20rpx;
		}

		.skeleton-bar {
			height: 80rpx;
			border-radius: 16rpx;
			margin-bottom: 20rpx;
		}

		.skeleton-list {
			height: 400rpx;
			border-radius: 20rpx;
		}
	}

	@keyframes skeleton-animation {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	.home-container {
		background-color: #f7f8fa;
		min-height: 100vh;
	}

	.header-section {
		background: $uni-color-primary;
		padding-bottom: 6rpx;
		border-bottom-left-radius: 10rpx;
		border-bottom-right-radius: 10rpx;
	}

	.search-bar {
		display: flex;
		align-items: center;
		padding: 20rpx 30rpx;
	}

	.search-input-wrapper {
		flex: 1;
		display: flex;
		align-items: center;
		background: #f7f8fa;
		border-radius: 40rpx;
		padding: 0rpx 20rpx;
		height: 54rpx;

		.search-icon {
			width: 32rpx;
			height: 32rpx;
			margin-right: 15rpx;
		}

		input {
			font-size: 26rpx;
			color: #666;
			flex: 1;
		}
	}

	.publish-btn {
		display: flex;
		align-items: center;
		margin-left: 20rpx;
		color: $uni-color-primary;
		font-size: 26rpx;
		background: #fff;
		padding: 10rpx 20rpx;
		border-radius: 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		animation: pulse 1.5s infinite;

		.publish-icon {
			width: 36rpx;
			height: 36rpx;
			margin-right: 10rpx;
			background-color: $uni-color-primary;
			border-radius: 50%;
			padding: 4rpx;
		}
	}

	@keyframes pulse {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
		100% {
			transform: scale(1);
		}
	}

	.scroll-view {
		height: calc(100vh - 120rpx - var(--status-bar-height));
	}

	.top-tasks-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20rpx;
		padding: 20rpx 30rpx;
	}

	.task-card-sm {
		background: #fff;
		border-radius: 20rpx;
		padding: 20rpx;
		text-align: center;
		position: relative;
		overflow: hidden;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

		.top-badge {
			position: absolute;
			top: 0;
			left: 0;
			width: 50rpx;
			height: 50rpx;
		}

		.task-avatar-sm {
			width: 60rpx;
			height: 60rpx;
			border-radius: 12rpx;
			margin-bottom: 10rpx;
		}

		.task-title-sm {
			font-size: 26rpx;
			font-weight: 600;
			color: #333;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			display: block;
		}

		.task-info-sm {
			display: flex;
			justify-content: space-around;
			font-size: 20rpx;
			color: #999;
			margin: 10rpx 0;
		}

		.task-tags-sm {
			display: flex;
			justify-content: space-around;
			gap: 10rpx;
			margin-bottom: 10rpx;

			.tag {
				background: #ffeeed;
				color: $uni-color-primary;
				font-size: 20rpx;
				padding: 4rpx 8rpx;
				border-radius: 8rpx;
				white-space: nowrap;
			}
		}

		.task-price-sm {
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 28rpx;
			font-weight: bold;
			color: $uni-color-primary;

			.price-icon {
				background: $uni-color-primary;
				color: #fff;
				width: 34rpx;
				height: 34rpx;
				line-height: 34rpx;
				border-radius: 50%;
				font-size: 22rpx;
				margin-right: 8rpx;
			}
		}
	}

	.category-section {
		margin: 0 30rpx;
		background: #fff;
		border-radius: 20rpx;
		padding: 0rpx 0;
	}

	.category-grid {
		display: flex;
		justify-content: space-around;
		padding: 20rpx 0;
	}

	.category-item {
		text-align: center;
		flex: 1;

		.category-icon {
			width: 80rpx;
			height: 80rpx;
			margin-bottom: 10rpx;
		}

		.category-name {
			font-size: 24rpx;
			color: #666;
			white-space: nowrap;
		}
	}

	.announcement-bar {
		display: flex;
		align-items: center;
		margin: 20rpx 30rpx;
		padding: 15rpx 20rpx;
		background: #fff;
		border-radius: 16rpx;
		font-size: 26rpx;

		.announcement-icon {
			width: 36rpx;
			height: 36rpx;
			margin-right: 15rpx;
		}

		.announcement-title {
			color: #333;
			font-weight: 500;
			padding-right: 15rpx;
			border-right: 1px solid #eee;
		}

		.announcement-swiper {
			flex: 1;
			height: 40rpx;
			line-height: 40rpx;
			margin-left: 15rpx;

			.announcement-text {
				color: #666;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}

	.task-list-section {
		background: #fff;
		margin: 20rpx 30rpx;
		border-radius: 20rpx;
		padding: 0 30rpx 30rpx;
	}

	.list-tabs {
		display: flex;
		border-bottom: 1px solid #f5f5f5;

		.tab-item {
			flex: 1;
			text-align: center;
			padding: 30rpx 0;
			font-size: 30rpx;
			color: #666;
			position: relative;

			&.active {
				color: $uni-color-primary;
				font-weight: 600;

				.active-indicator {
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);
					width: 60rpx;
					height: 6rpx;
					background: $uni-color-primary;
					border-radius: 3rpx;
				}
			}
		}
	}

	.task-list {
		padding-top: 20rpx;
	}

	.task-card-lg {
		display: flex;
		padding: 30rpx 0;
		border-bottom: 1px solid #f5f5f5;

		&:last-child {
			border-bottom: none;
		}

		.task-avatar-lg {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			margin-right: 20rpx;
		}

		.task-details {
			flex: 1;
		}

		.task-header {
			display: flex;
			align-items: center;
			margin-bottom: 15rpx;

			.task-title-lg {
				font-size: 28rpx;
				color: #333;
				font-weight: 500;
				flex-shrink: 1;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.task-badges {
				display: flex;
				align-items: center;
				margin-left: 10rpx;
				flex-shrink: 0;

				.badge-icon {
					width: 30rpx;
					height: 30rpx;
					margin: 0 5rpx;
				}
			}

			.task-price-lg {
				margin-left: auto;
				font-size: 24rpx;
				font-weight: bold;
				color: $uni-color-primary;
				flex-shrink: 0;

				.price-amount {
					font-size: 32rpx;
				}
			}
		}

		.task-footer {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 22rpx;
			color: #999;

			.task-tags-lg {
				display: flex;
				gap: 10rpx;

				.tag {
					background: #eef9ff;
					color: #5297ff;
					padding: 6rpx 12rpx;
					border-radius: 8rpx;
				}
			}

			.task-stats {
				display: flex;
				align-items: center;

				.separator {
					margin: 0 10rpx;
				}
			}
		}
	}

	.fab-container {
		position: fixed;
		right: 30rpx;
		bottom: 160rpx;
		z-index: 100;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.fab-item {
		position: relative;
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.1);
		transform: translateZ(0);

		.fab-icon {
			width: 100%;
			height: 100%;
		}

		.animated {
			animation: pulse 1.5s infinite;
		}

		.unread-badge {
			position: absolute;
			top: -5rpx;
			right: -5rpx;
			background: #ff4d4f;
			color: #fff;
			min-width: 36rpx;
			height: 36rpx;
			line-height: 36rpx;
			border-radius: 50%;
			font-size: 20rpx;
			text-align: center;
			padding: 0 5rpx;
			font-weight: bold;
			z-index: 1;
		}
	}
</style>
