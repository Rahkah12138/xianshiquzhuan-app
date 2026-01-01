<template>
	<view class="task-page-container">
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
			<!-- Tabs -->
			<view class="tabs-bar">
				<view :class="['tab-item', { 'active': index === i }]" v-for="(a, i) in current" :key="i" @click="cutItem(i)">
					<text>{{ a }}</text>
					<view class="dropdown-arrow" v-if="i === 0">
						<text :class="{ 'up': isJoin }">▼</text>
					</view>
				</view>
			</view>
		</view>

		<!-- Filter Panel -->
		<view class="filter-panel" v-if="isJoin" @touchmove.stop.prevent>
			<view class="filter-mask" @click="join"></view>
			<view class="filter-content">
				<view class="filter-group">
					<text class="filter-title">请选择类型</text>
					<view class="filter-options">
						<button :class="['option-btn', { 'active': index1 === -1 }]" @click="setType(-1)">全部</button>
						<button :class="['option-btn', { 'active': index1 === i }]" v-for="(b, i) in typeArr" :key="i" @click="setType(i)">{{ b.name }}</button>
					</view>
				</view>
				<view class="filter-group">
					<text class="filter-title">请选择设备</text>
					<view class="filter-options">
						<button :class="['option-btn', { 'active': equipment === 1 }]" @click="setEquipment(1)">全部</button>
						<button :class="['option-btn', { 'active': equipment === 2 }]" @click="setEquipment(2)">安卓</button>
						<button :class="['option-btn', { 'active': equipment === 3 }]" @click="setEquipment(3)">苹果</button>
					</view>
				</view>
				<view class="filter-actions">
					<button class="action-btn reset" @click="resett">重置</button>
					<button class="action-btn confirm" @click="cutTypeTask">确定</button>
				</view>
			</view>
		</view>

		<!-- Task List -->
		<scroll-view class="task-scroll-view" scroll-y @scrolltolower="handleReachBottom" @refresherrefresh="handlePullDownRefresh" :refresher-enabled="true" :refresher-triggered="isRefreshing" :style="{ paddingTop: `calc(var(--status-bar-height) + 180rpx)` }">
			<view class="task-list">
				<view class="task-card" v-for="(c, i) in taskArr" :key="i" @click="navToDetail(c.id, c.type)">
					<view class="task-card-left">
						<image :src="c.avatar" class="avatar"></image>
						<image v-if="c.user_level_id > 1" class="vip-badge" :src="c.vip"></image>
					</view>
					<view class="task-card-right">
						<view class="task-header">
							<text class="task-title">{{ c.title }}</text>
							<view class="task-badges">
								<image v-if="c.top === 1" src="/static/index/ding.png" class="badge-icon"></image>
								<image v-if="c.recommend === 1" src="/static/shouye/icon_tui@2x.png" class="badge-icon"></image>
								<image v-if="c.ensure === 1" src="/static/index/bao.png" class="badge-icon"></image>
								<image v-if="c.is_jisu === 1" src="/static/index/kuaishen.png" class="badge-icon"></image>
							</view>
							<view class="task-price">
								<text class="price-symbol">+</text>
								<text class="price-amount">{{ c.price }}</text>
								<text>元</text>
							</view>
						</view>
						<view class="task-footer">
							<view class="task-tags">
								<text class="tag">{{ c.tasktypename }}</text>
								<text class="tag">{{ c.entryname }}</text>
							</view>
							<view class="task-stats">
								<text>{{ c.received }}人已赚</text>
								<text class="separator">|</text>
								<text>剩余：{{ c.surplus }}</text>
							</view>
						</view>
					</view>
				</view>
				<loading v-show="isloading"></loading>
			</view>
		</scroll-view>
		<custom-tab-bar current="task"></custom-tab-bar>
	</view>
</template>

<script>
	import customTabBar from '@/components/custom-tab-bar.vue';
	import loading from '@/components/loading/loading';
	// #ifdef APP-PLUS
	const xuanshangModule = uni.requireNativePlugin('LingKu-XuanShangModule');
	// #endif
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight;

	export default {
		components: {
			loading,
			customTabBar
		},
		data() {
			return {
				isloading: false,
				isRefreshing: false,
				equipment: 1,
				statusBarHeight: statusBarHeight,
				userInfo: {},
				page: 1,
				index: 1,
				index1: -1,
				taskArr: [],
				typeArr: [],
				isJoin: false,
				current: ['类型', '综合', '最新', '高价', '人气', '简单'],
				wa_token: '',
				wa_page: 1,
				is_over: false,
			};
		},
		onLoad() {
			this.init();
		},
		methods: {
			handleReachBottom() {
				if (this.is_over) {
					this.wa_page++;
					this.getWaList();
				} else {
					this.page++;
					this.getTaskList();
				}
			},
			handlePullDownRefresh() {
				this.isRefreshing = true;
				this.is_over = false;
				this.wa_page = 1;
				this.page = 1;
				this.taskArr = [];
				this.getTaskList();
				setTimeout(() => {
					this.isRefreshing = false;
					uni.stopPullDownRefresh();
				}, 1000);
			},
			init() {
				this.wa_token = uni.getStorageSync('wa_token');
				this.userInfo = uni.getStorageSync('token');
				this.getTaskList();
			},
			resett() {
				this.equipment = 1;
				this.index1 = -1;
			},
			setEquipment(val) {
				this.equipment = val;
			},
			newCourse() {
				uni.navigateTo({
					url: '/pages/pagesFind/publishTask/publishTask'
				});
			},
			navToSearch() {
				uni.navigateTo({
					url: '/pages/home/subpage/search'
				});
			},
			getWaList() {
				this.isloading = true;
				let url = `https://api.xuanshangwa.com.cn/web/unionApi/act/task_list?token=${this.wa_token}&page=${this.wa_page}&limit=10`;
				uni.request({
					url: url,
					method: 'GET',
					success: (res) => {
						if (res.data.code === 0) {
							const data = res.data.data.list.map(item => ({
								...item,
								type: 2
							}));
							this.taskArr = this.taskArr.concat(data);
						}
					},
					complete: () => {
						this.isloading = false;
					}
				});
			},
			getTaskList() {
				this.isloading = true;
				uni.request({
					url: `${this.global.url}/api/task/index`,
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						equipment: this.equipment,
						page: this.page,
						type: this.index,
						tasktype: this.index1 !== -1 ? this.typeArr[this.index1].id : ''
					},
					success: (res) => {
						this.typeArr = res.data.data.tasktype;
						const list = res.data.data.tasklist;
						if (this.page === 1) {
							this.taskArr = list;
						} else {
							this.taskArr = this.taskArr.concat(list);
						}
						if (list.length < 12) {
							this.is_over = true;
							this.getWaList();
						}
					},
					complete: () => {
						this.isloading = false;
					}
				});
			},
			setType(i) {
				this.index1 = this.index1 === i ? -1 : i;
			},
			cutTypeTask() {
				this.page = 1;
				this.taskArr = [];
				this.getTaskList();
				this.isJoin = false;
			},
			cutItem(i) {
				if (i === 0) {
					this.join();
				} else {
					this.page = 1;
					this.taskArr = [];
					this.index = i;
					this.getTaskList();
				}
			},
			join() {
				this.isJoin = !this.isJoin;
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
			}
		}
	};
</script>

<style scoped lang="scss">
	.task-page-container {
		background-color: #f7f8fa;
		min-height: 100vh;
	}

	.header-section {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		background: $uni-color-primary;
		z-index: 999;
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
		background: #fff;
		border-radius: 40rpx;
		padding: 10rpx 20rpx;
		height: 64rpx;

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
		color: #fff;
		font-size: 26rpx;
		background: rgba(255, 255, 255, 0.2);
		padding: 10rpx 20rpx;
		border-radius: 30rpx;

		.publish-icon {
			width: 36rpx;
			height: 36rpx;
			margin-right: 10rpx;
		}
	}

	.tabs-bar {
		display: flex;
		justify-content: space-around;
		background: #fff;
		border-bottom: 1px solid #f5f5f5;
	}

	.tab-item {
		padding: 20rpx 0;
		font-size: 28rpx;
		color: #666;
		position: relative;
		display: flex;
		align-items: center;

		&.active {
			color: $uni-color-primary;
			font-weight: bold;

			&::after {
				content: '';
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

	.dropdown-arrow {
		margin-left: 8rpx;
		font-size: 20rpx;
		transition: transform 0.3s;

		&.up {
			transform: rotate(180deg);
		}
	}

	.filter-panel {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 998;
	}

	.filter-mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
	}

	.filter-content {
		position: absolute;
		top: calc(var(--status-bar-height) + 180rpx);
		left: 0;
		width: 100%;
		background: #fff;
		padding: 30rpx;
		box-sizing: border-box;
		border-bottom-left-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
		box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.1);
		animation: slide-down 0.3s ease-out;
	}

	@keyframes slide-down {
		from {
			transform: translateY(-100%);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.filter-group {
		margin-bottom: 30rpx;
	}

	.filter-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
		display: block;
	}

	.filter-options {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
	}

	.option-btn {
		background: #f5f5f5;
		color: #666;
		border: 1px solid #f5f5f5;
		border-radius: 12rpx;
		padding: 15rpx 30rpx;
		font-size: 26rpx;
		transition: all 0.3s;
		margin: 0;
		line-height: 1.5;

		&::after {
			border: none;
		}

		&.active {
			background: #fff;
			color: $uni-color-primary;
			border-color: $uni-color-primary;
		}
	}

	.filter-actions {
		display: flex;
		gap: 30rpx;
		margin-top: 40rpx;
	}

	.action-btn {
		flex: 1;
		border-radius: 40rpx;
		font-size: 30rpx;
		padding: 20rpx 0;
		margin: 0;
		line-height: 1.5;

		&::after {
			border: none;
		}

		&.reset {
			background: #f5f5f5;
			color: #666;
			flex: 0 0 45%;
		}

		&.confirm {
			background: $uni-color-primary;
			color: #fff;
			flex: 0 0 45%;
		}
	}

	.task-scroll-view {
		height: 100vh;
		box-sizing: border-box;
	}

	.task-list {
		padding: 40rpx 30rpx;
	}

	.task-card {
		display: flex;
		background: #fff;
		padding: 30rpx;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.task-card-left {
		position: relative;
		margin-right: 20rpx;

		.avatar {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
		}

		.vip-badge {
			position: absolute;
			bottom: 0;
			right: -5rpx;
			width: 30rpx;
			height: 30rpx;
		}
	}

	.task-card-right {
		flex: 1;
	}

	.task-header {
		display: flex;
		align-items: center;
		margin-bottom: 15rpx;
	}

	.task-title {
		font-size: 28rpx;
		font-weight: 500;
		color: #333;
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

	.task-price {
		margin-left: auto;
		font-size: 24rpx;
		font-weight: bold;
		color: $uni-color-primary;
		flex-shrink: 0;

		.price-amount {
			font-size: 32rpx;
		}
	}

	.task-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 22rpx;
		color: #999;
	}

	.task-tags {
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
</style>
