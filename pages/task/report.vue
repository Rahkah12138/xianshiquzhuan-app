<template>
	<view class="report-container">
		<view class="form-group animated-item">
			<text class="label">任务编号</text>
			<input type="text" v-model="taskId" placeholder="请输入任务编号" class="input-field" />
		</view>
		<view class="form-group animated-item">
			<text class="label">举报理由</text>
			<view class="textarea-wrapper">
				<textarea v-model="content" placeholder="请输入举报理由" maxlength="200" class="textarea-field" />
				<text class="char-counter">{{content.length}}/200</text>
			</view>
		</view>
		<view class="form-group animated-item">
			<text class="label">截图（{{imgArr.length}}/6）</text>
			<view class="image-uploader">
				<block v-for="(a,i) in imgArr" :key="i">
					<view class="image-wrapper">
						<image class="uploaded-image" :src="a" mode="aspectFill" @click="perviewImg"></image>
					</view>
				</block>
				<view v-if="imgArr.length<6" class="upload-box" @click="chooseImg">
					<image src="/static/user/add.png" class="add-icon"></image>
					<text>上传图片</text>
				</view>
			</view>
		</view>
		<view class="submit-btn-container animated-item">
			<button class="submit-btn" @click="setComplain">提交举报</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				taskId: '', // 任务编号
				imgArr: [], // 举报图片
				content: '' ,// 举报理由
				order_id:'',
			}
		},
		onLoad(option) {
			let that = this;
			that.taskId = option.id;
			that.order_id = option.order_id;
		},
		methods: {
			// 预览图片
			perviewImg() {
				let that = this;
				uni.previewImage({
					urls: that.imgArr,
					indicator: 'number',
					loop: true
				});
			},
			// 上传图片
			chooseImg() {
				let that = this;
				uni.chooseImage({
					count: 6,
					success: (res) => {
						res.tempFilePaths.forEach((i) => {
							uni.uploadFile({
								url: that.global.url + '/index.php/api/common/upload',
								filePath: i,
								name: 'file',
								formData: {
									'upload': 'upload'
								},
								success: (resimg) => {
									let data = JSON.parse(resimg.data);
									if (data.code == 1) {
										that.imgArr.push(data.data.fullurl);
									}
								}
							});
						});
					}
				});
			},
			// 提交举报
			setComplain() {
				let that = this;
				if (that.taskId == '') {
					uni.showToast({
						title: '请输入任务编号',
						icon: 'none'
					});
				} else if (that.content == '') {
					uni.showToast({
						title: '请输入举报理由',
						icon: 'none'
					});
				} else if (that.imgArr.length == 0) {
					uni.showToast({
						title: '请上传举报截图',
						icon: 'none'
					});
				} else {
					uni.request({
						url: that.global.url + '/api/User/complain',
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							order_id:that.order_id,
							content: that.content,
							tasklist_id: that.taskId,
							token: uni.getStorageSync('token').token,
							image: that.imgArr.map(i => i.replace(that.global.url, ''))
						},
						success: (res) => {
							console.log(res)
							if (res.data.code == 1) {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								});
								setTimeout(function(){
									
									uni.navigateBack();
								},2000)
							}else{
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								});
								
							}
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animated-item {
		animation: fadeIn 0.5s ease-out forwards;
	}

	.report-container {
		background-color: #f5f5f5;
		min-height: 100vh;
		padding: 30rpx;
	}

	.form-group {
		background-color: #ffffff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
	}

	.label {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
		display: block;
	}

	.input-field {
		width: 100%;
		height: 80rpx;
		background-color: #f5f5f5;
		border-radius: 10rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
	}

	.textarea-wrapper {
		position: relative;
	}

	.textarea-field {
		width: 100%;
		height: 300rpx;
		background-color: #f5f5f5;
		border-radius: 10rpx;
		padding: 20rpx;
		font-size: 28rpx;
	}

	.char-counter {
		position: absolute;
		bottom: 20rpx;
		right: 20rpx;
		color: #999;
		font-size: 24rpx;
	}

	.image-uploader {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180rpx, 1fr));
		gap: 20rpx;
	}

	.image-wrapper {
		width: 100%;
		padding-top: 100%;
		position: relative;
	}

	.uploaded-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
	}

	.upload-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 180rpx;
		height: 180rpx;
		background-color: #f5f5f5;
		border: 2rpx dashed #ccc;
		border-radius: 10rpx;
		color: #999;
	}

	.add-icon {
		width: 60rpx;
		height: 60rpx;
		margin-bottom: 10rpx;
	}

	.submit-btn-container {
		margin-top: 50rpx;
	}

	.submit-btn {
		background: linear-gradient(135deg, #E63946, #FC5C7D);
		color: #ffffff;
		border-radius: 50rpx;
		font-size: 32rpx;
		box-shadow: 0 10px 20px rgba(230, 57, 70, 0.3);
	}
</style>
