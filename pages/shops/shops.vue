<template>
	<view class="shop_box">
		<view class="shop_con" v-for="(item,index) in shopList" :key="index">
			<view class="shop_t" @click.stop="shopa(item.id)">
				<view class="sh_img">
					<image :src="item.avatar" mode="aspectFill"></image>
				</view>
				<view class="sh_t">
					<view class="sh_t1">
						{{item.nickname}}
					</view>
					<view class="sh_t2">
						<image v-if="item.top==1" src="../../static/dp_detail/icon_top@6.png" mode=""></image>
						<image v-if="item.recommend==1" src="../../static/dp_detail/icon_tuijian@6.png" mode=""></image>
						<image v-if="item.bond==1" src="../../static/dp_detail/icon_baozhnegjin@6.png" mode=""></image>
						
						
						<!-- <view class="sh_w1">
								ID:{{item.id}}
						</view>
						<view class="sh_w2">
								粉丝:{{item.follow}}
						</view> -->
					</view>
				</view>
				<view class="follow" v-if="item.do_follow == 0" @click.stop="guanZhu(item.id)">
					<text class="jia">+</text> 关注
				</view>
				<view class="follow" v-if="item.do_follow == 1" @click.stop="WeiguanZhu(item.id)">
					<text class="jia">+</text>已关注
				</view>
			</view>
			
			<view class="sanren">
				<view class="opsd" v-for="(item2,index2) in item.tasklist" @click.stop="detail(item2.id)">
					<image class="dp_bg" :src="index2==0 ? '../../static/dp/bg_img_left@2x.png' : index2==1 ? '../../static/dp/bg_img_center@2x.png' : '../../static/dp/bg_img_right@2x.png'" mode=""></image>
					<view class="shp_c" style="margin-top: 23rpx;text-align: center;">
						<text class="wr1">{{item2.title}}</text>
						
					</view>
					<view class="box1" style="margin-top: 23rpx;">
						<text class="b_w2">{{item2.entryname}}</text>
						<text class="shuxian" style="padding: 0 5rpx;">|</text>
						<text class="b_w3">{{item2.tasktypename}}</text>
					</view>
					<view class="bot_box" style="margin-top: 23rpx;">
						
						<view class="box2">
							<text>已赚 {{item2.received}}</text>
							<text style="margin: 0 5rpx;"></text>
							<text>剩余 {{item2.surplus}}</text>
						</view>
					</view>
					<view class="shp_c" style="margin-top: 23rpx;text-align: center;">
						<text class="wr2">+{{item2.price}}元</text>
					</view>
				</view>
				
				
			</view>
			<view class="fensi">
				<view class="fensi_1">
					
					<image src="../../static/dp/icon_1@2x.png" mode=""></image>
					<view>成交量 {{item.count}}</view>
				</view>
				<view class="fensi_1">
					<image src="../../static/dp/iocn_2@2x.png" mode=""></image>
					<view>粉丝 {{item.follow}}</view>
				</view>
			</view>
			<myPopup :title="title" :tip="tip" :fatherMethod="fatherMethod" v-if="isPopup" @ispopup="ispopup"></myPopup>
		</view>
	</view>
</template>

<script>
	//引用弹窗
	import myPopup from "@/components/my-popup.vue"
	export default {
		data() {
			return {
				personal: [],
				information: [],
				use_id: '',
				showImg: false,
				title: "提示",
				tip: "是否取消关注",
				delFollow: "/api/User/saveFollowDel",
				ids: "",
				isPopup: false,
				page: 1,
				shopList: [],
			}
		},
		onPullDownRefresh() {
		      this.page = 1;
		      this.shopList = []
		      this.init()
		       setTimeout(function () {
		           uni.stopPullDownRefresh();
		       }, 1000);
		},
		onReachBottom() {
			let that = this;
			
			that.init();
		},
		onShow() {
			this.page = 1;
			this.shopList = []
			
			this.init()
		},
		components: {
			myPopup
		},
		methods: {



			init() {
				let _this = this
				uni.request({
					url: this.global.url + '/api/task/merchant',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						page: _this.page,
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						let list = res.data.data.data;
						if (list.length) {
							_this.page += 1;
							for (let a in list) {
								list[a].avatar = _this.global.url + list[a].avatar
								_this.shopList.push(list[a])
							}
							console.log(this.shopList)
						}
					}
				})
			},
			ispopup(value) {
				let that = this;
				if (value == true) {
					that.isPopup = !that.isPopup;
					
				} else {
					that.isPopup = !that.isPopup;
				}
			},
			//禁止页面滚动(规避警告)
			stopSlide() {
				return
			},
			WeiguanZhu(a) {
				let that = this;
				that.ids = Number(a);
				that.isPopup = true;
			},
			guanZhu(c) {
				uni.request({
					url: this.global.url + "/api/User/saveFollowAdd",
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token,
						follow_id: c
					},
					success: (res) => {
						if (res.data.code == 1) {
							this.page = 0;
							this.shopList = []
							this.init()
						}
					}
				})
			},
			fatherMethod() { 
				let that = this
				uni.request({
					url: that.global.url + that.delFollow,
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						follow_id: that.ids,
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						if (res.data.code == 1) {
							
							that.isPopup = false
							this.page = 0;
							this.shopList = []
							that.init()
							
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
						}
					}
				});
			},
			shopa(id) {
				uni.navigateTo({
					url: "/pages/task/user?id=" + id
				})
			},
			detail(id) {
				console.log(id)
				uni.navigateTo({
					url: '/pages/task/detail?id=' + id
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.shuxian{
		position: relative;
		top: -4rpx; 
		font-size: 18rpx;
	}
	.dp_bg{
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		z-index: -1;
	}
	.fensi_1 image{
		width: 25rpx;
		height: 25rpx;
		margin-right: 20rpx;
	}
	.fensi_1{
		padding: 20rpx;
		font-size: 22rpx;
		color: #999999;
		display: flex;
		align-items: center;
	}
	.fensi{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.box1 { 
		text-align: center;
		width: 90%;
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		.b_w2 {
			font-size: 22rpx;
			color: #666666;
			
			
			border-radius: 10rpx;
		}
	
		.b_w3 {
			font-size: 22rpx;
			color: #666666;
			
			border-radius: 10rpx;
			
			
		}
	}
	
	.sanren{
		margin-top: 20rpx;
		display: flex;
		
	}
	.sh_t2 image {
		width: 40rpx;
		height: 40rpx;
		margin-right: 20rpx;
	}

	.shop_box {
		width: 100%;
		background-color: #F8F8F8;

		.shop_con {
			width: 95%;
			margin: 0 auto;
			background-color: #FFFFFF;
			overflow: hidden;
			margin-top: 20rpx;
			border-radius: 20rpx;
			padding-bottom: 20rpx;

			.shop_t {
				width: 100%;
				display: flex;
				position: relative;

				.sh_img {
					width: 16%;
					overflow: hidden;

					image {
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
						margin: 24rpx 0 0 22rpx;
					}
				}

				.sh_t {
					width: 84%;
					overflow: hidden;

					.sh_t1 {
						color: #333333;
						font-size: 30rpx; 
						margin-top: 20rpx;
						margin-left: 20rpx;
					}

					.sh_t2 {
						margin-top: 15rpx;
						margin-left: 20rpx;
						display: flex;
						overflow: hidden;

						.sh_w1 {
							color: #999999;
							font-size: 24rpx;
						}

						.sh_w2 {
							color: #999999;
							font-size: 24rpx;
							margin-left: 40rpx;
						}
					}
				}
			}


		}
	}

	.jia {
		padding: 0 10rpx;
		font-weight: bold;
		color: #fff;
		padding-left: 20rpx;
	}

	.follow {
		padding-right: 30rpx;
		height: 48rpx;
		line-height: 48rpx;
		text-align: center;
		border: 1px solid #017ff0;
		position: absolute;
		top: 40rpx;
		right: 18rpx; 
		width: 138rpx;
		border-radius: 40rpx;
		color: #fff;
		font-size: 28rpx;
		background: #017ff0;
	}

	.followa {
		width: 120rpx;
		height: 48rpx;
		line-height: 48rpx;
		text-align: center;
		border: 1px solid #017ff0;
		position: absolute;
		top: 40rpx;
		right: 18rpx;
		border-radius: 40rpx;
		color: #017ff0;
		font-size: 28rpx;
	}

	.shp_c {
		margin-top: 20rpx;
		

		.wr1 {
			color: #333333;
			font-size: 30rpx;
		}

		.wr2 {
			
			color: #FF0101;
			font-size: 30rpx;
			font-weight: 600;
			
		}
	}

	.bot_box {
		text-align: center;
		margin-top: 10rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;

		

		.box2 {
			font-size: 24rpx;
			margin-top: 10rpx;
			width: 100%;
			text-align: center;
			color: #999999;
			
		}
	}

	.opsd {
		width: 32%;
		position: relative;
		z-index: 10;
		
		border-radius: 20rpx;
		overflow: hidden;
		padding-bottom: 10rpx;
	}
</style>
