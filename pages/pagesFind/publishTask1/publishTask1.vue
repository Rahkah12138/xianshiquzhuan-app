<template>
	<view>
		<web-view :src="url"></web-view>
	</view>
</template>
<script>	 
	export default {
		data(){
			return{
			 url:'https://www.baidu.com'
			}
		},
		onShow() {
		
		},
		methods:{
		
		}
	}
	
</script>

<style>
</style>
