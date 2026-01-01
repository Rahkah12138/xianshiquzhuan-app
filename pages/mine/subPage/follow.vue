<template>
	<!-- 粉丝页面 -->
	<view>
		<view class="fensiV" v-for="arr in ffList">
			<view class="userInfo1">
				<view class="uSon1" @click="look(arr.follow_id)">
					<image :src="getImgUrl(arr.avatar)"></image>
				</view>
				<view class="uSon1_text">
					<text>{{arr.nickname}}</text><br>
					<text>ID:{{arr.follow_id}}</text>
				</view>
				<view class="btn">
					<view @click="cancel(arr.follow_id)">{{arr.other}}</view>
				</view>
			</view>
		</view>
		<view class="null_content" v-if="IsShowFenSi">
			<image src="/static/search/tip.png"></image>
			<view class="infoData">暂无数据</view>
		</view>
        <myPopup  :title="title" :tip="tip" :fatherMethod="fatherMethod" v-if="isPopup" @ispopup ="ispopup"></myPopup>
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
				isJoin: false,
				userId: "",
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
			ispopup(value){
				let that =this;
				if(value==true){
					that.isPopup =!that.isPopup;
				}else{
					that.isPopup =!that.isPopup;
				}
			},
			getFSList() {

				let that = this;
				uni.request({
					url: this.global.url + "/api/User/getFollowList",
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
						page: 0
					},
					success: (res) => {
						this.ffList = res.data.data
						if (res.data.code == 0) {
							that.IsShowFenSi = true;
						}
					}
				})
			},
			getImgUrl(imae) {
				return this.global.url + imae;
			},
			cancel(id) {
				let that = this;
				that.userId = id;
				that.ids = id;
				that.isPopup = true;

			},
			
			// 查看关注
			look(id) {
				uni.navigateTo({
					url: "/pages/task/user?id=" + id
				})
			},
			//父组件的取消关注的方法
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
			border: 1px solid #999999;
			color: #999999;
			padding: 5rpx 30rpx;
			border-radius: 30rpx;
		}
	}

	
</style>
