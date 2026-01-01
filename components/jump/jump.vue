<template>
	<view :style="{top: (10 + hs) + 'px'}" class="jump flex justify-center items-center">
		<!-- 左上角返回按钮 -->
		<view class="left flex justify-center items-center" @click="back">
			<uni-icons type="left" color="#fff" size="18"></uni-icons>
		</view>
		<view class="col-w flex justify-center items-center">
			|
		</view>
		<view class="left flex justify-center items-center" @click="home">
			<uni-icons type="home-filled" color="#fff" size="18"></uni-icons>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				hs: 0
			}
		},
		created() {
			this.hs = uni.getSystemInfoSync().statusBarHeight
		},
		methods: {
			back() {
				//返回上一页
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					})
				}, 100)
			},
			home() {
				//返回首页
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/index/index'
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.jump {
		left: 20px;
		position: fixed;
		padding: 6px 8px;
		background-color: rgba(0, 0, 0, 0.15);
		border: 1rpx solid #87c3ff;
		border-radius: 20px;
		z-index: 999;
	}

	.col-w {
		font-size: 14px;
		color: #fff;
	}

	.left {
		padding: 0 5px;
	}
</style>