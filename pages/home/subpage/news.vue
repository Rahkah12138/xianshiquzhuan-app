<template>
	<view>
		<view v-if="loading" class="skeleton">
			<view class="skeleton-item" v-for="n in 4" :key="n"></view>
		</view>
		<view v-else>
			<view class="list" v-for="(a,i) in messArr" :key="i" @click="navTodetail(i+1)">
				<view class="l_img">
					<image class="left" :src="'/static/index/msg'+i+'.png'" mode="widthFix"></image>
				</view>
				<view class="right">
					<view class="top">
						<view>{{a.title}}</view>
						<view class="time">{{a.createtime || ''}}</view>
					</view>
					<view class="bot">
						<rich-text class="tip" :nodes="a.content || '暂无新消息'"></rich-text>
						<view class="count" v-if="a.count > 0">{{a.count}}</view>
					</view>
				</view>
			</view>
			<view class="list" @click="navToConsult()">
				<view class="l_img">
					<image class="left" :src="'/static/index/consult.png'" mode="widthFix"></image>
				</view>
				<view class="right">
					<view class="top">
						<view>任务咨询</view>
						<view class="time">{{room.time || ''}}</view>
					</view>
					<view class="bot">
						<rich-text class="tip" :nodes="room.content || '暂无新消息'"></rich-text>
						<view class="count" v-if="room.count > 0">{{room.count}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				messArr: [], // 消息
				room: {},
				loading: true,
			}
		},
		onShow() {
			let that = this;
			//that.messArr = [];
			that.getUnreadList();
		},
		methods: {
			// 获取消息
			getUnreadList() {
				let that = this;
				uni.request({
					url: that.global.url + '/api/Notice/unreadList',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						if (!res.data || !res.data.data) return;
						let obj = res.data.data;
						let messArr = [];

						let obj1 = obj.system_message || {};
						obj1.title = '系统消息';
						messArr.push(obj1);

						let obj2 = obj.system_notice || {};
						obj2.title = '系统公告';
						messArr.push(obj2);

						let obj3 = obj.task_notice || {};
						obj3.title = '任务公告';
						messArr.push(obj3);

						that.messArr = messArr
						that.room = obj.room
						that.loading = false;
					}
				})
			},
			// 跳转详情
			navTodetail(id) {
				uni.navigateTo({
					url: '/pages/home/subpage/newsList?id=' + id
				})
			},
			navToConsult() {
				uni.navigateTo({
					url: '/pages/home/subpage/consult'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.skeleton {
		padding: 20rpx 24rpx;
	}

	.skeleton-item {
		height: 160rpx;
		background-color: #e9e9e9;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		animation: pulse 1.5s infinite ease-in-out;
	}

	.list {
		display: flex;
		height: 160rpx;
		margin: 20rpx 24rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 20rpx 14rpx;
		box-sizing: border-box;
	}

	.l_img {
		width: 15%;
		height: 100%;
		position: relative;

		.left {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}

	.right {
		width: 85%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-left: 20rpx;
	}

	.top {
		display: flex;
		justify-content: space-between;
		font-size: 28rpx;
	}

	.time {
		font-size: 24rpx;
		color: #999999;
	}

	.bot {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.tip {
		width: 90%;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
		font-size: 24rpx;
		color: #666666;
	}

	.count {
		width: 40rpx;
		height: 40rpx;
		color: #FFFFFF;
		font-size: 20rpx;
		line-height: 40rpx;
		text-align: center;
		border-radius: 50%;
		background: #FF0000;
	}

	@keyframes pulse {
		0% {
			background-color: #e9e9e9;
		}

		50% {
			background-color: #f5f5f5;
		}

		100% {
			background-color: #e9e9e9;
		}
	}
</style>
