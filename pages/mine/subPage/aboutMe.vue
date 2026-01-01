<template>
	<view class="about-container">
		<view class="content-card">
			<rich-text :nodes="about"></rich-text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				about: ""
			}
		},
		onLoad() {
			this.getAbout()
		},
		methods: {
			getAbout() {
				let aboutContent = uni.getStorageSync("user1").about;
				if (aboutContent) {
					aboutContent = aboutContent.replace(/http:\/\/xs\.stvue\.com\/uploads\/20241106\/17529c224d713ac4d4a6fbd694ec787a\.png/g, '/static/loginimg/head.png');
				}
				this.about = aboutContent;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.about-container {
		background: linear-gradient(135deg, #E63946, #FC5C7D);
		min-height: 100vh;
		padding: 40rpx;
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
