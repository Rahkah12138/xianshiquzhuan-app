<template>
	<view>
		<image src="/static/index/work.png" @click="outlink"></image>
		<image src="/static/novel-img.png" @click="openReader"></image>
		<image src="/static/index/game.png" @click="game"></image>
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
				let that = this;
				uni.request({
					url: that.global.url + '/api/user/fish_play',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						appSecret: 'i66z51nkab7j4jijzc47z0g8xhupy7u9',
						appId: 2361,
						deviceIdentity: uni.getStorageSync('imei'),
						mediaUserId: uni.getStorageSync('token').id,
						oaid: uni.getStorageSync('oaid'),
						platform: 1
					},
					success(res) {
						uni.setStorageSync('weburl', res.data);
						uni.navigateTo({
							url: '/pages/home/subpage/game'
						});
					}
				})
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
