<template>
	<!-- 商务合作页面 -->
	<view class="bbox">
		<rich-text :nodes="business" style="width: 100%!important;"></rich-text></view>
	</view>
	<!-- 商务合作页面 -->
</template>
<script>
	export default {
		data() {
			return {
				business:""
			}
		},
		onLoad() {
			this.getSW()
		},
		methods: {
			getSW(){
				this.business =  uni.getStorageSync("user1").cooperation;
			
				
			},
			getImgUrl(imae){
			         return this.global.url+imae;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.bbox{
		padding: 10px;
		box-sizing: border-box;
		line-height: 30px;
	}
	
</style>