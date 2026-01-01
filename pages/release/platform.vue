<template>
	<view>
		<image src="/static/index/work.png" @click="outlink"></image>
		<image src="/static/novel-img.png" @click="openReader"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user_id: ''
			}
		},
		onLoad() {
			this.user_id = uni.getStorageSync('token').user_id
		},
		onShow() {},
		onBackPress() {
			this.back();
			return true;
		},
		methods: {
			// 外链接
			back() {
				uni.switchTab({
					url: "/pages/home/home"
				})
			},
			outlink() {
				uni.navigateTo({
					url: '/pages/home/subpage/outlink'
				});
			},
			// 游戏试玩
			game() {
				var duoliangModule = uni.requireNativePlugin("duoliang-DuoLiangTaskModule");
				var params = {
					'userId': this.user_id,
					'advertType': 0,
					'title': '游戏试玩'
				}
				duoliangModule.jumpTaskList(params);
			},
			// 鱼玩盒子
			openReader() {
				// #ifdef H5
				uni.showToast({
					title:'请在APP内打开'
				})
				// #endif
				// #ifdef APP-PLUS
				let that = this;
				var duoliangModule = uni.requireNativePlugin("duoliang-DuoLiangTaskModule");
				var params = {
					'userId':uni.getStorageSync('token').user_id ,
					'advertType': 0,
					'title': '游戏试玩'
				}
				duoliangModule.jumpTaskList(params);
				// #endif
				
			}
		}
	}
</script>

<style>
	page {
		background: #FFFFFF;
	}

	image {
		width: 702rpx;
		height: 220rpx;
		display: block;
		margin: 20rpx auto;
	}
</style>
