import Vue from 'vue'
import App from './App'

// 引入全局缺省页
import MyDefaultPage from 'components/my-default-page.vue';
import './uni.promisify.adaptor'

// 注册全局缺省页组件
Vue.component('blackPage', MyDefaultPage)

Vue.config.productionTip = false

// 公共域名挂载原型链
Vue.prototype.global = {
	is_READ_PHONE_STATE: true,
	url: '' // 请配置您的API地址
}

// 标记SDK是否已初始化
Vue.prototype.$sdkInitialized = false

// 延迟初始化SDK的方法（需要在用户同意隐私政策后调用）
Vue.prototype.$initSDK = function() {
	if (Vue.prototype.$sdkInitialized) {
		return Promise.resolve()
	}

	return new Promise((resolve) => {
		const RongIMLib = require('@/api/RongIMLib-3.0.4-dev.js');
		var config = {
			appkey: '', // 请配置您的融云IM appkey
		};
		Vue.prototype.$im = RongIMLib.init(config)
		Vue.prototype.$RongIMLib = RongIMLib
		Vue.prototype.$sdkInitialized = true
		console.log('SDK初始化完成')
		resolve()
	})
}

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
