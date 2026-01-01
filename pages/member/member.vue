<template>
	<view class="member-center-container">
		<!-- 头部 -->
		<view class="header-section">
			<view class="nav-bar">
				<image class="back-icon" src="/static/noviciate/left.png" mode="widthFix" @click="fanhui"></image>
				<view class="title">会员中心</view>
			</view>
			<view class="user-info-card">
				<image class="avatar" :src="uList.avatar"></image>
				<view class="user-details">
					<view class="nickname-row">
						<text class="nickname">{{uList.nickname}}</text>
						<image class="level-badge" :src="getImgUrl(uList.levelimage)" mode=""></image>
					</view>
					<view class="user-id">ID:{{uList.id}}</view>
				</view>
			</view>
		</view>

		<!-- 主体内容 -->
		<view class="content-body">
			<!-- 会员套餐 -->
			<view class="package-section">
				<view class="section-title">开通会员享受更多会员权益</view>
				<scroll-view scroll-x="true" class="package-scroll-view">
					<view class="package-card" :class="{'active': Inv === index}" v-for="(item,index) in vip" :key="index" @click="UpgradeMembers(item.id,index)">
						<image class="package-icon" :src="item.image"></image>
						<view class="package-name">{{item.name}}</view>
						<view class="package-price">
							<text v-if="index !== 0">¥</text>
							<text class="price-value">{{index === 0 ?'VIP初体验':item.member_fee}}</text>
						</view>
						<view class="package-duration">有效期：{{item.member_days}}天</view>
					</view>
				</scroll-view>
			</view>

			<!-- 会员权益 -->
			<view class="privilege-section card">
				<view class="section-title">会员专属权益</view>
				<view class="privilege-table" v-if="tyList.length > 0">
					<view class="table-header">
						<text>项目名称</text>
						<text>当前</text>
						<text>会员</text>
					</view>
					<view class="table-row">
						<text>有效期</text>
						<text>{{currList.validity}}</text>
						<text class="highlight">{{tyList[0].member_days}}天</text>
					</view>
					<view class="table-row">
						<text>发布数量</text>
						<text>{{currList.release}}个</text>
						<text class="highlight">{{tyList[0].release_num}}个</text>
					</view>
					<view class="table-row">
						<text>送提现免费额度</text>
						<text>{{currList.free_amount}}元</text>
						<text class="highlight">{{tyList[0].free_amount}}元</text>
					</view>
					<view class="table-row">
						<text>提现比例</text>
						<text>{{currList.carry}}</text>
						<text class="highlight">{{tyList[0].withdrawal_ratio}}</text>
					</view>
					<view class="table-row">
						<text>服务费比例</text>
						<text>{{currList.service}}</text>
						<text class="highlight">{{tyList[0].service_fee}}</text>
					</view>
					<view class="table-row">
						<text>赠送置顶小时数</text>
						<text>{{currList.top_time}}小时</text>
						<text class="highlight">{{tyList[0].top_time}}小时</text>
					</view>
					<view class="table-row">
						<text>任务置顶费</text>
						<text>{{currList.top}}元</text>
						<text class="highlight">{{tyList[0].top_fee}}元/小时</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="footer-actions">
			<button class="upgrade-btn" @click="isJoin=true">升级会员</button>
		</view>

		<!-- 支付弹窗 -->
		<view v-if="isJoin" class="payment-popup">
			<view class="popup-mask" @click.stop="cloose"></view>
			<view class="popup-content">
				<view class="payment-options">
					<view class="option" @click="payment(0)" v-if="wxShow">
						<image src="/static/user/wx.png"></image>
						<text>微信</text>
					</view>
					<view class="option" @click="payment(1)" v-if="zfShow">
						<image src="/static/user/zfb.png"></image>
						<text>支付宝</text>
					</view>
					<view class="option" @click="payment(2)" v-if="yeShow">
						<image src="/static/user/icon_ye.png"></image>
						<text>余额</text>
					</view>
				</view>
				<view class="cancel-btn" @click.stop="cloose">取消</view>
			</view>
		</view>

		<!-- 余额支付确认弹窗 -->
		<view class="confirmation-popup" v-if="maskShow">
			<view class="popup-mask" @click="cancel"></view>
			<view class="popup-content">
				<view class="popup-title">
					<image src="/static/release/yellow.png"></image>
					<text>提示</text>
				</view>
				<view class="popup-message">确定要使用余额支付吗？</view>
				<view class="popup-actions">
					<button class="action-btn cancel" @click="cancel">取消</button>
					<button class="action-btn confirm" @click="define">确定</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// Script content remains the same
	export default {
		data() {
			return {
				uList: [],
				Inv: 0,
				vipList: [],
				tyList: [],
				zList: [],
				yList: [],
				nList: [],
				pca: [],
				useId: '',
				currList: [],
				isJoin: false, //是否弹窗
				vip: [],
				vipType: 0, //选择类型
				isShow: false,
				maskShow: false,
				wxShow:'',//微信
				zfShow:'',//支付宝
				yeShow:'',//余额
				vipShow:0
			}
		},
		onLoad() {
			
			
			this.isOpen();
			this.vipCenterA();
			
		},
		async onShow() {
			this.isOpen();
			this.vipCenterA();
			
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
							if (that.info.alipay_payment == 2 && that.info.wechat_payment == 2) {
								that.isShow = false;
							} else if (that.info.alipay_payment == 1 && that.info.wechat_payment == 1) {
								that.isShow = true;
							} else if (that.info.alipay_payment == 1 || that.info.wechat_payment == 1) {
								that.isShow = false;
							}

						}
					}
				})
			},
			// 获取会员等级
			vipCenterA() {
				let that = this;
				uni.request({
					url: that.global.url + "/api/user/members",
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
					},
					success: (res) => {
						if (res.data.code == 1) {
							that.uList = res.data.data.user
							that.currList = res.data.data.levels.current
							that.vip = res.data.data.levels
							console.log(that.vip)
							let lg = res.data.data.levels
							delete lg.current
							that.tyList = [res.data.data.levels[that.vipType]]
							that.useId = res.data.data.levels[0].id
						}
					}
				})
			},
			// 选择会员等级
			UpgradeMembers(e, i) {
				let that = this;
				that.useId = e;
				that.Inv = i;
				that.tyList = [that.vip[i]]
				that.vipShow = i
			},
			getImgUrl(imae) {
				return this.global.url + imae;
			},
			// 支付
			payType() {
				let that = this;
				if (that.info.alipay_payment == 2 && that.info.wechat_payment == 2) {
					uni.showToast({
						title: "暂无充值方式",
						icon: "none"
					})
					return;
				};
				if (that.info.alipay_payment == 1 || that.info.wechat_payment == 1) {
					if (that.info.alipay_payment == 1) {
						that.activeRadio = "1"
					} else {
						that.activeRadio = "0"
					}
					that.payment(that.activeRadio)
				}
			},
			// 返回上一页
			fanhui:function(){
				uni.navigateBack({
					delta:1
				})
			},
			
			// 升级会员
			payment(index) {
				let paytype = ''
				let _this = this
         if (index == 0 || index == 1 ) {
					paytype = 'alipay'
          if(index == 0)paytype = 'wechat'
					uni.request({
						url: _this.global.url + '/api/Recharge/vipUpgrade',
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
								// #ifdef H5
								method: 'wap',
									// #endif
									// #ifdef APP-PLUS
									method: 'app',
										// #endif
							
							id: _this.useId,
							token: uni.getStorageSync('token').token,
							paytype: paytype
						},
						success: (res) => {
							if (res.data.code == 1) {
								// #ifdef H5
									  if(paytype == "wechat"){
										window.open(res.data.data.data.url);
									  }else{
										let divForm = document.getElementsByTagName('divform')
										if (divForm.length) {
										  document.body.removeChild(divForm[0])
										}
										const div=document.createElement('divform');
										div.innerHTML=res.data.data; // data就是接口返回的form 表单字符串
										document.body.appendChild(div);
										document.forms[0].setAttribute('target', '_blank') // 新开窗口跳转
										document.forms[0].submit();
									  }
													// #endif
													
													// #ifdef APP-PLUS
									  if(paytype == "wechat"){
										uni.navigateTo({
										  url:"/pages/web/openPage?url="+encodeURIComponent(res.data.data.data.url)
										})
									  }else{
										uni.requestPayment({
										  provider: 'alipay',
										  orderInfo: res.data.data,
										  success: function(res) {
											
											uni.showToast({
												title: '升级成功',
												icon: 'success',
												duration:3000
											})
											_this.isJoin = false
										  },
										});
									  }
								// #endif
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								})
							}
						}
					})
				}else{
					this.maskShow=true
				}
			},
			cancel() {
				this.maskShow = false
			},
			define() {
				let paytype = '';
				let _this = this
				this.isJoin = true
				paytype = 'money'
				uni.request({
					url: _this.global.url + '/api/Recharge/vipUpgrade',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						method: 'app',
						id: _this.useId,
						token: uni.getStorageSync('token').token,
						paytype: paytype
					},
					success: (re) => {
						_this.maskShow =false;
						if (re.data.code == 1) {
							uni.showToast({
								title: '升级成功',
								icon: 'success'
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
			},
			cloose(){
				this.isJoin = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	@keyframes slideInUp {
		from {
			transform: translateY(50px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.header-section,
	.package-section,
	.privilege-section {
		animation: slideInUp 0.5s ease-out forwards;
	}

	.package-card {
		animation: slideInUp 0.5s ease-out forwards;
	}

	.member-center-container {
		background-color: #f7f8fa;
		min-height: 100vh;
		padding-bottom: 120rpx;
	}

	.header-section {
		background: $uni-color-primary;
		padding: var(--status-bar-height) 30rpx 80rpx;
		border-radius: 0 0 60rpx 60rpx;
		color: #fff;
	}

	.nav-bar {
		position: relative;
		height: 88rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		.back-icon {
			position: absolute;
			left: 0;
			width: 50rpx;
			height: 50rpx;
		}
		.title {
			font-size: 36rpx;
			font-weight: bold;
		}
	}

	.user-info-card {
		display: flex;
		align-items: center;
		margin-top: 20rpx;
		.avatar {
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			border: 4rpx solid #fff;
			margin-right: 20rpx;
		}
		.user-details {
			.nickname-row {
				display: flex;
				align-items: center;
				.nickname {
					font-size: 36rpx;
					font-weight: bold;
				}
				.level-badge {
					width: 40rpx;
					height: 40rpx;
					margin-left: 16rpx;
				}
			}
			.user-id {
				font-size: 24rpx;
				opacity: 0.8;
				margin-top: 8rpx;
			}
		}
	}

	.content-body {
		padding: 0 30rpx;
		margin-top: -60rpx;
		position: relative;
		z-index: 10;
	}

	.package-section {
		.section-title {
			text-align: center;
			font-size: 40rpx;
			font-weight: bold;
			margin-bottom: 20rpx;
			padding: 0rpx 0;
			letter-spacing: 2rpx;
			background: linear-gradient(45deg, #f0c869, #c7932f);
			-webkit-background-clip: text;
			background-clip: text;
			color: transparent;
			text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
		}
		.package-scroll-view {
			white-space: nowrap;
			padding: 0rpx;
			box-sizing: border-box;
			.package-card {
				display: inline-block;
				width: 240rpx;
				height: 320rpx;
				border-radius: 20rpx;
				margin-right: 20rpx;
				margin-bottom: 10px;
				margin-left: 10px;
				padding: 20rpx;
				box-sizing: border-box;
				text-align: center;
				border: 4rpx solid transparent;
				transition: all 0.3s;
				position: relative;
				background: #fff;
				box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
				margin-top: 10rpx;

				// Differentiated styles based on index
				&:nth-child(1) { background: linear-gradient(135deg, #f0f0f0, #e0e0e0); }
				&:nth-child(2) { background: linear-gradient(135deg, #fdecec, #f5a6a6); }
				&:nth-child(3) { background: linear-gradient(135deg, #fff7e6, #ffd580); }
				&:nth-child(4) { background: linear-gradient(135deg, #e6f7ff, #80d4ff); }
				&:nth-child(5) { background: linear-gradient(135deg, #e6fffb, #80ffea); }
				&:nth-child(6) { background: linear-gradient(135deg, #f0e6ff, #c380ff); }

				&.active {
					border-color: $uni-color-primary;
					margin-top: 0;
					transform: scale(1.05);
					box-shadow: 0 12rpx 40rpx rgba(230, 57, 70, 0.3);
				}
				.package-icon {
					width: 80rpx;
					height: 80rpx;
					margin-bottom: 10rpx;
				}
				.package-name {
					font-size: 28rpx;
					font-weight: bold;
					color: #333;
				}
				.package-price {
					margin: 16rpx 0;
					color: $uni-color-primary;
					font-size: 26rpx;
					.price-value {
						font-size: 40rpx;
						font-weight: bold;
					}
				}
				.package-duration {
					font-size: 24rpx;
					color: #999;
				}
			}
		}
	}

	.privilege-section {
		margin-top: 40rpx;
		background-color: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.05);

		.section-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 20rpx;
			padding-left: 0;
			text-align: left;
			background: none;
			-webkit-background-clip: unset;
			background-clip: unset;
			color: #333;
			text-shadow: none;
			position: relative;
			
			&::before {
				content: '';
				position: absolute;
				left: -30rpx;
				top: 50%;
				transform: translateY(-50%);
				width: 8rpx;
				height: 32rpx;
				background-color: $uni-color-primary;
				border-radius: 0 4rpx 4rpx 0;
			}
		}

		.privilege-table {
			.table-header,
			.table-row {
				display: flex;
				text-align: center;
				font-size: 26rpx;
				align-items: center;

				text {
					flex: 1;
					padding: 24rpx 0;
				}
			}

			.table-header {
				font-weight: bold;
				color: #999;
				font-size: 24rpx;
			}

			.table-row {
				color: #666;
				border-bottom: 1rpx solid #f5f5f5;

				&:last-child {
					border-bottom: none;
				}

				text:first-child {
					color: #333;
					font-weight: 500;
				}

				.highlight {
					color: #c7932f;
					font-weight: bold;
					font-size: 28rpx;
				}
			}
		}
	}

	.footer-actions {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #fff;
		padding: 20rpx;
		padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
		z-index: 100;
		box-sizing: border-box;
		.upgrade-btn {
			height: 88rpx;
			line-height: 88rpx;
			font-size: 32rpx;
			background-color: $uni-color-primary;
			color: #fff;
			border-radius: 44rpx;
			width: 100%;
			box-sizing: border-box;
		}
	}

	.payment-popup {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1000;
		.popup-mask {
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.6);
		}
		.popup-content {
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			background-color: #f7f8fa;
			.payment-options {
				background-color: #fff;
				display: flex;
				justify-content: space-around;
				padding: 40rpx 0;
				.option {
					text-align: center;
					font-size: 26rpx;
					color: #666;
					image {
						width: 100rpx;
						height: 100rpx;
						margin-bottom: 10rpx;
					}
				}
			}
			.cancel-btn {
				height: 100rpx;
				line-height: 100rpx;
				text-align: center;
				background-color: #fff;
				margin-top: 20rpx;
				font-size: 30rpx;
			}
		}
	}

	.confirmation-popup {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1001;
		display: flex;
		align-items: center;
		justify-content: center;
		.popup-mask {
			position: absolute;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.6);
		}
		.popup-content {
			width: 520rpx;
			background-color: #fff;
			border-radius: 20rpx;
			z-index: 1;
			.popup-title {
				display: flex;
				align-items: center;
				justify-content: center;
				padding-top: 40rpx;
				font-size: 32rpx;
				font-weight: bold;
				image {
					width: 40rpx;
					height: 40rpx;
					margin-right: 16rpx;
				}
			}
			.popup-message {
				padding: 40rpx;
				font-size: 28rpx;
				color: #666;
				text-align: center;
			}
			.popup-actions {
				display: flex;
				border-top: 1rpx solid #f0f0f0;
				.action-btn {
					flex: 1;
					height: 90rpx;
					line-height: 90rpx;
					font-size: 30rpx;
					&.cancel {
						color: #666;
						border-right: 1rpx solid #f0f0f0;
					}
					&.confirm {
						color: $uni-color-primary;
						font-weight: 500;
					}
				}
			}
		}
	}
</style>
