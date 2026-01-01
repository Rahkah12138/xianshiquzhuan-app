<template>
	<view class="cont">
	<rich-text  :nodes="newsContent"></rich-text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				messId: '', // 公告id
				newsContent:''
			}
		},
		onLoad(option) {
			let that = this;
			that.messId = option.id;
			that.getDetail();
		},
		
		methods: {
			// 获取公告
			getDetail() {
				let that = this;
				uni.request({
					url: that.global.url + '/api/index/detail',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						id: that.messId,
					},
					success: (res) => {
						that.newsContent = res.data.data.content;
						let type="";
						if(res.data.data.type==1){
							type ="系统消息"
						}else if(res.data.data.type==2){
							type="系统公告"
						}else{
							type="任务公告"
						}
						uni.setNavigationBarTitle({
						title:type
						});
					}
				})
			}
			
		}
	}
</script>

<style scoped>
	.cont{
		width: 100%;
		margin: 20rpx auto;
		line-height: 2;
		padding: 10px;
		box-sizing: border-box;
		
	}
</style>
