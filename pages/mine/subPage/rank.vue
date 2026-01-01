<template>
	
	
	<view style="padding-bottom:50rpx;width:100%;;background: url('../../../static/share/redbg2.png');background-size: 750rpx 1400rpx;background-color: red;">
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		
		<view style="z-index:10;width:100%;display:flex;padding:10rpx;align-items:center;">
			<view style="width:150rpx;">
				
				<image src="/static/noviciate/left.png" mode="widthFix" style="height:50rpx;width:50rpx;" @click="navToParent"></image>
			</view>
			
			<view style="color:#fff;width:calc(100% - 300rpx);justify-content: center;align-items: center;display:flex;line-height:60rpx;">
				赚钱排行榜
				
			</view>
			
			<view style="color:#fff;width:150rpx;" @click="seeRank">
				规则
			</view>
		
		</view>
		
	
		
		<view style="width:100%;text-align:center;padding-top:120rpx;color:#fff;">
			活动时间：{{start_time}}-{{end_time}}
		</view>
		


		
		
		<view  style="width:100%;text-align:center;margin-top:130rpx;color:#333;line-height:50rpx;font-weight: bold;">
			<view style="">已完成任务数</view>
			<view style="color:red;">{{my_task_num}}</view>
		</view>
		<view  style="width:100%;text-align:center;margin-top:40rpx;color:#333;line-height:50rpx;font-weight: bold;">
			<view style="">当前排名</view>
			<view style="color:red;margin-top:10rpx;" v-if="my_task_rank">第{{my_task_rank}}名</view>
			<view style="color:red;" v-else>无</view>
			<view style="margin-top:20rpx;" @click="invite">
				
			<image src="/static/share/task.png" style="width:300rpx;height:110rpx;"></image>
			</view>
		
		</view>
		
		

				
		<view  style="width:94%;margin-top:250rpx;margin-left:3%;border-radius:10rpx;background: #fff;overflow: hidden;">
			
			<view style="width:100%;background:red;color:#fff;font-size:24rpx;display:flex;line-height:60rpx;">
				<view style="line-height:90rpx;width:96%;margin-left:2%;display:flex;align-items:center;justify-content: center;text-align:center;">
					<view style="width:30%;text-align:left;">
						
						排名
					</view>
					
					<view style="width:40%;">
						
						完成任务数
						
					</view>
					<view style="width:30%;text-align: right;">
						奖金（￥元）
					</view>
				</view>
			</view>
			
			
			<view style="width:96%;margin-left:2%;font-size: 26rpx;">
				<view style="border-bottom: 2rpx solid #bbb;display:flex;line-height:54rpx;align-items:center;padding:20rpx 10rpx;justify-content: center;text-align:center;" v-for="item in rankData">
					<view style="width:30%;text-align:left;display:flex;overflow:hidden;white-space:nowrap;">
						
						<view style="margin-right:10rpx;text-align:center;background:red;border-radius: 50%;height:50rpx;line-height:50rpx;width:50rpx;color:#fff;">
							{{item.rank}}
						</view>
						{{item.nickname?item.nickname:'无'}}
					</view>
					
					<view style="width:40%;text-align: center;">
					
							{{item.num?item.num:0}}
						
					</view>
					<view style="width:30%;text-align:right;color:#df732a;">
						￥{{item.money}}
					</view>
				</view>
			</view>
		</view>
		
		
		<uni-popup ref="popup" >
			<view style="background-color: white;padding: 30rpx;width: 70vw;border-radius: 16rpx;padding-bottom: 50rpx;">
				<view style="text-align: center;font-size: 34rpx;font-weight: 700;">排行榜规则</view>
				<view style="text-align: center;margin: 20rpx 0;">
		
				
				</view>
				<view style="margin-bottom: 30rpx;">
						<view v-html="money_rules">
							
						</view>
				
				</view>
		<!-- 	    <view style="text-align: center;color: rgb(0, 0, 0);display: flex;align-items: center;justify-content: center;"><image style="width: 30rpx;height: 30rpx;margin-right: 6rpx;" src='../../../static/logo.png'></image> 急速审核规则</view> -->
				<!-- 
				
				<view style="background-color: rgb(221, 221, 221);color: #888888;padding: 16rpx;text-align: center;border-radius: 36rpx;" @click="popupclose">关闭</view> 
				-->
				<view style="margin: 30rpx 0 0rpx 0;background-color: red;color: #fff;padding: 16rpx;text-align: center;border-radius: 36rpx;" @click="closeRank">关闭</view>
			
			</view>
		</uni-popup>
		
		
		
		
		<!-- <image :src="poster" style="height:calc(100vh - 90rpx);width:100%;"></image> -->
	<!-- 	<image src="/static/share/redbg.jpg" style="height:100vh;width:100%;"></image> -->
	<!-- 	<view class="pei">
			<view @click="share">
				<image src="/static/share/fenx.png" mode="widthFix"></image>
				<text style="color: #017ff0;">立即分享</text>
				
			</view>
		</view>
		 -->
	</view>
</template>
<script>
	import swiperL from '@/components/liusheng22-swiper/liusheng22-swiper.vue';
	export default {
		components:{
			swiperL
		},
		data() {
			return {
				rank_rules:'',
				my_task_rank:'',
				my_task_num:0,
				margin:'',
				money_rules:'',
				spread_count:0,
				fission_rank:[],
				rankData:[],
				sum:0,
				count:0,
				start_time:'',
				end_time:'',
				index: 0, // 海报下标
				poster: [], // 分享海报
				shareUrl: '', // 分享链接
				isJoin: false, //是否弹窗
				array: ['保存相册', '复制链接', '微信', '朋友圈', 'QQ', 'QQ空间'], // 分享
			}
		},
		// 监听按钮触发
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url: '/pages/xinrenxuzhi/xinrenxuzhi'
			})
		},
		onShow() {
			this.getUserBuildl()
		},
		onLoad(options) {
			this.type=options.type?options.type:0
			
			let _this =this
			
			var now = new Date(); //当前日期 
			var nowMonth = now.getMonth()+1; //当前月 
			var nowYear = now.getFullYear(); //当前年 
	
	
			let last_day=this.getLastDay();
			this.start_time=nowYear+'.'+nowMonth+'.'+'1'
			this.end_time=nowYear+'.'+nowMonth+'.'+last_day
				
		
			// _this.$nextTick(()=>{
			// 	_this.$refs.aaaaa.getUserBuildl(); 
			// })
			
		},
		
		onNavigationBarButtonTap(e){
			uni.navigateTo({
				url:'/pages/home/subpage/protocol?name=' + '跳转协议'
			})
		},
		methods: {
			closeRank(){
				this.$refs.popup.close()
				
			},
			seeRank(){
				this.$refs.popup.open('center')
			},
			invite(){
				
				uni.switchTab({
					url:'/pages/task/task'
				})
			},
			navToParent() {
				uni.navigateBack();
			},
			getLastDay() {
			    //当前月最后一天
			    var y = new Date().getFullYear(); //获取年份
			    var m = new Date().getMonth() + 1; //获取月份
			    var d = new Date(y, m, 0).getDate(); //获取当月最后一日
			    m = m < 10 ? "0" + m : m; //月份补 0
			    d = d < 10 ? "0" + d : d; //日数补 0
				
				return d;
			    return [y, m, d].join("-");
			},
			getUserBuildl() {
				let that=this
				uni.request({
					url: this.global.url + '/api/index/ranking_list2',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						type:1,
						list_type:2,
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						if (res.data.code == 1) {
							that.rankData=res.data.data.data
							that.my_task_num=res.data.data.my_task_num
							that.my_task_rank=res.data.data.my_task_rank
							that.money_rules=res.data.data.money_rules
						
							
						}
					}
				})
			}, 
			
			receive(num) {
				let that=this
				uni.request({
					url: this.global.url + '/api/user/receive_fission',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token,
						number:num,
					},
					success: (res) => {
						if (res.data.code == 1) {
							uni.showToast({
								title: '领取成功',
								icon: 'none'
							})
							
							that.getUserBuildl()
						}else{
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})
			}, 
			//打开弹窗
			share(){
				this.$refs.aaaaa.isJoin=true;
				 console.log(this.$refs.aaaaa.isJoin)
			}
		}
	}
</script>

<style scoped lang="scss">
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
		background-color: transparent;
	}
	.can {
		z-index: 9;
		width: 660rpx;
		height: 1080rpx;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.share {
		z-index: 9;
		width: 100%;
		height: 66vh;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);

		.img {
			width: 100%;
			height: 100%;
			margin: 0 20rpx;
		}
	}

	.pei {
		width: 100%;
		height: 351rpx;

		background-size: 100% 100%;
		position: absolute;
		bottom: -2%;

		&>view {
			display: flex;
			width: 200rpx;
			height: 60rpx;
			color: #333333;
			font-size: 26rpx;
			font-weight: bold;
			background: #FFFFFF;
			align-items: center;
			border-radius: 30rpx;
			justify-content: center;
			position: relative;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);

			&>image {
				width: 29rpx;
				height: 29rpx;
				margin-right: 10rpx;
			}
		}
	}
	
</style>
