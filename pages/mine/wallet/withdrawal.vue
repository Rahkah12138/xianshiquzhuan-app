<template>
	<view class="withdrawal-container">
		<!-- Header Section -->
		<view class="header-section">
			<image class="header-bg" src="../../../static/tixiani.jpg" mode="aspectFill"></image>
			<view class="header-content">
				<text class="balance-amount" style="margin-top: 30rpx;">¥ {{baozhenjin.money || '0.00'}}</text>
			</view>
		</view>

		<!-- Main Content -->
		<view class="main-content">
			<view class="withdrawal-card">
				<view class="card-title">提现</view>
				<view class="amount-section">
					<text class="amount-label">提现金额</text>
					<view class="input-wrapper" :class="{'input-error': inputError}">
						<text class="currency-symbol">¥</text>
						<input class="amount-input" v-model="money" type="number" placeholder="0.00" placeholder-class="input-placeholder" @input="getShidao" @focus="inputError = false" />
					</view>
					<view class="info-row">
						<text class="info-text">实到 ¥{{shidao}}</text>
						<text class="info-text">免费提现额度 ¥{{baozhenjin.freeamount}}</text>
					</view>
				</view>

				<view class="payment-methods">
					<view class="method" :class="{ 'active': paymentMethod === 'alipay' }" @click="paymentMethod = 'alipay'">
						<image class="method-icon" src="../../../static/recharge/alis.png"></image>
						<text class="method-name">支付宝</text>
						<view class="checkmark" v-if="paymentMethod === 'alipay'">
							<view class="checkmark-icon">✓</view>
						</view>
					</view>
					<view class="method" :class="{ 'active': paymentMethod === 'wechat' }" @click="paymentMethod = 'wechat'" v-if="wechatCashOpen">
						<image class="method-icon" src="../../../static/recharge/wxs.png"></image>
						<text class="method-name">微信</text>
						<view class="checkmark" v-if="paymentMethod === 'wechat'">
							<view class="checkmark-icon">✓</view>
						</view>
					</view>
				</view>
			</view>

			<!-- Instructions -->
			<view class="instructions" v-if="baozhenjin.instructions" v-html="baozhenjin.instructions"></view>
		</view>

		<!-- Withdrawal Button -->
		<view class="footer">
			<view class="withdrawal-btn" @click="onRecharge">提现</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				money: '',
				baozhenjin: {},
				shidao: '0.00',
				inputError: false,
				paymentMethod: 'alipay',
				wechatCashOpen: false
			}
		},
		onLoad() {
			this.getWithdrawal();
		},
		methods: {
			getShidao() {
				let money = parseFloat(this.money) || 0;
				let freeamount = parseFloat(this.baozhenjin.freeamount) || 0;
				let rade = parseFloat(this.baozhenjin.rade) || 0;

				if (money > freeamount) {
					let left_money = money - freeamount;
					this.shidao = (left_money * (1 - rade) + freeamount).toFixed(2);
				} else {
					this.shidao = money.toFixed(2);
				}
			},
			getWithdrawal() {
				let that = this;
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
							that.baozhenjin = res.data.data;
							that.wechatCashOpen = res.data.data.wechat_cash_open;
						}
					}
				})
			},
			onRecharge() {
				let that = this;
				if (!that.money || parseFloat(that.money) <= 0) {
					this.inputError = true;
					uni.showToast({
						title: "请输入有效的提现金额",
						icon: "none"
					});
					setTimeout(() => {
						this.inputError = false;
					}, 500);
					return;
				}

				if (parseFloat(that.money) > parseFloat(that.baozhenjin.money)) {
					uni.showToast({
						title: "提现金额不能大于余额",
						icon: "none"
					});
					return;
				}

				uni.request({
					url: that.global.url + "/api/user/withdrawal_submit",
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
						userId: that.baozhenjin.userId,
						type: this.paymentMethod,
						money: that.money
					},
					success: (res) => {
						if (res.data.code == 1) {
							uni.showToast({
								title: '提现成功',
								icon: 'success',
								duration: 2000,
							});
							that.money = "";
							that.getWithdrawal();
						} else {
							if (res.data.code == 4) {
								uni.navigateTo({
									url: '/pages/home/bindwx'
								});
								return;
							}
							uni.showToast({
								title: res.data.msg,
								icon: "none"
							});
							if (res.data.code == 2) {
								uni.navigateTo({
									url: "/pages/mine/setUp/bindAlipay"
								});
							}
							if (res.data.code == 3) {
								uni.navigateTo({
									url: "/pages/mine/setUp/certify"
								});
							}
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.withdrawal-container {
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
		margin-top: 10rpx;
		display: block;
	}

	.main-content {
		padding: 0 30rpx;
		margin-top: -50rpx;
		position: relative;
		z-index: 3;
	}

	.withdrawal-card {
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

	.info-row {
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		color: #999;
		margin-top: 20rpx;
	}

	.payment-methods {
		margin-top: 50rpx;
		display: flex;
		justify-content: center;
		gap: 30rpx;
	}

	.method {
		flex: 1;
		height: 160rpx;
		border: 2rpx solid #eee;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		transition: all 0.3s ease;
	}

	.method.active {
		border-color: #e63946;
		background-color: #fff8f8;
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

	.instructions {
		margin-top: 40rpx;
		padding: 20rpx;
		background-color: #fff;
		border-radius: 10rpx;
		font-size: 24rpx;
		color: #666;
		animation: fadeInUp 1s ease-out;
	}

.footer {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	padding: 30rpx;
	background-color: white;
	box-shadow: 0 -5rpx 20rpx rgba(0, 0, 0, 0.05);
	box-sizing: border-box;
}

.withdrawal-btn {
	width: 100%;
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

	.withdrawal-btn:active {
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
