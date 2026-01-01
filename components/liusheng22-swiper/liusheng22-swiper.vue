<template>
	<view>
  <scroll-view
    :scroll-x="true"
    :scroll-left="swiper.left"
    :scroll-with-animation="true"
    class="scroll_list"
    @touchstart="cardTouchStart($event)"
    @touchend="cardTouchEnd"
  >
    <view class="card_item"
      v-for="(item, index) in swiper.list"
      :key="index"
      :class="{'first_card': !index && item.checked, 'card_checked': item.checked}"
      @tap="cardHandle(item, index)"
      @touchmove.stop.prevent
    >
      <image :src="item.imgUrl" class="img" />
    </view>
  </scroll-view>
	<view v-show="isJoin" @touchmove.stop.prevent="stopSlide">
		<!-- 遮罩层 -->
		<view class="mask" @click="isJoin=false"></view>
		<!-- 内容区 -->
		<view class="tip-content"> 
			<view>分享至</view>
			<view class="lit">
				<view class="lists" v-for="(a,i) in array" :key="i" @click="shareType(i)">
					<image :src="'/static/share/a'+i+'.png'" mode="widthFix"></image>{{a}}
				</view>
			</view>
			<view class="btns" @click="cloose">取消</view>
		</view>
	</view>
	</view>
</template>

<script>
/**
 * @props
 * cardList: ['https://mock.jpg', 'https://mock.jpg', 'https://mock.jpg']
 * cardIndex: 0
 */
export default {
  props: {
    cardList: {
      type: Array,
      default: () => ([])
    },
    cardIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      swiper: {
        list: [], // 卡片list
        left: 0, // 距离左侧距离
        index: 0, // 移动的下标
        distance: 100, // 手势滑动超过该距离才生效
        startX: 0,
        moveX: 0,
        endX: 0,
        poster:'',
				cardList:''
      },
      // #ifdef H5
      array: ['保存分享', '复制链接'],
      // #endif
      // #ifdef APP-PLUS
      array: ['保存相册', '复制链接'], // 分享
      // #endif
			
			shareUrl: '', // 分享链接
			isJoin: false, //是否弹窗
			index: 0, // 海报下标
    }
  },
	onLoad() {
		this.getUserBuildl()
	},
	onShow() {
		
	},
  methods: {
		getUserBuildl() {
			uni.request({
				url: this.global.url + '/api/user/build',
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				data: {
					token: uni.getStorageSync('token').token
				},
				success: (res) => {
					if (res.data.code == 1) {
						console.log(res)
          this.shareUrl = res.data.data.url;
					for(let i in res.data.data.poster){
						this.cardList.push(res.data.data.poster[i])
						 
					} 
					console.log(this.cardList)
					this.poster=this.cardList
					}
				}
			})
		}, 
    // 滑动开始
    cardTouchStart (e) {
			console.log(e)
      let state = e.changedTouches[0]
      this.swiper.startX = state.pageX
    },
	
    // 滑动结束
    cardTouchEnd (e) {
      let state = e.changedTouches[0]
      this.swiper.endX = state.pageX
      let x = this.swiper.startX - this.swiper.endX
      let absX = Math.abs(x || 0)
      if (x < 0 && absX > this.swiper.distance) {
        this.sliderSwitch(false)
      } else if (x > 0 && absX > this.swiper.distance) {
        this.sliderSwitch(true)
      }
    },
    // 滑动卡片切换
    sliderSwitch (status) {
      // status: false 向右滑， true 向左滑
      let len = this.swiper.list.length
      if (!status) {
        let idx = this.swiper.index - 1
        if (this.swiper.index) this.cardHandle(this.swiper.list[idx], idx)
      } else {
        let idx = this.swiper.index + 1
        if (this.swiper.index !== (len - 1)) this.cardHandle(this.swiper.list[idx], idx)
      }
    },
    // 点击卡片切换
    cardHandle (item, index) {
			this.index=index
      this.swiper.index = index
      this.swiper.left = uni.upx2px(index * 550)
      this.swiper.list = this.swiper.list.map((item, idx) => {
        let checked = (index === idx)
        return {
          ...item,
          checked
        }
      })
    },
		//取消
		cloose(){
			this.isJoin =false
		},
		// 分享方式
		shareType(index) {
			if (index == 0) { // 保存相册
				// #ifdef APP-PLUS
					uni.downloadFile({
						url:this.cardList[this.index],
						success:res =>{
								if (res.statusCode === 200) {
									uni.saveImageToPhotosAlbum({
										filePath: res.tempFilePath,
										success(re) {
											uni.showToast({
												title:"保存成功",
												icon:"none"
											})
										},
										fail(er) {
											uni.showToast({
												title:"保存失败", 
												icon:"none"
											})
										}
									})
								}
						},
						fail:err=>{
							console.log(err);
						}
					})
				// #endif
				// #ifdef H5
				 uni.showToast({
				 	title:'请截图保存后分享',
					icon:'none'
				 })
				// #endif
				
			} else if (index == 1) { // 复制链接 
			console.log(this.shareUrl)
				//#ifdef APP-PLUS
				uni.setClipboardData({
					// data: this.poster[this.index],
          data:this.shareUrl,
					success: function() {
						uni.showToast({
							title: '复制成功',
							icon: 'none' 
						})
					}
				});
				//#endif
				//#ifdef H5
					var inp=document.createElement('input')
					document.body.appendChild(inp)
					// inp.setAttribute('value',this.poster[this.index])
					inp.setAttribute('value',this.shareUrl)
					inp.select()
					if(document.execCommand('copy')){
						document.execCommand('copy')
						alert('已复制')
					}
					document.removeChild(inp)
				//#endif
				
			} else if (index == 2 || index == 3) { // 微信&朋友圈
				console.log(this.poster)
				
				//#ifdef H5
				uni.showToast({
					title:'请截图保存后分享',
									icon:'none'
				})
				//#endif
				
				//#ifdef APP-PLUS
				uni.share({
					provider: "weixin",
					scene: index == 2 ? "WXSceneSession" : "WXSenceTimeline",
					type: 2,
					imageUrl: this.poster[this.index],
					success: function(res) {
					}
				})
				//#endif
			} else if (index == 4) { // QQ&QQ空间
				
				uni.share({
					provider: "qq", 
					scene: index == 4 ? "WXSceneSession" : "WXSenceTimeline",
					type: 2,
					imageUrl: this.poster[this.index],
					success: function(res) {
					}
				})
			}
		},
		
  },
  watch: {
    cardList: {
      immediate: true,
      deep: true,
      handler (list) {
        if (!list.length) return
        // cardIndex不可以大于cardList数量
        let idx = 0
        if (this.cardIndex < list.length) {
          idx = this.cardIndex
        }
        this.swiper.index = idx

        // 遍历出card的list
        this.swiper.list = list.map((imgUrl, index) => {
          let checked = (idx === index)
          return {
            imgUrl,
            checked
          }
        })
        // 滑动至该index指定卡片
        if (idx) {
          this.swiper.left = uni.upx2px(idx * 550)
        }
      }
    } 
  }
}
</script>

<style lang="scss" scoped>
.scroll_list {
  white-space: nowrap;
  flex-wrap: nowrap;
	position: absolute;
	bottom: 15%;
	left: 0;
	z-index: 99;
  .card_item {
    width: 548rpx;
    padding-right: 8rpx;
    height: 910rpx;
    flex: none;
    position: relative;
    display: inline-block;
    vertical-align: middle;
    &:first-child {
      margin-left: 120rpx;
    }
    &:last-child {
      margin-right: 100rpx;
    }
    .img {
      width: 510rpx;
      height: 100%;
      position: absolute;
      left: 0;
      right: 0;
      z-index: 0;
			border-radius: 20rpx;
    }
  }
  .card_checked {
    height: 1000rpx;
  }
}
/* 弹窗 */
	.mask {
		z-index: 99;
		background: rgba(0, 0, 0, 0.4);
		position: fixed;
		bottom: 0;
		right: 0;
		left: 0;
		top: 0;
	}

	.lit {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
	}

	.tip-content {
		width: 100%;
		z-index: 999;
		color: #333333;
		font-size: 28rpx;
		text-align: center;
		padding-top: 23rpx;
		background: #FFFFFF;
		position: fixed;
		bottom: 0;
	}

	.lists {
		width: 33.3%;

		&>image { 
			width: 80rpx;
			height: 80rpx;
			display: block;
			margin: 30rpx auto;
		}
	}

	.btns {
		width: 100%;
		height: 80rpx;
		margin-top: 47rpx;
		line-height: 80rpx;
		border-top: 1rpx solid #EEEEEE;
	}
</style>
