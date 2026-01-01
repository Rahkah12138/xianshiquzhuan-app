<template>
	<view>
		<view v-if="value" @click="open">{{value}}</view>
		<view v-else style="color: #aaaaaa;" @click="open">{{placeholder}}</view>
		<uni-popup ref="popup" background-color="#ffffff">
			<view style="border: 1rpx dotted #cccccc;border-radius: 10px;margin: 10rpx;width: 96%;">
				<icon style="vertical-align:middle;margin: 0 10rpx;" type="search" size="26"/>
				<input :auto-blur="true" style="display: inline-block;height: 80rpx; line-height: 80rpx;vertical-align:middle;margin-left: 20rpx;width: 60%;" 
				placeholder="搜索" @input="inputValue" :value="inputTxt">
				<button type="primary" style="width: 20%;float: right;" @click="setValue">确定</button>
			</view>
			<picker-view indicator-style="height: 70rpx;" @change="itemChange"  :value="index">
			    <picker-view-column>
			        <view class="item" v-for="(item, idx) in options" :key="idx">{{node == null ? item : item[node]}}</view>
			    </picker-view-column>
			</picker-view>
		</uni-popup>
	</view>
</template>

<script>
	/**
	 * 
	 */
	export default {
		name: 'pickerSelect',
		props: {
			/**
			 * 要列举的集合,可以传递对象集合
			 * @property {必填} 
			 */
			list: {
				type: Array,
				default: () => []
			},
			/**
			 * 如果集合中的每一组都是对象,则指定对象中的某个节点属性
			 */
			node: {
				type: String,
				default: null
			},
			placeholder: {
				type: String,
				default: () => "请选择"
			},
			/**
			 * 传过来的文本
			 */
			valueTxt: {
				type: String,
				default: null
			},
			/**
			 * 是否可自定义结果值
			 */
			custom: {
				type: Boolean,
				default: false
			}
		},
		watch: {
		    list (newValue, oldValue) {
				this.list = newValue;
				this.options = newValue;
		    },
			valueTxt(newValue, oldValue) {
				console.log(newValue, oldValue)
				this.value = newValue;
			}
		},
		created() {
			this.options = this.list;
		},
		data() {
		    return {
				index: [0],
				inputTxt: "",
				value: this.valueTxt,
				options: []
		    }
		},
		model: {
			prop: 'valueTxt',
			event: 'valueChange' 
		},
		methods: {
			open() {
				this.$refs.popup.open("bottom")
			},
			itemChange(e) {
				this.index = e.detail.value
				// this.setValue(e.detail.value)
			},
			inputValue(e) {
				this.inputTxt = e.detail.value;
				this.index = [0];
				if (this.inputTxt == "") {
					this.options = this.list;
					return;
				}
				this.options = this.list.filter(o => {
					o = this.node == null ? o : o[this.node];
					return String(o).indexOf(e.detail.value) >= 0
				})
				// this.setValue(0)
			},
			setValue() {
				if (this.index[0] <= 0 && this.options.length <= 0 && this.custom) {
					this.value = this.inputTxt;
				} else {
					this.value = null == this.node ? this.options[this.index[0]] : this.options[this.index[0]][this.node]
				}
				this.$emit('valueChange', this.value);
				this.$emit('change', this.options[this.index[0]]);
				this.$refs.popup.close();
			}
		}
	};
</script>

<style>
	uni-popup {
		/* height: 400rpx; */
	}
	picker-view{
		height: 500rpx;
	}
	picker-view .item{
		height: 70rpx;
		line-height: 70rpx;
		align-items: center;
		justify-content: center;
		text-align: center;
		display: block;
	}
</style>