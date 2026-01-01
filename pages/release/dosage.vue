<template>
	<view class="dosage-container">
		<!-- Task Info Card -->
		<view class="task-card">
			<view class="card-header">
				<image class="avatar" :src="item.avatar" mode="widthFix"></image>
				<view class="task-info">
					<view class="title">高价注册</view>
					<view class="subtitle">下载注册</view>
				</view>
				<view class="price-info">
					<view class="price">+{{ item.price }}元</view>
					<view class="status">
						<text>进行中：{{item.received}}</text>
						<text>剩余：{{item.surplus}}</text>
					</view>
				</view>
			</view>
			<view class="card-footer">
				<view class="footer-item">
					<text>剩余数量：{{item.surplus}}</text>
					<button class="btn-action" @click="addNum(1)">加量</button>
				</view>
				<view class="footer-item">
					<text>价格：<text class="price-value">{{ item.price }}元</text></text>
					<button class="btn-action" @click="addNum(2)">加价</button>
				</view>
			</view>
		</view>

		<!-- Popup -->
		<view class="popup-mask" v-if="isShow" @click.self="isfa">
			<view class="popup-content">
				<view class="popup-title">{{numChange == 1 ? '加量' :'加价'}}</view>
				<view class="popup-body">
					<view class="info-row">
						<text>{{numChange == 1 ? '当前数量：': '当前价格：'}}</text>
						<text :class="numChange == 1 ? '':'price-value'">{{numChange == 1 ? item.surplus :item.price+'元'}}</text>
					</view>
					<view class="input-row">
						<text>{{numChange == 1 ? '增加数量：' : '增加价格：'}}</text>
						<input v-if="show" type="digit" v-model="num" class="input-field" />
						<input v-else type="digit" v-model="priceNum" @blur="pricNumber" class="input-field" />
						<button class="btn-add" @click="add">+</button>
					</view>
				</view>
				<button class="btn-confirm" @click="querify">确定</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				item: '',
				word: '加量',
				num: 0,
				isShow: false,
				numChange: 0,
				money: '',
				title: "增加数量",
				show: false,
				priceNum: 0,

			}
		},
		onShow() {
			let _this = this
			if (uni.getStorageSync('addNum')) {
				uni.removeStorageSync('addNum')
			}
			let obj = uni.getStorageSync('userInfo');
			_this.item = obj;
			_this.item.avatar = obj.avatar.includes('http') ? obj.avatar : _this.global.url + obj.avatar;
			let addNum = uni.getStorageSync('addNum');
			if (addNum) {
				_this.item.price = addNum.price;
				_this.item.surplus = addNum.surplus;
			}
		},
		methods: {
			init(type, price) {
				let _this = this;
				if (!/^\+?[1-9][0-9]*$/.test(this.num) && this.numChange == 1) {
					if (this.num == 0 && this.priceNum == 0) {
						uni.showToast({
							title: '请输入增加数量',
							icon: "none"
						})
						this.num = 0
					} else {
						uni.showToast({
							title: '请输入正确数量',
							icon: "none"
						})
						this.num = 0
					}

				} else if (_this.priceNum == 0 && this.numChange == 2) {
					uni.showToast({
						title: '请输入增加价格',
						icon: "none"
					})

				} else {
					uni.request({
						url: _this.global.url + '/api/task/morePremium',
						method: "POST",
						header: {
							"content-Type": "application/x-www-form-urlencoded"
						},
						data: {
							token: uni.getStorageSync('token').token,
							id: _this.item.id,
							type: _this.numChange,
							price: _this.num ? _this.num : _this.priceNum
						},
						success(res) {
							if (res.data.code == 1) {
								_this.isShow = false;
								this.pricNumber = 0;
								this.num = 0
								_this.item.price = res.data.data.price;
								_this.item.surplus = res.data.data.surplus;
								uni.setStorageSync('addNum', res.data.data);
							} else {
								_this.isShow = false;
								uni.showToast({
									title: res.data.msg,
									icon: "none"
								});
								uni.navigateTo({
									url: '/pages/mine/wallet/recharge?type=1'
								})
							}
						}
					})
				}

			},
			//加量或者加价
			addNum(num) {
				this.isShow = true;
				this.numChange = num;
				if (this.numChange == 1) {
					this.show = true;
				} else {
					this.show = false;

				}
				this.num = 0;
				this.priceNum = 0;
			},
			add() {
				if (this.numChange == 1) {
					this.num++;
				} else {
					this.priceNum++
				}
			},
			//确定
			querify() {
				this.init()
			},
			//点击阴影取消
			isfa() {
				this.isShow = false
			},
			//保留两位小数
			pricNumber(e) {
				let n = e.detail.value;
				var f = parseFloat(n);
				if (isNaN(f)) {
					return false;
				}
				var f = Math.round(n * 100) / 100;
				var s = f.toString();
				var rs = s.indexOf('.');
				if (rs < 0) {
					rs = s.length;
					s += '.';
				}
				while (s.length <= rs + 2) {
					s += '0';
				}
				this.priceNum = s;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.dosage-container {
		background-color: #f8f8f8;
		min-height: 100vh;
		padding: 30rpx;
	}

	.task-card {
		background-color: #ffffff;
		border-radius: 20rpx;
		padding: 30rpx;
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.05);
		animation: slide-up 0.5s ease-out;
	}

	.card-header {
		display: flex;
		align-items: center;
		padding-bottom: 30rpx;
		border-bottom: 1px solid #f0f0f0;
	}

	.avatar {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		margin-right: 30rpx;
	}

	.task-info {
		flex: 1;
	}

	.title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
	}

	.subtitle {
		font-size: 24rpx;
		color: #999;
		margin-top: 10rpx;
	}

	.price-info {
		text-align: right;
	}

	.price {
		font-size: 30rpx;
		font-weight: 600;
		color: $uni-color-primary;
	}

	.status {
		font-size: 24rpx;
		color: #999;
		margin-top: 10rpx;

		text {
			margin-left: 10rpx;
		}
	}

	.card-footer {
		display: flex;
		justify-content: space-around;
		padding-top: 30rpx;
	}

	.footer-item {
		font-size: 26rpx;
		color: #333;
		display: flex;
		align-items: center;
	}

	.price-value {
		color: $uni-color-primary;
		font-weight: 500;
	}

	.btn-action {
		color: #ffffff;
		background: linear-gradient(135deg, $uni-color-primary, darken($uni-color-primary, 10%));
		border: none;
		border-radius: 30rpx;
		padding: 0rpx 30rpx;
		font-size: 26rpx;
		margin-left: 20rpx;
		transition: transform 0.2s ease;
	}

	.btn-action:active {
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

	.popup-content {
		width: 80%;
		max-width: 600rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
		padding: 40rpx;
		animation: popup-scale-in 0.3s ease-out;
	}

	.popup-title {
		font-size: 34rpx;
		font-weight: bold;
		text-align: center;
		margin-bottom: 30rpx;
	}

	.popup-body {
		margin-bottom: 40rpx;
	}

	.info-row,
	.input-row {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		font-size: 28rpx;
	}

	.input-field {
		flex: 1;
		border: 1px solid #eee;
		border-radius: 10rpx;
		padding: 10rpx;
		margin: 0 20rpx;
		text-align: center;
	}

	.btn-add {
		width: 60rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border: 1px solid #ccc;
		border-radius: 10rpx;
		font-size: 40rpx;
	}

	.btn-confirm {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 40rpx;
		background: linear-gradient(135deg, $uni-color-primary, darken($uni-color-primary, 10%));
		color: #ffffff;
		font-size: 30rpx;
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

	@keyframes popup-scale-in {
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
