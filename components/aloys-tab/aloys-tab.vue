<template>
  <view style="width: 100%; height: 100%;">
    <view class="tabs" style="height:0;">
    <!--  <view v-for="(tab, index) in tabs" class="tab-item" :class="current==index&&'active'" @click="current = index">
     
      </view> -->
    </view>
    <swiper :current="current" class="swiper-box" @change="onChange">
        <swiper-item v-for="(item ,index) in tabs" :key="index">
          <scroll-view scroll-y="true" style="height: 100%;">
            <!-- #ifdef MP -->
            <slot name="{{'content' + index}}"></slot>    
            <!-- #endif -->
            <!-- #ifndef MP -->
            <slot :name="'content'+index"></slot>
            <!-- #endif -->
          </scroll-view>
        </swiper-item>
    </swiper>
  </view>
</template>

<script>
	export default {
    name: 'swiperTab',
    props: {
      currentTab: {
        type: Number,
        default: 0
      },
      tabs: {
        type: Array,
        default: []
      }
    },
		data() {
			return {
				current: this.currentTab
			};
		},
    methods: {
      onChange(e) {
        this.current = e.detail.current;
        this.$emit('change', e.detail.current);
      }
    }
	}
</script>
<style>
swiper-tab{
  display: block;
  height: 100%;
}
</style>
<style lang="scss" scoped>
.tabs{
  width: 750rpx;
  height: 75rpx;
  display: flex;
  padding: 0 290rpx;
  box-sizing: border-box;
  .tab-item {
    flex: 1;
	margin-right: 20rpx;
	position: relative;
	width: 100%;
	top: 90px;
	z-index: 99;
    text-align: center;
    color: grey;
    line-height: 73rpx;
    font-size: 32rpx;
    font-weight: 500;
    height: 100%;
	  border-bottom: 4rpx solid #FFEAE6;
    box-sizing: border-box;
    &.active{
      color: $uni-color-primary;
      border-bottom: 4rpx solid #017ff0;
    }
  }
}
.swiper-box{
  width: 100%;
  // height: calc(100% - 35rpx);
  overflow: auto;
  // margin-bottom: 20rpx;
}
</style>
