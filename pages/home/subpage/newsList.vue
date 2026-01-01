<template>
	<view>
		<view class="item" v-for="(a,i) in array" :key="i">
			<text class="tip" v-if="a.status==1"></text>
			<view class="top">
				<view>{{a.names}}</view>
				<view style="font-size: 24rpx;color: #999999;margin-right: 20rpx;">{{a.createtime}}</view>
			</view>
			<view class="detail" v-html="a.content"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page: 0, // 页码
				messId: '', // 公告id
				array: [] // 公告列表
			}
		},
		onReachBottom() {
			let that = this;
			that.getSystemList();
		},
		onLoad(option) {
			let that = this;
			that.messId = option.id;
			uni.setNavigationBarTitle({
				title: option.id == 1 ? '系统消息' : option.id == 2 ? '系统公告' : '任务公告'
			});
			that.getSystemList();
		},
		methods: {
			// 获取公告
			getSystemList() {
				let that = this;
				uni.request({
					url: that.global.url + '/api/Notice/systemList',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						page: that.page,
						type: that.messId,
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						let list = res.data.data;
						if (list != null && list.length > 0) {
							const validList = list.filter(item => item && item.id && item.names);
							that.page += 1;
							that.array = that.array.concat(validList);
							validList.forEach(item => {
								if (item.status == 1) {
									that.setRead(item.id);
								}
							});
						}
					}
				})
			},
			// 改变消息状态
			setRead(id) {
				let that = this;
				const index = that.array.findIndex(item => item.id == id);
				if (index !== -1 && that.array[index].status == 1) {
					uni.request({
						url: that.global.url + '/api/Notice/read',
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							token: uni.getStorageSync("token").token,
							id: id
						},
						success: (res) => {
							that.array[index].status = 2;
						}
					})
				}
			}
		}
	}
</script>

<style scoped>
	.item {
		width: 702rpx;
		line-height: 40px;
		margin: 20rpx auto;
		position: relative;
		background: #FFFFFF;
		border-radius: 20rpx;
	}

	.tip {
		padding: 10rpx;
		border-radius: 50%;
		background: #FF0000;
		position: absolute;
		left: 10rpx;
		top: 10rpx;
	}



	.top {
		padding:20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #EEEEEE;
		font-size: 28rpx;
	}
	.detail{
		font-size: 24rpx;
		color: #666666;
		padding:20rpx;
		margin-top:20rpx;
	}
</style>
