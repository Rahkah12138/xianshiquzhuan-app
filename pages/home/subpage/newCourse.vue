<template>
	<view class="box">
		<view class="box_video" >
				<video loop="true" v-for="(item,index) in video_url" :key="index" :src="item.video_url" controls></video>
		</view>
	
	</view>
</template>

<script>
	export default {
		data(){
			return{
				video_url:''
			}
		},
		onShow() {
			this.init()
		},
		methods:{
			//新手视频教程
			init(){
				let _this = this
				uni.request({
					url:_this.global.url+'/api/task/video',
					method:"POST",
				  header: {
					'content-type': 'application/x-www-form-urlencoded'
				  },
					data:{
						token: uni.getStorageSync('token').token
					},
					success(res) {
						if(res.data.code ==1){
							_this.video_url =res.data.data;
						  _this.video_url.forEach((it,index)=>{
								if(index >=0){
									it.video_url = _this.global.url + it.video_url 
								}
							});
						}
					}
				})
				
			}
		},
	}
</script>

<style lang="scss" scoped>
	.box{
		width: 100%;
		.box_video{
			width: 100%;
			height: 450rpx;
			video{
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
