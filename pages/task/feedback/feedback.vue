<template>
	<view>
		<view class="task">
			<text class="title">任务编号</text>
			<input type="text" v-model="tasklist_id" placeholder="请输入任务编号" />
		</view>
		<view class="cont">
			<text class="title">举报理由</text>
			<textarea v-model="content" placeholder="请输入举报理由" maxlength="200" />
			<text class="wen">{{content.length}}/200</text>
		</view>
		<view class="cont">
			<text class="title">截图（{{imgArr.length}}/6）</text>
			<view class="cans">
				<block v-for="(a,i) in imgArr" :key="i">
					<image class="imgs" :src="a" mode="aspectFill" @click="perviewImg"></image>
				</block>
				<view v-if="imgArr.length<6" class="imgs" @click="chooseImg">
					<image src="/static/user/add.png" mode="widthFix"></image>
					<view>上传图片</view>
				</view>
			</view>
			<view class="btn" @click="setComplain">提交反馈</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tasklist_id: '', // 任务编号
				imgArr: [], // 举报图片
				content: '' ,// 举报理由
				type:'',
				id:''
			}
		},
		onLoad(option) {
			let that = this;
			that.tasklist_id = option.tasklist_id;
			that.type = option.type;
			that.id= option.id
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
						url: that.global.url + '/api/user/complaint_details',
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							content: that.content,
							id:that.id,
							token: uni.getStorageSync('token').token,
							images: that.imgArr.map(i => i.replace(that.global.url, '')),
							type:that.type
						},
						success: (res) => {
							if (res.data.code == 1) {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								});
								uni.navigateBack();
							}
						}
					})
				}
			}
		}
	}
</script>

<style scoped>
	.task {
		display: flex;
		margin: 30rpx 0;
		background: #FFFFFF;
		align-items: center;
		padding: 27rpx 30rpx;
	}

	.title {
		color: #666666;
		font-size: 28rpx;
	}

	.task>input {
		color: #999999;
		font-size: 24rpx;
		margin-left: 70rpx;
	}

	.cont {
		width: 692rpx;
		margin: 0 auto;
		position: relative;
	}

	.cont>textarea {
		width: 652rpx;
		padding: 20rpx;
		height: 460rpx;
		color: #999999;
		font-size: 24rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		margin: 20rpx 0 30rpx 0;
	}

	.wen {
		color: #999999;
		font-size: 24rpx;
		position: absolute;
		bottom: 15rpx;
		right: 30rpx;
	}

	.cans {
		margin: 0 auto 50rpx auto;
	}

	.imgs {
		width: 200rpx;
		color: #666666;
		height: 200rpx;
		margin-top: 40rpx;
		font-size: 24rpx;
		line-height: 50rpx;
		text-align: center;
		background: #FFFFFF;
		vertical-align: top;
		display: inline-block;
	}

	.imgs:nth-child(3n+2) {
		margin: 40rpx 45rpx 0 45rpx;
	}

	.imgs>image {
		width: 65rpx;
		height: 56rpx;
		margin-top: 25%;
	}

	.btn {
		width: 410rpx;
		height: 70rpx;
		margin: 0 auto;
		color: #FFFFFF;
		font-size: 24rpx;
		line-height: 70rpx;
		text-align: center;
		background: #017ff0;
		border-radius: 40rpx;
	}
</style>
