<template>
	<view class="service-container">
		<view class="content-card" v-html="user_service">
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user_service: ''
			}
		},
		onShow() {
			this.init()
		},
		methods: {
			init() {
				let _this = this
				uni.request({
					url: _this.global.url + '/api/index/explain',
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success(res) {
						if (res.data.code == 1) {
							_this.user_service = res.data.data.user_service
						}
					},
					fail(err) {
						console.log(err)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.service-container {
		background: linear-gradient(135deg, #E63946, #FC5C7D);
		min-height: 100vh;
		padding: 40rpx;
		box-sizing: border-box;
	}

	.content-card {
		background-color: #ffffff;
		border-radius: 20rpx;
		padding: 40rpx;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
		animation: fade-in 0.5s ease-out forwards;
		opacity: 0;
		color: #333;
		font-size: 32rpx;
		line-height: 1.8;
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
