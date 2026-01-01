<template>
	<view class="search-page">
		<!-- 自定义搜索栏 -->
		<view class="search-header" :style="headerStyle">
			<view class="back-btn" @click="goBack">
				<view class="back-arrow"></view>
			</view>
			<view class="search-box" :class="{ 'search-box-focus': isFocus }">
				<image class="search-icon" src="/static/index/search.png" mode="aspectFit"></image>
				<input
					class="search-input"
					type="text"
					v-model="keyword"
					placeholder="搜索任务、用户、项目"
					placeholder-class="placeholder-style"
					confirm-type="search"
					:focus="autoFocus"
					@focus="onFocus"
					@blur="onBlur"
					@confirm="startSearch"
					@input="onInput"
				/>
				<view class="clear-btn" v-if="keyword" @click="clearKeyword">
					<text class="clear-icon">×</text>
				</view>
			</view>
			<view class="search-btn" :class="{ 'search-btn-active': keyword }" @click="startSearch">
				<text>搜索</text>
			</view>
		</view>

		<!-- 滚动内容区域 -->
		<scroll-view class="scroll-content" scroll-y>
			<!-- 搜索历史 -->
			<view class="history-section animate-fade-in" v-if="ishistory && wordsArr.length > 0">
				<view class="section-header">
					<view class="section-title">
						<text class="title-icon">🕐</text>
						<text>搜索历史</text>
					</view>
					<view class="clear-history" @click="delHistory">
						<text>清空</text>
					</view>
				</view>
				<view class="history-tags">
					<view
						class="history-tag animate-scale-in"
						v-for="(item, index) in displayWords"
						:key="index"
						:style="{ animationDelay: index * 0.05 + 's' }"
						@click="getSearch(item)"
					>
						<text>{{ item }}</text>
					</view>
				</view>
			</view>

			<!-- 热门搜索 -->
			<view class="hot-section animate-fade-in" v-if="ishistory" style="animation-delay: 0.1s">
				<view class="section-header">
					<view class="section-title">
						<text class="title-icon">🔥</text>
						<text>热门搜索</text>
					</view>
				</view>
				<view class="hot-tags">
					<view
						class="hot-tag animate-scale-in"
						v-for="(item, index) in hotWords"
						:key="index"
						:style="{ animationDelay: (index * 0.05 + 0.2) + 's' }"
						@click="getSearch(item)"
					>
						<text class="hot-rank" :class="'rank-' + (index + 1)">{{ index + 1 }}</text>
						<text class="hot-text">{{ item }}</text>
					</view>
				</view>
			</view>

			<!-- 搜索结果 -->
			<view class="result-section" v-if="!ishistory">
				<!-- 加载动画 -->
				<view class="loading-container" v-if="isSearching">
					<view class="loading-spinner">
						<view class="spinner-dot" v-for="i in 3" :key="i"></view>
					</view>
					<text class="loading-text">搜索中...</text>
				</view>

				<!-- 搜索结果列表 -->
				<view class="result-list" v-if="!isSearching && listArr.length > 0">
					<view class="result-header">
						<text>找到 {{ listArr.length }} 个相关任务</text>
					</view>
					<view
						class="task-card animate-slide-up"
						v-for="(task, index) in listArr"
						:key="task.id"
						:style="{ animationDelay: index * 0.08 + 's' }"
						@click="navTodetail(task.id)"
					>
						<view class="task-left">
							<image class="task-avatar" :src="task.image" mode="aspectFill"></image>
							<view class="task-price-badge">
								<text>+{{ task.price }}元</text>
							</view>
						</view>
						<view class="task-content">
							<view class="task-title">{{ task.title }}</view>
							<view class="task-tags">
								<text class="task-tag tag-type">{{ task.entryname }}</text>
								<text class="task-tag tag-category">{{ task.tasktypename || '普通任务' }}</text>
							</view>
							<view class="task-stats">
								<text class="stat-item">
									<text class="stat-icon">👤</text>
									{{ task.received }}人已赚
								</text>
								<text class="stat-divider">|</text>
								<text class="stat-item">
									<text class="stat-icon">📦</text>
									剩余{{ task.surplus }}个
								</text>
							</view>
						</view>
						<view class="task-arrow">
							<text>›</text>
						</view>
					</view>
				</view>

				<!-- 空状态 -->
				<view class="empty-state animate-fade-in" v-if="!isSearching && listArr.length === 0">
					<view class="empty-icon">🔍</view>
					<text class="empty-title">未找到相关任务</text>
					<text class="empty-desc">换个关键词试试吧</text>
					<view class="empty-btn" @click="resetSearch">
						<text>重新搜索</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	var systemInfo = uni.getSystemInfoSync();
	var statusBarHeight = systemInfo.statusBarHeight || 0;
	var isApp = systemInfo.uniPlatform === 'app' || typeof plus !== 'undefined';

	export default {
		data() {
			return {
				keyword: '',
				listArr: [],
				wordsArr: [],
				ishistory: true,
				statusBarHeight: isApp ? statusBarHeight : 0,
				isFocus: false,
				autoFocus: true,
				isSearching: false,
				hotWords: ['高佣金任务', '新手任务', '简单任务', '每日签到', '邀请好友', '快速审核']
			}
		},
		computed: {
			displayWords() {
				return this.wordsArr.filter(item => item !== '')
			},
			headerStyle() {
				return this.statusBarHeight > 0
					? { paddingTop: this.statusBarHeight + 'px' }
					: {}
			}
		},
		onLoad() {
			this.getHistory()
		},
		methods: {
			goBack() {
				uni.navigateBack()
			},
			onFocus() {
				this.isFocus = true
			},
			onBlur() {
				this.isFocus = false
			},
			onInput(e) {
				this.keyword = e.detail.value
			},
			clearKeyword() {
				this.keyword = ''
				this.autoFocus = true
			},
			resetSearch() {
				this.keyword = ''
				this.ishistory = true
				this.autoFocus = true
				this.getHistory()
			},
			startSearch() {
				if (this.keyword.trim() === '') {
					uni.showToast({
						title: '请输入搜索关键词',
						icon: 'none'
					})
					return
				}

				// 保存搜索历史
				let keywords = uni.getStorageSync('keywords') || []
				if (!keywords.includes(this.keyword)) {
					keywords.unshift(this.keyword)
					if (keywords.length > 10) keywords = keywords.slice(0, 10)
					uni.setStorageSync('keywords', keywords)
				}

				this.getSearch('')
			},
			navTodetail(id) {
				uni.navigateTo({
					url: '/pages/task/detail?id=' + id
				})
			},
			getHistory() {
				let keywords = uni.getStorageSync('keywords')
				this.wordsArr = Array.isArray(keywords) ? keywords : []
				this.ishistory = true
			},
			delHistory() {
				uni.showModal({
					title: '提示',
					content: '确定清空搜索历史吗？',
					success: (res) => {
						if (res.confirm) {
							uni.removeStorageSync('keywords')
							this.wordsArr = []
						}
					}
				})
			},
			getSearch(word) {
				const searchWord = word || this.keyword
				if (!searchWord) return

				this.keyword = searchWord
				this.ishistory = false
				this.isSearching = true

				uni.request({
					url: this.global.url + '/api/Index/search',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						search: searchWord
					},
					success: (res) => {
						if (res.data.code == 1) {
							this.listArr = res.data.data || []
						} else {
							this.listArr = []
							uni.showToast({
								title: res.data.msg || '搜索失败',
								icon: 'none'
							})
						}
					},
					fail: () => {
						this.listArr = []
						uni.showToast({
							title: '网络错误，请重试',
							icon: 'none'
						})
					},
					complete: () => {
						setTimeout(() => {
							this.isSearching = false
						}, 300)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	$primary-color: #E63946;
	$bg-color: #f5f7fa;
	$card-bg: #ffffff;
	$text-primary: #1a1a1a;
	$text-secondary: #666666;
	$text-light: #999999;
	$border-color: #eaeaea;

	/* 重置 page 根元素样式 */
	page {
		margin: 0 !important;
		padding: 0 !important;
		background: $bg-color !important;
		height: 100%;
		overflow: hidden;
	}

	// 动画定义
	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes scaleIn {
		from {
			opacity: 0;
			transform: scale(0.8);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(30rpx);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes pulse {
		0%, 100% { opacity: 0.4; }
		50% { opacity: 1; }
	}

	@keyframes bounce {
		0%, 80%, 100% { transform: scale(0); }
		40% { transform: scale(1); }
	}

	.animate-fade-in {
		animation: fadeIn 0.4s ease-out forwards;
		opacity: 0;
	}

	.animate-scale-in {
		animation: scaleIn 0.3s ease-out forwards;
		opacity: 0;
	}

	.animate-slide-up {
		animation: slideUp 0.4s ease-out forwards;
		opacity: 0;
	}

	.search-page {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: $bg-color;
		z-index: 999;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	// 搜索头部
	.search-header {
		display: flex;
		align-items: center;
		padding: 12rpx 24rpx;
		padding-bottom: 16rpx;
		background: linear-gradient(135deg, $primary-color 0%, #ff6b6b 100%);
		box-shadow: 0 4rpx 20rpx rgba($primary-color, 0.3);
		flex-shrink: 0;
	}

	// 滚动内容区域
	.scroll-content {
		flex: 1;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
	}

	.back-btn {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		margin-right: 10rpx;

		&:active {
			transform: scale(0.9);
		}
	}

	.back-arrow {
		width: 18rpx;
		height: 18rpx;
		border-left: 4rpx solid #fff;
		border-bottom: 4rpx solid #fff;
		transform: rotate(45deg);
		margin-left: 4rpx;
	}

	.search-box {
		flex: 1;
		display: flex;
		align-items: center;
		background: rgba(255, 255, 255, 0.95);
		border-radius: 40rpx;
		padding: 0 24rpx;
		height: 76rpx;
		transition: all 0.3s ease;
		box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.1);

		&.search-box-focus {
			background: #fff;
			box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.15);
			transform: scale(1.02);
		}
	}

	.search-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 16rpx;
		opacity: 0.6;
	}

	.search-input {
		flex: 1;
		height: 76rpx;
		font-size: 28rpx;
		color: $text-primary;
	}

	.placeholder-style {
		color: $text-light;
		font-size: 28rpx;
	}

	.clear-btn {
		width: 44rpx;
		height: 44rpx;
		background: rgba(0, 0, 0, 0.1);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 12rpx;
		transition: all 0.2s ease;

		&:active {
			transform: scale(0.9);
			background: rgba(0, 0, 0, 0.2);
		}
	}

	.clear-icon {
		font-size: 32rpx;
		color: $text-secondary;
		line-height: 1;
	}

	.search-btn {
		margin-left: 20rpx;
		padding: 16rpx 28rpx;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 30rpx;
		transition: all 0.3s ease;

		text {
			color: #fff;
			font-size: 28rpx;
			font-weight: 500;
		}

		&.search-btn-active {
			background: #fff;

			text {
				color: $primary-color;
			}
		}

		&:active {
			transform: scale(0.95);
		}
	}

	// 历史记录区域
	.history-section, .hot-section {
		margin: 24rpx;
		padding: 28rpx;
		background: $card-bg;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24rpx;
	}

	.section-title {
		display: flex;
		align-items: center;
		font-size: 30rpx;
		font-weight: 600;
		color: $text-primary;

		.title-icon {
			margin-right: 12rpx;
			font-size: 32rpx;
		}
	}

	.clear-history {
		padding: 10rpx 24rpx;
		background: #f5f5f5;
		border-radius: 20rpx;
		transition: all 0.2s ease;

		text {
			font-size: 24rpx;
			color: $text-light;
		}

		&:active {
			background: #eee;
			transform: scale(0.95);
		}
	}

	.history-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx;
	}

	.history-tag {
		padding: 16rpx 28rpx;
		background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);
		border-radius: 30rpx;
		transition: all 0.2s ease;

		text {
			font-size: 26rpx;
			color: $text-secondary;
		}

		&:active {
			transform: scale(0.95);
			background: linear-gradient(135deg, #eee 0%, #e5e5e5 100%);
		}
	}

	// 热门搜索
	.hot-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
	}

	.hot-tag {
		display: flex;
		align-items: center;
		padding: 14rpx 24rpx;
		background: #f8f9fa;
		border-radius: 24rpx;
		transition: all 0.2s ease;

		&:active {
			transform: scale(0.95);
		}
	}

	.hot-rank {
		width: 36rpx;
		height: 36rpx;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 22rpx;
		font-weight: bold;
		margin-right: 12rpx;
		color: #fff;
		background: #ccc;

		&.rank-1 { background: linear-gradient(135deg, #ff6b6b 0%, $primary-color 100%); }
		&.rank-2 { background: linear-gradient(135deg, #ffa726 0%, #ff7043 100%); }
		&.rank-3 { background: linear-gradient(135deg, #ffca28 0%, #ffa000 100%); }
	}

	.hot-text {
		font-size: 26rpx;
		color: $text-secondary;
	}

	// 搜索结果
	.result-section {
		padding: 24rpx;
	}

	.result-header {
		margin-bottom: 20rpx;

		text {
			font-size: 26rpx;
			color: $text-light;
		}
	}

	// 加载动画
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 100rpx 0;
	}

	.loading-spinner {
		display: flex;
		gap: 16rpx;
	}

	.spinner-dot {
		width: 20rpx;
		height: 20rpx;
		background: $primary-color;
		border-radius: 50%;
		animation: bounce 1.4s infinite ease-in-out both;

		&:nth-child(1) { animation-delay: -0.32s; }
		&:nth-child(2) { animation-delay: -0.16s; }
		&:nth-child(3) { animation-delay: 0s; }
	}

	.loading-text {
		margin-top: 24rpx;
		font-size: 28rpx;
		color: $text-light;
	}

	// 任务卡片
	.task-card {
		display: flex;
		align-items: center;
		padding: 28rpx;
		background: $card-bg;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.05);
		transition: all 0.2s ease;

		&:active {
			transform: scale(0.98);
			box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.08);
		}
	}

	.task-left {
		position: relative;
		margin-right: 24rpx;
	}

	.task-avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 16rpx;
		background: #f5f5f5;
	}

	.task-price-badge {
		position: absolute;
		bottom: -10rpx;
		left: 50%;
		transform: translateX(-50%);
		padding: 6rpx 16rpx;
		background: linear-gradient(135deg, $primary-color 0%, #ff6b6b 100%);
		border-radius: 20rpx;
		white-space: nowrap;
		box-shadow: 0 4rpx 12rpx rgba($primary-color, 0.4);

		text {
			font-size: 22rpx;
			color: #fff;
			font-weight: bold;
		}
	}

	.task-content {
		flex: 1;
		overflow: hidden;
	}

	.task-title {
		font-size: 30rpx;
		font-weight: 600;
		color: $text-primary;
		margin-bottom: 12rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.task-tags {
		display: flex;
		gap: 12rpx;
		margin-bottom: 12rpx;
	}

	.task-tag {
		padding: 6rpx 16rpx;
		border-radius: 8rpx;
		font-size: 22rpx;

		&.tag-type {
			background: #e8f5e9;
			color: #43a047;
		}

		&.tag-category {
			background: #e3f2fd;
			color: #1976d2;
		}
	}

	.task-stats {
		display: flex;
		align-items: center;
	}

	.stat-item {
		font-size: 24rpx;
		color: $text-light;
		display: flex;
		align-items: center;
	}

	.stat-icon {
		margin-right: 6rpx;
		font-size: 22rpx;
	}

	.stat-divider {
		margin: 0 16rpx;
		color: $border-color;
	}

	.task-arrow {
		text {
			font-size: 40rpx;
			color: #ddd;
		}
	}

	// 空状态
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 120rpx 40rpx;
	}

	.empty-icon {
		font-size: 120rpx;
		margin-bottom: 32rpx;
		opacity: 0.8;
	}

	.empty-title {
		font-size: 32rpx;
		color: $text-primary;
		font-weight: 600;
		margin-bottom: 16rpx;
	}

	.empty-desc {
		font-size: 26rpx;
		color: $text-light;
		margin-bottom: 40rpx;
	}

	.empty-btn {
		padding: 24rpx 60rpx;
		background: linear-gradient(135deg, $primary-color 0%, #ff6b6b 100%);
		border-radius: 40rpx;
		box-shadow: 0 8rpx 24rpx rgba($primary-color, 0.4);
		transition: all 0.2s ease;

		text {
			font-size: 28rpx;
			color: #fff;
			font-weight: 500;
		}

		&:active {
			transform: scale(0.95);
		}
	}
</style>
