<template>
	<view class="hoemMaks" v-if="homeShow">
		<view class="mask" @touchmove.stop.prevent="stopSlide">
			<view class="mask_content" v-for="item in obj" :key="item.id">
				<image :src="item.image" class="mask_content1" mode="scaleToFill" @click="Jump(item)"></image>
			</view>
			<view class="cloose_img" @click="cloose">
				<image src="/static/login/icon_delete@2x.png" class="cloose_img1" mode=""></image>
			</view>
		</view>
	</view>
</template>
    
<script>
	export default{
		data(){
			return{
				obj:'',
				homeShow:true,
				taskId:'',
				detail:''
			}
		},
		onLoad() {
			
		},
		onShow() {
			
		},
		methods:{
			init(){
				let _this = this
				uni.request({
					url:_this.global.url+'/api/index/popup',
					method:"POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data:{
						token:uni.getStorageSync('token').token
					},
					success(res){
						_this.obj =res.data.data
						_this.obj.forEach(item=>{
							if(item){
								item.image=_this.global.url+item.image
							}
						})
						
					}
				})
			},
			Jump(obj){
				if (obj.jump_type == 3) {
					this.homeShow = false
					uni.navigateTo({
						url:'/pages/task/detail?id='+obj.jump_url
					})
				}
				if (obj.jump_type == 4) {
					this.homeShow = false
					uni.navigateTo({
						url: obj.jump_url
					}) 
				}
			},
			// 禁止页面滚动(规避警告)
			stopSlide() {
				return;
			},
			changeTask() {
				uni.request({
					url: this.global.url + '/api/task/change',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					}, 
					success: (res) => {
						
						if (res.data.code == 1) {
							this.taskId = res.data.data.id;
							this.detail = res.data.data;
							uni.navigateTo({
								url: '/pages/task/detail?id='+this.taskId
							})
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})
			},
			cloose(){
				this.homeShow=false
			}
		}
	}
	
</script>

<style lang="scss" scoped>
	.hoemMaks{
		overflow: hidden;
		width: 100%;
		position: relative;
		.mask{
			width: 100%;
			height: 100vh;
			position: fixed;
			top: 0;
			left: 0;
			background-color: rgba(0,0,0,.3);
			z-index: 9999;
			.mask_content{
				width: 500rpx;
				height: 603rpx; 
				background-color: rgba(0,0,0,0);  
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);
				border-radius: 60rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.cloose_img{
				width: 50rpx;
				height: 50rpx;
				position: absolute;
				bottom: 16.5%;
				left: 50%;
				transform: translateX(-50%);
				.cloose_img1{
					width: 50rpx;
					height: 50rpx ;
				}
			}
		}
	}
	
</style>
