<template>
	<view>
		<view class="tr">
			<view>时间</view>
			<view>获得奖品</view>
		</view>
		<view class="td" v-for="(a,i) in recordList" :key="i">
			<view>{{a.updatetime}}</view>
			<view>{{a.prize_name}}</view>
		</view>
		<blackPage v-if="recordList.length==0" msg="暂无数据" heights="300"></blackPage>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				recordList: [], // 中奖记录
			}
		},
		onLoad() {
			let that = this;
			that.onRecharge();
		},
		methods: {
			// 中奖记录
			onRecharge() {
				let that = this;
				uni.request({
					url: that.global.url + '/api/Activity/record',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						that.recordList = res.data.data;
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #FFFFFF;
	}

	.tr {
		color: #333333;
		font-size: 28rpx;
		padding-top: 30rpx;
		border-top: 1px solid #EEEEEE;
	}

	.td {
		padding: 30rpx 0;
		font-size: 24rpx;
		border-bottom: 1px solid #EEEEEE;
	}

	.tr,
	.td {
		width: 100%;
		display: flex;

		&>view {
			width: 50%;
			text-align: center;
		}
	}

	.td>view:first-child {
		color: #999999;
	}

	.td>view:last-child {
		color: #FF0000;
		font-weight: bold;
	}
</style>
