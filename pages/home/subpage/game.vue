<template>
	<view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				wv: null,
			}
		},
		onLoad() {
			let that = this;
			// #ifdef APP-PLUS
			var wv = plus.webview.create('', "dy");
			wv.loadURL(
				uni.getStorageSync('weburl')
			)
			wv.addEventListener("loaded", (function() {
				wv.appendJsFile('_www/hybrid/html/duoliang.js');
			}));
			wv.show();
			this.$mp.page.$getAppWebview().append(wv);
			this.wv = wv;
			// #endif
		}
	}
</script>

<style>

</style>
