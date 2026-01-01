<template>
	<view>
		<!-- 公共组件弹窗 -->
		<view @touchmove.stop.prevent="stopSlide">
			<!-- 遮罩层 -->
			<view class="mask" @click="cancel"></view>
			<!-- 内容区 -->
			<view class="tip-del">
				<view class="tip-top">
					<image src="/static/release/yellow.png" mode="widthFix"></image>{{title}}
				</view>
				<view class="tip-titdel">{{tip}}</view>
				<view class="tip-btn">
					<view @click="cancel">取消</view>
					<view @click="confirm">确认</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: ''
			},
			tip: {
				type: String,
				default: ''
			},
			fatherMethod:{
				type:Function,
				default:null
			}
		},
		methods: {
			// 确认
			confirm() {
				let that = this;
			  that.$emit('ispopup', true);
				that.fatherMethod()
				
			},
			// 取消
			cancel() {
				let that = this;
				that.$emit('ispopup', false);
			},
			// 禁止页面滚动(规避警告)
			stopSlide() {
				return;
			}
		}
	}
</script>

<style scoped lang="scss">
	.mask {
		z-index: 99;
		background: rgba(0, 0, 0, 0.1);
		position: fixed;
		bottom: 0;
		right: 0;
		left: 0;
		top: 0;
	}

	.tip {
		&-del {
			z-index: 999;
			width: 480rpx;
			height: 300rpx;
			background: #FFFFFF;
			border-radius: 10rpx;
			overflow: hidden;
			position: fixed;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}

		&-top {
			display: flex;
			margin-top: 10px;
			font-size: 30rpx;
			align-items: center;
			justify-content: center;

			&>image {
				width: 30rpx;
				height: 30rpx;
				margin-right: 20rpx;
			}
		}

		&-titdel {
			display: flex;
			margin: 67rpx 0;
			font-size: 30rpx;
			align-items: center;
			justify-content: center;
		}

		&-btn {
			display: flex;
			font-size: 30rpx;

			&>view {
				width: 50%;
				height: 70rpx;
				line-height: 70rpx;
				text-align: center;
			}

			&>view:last-child {
				background-color: #0095ef;
			}
		}
	}
	.tip-btn view{
		height: 72rpx;
	}
</style>
