<template>
	<view class="user-profile-container">
		<!-- Skeleton Loading -->
		<view v-if="isLoading">
			<!-- Header Skeleton -->
			<view class="profile-header">
				<view class="user-info-card">
					<view class="card-left">
						<view class="skeleton-avatar skeleton-animate"></view>
						<view class="user-details">
							<view class="skeleton-line skeleton-animate" style="width: 150rpx; height: 36rpx;"></view>
							<view class="skeleton-line skeleton-animate" style="width: 120rpx; margin-top: 15rpx;"></view>
						</view>
					</view>
				</view>
				<view class="social-stats">
					<view class="stat-item" v-for="i in 2" :key="i">
						<view class="skeleton-line skeleton-animate" style="width: 60rpx; height: 32rpx; margin: 0 auto;"></view>
						<view class="skeleton-line skeleton-animate" style="width: 80rpx; margin: 10rpx auto 0;"></view>
					</view>
				</view>
			</view>

			<!-- Body Skeleton -->
			<view class="profile-body">
				<view class="card">
					<view class="skeleton-line skeleton-animate" style="width: 200rpx; height: 32rpx; margin-bottom: 30rpx;"></view>
					<view class="stats-grid">
						<view class="grid-item" v-for="i in 6" :key="i">
							<view class="skeleton-line skeleton-animate" style="width: 80rpx; height: 32rpx; margin: 0 auto;"></view>
							<view class="skeleton-line skeleton-animate" style="width: 120rpx; margin: 10rpx auto 0;"></view>
						</view>
					</view>
				</view>
				<view class="card">
					<view class="skeleton-line skeleton-animate" style="width: 150rpx; height: 32rpx; margin-bottom: 20rpx;"></view>
					<view class="task-list">
						<view class="task-item" v-for="i in 3" :key="i">
							<view class="item-left">
								<view class="skeleton-task-avatar skeleton-animate"></view>
								<view class="task-info">
									<view class="skeleton-line skeleton-animate" style="width: 250rpx;"></view>
									<view class="skeleton-line skeleton-animate" style="width: 180rpx; margin-top: 15rpx;"></view>
								</view>
							</view>
							<view class="item-right">
								<view class="skeleton-line skeleton-animate" style="width: 100rpx; height: 32rpx;"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<template v-else>
			<!-- 头部 -->
			<view class="profile-header">
				<view class="user-info-card">
				<view class="card-left">
					<image class="avatar" :src="imgUrl" mode="aspectFill"></image>
					<view class="user-details">
						<view class="nickname">{{personal.nickname}}</view>
						<view class="user-id">ID：{{use_id}}</view>
						<view class="tags">
							<image v-if="personal.top==1" src="../../static/dp_detail/icon_top@6.png"></image>
							<image v-if="personal.recommend==1" src="../../static/dp_detail/icon_tuijian@6.png"></image>
							<image v-if="personal.bonds==1" src="/static/shouye/icon_bao@2x.png"></image>
						</view>
					</view>
				</view>
				<view class="card-right" v-if="userinfo.id != use_id">
					<button class="follow-btn" v-if="personal.do_follow == 0" @click="guanZhu(use_id)">关注</button>
					<button class="follow-btn followed" v-if="personal.do_follow == 1" @click="WeiguanZhu(use_id)">已关注</button>
				</view>
			</view>
			<view class="social-stats">
				<view class="stat-item">
					<text class="value">{{personal.fans}}</text>
					<text class="label">粉丝</text>
				</view>
				<view class="stat-item">
					<text class="value">{{personal.follow}}</text>
					<text class="label">关注</text>
				</view>
			</view>
		</view>

		<!-- 主体内容 -->
		<view class="profile-body">
			<!-- 店铺数据 -->
			<view class="card">
				<view class="card-title">店铺数据统计</view>
				<view class="stats-grid">
					<view class="grid-item">
						<text class="value">{{personal.bond}}</text>
						<text class="label">保证金(元)</text>
					</view>
					<view class="grid-item">
						<text class="value">{{personal.task_num}}</text>
						<text class="label">发布任务(个)</text>
					</view>
					<view class="grid-item">
						<text class="value">{{personal.task_order}}</text>
						<text class="label">总成交(单)</text>
					</view>
					<view class="grid-item">
						<text class="value">{{personal.task_num}}</text>
						<text class="label">接单任务(单)</text>
					</view>
					<view class="grid-item">
						<text class="value">{{personal.businessid}}</text>
						<text class="label">被申诉(个)</text>
					</view>
					<view class="grid-item">
						<text class="value">{{personal.appeal}}</text>
						<text class="label">申诉(次)</text>
					</view>
				</view>
			</view>

			<!-- 店铺任务 -->
			<view class="card">
				<view class="card-title">店铺任务</view>
				<view class="task-list">
					<view class="task-item" v-for="(c,index) in information" :key="index" @click="tiaoZ(c.id)">
						<view class="item-left">
							<image class="task-avatar" :src="c.avatar" mode=""></image>
							<view class="task-info">
								<view class="task-title">{{c.title}}</view>
								<view class="task-tags">
									<text class="tag">{{c.tasktypename}}</text>
									<text class="tag">{{c.entryname}}</text>
								</view>
								<view class="task-meta">已赚 {{c.received}} | 剩余 {{c.surplus}}</view>
							</view>
						</view>
						<view class="item-right">
							<view class="price">+{{c.price}}元</view>
						</view>
					</view>
					<view class="null_content" v-if="showImg">
						<image src="/static/search/tip.png" mode=""></image>
						<view>暂无数据</view>
					</view>
				</view>
			</view>
		</view>
		
		<myPopup :title="title" :tip="tip" :fatherMethod="fatherMethod" v-if="isPopup" @ispopup="ispopup"></myPopup>
		</template>
	</view>
</template>

<script>
	// Script content remains the same
	import myPopup from "@/components/my-popup.vue"
	export default {
		data() {
			return {
				isLoading: true,
				personal: [],
				information: [],
				use_id: '',
				userinfo: uni.getStorageSync('token'),
				showImg: false,
				title: "提示",
				tip: "是否取消关注",
				delFollow: "/api/User/saveFollowDel",
				ids: "",
				isPopup: false,
				imgUrl: '', //用户头像
			}
		},
		onLoad(event) {
			this.use_id = event.id
			this.getFSList()
		},
		components: {
			myPopup
		},
		methods: {
			ispopup(value) {
				let that = this;
				if (value == true) {
					that.isPopup = !that.isPopup;
					that.getFSList()
				} else {
					that.isPopup = !that.isPopup;
				}
			},
			getFSList() {
				let _this = this
				uni.request({
					url: this.global.url + '/api/user/information',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						userId: this.use_id,
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						this.imgUrl = res.data.data.avatar.includes('http')? res.data.data.avatar : this.global.url + res.data.data.avatar;
						this.information = res.data.data.tasklist;
						this.information.forEach(item => {
							if (item) {
								item.avatar = item.avatar.includes('http')? item.avatar : this.global.url + item.avatar;
							}
						});
						this.personal = res.data.data
						if (this.information.length <= 0) {
							this.showImg = true
						}
					},
					complete: () => {
						this.isLoading = false;
					}
				})
			},
			tiaoZ(id) {
				uni.navigateTo({
					url: '/pages/task/detail?id=' + id
				})
			},
			guanZhu(c) {
				uni.request({
					url: this.global.url + "/api/User/saveFollowAdd",
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token,
						follow_id: c
					},
					success: (res) => {
						if (res.data.code == 1) {
							this.getFSList()
						}
					}
				})
			},
			WeiguanZhu(a) {
				let that = this;
				that.ids = Number(that.use_id);
				that.isPopup = true;
			},
			fatherMethod() {
				let that = this
				uni.request({
					url: that.global.url + that.delFollow,
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						follow_id: that.ids,
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						if (res.data.code == 1) {
							that.isPopup = false
							that.getFSList()
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
						}
					}
				});
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
		margin-right: 20rpx;
	}

	.skeleton-task-avatar {
		width: 100rpx;
		height: 100rpx;
		border-radius: 16rpx;
		margin-right: 20rpx;
	}

	.skeleton-line {
		height: 24rpx;
		border-radius: 8rpx;
	}

	.user-profile-container {
		background-color: #f7f8fa;
		min-height: 100vh;
	}

	.profile-header {
		background: $uni-color-primary;
		padding: 20rpx 30rpx 120rpx;
		border-radius: 0 0 60rpx 60rpx;
		color: #fff;
	}

	.user-info-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		.card-left {
			display: flex;
			align-items: center;
			.avatar {
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
				border: 4rpx solid #fff;
				margin-right: 20rpx;
			}
			.user-details {
				.nickname {
					font-size: 36rpx;
					font-weight: bold;
				}
				.user-id {
					font-size: 24rpx;
					opacity: 0.8;
					margin: 8rpx 0;
				}
				.tags image {
					width: 30rpx;
					height: 30rpx;
					margin-right: 10rpx;
				}
			}
		}
		.card-right {
			.follow-btn {
				height: 60rpx;
				line-height: 60rpx;
				font-size: 26rpx;
				border-radius: 30rpx;
				padding: 0 30rpx;
				background-color: #fff;
				color: $uni-color-primary;
				&.followed {
					background-color: rgba(255, 255, 255, 0.2);
					color: #fff;
				}
			}
		}
	}

	.social-stats {
		display: flex;
		margin-top: 40rpx;
		.stat-item {
			flex: 1;
			text-align: center;
			.value {
				font-size: 32rpx;
				font-weight: bold;
				display: block;
			}
			.label {
				font-size: 24rpx;
				opacity: 0.8;
			}
		}
	}

	.profile-body {
		padding: 0 30rpx;
		margin-top: -80rpx;
		position: relative;
		z-index: 10;
	}

	.card {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
		.card-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 20rpx;
		}
	}

	.stats-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 40rpx 20rpx;
		text-align: center;
		.grid-item {
			.value {
				font-size: 32rpx;
				font-weight: bold;
				color: $uni-color-primary;
				display: block;
			}
			.label {
				font-size: 24rpx;
				color: #999;
				margin-top: 10rpx;
			}
		}
	}

	.task-list {
		.task-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx 0;
			border-bottom: 1rpx solid #f0f0f0;
			&:last-child {
				border-bottom: none;
			}
			.item-left {
				display: flex;
				align-items: center;
				.task-avatar {
					width: 100rpx;
					height: 100rpx;
					border-radius: 16rpx;
					margin-right: 20rpx;
				}
				.task-info {
					.task-title {
						font-size: 28rpx;
						color: #333;
						font-weight: 500;
					}
					.task-tags {
						margin: 10rpx 0;
						.tag {
							font-size: 22rpx;
							background-color: #fdecec;
							color: $uni-color-primary;
							padding: 4rpx 12rpx;
							border-radius: 8rpx;
							margin-right: 10rpx;
						}
					}
					.task-meta {
						font-size: 24rpx;
						color: #999;
					}
				}
			}
			.item-right {
				.price {
					font-size: 32rpx;
					font-weight: bold;
					color: $uni-color-primary;
				}
			}
		}
	}

	.null_content {
		text-align: center;
		padding: 60rpx 0;
		color: #999;
		font-size: 26rpx;
		image {
			width: 200rpx;
			height: 200rpx;
			margin-bottom: 20rpx;
		}
	}
</style>
