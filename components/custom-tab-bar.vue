<template>
  <view class="tab-bar">
    <view class="tab-bar-item" @click="switchTab('home')">
      <image :src="current === 'home' ? '/static/tabbar/h1.png' : '/static/tabbar/h11.png'"></image>
      <view :class="{ 'active': current === 'home' }">首页</view>
    </view>
    <view class="tab-bar-item" @click="switchTab('task')">
      <image :src="current === 'task' ? '/static/tabbar/h2.png' : '/static/tabbar/h22.png'"></image>
      <view :class="{ 'active': current === 'task' }">大厅</view>
    </view>
    <view class="tab-bar-item mid-button" @click="midButtonTap">
      <image src="/static/tabbar/q888.png" class="mid-button-icon rotate-shake-animation"></image>
    </view>
    <view class="tab-bar-item" @click="switchTab('xuanshangwa')">
      <image :src="current === 'xuanshangwa' ? '/static/tabbar/h3.png' : '/static/tabbar/h33.png'"></image>
      <view :class="{ 'active': current === 'xuanshangwa' }">玩赚</view>
    </view>
    <view class="tab-bar-item" @click="switchTab('user')">
      <image :src="current === 'user' ? '/static/tabbar/h4.png' : '/static/tabbar/h44.png'"></image>
      <view :class="{ 'active': current === 'user' }">我的</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    current: {
      type: String,
      default: 'home'
    }
  },
  data() {
    return {};
  },
  methods: {
    switchTab(tab) {
      this.$emit('change', tab);
    },
    midButtonTap() {
      uni.navigateTo({
        url: '/pages/pagesFind/publishTask/publishTask',
      });
    }
  }
}
</script>

<style scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
  background-color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #eee;
}
.tab-bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #000;
}
.tab-bar-item image {
  width: 50rpx;
  height: 50rpx;
}
.tab-bar-item .active {
  color: #E63946;
}
.mid-button {
  margin-top: -40rpx;
}
.mid-button-icon {
  width: 100rpx !important;
  height: 100rpx !important;
}

@keyframes rotate-shake {
  0% { transform: rotate(0deg); }
  10% { transform: rotate(-8deg); }
  20% { transform: rotate(8deg); }
  30% { transform: rotate(-8deg); }
  40% { transform: rotate(8deg); }
  50% { transform: rotate(0deg); }
  100% { transform: rotate(0deg); }
}

.rotate-shake-animation {
  animation: rotate-shake 2s infinite;
  transform-origin: center bottom;
}
</style>
