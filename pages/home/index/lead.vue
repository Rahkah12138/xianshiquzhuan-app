<template>
	<view>
		<swiper class="swiper">
			<swiper-item class="list" v-for="a in 3" :key="a">
				<image class="top" :src="'/static/index/yy'+a+'.jpg'" mode="widthFix" @click="navTotabbar(a)"></image>
				<view></view>
				<text v-if="a==3" @click="navTotabbar(3)" style="color: #FFFFFF;">开始体验</text>
				<image class="bot" :src="'/static/index/page'+a+'.png'" mode=""></image>
			</swiper-item>
		</swiper>
		<!-- 隐私政策协议弹窗 -->
		<myProto :isshow='ishide' @cancel="ishide=false" ref="pro" />
	</view>
</template>

<script>
	import myProto from '@/components/my-proto.vue'
	export default {
		components: {
			myProto
		},
		data() {
			return {
				isname: '',
				ispass: '',
				token: '',
				nickName: '',
				firstOpen: '',
				update: false, //是否需要更新
				isProto: '', //用户是否同意协议
				ishide: true, //协议弹窗
			}
		},
		async onLoad() {
			let _this = this;
			_this.isname = uni.getStorageSync('isname');
			_this.ispass = uni.getStorageSync('ispass');
			_this.token = uni.getStorageSync('token');
			_this.firstOpen = uni.getStorageSync('firstOpen');
			_this.isProto = uni.getStorageSync('isProto');
			_this.update = await _this.init();
			uni.setStorageSync('firstOpen', true);
			if (this.isProto) {
				this.ishide = false;
				console.log(123)
				if (_this.update == false) {
					if (uni.getStorageSync('firstOpen')) {
						if (this.isname && this.ispass && this.token) {
							uni.switchTab({
								url: '/pages/home/home'
							});
						} else if (this.nickName && this.token) {
							uni.switchTab({
								url: '/pages/home/home'
							});
						} else {
							uni.reLaunch({ 
								url: '/pages/home/login/login'
							}) 
						}
					}
				} else {  
					uni.reLaunch({
						url: '/pages/home/login/login'
					})
				}
			} 
			else {
				this.ishide = true
			}




		},
		methods: {
			navTotabbar(a) {
				console.log(a)
				if (a == 3) {
					console.log(123)
					uni.setStorageSync('firstOpen', 'true');
					let _this = this;
					this.$nextTick(() => {
						_this.isProto = _this.$refs.pro.isProto;
						if (_this.isProto) {
							this.ishide = false
							uni.reLaunch({
								url: '/pages/home/login/login'
							})
						} else {
							this.ishide = true
						}
					})
				}

			},
			init() {
				//#ifdef APP-PLUS
				let _this = this;
				var version = ''
				let baB = plus.runtime.getProperty(plus.runtime.appid, function(wgtinfo) {
					version = wgtinfo.version
				});
				return new Promise((resolve, reject) => {
					uni.request({
						url: _this.global.url + '/api/user/version', // 请求地址
						method: "POST",
						success: (result) => {
							if (result.data.code == 1) {
								if (version.split('.').join('') < result.data.data.newversion.split(
										'.').join(
										'')) {
									resolve(true)
								} else {
									resolve(false)
								}
							}
						},
						fail: (error) => {
							console.log("请求失败：", error);
						}
					})
				})
				//#endif 
			},
		}
	}
</script>

<style scoped lang="scss">
	.swiper {
		width: 100%;
		height: 100vh;
	}

	.list {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;

		.top {
			width: 100vw;


		}

		&>text {
			font-size: 30rpx;
			background: #017ff0;
			border-radius: 40rpx;
			padding: 20rpx 120rpx;
			position: absolute;
			bottom: 15%;
			z-index: 9999;
		}

		&>view {
			color: #222222;
			font-size: 54rpx;
			margin-top: 80rpx;
		}

		.bot {
			width: 77px;
			height: 16px;
			margin-top: 280rpx;
		}
	}

	.list:last-child>.top {
		margin-top: 0;
	}
</style>
