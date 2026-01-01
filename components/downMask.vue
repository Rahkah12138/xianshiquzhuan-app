<template>
	<view class="down_mask" v-if="downShow">
		<view class="down_con">
			<view class="down_word">
				<view class="down_word1">
					发现新版本 V{{newVersion}}
				</view>
				<view class="down_word2">
					{{content}}
				</view>
			</view>
			<view class="btn" @click="down" v-if="openShow">
				立即更新
			</view>
			<view class="pro_box" v-if="jdShow">
				<view class="pro_box_word">
					正在下载 {{progress}}%
				</view>
				<progress :percent="progress" stroke-width="50" activeColor="#FFA444" />
			</view>
		</view>
		<view class="dele" v-if="delShow" @click="cloose">
			<image src="/static/login/icon_delete@2x.png" mode=""></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: '',
				newVersion: '',
				downShow: false,
				delShow: true,
				urlDown: '',
				progress: 0,
				jdShow: false,
				openShow: true
			}
		},
		methods: {
			// 比较版本号，返回 1 表示 v1 > v2，-1 表示 v1 < v2，0 表示相等
			compareVersion(v1, v2) {
				const parts1 = v1.split('.').map(Number);
				const parts2 = v2.split('.').map(Number);
				const len = Math.max(parts1.length, parts2.length);

				for (let i = 0; i < len; i++) {
					const num1 = parts1[i] || 0;
					const num2 = parts2[i] || 0;
					if (num1 > num2) return 1;
					if (num1 < num2) return -1;
				}
				return 0;
			},

			init() {
				let _this = this;
				// 异步获取版本号，必须在回调中发起请求
				plus.runtime.getProperty(plus.runtime.appid, function(wgtinfo) {
					let currentVersion = wgtinfo.version

					uni.request({
						url: _this.global.url + '/api/user/version',
						method: "POST",
						success: (result) => {
							if (result.data.code == 1 && result.data.data) {
								let serverVersion = result.data.data.newversion

								// 使用正确的版本比较方法
								if (_this.compareVersion(serverVersion, currentVersion) > 0) {
									_this.newVersion = serverVersion;
									_this.content = result.data.data.content;
									_this.downShow = true;
									_this.urlDown = result.data.data.downloadurl;
									// enforce=0 强制更新不显示关闭按钮，enforce=1 非强制可关闭
									if (result.data.data.enforce == 0) {
										_this.delShow = false;
									} else {
										_this.delShow = true;
									}
								}
							}
						},
						fail: (error) => {
							// 版本检查请求失败
						}
					})
				});
			},

			// 下载并安装
			down() {
				this.openShow = false;
				this.jdShow = true;
				this.progress = 0;

				const downloadTask = uni.downloadFile({
					url: this.urlDown,
					success: (downloadResult) => {
						if (downloadResult.statusCode === 200) {
							plus.runtime.install(downloadResult.tempFilePath, {
								force: true
							}, () => {
								// 安装成功
								uni.showModal({
									title: '安装完成',
									content: '新版本已安装完成，请重启应用',
									showCancel: false,
									confirmText: '立即重启',
									success: () => {
										plus.runtime.restart();
									}
								});
							}, (e) => {
								// 安装失败
								uni.showToast({
									title: '安装失败，请重试',
									icon: 'none'
								});
								this.openShow = true;
								this.jdShow = false;
							});
						} else {
							uni.showToast({
								title: '下载失败，请重试',
								icon: 'none'
							});
							this.openShow = true;
							this.jdShow = false;
						}
					},
					fail: (error) => {
						uni.showToast({
							title: '下载失败，请检查网络',
							icon: 'none'
						});
						this.openShow = true;
						this.jdShow = false;
					}
				});

				downloadTask.onProgressUpdate((res) => {
					this.progress = res.progress;
				});
			},

			// 关闭弹窗
			cloose() {
				this.downShow = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.down_mask {
		width: 100%;
		height: 100vh;
		background-color: rgba(0, 0, 0, .5);
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999999999;

		.down_con {
			width: 540rpx;
			height: 650rpx;
			background-color: #FFFFFF;
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			margin: auto;
			background-image: url('/static/login/down_img.png');
			background-repeat: no-repeat;
			background-size: 100% 650rpx;
			border-radius: 20rpx;
		}

		.down_word {
			width: 100%;
			position: absolute;
			top: 50%;
			padding: 0 30rpx;
			box-sizing: border-box;

			.down_word1 {
				text-align: center;
				color: #333333;
				font-size: 32rpx;
				font-weight: bold;
			}

			.down_word2 {
				text-align: center;
				margin-top: 30rpx;
				color: #666666;
				font-size: 26rpx;
				line-height: 1.6;
			}
		}

		.btn {
			width: 80%;
			background-image: linear-gradient(to right, #FFDA42, #FF9B42);
			position: absolute;
			bottom: 60rpx;
			height: 80rpx;
			border-radius: 40rpx;
			line-height: 80rpx;
			text-align: center;
			font-size: 28rpx;
			color: #FFFFFF;
			left: 50%;
			transform: translateX(-50%);
			font-weight: bold;
		}

		.pro_box {
			width: 80%;
			position: absolute;
			bottom: 60rpx;
			height: 80rpx;
			border-radius: 40rpx;
			left: 50%;
			transform: translateX(-50%);
			overflow: hidden;
			background-color: #f5f5f5;

			.pro_box_word {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				color: #333;
				font-size: 26rpx;
				z-index: 1;
			}
		}

		.dele {
			width: 48rpx;
			height: 48rpx;
			position: absolute;
			top: 80%;
			left: 50%;
			transform: translateX(-50%);

			image {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>
