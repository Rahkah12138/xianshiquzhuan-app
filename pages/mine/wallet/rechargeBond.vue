<template>
	<!-- 充值保证金 -->
	<view>
		<view>
			
			<image src="../../../static/tixiani.jpg" style="z-index:0;margin-left:2%;margin-top:30rpx;width:96%;height:200rpx;"></image>
					
			<view style="position:absolute;width:96%;left:2%;top:140rpx;z-index:1;padding-left:50rpx;font-size:28rpx;color:#fff;">
				{{wallet.money}}
			</view>
			
		</view>
		
		
		<view style=" background-color: White;padding: 40rpx 20rpx 20rpx 20rpx;">
					<view style="font-size: 34rpx;font-weight:bold;">保证金充值</view>
					<view style="font-size: 24rpx;margin-top:30rpx;">充值金额</view>
					<input class="input" v-model="moy" style="margin: 30rpx 0;height: 100rpx;line-height:100rpx;color:red;font-size: 40rpx;font-weight:bold;" step="1" type="number"
						placeholder="￥0.00" placeholder-style="#f6f6f6" />
						
						<view style="width:100%;display:flex;justify-content: space-between;font-size:24rpx;line-height:24rpx;">
							
							<view :class="{bd1:activeRadio != 'wechat',bd2:activeRadio == 'wechat'}" @click="activeRadio = 'wechat'" style="border-radius:20rpx;width:48%;height:180rpx;display: flex;align-items: center;flex-direction: column;">
								<image  v-if="activeRadio == 'wechat'"  style="height:100rpx;width:100rpx;" src="../../../static/recharge/wxs.png"></image>
								<image  v-if="activeRadio != 'wechat'"  style="height:100rpx;width:100rpx;" src="../../../static/recharge/wx.png"></image>
								<view>微信</view>
							</view>
							
							<view :class="{bd1:activeRadio != 'alipay',bd2:activeRadio == 'alipay'}" @click="activeRadio = 'alipay'" style="border-radius:20rpx;width:48%;height:180rpx;display: flex;align-items: center;flex-direction: column;">
								<image v-if="activeRadio != 'alipay'" style="height:100rpx;width:100rpx;" src="../../../static/recharge/ali.png"></image>
								<image v-if="activeRadio == 'alipay'"  style="height:100rpx;width:100rpx;" src="../../../static/recharge/alis.png"></image>
								<view>支付宝</view>
							</view>
							
						</view>
						
						<view class="protocol-row" @click="agreeProtocol=!agreeProtocol">
							<view class="protocol-checkbox" :class="{'checked': agreeProtocol}">
								<view class="checkmark"></view>
							</view>
							<text class="protocol-text">同意</text>
							<text class="protocol-link" @click.stop="goRule()">充值服务协议</text>
						</view>
		
					<view style="display:none;">
						<radio-group style="display: flex;align-items: center;justify-content: flex-start;" @change="chan">
							<label
								style="display: flex;align-items: center;justify-content: flex-start;margin:20rpx 0 20rpx 20rpx;"
								v-for="item in radioGroup">
								<radio style="margin: 0;" v-if="item.isShow" :value="item.val" :checked="item.title==activeRadio" />
								<image v-if="item.isShow" :src="item.image" mode=""></image>
								<text v-if="item.isShow">{{item.title}}</text>
								
							</label>
						</radio-group>
					</view>
					<view style="display:none;">
						<radio-group @change="resa">
							<view v-for="item in bx" style="display: flex;align-items: center;">
								<radio style="margin-left: 20rpx;" :value="item.cla" :checked="item.cla==pcla" /> 
								<view @click="goRule()">同意《充值服务协议》</view>
							</view>
						</radio-group>
					</view>
				</view>
		
		
		<view style="margin: 40rpx 0 0 0;">
			<button type="warn" class="btn" style="border: 0; width: 60%;background-color: #017ff0;"
				@click="onRecharge">充值</button>
		</view>
		
		
		
		
		
		<view class="bjcontent_box">
			<view class="bjcontent_one">
				保证金说明
			</view>
		 <view class="bjcontent">
		 	<view class="bjcontent_two" v-html="earnest_money">
		 	</view>
		 </view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				xuanzhong: '1',
				activeRadio: 'alipay',
				agreeProtocol: true,
				pcla: '',
				moy: '',
				radioGroup: [{
						image: '/static/user/zfb.png',
						val: 'alipay',
						title: '支付宝',
						isShow:''
					},
					{
						image: '/static/user/wx.png',
						val: 'wechat',
						title: '微信',
						isShow:''
					}
				],
				bx: [{
					cla: '《保证金服务协议》'
				}],
				info: "",
				earnest_money:'',
				bond:'',
				wallet:'',
			}
		},
		async onShow(){
			this.isOpen();
			this.ysM();
			this.getWithdrawal()
			let _this = this
			  let obj = await	this.init();
					console.log(obj);
					this.bond = obj.bond
					if(obj.wechat_payment ==1){
						_this.radioGroup.forEach(item=>{
							if(item.title == '微信'){
								item.isShow = true
							}
						});
					}else{
						_this.radioGroup.forEach(item=>{
							if(item.title == '微信'){
								item.isShow = false
							}
						});
					}
					if(obj.alipay_payment == 1){
						_this.radioGroup.forEach(item=>{
							if(item.title == '支付宝'){
								item.isShow = true
							}
						});
					}else{
						_this.radioGroup.forEach(item=>{
							if(item.title == '支付宝'){
								item.isShow = false;
							}
						});
					}
		},
		methods: {
			getWithdrawal() {
				let that = this;
				 uni.request({
				 	url: that.global.url + "/api/user/withdrawal",
				 	method: "POST",
				 	header: {
				 		'content-type': 'application/x-www-form-urlencoded'
				 	},
				 	data: {
				 		token: uni.getStorageSync("token").token,
				 		
				 	},
				 	success: (res) => {
				 		if (res.data.code == 1) {
							console.log(res.data.data,'info')
				 			that.wallet = res.data.data;
				 		
						} 
				 		
				 	}
				 })
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
			// 跳转到协议
			goRule() {
				uni.navigateTo({
					url: "/pages/home/subpage/course?id=3"
				})

			},
			// 判断支付宝和微信是否开启
			isOpen() {
				let that = this;
				uni.request({
					url: this.global.url + "/api/recharge/pay",
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
					},
					success: (res) => {
						if (res.data.code == 1) {
							that.info = res.data.data;
							if (res.data.data.alipay_payment == 2 || res.data.data.wechat_payment == 2) {
								that.isShow = false;
							}
						}
					}
				})
			},
			onRecharge() {
				let that = this;
				if (!that.moy) {
					uni.showToast({
						title: "请输入充值金额",
						icon: "none"
					})
					return
				}
				this.moy=parseFloat(this.moy)
				console.log(this.bond)
				console.log(this.moy)
				if (that.moy < this.bond) {
					uni.showToast({
						title: "最少充值"+this.bond,
						icon: "none"
					})
					return
				}
				if (that.info.alipay_payment == 2 && that.info.wechat_payment == 2) {
					uni.showToast({
						title: "暂无充值方式",
						icon: "none"
					})
					return;
				};
				
				if (that.activeRadio == '') {
					uni.showToast({
						title: "请选择充值方式",
						icon: "none"
					})
					return
				}
				
				if(this.activeRadio == 'wechat'){
					uni.showToast({
						title:"微信充值暂未开放",
						icon:"none"
					})
					return;
				}
				
				
				if (that.info.alipay_payment == 1 && that.info.wechat_payment == 1) {
					if (that.activeRadio == '') {
						uni.showToast({
							title: "请选择充值方式",
							icon: "none"
						})
						return
					}
				} else {
					if (that.info.alipay_payment == 1 || that.info.wechat_payment == 1) {

						if (that.info.alipay_payment == 1) {
							that.activeRadio = "alipay"
						} else {
							that.activeRadio = "wechat"
						}
					}
				}
				// if (that.pcla == "") {
				// 	uni.showToast({
				// 		title: "请先同意服务协议",
				// 		icon: "none"
				// 	})
				// 	return
				// }
				if(that.activeRadio == "wechat"){
					uni.showToast({
						title:"暂未开放",
						icon:"none"
					})
				}else{
					uni.request({
						url: this.global.url + "/api/user/recharge_bond",
						method: "POST",
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							token: uni.getStorageSync("token").token,
							userId: uni.getStorageSync("token").user_id,
							paytype: that.activeRadio,
							// #ifdef H5
							method: "wap",
							// #endif
							// #ifdef APP-PLUS
							method: "app",
							// #endif
							
							money: this.moy,
						},
						success: (res) => {
							console.log(res)
							console.log(res.data.data)
							if (res.data.code == 1) {
								// #ifdef H5
									let divForm = document.getElementsByTagName('divform')
									   if (divForm.length) {
									     document.body.removeChild(divForm[0])
									   }
									    const div=document.createElement('divform');
									    div.innerHTML=res.data.data; // data就是接口返回的form 表单字符串
									    document.body.appendChild(div);
									    document.forms[0].setAttribute('target', '_blank') // 新开窗口跳转
									    document.forms[0].submit();
																	
								// #endif
								
								console.log(that.activeRadio)
								// #ifdef APP-PLUS
									uni.requestPayment({
										provider: that.activeRadio,
										orderInfo: res.data.data,
										success: function(res) {
											
											console.log(res)
										},
										fail:function(err){
											console.log(err)
										}
									});
								// #endif
							}
						}
					}) 
				}
				
			},
			chan(e) {
				this.activeRadio = e.detail.value;
			},
			resa(e) {
				this.pcla = e.detail.value;
			},
			//保证金说明
			ysM(){
				let _this = this
				uni.request({
					url:_this.global.url + '/api/index/explain',
					method:"POST",
					header:{
							'content-type': 'application/x-www-form-urlencoded'
					},
					success(res){
						if(res.data.code == 1){
							_this.earnest_money = res.data.data.earnest_money;
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.protocol-row {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: center;
		margin-top: 50rpx;
		font-size: 24rpx;
		line-height: 24rpx;

		.protocol-checkbox {
			position: relative;
			width: 36rpx;
			height: 36rpx;
			border: 2rpx solid #dcdfe6;
			border-radius: 8rpx;
			margin-right: 12rpx;
			background-color: #fff;
			transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
			flex-shrink: 0;

			&:active {
				transform: scale(0.9);
			}

			.checkmark {
				position: absolute;
				top: 50%;
				left: 50%;
				width: 10rpx;
				height: 18rpx;
				border: solid #fff;
				border-width: 0 3rpx 3rpx 0;
				transform: translate(-50%, -60%) rotate(45deg) scale(0);
				opacity: 0;
				transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
			}

			&.checked {
				background: linear-gradient(135deg, #017ff0 0%, #4facfe 100%);
				border-color: #017ff0;
				box-shadow: 0 4rpx 12rpx rgba(1, 127, 240, 0.35);

				.checkmark {
					transform: translate(-50%, -60%) rotate(45deg) scale(1);
					opacity: 1;
					animation: checkBounce 0.3s cubic-bezier(0.4, 0, 0.2, 1);
				}
			}
		}

		.protocol-text {
			color: #666;
		}

		.protocol-link {
			color: #017ff0;
			margin-left: 6rpx;
		}
	}

	@keyframes checkBounce {
		0% {
			transform: translate(-50%, -60%) rotate(45deg) scale(0);
		}
		50% {
			transform: translate(-50%, -60%) rotate(45deg) scale(1.2);
		}
		100% {
			transform: translate(-50%, -60%) rotate(45deg) scale(1);
		}
	}

	input {
		margin: 30px;
		border-bottom: 1px solid gray;
	}

	image {
		width: 22.5px;
		height: 22.5px;
		margin: 10px;
	}

	page {
		background-color: #FFFFFF;
	}
	.bjcontent_box{
		.bjcontent {
			color: #999999;
			width: 90%;
			margin: 40rpx auto;
			font-size: 26rpx;
			line-height: 1.8;
			padding-bottom: 40rpx;
		}
		.bjcontent_one{
			font-size: 14pt;
			margin: 10px;
			height: 13pt;
		}
	}
	

	.btn::after {
		border: 0;
		color: #333333;
	}
	.bd1{
		border:3px solid #f8f8f8;
	}
	.bd2{
		border:3px solid #bdcbc7;
	}
</style>
