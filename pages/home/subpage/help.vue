<template>
	<view class="help-container">
		<view class="help-list">
			<view class="help-item" v-for="(item, index) in helpList" :key="index" @click="helpDetail(item.id)" :style="{ animationDelay: index * 0.1 + 's' }">
				<view class="item-title">{{ item.name }}?</view>
				<image src="/static/user/zhan.png" class="arrow-icon"></image>
			</view>
		</view>
		<button type="primary" class="contact-btn" @click="customer">联系客服</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				helpList: []
			}
		},
		onLoad() {
			this.getArticleList()
		},
		methods: {
			getArticleList() {
				uni.request({
					url: this.global.url + '/api/Article/articleList',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success: (res) => {
						this.helpList = res.data.data;
					}
				})
			},
			helpDetail(id) {
				uni.navigateTo({
					url: "/pages/home/subpage/helpDetail?id=" + id
				})
			},
			customer() {
				let that = this;
				uni.request({
					url: that.global.url + "/api/message/createRoom",
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
						id: 'kefu',
					},
					success: (res) => {
						if (res.data.code == 1) {
							uni.navigateTo({
								url: "/pages/home/subpage/consultDetail?room_id=" + res.data.data.room_id
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.help-container {
		background-color: #f5f5f5;
		min-height: 100vh;
		padding-bottom: 120rpx;
	}

	.help-list {
		padding: 30rpx;
	}

	.help-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #ffffff;
		border-radius: 20rpx;
		padding: 40rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
		animation: fade-in 0.5s ease-out forwards;
		opacity: 0;
	}

	.item-title {
		font-size: 32rpx;
		color: #333;
	}

	.arrow-icon {
		width: 40rpx;
		height: 40rpx;
	}

	.contact-btn {
		position: fixed;
		bottom: 40rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 90%;
		height: 100rpx;
		line-height: 100rpx;
		background: linear-gradient(135deg, #E63946, #FC5C7D);
		color: #ffffff;
		border-radius: 50rpx;
		font-size: 32rpx;
		box-shadow: 0 10px 20px rgba(230, 57, 70, 0.3);
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
