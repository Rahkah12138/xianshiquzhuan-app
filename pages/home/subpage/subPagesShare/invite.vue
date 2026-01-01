<template>
	<view class="invite-container">
		<view class="status_bar"></view>
		<view class="nav">
			<image src="/static/noviciate/left.png" @click="back" mode=""></image>
			<view class="nav_word1">邀请好友</view>
			<view class="rule" @click="gz">邀请规则</view>
		</view>

		<!-- Main Banner -->
		<view class="banner-card" @click="invitation">
			<image src="/static/share/bg2.png" class="banner-bg" mode="widthFix"></image>
			<view class="banner-content">
				<image src="/static/share/finger.png" class="finger-icon"></image>
				<view class="banner-text">点击生成我的专属海报</view>
			</view>
		</view>

		<!-- Share Options -->
		<view class="share-options">
			<view class="share-title">分享3个以上微信群/QQ群，邀请成功率提升200%</view>
			<view class="share-buttons">
				<button class="share-btn" @tap="shareItems('timeline')">
					<image src="/static/share/pyq.png"></image>
					<text>查看海报</text>
				</button>
				<button class="share-btn" @tap="fuzhiClick" :data-clipboard-text="reg">
					<image src="/static/share/lj.png"></image>
					<text>复制链接</text>
				</button>
			</view>
		</view>

		<!-- Reward Cards -->
		<view class="reward-section">
			<view class="reward-card">
				<view class="reward-title">
					<image src="/static/share/red.png"></image>
					<text>奖励一：邀请好友得{{parseFloat(detail.reward_one[5])+parseFloat(detail.reward_one[3])+parseFloat(detail.reward_one[4])}}元现金奖励</text>
				</view>
				<view class="reward-grid">
					<view class="reward-item">
						<view class="item-image-container">
							<image src="/static/share/cir.png"></image>
							<view class="amount">+{{detail.reward_one[5]}}元</view>
							<view class="task-name">好友完成</view>
							<view class="task-highlight">新人福利</view>
						</view>
					</view>
					<view class="reward-item">
						<view class="item-image-container">
							<image src="/static/share/cir.png"></image>
							<view class="amount">+{{detail.reward_one[3]}}元</view>
							<view class="task-name">好友完成</view>
							<view class="task-highlight">首次提现</view>
						</view>
					</view>
					<view class="reward-item">
						<view class="item-image-container">
							<image src="/static/share/cir.png"></image>
							<view class="amount">+{{detail.reward_one[4]}}元</view>
							<view class="task-name">额外奖励</view>
							<view class="task-highlight">徒孙首次提现</view>
						</view>
					</view>
				</view>
			</view>

			<view class="reward-card">
				<view class="reward-title">
					<image src="/static/share/red.png"></image>
					<text>奖励二：任务分成</text>
				</view>
				<view class="reward-split">
					<view class="split-item">
						<image src="/static/share/fencheng.png"></image>
						<view class="item-content">
							<view class="split-title">一级好友奖励</view>
							<view class="split-value">{{detail.reward_three[0]}}%</view>
						</view>
					</view>
					<view class="split-item">
						<image src="/static/share/fencheng.png"></image>
						<view class="item-content">
							<view class="split-title">二级好友奖励</view>
							<view class="split-value">{{detail.reward_three[1]}}%</view>
						</view>
					</view>
				</view>
				<view class="reward-footer">好友完成悬赏任务，邀请人获得提成</view>
			</view>

			<view class="reward-card">
				<view class="reward-title">
					<image src="/static/share/red.png"></image>
					<text>奖励三：道具分成</text>
				</view>
				<view class="reward-split">
					<view class="split-item">
						<image src="/static/share/daoju.png"></image>
						<view class="item-content">
							<view class="split-value highlight">{{detail.reward_three[2]}}%</view>
							<view class="split-title">购买会员</view>
						</view>
					</view>
					<view class="split-item">
						<image src="/static/share/daoju.png"></image>
						<view class="item-content">
							<view class="split-value highlight">{{detail.topbag_superior}}%</view>
							<view class="split-title">置顶 | 刷新包</view>
						</view>
					</view>
				</view>
				<view class="reward-footer">好友购买会员 | 置顶 | 刷新包，邀请人获得提成</view>
			</view>

			<view class="reward-card">
				<view class="reward-title">
					<image src="/static/share/red.png"></image>
					<text>奖励四：推广阶梯巨额奖励限时</text>
				</view>
				<view class="promo-banner">
					<image src="/static/share/jieti.png" mode="widthFix"></image>
					<view class="promo-content">
						<view class="promo-tag">巨额奖励</view>
						<view class="promo-amount">{{detail.month_rank_total}}元</view>
						<view class="promo-desc">本月推广排名前{{detail.rank_total}}名</view>
					</view>
				</view>
				<button class="btn-leaderboard" @click="seeList(0)">查看榜单</button>
			</view>

			<view class="reward-card">
				<view class="reward-title">
					<image src="/static/share/red.png"></image>
					<text>奖励五：裂变奖励</text>
				</view>
				<view class="promo-banner fission-banner">
					<image src="/static/share/liebian.png" mode="widthFix"></image>
					<view class="promo-content">
						<view class="promo-amount">{{detail.fission_total}}元</view>
						<view class="promo-desc-light">好友提现再领</view>
					</view>
				</view>
				<button class="btn-leaderboard" @click="seeList(1)">查看榜单</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail: '',

			};
		},
		onLoad: function() {
			let token = uni.getStorageSync('token');
			console.log('homr')
			if (!token) {
				uni.navigateTo({
					url: '/pages/home/login/login'
				})
				return;
			}

			let userInfo = uni.getStorageSync('token')
			this.reg = 'https://app.xqkz.top/down/register.html?id=' + userInfo.id
			console.log(this.reg)

		},
		onBackPress(e) {
			console.log(e)
			if (e.from == 'backbutton') {
				uni.switchTab({
					url: '/pages/home/home'
				})
			}
		},
		onShow() {
			this.get_detail()
		},
		methods: {

			fuzhiClick() {

				console.log('1212121')

				//复制文字到剪切板
				uni.setClipboardData({
					data: this.reg,
					success: function() {
						uni.showToast({
							icon: 'none',
							title: '链接已复制成功,赶快去分享吧^_^'
						});

					}
				});

				return;

				// #ifdef H5 || MP-WEIXIN
				var clipboard = new Clipboard('.bootleft')
				clipboard.on('success', e => {
					uni.showToast({
						icon: 'none',
						title: '链接已复制成功,赶快去分享吧^_^'
					});
					console.log('复制成功')
					// 释放内存
					clipboard.destroy()
				})
				clipboard.on('error', e => {
					uni.showToast({
						icon: 'none',
						title: '该浏览器不支持自动复制'
					});
					// 不支持复制
					console.log('该浏览器不支持自动复制')
					// 释放内存
					clipboard.destroy()
				})
				// #endif

			},
			back() {
				uni.switchTab({
					url: '/pages/home/home'
				})
			},
			// 详情
			get_detail: function() {
				var that = this
				uni.request({
					url: that.global.url + '/api/user/builds',
					method: 'get',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {

						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						if (res.data.code == 1) {
							console.log(res)
							that.detail = res.data.data
						}
					}
				})


			},

			gz: function() {
				uni.navigateTo({
					url: 'guize'
				})
			},

			//邀请
			invitation() {
				uni.navigateTo({
					url: "/pages/mine/subPage/share"
				})
			},
			shareItems() {
				uni.navigateTo({
					url: "/pages/mine/subPage/share"
				})
			},

			//查看榜单
			seeList(val) {
				uni.navigateTo({
					url: '/pages/mine/subPage/activity?type=' + val
				})

				// uni.navigateTo({
				// 	url:'/pages/home/subpage/rank'
				// })
			}
		}
	}
</script>

<style lang="scss" scoped>
	.invite-container {
		background-color: #2874ff;
	}

	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}

	.nav {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 88rpx;
		position: relative;

		image {
			width: 40rpx;
			height: 40rpx;
			position: absolute;
			left: 30rpx;
		}

		.nav_word1 {
			font-size: 36rpx;
			color: #ffffff;
		}

		.rule {
			position: absolute;
			right: 30rpx;
			background-color: rgba(0, 0, 0, 0.2);
			border-radius: 40rpx;
			padding: 10rpx 20rpx;
			font-size: 26rpx;
			color: #ffffff;
		}
	}

	.banner-card {
		position: relative;
		text-align: center;
		animation: slide-in 0.5s ease-out;
	}

	.banner-bg {
		width: 100%;
	}

	.banner-content {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: #ffffff;
	}

	.finger-icon {
		width: 70rpx;
		height: 100rpx;
		animation: bounce 1s infinite;
	}

	.banner-text {
		font-size: 32rpx;
		margin-top: 20rpx;
	}

	.share-options {
		background-color: #ffffff;
		border-radius: 20rpx;
		margin: -50rpx 20rpx 20rpx;
		padding: 30rpx;
		text-align: center;
		position: relative;
		z-index: 1;
	}

	.share-title {
		font-size: 24rpx;
		color: #999;
		margin-bottom: 30rpx;
	}

	.share-buttons {
		display: flex;
		justify-content: space-around;
	}

	.share-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		background: none;
		border: none;
		padding: 0;

		image {
			width: 80rpx;
			height: 80rpx;
		}

		text {
			font-size: 24rpx;
			color: #333;
			margin-top: 10rpx;
		}
	}

	.reward-section {
		padding: 20rpx;
	}

	.reward-card {
		background-color: #ffffff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		animation: slide-up 0.5s ease-out;
	}

	.reward-title {
		display: flex;
		align-items: center;
		font-size: 32rpx;
		font-weight: bold;
		color: $uni-color-primary;

		image {
			width: 32rpx;
			height: 40rpx;
			margin-right: 20rpx;
		}
	}

	.reward-grid {
		display: flex;
		justify-content: space-between;
		margin-top: 30rpx;
	}

	.reward-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 200rpx;
	}

	.item-image-container {
		position: relative;
		width: 200rpx;
		height: 230rpx;

		image {
			width: 100%;
			height: 100%;
		}

		.amount {
			position: absolute;
			top: 0;
			left: 0;
			margin-top: -40rpx;
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 35rpx;
			font-weight: bold;
			color: #ffffff;
		}

		.task-name {
			position: absolute;
			bottom: 45rpx;
			left: 0;
			margin-bottom: 5px;
			width: 100%;
			text-align: center;
			font-size: 18rpx;
			color: #333;
		}

		.task-highlight {
			position: absolute;
			bottom: 20rpx;
			left: 0;
			width: 100%;
			text-align: center;
			font-size: 18rpx;
			color: $uni-color-primary;
		}
	}

	.highlight {
		color: $uni-color-primary;
	}

	.reward-split {
		display: flex;
		justify-content: space-around;
		margin-top: 30rpx;
	}

	.split-item {
		position: relative;
		width: 220rpx;
		height: 160rpx;
		text-align: center;

		image {
			width: 100%;
			height: 100%;
		}

		.item-content {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			color: #ffffff;
		}

		.split-title {
			font-size: 24rpx;
		}

		.split-value {
			font-size: 60rpx;
			font-weight: bold;
		}

		.highlight {
			color: $uni-color-primary;
		}
	}

	.reward-footer {
		text-align: center;
		font-size: 30rpx;
		color: #ff7903;
		margin-top: 30rpx;
		font-weight: bold;
	}

	.promo-banner {
		position: relative;
		width: 100%;
		margin-top: 30rpx;

		image {
			width: 100%;
			display: block;
		}
		

		.promo-content {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			text-align: center;
			color: #ffffff;
		}

		.promo-tag {
			font-size: 28rpx;
			background-color: rgba(0, 0, 0, 0.3);
			padding: 5rpx 15rpx;
			border-radius: 10rpx;
			display: inline-block;
		}

		.promo-amount {
			font-size: 68rpx;
			font-weight: bold;
			color: $uni-color-primary;
			margin-top: 20rpx;
		}

		.promo-desc {
			font-size: 26rpx;
			margin-top: 10rpx;
		}

		.promo-desc-light {
			font-size: 20rpx;
			margin-top: 60rpx;
			color: #ffffff;
		}
	}

	.btn-leaderboard {
		display: block;
		width: 300rpx;
		height: 100rpx;
		line-height: 100rpx;
		margin: 40rpx auto 0;
		background-image: url('/static/share/btn.png');
		background-size: cover;
		color: $uni-color-primary;
		font-size: 34rpx;
		text-align: center;
		border: none;
	}

	.fission-banner {
		image {
			width: 500rpx;
			margin: 0 auto;
		}
	}

	@keyframes bounce {
		0%,
		20%,
		50%,
		80%,
		100% {
			transform: translateY(0);
		}

		40% {
			transform: translateY(-20px);
		}

		60% {
			transform: translateY(-10px);
		}
	}

	@keyframes slide-in {
		from {
			transform: translateY(-20px);
			opacity: 0;
		}

		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	@keyframes slide-up {
		from {
			transform: translateY(20px);
			opacity: 0;
		}

		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
</style>
