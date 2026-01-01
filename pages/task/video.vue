<template>
	<view class="video">
		<video class="video" autoplay :src="videoUrl"></video>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				videoUrl: ''
			}
		},
		onLoad() {
			this.getVideo()
		},
		methods: {
			// 做单视频
			getVideo() {
				uni.request({
					url: this.global.url + '/api/task/video',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						uni.setNavigationBarTitle({
							title: res.data.data[0].name
						})
						this.videoUrl = this.global.url + res.data.data[0].video_url
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.video {
		width: 100%;
		height: 100vh;
	}
</style>
