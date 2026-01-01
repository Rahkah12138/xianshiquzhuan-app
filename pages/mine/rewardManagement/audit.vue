<template>
	<!-- 审核页面 -->
	<view class="audit-page">
		<view class="content-wrapper" :class="{ 'fade-in': pageLoaded }">
			<!-- 用户信息卡片 -->
			<view class="user-card" :class="{ 'slide-up': pageLoaded }" v-if="examineList!=''">
				<view class="user-card__avatar">
					<image :src="examineList.avatar" mode="aspectFill"></image>
					<view class="avatar-ring"></view>
				</view>
				<view class="user-card__info">
					<view class="user-card__name">
						<text class="nickname">{{examineList.nickname}}</text>
						<text class="user-id">ID: {{examineList.user_id}}</text>
					</view>
					<view class="user-card__time">
						<view class="time-item">
							<text class="label">报名时间</text>
							<text class="value">{{examineList.createtime}}</text>
						</view>
						<view class="time-item">
							<text class="label">提交时间</text>
							<text class="value">{{examineList.updatetime}}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 验证图片区域 -->
			<view class="section-card" :class="{ 'slide-up-delay-1': pageLoaded }" v-if="cont.url!=''">
				<view class="section-header">
					<view class="section-icon">
						<image src="/static/icon/image.png" mode="aspectFit" style="width: 36rpx; height: 36rpx;"></image>
					</view>
					<text class="section-title">验证图片</text>
				</view>
				<view class="image-grid">
					<view v-for="(images, index) in cont.url" :key="index" class="image-item" @click="bigImg(cont.url)">
						<image :src="getImgUrl(images)" mode="aspectFill"></image>
						<view class="image-overlay">
							<text class="preview-text">点击预览</text>
						</view>
						<view class="save-btn" @click.stop="cuntu(getImgUrl(images))">
							<text>保存</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 验证信息区域 -->
			<view class="section-card" :class="{ 'slide-up-delay-2': pageLoaded }" v-if="cont.info!=''">
				<view class="section-header">
					<view class="section-icon info-icon">
						<image src="/static/icon/info.png" mode="aspectFit" style="width: 36rpx; height: 36rpx;"></image>
					</view>
					<text class="section-title">验证信息</text>
				</view>
				<view class="info-content">
					<text class="info-text">{{cont.info}}</text>
				</view>
				<view class="copy-btn" @click="fuzhi(cont.info)">
					<text>复制信息</text>
				</view>
			</view>

			<!-- 操作按钮区域 -->
			<view class="action-buttons" :class="{ 'slide-up-delay-3': pageLoaded }" v-if="stong==1">
				<view class="btn-reject" @click="refuse">
					<text>拒绝</text>
				</view>
				<view class="btn-approve" :class="{ 'btn-disabled': isAdopting }" @click="adoptPu">
					<text>{{ isAdopting ? '处理中...' : '通过' }}</text>
				</view>
			</view>
		</view>

		<!-- 底部下一个按钮 -->
		<view class="bottom-btn-wrapper">
			<view class="bottom-btn" @click="nextMission(examineList.tasklist_id,examineList.id)">
				<view class="btn-content">
					<text class="btn-text">下一个</text>
					<view class="arrow-group">
						<text class="arrow arrow-1">›</text>
						<text class="arrow arrow-2">›</text>
						<text class="arrow arrow-3">›</text>
					</view>
				</view>
				<view class="btn-shine"></view>
			</view>
		</view>

		<!-- 拒绝弹窗 -->
		<view class="popup-mask" :class="{ 'show': isShow }" @touchmove.stop.prevent="stopSlide">
			<view class="popup-overlay" @click="join"></view>
			<view class="popup-content" :class="{ 'popup-show': isShow }">
				<view class="popup-header">
					<text class="popup-title">拒绝理由</text>
					<view class="popup-close" @click="cancel">
						<text>×</text>
					</view>
				</view>

				<view class="popup-body">
					<view class="textarea-wrapper">
						<textarea
							v-model="jujuetext"
							placeholder="请输入拒绝原因"
							maxlength="100"
							placeholder-class="placeholder-text"
						/>
						<text class="char-count">{{jujuetext.length}}/100</text>
					</view>

					<view class="report-section">
						<view class="report-toggle" @click="chan">
							<view class="custom-radio" :class="{ 'checked': is_jubao }">
								<text v-if="is_jubao">✓</text>
							</view>
							<text class="report-label">举报用户</text>
						</view>

						<view class="upload-images" v-show="is_jubao">
							<view v-for="(img, i) in image" :key="i" class="upload-item">
								<image :src="img" mode="aspectFill" @click="perviewImg(i)"></image>
								<view class="remove-btn" @click="handleRemove(i)">
									<text>×</text>
								</view>
							</view>
							<view class="add-image" v-if="image.length<2" @click="chooseImg()">
								<text class="add-icon">+</text>
								<text class="add-text">上传图片</text>
							</view>
						</view>
					</view>
				</view>

				<view class="popup-footer">
					<view class="popup-btn cancel-btn" @click="cancel">取消</view>
					<view class="popup-btn submit-btn" @click="query">提交</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				image: [],
				examineList: [],
				cont: [],
				jujuetext: '',
				pid: '',
				id: '',
				isShow: false,
				stong: '',
				is_jubao: false,
				isAdopting: false,
				pageLoaded: false
			}
		},
		onLoad(event) {
			let id = event.id
			this.stong = event.type
			this.gteExamine(event.id)
		},
		onReady() {
			// 页面加载完成后触发动画
			setTimeout(() => {
				this.pageLoaded = true
			}, 100)
		},
		methods: {
			// 上传图片
			chooseImg(index) {
				uni.chooseImage({
					count: 2,
					success: (res) => {
						res.tempFilePaths.forEach((i) => {
							uni.uploadFile({
								url: this.global.url + '/index.php/api/common/upload',
								filePath: i,
								name: 'file',
								formData: {
									'upload': 'upload'
								},
								success: (resimg) => {
									let data = JSON.parse(resimg.data);
									if (data.code == 1) {
										this.image.push(data.data.fullurl);
									}
								}
							});
						});
					}
				});
			},
			// 预览图片
			perviewImg(i) {
				uni.previewImage({
					urls: this.image,
					indicator: 'number',
					loop: true
				});
			},
			// 删除图片
			handleRemove(i) {
				this.image.splice(i, 1);
			},
			chan(e) {
				this.is_jubao = !this.is_jubao;
			},
			fuzhi: function(a) {
				uni.setClipboardData({
					data: a,
					success: function() {
						uni.showToast({
							title: '复制成功',
							icon: 'none'
						})
					}
				});
			},

			// 保存图片到相册
			cuntu: function(a) {
				var that = this
				uni.downloadFile({
					url: a,
					success: (res) => {
						if (res.statusCode === 200) {
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: function() {
									uni.showToast({
										title: '保存成功',
										icon: 'none'
									})
								}
							});
						}
					}
				});
			},

			// 联系赚客
			lianzhuan: function(a) {
				uni.navigateTo({
					url: '/pages/member/duihua?id=' + a
				})
			},

			gteExamine(id) {
				this.pid = id
				uni.request({
					url: this.global.url + "/api/task/examine",
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
						orderId: id,
					},
					success: (res) => {
						this.examineList = res.data.data
						this.cont = res.data.data.content
					}
				})
			},
			//拒绝原因提交
			query() {
				let cont = this.jujuetext;
				if (cont == "") {
					uni.showToast({
						title: "拒绝内容不能为空",
						icon: "none"
					})
					return
				}
				if (this.is_jubao == 1 && this.image.length <= 0) {
					uni.showToast({
						title: "请上传图片",
						icon: "none"
					})
					return
				}
				uni.request({
					url: this.global.url + '/api/task/refuse',
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
						orderId: this.pid,
						content: cont,
						is_jubao: this.is_jubao ? 1 : 0,
						image: this.is_jubao == 1 ? this.image.join(',') : ''
					},
					success: (res) => {
						if (res.data.code == 1) {
							uni.showToast({
								title: '驳回成功',
								icon: 'success',
								duration: 2000,
							})
							setTimeout(function() {
								uni.navigateBack()
							}, 2000)
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'error',
								duration: 2000,
							})
						}
					}
				})
			},
			adoptPu() {
				// 如果正在审核，直接返回
				if (this.isAdopting) return;

				// 设置按钮为禁用状态
				this.isAdopting = true;

				uni.request({
					url: this.global.url + '/api/task/examine_adopt',
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
						orderId: this.pid
					},
					success: (res) => {
						uni.showToast({
							title: '审核成功',
							icon: 'success',
							duration: 2000,
						})

						// 返回上级页面并刷新
						setTimeout(() => {
							uni.navigateBack({
								url: "/pages/mine/rewardManagement/auditManagement?id=" + this.id
							})
						}, 2000);
					},
					complete: () => {
						// 请求完成后恢复按钮状态
						this.isAdopting = false;
					}
				})
			},
			nextMission(cc, id) {
				uni.request({
					url: this.global.url + '/api/task/examine_change',
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
						taskId: cc,
						orderId: id
					},
					success: (res) => {
						if (res.data.code == 1) {
							this.examineList = res.data.data
							this.cont = res.data.data.content
						} else {
							uni.showToast({
								title: res.data.msg
							})
						}
					}
				})
			},
			// 关闭弹窗
			join() {
				let that = this;
				that.isShow = !that.isShow;
			},
			// 取消拒绝
			cancel() {
				let that = this;
				that.isShow = !that.isShow;
			},
			// 控制遮罩层弹出
			refuse() {
				let that = this;
				that.isShow = !that.isShow;
			},
			getImgUrl(imae) {
				return this.global.url + imae;
			},
			// 图片放大
			bigImg(url) {
				uni.previewImage({
					urls: url.map(i => i = this.global.url + i),
					indicator: 'number',
					loop: true
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	// 动画关键帧
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(30rpx);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes pulse {
		0%, 100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
	}

	@keyframes shimmer {
		0% {
			background-position: -200% 0;
		}
		100% {
			background-position: 200% 0;
		}
	}

	// 页面容器
	.audit-page {
		min-height: 100vh;
		background: linear-gradient(180deg, #f0f4ff 0%, #fafbfc 100%);
		padding-bottom: 140rpx;
	}

	.content-wrapper {
		padding: 24rpx;
		opacity: 0;

		&.fade-in {
			animation: fadeIn 0.3s ease-out forwards;
		}
	}

	// 用户卡片
	.user-card {
		background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
		border-radius: 24rpx;
		padding: 32rpx;
		display: flex;
		align-items: center;
		box-shadow: 0 8rpx 32rpx rgba(0, 127, 240, 0.08);
		margin-bottom: 24rpx;
		opacity: 0;
		transform: translateY(30rpx);
		border: 1rpx solid rgba(255, 255, 255, 0.8);

		&.slide-up {
			animation: slideUp 0.5s ease-out forwards;
		}

		.user-card__avatar {
			position: relative;
			width: 120rpx;
			height: 120rpx;
			flex-shrink: 0;

			image {
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
				border: 4rpx solid #fff;
				box-shadow: 0 4rpx 16rpx rgba(0, 127, 240, 0.15);
			}

			.avatar-ring {
				position: absolute;
				top: -6rpx;
				left: -6rpx;
				right: -6rpx;
				bottom: -6rpx;
				border: 3rpx solid #017ff0;
				border-radius: 50%;
				opacity: 0.3;
				animation: pulse 2s ease-in-out infinite;
			}
		}

		.user-card__info {
			flex: 1;
			margin-left: 28rpx;

			.user-card__name {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 16rpx;

				.nickname {
					font-size: 34rpx;
					font-weight: 600;
					color: #1a1a2e;
				}

				.user-id {
					font-size: 24rpx;
					color: #017ff0;
					background: rgba(1, 127, 240, 0.1);
					padding: 6rpx 16rpx;
					border-radius: 20rpx;
				}
			}

			.user-card__time {
				.time-item {
					display: flex;
					justify-content: space-between;
					margin-bottom: 8rpx;

					.label {
						font-size: 24rpx;
						color: #8e8e93;
					}

					.value {
						font-size: 24rpx;
						color: #3a3a3c;
					}
				}
			}
		}
	}

	// 区域卡片
	.section-card {
		background: #ffffff;
		border-radius: 20rpx;
		padding: 28rpx;
		margin-bottom: 24rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
		opacity: 0;
		transform: translateY(30rpx);

		&.slide-up-delay-1 {
			animation: slideUp 0.5s ease-out 0.1s forwards;
		}

		&.slide-up-delay-2 {
			animation: slideUp 0.5s ease-out 0.2s forwards;
		}

		.section-header {
			display: flex;
			align-items: center;
			margin-bottom: 24rpx;
			padding-bottom: 20rpx;
			border-bottom: 1rpx solid #f0f0f5;

			.section-icon {
				width: 56rpx;
				height: 56rpx;
				background: linear-gradient(135deg, #017ff0 0%, #00a8ff 100%);
				border-radius: 14rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 16rpx;

				&.info-icon {
					background: linear-gradient(135deg, #34c759 0%, #30d158 100%);
				}
			}

			.section-title {
				font-size: 30rpx;
				font-weight: 600;
				color: #1a1a2e;
			}
		}
	}

	// 图片网格
	.image-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 16rpx;

		.image-item {
			position: relative;
			width: calc(33.333% - 12rpx);
			aspect-ratio: 3/4;
			border-radius: 16rpx;
			overflow: hidden;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
			transition: transform 0.3s ease, box-shadow 0.3s ease;

			&:active {
				transform: scale(0.95);
			}

			image {
				width: 100%;
				height: 100%;
			}

			.image-overlay {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background: linear-gradient(180deg, transparent 60%, rgba(0, 0, 0, 0.5) 100%);
				display: flex;
				align-items: flex-end;
				justify-content: center;
				padding-bottom: 50rpx;
				opacity: 0;
				transition: opacity 0.3s ease;

				.preview-text {
					color: #fff;
					font-size: 22rpx;
				}
			}

			&:active .image-overlay {
				opacity: 1;
			}

			.save-btn {
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				height: 60rpx;
				background: linear-gradient(135deg, #017ff0 0%, #00a8ff 100%);
				display: flex;
				align-items: center;
				justify-content: center;

				text {
					color: #fff;
					font-size: 24rpx;
					font-weight: 500;
				}
			}
		}
	}

	// 信息内容
	.info-content {
		background: #f8f9fb;
		border-radius: 16rpx;
		padding: 24rpx;
		margin-bottom: 20rpx;

		.info-text {
			font-size: 28rpx;
			color: #3a3a3c;
			line-height: 1.6;
			word-break: break-all;
		}
	}

	.copy-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 72rpx;
		background: linear-gradient(135deg, #017ff0 0%, #00a8ff 100%);
		border-radius: 36rpx;
		transition: transform 0.2s ease, box-shadow 0.2s ease;

		&:active {
			transform: scale(0.98);
			box-shadow: 0 2rpx 8rpx rgba(1, 127, 240, 0.3);
		}

		text {
			color: #fff;
			font-size: 28rpx;
			font-weight: 500;
		}
	}

	// 操作按钮
	.action-buttons {
		display: flex;
		gap: 24rpx;
		margin-top: 16rpx;
		opacity: 0;
		transform: translateY(30rpx);

		&.slide-up-delay-3 {
			animation: slideUp 0.5s ease-out 0.3s forwards;
		}

		.btn-reject, .btn-approve {
			flex: 1;
			height: 96rpx;
			border-radius: 48rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 32rpx;
			font-weight: 600;
			transition: all 0.3s ease;

			&:active {
				transform: scale(0.96);
			}
		}

		.btn-reject {
			background: #fff;
			color: #ff3b30;
			border: 2rpx solid #ff3b30;
			box-shadow: 0 4rpx 16rpx rgba(255, 59, 48, 0.1);

			&:active {
				background: #fff5f5;
			}
		}

		.btn-approve {
			background: linear-gradient(135deg, #34c759 0%, #30d158 100%);
			color: #fff;
			box-shadow: 0 8rpx 24rpx rgba(52, 199, 89, 0.3);

			&.btn-disabled {
				opacity: 0.6;
				pointer-events: none;
			}
		}
	}

	@keyframes arrowMove {
		0%, 100% {
			opacity: 0.3;
			transform: translateX(0);
		}
		50% {
			opacity: 1;
			transform: translateX(6rpx);
		}
	}

	@keyframes shine {
		0% {
			left: -100%;
		}
		100% {
			left: 100%;
		}
	}

	// 底部按钮
	.bottom-btn-wrapper {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 20rpx 24rpx;
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
		background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.9) 30%, #ffffff 100%);
	}

	.bottom-btn {
		position: relative;
		height: 100rpx;
		background: linear-gradient(135deg, #017ff0 0%, #00a8ff 50%, #017ff0 100%);
		background-size: 200% 200%;
		border-radius: 50rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow:
			0 8rpx 24rpx rgba(1, 127, 240, 0.35),
			0 2rpx 8rpx rgba(1, 127, 240, 0.2),
			inset 0 2rpx 0 rgba(255, 255, 255, 0.2);
		overflow: hidden;
		transition: all 0.3s ease;

		&:active {
			transform: scale(0.97);
			box-shadow:
				0 4rpx 16rpx rgba(1, 127, 240, 0.4),
				0 2rpx 4rpx rgba(1, 127, 240, 0.2);
		}

		.btn-content {
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 1;
		}

		.btn-text {
			color: #fff;
			font-size: 34rpx;
			font-weight: 600;
			letter-spacing: 4rpx;
			text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
		}

		.arrow-group {
			display: flex;
			align-items: center;
			margin-left: 16rpx;

			.arrow {
				color: #fff;
				font-size: 36rpx;
				font-weight: bold;
				margin-left: -8rpx;
				opacity: 0.3;
				animation: arrowMove 1.5s ease-in-out infinite;

				&.arrow-1 {
					animation-delay: 0s;
				}

				&.arrow-2 {
					animation-delay: 0.15s;
				}

				&.arrow-3 {
					animation-delay: 0.3s;
				}
			}
		}

		.btn-shine {
			position: absolute;
			top: 0;
			left: -100%;
			width: 60%;
			height: 100%;
			background: linear-gradient(
				90deg,
				rgba(255, 255, 255, 0) 0%,
				rgba(255, 255, 255, 0.3) 50%,
				rgba(255, 255, 255, 0) 100%
			);
			transform: skewX(-20deg);
			animation: shine 3s ease-in-out infinite;
		}
	}

	// 弹窗样式
	.popup-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		visibility: hidden;

		&.show {
			visibility: visible;
		}

		.popup-overlay {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0);
			transition: background 0.3s ease;
		}

		&.show .popup-overlay {
			background: rgba(0, 0, 0, 0.5);
		}
	}

	.popup-content {
		position: fixed;
		left: 5%;
		right: 5%;
		top: 50%;
		transform: translateY(-50%) scale(0.9);
		background: #fff;
		border-radius: 28rpx;
		z-index: 1000;
		overflow: hidden;
		opacity: 0;
		transition: all 0.3s ease;

		&.popup-show {
			opacity: 1;
			transform: translateY(-50%) scale(1);
		}
	}

	.popup-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 32rpx;
		border-bottom: 1rpx solid #f0f0f5;

		.popup-title {
			font-size: 34rpx;
			font-weight: 600;
			color: #1a1a2e;
		}

		.popup-close {
			width: 56rpx;
			height: 56rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			background: #f5f5f7;
			transition: background 0.2s ease;

			text {
				font-size: 40rpx;
				color: #8e8e93;
				line-height: 1;
			}

			&:active {
				background: #e5e5ea;
			}
		}
	}

	.popup-body {
		padding: 32rpx;

		.textarea-wrapper {
			position: relative;
			background: #f8f9fb;
			border-radius: 16rpx;
			padding: 20rpx;
			margin-bottom: 28rpx;

			textarea {
				width: 100%;
				height: 180rpx;
				font-size: 28rpx;
				color: #1a1a2e;
				background: transparent;
			}

			.placeholder-text {
				color: #c7c7cc;
			}

			.char-count {
				position: absolute;
				right: 20rpx;
				bottom: 20rpx;
				font-size: 24rpx;
				color: #c7c7cc;
			}
		}
	}

	.report-section {
		.report-toggle {
			display: flex;
			align-items: center;
			padding: 16rpx 0;

			.custom-radio {
				width: 44rpx;
				height: 44rpx;
				border: 3rpx solid #d1d1d6;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 16rpx;
				transition: all 0.2s ease;

				&.checked {
					background: linear-gradient(135deg, #017ff0 0%, #00a8ff 100%);
					border-color: #017ff0;
				}

				text {
					color: #fff;
					font-size: 28rpx;
					font-weight: bold;
				}
			}

			.report-label {
				font-size: 28rpx;
				color: #1a1a2e;
			}
		}

		.upload-images {
			display: flex;
			gap: 16rpx;
			margin-top: 20rpx;
			padding: 20rpx;
			background: #f8f9fb;
			border-radius: 16rpx;

			.upload-item {
				position: relative;
				width: 160rpx;
				height: 160rpx;
				border-radius: 12rpx;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}

				.remove-btn {
					position: absolute;
					top: -10rpx;
					right: -10rpx;
					width: 44rpx;
					height: 44rpx;
					background: #ff3b30;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					box-shadow: 0 4rpx 12rpx rgba(255, 59, 48, 0.3);

					text {
						color: #fff;
						font-size: 32rpx;
						line-height: 1;
					}
				}
			}

			.add-image {
				width: 160rpx;
				height: 160rpx;
				border: 2rpx dashed #d1d1d6;
				border-radius: 12rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				transition: all 0.2s ease;

				&:active {
					border-color: #017ff0;
					background: rgba(1, 127, 240, 0.05);
				}

				.add-icon {
					font-size: 56rpx;
					color: #c7c7cc;
					line-height: 1;
				}

				.add-text {
					font-size: 22rpx;
					color: #8e8e93;
					margin-top: 8rpx;
				}
			}
		}
	}

	.popup-footer {
		display: flex;
		border-top: 1rpx solid #f0f0f5;

		.popup-btn {
			flex: 1;
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 32rpx;
			font-weight: 500;
			transition: background 0.2s ease;

			&:active {
				background: #f5f5f7;
			}
		}

		.cancel-btn {
			color: #8e8e93;
			border-right: 1rpx solid #f0f0f5;
		}

		.submit-btn {
			color: #017ff0;
		}
	}
</style>
