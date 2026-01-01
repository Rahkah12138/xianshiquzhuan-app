<template>
	<view class="video_box">
		<view class="nav_img">
			<image src="/static/img_bg_put.png" mode="scaleToFill"></image>
		</view>
		<view class="video_content">
			<view class="video_content_title">
				<view class="box">
				</view>
				<view class="video_content_wrod">
					视频任务
				</view>
			</view>
			<view class="video_con">
				<view class="video_con_k" v-for="item in videoList" :key="item.id" @click="showRewardedVideoAd">
					<image :src="item.imgUlr" class="img1" mode=""></image>
					<view class="v_box">
						<view class="v_box_nav">
							<text class="v_box_nav1">观看{{item.name}}个视频</text>
							<image :src="item.imgUlr1" class="img2" mode=""></image>
							<text class="v_box_nav2">+{{item.payJ}}金币</text>
						</view>
						<view class="v_jin">
							<progress :percent="item.num" active activeColor="#FE2C3B" stroke-width="8" />
						</view>
					</view>
					<view class="video_w" :class="item.videoShow == true ? '':'video_w1'">
						{{item.videoShow == true ? '已完成':'未完成'}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import AD from '@/api/ad.js'
	export default {
		data() {
			return {
				videoList: [
				],
				num: '', //看视频百分比
			}
		},
		onLoad() {

		},
		onShow() {
			this.init()
		},
		methods: {
			init() {
				var arr = []; //看视频数
				var arrList = []; //看视频金币数;
				let _this = this
				uni.request({
					url: this.global.url + '/api/index/videoTask',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						let vnum = ''
					  _this.videoList=res.data.data;
						 _this.videoList.forEach(item=>{
							 if(item){
								 item.imgUlr =  "/static/img_imgv.png"
								 item.name = item.task_num,
								 item.imgUlr1="/static/icon_jinbi.png"
								 item.payJ = item.money
								 vnum = (item.finish_num/item.task_num).toFixed(2)
								 item.num = vnum*100
								 if(item.finish_num>=item.task_num){
									 item.videoShow = true
								 }else{
									 item.videoShow = false
								 }
							 }
						 })
					}
				})
			},
			// showRewardedVideoAd() {
			// 	// 调用后会显示 loading 界面
			// 	let _this =this
			// 	AD.show({
			// 		adpid: 1697542712, // HBuilder 基座测试广告位
			// 		adType: "RewardedVideo"
			// 	}, (res) => {
			// 		// 用户点击了【关闭广告】按钮
			// 		if (res && res.isEnded) {
			// 			// 正常播放结束
			// 			console.log("onClose " + res.isEnded);
			// 			uni.request({
			// 				url: _this.global.url + '/api/index/videoTaskList',
			// 				method: 'POST',
			// 				header: {
			// 					'content-type': 'application/x-www-form-urlencoded'
			// 				},
			// 				data: {
			// 					token: uni.getStorageSync('token').token
			// 				},
			// 				success(res){
			// 					console.log(res);
			// 				},
			// 				fail(err) {
			// 					console.log(err)
			// 				}
			// 			})

			// 		} else {
			// 			// 播放中途退出
			// 			console.log("onClose " + res.isEnded);
			// 		}
			// 	}, (err) => {
			// 		// 广告加载错误 
			// 		console.log(err)
			// 	})
			// },
		},
	}
</script>

<style lang="scss" scoped>
	.video_box {
		width: 100%;
		height: 100vh;
		background-image: linear-gradient(#FF6860, #FF3F39);
		overflow: hidden;

		.nav_img {
			width: 100%;
			// margin-top: 90rpx;

			image {
				width: 100%;
			}
		}

		.video_content {
			width: 90%;
			margin: 0 auto;
			background-color: #FFFFFF;
			border-radius: 20rpx;

			.video_content_title {
				overflow: hidden;
				display: flex;

				.box {
					width: 6rpx;
					height: 32rpx;
					background-color: #FE2C3B;
					margin: 40rpx 0 0 30rpx;
				}

				.video_content_wrod {
					font-size: 36rpx;
					color: #FE2C3B;
					margin: 30rpx 0 0 24rpx;
				}
			}

			.video_con {
				width: 95%;
				margin: 80rpx auto 0;
				padding-bottom: 20rpx;

				.video_con_k {
					display: flex;
					justify-content: space-between;
					margin-bottom: 80rpx;

					.img1 {
						width: 80rpx;
						height: 80rpx;
					}

					.v_box {
						width: 60%;

						.v_box_nav {
							display: flex;

							.v_box_nav1 {
								font-size: 28rpx;
							}

							.img2 {
								width: 32rpx;
								height: 32rpx;
								margin-left: 40rpx;
								margin-top: 8rpx;
							}

							.v_box_nav2 {
								font-size: 24rpx;
								margin-top: 10rpx;
								color: #FE2C3B;
								margin-left: 22rpx;
							}
						}

						.v_jin {
							margin-top: 20rpx;
						}
					}

					.video_w {
						width: 120rpx;
						height: 50rpx;
						border-radius: 40rpx;
						background-color: #FE2C3B;
						line-height: 50rpx;
						text-align: center;
						font-size: 28rpx;
						color: #FFFFFF;
						margin-top: 20rpx;
					}

					.video_w1 {
						color: #FE2C3B;
						background-color: #FFFFFF;
						border: 1px solid #FE2C3B;
					}
				}
			}
		}
	}
</style>
