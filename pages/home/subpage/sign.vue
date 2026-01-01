<template>
	<view style="background: #FAE04D;">
		<view class="sign">
			<image src="/static/sign/signb1.png" mode="widthFix"></image>
		</view>
		<view class="clander">
			<view class="back">
				<view>您已连续签到<text class="check">{{detail.lianxu}}</text>天</view>
			</view>
			<!-- 签到表 -->
			<view class="signtab">
				<view class="tabtop">
					<text>{{localDate}}</text>
					<text>今日已有
						<text class="check">{{detail.length}}</text>
						人签到</text>
				</view>
				<view class="weeli">
					<view :style="'color: #'+(index==i?'000':'')" v-for="(week,i) in weeks" :key="i">{{week}}</view>
				</view>
				<view class="dayli">
					<view :style="'color: #'+(day.date==''?'F0AD01':'')" v-for="(day,index) in dayArr" :key="index">
						<view :class="['days',day.flag?'choose':'']">{{day.day}}</view>
					</view>
				</view>
			</view>
			<!-- 签到按钮 -->
			<view class="sbtn" @click="setSign">
				
				<image src="/static/sign/btn.png" mode="widthFix"></image>
					<view class="img_word">
						<image class="img_wordImg" src="/static/sign/gif.png" mode="widthFix"></image>
						<text class='img_worda'>签到抽好礼</text>
					</view>
			
			</view>
			<!-- 规则说明 -->
			<view class="rule">
				<view class="rule-title">规则说明</view>
				<view class="rule-back">
					<view class="rule-tr" v-for="(a,i) in ruleArr" :key="i">
						<view class="rule-td"  v-html="a"></view>
					</view>
				</view>
			</view>
		</view>
		<!-- 弹窗提示 -->
		<view v-show="isJoin" @touchmove.stop.prevent="stopSlide">
			<!-- 遮罩层 -->
			<view class="mask" @click="isJoin=false"></view>
			<!-- 内容区 -->
			<view class="tip-content">
				<image src="/static/sign/mask.png" mode="widthFix" class="tip_img"></image>
				<view class="tip_conWorn">
					<view class="tip1">签到成功奖励已到账</view>
					<view class="tip2">{{price}}元</view>
					<view class="tip3" @click="isJoin=false">我知道了</view>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detail: {}, // 数据
				dayArr: [], // 每天
				price: 0, // 奖励金
				index: 0, // 周天下标
				isJoin: false, // 是否弹窗
				localDate: '', // 今天年月日
				date: new Date(), // 系统日期
				weeks: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // 周天
				ruleArr: [], // 规则
			}
		},
		onLoad() {
			this.index = this.date.getDay()
			this.initDate(this.date.getFullYear(), this.date.getMonth())
			this.getSignInfo()
		},
		methods: {
			// 获取签到天数
			getSignInfo() {
				uni.request({
					url: this.global.url + '/api/user/getSignInfo',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						if (res.data.code == 1) {
							this.detail = res.data.data.data
							// 获取历史签到
							if(this.detail!="sign empty"){
								let abs = this.detail.map(i => parseInt(i.sign_time.substring(8, 10)))
								this.detail.data = abs.sort((a, b) => a - b)
							}
							
							// 从小到大排序
							
							
							// 使用正则替换全文指定字符串
							// let str = res.data.data.explain.replace(new RegExp('<p>', 'g'), '');
							// // 使用分割方法转为数组
							// let arr = str.split('</p>')
							// // 过滤多余字符并赋值
							// this.ruleArr = arr.slice(0, arr.length - 1);
							this.ruleArr = res.data.data.explain.split('</div>');
							let pops = this.ruleArr.pop();
							let arr = []
						  this.ruleArr.forEach((item,index) =>{
								if(index >=0 ){
									let it = item+'</div>';
									
								  arr.push(it)
								}
							});
							this.ruleArr = arr
							// 显示已签到记录
							for (let i in this.dayArr) {
								this.dayArr[i].flag = false
								for (let j in this.detail.data) {
									if (this.detail.data[j] == this.dayArr[i].day && this.dayArr[i].date !=
										'') {
										this.dayArr[i].flag = true
									}
								}
							}
						}
					}
				})
			},
			// 今日签到
			setSign() {
				uni.request({
					url: this.global.url + '/api/user/sign',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						if (res.data.code == 1) {
							this.isJoin = true
							this.price = res.data.msg.reward
							this.getSignInfo()
						} else {
							
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})
			},
			// 日期时间的格式化
			formatNum(num) {
				return num < 10 ? '0' + num : num + ''
			},
			// 初始化日期
			initDate(year, month) {
				let localYear = this.date.getFullYear() //当前年
				let localMonth = this.date.getMonth() + 1 //当前月
				let day = this.date.getDate() //当前日
				this.dayArr = [] // 先清除本月每日的数组
				// 今天的日期
				this.localDate = this.formatNum(localYear) + '/' + this.formatNum(localMonth) + '/' + this.formatNum(day)
				let totalDay = new Date(year, month + 1, 0).getDate() // 当前月的总天数
				let weekValue = '' // 补充日期
				// 遍历总天数将需要的数据逐个添加至数组
				for (let i = 1; i <= totalDay; i++) {
					let obj = {
						date: this.formatNum(year) + '/' + this.formatNum(month + 1) + '/' + this.formatNum(i),
						day: i
					}
					// 得到需补充天数
					weekValue = (new Date(year, month, i)).getDay()
					// 补充前面空白日期
					if (i == 1 && weekValue != 0) {
						this.addBeforeValue(weekValue, year, month)
					}
					// 补充本月日期
					this.dayArr.push(obj)
					// 补充后面空白日期
					if (i == totalDay && weekValue != 6) {
						this.addAfterValue(weekValue, year, month)
					}
				}
			},
			// 补充前面空白日期
			addBeforeValue(weekValue, year, month) {
				let totalDay = new Date(year, month, 0).getDate()
				for (let i = 0; i < weekValue; i++) {
					let obj = {
						date: '',
						day: ''
					}
					obj.day = totalDay - (weekValue - i) + 1
					this.dayArr.push(obj)
				}
			},
			// 补充后空白日期
			addAfterValue(weekValue, year, month) {
				let totalDay = new Date(year, month, 0).getDate()
				for (let i = 0; i < (6 - weekValue); i++) {
					let obj = {
						date: '',
						day: ''
					}
					obj.day = i + 1
					this.dayArr.push(obj)
				}
			},
			//禁止页面滚动(规避警告)
			stopSlide() {
				return
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tabtop,
	.weeli,
	.dayli {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.sign {
		width: 100%;
		height: 70vh;
		image{
			width: 100%;
			height: 100%;
		}
	}

	.clander {
		width: 696rpx;
		margin: 0 auto;
		position: relative;
		top: -150rpx;
	}

	.back {
		color: #85483A;
		font-size: 30rpx;
		border-radius: 40rpx;
		padding: 45rpx 0 80rpx 30rpx;
		background-image: linear-gradient(#FAE04D,#FAE04D);
	}

	.check {
		color: #F91007;
	}

	.signtab {
		width: 696rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 40rpx 20rpx;
		box-sizing: border-box;
		box-shadow: 0 0 24rpx 0 rgba(243, 161, 3, 0.91) inset;
		position: relative;
		top: -40rpx;
	}

	.tabtop {
		color: #85483A;
		font-size: 26rpx;
		padding: 0 20rpx;
	}

	.weeli {
		color: #666666;
		font-size: 26rpx;

		&>view {
			width: 14.285%;
			text-align: center;
			margin: 40rpx 0 30rpx 0;
		}
	}

	.dayli {
		flex-wrap: wrap;
		font-size: 26rpx;

		&>view {
			height: 94rpx;
			width: 14.285%;
			text-align: center;
			line-height: 94rpx;
		}

		.days {
			width: 50rpx;
			height: 50rpx;
			margin: 22rpx auto;
			line-height: 50rpx;
			text-align: center;
			border-radius: 50%;
		}
	}

	.choose {
		color: #FFFFFF;
		background: #F9B33B;
	}

	.sbtn {
		width: 567rpx;
		height: 94rpx;
		color: #FFFFFF;
		font-size: 36rpx;
		align-items: center;
		border-radius: 44rpx;
		justify-content: center;
		margin: 30rpx auto 50rpx auto;
		position: relative;
	  image{
			width: 100%;
			height: 100%;
			position: relative;
		}
		.img_word{
			// width: 100%;
			height: 50rpx;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			display: flex;
			.img_wordImg{
				width: 50rpx;
				height: 50rpx;
			}
			.img_worda{
				line-height: 50rpx;
				text-align: center;
				margin-left: 20rpx;
			}
		}
	}


	.rule-title:before,
	.rule-title:after {
		content: '';
		width: 20rpx;
		height: 2px;
		background: #E9A106;
		/*1.首先使伪类显示方式为块级元素*/
		display: block;
		/*2.通过相对定位的方式控制两侧内容的位置*/
		position: relative;
	}

	/*3.控制左侧横线的位置*/
	.rule-title:before {
		top: 26rpx;
		left: 240rpx;
	}

	/*4.控制右侧横线的位置*/
	.rule-title:after {
		top: -25rpx;
		right: -435rpx;
	}

	.rule {
		color: #85483A;
		&-title {
			font-size: 36rpx;
			text-align: center;
			margin-bottom: 15rpx;
		}

		&-back {
			width: 100%;
			padding: 30rpx;
			background: #FDCC63;
			border-radius: 20rpx;
			box-sizing: border-box;
		}

		&-tr {
			display: flex;
			margin: 30rpx 0;
			font-size: 23rpx;
		}

		&-td {
			height: 36rpx;
			line-height: 36rpx;
			text-align: center;
			margin-right: 25rpx;
		}
	}

	/* 弹窗提示 */
	.mask {
		z-index: 99;
		background: rgba(0, 0, 0, 0.4);
		position: fixed;
		bottom: 0;
		right: 0;
		left: 0;
		top: 0;
	}

	.tip-content {
		z-index: 999;
		width: 476rpx;
		height: 552rpx;
		text-align: center;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		.tip_img{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
		.tip_conWorn{
			position: absolute;
			top: 0;
			left: 50%;
			z-index: 9;
			transform: translateX(-50%);
			.tip1 {
				color: #FFFFFF;
				font-size: 32rpx;
				margin: 300rpx 0 10rpx 0;
			}
			
			.tip2 {
				font-size: 34rpx;
				color: #FED523;
			}
			
			.tip3 {
				width: 380rpx;
				font-size: 30rpx;
				padding: 15rpx 0;
				margin: 40rpx auto;
				background: #FFCD2F;
				border-radius: 40rpx;
			}
		}
	}

	
</style>
