<template>
	<view>
		<swiperL ref="aaaaa" ></swiperL>
		<view class="pei">
			<view @click="share">
				<image src="/static/share/fenx.png" mode="widthFix"></image>
				<text style="color: #017ff0;">立即分享</text>
				
			</view>
		</view>
	</view>
</template>
<script>
	import swiperL from '@/components/liusheng22-swiper/liusheng22-swiper.vue';
	export default {
		components:{
			swiperL
		},
		data() {
			return {
				reg:'',
				index: 0, // 海报下标
				poster: [], // 分享海报
				shareUrl: '', // 分享链接
				isJoin: false, //是否弹窗
				array: ['保存相册', '复制链接', '微信', '朋友圈', 'QQ', 'QQ空间'], // 分享
			}
		},
		// 监听按钮触发
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url: '/pages/xinrenxuzhi/xinrenxuzhi'
			})
		},
		onLoad() {
			let userInfo=uni.getStorageSync('token')
			this.reg='https://app.xqkz.top/down/register.html?id='+userInfo.id
		
			let _this =this
			_this.$nextTick(()=>{
				_this.$refs.aaaaa.getUserBuildl(); 
			})
			
		},
		onNavigationBarButtonTap(e){
			uni.navigateTo({
				url:'/pages/home/subpage/protocol?name=' + '跳转协议'
			})
		},
		methods: {
			fuzhiClick(){
				// #ifdef APP-PLUS
				//复制文字到剪切板
				uni.setClipboardData({
					data: this.reg,
					success: function () {
						uni.showToast({
							icon: 'none',
							title: '链接已复制成功,赶快去分享吧^_^'
						});
				
					}
				});
				// #endif
				
				
				// #ifdef H5 || MP-WEIXIN
				var clipboard = new Clipboard('.bootleft')
			    clipboard.on('success', e => {
					uni.showToast({
						icon: 'none',
						title: '链接已复制成功,赶快去分享吧^_^'
					});
		
			      // 释放内存
			      clipboard.destroy()
			    })
			    clipboard.on('error', e => {
					uni.showToast({
						icon: 'none',
						title: '该浏览器不支持自动复制'
					});
			      // 不支持复制
			      console.log('该浏览器不支持自动复制')
			      // 释放内存
			      clipboard.destroy()
			    })
				// #endif
				
			},
			//打开弹窗
			share(){
				this.$refs.aaaaa.isJoin=true;
				 console.log(this.$refs.aaaaa.isJoin)
			}
		}
	}
</script>

<style scoped lang="scss">
	.can {
		z-index: 9;
		width: 660rpx;
		height: 1080rpx;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.share {
		z-index: 9;
		width: 100%;
		height: 66vh;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);

		.img {
			width: 100%;
			height: 100%;
			margin: 0 20rpx;
		}
	}

	.pei {
		width: 100%;
		height: 351rpx;
		// background: url(/static/share/bg.png) no-repeat;
		background-size: 100% 100%;
		position: absolute;
		bottom: -2%;

		&>view {
			display: flex;
			width: 200rpx;
			height: 60rpx;
			color: #333333;
			font-size: 26rpx;
			font-weight: bold;
			background: #FFFFFF;
			align-items: center;
			border-radius: 30rpx;
			justify-content: center;
			position: relative;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);

			&>image {
				width: 29rpx;
				height: 29rpx;
				margin-right: 10rpx;
			}
		}
	}
</style>
