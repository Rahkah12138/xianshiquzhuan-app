<template>
	<view class="top-container">
		<!-- Remaining Time Card -->
		<view class="info-card">
			<view>我的剩余置顶时间</view>
			<view class="time">{{tophour}}小时</view>
		</view>

		<!-- Instructions Card -->
		<view class="instructions-card">
			<view class="title">购买须知*</view>
			<view>1、置顶包仅限<text class="highlight">会员才能购买;</text></view>
			<view>2、置顶包购买后不支持退订，请确认后购买</view>
			<view class="title" style="margin-top: 20rpx;">置顶的作用：</view>
			<view>适用于悬赏主，提高悬赏任务曝光。(若您不是悬赏主，请谨慎购买)</view>
		</view>

		<!-- Top-up Options -->
		<view class="top-up-grid">
			<view :class="['grid-item', {'active': val == index}]" @click="setTop(index)" v-for="(item,index) in topbags" :key="index">
				<view class="hours"><text class="amount">{{index}}</text>小时</view>
				<view class="price">￥{{item}}元</view>
			</view>
		</view>

		<!-- Purchase Button -->
		<button class="btn-purchase" @click="onRecharge()">购买</button>

		<!-- FAB -->
		<view class="fab-button" @click="goFresh">
			<image src="../../../static/user/refresh.png"></image>
			<text>刷新包</text>
		</view>

		<!-- Popups -->
		<view class="popup-mask" v-if="show" @click.self="quxiao">
			<view class="payment-popup">
				<view class="payment-option" @click="payMoney(1)" v-if="wxShow">
					<image src="/static/user/wx.png"></image>
					<text>微信</text>
				</view>
				<view class="payment-option" @click="payMoney(2)" v-if="zfShow">
					<image src="/static/user/zfb.png"></image>
					<text>支付宝</text>
				</view>
				<view class="payment-option" @click="payMoney(3)" v-if="yeShow">
					<image src="/static/user/icon_ye.png"></image>
					<text>余额</text>
				</view>
				<view class="btn-cancel" @click="cla">取消</view>
			</view>
		</view>

		<view class="popup-mask" v-if="maskShow">
			<view class="confirm-popup">
				<view class="popup-title">
					<image src="/static/release/yellow.png"></image>
					<text>提示</text>
				</view>
				<view class="popup-content">确定要使用余额支付吗？</view>
				<view class="popup-actions">
					<button class="btn-cancel" @click="cancel">取消</button>
					<button class="btn-confirm" @click="definea">确定</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				val: 1,
				money: '',
				baozhenjin: [],
				activeRadio: '',
				pcla: '',
				topbags: [],
				tophour: 0,
				show: false,
				maskShow: false,
				wxShow: '', //微信
				zfShow: '', //支付宝
				yeShow: '', //余额
			}
		},
		onLoad() {


		},
		async onShow() {
			this.getWithdrawal();

			let obj = await this.init();
			console.log(obj);
			if (obj.wechat_payment == 1) {
				this.wxShow = true
			} else {
				this.wxShow = false
			}
			if (obj.alipay_payment == 1) {
				this.zfShow = true
			} else {
				this.zfShow = false
			}
			if (obj.balance_payment == 1) {
				this.yeShow = true
			} else {
				this.yeShow = false
			}

		},
		methods: {
			cla() {
				this.show = false
			},
			cancel() {
				this.maskShow = false
			},
			definea() {
				let paytype = '';
				let _this = this
				this.isJoin = true
				paytype = 'money'
				uni.request({
					url: _this.global.url + '/api/recharge/topbag_store_money',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
						paytype: paytype,
						method: "app",
						val: _this.val,
					},
					success: (re) => {
						_this.maskShow = false;
						if (re.data.code == 1) {
							uni.showToast({
								title: re.data.msg,
								icon: 'none'
							})
							_this.isJoin = false
						} else {
							uni.showToast({
								title: re.data.msg,
								icon: 'none'
							})
						}
					}
				})
			},
			//支付
			payMoney(ty) {
				let that = this;
				if (ty) {
					if (ty == 1) {
						that.type = 'wechat'
						uni.showToast({
							title: "暂未开放",
							icon: "none"
						})
						return
					} else if (ty == 2) {
						that.type = 'alipay'
						uni.request({
							url: that.global.url + '/api/recharge/topbag_store_money',
							method: "POST",
							header: {
								'content-type': 'application/x-www-form-urlencoded'
							},
							data: {
								token: uni.getStorageSync("token").token,
								paytype: that.type,
								// #ifdef H5
								method: "wap",
								// #endif
								// #ifdef APP-PLUS
								method: "wap",
								// #endif
								val: that.val,

							},
							success(res) {
								console.log(res)
								if (res.data.code == 1) {
									that.show = false;
									if (ty == 2) {

										// #ifdef H5
										let divForm = document.getElementsByTagName('divform')
										if (divForm.length) {
											document.body.removeChild(divForm[0])
										}
										const div = document.createElement('divform');
										div.innerHTML = res.data.data; // data就是接口返回的form 表单字符串
										document.body.appendChild(div);
										document.forms[0].setAttribute('target', '_blank') // 新开窗口跳转
										document.forms[0].submit();

										// #endif


										// #ifdef APP-PLUS
										uni.requestPayment({
											provider: 'alipay',
											orderInfo: res.data.data,
											success: function(res) {
												console.log('success:' + JSON.stringify(res));
											},
											fail: function(err) {
												console.log('fail:' + JSON.stringify(err));
											}
										});
										// #endif

									}
								} else if (res.data.code == 0) {
									// that.show = false;
									uni.showToast({
										title: "暂未开放",
										icon: "none"
									})
								}
							}
						})
					} else {
						this.maskShow = true
					}
				} else {
					uni.showToast({
						title: "支付失败",
						icon: "none"
					})
				}
			},
			quxiao() {
				this.show = false
			},
			goFresh() {
				uni.navigateTo({
					//url:'/pages/task/dp_xinbao'
					url: '/pages/mine/rewardManagement/renovate'
				})
			},
			setTop(val) {
				this.val = val
			},
			init() {
				let _this = this;
				return new Promise((resolve, reject) => {
					uni.request({
						url: _this.global.url + '/api/index/switchOn',
						method: "POST",
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						success(res) {
							if (res.data.code == 1) {
								resolve(res.data.data)

							}
						}
					})
				})
			},
			// 获取提现的信息
			getWithdrawal() {
				let that = this;
				uni.request({
					url: that.global.url + "/api/user/topbag",
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,

					},
					success: (res) => {

						if (res.data.code == 1) {
							that.topbags = res.data.data.topbag
							that.tophour = res.data.data.tophour

							let keys = Object.keys(that.topbags)
							console.log(keys, 'keys')
							that.val = keys[0]
							let arr = res.data.data.topbag
							console.log(that.topbags, 'topbags')



						}

					}
				})
			},
			// 获取全部的金额
			WithdrawalInFull() {
				let that = this;
				that.money = that.baozhenjin.money;

			},
			// 提现
			onRecharge() {

				if (this.val) {
					this.show = true;
				} else {
					uni.showToast({
						title: "请先选择置顶包",
						icon: "none"
					})
				}




			},

			chan(e) {
				this.activeRadio = e.detail.value;
			},

		}
	}
</script>

<style lang="scss" scoped>
	.top-container {
		background-color: #f8f8f8;
		min-height: 100vh;
		padding: 30rpx;
	}

	.info-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #ffffff;
		padding: 30rpx;
		border-radius: 20rpx;
		font-weight: bold;
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.05);
		animation: slide-up 0.5s ease-out;
	}

	.time {
		color: $uni-color-primary;
	}

	.instructions-card {
		background-color: #ffffff;
		padding: 30rpx;
		border-radius: 20rpx;
		margin-top: 30rpx;
		font-size: 28rpx;
		line-height: 1.6;
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.05);
		animation: slide-up 0.6s ease-out;

		.title {
			font-weight: bold;
			color: #333;
			margin-bottom: 10rpx;
		}

		.highlight {
			color: $uni-color-primary;
		}
	}

	.top-up-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 20rpx;
		margin-top: 40rpx;
		margin-right: -150rpx;
	}

	.grid-item {
		width: calc(33.333% - 14rpx);
		background-color: #ffffff;
		border-radius: 20rpx;
		padding: 30rpx;
		text-align: center;
		border: 1px solid #eee;
		transition: all 0.3s ease;
		animation: scale-in 0.5s ease-out;

		&.active {
			border-color: $uni-color-primary;
			background-color: lighten($uni-color-primary, 40%);
			transform: scale(1.05);
		}
	}

	.hours {
		font-size: 28rpx;
		color: #666;

		.amount {
			font-size: 48rpx;
			font-weight: bold;
			color: #333;
		}
	}

	.price {
		color: $uni-color-primary;
		font-weight: bold;
		font-size: 32rpx;
		margin-top: 10rpx;
	}

	.btn-purchase {
		margin-top: 60rpx;
		background: linear-gradient(135deg, $uni-color-primary, darken($uni-color-primary, 10%));
		color: #ffffff;
		border-radius: 40rpx;
		font-size: 32rpx;
		height: 90rpx;
		line-height: 90rpx;
	}

	.fab-button {
		position: fixed;
		right: 40rpx;
		bottom: 50rpx;
		width: 120rpx;
		height: 120rpx;
		background: linear-gradient(135deg, $uni-color-primary, darken($uni-color-primary, 10%));
		border-radius: 50%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
		z-index: 999;
		transition: transform 0.2s ease;
		animation: fab-pop-in 0.3s ease-out, fab-pulse 2s infinite 1s;

		image {
			width: 40rpx;
			height: 40rpx;
			filter: brightness(0) invert(1);
		}

		text {
			font-size: 22rpx;
			color: #ffffff;
			margin-top: 5rpx;
		}
	}

	.fab-button:active {
		transform: scale(0.95);
	}

	.popup-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.4);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
	}

	.payment-popup {
		width: 100%;
		background-color: #ffffff;
		position: fixed;
		bottom: 0;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		padding: 40rpx;
		animation: slide-up 0.3s ease-out;
	}

	.payment-option {
		display: flex;
		align-items: center;
		padding: 20rpx 0;
		font-size: 30rpx;

		image {
			width: 50rpx;
			height: 50rpx;
			margin-right: 20rpx;
		}
	}

	.confirm-popup {
		width: 80%;
		max-width: 600rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
		padding: 40rpx;
		text-align: center;
		animation: scale-in 0.3s ease-out;
	}

	.popup-title {
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

	.popup-content {
		font-size: 28rpx;
		margin-bottom: 40rpx;
	}

	.popup-actions {
		display: flex;
		gap: 20rpx;
	}

	.btn-cancel,
	.btn-confirm {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 40rpx;
		font-size: 30rpx;
	}

	.btn-cancel {
		background-color: #f0f0f0;
		color: #333;
	}

	.btn-confirm {
		background-color: $uni-color-primary;
		color: #ffffff;
	}

	@keyframes slide-up {
		from {
			transform: translateY(100%);
		}

		to {
			transform: translateY(0);
		}
	}

	@keyframes fab-pop-in {
		from {
			transform: scale(0);
			opacity: 0;
		}

		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes fab-pulse {
		0% {
			box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
		}

		50% {
			box-shadow: 0 8rpx 30rpx rgba($uni-color-primary, 0.5);
		}

		100% {
			box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
		}
	}

	@keyframes scale-in {
		from {
			transform: scale(0.8);
			opacity: 0;
		}

		to {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
