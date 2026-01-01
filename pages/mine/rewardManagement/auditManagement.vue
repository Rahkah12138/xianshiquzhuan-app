<template>
	<view class="audit-container">
		<!-- Tabs -->
		<view class="tabs-container">
			<view :class="['tab-item', Inv==1?'active':'']" @click="TapList(1)">待审核</view>
			<view :class="['tab-item', Inv==2?'active':'']" @click="TapList(2)">已审核</view>
		</view>

		<!-- Audit List -->
		<view class="audit-list">
			<view class="audit-card" v-for="item in examineList" :key="item.order_id" @click="shenHe(item.order_id)">
				<view class="card-header">
					<image class="avatar" :src="item.avatar" mode="aspectFill"></image>
					<view class="header-content">
						<view class="title">{{item.title}}</view>
						<view class="subtitle">{{item.tasktype}}</view>
					</view>
					<view class="price">+{{item.price}}元</view>
				</view>
				<view class="card-body">
					<view>进行中：{{item.received}}</view>
					<view>剩余：{{item.surplus}}</view>
				</view>
				<view class="card-footer">
					<button v-if="type===1" class="btn-audit">
						<image src="/static/user/xssh.png"></image>
						审核
					</button>
					<button v-if="item.ordertype==1&&type==2" class="btn-pass">
						<image src="/static/user/xstg.png"></image>
						通过
					</button>
					<template v-if="item.ordertype==5&&type==2">
						<button class="btn-report" v-if="item.is_jubao > 0">
							<image src="/static/user/xsbh.png"></image>
							<text v-if="item.is_jubao == 1">举报中</text>
							<text v-if="item.is_jubao == 2">举报通过</text>
							<text v-if="item.is_jubao == 3">举报拒绝</text>
						</button>
						<button class="btn-reject" @click.stop="goReason(item.order_id)">
							<image src="/static/user/xsbh.png"></image>
							驳回
						</button>
					</template>
				</view>
			</view>
		</view>

		<!-- Popup -->
		<view v-show="isJoin" @touchmove.stop.prevent="stopSlide">
			<view class="mask" @click="join"></view>
			<view class="prompt-box">
				<image src="/static/detail/del.png" class="close-img" @click="join"></image>
				<view class="prompt-title">
					<image src="/static/release/yellow.png"></image>
					<text>提示</text>
				</view>
				<view class="prompt-text">驳回原因:{{info}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "Tab",
		data() {
			return {
				Inv: 1,
				type: 1,
				examineList: [],
				opcitId: '',
				isJoin: false,
				info: '',


			};
		},
		onLoad(event) {
			this.opcitId = event.id
			this.cadbcd()
		},
		onShow() {
			this.cadbcd()
		},
		methods: {
			join() {
				let that = this;
				that.isJoin = !that.isJoin;
			},
			cadbcd() {
				this.examineList = [];
				uni.request({
					url: this.global.url + "/api/task/examinelist",
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
						taskId: this.opcitId,
						type: this.type
					},
					success: (res) => {
						this.examineList = res.data.data

					}
				})

			},
			TapList(e) {
				this.Inv = e
				this.type = e
				uni.request({
					url: this.global.url + "/api/task/examinelist",
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
						taskId: this.opcitId,
						type: e
					},
					success: (res) => {
						this.examineList = res.data.data

					}
				})
			},
			shenHe(id, o) {
				uni.navigateTo({
					url: "/pages/mine/rewardManagement/audit?id=" + id + '&type=' + this.Inv
				})
			},
			getImgUrl(imae) {
				return this.global.url + imae;
			},
			// 跳转到驳回详情
			goReason(id) {
				let that = this;
				uni.request({
					url: this.global.url + '/api/order/reject',
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
						orderId: id
					},
					success: (res) => {

						if (res.data.code == 1) {
							that.info = res.data.data;
							that.isJoin = !that.isJoin;
						}

					}
				})

			}
		}
	}
</script>

<style lang="scss" scoped>
	.audit-container {
		background-color: #f8f8f8;
		min-height: 100vh;
	}

	.tabs-container {
		background-color: #ffffff;
		display: flex;
		justify-content: space-around;
		border-bottom: 1px solid #eeeeee;
	}

	.tab-item {
		font-size: 30rpx;
		color: #999;
		padding: 20rpx 0;
		cursor: pointer;
		transition: color 0.3s ease;
		border-bottom: 2px solid transparent;
		flex: 1;
		text-align: center;
		font-weight: bold;
	}

	.tab-item.active {
		color: $uni-color-primary;
		border-bottom: 2px solid $uni-color-primary;
	}

	.audit-list {
		padding: 20rpx;
	}

	.audit-card {
		background-color: #ffffff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.card-header {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.avatar {
		width: 90rpx;
		height: 90rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.header-content {
		flex: 1;
	}

	.title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
	}

	.subtitle {
		font-size: 26rpx;
		color: #999;
	}

	.price {
		font-size: 32rpx;
		font-weight: bold;
		color: $uni-color-primary;
	}

	.card-body {
		display: flex;
		justify-content: space-between;
		font-size: 26rpx;
		color: #666;
		padding: 20rpx 0;
		border-top: 1px solid #f0f0f0;
		border-bottom: 1px solid #f0f0f0;
	}

	.card-footer {
		display: flex;
		justify-content: flex-end;
		padding-top: 20rpx;

		button {
			display: flex;
			align-items: center;
			font-size: 26rpx;
			background: none;
			border: none;
			padding: 5rpx 15rpx;
			margin-left: 20rpx;

			image {
				width: 30rpx;
				height: 30rpx;
				margin-right: 10rpx;
			}
		}

		.btn-audit {
			color: $uni-color-primary;
		}

		.btn-pass {
			color: #4cd964;
		}

		.btn-report,
		.btn-reject {
			color: #dd524d;
		}
	}

	.mask {
		z-index: 99;
		background: rgba(0, 0, 0, 0.4);
		position: fixed;
		bottom: 0;
		right: 0;
		left: 0;
		top: 0;
	}

	.prompt-box {
		width: 80%;
		max-width: 600rpx;
		z-index: 999;
		background: #ffffff;
		border-radius: 20rpx;
		overflow: hidden;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		padding: 30rpx;
	}

	.close-img {
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		right: 20rpx;
		top: 20rpx;
	}

	.prompt-title {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 34rpx;
		margin-bottom: 30rpx;

		image {
			width: 50rpx;
			height: 50rpx;
			margin-right: 20rpx;
		}
	}

	.prompt-text {
		font-size: 28rpx;
		text-align: center;
	}
</style>
