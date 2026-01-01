<template>
	<view class="recharge-container">
		<!-- Header Section -->
		<view class="header-section">
			<image class="header-bg" src="../../../static/tixiani.jpg" mode="aspectFill"></image>
			<view class="header-content">
				<text class="balance-amount">¥ {{info.money || '0.00'}}</text>
			</view>
		</view>

		<!-- Main Content -->
		<view class="main-content">
			<view class="recharge-card">
				<view class="card-title">账户充值</view>
				<view class="amount-section">
					<text class="amount-label">充值金额</text>
					<view class="input-wrapper" :class="{'input-error': inputError}">
						<text class="currency-symbol">¥</text>
						<input class="amount-input" v-model="moy" type="number" placeholder="0.00" placeholder-class="input-placeholder" @focus="inputError = false" />
					</view>
				</view>

				<view class="payment-methods">
					<view class="method" :class="{ 'active': activeRadio === 'alipay' }" @click="selectPayment('alipay')">
						<image class="method-icon" src="../../../static/recharge/alis.png"></image>
						<text class="method-name">支付宝</text>
						<view class="checkmark" v-if="activeRadio === 'alipay'">
							<view class="checkmark-icon">✓</view>
						</view>
					</view>
					<view class="method" :class="{ 'active': activeRadio === 'wechat' }" @click="selectPayment('wechat')">
						<image class="method-icon" src="../../../static/recharge/wxs.png"></image>
						<text class="method-name">微信</text>
						<view class="checkmark" v-if="activeRadio === 'wechat'">
							<view class="checkmark-icon">✓</view>
						</view>
					</view>
				</view>
			</view>

			<!-- Disclaimer -->
			<view class="disclaimer">
				<view class="disclaimer-icon">✓</view>
				<text class="disclaimer-text">我已知未消费完的资金提现手续费以会员等级为准，请适当充值，提现手续费不予退回,一旦查出套现洗钱嫌疑，将延迟5-7个工作日提现，情节恶劣者将进行封号处罚和充值限制！</text>
			</view>
		</view>

		<!-- Recharge Button -->
		<view class="footer">
			<button class="recharge-btn" @click="onRecharge">立即充值</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeRadio: 'alipay',
				moy: '',
				info: {},
				inputError: false
			}
		},
		onLoad() {
			this.loadPageData();
		},
		methods: {
			// 统一加载页面数据，避免竞态条件
			async loadPageData() {
				try {
					// 先获取用户余额信息
					await this.getWithdrawal();
					// 再获取支付配置信息并合并
					await this.isOpen();
				} catch (e) {
					console.error('加载数据失败:', e);
				}
			},
			selectPayment(method) {
				this.activeRadio = method;
			},
			getWithdrawal() {
				let that = this;
				return new Promise((resolve, reject) => {
					uni.request({
						url: that.global.url + "/api/user/withdrawal",
						method: "POST",
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							token: uni.getStorageSync("token").token,
						},
						success: (res) => {
							if (res.data.code == 1) {
								that.info = res.data.data;
							}
							resolve(res);
						},
						fail: (err) => {
							reject(err);
						}
					})
				});
			},
			isOpen() {
				let that = this;
				return new Promise((resolve, reject) => {
					uni.request({
						url: this.global.url + "/api/recharge/pay",
						method: "POST",
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							token: uni.getStorageSync("token").token,
						},
						success: (res) => {
							if (res.data.code == 1) {
								// 合并数据而非覆盖，保留 getWithdrawal 获取的余额信息
								that.info = Object.assign({}, that.info, res.data.data);
							}
							resolve(res);
						},
						fail: (err) => {
							reject(err);
						}
					})
				});
			},
			onRecharge() {
				let that = this;
				if (!that.moy || parseFloat(that.moy) <= 0) {
					this.inputError = true;
					uni.showToast({
						title: "请输入有效的充值金额",
						icon: "none"
					});
					setTimeout(() => {
						this.inputError = false;
					}, 500);
					return;
				}
				if (this.activeRadio === 'wechat') {
					if (this.info.wechat_payment != 1) {
						uni.showToast({
							title: "微信充值暂未开放",
							icon: "none"
						});
						return;
					}
				}
				uni.request({
					url: this.global.url + "/api/user/recharge",
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
						paytype: that.activeRadio,
						// #ifdef H5
						method: "wap",
						// #endif
						// #ifdef APP-PLUS
						method: "app",
						// #endif
						money: that.moy,
					},
					success: (res) => {
						if (res.data.code == 1) {
							// #ifdef H5
							if (that.activeRadio == "wechat") {
								// H5微信支付 - 跳转到微信支付页面
								if (res.data.data && res.data.data.mweb_url) {
									window.location.href = res.data.data.mweb_url;
								} else if (res.data.data && typeof res.data.data === 'string' && res.data.data.indexOf('http') === 0) {
									window.location.href = res.data.data;
								} else {
									uni.showToast({
										title: '微信支付参数错误',
										icon: 'none'
									});
								}
							} else {
								var u = navigator.userAgent;
								var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
								let divForm = document.getElementsByTagName('divform')
								if (divForm.length) {
									document.body.removeChild(divForm[0])
								}
								const div = document.createElement('divform');
								div.innerHTML = res.data.data;
								document.body.appendChild(div);
								if (isiOS) {
									document.forms[0].submit();
								} else {
									document.forms[0].setAttribute('target', '_blank')
									document.forms[0].submit();
								}
							}
							// #endif
							// #ifdef APP-PLUS
							if (that.activeRadio == "wechat") {
								// APP微信原生支付
								let payData = res.data.data;
								// 处理返回数据格式
								let orderInfo = {};
								if (typeof payData === 'object') {
									orderInfo = {
										appid: payData.appid || payData.appId,
										noncestr: payData.noncestr || payData.nonceStr,
										package: payData.package || 'Sign=WXPay',
										partnerid: payData.partnerid || payData.partnerId || payData.mch_id,
										prepayid: payData.prepayid || payData.prepayId || payData.prepay_id,
										timestamp: String(payData.timestamp || payData.timeStamp),
										sign: payData.sign || payData.paySign
									};
								}
								uni.requestPayment({
									provider: 'wxpay',
									orderInfo: orderInfo,
									success: function(payRes) {
										uni.showToast({
											title: '支付成功',
											icon: 'success'
										});
										// 刷新余额
										that.getWithdrawal();
									},
									fail: function(err) {
										console.log('微信支付失败:', err);
										if (err.errMsg && err.errMsg.indexOf('cancel') > -1) {
											uni.showToast({
												title: '已取消支付',
												icon: 'none'
											});
										} else {
											uni.showToast({
												title: '支付失败',
												icon: 'none'
											});
										}
									}
								});
							} else {
								uni.requestPayment({
									provider: that.activeRadio,
									orderInfo: res.data.data,
									success: function(res) {
										uni.showToast({
											title: '支付成功',
											icon: 'success'
										});
										that.getWithdrawal();
									},
									fail: function(err) {
										console.log('支付宝支付失败:', err);
										uni.showToast({
											title: '支付失败',
											icon: 'none'
										});
									}
								});
							}
							// #endif
						} else {
							uni.showToast({
								title: res.data.msg || '充值失败',
								icon: 'none'
							});
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.recharge-container {
		background-color: #f8f8f8;
		min-height: 100vh;
		overflow: hidden;
	}

	.header-section {
		position: relative;
		height: 200rpx;
		color: white;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 50rpx;
		animation: fadeInDown 0.8s ease-out;
	}

	.header-bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}

	.header-content {
		position: relative;
		z-index: 2;
	}

	.balance-amount {
		font-size: 56rpx;
		font-weight: bold;
		margin-top: 20rpx;
		display: block;
	}

	.main-content {
		padding: 0 30rpx;
		margin-top: -50rpx;
		position: relative;
		z-index: 3;
	}

	.recharge-card {
		background-color: white;
		border-radius: 20rpx;
		padding: 40rpx;
		box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.05);
		animation: fadeInUp 0.8s ease-out;
	}

	.card-title {
		font-size: 34rpx;
		font-weight: bold;
		margin-bottom: 40rpx;
	}

	.amount-label {
		font-size: 28rpx;
		color: #666;
	}

	.input-wrapper {
		display: flex;
		align-items: center;
		border-bottom: 2rpx solid #eee;
		padding: 20rpx 0;
		margin-top: 20rpx;
		transition: border-color 0.3s;
	}

	.input-wrapper:focus-within {
		border-color: #e63946;
	}

	.currency-symbol {
		font-size: 60rpx;
		color: #333;
		font-weight: bold;
	}

	.amount-input {
		flex: 1;
		font-size: 60rpx;
		font-weight: bold;
		color: #333;
		margin-left: 20rpx;
	}

	.input-placeholder {
		color: #ccc;
	}

	.payment-methods {
		display: flex;
		justify-content: space-between;
		margin-top: 50rpx;
	}

	.method {
		width: 48%;
		height: 160rpx;
		border: 2rpx solid #eee;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		transition: all 0.3s ease;
		transform-origin: center;
	}

	.method.active {
		border-color: #e63946;
		background-color: #fff8f8;
		transform: scale(1.05);
	}

	.method-icon {
		width: 80rpx;
		height: 80rpx;
	}

	.method-name {
		font-size: 24rpx;
		margin-top: 10rpx;
		color: #666;
	}

	.checkmark {
		position: absolute;
		top: -10rpx;
		right: -10rpx;
		width: 40rpx;
		height: 40rpx;
		background-color: #e63946;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.checkmark-icon {
		color: white;
		font-size: 24rpx;
	}

	.disclaimer {
		display: flex;
		align-items: flex-start;
		margin-top: 40rpx;
		padding: 20rpx;
		background-color: #fff8f8;
		border-radius: 10rpx;
		animation: fadeInUp 1s ease-out;
	}

	.disclaimer-icon {
		width: 30rpx;
		height: 30rpx;
		line-height: 30rpx;
		text-align: center;
		color: #55cd9b;
		font-weight: bold;
		margin-right: 20rpx;
	}

	.disclaimer-text {
		flex: 1;
		font-size: 20rpx;
		color: #e63946;
	}

	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		padding: 30rpx;
		background-color: white;
		box-shadow: 0 -5rpx 20rpx rgba(0, 0, 0, 0.05);
		display: flex;
		justify-content: center;
	}

	.recharge-btn {
		width: 90%;
		height: 90rpx;
		line-height: 90rpx;
		background: linear-gradient(to right, #e63946, #ff6b6b);
		color: white;
		font-size: 32rpx;
		border-radius: 45rpx;
		text-align: center;
		box-shadow: 0 10rpx 20rpx rgba(230, 57, 70, 0.3);
		transition: transform 0.2s;
	}

	.recharge-btn:active {
		transform: scale(0.98);
	}

	/* Animations */
	@keyframes fadeInDown {
		from {
			opacity: 0;
			transform: translateY(-30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.input-error {
		animation: shake 0.5s ease-in-out;
	}

	@keyframes shake {
		0%, 100% { transform: translateX(0); }
		10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
		20%, 40%, 60%, 80% { transform: translateX(10px); }
	}
</style>
