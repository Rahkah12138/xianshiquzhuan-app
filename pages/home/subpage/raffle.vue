<template>
	<view class="page">
		<image class="topback" src="/static/gift/gifbac.png" mode="widthFix"></image>
		<view class="container-out">
			<view class="circle" v-for="(item,index) in circleList" :key="index"
				:style="{'top':item.topCircle+'rpx','left':item.leftCircle+'rpx','background': (index%2==0)?colorCircleFirst:colorCircleSecond}">
			</view>
			<view class="container-in">
				<view class="content-out" v-for="(item,index) in awardList" :key="index"
					:style="{'top':item.topAward+'rpx','left':item.leftAward+'rpx','background': (index==indexSelect)?colorAwardSelect:colorAwardDefault}">
					<image class="award-image" :src="item.imageAward" mode="widthFix"></image>
					<text>{{item.textAward}}</text>
				</view>
				<view class="start-btn" @click="getGoLottery">
					<text>立即</text>
					<text>抽奖</text>
				</view>
			</view>
		</view>
		<!-- 规则 -->
		<view class="rule">
			<view>规则</view>
			<view>1.抽奖时间：项目结束后第二天上午8点自动执行 (如：项目15日结束，17日开奖；项目延期 则自动顺延)</view>
			<view>2.抽奖规则：根据抽奖档位认筹人数确定奖品份数 X</view>
			<view>满 N 人抽 1 个</view>
			<view>没满 N 人 自动递进</view>
			<view>3.抽奖算法</view>
		</view>
		<!-- 弹窗提示 -->
		<view v-show="isJoin" @touchmove.stop.prevent="stopSlide">
			<!-- 遮罩层 -->
			<view class="mask" @click="isJoin=false"></view>
			<!-- 内容区 -->
			<view class="tip">
				<view class="thank">
					<view>{{prizeObj.status==1?prizeObj.name:'恭喜你!'}}</view>
					<view>{{prizeObj.status==1?'很遗憾，未中奖':'恭喜你'}}</view>
					<view>{{prizeObj.status==1?'再试一次吧！':'抽中'+prizeObj.name}}</view>
				</view>
				<image class="del" src="/static/gift/del.png" mode="widthFix" @click="isJoin=false"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				prizeObj: {}, //抽奖结果
				awardList: [], //奖品数组
				circleList: [], //圆点数组
				textAward: [], //奖品文字数组
				imageAward: [], //奖品图片数组
				isJoin: false, // 抽奖弹窗显隐
				isRunning: false, //是否正在抽奖
				indexSelect: 0, //被选中的奖品index
				colorCircleFirst: '#FFDA46', //圆点颜色1
				colorCircleSecond: '#F34512', //圆点颜色2
				colorAwardDefault: '#FFF2EC', //奖品默认颜色
				colorAwardSelect: '', //奖品选中颜色
			};
		},
		//监听按钮触发
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url: '/pages/home/subpage/record'
			})
		},
		onLoad() {
			let that = this;
			that.getActivityList();
		},
		methods: {
			//加载抽奖转盘
			waitload() {
				let that = this;
				//圆点设置
				let leftCircle = 7.5;
				let topCircle = 7.5;
				let circleList = [];
				for (let i = 0; i < 24; i++) {
					if (i == 0) {
						topCircle = 15;
						leftCircle = 15;
					} else if (i < 6) {
						topCircle = 7.5;
						leftCircle = leftCircle + 102.5;
					} else if (i == 6) {
						topCircle = 15;
						leftCircle = 620;
					} else if (i < 12) {
						topCircle = topCircle + 94;
						leftCircle = 620;
					} else if (i == 12) {
						topCircle = 565;
						leftCircle = 620;
					} else if (i < 18) {
						topCircle = 570;
						leftCircle = leftCircle - 102.5;
					} else if (i == 18) {
						topCircle = 565;
						leftCircle = 15;
					} else if (i < 24) {
						topCircle = topCircle - 94;
						leftCircle = 7.5;
					} else {
						return;
					}
					circleList.push({
						topCircle: topCircle,
						leftCircle: leftCircle
					});
				}
				this.circleList = circleList;
				//圆点闪烁
				setInterval(() => {
					if (that.colorCircleFirst == '#FFDA46') {
						that.colorCircleFirst = '#F34512';
						that.colorCircleSecond = '#FFDA46';
					} else {
						that.colorCircleFirst = '#FFDA46';
						that.colorCircleSecond = '#F34512';
					}
				}, 500);
				//奖品item设置
				let awardList = [];
				//间距,怎么顺眼怎么设置吧.
				let topAward = 25;
				let leftAward = 25;
				for (let j = 0; j < 8; j++) {
					if (j == 0) {
						topAward = 25;
						leftAward = 25;
					} else if (j < 3) {
						topAward = topAward;
						//166.6666是宽.15是间距.下同
						leftAward = leftAward + 166.6666 + 15;
					} else if (j < 5) {
						leftAward = leftAward;
						//150是高,15是间距,下同
						topAward = topAward + 150 + 15;
					} else if (j < 7) {
						leftAward = leftAward - 166.6666 - 15;
						topAward = topAward;
					} else if (j < 8) {
						leftAward = leftAward;
						topAward = topAward - 150 - 15;
					}
					let textAward = this.textAward[j];
					let imageAward = this.imageAward[j];
					awardList.push({
						topAward: topAward,
						leftAward: leftAward,
						textAward: textAward,
						imageAward: imageAward
					});
				}
				this.awardList = awardList;
			},
			//奖品列表
			getActivityList() {
				let that = this;
				uni.request({
					url: that.global.url + '/api/Activity/ActivityList',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success: (res) => {
						if (res.data.code == 1) {
							let gifArr = res.data.data;
							that.textAward = gifArr.map(i => i.name);
							console.log(that.textAward)
							that.imageAward = gifArr.map(i => i.image = that.global.url + i.image);
							that.waitload();
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							});
						}
					}
				});
			},
			//中奖结果
			getGoLottery() {
				let that = this;
				if (that.isRunning) {
					return;
				} else {
					uni.request({
						url: that.global.url + '/api/Activity/goLottery',
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							token: uni.getStorageSync('token').token
						},
						success: (res) => {
							if (res.data.code == 1) {
								that.prizeObj = res.data.data;
								that.startGame(res.data.data.name);
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: 'none'
								});
							}
						}
					});
				}
			},
			//开始游戏
			startGame(name) {
				let that = this;
				that.colorAwardSelect = '#FFCEC1';
				that.isRunning = true;
				let indexSelect = 0;
				let i = 0;
				let timer = setInterval(() => {
					indexSelect++;
					//这里我只是简单粗暴用y=30*x+200函数做的处理.可根据自己的需求改变转盘速度
					i += 30;
					if (i > 1000) {
						let index = that.awardList.map(i => i.textAward).indexOf(name);
						if (that.indexSelect == index) { //抽奖完成
							//去除循环
							clearInterval(timer);
							that.isJoin = true;
							that.isRunning = false;
							that.colorAwardSelect = '';
						}
					}
					indexSelect = indexSelect % 8;
					that.indexSelect = indexSelect;
				}, 200 + i);
			},
			//禁止页面滚动(规避警告)
			stopSlide() {
				return;
			}
		}
	};
</script>

<style>
	page {
		background: #F34512;
	}

	.topback {
		z-index: 9;
		width: 100%;
		height: 713rpx;
	}

	.rule {
		color: #FCDB37;
		font-size: 24rpx;
		margin: 0 30rpx 0 50rpx;
		position: relative;
		top: -50rpx;
	}

	.rule>view:first-child {
		font-size: 30rpx;
		margin-bottom: 30rpx;
	}

	.container-out {
		z-index: 9;
		width: 650rpx;
		height: 600rpx;
		margin: 0 auto;
		background: #FF5F2F;
		border-radius: 40rpx;
		box-shadow: 0 10px 0 #DA2B00;
		position: relative;
		top: -120rpx;
	}

	.container-in {
		margin: auto;
		width: 580rpx;
		height: 530rpx;
		border-radius: 40rpx;
		background: #DA2B00;
		position: absolute;
		bottom: 0;
		right: 0;
		left: 0;
		top: 0;
	}

	/* 小圆球 */
	.circle {
		width: 20rpx;
		height: 20rpx;
		display: block;
		border-radius: 50%;
		position: absolute;
	}

	.content-out {
		height: 150rpx;
		color: #A42908;
		font-size: 24rpx;
		width: 166.6666rpx;
		position: absolute;
		text-align: center;
		background: #FFF2EC;
		border-radius: 15rpx;
		box-shadow: 0 5px 0 #FFCEC1;
	}

	/* 居中加粗 */
	.start-btn {
		height: 125rpx;
		font-weight: bold;
		padding-top: 25rpx;
		text-align: center;
		width: 166.6666rpx;
		border-radius: 15rpx;
		background: url(/static/gift/gifbc.png) no-repeat;
		background-size: 100% 100%;
		box-shadow: 0 5px 0 #F79C00;
		position: absolute;
		margin: auto;
		bottom: 0;
		right: 0;
		left: 0;
		top: 0;
	}

	.start-btn>text {
		display: block;
		color: #FF3400;
		font-size: 38rpx;
		text-shadow: 0px 3px 5px rgba(218, 43, 0, 0.44);
	}

	.award-image {
		width: 84rpx;
		height: 82rpx;
		display: block;
		margin: 20rpx auto 0 auto;
	}

	/* 弹窗 */
	.mask {
		z-index: 99;
		background: rgba(0, 0, 0, 0.4);
		position: fixed;
		bottom: 0;
		right: 0;
		left: 0;
		top: 0;
	}

	.tip {
		width: 100%;
		height: 54vh;
		z-index: 999;
		background: url(/static/gift/img.png) no-repeat;
		background-size: 100% 100%;
		position: fixed;
		left: 50%;
		top: 40%;
		transform: translate(-50%, -50%);
	}

	.thank {
		color: #FFFFFF;
		font-size: 24rpx;
		font-weight: bold;
		text-align: center;
		margin-top: 250rpx;
	}

	.thank>view:first-child {
		color: #FFFFFF;
		font-size: 54rpx;
		font-weight: bold;
		margin-bottom: 30rpx;
		text-shadow: 7rpx 15rpx 21rpx rgba(161, 0, 0, 0.5);
	}

	.del {
		width: 100rpx;
		height: 100rpx;
		position: absolute;
		bottom: -450rpx;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
