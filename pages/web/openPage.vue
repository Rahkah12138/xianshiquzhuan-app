<template>
  <view>
    <web-view :src="url"></web-view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        index:0,
        url:"",
        // url:""
      }
    },
    onLoad(option) {
      var url = option.url;
      this.url = decodeURIComponent(url);
    },
    methods: {
     
    }
  }
</script>

<style>
</style>
