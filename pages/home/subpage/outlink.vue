<template>
	<view>
		<iframe class="list" :src="workList"></iframe>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				workList: ''
			}
		},
		onLoad() {
			this.getlist();
		},
		methods: {
			getlist() {
				uni.request({
					url: this.global.url + '/api/user/makeMoney',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						this.workList = res.data;
					}
				})
			}
		}
	}
</script>

<style>
	.list {
		width: 100%;
		height: 100vh;
		border: none;
	}
</style>
