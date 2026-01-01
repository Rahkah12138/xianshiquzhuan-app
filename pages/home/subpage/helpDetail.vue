<template>
	<!-- 帮助页面 -->
	<view>
		<view style="position: relative;">
			<view v-html="helpList.content"
				style="height: 40pt;background-color: White;justify-content: space-around;padding-left: 20rpx;margin-top: 20rpx;">
				<!-- <text style="flex: 1;line-height: 40pt;">{{item.name}}?</text> -->
			</view>	
			</view>
	</view>
		<!-- 帮助列表 -->
		<!-- <view class="btn" style="width: 100%;height: 6orpx;background-color: #FAE04D;" @click="customer" v-if="switch_service">
			<button type="primary" style="background-color: #FAE04D;">联系客服</button>
		</view>
	</view> -->
</template>

<script>
	export default {
		data() {
			return {
				helpList:'',
				switch_service:'',//客服
				id:'',
				
			}
		},
		onLoad(options) {
			this.id=options.id
			this.getArticleList()
		},
		async onShow() {
		let obj = await	this.init();
		console.log(obj)
		if(obj.switch_service ==2){
			this.switch_service = false
		}else{
			 this.switch_service = true;
			 uni.setStorageSync('customerMei',obj)
		}
		},  
		methods: { 
			init(){
				let _this = this;
				return new Promise((resolve,reject)=>{
					uni.request({
						url:_this.global.url+'/api/index/switchOn',
						method:"POST",
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						success(res){
							if(res.data.code ==1){
								resolve(res.data.data)
								   
							}
						}
					})
				})
			},
			// 帮助中心
			getArticleList() {
				uni.request({
					url: this.global.url + '/api/Article/articleDetails',
					method: 'POST',
					data:{
						id:this.id
					},
					
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success: (res) => {
						this.helpList = res.data.data;
						console.log(this.helpList)
					}
				})
			},
			helpDetail(){
				
				uni.navigateTo({
					url:"/pages/home/subpage/helpDetail"
				})
			},
			customer(){
				uni.navigateTo({
					url:"/pages/home/subpage/customer"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.btn {
		position: fixed;
		bottom: 0;
	}

	.setting {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	.helptit {
		width: 100%;
		height: 31pt;
		background-color: #FFFFFF;
		font-size: 16pt;
		text-align: center;
		line-height: 31pt;
	}

	navigator {
		line-height: 80rpx;
		margin: 50px auto;

		text {
			color: red;
		}
	}

	button {
		position: absolute;
		bottom: 0px;
		width: 100%;
	}
</style>
