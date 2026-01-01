<template>
	<view class="wallet-container">
		<!-- Header Card -->
		<view class="header-card" v-if="shoyyimingxList.length > 0">
			<p class="balance-label">账户余额</p>
			<p class="balance-amount">{{shoyyimingxList[0].money}}</p>
			<view class="stats-container">
				<view class="stat-item">
					<p class="stat-value">{{shoyyimingxList[0].today_profit}}</p>
					<p class="stat-label">今日收益(元)</p>
				</view>
				<view class="stat-item">
					<p class="stat-value">{{shoyyimingxList[0].Cumulative_profit}}</p>
					<p class="stat-label">累计收益(元)</p>
				</view>
			</view>
		</view>

		<!-- Action Buttons -->
		<view class="action-buttons" v-if="shoyyimingxList.length > 0">
			<view class="withdrawal-info">
				<p>可提金额 (元)：{{shoyyimingxList[0].withdrawal}}</p>
			</view>
			<view class="buttons-group">
				<button class="btn-withdraw" @click="tixian">提现</button>
				<button class="btn-recharge" @click="chongzhi">充值</button>
			</view>
		</view>

		<!-- Tabs -->
		<view class="tabs-container">
			<view :class="['tab-item', Inv === 1 ? 'active' : '']" @click="tgp(1)">收益明细</view>
			<view :class="['tab-item', Inv === 2 ? 'active' : '']" @click="tgp(2)">提现明细</view>
			<view :class="['tab-item', Inv === 3 ? 'active' : '']" @click="tgp(3)">充值明细</view>
		</view>

		<!-- Transaction List -->
		<view class="transaction-list">
			<view class="list-item" v-for="(arr,index) in syList" :key="arr.id">
				<view class="item-details">
					<p class="item-status">{{arr.status_type}}{{arr.status}}</p>
					<p class="item-date">{{arr.createtime}}</p>
				</view>
				<view class="item-amount">
					<template v-if="arr.account_type">
						<view v-if="arr.account_type==1" class="amount-positive">+{{arr.amount}}元</view>
						<view v-if="arr.account_type==2" class="amount-negative">-{{arr.amount}}元</view>
					</template>
					<template v-else>
						<view class="amount-positive">+{{arr.amount}}元</view>
					</template>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				Inv: 1,
				token: '',
				type: 1,
				shoyyimingxList: [],
				syList: [],
				page: 1,
				loadingText: '加载中...',
				last_page: '',

			}
		},
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url: "/pages/mine/wallet/bond"
			})
		},
		onLoad() {
			this.getMyCard()
		},
		onShow() {
			this.getMyCard()
		},
		onReachBottom() {
			let that = this;
			if (that.page > that.last_page) {
				uni.showToast({
					title: "已加载全部数据",
					icon: 'none'
				})
			} else {
				that.page++
				that.getnewsList(that.page);
			}

		},
		methods: {
			//列表数据请求
			getMyCard() {
				let that = this
				uni.request({
					url: this.global.url + "/api/user/wallet",
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
						type: that.type,
						page: that.page
					},
					success: (res) => {
						if (res.data.code == 1) {
							that.shoyyimingxList = [res.data.data];
							that.syList = res.data.data.profit.data;
							that.last_page = res.data.data.profit.last_page;
						}
					}
				})
			},
			//根据type值获取不同列表的数据
			tgp(e) {
				let that = this;
				that.Inv = e;
				that.type = e;
				that.page = 1;
				that.syList = [];
				that.getnewsList(that.page);

			},
			////屏幕到底部时候触发此事件
			getnewsList(page) {
				let that = this;
				uni.request({
					url: this.global.url + "/api/user/wallet",
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
						type: that.type,
						page: that.page
					},
					success: (res) => {

						if (res.data.code == 1) {
							that.last_page = res.data.data.last_page;
							that.syList = that.syList.concat(res.data.data.profit.data)
						}
					}
				})
			},
			tixian() {
				uni.navigateTo({
					url: "/pages/mine/wallet/withdrawal"
				})
			},
			chongzhi() {
				uni.navigateTo({
					url: "/pages/mine/wallet/recharge"
				})
			},
			getMyTx() {
				let token = uni.getStorageSync("token")
				let card = token.token
				let that = this
				let type = 2
				that.request('/api/user/wallet', {
					method: 'POST',
					token: card,
					type: type
				}).then(res => {})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.wallet-container {
		background-color: #f8f8f8;
		min-height: 100vh;
	}

	.header-card {
		background: linear-gradient(135deg, $uni-color-primary, darken($uni-color-primary, 10%));
		padding: 40rpx;
		color: #ffffff;
		text-align: center;
		border-bottom-left-radius: 40rpx;
		border-bottom-right-radius: 40rpx;
		animation: slide-down 0.5s ease-out;
	}

	.balance-label {
		font-size: 30rpx;
		opacity: 0.8;
	}

	.balance-amount {
		font-size: 60rpx;
		font-weight: bold;
		margin: 10rpx 0;
	}

	.stats-container {
		display: flex;
		justify-content: space-around;
		margin-top: 30rpx;
	}

	.stat-item {
		flex: 1;
	}

	.stat-value {
		font-size: 32rpx;
		font-weight: 500;
	}

	.stat-label {
		font-size: 24rpx;
		opacity: 0.8;
	}

	.action-buttons {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		background-color: #ffffff;
		margin: 20rpx;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.withdrawal-info p {
		font-size: 28rpx;
		color: #333;
	}

	.buttons-group {
		display: flex;
	}

	.btn-withdraw,
	.btn-recharge {
		color: #ffffff;
		background-color: $uni-color-primary;
		border: none;
		border-radius: 30rpx;
		padding: 15rpx 30rpx;
		font-size: 24rpx;
		margin-left: 20rpx;
		transition: background-color 0.3s ease;
	}

	.btn-recharge {
		background-color: darken($uni-color-primary, 10%);
	}

	.btn-withdraw:hover,
	.btn-recharge:hover {
		opacity: 0.9;
	}

	.tabs-container {
		display: flex;
		justify-content: space-around;
		background-color: #ffffff;
		padding: 0 20rpx;
		border-bottom: 1px solid #eeeeee;
	}

	.tab-item {
		font-size: 28rpx;
		color: #999;
		padding: 20rpx 0;
		cursor: pointer;
		transition: color 0.3s ease;
		border-bottom: 2px solid transparent;
	}

	.tab-item.active {
		color: $uni-color-primary;
		border-bottom: 2px solid $uni-color-primary;
	}

	.transaction-list {
		background-color: #ffffff;
		padding: 0 20rpx;
	}

	.list-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 10rpx;
		border-bottom: 1px solid #eeeeee;
	}

	.item-details .item-status {
		font-size: 28rpx;
		color: #333;
	}

	.item-details .item-date {
		font-size: 22rpx;
		color: #999;
		margin-top: 5rpx;
	}

	.item-amount .amount-positive {
		font-size: 34rpx;
		font-weight: 500;
		color: #E63946;
	}

	.item-amount .amount-negative {
		font-size: 34rpx;
		font-weight: 500;
		color: #4cd964;
	}

	@keyframes slide-down {
		from {
			transform: translateY(-20px);
			opacity: 0;
		}

		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
</style>
