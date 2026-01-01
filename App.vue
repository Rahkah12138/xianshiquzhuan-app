<script>
	export default {
		onLaunch: function() {
			 uni.onTabBarMidButtonTap(()=>{
			                uni.navigateTo({
			                    url: '/pages/pagesFind/publishTask/publishTask',
			                });
			            })
			uni.getStorage({
				key: 'has_read_privacy',
				success: (res) => {
					if (res.data) {
						uni.switchTab({
						    url: '/pages/home/home'
						});
					}
				},
				fail: function(e) {
				}
			})
		},
		methods: {
		}
	}
</script>

<style>
	.fz22{
		font-size: 22rpx;
	}
	.fz24{
		font-size: 24rpx;
	}
	.fz28{
		font-size: 28rpx;
	}
	/*每个页面公共css */
	/* #ifndef APP-PLUS-NVUE */
	page {
		background: #F8F8F8;
	}

	/* 取消scroll-view滚动条效果 */
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}
	/* #endif */

	@keyframes shake {
	  10%, 90% {
	    transform: translate3d(-1px, 0, 0);
	  }
	  20%, 80% {
	    transform: translate3d(2px, 0, 0);
	  }
	  30%, 50%, 70% {
	    transform: translate3d(-4px, 0, 0);
	  }
	  40%, 60% {
	    transform: translate3d(4px, 0, 0);
	  }
	}

	.shake-animation {
		animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both infinite;
  		transform: translate3d(0, 0, 0);
  		backface-visibility: hidden;
  		perspective: 1000px;
	}
</style>
