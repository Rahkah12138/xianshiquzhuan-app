<template>
	<view>
		<view class="list" v-for="(item,i) in messArr" :key="i" @click="navTodetail(item.id)">
			<view class="l_img">
					<image class="left" :src="item.toUser.avatar.includes('http')? item.toUser.avatar : global.url + item.toUser.avatar" ></image>
			</view>
		
			<view class="right">
				<view class="top" style="font-size: 28rpx;">
					<view>{{item.toUser.nickname}}</view>
					<view style="font-size: 24rpx;color: #999999;">{{item.lastTime}}</view>
				</view>
				<view class="bot">
					
					<rich-text v-if="item.lastContent.type == 1" class="tip" style="color: #666666;" :nodes="item.lastContent.content"></rich-text>
					<view  style="background:none;color:#333;font-size:28rpx;width:60rpx;" v-if="item.lastContent.type == 2">图片</view>
					<view  style="background:none;color:#333;font-size:28rpx;width:60rpx;" v-if="item.lastContent.type == 3">视频</view>
					<view style="font-size: 24rpx;" v-if="item.count">{{item.count}}</view>
				</view>
			</view>
		</view>

		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				messArr: [] // 消息
			}
		},
		onShow() {
			let that = this;
			that.messArr = [];
			that.getUnreadList();
		},
		methods: {
			// 获取消息
			getUnreadList() {
				let that = this;
				uni.request({
					url: that.global.url + '/api/message/getChatList',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						console.log(res)
						that.messArr=res.data.data
					}
				})
			},
			// 跳转详情
			navTodetail(id) {
				uni.navigateTo({
					url: '/pages/home/subpage/consultDetail?room_id=' + id
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.right,
	.top,
	.bot {
		display: flex;
		justify-content: space-between;
	}

	.list {
		height: 160rpx;
		margin: 20rpx 24rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 20rpx 14rpx;
		box-sizing: border-box;
		display: flex;
	}
	.l_img{
		width: 15%;
		height: 100%;
		position: relative;
		.left{
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
		}
	}


	.right {
		width: 85%;
		height: 100%;
		flex-flow: column;
	}

	.tip {
		width: 90%;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
		font-size: 24rpx;
		height: 60rpx;
	}
	.right{
		margin-left: 20rpx;
	}
	.bot>view {
		width: 40rpx;
		height: 40rpx;
		color: #FFFFFF;
		font-size: 20rpx;
		line-height: 40rpx;
		text-align: center;
		border-radius: 50%;
		background: #FF0000;
		
	}
</style>
