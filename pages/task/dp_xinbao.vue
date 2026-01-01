<template>
	<view class="box">

	
		<!-- 剩余次数 -->
		
		<view class="box_num">
			<text>剩余次数：{{num}}</text>
		</view>
		<!-- 内容去 -->
		<view class="box_content">
			<view class="box_content_con" :class="index == isShow ? 'chang_box' : '' " v-for="(item,index) in list"
				:key="index">
				<view v-for="(it,key,i) in list[index]" :key="i" @click="pay(index,key,it)">{{key}}次/{{it}}元
				</view>
			</view>
		</view>
		<!-- 提示 -->
		<view class="box_title">
			<text class="box_title_word">{{title}}</text>
		</view>
		<!-- 底部 -->
		<view class="box_bottom">
			<view class="box_bottom1" @click="cancela">
				取消
			</view>
			<view class="box_bottom2" @click="define">
				确定
			</view>
		</view>
		<!-- 底部弹窗 -->
		<view class="box_mask" v-if="show" @click.self="quxiao">
			<view class="box_masks">
				<view class="box_con">
					<view class="box_masks1" @click="payMoney(1)" v-if="wxShow">
						<image src="/static/user/wx.png" mode="widthFix"></image>
						<view style="margin-top: 20rpx;">微信</view>
					</view>
					<view class="box_masks2" @click="payMoney(2)" v-if="zfShow">
						<image src="/static/user/zfb.png" mode="widthFix"></image>
						<view style="margin-top: 18rpx;">支付宝</view>
					</view>
					<view class="box_masks2" @click="payMoney(3)" v-if="yeShow">
						<image src="/static/user/icon_ye.png" mode="widthFix"></image>
						<view style="margin-top: 20rpx;">余额</view>
					</view>
				</view>
				<view class="mask_word" @click="cla">
					取消
				</view>
			</view>
		</view>
		<view class="m_mask" v-if="maskShow">
			<view class="m_box">
				<view class="m_title">
					<image src="/static/release/yellow.png" class="title_img" mode=""></image>
					<text class="title_word">提示</text>
				</view>
				<view class="content">
					确定要使用余额支付吗？
				</view>
				<view class="m_btn" >
					<view class="m_btn1" @click="cancel">
						取消
					</view>
					<view class="m_btn2" @click="definea">
						确定
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: "购买须知：刷新包使用期限不限，不支持退订，请确认后购买",
				num: 0,
				isShow: 0,
				list: [],
				show: false,
				type: '',
				times: '', //次数
				money: '',
				maskShow: false,
				wxShow:'',//微信
				zfShow:'',//支付宝
				yeShow:'',//余额
			}
		},
	 async	onShow() {
			this.Ocrnum();
			let _this =this
			let obj = await this.init();
			console.log(obj);
			if(obj.wechat_payment ==1){
			   this.wxShow = true
			}else{
			   this.wxShow = false
			}
			if(obj.alipay_payment == 1){
			  this.zfShow = true
			}else{
				this.zfShow = false
			}
			if(obj.balance_payment ==1){
				this.yeShow = true
			}else{
				this.yeShow = false
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
			//剩余次数
			Ocrnum() {
				let that = this;
				let arr = []
				uni.request({
					url: that.global.url + '/api/allocation/refresh_store',
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
					},
					success(res) {
						if (res.data.code == 1) {
							console.log(res);
							that.num = res.data.data.num;
							that.list = res.data.data.refresh_store
							for (let i in that.list) {
								let obj = {}
								obj[i] = that.list[i]
								arr.push(obj);
							}
							that.list = arr;
							let obja = '';
							that.list.forEach((item, index) => {
								if (index < 1) {
									obja = item
								}
							});
							that.times = Object.keys(obja)[0];
							for (let j in obja) {
								that.money = obja[j];
							}
						}

					},
					fail(res) {
						uni.showToast({
							title: res.data.msg,
							icon: "none",
						})
					}
				})
			},
			//支付
			pay(index, key, it) {
				this.times = key;
				this.money = it;
				if (index == 0 || this.isShow == 0) {
					this.isShow = index;
				} else if (index == 1) {
					this.isShow = index
				} else if (index == 2) {
					this.isShow = index
				} else if (index == 3) {
					this.isShow = index
				} else if (index == 4) {
					this.isShow = index
				} else if (index == 5) {
					this.isShow = index
				} else if (index == 6) {
					this.isShow = index
				} else {
					this.isShow = index
				}
			},
			//取消
			cancela() {
				console.log('1111111111')
				uni.navigateBack({
					delta: 1
				})
			},
			//确定是否选择购买数量
			define(key, it) {
				if (this.times && this.money) {
					this.show = true;
				} else {
					uni.showToast({
						title: "请先选择购买数量",
						icon: "none"
					})
				}

			},
			//弹窗取消
			cla() {
				this.show = false
			},
			quxiao() {
				this.show = false
			},
			//支付
			payMoney(ty) {
				let that = this;
				if (ty) {
					if (ty == 1) {
						that.type = 'wechat'
						uni.showToast({
							title: "暂未开放",
							icon: "none"
						})
						return
					} else if (ty == 2) {
						that.type = 'alipay'
						uni.request({
							url: that.global.url + '/api/recharge/refresh_store_money',
							method: "POST",
							header: {
								'content-type': 'application/x-www-form-urlencoded'
							},
							data: {
								token: uni.getStorageSync("token").token,
								paytype: that.type,
								// #ifdef H5
								method: "wap",
								// #endif
								// #ifdef APP-PLUS
								method: "wap",
								// #endif
								num: that.times,
								money: that.money
							},
							success(res) {
								console.log(res)
								if (res.data.code == 1) {
									that.show = false;
									if (ty == 2) {
										
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
										
										
										// #ifdef APP-PLUS
											uni.requestPayment({
												provider: 'alipay',
												orderInfo: res.data.data,
												success: function(res) {
													console.log('success:' + JSON.stringify(res));
												},
												fail: function(err) {
													console.log('fail:' + JSON.stringify(err));
												}
											});
										// #endif
										
									}
								} else if (res.data.code == 0) {
									// that.show = false;
									uni.showToast({
										title: "暂未开放",
										icon: "none"
									})
								}
							}
						})
					} else {
						this.maskShow = true
					}
				} else {
					uni.showToast({
						title: "支付失败",
						icon: "none"
					})
				}
			},
			cancel() {
				this.maskShow = false
			},
			definea() {
				let paytype = '';
				let _this = this
				this.isJoin = true
				paytype = 'money'
				uni.request({
					url: _this.global.url + '/api/recharge/refresh_store_money',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
						paytype: paytype,
						method: "app",
						num: _this.times,
						money: _this.money
					},
					success: (re) => {
						_this.maskShow = false;
						if (re.data.code == 1) {
							uni.showToast({
								title: re.data.msg,
								icon: 'none'
							})
							_this.isJoin = false
						} else {
							uni.showToast({
								title: re.data.msg,
								icon: 'none'
							})
						}
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.box {
		width: 94%;
		background-color: #FFFFFF;
		overflow: hidden;
		position: relative;
		margin: 30rpx auto;
		border-radius: 24rpx;
		.box_title {
			width: 100%;
			background-color: #F5F5F5;

			.box_title_word {
				display: block;
				width: 100%;
				color: #999;
				font-size: 24rpx;
				height: 140rpx;
				line-height: 60rpx;
				padding: 28rpx 108rpx 20rpx 24rpx;
			}
		}

		.box_num {
			margin-left: 24rpx;
			margin-top: 20rpx;
			color: #333;
		}

		.box_content {
			width: 100%rpx;
			height: 550rpx;
			margin: 80rpx auto;
			display: flex;
			justify-content: space-around;
			flex-wrap: wrap;

			.box_content_con {
				width: 300rpx;
				height: 110rpx;
				background-color: #F5F5F5;
				line-height: 110rpx;
				text-align: center;
				font-size: 30rpx;
				border-radius: 24rpx;
				color: #999;
			}
		}

		.chang_box {
			border: 1px solid #017ff0;
			background-color: rgba(255, 220, 213, 1) !important;
			color: #017ff0 !important;
			box-sizing: border-box;
			border: 1px solid rgba(0, 149, 239, 1);
		}

		.box_bottom {
			width: 100%;
			height: 100rpx;
			justify-content: space-between;
			bottom: 0;
			display: flex;
			background-color: #F5F5F5;
			padding-bottom: 30rpx;
			.box_bottom1 {
				width: 45%;
				height: 100%;
				line-height: 100rpx;
				text-align: center;
				background: #fff;
				border-radius: 1000px;
				background: #E6E6E6;
				color: #999999;
				font-size: 30rpx;
			}

			.box_bottom2 {
				width: 45%;
				height: 100%;
				line-height: 100rpx;
				text-align: center;
				background-color: #017ff0;
				border-radius:1000px;
				color: #fff;
			}
		}

		.box_mask {
			width: 100%;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: rgba(0, 0, 0, .3);

			.box_masks {
				width: 100%;
				height: 280rpx;
				background-color: #FFFFFF;
				position: fixed;
				bottom: 0;

				.box_con {
					display: flex;
					justify-content: space-around;

					.box_masks1 {
						width: 80rpx;
						height: 80rpx;
						margin-top: 40rpx;
						font-size: 26rpx;
						text-align: center;

						image {
							width: 100%;
							height: 100%;

						}
					}

					.box_masks2 {
						width: 80rpx;
						height: 80rpx;
						margin-top: 40rpx;
						font-size: 26rpx;
						text-align: center;

						image {
							width: 100%;
							height: 100%;
						}
					}
				}

				.mask_word {
					width: 100%;
					height: 80rpx;
					position: absolute;
					bottom: 0;
					line-height: 80rpx;
					text-align: center;
				}

			}
		}
	}

	.m_mask {
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.4);
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999999;

		.m_box {
			width: 480rpx;
			height: 300rpx;
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			margin: auto;
			background-color: #FFFFFF;
			border-radius: 20rpx;
			overflow: hidden;

			.m_title {
				display: flex;
				margin-top: 19rpx;
				margin-left: 154rpx;

				.title_img {
					width: 49rpx;
					height: 49rpx;
				}

				.title_word {
					font-size: 28rpx;
					margin-left: 20rpx;
					margin-top: 10rpx;
				}
			}

			.content {
				margin-top: 56rpx;
				font-size: 28rpx;
				text-align: center;
			}

			.m_btn {
				width: 100%;
				height: 80rpx;
				position: absolute;
				bottom: 0;
				left: 0;
				display: flex;

				.m_btn1 {
					width: 50%;
					height: 80rpx;
					line-height: 80rpx;
					text-align: center;
					font-size: 28rpx;
				}

				.m_btn2 {
					width: 50%;
					height: 80rpx;
					line-height: 80rpx;
					text-align: center;
					font-size: 28rpx;
					background-color: #017ff0;
				}
			}
		}
	}
</style>
