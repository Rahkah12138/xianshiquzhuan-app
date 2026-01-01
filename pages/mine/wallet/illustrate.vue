<template>
	<view class="illustrate">
		<view class="illustrate_box" v-html="site_golds">
			
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				type:1,
				page:1,
				site_golds:''
			}
		},
		onLoad() {
			this.getMyCard()
		},
		methods:{
			getMyCard() {
				let that = this
			     uni.request({
					url:this.global.url+"/api/user/myGold",
					method:"POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data:{
						token: uni.getStorageSync("token").token,
						type: that.type,
						page:that.page
					},
					success: (res) => {
						if(res.data.code == 1){
							that.site_golds = res.data.data.site_golds;
							console.log(that.site_golds)
						}
					}
				})
			},
		}
	}
	
</script>

<style>
</style>
