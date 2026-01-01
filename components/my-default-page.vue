<template>
	<view class="content" :style="'margin-top: '+heights+'rpx;'">
		<image class="black" src="/static/search/tip.png" mode="widthFix"></image>
		<view class="black-text">{{msg}}</view>
	</view>
</template>

<script>
	export default {
		props: {
			msg: {
				type: String,
				default: ''
			},
			heights: {
				type: String,
				default: ''
			}
		},
		data() {
			return {

			}
		},
		mounted() {

		},
		methods: {

		}
	}
</script>

<style scoped>
	.content {
		width: 242rpx;
		text-align: center;
		margin: 0 auto;
	}

	.black {
		width: 242rpx;
		height: 240rpx;
	}

	.black-text {
		color: #999999;
		font-size: 28rpx;
		margin-top: 40rpx;
	}
</style>
