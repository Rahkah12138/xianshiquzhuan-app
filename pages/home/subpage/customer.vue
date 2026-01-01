<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>
<script>	 
	export default {
		data(){
			return{
			// url:'/static/index.html'
			 url:''
			}
		},
		onLoad() {
			let userInfo=uni.getStorageSync('user1');
			console.log(userInfo.avatar)
			let url='http://kefu.tieie.com/index/index/home?visiter_id='+userInfo.id+'&visiter_name='+userInfo.nickname+'&avatar='+userInfo.avatar+'&business_id=4&groupid=0&special=12'
			console.log(url)
			this.url=url
		},
		onShow() {
		
		},
		methods:{
		
		}
	}
	
</script>

<style>
</style>
