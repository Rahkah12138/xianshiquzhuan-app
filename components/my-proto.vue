<template>
	<view>
		<!-- 弹窗提示 -->
		<view v-show="isshow" @touchmove.stop.prevent="stopSlide">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<!-- 内容区 -->
			<view class="tip">
				<view class="txt1">隐私政策协议</view>
				<view class="txt2">
					感谢您下载和注册本平台，您的信任对我们非常重要，我们将按法律法规要求，采取相应安全保护措施，尽力保护您的个人信息安全。
				</view>
				<view class="txt2">
					在开始使用产品前，请你务必审慎阅读、充分理解服务协议和隐私政策各条款，包括单不限于:为了向你提供聊天、内容分享等服务，我们需要收集你的设备信息、操作日志等个人信息。你可以在设置中查看、变更、删除个人信息并管理你的授权。
				</view>
				<view class="txt3">
					点击同意，即表示已阅读并同意
					<text @click.stop="agreementa">《服务协议》</text>
					<text @click.stop="agreementb">《隐私政策》</text>
				</view>
				<view class="btn1" @click="confirm">同意并继续</view>
				<text class="btn2" @click="cancel">不同意</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			isshow: {
				type: Boolean,
				default: false
			}
		},
		data(){
			return{
				isProto:''
			}
		},
		methods: {
			// 同意并继续
			confirm() {
				let that = this;
				that.isProto = true;
				uni.setStorageSync('isProto', this.isProto);
				that.$emit('cancel');
			},
			// 不同意
			cancel() {
				let that = this;
				that.$emit('cancel');
			},
			// 跳转协议
			agreementa(){
				uni.navigateTo({
					url:"/pages/home/login/service"
				})
			},
			agreementb(){
				uni.navigateTo({
					url:"/pages/home/login/privacy"
				})
			},
			// 禁止页面滚动(规避警告)
			stopSlide() {
				return;
			}
		}
	}
</script>

<style scoped>
	.mask {
		z-index: 99;
		background: rgba(0, 0, 0, 0.6);
		position: fixed;
		bottom: 0;
		right: 0;
		left: 0;
		top: 0;
	}

	.tip {
		width: 70%;
		z-index: 999;
		display: flex;
		padding: 30rpx;
		line-height: 40rpx;
		align-items: center;
		border-radius: 20rpx;
		flex-direction: column;
		justify-content: center;
		background: #FFFFFF;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.txt1 {
		font-size: 28rpx;
		font-weight: bold;
		margin-bottom: 40rpx;
	}

	.txt2,
	.txt3 {
		font-size: 26rpx;
	}

	.txt3>text {
		color: #FF8F22;
		font-size: 26rpx;
	}

	.btn1 {
		width: 300rpx;
		height: 60rpx;
		color: #FFFFFF;
		margin: 40rpx 0;
		font-size: 26rpx;
		line-height: 60rpx;
		text-align: center;
		background: #FF8F22;
		border-radius: 30rpx;
	}

	.btn2 {
		color: #999999;
		font-size: 26rpx;
	}
</style>
