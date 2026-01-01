<template>
	<view class="report-container">
		<view class="tabs">
			<view :class="['tab-item', Inv === 0 ? 'active' : '']" @click="changeTab(0)">我举报的</view>
			<view :class="['tab-item', Inv === 1 ? 'active' : '']" @click="changeTab(1)">举报我的</view>
		</view>

		<view class="notice">24小时不辩诉将判对方胜</view>

		<view class="report-list">
			<view class="list-item" v-for="(item, index) in myWorkList" :key="index" @click="weiquanDetails(item.id)" :style="{ animationDelay: index * 0.1 + 's' }">
				<view class="item-header">
					<image :src="item.avatar" class="avatar"></image>
					<view class="user-info">
						<view class="nickname">{{ item.nickname }}</view>
						<view class="id">{{ Inv === 0 ? '被举报人' : '举报人' }}ID：{{ Inv === 0 ? item.businessid : item.user_id }}</view>
					</view>
					<view class="status" :class="getStatusClass(item.type)">{{ getStatusText(item.type) }}</view>
				</view>
				<view class="item-footer">
					<view class="time">举报时间：{{ item.createtime }}</view>
					<view class="view-details">查看举报内容</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				Inv: 0,
				myWorkList: [],
				getUrl: '/api/User/takeComplain'
			}
		},
		onShow() {
			this.getMyWork(this.getUrl);
		},
		onLoad(options) {
			if (options.type === 'my') {
				this.changeTab(1);
			}
		},
		methods: {
			changeTab(Inv) {
				this.Inv = Inv;
				this.myWorkList = [];
				this.getUrl = Inv === 0 ? "/api/User/takeComplain" : "/api/User/sendComplain";
				this.getMyWork(this.getUrl);
			},
			getMyWork(url) {
				let that = this;
				uni.request({
					url: that.global.url + url,
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token,
					},
					success: (res) => {
						if (res.data.code == 1) {
							that.myWorkList = res.data.data;
						}
					}
				})
			},
			weiquanDetails(id) {
				uni.navigateTo({
					url: "/pages/mine/report/reportDetail?id=" + id
				})
			},
			getStatusText(type) {
				if (type == 1) return '原告胜利';
				if (type == 2) return '被告胜利';
				return '处理中';
			},
			getStatusClass(type) {
				if (type == 1) return 'status-win';
				if (type == 2) return 'status-lose';
				return 'status-pending';
			}
		}
	}
</script>

<style lang="scss" scoped>
	@keyframes slideInDown {
		from {
			transform: translateY(-50px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.tabs {
		animation: slideInDown 0.5s ease-out forwards;
	}

	.report-container {
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	.tabs {
		display: flex;
		background-color: #ffffff;
		border-bottom: 1rpx solid #eee;
	}

	.tab-item {
		flex: 1;
		text-align: center;
		padding: 30rpx 0;
		font-size: 32rpx;
		color: #666;
		position: relative;

		&.active {
			color: #E63946;
			font-weight: bold;

			&::after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
				width: 60rpx;
				height: 6rpx;
				background-color: #E63946;
				border-radius: 3rpx;
			}
		}
	}

	.notice {
		color: #E63946;
		text-align: center;
		padding: 20rpx;
		font-size: 24rpx;
	}

	.report-list {
		padding: 30rpx;
	}

	.list-item {
		background-color: #ffffff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
		animation: fade-in 0.5s ease-out forwards;
		opacity: 0;
	}

	.item-header {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.avatar {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.user-info {
		flex: 1;
	}

	.nickname {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
	}

	.id {
		font-size: 24rpx;
		color: #999;
	}

	.status {
		font-size: 28rpx;
		font-weight: bold;
	}

	.status-win {
		color: #4CAF50;
	}

	.status-lose {
		color: #F44336;
	}

	.status-pending {
		color: #FF9800;
	}

	.item-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1rpx solid #eee;
		padding-top: 20rpx;
	}

	.time {
		font-size: 24rpx;
		color: #999;
	}

	.view-details {
		background-color: #E63946;
		color: #ffffff;
		padding: 10rpx 20rpx;
		border-radius: 30rpx;
		font-size: 24rpx;
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
</style>
