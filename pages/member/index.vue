<template>
	<view class="uni-container">
		<view class="content">
			<button type="default" @click="getOAID">获取oaid</button>
			<button type="default" @click="getIMEI">获取IMEI</button>
			<button type="default" @click="getAndroidID">获取AndroidID</button>
			<button type="default" @click="getGUID">获取GUID</button>
			<view>{{oaid_str}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nativeTool:null,
				oaid_str:""
			}
		},
		onLoad() {
			this.nativeTool = uni.requireNativePlugin("Acc-NativeTool")
			console.log(this.nativeTool)
			this.nativeTool.init_oaid_sdk()
		},
		methods: {
			getOAID(){
				if(this.nativeTool.requestPhonePermission()){
					this.oaid_str = this.nativeTool.getOAID()
				}
			},
			getIMEI(){
				if(this.nativeTool.requestPhonePermission()){
					this.oaid_str = this.nativeTool.getIMEI()
				}
			},
			getAndroidID(){
				if(this.nativeTool.requestPhonePermission()){
					this.oaid_str = this.nativeTool.getAndroidID()
				}
			},
			getGUID(){
				if(this.nativeTool.requestPhonePermission()){
					this.oaid_str = this.nativeTool.getGUID()
				}
			},
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
