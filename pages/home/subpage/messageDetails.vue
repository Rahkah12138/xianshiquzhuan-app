<template>
	<view class="mess_age">
	  <view class="mess_title">
	  	{{obj.createtime}}
	  </view>
		<view class="mess_box">
			<view class="mes_ta">
				消息通知
			</view>
			<view class="mess_t">
				{{obj.names}}
			</view>
			<view class="mess_t1" v-html="obj.content">
			
			</view>
		
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				id:'',
				obj:''
			}
		},
		onLoad(option) {
			this.id = option.id
		},
		onShow() {
			this.init()
		},
		methods:{
			init(){
				let _this = this
				uni.request({
					url:_this.global.url+'/api/Notice/read',
					method:"GET",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data:{
						token: uni.getStorageSync("token").token,
						id:_this.id
					},
					success(res) {
						_this.obj = res.data.data;
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mess_age{
		width: 100%;
		overflow: hidden;
		.mess_title{
			width: 100%;
			background-color: #F8F8F8;
			font-size: 24rpx;
			color: #999999;
			text-align: center;
			margin: 40rpx 0;
		}
		.mess_box{
			width: 90%;
			min-height: 240rpx;
			margin: 0 auto;
			background-color: #FFFFFF;
			overflow: hidden;
			border-radius: 20rpx;
		
			
			.mes_ta{
				font-size: 28rpx;
				color: #333333;
				margin: 20rpx 0 0 20rpx;
				font-weight: 600;
			}
			.mess_t{
				font-size: 28rpx;
				color: #333333;
				margin: 50rpx 0 0 20rpx;
			}
			.mess_t1{
				font-size: 28rpx;
				margin: 24rpx 0 0 20rpx;
			}
			
		}
	}
	
</style>
