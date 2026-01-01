<template>
	<view class="renovate-container">
		<!-- Remaining Refreshes Card -->
		<view class="info-card">
			<text>剩余次数：{{num}}</text>
		</view>

		<!-- Refresh Pack Options -->
		<view class="options-grid">
			<view :class="['grid-item', {'active': index == isShow}]" v-for="(item,index) in list" :key="index" @click="pay(index, Object.keys(item)[0], Object.values(item)[0])">
				<text>{{Object.keys(item)[0]}}次/{{Object.values(item)[0]}}元</text>
			</view>
		</view>

		<!-- Instructions -->
		<view class="instructions-card">
			<text>{{title}}</text>
		</view>

		<!-- Action Buttons -->
		<view class="action-buttons">
			<button class="btn-cancel" @click="cancela">取消</button>
			<button class="btn-confirm" @click="define">确定</button>
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
				<view class="btn-cancel-popup" @click="cla">取消</view>
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
				title: "购买须知：刷新包使用期限不限，不支持退订，请确认后购买",
				num: 0,
				isShow: 0,
				list: [],
				show: false,
				type: '',
				times: '', //次数
				money: '',
				maskShow: false,
				wxShow: '', //微信
				zfShow: '', //支付宝
				yeShow: '', //余额
			}
		},
		async onShow() {
			this.Ocrnum();
			let _this = this
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
			//剩余次数
			Ocrnum() {
				let that = this;
				let arr = []
				uni.request({
					url: that.global.url + '/api/allocation/refresh',
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
					},
					success(res) {
						if (res.data.code == 1) {
							console.log(res);
							that.num = res.data.data.num;
							that.list = res.data.data.refresh
							for (let i in that.list) {
								let obj = {}
								obj[i] = that.list[i]
								arr.push(obj);
							}
							that.list = arr;
							let obja = '';
							that.list.forEach((item, index) => {
								if (index < 1) {
									obja = item
								}
							});
							that.times = Object.keys(obja)[0];
							for (let j in obja) {
								that.money = obja[j];
							}
						}

					},
					fail(res) {
						uni.showToast({
							title: res.data.msg,
							icon: "none",
						})
					}
				})
			},
			//支付
			pay(index, key, it) {
				this.times = key;
				this.money = it;
				if (index == 0 || this.isShow == 0) {
					this.isShow = index;
				} else if (index == 1) {
					this.isShow = index
				} else if (index == 2) {
					this.isShow = index
				} else if (index == 3) {
					this.isShow = index
				} else if (index == 4) {
					this.isShow = index
				} else if (index == 5) {
					this.isShow = index
				} else if (index == 6) {
					this.isShow = index
				} else {
					this.isShow = index
				}
			},
			//取消
			cancela() {
				console.log('1111111111')
				uni.navigateBack({
					delta: 1
				})
			},
			//确定是否选择购买数量
			define(key, it) {
				if (this.times && this.money) {
					this.show = true;
				} else {
					uni.showToast({
						title: "请先选择购买数量",
						icon: "none"
					})
				}

			},
			//弹窗取消
			cla() {
				this.show = false
			},
			quxiao() {
				this.show = false
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
							url: that.global.url + '/api/Recharge/refreshMoney',
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
								method: "app",
								// #endif
								num: that.times,
								money: that.money
							},
							success(res) {
								console.log(res)
								if (res.data.code == 1) {
									that.show = false;
									if (ty == 2) {
										// #ifdef H5
										var u = navigator.userAgent;
										var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
										var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
										let divForm = document.getElementsByTagName('divform')
										if (divForm.length) {
											document.body.removeChild(divForm[0])
										}
										const div = document.createElement('divform');
										div.innerHTML = res.data.data; // data就是接口返回的form 表单字符串
										document.body.appendChild(div);
										if (isiOS) {
											document.forms[0].submit();
										} else {
											document.forms[0].setAttribute('target', '_blank') // 新开窗口跳转
											document.forms[0].submit();
										}
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
			cancel() {
				this.maskShow = false
			},
			definea() {
				let paytype = '';
				let _this = this
				this.isJoin = true
				paytype = 'money'
				uni.request({
					url: _this.global.url + '/api/Recharge/refreshMoney',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
						paytype: paytype,
						method: "app",
						num: _this.times,
						money: _this.money
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
			}
		},
	}
</script>

<style lang="scss" scoped>
	.renovate-container {
		background-color: #f8f8f8;
		min-height: 100vh;
		padding: 30rpx;
	}

	.info-card {
		background-color: #ffffff;
		padding: 30rpx;
		border-radius: 20rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.05);
		animation: slide-up 0.5s ease-out;
	}

	.options-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 30rpx;
		margin-top: 40rpx;
	}

	.grid-item {
		background-color: #ffffff;
		border-radius: 20rpx;
		padding: 40rpx;
		text-align: center;
		font-size: 30rpx;
		color: #666;
		border: 1px solid #eee;
		transition: all 0.3s ease;
		animation: scale-in 0.5s ease-out;

		&.active {
			border-color: $uni-color-primary;
			background-color: lighten($uni-color-primary, 40%);
			color: $uni-color-primary;
			transform: scale(1.05);
		}
	}

	.instructions-card {
		background-color: #f0f0f0;
		padding: 30rpx;
		border-radius: 20rpx;
		margin-top: 40rpx;
		font-size: 24rpx;
		color: #999;
		line-height: 1.6;
	}

	.action-buttons {
		display: flex;
		gap: 30rpx;
		margin-top: 60rpx;
	}

	.btn-cancel,
	.btn-confirm {
		flex: 1;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 45rpx;
		font-size: 32rpx;
		text-align: center;
	}

	.btn-cancel {
		background-color: #e6e6e6;
		color: #999;
	}

	.btn-confirm {
		background: linear-gradient(135deg, $uni-color-primary, darken($uni-color-primary, 10%));
		color: #ffffff;
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

	.btn-cancel-popup {
		margin-top: 20rpx;
		background-color: #f0f0f0;
		color: #333;
		border-radius: 40rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
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

	@keyframes slide-up {
		from {
			transform: translateY(100%);
		}

		to {
			transform: translateY(0);
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
