<template>
	<view class="post_box">
		<view class="dao" @click="navTozhuan">跳过 {{miao}}</view>
		<image src="/static/index/backs.png" mode="widthFix"></image>
		 <view class="down_mask" v-if="downShow">
		 	<view class="down_con">
		 		<view class="down_word">
		 			<view class="down_word1">
		 				版本更新内容
		 			</view>
		 			<view class="down_word2">
		 				{{content}}
		 			</view>
		 		</view>
		 		<view class="btn" @click="down" v-if="openShow">
		 			立即更新
		 		</view>
		 		<view class="pro_box" v-if="jdShow">
		 			<view class="pro_box_word">
		 				正在下载···
		 			</view>
		 			<progress :percent="progress" stroke-width="50" activeColor="#FFA444" />
		 		</view>
		 	</view>
		 	<view class="dele" v-if="delShow" @click="cloose">
		 		<image src="/static/login/icon_delete@2x.png" mode=""></image>
		 	</view>
		 </view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				miao: 4, // 倒计秒
				count:'',
				isname:'', //账号
				ispass:'',//密码
				token:'',//
				num:'',
				nickName:'',
				content: '',
				downShow: false,
				delShow: true,
				urlDown: '',
				progress: '',
				jdShow: false,
				openShow: true,
				num:false,
			}
		},
		onLoad() {
			let _this=this
			_this.minter();
			_this.message();
			_this.isname = uni.getStorageSync('isname');
			_this.ispass = uni.getStorageSync('ispass');
			_this.token = uni.getStorageSync('token');
			_this.nickName = uni.getStorageSync('nickName');
		},
		methods: {
			// 跳转引导页
			navTozhuan() {
					if(this.count){
						clearInterval(this.count)
						if (uni.getStorageSync('firstOpen')) {
							if(this.isname && this.ispass && this.token){
								uni.switchTab({
									url: '/pages/home/home'
								});
							}else if(this.nickName && this.token){
								uni.switchTab({
									url: '/pages/home/home'
								});
							}else{
								uni.reLaunch({
									url: '/pages/home/login/login'
								})
							}
						} else {
							uni.setStorageSync('firstOpen', 'true')
							uni.reLaunch({
								url: '/pages/home/index/lead'
							})
						}
					}else{
						if (uni.getStorageSync('firstOpen')) {
							uni.reLaunch({
								url: '/pages/home/login/login'
							})
						} else {
							uni.setStorageSync('firstOpen', 'true')
							uni.reLaunch({
								url: '/pages/home/index/lead'
							})
						}
					}
			},
			minter(){
					this.count =setInterval(()=>{
						this.miao -= 1;
						if(this.miao == 0){
							clearInterval(this.count);
							if(this.num==true){
								return
							}else{
								if (uni.getStorageSync('firstOpen')) {
									if(this.isname && this.ispass && this.token){
											uni.switchTab({
												url: '/pages/home/home'
											});
									}else{
										uni.reLaunch({
											url: '/pages/home/login/login'
										})
									}
								} else {
									uni.setStorageSync('firstOpen', 'true')
									uni.reLaunch({
										url: '/pages/home/index/lead'
									})
								}
							}
							
						}
					},1000)
			},
			//获取设备信心
			message() {
				let _this = this
				uni.getSystemInfo({
					success(res) {
						if (res.platform == "android") {
							_this.init();
						}
					}
				})
			},
			init() {
				//#ifdef APP-PLUS
				let _this = this;
				var version = ''
				let baB = plus.runtime.getProperty(plus.runtime.appid, function(wgtinfo) {
					version = wgtinfo.version
				});
				uni.request({
					url: _this.global.url + '/api/user/version', // 请求地址
					method: "POST",
					success: (result) => {
						if (result.data.code == 1) {
							if (version.split('.').join('') < result.data.data.newversion.split('.').join(
									'')) {
								if (result.data.data.enforce == 1) {
									this.content = result.data.data.content;
									this.downShow = true;
									this.delShow = true;
									this.num = true
									this.urlDown = result.data.data.downloadurl;
								} else if (result.data.data.enforce == 0) {
									this.content = result.data.data.content;
									this.downShow = true;
									this.delShow = false;
									this.num = true
									this.urlDown = result.data.data.downloadurl;
								}
							}
			
						}
					},
					fail: (error) => {
						console.log("请求失败：", error);
					}
				})
				//#endif 
			},
			//下载
			down() {
				this.openShow = false;
				this.jdShow = true;
				const downloadTask = uni.downloadFile({
					url: this.urlDown,
					success: (downloadResult) => {
						if (downloadResult.statusCode === 200) {
							plus.runtime.install(downloadResult.tempFilePath)
						}
					} 
				});
				downloadTask.onProgressUpdate((res) => {
					this.progress = res.progress
					console.log(this.progress)
				});
			},
			//关闭
			cloose() {
				this.downShow = false;
				this.num=false;
			},
		}
	}
</script>

<style scoped lang="scss">
	.post_box{
		width: 100%;
		position: relative;
	}
	.dao {
		z-index: 999;
		opacity: 0.3;
		width: 110rpx;
		height: 48rpx;
		color: #FFFFFF;
		font-size: 24rpx;
		line-height: 48rpx;
		text-align: center;
		background: #313131;
		border-radius: 40rpx;
		position: fixed;
		right: 37rpx;
		top: 53rpx;
	}

	image {
		width: 100%;
	}
	.down_mask {
		width: 100%;
		height: 100vh;
		background-color: rgba(0, 0, 0, .2);
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999999999;
	
		.down_con {
			width: 540rpx;
			height: 650rpx;
			background-color: #FFFFFF;
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			margin: auto;
			background-image: url('/static/login/down_img.png');
			background-repeat: no-repeat;
			background-size: 100% 650rpx;
			border-radius: 20rpx;
		}
	
		.down_word {
			width: 100%;
			position: absolute;
			top: 50%;
	
			.down_word1 {
				text-align: center;
				color: #666666;
				font-size: 30rpx;
			}
	
			.down_word2 {
				text-align: center;
				margin-top: 40rpx;
				color: #999999;
				font-size: 22rpx;
			}
		}
	
		.btn {
			width: 80%;
			background-image: linear-gradient(to right, #017ff0db, #017ff0);
			position: absolute;
			bottom: 60rpx;
			height: 80rpx;
			border-radius: 40rpx;
			line-height: 80rpx;
			text-align: center;
			font-size: 28rpx;
			color: #FFFFFF;
			left: 50%;
			transform: translateX(-50%);
		}
	
		.pro_box {
			width: 80%;
			position: absolute;
			bottom: 60rpx;
			height: 80rpx;
			border-radius: 40rpx;
			left: 50%;
			transform: translateX(-50%);
			height: 80rpx;
			overflow: hidden;
	
			.pro_box_word {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				color: #FFFFFF;
			}
		}
	
		.dele {
			width: 48rpx;
			height: 48rpx;
			position: absolute;
			top: 80%;
			left: 50%;
			transform: translateX(-50%);
	
			image {
				width: 100%;
				height: 100%;
			}
		}
	
	}
</style>
