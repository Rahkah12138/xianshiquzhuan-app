<template>
	<view class="bindwx">

		<view>
			<view style="width: 96%;margin-left:2%;padding-top:60%;">
				<view style="font-size:50rpx;font-weight:bold;">闲时快赚</view>
				<view style="font-size:30rpx;color:#a1a1a1;line-height:50rpx;">让闲暇时间变得有意义</view>
				
				<view class="btn" style="width: 100%;height: 6orpx;background-color: #41c83e;margin-top:50rpx;" >
					<button @click="appLogin()" type="primary" style="background-color: #41c83e;display:flex;justify-content: center;align-items:center;">
						<image src="/static/wx.png" style="height:40rpx;width:40rpx;"></image>
						微信一键快捷绑定
					</button>
				</view>
				
				<view class="btn" style="width: 100%;margin-top:30rpx;" >
					<button @click="skipBinding()" type="default" style="background-color: #f5f5f5;color: #666;border: 1px solid #ddd;">
						下次再说
					</button>
				</view>
			</view>
		</view>
		
	</view>
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
			appLogin() {
				console.log('wxxxx')
				uni.login({
					provider: 'weixin',
					onlyAuthorize:true,
					success: (loginRes) => {
						console.log(loginRes)
						console.log(loginRes.authResult);
						this.appWechatLogin({code:loginRes.code});
					},
					fail(res){  // 登录失败
						console.log(res)
						console.log(res.errCode)
						console.log(res.errMsg)
					}
				});
			},
			
			async appWechatLogin(param) {
				let _this = this;
				uni.request({
					url:_this.global.url+'/api/user/bindWx',
					method:"POST",
					data:{
						token:uni.getStorageSync('token').token,
						from: 'app',
						code:param.code,
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success(res){
						console.log(res)
						if(res.data.code ==1){
							uni.showToast({
								title: '绑定成功',
								icon: "success",
								duration: 1500
							})
							setTimeout(function(){
								uni.navigateBack()
							},1500)
						}else{
							uni.showToast({
								title: res.data.msg,
								icon: "none",
								duration: 3000
							})
							setTimeout(function(){
								uni.navigateBack();
							}, 1500); // 延迟1.5秒后返回，给用户时间看提示
						}
					}
				})
				
				return;
				const res = await this.$apis.bindWx({
					from: 'app',
					code:param.code
				})
				
				console.log(res)
			if (res.code == 1) {
				
					uni.showToast({
						title: '绑定成功',
						icon: "success",
						duration: 3000
					})
					
					//this.loginSuccessAndDealwith(res.data)
				} else {
					this.simpleWarn(res.msg)
					return
				}
				this.myIndex()
			},
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
			},
			
			// 跳过绑定微信，直接进入首页
			skipBinding(){
				uni.showToast({
					title: '已跳过绑定微信',
					icon: 'success',
					duration: 2000
				})
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/index/index'
					})
				}, 1500)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bindwx{
		
	}
	.btn {
	
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


</style>
