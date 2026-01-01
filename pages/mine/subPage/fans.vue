<template>
	<!-- 粉丝页面 -->
	<view>
		<view class="fensiV" v-for="arr in ffList">
			<view class="userInfo1">
				<view class="uSon1">
					<image :src="getImgUrl(arr.avatar)"></image>
				</view>
				<view class="uSon1_text">
					<text>{{arr.nickname}}</text><br>
					<text>ID:{{arr.user_id}}</text>
				</view>

				<view class="btn" v-if="arr.other==0" @click="guanZhu(arr.user_id)">
					<view>关注</view>
				</view>
				<view class="btn2" v-if="arr.other==1" @click="WeiguanZhu(arr.user_id)">
					<view>互相关注</view>
				</view>
			</view>
			 <myPopup :title="title" :tip="tip" :fatherMethod="fatherMethod" v-if="isPopup" @ispopup ="ispopup"></myPopup>
		</view>
		<view class="null_content" v-if="IsShowFenSi">
			<image src="/static/search/tip.png"></image>
			<view class="infoData">暂无数据</view>
		</view>

	</view>
</template>

<script>
	//引用弹窗
	import myPopup from "@/components/my-popup.vue"
	export default {
		data() {
			return {
				IsShowFenSi: false,
				ffList: [],
				title: "提示",
				tip: "是否取消关注",
				delFollow: "/api/User/saveFollowDel",
				ids: "",
				isPopup: false

			}
		},
		components: {
			myPopup
		},
		onNavigationBarButtonTap() {
			uni.navigateBack({
				url: "../user/user"
			})
		},
		onLoad() {
			this.getFSList()
		},
		methods: {
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

			getFSList() {
				uni.request({
					url: this.global.url + "/api/User/getFansList",
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token
					},
					success: (res) => {
						if (res.data.code == 0) {
							this.IsShowFenSi = true;
						}
						this.ffList = res.data.data
					}
				})
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
							this.getFSList()
						}
					}
				})


			},
			WeiguanZhu(a) {
				let that = this;
				that.ids = a;
				that.isPopup = true;
			},
			getImgUrl(imae) {
				return this.global.url + imae;
			},
			fatherMethod(){
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
							that.getFSList()
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.fensiV {
		width: 100%;
		background-color: #FFFFFF;
		padding: 30rpx 15rpx;
		box-sizing: border-box;
	}

	.userInfo1 {
		display: flex;
		width: 100%;
		position: relative;

		.uSon1 {
			margin-right: 20rpx;
			width: 100rpx;
			height: 100rpx;
			overflow: hidden;
			border-radius: 50%;

			image {
				width: 100rpx;
				height: 100rpx;
			}
		}

		.uSon1_text {
			width: 80%;
			display: flex;
			align-items: center;
			flex-wrap: wrap;

			text {
				display: block;
				width: 100%;
				font-size: 28rpx;
			}
		}

		.btn {
			position: absolute;
			top: 30rpx;
			right: 20rpx;
			border: 1px solid #017ff0;
			color: #017ff0;
			padding: 5rpx 30rpx;
			border-radius: 30rpx;
		}

		.btn2 {
			position: absolute;
			top: 30rpx;
			right: 20rpx;
			border: 1px solid #017ff0;
			color: #017ff0;
			padding: 5rpx 30rpx;
			border-radius: 30rpx;
		}
	}

	.null_content {
		text-align: center;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -120rpx;
		margin-top: -120rpx;

		image {
			width: 240rpx;
			height: 240rpx;
		}

		view {
			color: #999999;
			font-size: 18px;
		}
	}
</style>
