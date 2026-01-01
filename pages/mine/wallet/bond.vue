<template>
	<view class="bond-container">
		<!-- Header Card -->
		<view class="header-card">
			<p class="balance-label">保证金</p>
			<p class="balance-amount">{{baozhenjin.bond}}</p>
			<view class="action-buttons">
				<button class="btn-refund" @click="Refund(baozhenjin.id)">退保证金</button>
				<button class="btn-recharge" @click="rechargeBtn(baozhenjin.id)">充值</button>
			</view>
		</view>

		<!-- Popup -->
		<myPopup :title="title" :tip="tip" :fatherMethod="fatherMethod" v-if="isPopup" @ispopup="ispopup"></myPopup>

		<!-- Instructions -->
		<view class="instructions-card">
			<h3 class="instructions-title">保证金说明</h3>
			<view class="instructions-content" v-html="earnest_money"></view>
		</view>
	</view>
</template>

<script>
	import myPopup from "@/components/my-popup.vue"
	export default {
		components: {
			myPopup
		},
		data() {
			return {
				baozhenjin: {},
				type: 1,
				isJoin: false, //是否弹窗
				pac: '',
				title: "提示",
				tip: "确定退保证金？",
				delFollow: "/api/User/saveFollowDel",
				ids: "",
				isPopup: false,
				nickname: '',
				earnest_money: '', //保证金

			}
		},
		onLoad() {
			this.getMyCard()
		},
		onShow() {
			this.getMyCard();
			this.nickname = uni.getStorageSync('user1').nickname;
			this.ysM()
		},
		methods: {
			ispopup(value) {
				let that = this;
				if (value == true) {
					that.isPopup = !that.isPopup;
				} else {
					that.isPopup = !that.isPopup;
				}
			},
			// 获取
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
					},
					success: (res) => {

						if (res.data.code == 1) {
							that.baozhenjin = res.data.data;
						}
					}
				})
			},
			Refund() {
				this.isPopup = !this.isPopup
			},
			stopSlide() {
				return
			},
			fatherMethod() {
				if (parseInt(this.baozhenjin.bond) != 0) {
					uni.request({
						url: this.global.url + "/api/user/retreat_bond",
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							token: uni.getStorageSync("token").token,
							userId: this.baozhenjin.id,
							bond: this.baozhenjin.bond,
							type: "alipay"
						},
						success: (res) => {
							if (res.data.code == 1) {
								uni.showToast({
									title: "提取成功请稍后",
									icon: "none"
								})
								this.getMyCard()
								this.isJoin = !this.isJoin
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
							}
						}
					})
				} else if (!this.nickname) {
					uni.navigateTo({
						url: '/pages/mine/setUp/bindAlipay'
					})
				} else {
					uni.showToast({
						title: "没有保证金可以退",
						icon: "none"
					})
					this.isJoin = !this.isJoin
				}

			},
			qx() {
				this.isJoin = !this.isJoin
			},
			rechargeBtn(id) {
				console.log(id)
				uni.navigateTo({
					url: "/pages/mine/wallet/rechargeBond?id=" + id
				})
			},
			//保证金说明
			ysM() {
				let _this = this
				uni.request({
					url: _this.global.url + '/api/index/explain',
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success(res) {
						if (res.data.code == 1) {
							_this.earnest_money = res.data.data.earnest_money;
						}
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.bond-container {
		background-color: #f8f8f8;
		min-height: 100vh;
		padding: 20rpx;
	}

	.header-card {
		background: linear-gradient(135deg, $uni-color-primary, darken($uni-color-primary, 10%));
		padding: 40rpx;
		color: #ffffff;
		text-align: center;
		border-radius: 20rpx;
		animation: slide-down 0.5s ease-out;
		margin-bottom: 40rpx;
	}

	.balance-label {
		font-size: 30rpx;
		opacity: 0.8;
	}

	.balance-amount {
		font-size: 60rpx;
		font-weight: bold;
		margin: 20rpx 0;
	}

	.action-buttons {
		display: flex;
		justify-content: center;
		gap: 40rpx;
		margin-top: 40rpx;
	}

	.btn-refund,
	.btn-recharge {
		color: $uni-color-primary;
		background-color: #ffffff;
		border: 1px solid #ffffff;
		border-radius: 40rpx;
		padding: 15rpx 40rpx;
		font-size: 28rpx;
		transition: all 0.3s ease;
	}

	.btn-refund:hover,
	.btn-recharge:hover {
		opacity: 0.9;
		transform: scale(1.05);
	}

	.instructions-card {
		background-color: #ffffff;
		padding: 30rpx;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.instructions-title {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
		color: #333;
		border-left: 4px solid $uni-color-primary;
		padding-left: 15rpx;
	}

	.instructions-content {
		font-size: 28rpx;
		color: #666;
		line-height: 1.6;
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
