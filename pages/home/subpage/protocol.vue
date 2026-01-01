<template>
	<view v-html="text">
	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				text: '', // 内容
			}
		},
		onShow() {
			this.getUserBuild()
		},
		methods: {
			getUserBuild() {
				uni.request({
					url: this.global.url + '/api/user/build',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						if (res.data.code == 1) {
							this.text = res.data.data.reward;
							
						}
					}
				})
			},
		}
	}
</script>

<style scoped>

</style>
