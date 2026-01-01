<template>
	<view class="relative">
		<view class="flex items-center" v-if="type === 'password'">
			<u-input :value="value" @input="input" v-if="!bit" type="password" maxlength="18" border="none"
				:placeholder="placeholder" :color="color"></u-input>
			<u-input :value="value" @input="input" v-if="bit" type="text" maxlength="18" border="none"
				:placeholder="placeholder" :color="color"></u-input>
			<view v-if="value" class="password-hide flex justify-center items-center flex-shrink-0"
				:class="{'password-show':!bit}" @click="shows">
				<uni-icons type="eye" color="#87c3ff" size="22"></uni-icons>
			</view>
			<view v-if="value" class="password-hide flex justify-center items-center flex-shrink-0"
				:class="{'password-show':bit}" @click="shows">
				<uni-icons type="eye-filled" color="#87c3ff" size="22"></uni-icons>
			</view>
		</view>
		<view class="" v-else>
			<u-input :value="value" @input="input" :type="type" maxlength="14" border="none" :placeholder="placeholder"
				:color="color"></u-input>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			type: {
				type: String,
				default: 'text'
			},
			placeholder: {
				type: String,
				default: '请填写信息'
			},
			color: {
				type: String,
				default: '#333'
			},
			value: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				bit: false,
			}
		},
		methods: {
			shows() {
				this.bit = !this.bit
			},
			input(e) {
				this.$emit('input', e)
			}
		}
	}
</script>

<style lang="scss">
	.password-hide {
		position: absolute;
		right: 25px;
		opacity: 0;
		visibility: hidden;
		transition: 0.3s;
	}


	.password-show {
		opacity: 1;
		visibility: visible;
		transition: 0.3s;
	}
</style>