<template>
	<view>
		<lyg-popup @popupState="popupState" title="服务协议" protocolPath='/pages/home/login/service'
			         policyPath='/pages/home/login/privacy' policyStorageKey="has_read_privacy"></lyg-popup>
	</view>
</template>

<script>
	import lyg_popup from '@/components/lyg-popup/lyg-popup.vue';
	export default {
		components: {
            lyg_popup
        },
		data() {
			return {
				
			}
		},
		onLoad() {
		},
		methods: {
			popupState(state) {
				console.log(state);
			},
		}
	}
</script>

<style>

</style>
