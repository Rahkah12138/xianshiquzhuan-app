<template>
  <view class="container">
    <!-- 隐私政策弹窗 -->
    <privacy-popup
      :visible="showPrivacyPopup"
      @agree="onPrivacyAgree">
    </privacy-popup>

    <template v-if="privacyAgreed">
      <home ref="home" v-show="activeTab === 'home'"></home>
      <task ref="task" v-show="activeTab === 'task'"></task>
      <xuanshangwa ref="xuanshangwa" v-show="activeTab === 'xuanshangwa'"></xuanshangwa>
      <user ref="user" v-show="activeTab === 'user'"></user>
      <custom-tab-bar :current="activeTab" @change="handleTabChange"></custom-tab-bar>
    </template>
  </view>
</template>

<script>
import home from '@/pages/home/home.vue';
import task from '@/pages/task/task.vue';
import xuanshangwa from '@/pages/home/xuanshangwa/xuanshangwa.vue';
import user from '@/pages/mine/user.vue';
import customTabBar from '@/components/custom-tab-bar.vue';
import privacyPopup from '@/components/privacy-popup.vue';

export default {
  components: {
    home,
    task,
    xuanshangwa,
    user,
    customTabBar,
    privacyPopup
  },
  data() {
    return {
      activeTab: 'home',
      showPrivacyPopup: false,
      privacyAgreed: false
    };
  },
  methods: {
    handleTabChange(tab) {
      this.activeTab = tab;
      this.$nextTick(() => {
        if (this.$refs[tab]) {
          this.$refs[tab].init();
        }
      });
    },
    checkPrivacyAgreement() {
      const agreed = uni.getStorageSync('privacy_agreed');
      if (agreed) {
        this.privacyAgreed = true;
        this.showPrivacyPopup = false;
        // 已同意，初始化SDK
        this.$initSDK();
        this.$nextTick(() => {
          this.$refs.home && this.$refs.home.init();
        });
      } else {
        // 未同意，显示弹窗
        this.showPrivacyPopup = true;
        this.privacyAgreed = false;
      }
    },
    onPrivacyAgree() {
      this.showPrivacyPopup = false;
      this.privacyAgreed = true;
      // 同意后初始化SDK
      this.$initSDK().then(() => {
        this.$nextTick(() => {
          this.$refs.home && this.$refs.home.init();
        });
      });
    }
  },
  mounted() {
    this.checkPrivacyAgreement();
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
