<template>
	<view>
		<!-- Skeleton Loading -->
		<view v-if="isLoading">
			<view class="list skeleton-list" v-for="i in 5" :key="i">
				<view class="l_img">
					<view class="skeleton-avatar skeleton-animate"></view>
				</view>
				<view class="right">
					<view class="top">
						<view class="skeleton-line skeleton-animate" style="width: 40%; height: 28rpx;"></view>
						<view class="skeleton-line skeleton-animate" style="width: 30%; height: 24rpx;"></view>
					</view>
					<view class="bot">
						<view class="skeleton-line skeleton-animate" style="width: 70%;"></view>
						<view class="skeleton-count skeleton-animate"></view>
					</view>
				</view>
			</view>
		</view>

		<view v-else>
			<view class="list" v-for="(a,i) in messArr" :key="i" @click="navTodetail(i+1)">
				<view class="l_img">
						<image class="left" :src="'/static/deal/msg'+i+'.png'" mode="widthFix"></image>
				</view>
			
				<view class="right">
					<view class="top" style="font-size: 28rpx;">
						<view>{{a.title}}</view>
						<view style="font-size: 24rpx;color: #999999;">
					<!-- 	{{a.createtime}} -->
						
						</view>
						
					</view>
					<view class="bot">
					<!-- 	<rich-text class="tip" style="color: #666666;" :nodes="a.content"></rich-text> -->
						<view class="tip" style="color: #666666;" >
							<text v-show="i == 0">
								待处理的接单任务
							</text>
							
							<text v-show="i == 1">
								待处理的审核任务
							</text>
							
							<text v-show="i == 2">
								待处理的任务咨询
							</text>
							
							<text v-show="i == 3">
								待处理的举报申诉
							</text>
							<text v-show="i == 4">
								待处理的被举报申诉
							</text>
							
							<text v-show="i == 5">
							待处理的客服消息
							</text>
						</view>
						
						<view class="count" style="font-size: 24rpx;" v-if="a.count > 0">{{a.count}}</view>
					</view>
				</view>
			</view>
			
			<view class="list"  @click="navToConsult()" style="display:none;">
				<view class="l_img">
						<image class="left" :src="'/static/index/consult.png'" mode="widthFix"></image>
				</view>
			
				<view class="right">
					<view class="top" style="font-size: 28rpx;">
						<view>任务咨询</view>
						<view style="font-size: 24rpx;color: #999999;">{{room.time}}</view>
					</view>
					<view class="bot">
						
						<rich-text class="tip" style="color: #666666;" :nodes="room.content"></rich-text>
						<view style="font-size: 24rpx;" >{{room.count}}</view>
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
				isLoading: true,
				messArr: [] ,// 消息
				room:{},
				beijubao:{},
				check:{},
				jubao:{},
				kefu:{},
				message:{},
				task:{},
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
					url: that.global.url + '/api/Notice/dealingList',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						console.log('getUnreadList', res)
						that.beijubao=res.data.data.beijubao
						that.check=res.data.data.check
						that.jubao=res.data.data.jubao
						that.kefu=res.data.data.kefu
						that.message=res.data.data.message
						that.task=res.data.data.task
						
						that.messArr.push(that.task);
						that.messArr.push(that.check);
						that.messArr.push(that.message);
						that.messArr.push(that.jubao);
						that.messArr.push(that.beijubao);
						that.messArr.push(that.kefu);
						console.log(that.messArr)
				
					},
					complete: () => {
						that.isLoading = false;
					}
				})
			},
			// 跳转详情
			navTodetail(id) {
				if(id ==1){
					uni.navigateTo({
						url: '/pages/mine/myOrder/myOrder?type=5'
					})
				}
				
				if(id ==2){
					uni.navigateTo({
						url: '/pages/mine/rewardManagement/rewardManagement?type=1'
					})
				}
				
				if(id ==3){
					uni.navigateTo({
						url: '/pages/home/subpage/consult'
					})
				}
				
				if(id ==4){
					uni.navigateTo({
						url: '/pages/mine/report/report'
					})
				}
				
				if(id ==5){
					uni.navigateTo({
						url: '/pages/mine/report/report?type=my'
					})
				}
				
				if(id ==6){
					this.goKefu();
					return;
				}
				
			},
			goKefu() {
				let that = this;
				uni.request({
					url: that.global.url + "/api/message/createRoom",
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
						id:'kefu',
					},
					success: (res) => {
						if (res.data.code == 1) {
							console.log(res.data)
						
							
							uni.navigateTo({
								url: "/pages/home/subpage/consultDetail?room_id="+res.data.data.room_id+'&inType=kefu'
							})
						}
					
					}
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

<style scoped lang="scss">
	/* Skeleton Styles */
	.skeleton-animate {
		background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
		background-size: 200% 100%;
		animation: skeleton-shimmer 1.5s infinite linear;
	}
	
	@keyframes skeleton-shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	.skeleton-list {
		background-color: #fff;
	}

	.skeleton-avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background-color: #f0f0f0;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.skeleton-line {
		height: 24rpx;
		border-radius: 8rpx;
		background-color: #f0f0f0;
	}

	.skeleton-count {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		background-color: #f0f0f0;
		margin-top: -17px;
	}


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
		padding-top:8px;
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
	.bot .count {
		width: 40rpx;
		height: 40rpx;
		color: #FFFFFF;
		font-size: 20rpx;
		line-height: 40rpx;
		text-align: center;
		border-radius: 50%;
		background: #FF0000;
		margin-top:-17px;
	}
</style>
