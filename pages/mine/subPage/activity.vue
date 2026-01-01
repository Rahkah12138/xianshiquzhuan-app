<template>
	
	
	<view style="padding-bottom:50rpx;width:100%;;background: url('../../../static/share/redbg.jpg');background-size: 100% 1400rpx;background-color: red;background-repeat: no-repeat;">
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		
		<view style="z-index:10;width:100%;display:flex;padding:10rpx;align-items:center;">
			<view style="width:150rpx;">
				
				<image src="/static/noviciate/left.png" mode="widthFix" style="height:50rpx;width:50rpx;" @click="navToParent"></image>
			</view>
			
			<view style="color:#fff;width:calc(100% - 300rpx);justify-content: center;align-items: center;display:flex;line-height:60rpx;">
				排行榜
				
			</view>
			
			<view v-show="type !=2" style="color:#fff;width:150rpx;" @click="seeRank">
				规则
			</view>
			
			<view v-show="type ==2" style="color:#fff;width:150rpx;" @click="seeRank2">
				规则
			</view>
		
		</view>
		
		<view style="z-index:10;width:100%;display:flex;padding:10rpx;">
			
			
			<view style="width:100%;justify-content: center;align-items: center;display:flex;line-height:60rpx;">
				
				<view  v-show="type == 0" style="background-color: #bbb;border-radius:40rpx;width:500rpx;display:flex;overflow:hidden;">
					<view style="background-color: red;width:33.3%;text-align:center;color:#fff;">
						推广奖励
					</view>
					<view @click="type = 1" style="background-color: #fff;width:33.3%;text-align:center;border-right:1px solid #333;">
						裂变奖励
					</view>
					<view @click="type = 2" style="background-color: #fff;width:33.3%;text-align:center;">
						接单奖励
					</view>
				</view>
				
				
				<view v-show="type == 1" style="background-color: #bbb;border-radius:40rpx;width:500rpx;display:flex;overflow:hidden;">
					<view @click="type = 0" style="background-color: #fff;width:33.3%;text-align:center;">
						推广奖励
					</view>
					<view style="background-color: red;width:33.3%;text-align:center;color:#fff;">
						裂变奖励
					</view>
					
					<view @click="type = 2" style="background-color: #fff;width:33.3%;text-align:center;">
						接单奖励
					</view>
					
				</view>
				
				<view v-show="type == 2" style="background-color: #bbb;border-radius:40rpx;width:500rpx;display:flex;overflow:hidden;">
					<view @click="type = 0" style="background-color: #fff;width:33.3%;text-align:center;">
						推广奖励
					</view>
					<view @click="type = 1" style="border-left:1px solid red;background-color: #fff;width:33.3%;text-align:center;">
						裂变奖励
					</view>
					
					<view  style="background-color: red;color:#fff;width:33.3%;text-align:center;">
						接单奖励
					</view>
					
				</view>
				
				
			
				
			</view>
	
		</view>
		
		<view style="width:100%;text-align:center;padding-top:30rpx;color:#fff;">
			活动时间：{{start_time}}-{{end_time}}
		</view>

		<!-- Skeleton Loading -->
		<view v-if="isLoading">
			<!-- Stats Section Skeleton -->
			<view style="width:100%;text-align:center;margin-top:130rpx;">
				<view class="skeleton-line skeleton-animate" style="width: 50%; height: 30rpx; margin: 0 auto;"></view>
				<view class="skeleton-line skeleton-animate" style="width: 30%; height: 40rpx; margin: 20rpx auto;"></view>
				<view class="skeleton-line skeleton-animate" style="width: 300rpx; height: 110rpx; margin: 20rpx auto; border-radius: 16rpx;"></view>
			</view>

			<!-- List Section Skeleton -->
			<view style="width:94%;margin-top:150rpx;margin-left:3%;border-radius:10rpx;background: #fff;overflow: hidden; padding-bottom: 20rpx;">
				<view class="skeleton-line skeleton-animate" style="width: 100%; height: 80rpx; border-radius: 0;"></view>
				<view v-for="i in 4" :key="i" class="skeleton-list-item">
					<view class="skeleton-avatar skeleton-animate"></view>
					<view class="skeleton-line skeleton-animate" style="width: 30%;"></view>
					<view class="skeleton-line skeleton-animate" style="width: 20%;"></view>
					<view class="skeleton-line skeleton-animate" style="width: 25%;"></view>
				</view>
			</view>
		</view>
		
		<view v-if="!isLoading">
			<view v-show="type == 1" style="width:100%;text-align:center;margin-top:130rpx;color:#333;line-height:50rpx;font-weight: bold;">
				<view style="">提现人数</view>
				<view style="color:red;">{{count}}</view>
			</view>
			<view v-show="type == 1" style="width:100%;text-align:center;margin-top:20rpx;color:#333;line-height:50rpx;font-weight: bold;">
			<view style="">当前收益</view>
			<view style="color:red;">{{sum}}元</view>
			<view style="margin-top:20rpx;" @click="invite">
				
				<image src="/static/share/lingqu.png" style="width:300rpx;height:110rpx;"></image>
			</view>
		
		</view>
		
		
			<view v-show="type == 0" style="width:100%;text-align:center;margin-top:130rpx;color:#333;line-height:50rpx;font-weight: bold;">
				<view style="">当前一级好友提现人数</view>
				<view style="color:red;">{{spread_count}}</view>
			</view>
			<view v-show="type == 0" style="width:100%;text-align:center;margin-top:20rpx;color:#333;line-height:50rpx;font-weight: bold;">
			<view style="">当前排名</view>
			<view style="color:red;" v-show="!myrank">还差{{margin}}人上榜</view>
			<view style="color:red;" v-show="myrank">第{{myrank}}名</view>
			<view style="margin-top:20rpx;" @click="invite">
				
			<image src="/static/share/lingqu.png" style="width:300rpx;height:110rpx;"></image>
			</view>
		
		</view>
		
		
			<view v-show="type == 2" style="width:100%;text-align:center;margin-top:130rpx;color:#333;line-height:50rpx;font-weight: bold;">
				<view style="">已完成任务数</view>
				<view style="color:red;">{{my_task_num}}</view>
			</view>
			<view v-show="type == 2" style="width:100%;text-align:center;margin-top:20rpx;color:#333;line-height:50rpx;font-weight: bold;">
			<view style="">当前排名</view>
			<view style="color:red;margin-top:0rpx;" v-if="my_task_rank">第{{my_task_rank}}名</view>
			<view style="color:red;" v-else>无</view>
			<view style="margin-top:10rpx;" @click="task">
				
			<image src="/static/share/task.png" style="width:290rpx;height:110rpx;"></image>
			</view>
		
		</view>
		
			<view v-show="type !=2" style="color:#fff;font-weight:bold;width:100%;text-align:center;margin-top:150rpx;">邀请一级好友完成总人数</view>
			<view v-show="type ==2" style="color:#fff;font-weight:bold;width:100%;text-align:center;margin-top:150rpx;">完成任务数</view>
			
			
			
			
			<view v-show="type == 1" style="width:94%;margin-top:50rpx;margin-left:3%;border-radius:10rpx;background: #fff;overflow: hidden;">
			<view style="width:100%;text-align: center;background-color: red;height:80rpx;line-height:80rpx;color:#fff;">任务列表</view>
			<view style="width:96%;margin-left:2%;">
	<view :class="{actitem:true,actbtm:idx<(fission_rank.length-1)}" v-for="(item,idx) in fission_rank">
				<view style="width:15%;display:flex;align-items: center;justify-content: center;">
						
						<view style="text-align:center;background:red;border-radius: 50%;height:60rpx;line-height:60rpx;width:60rpx;color:#fff;">
							{{item.index}}
						</view>
					</view>
					
					<view style="width:60%;font-size:24rpx;padding-top:10rpx;">
						<view style="line-height: 40rpx;">
							徒弟首次提现{{item.num}}人
							<text style="color:red;margin-left:20rpx;">￥{{item.reward}}</text>
						</view>
						<view style="display:flex;align-items: center;height:40rpx;">
							<view style="width:calc(100% - 40rpx);height:10rpx;background:#eee;border-radius:10rpx;">
								<view  :style="'height:10rpx;background:red;border-radius:10rpx;width:'+item.percent+'%;'"></view>
							</view>
							<view style="color:#bbb;margin-left:20rpx;font-size:24rpx;">
								{{item.sum}}/{{item.num}}
							</view>
							
						</view>
						
					</view>
					<view style="width:25%;justify-content: center;display:flex;">
						<view v-show="item.is_fetch == 0" style="width:70px;font-size:24rpx;background:#bbb;line-height:60rpx;border-radius: 40rpx;text-align:center;color:#fff;">未完成</view>
						<view v-show="item.is_fetch == 1" @click="receive(item.num)"  style="width:70px;font-size:24rpx;background:red;line-height:60rpx;border-radius: 40rpx;text-align:center;color:#fff;">领取</view>
						<view v-show="item.is_fetch == 2" style="width:70px;font-size:24rpx;background:red;line-height:60rpx;border-radius: 40rpx;text-align:center;color:#fff;">已领取</view>
					</view>
				</view>
			</view>
		</view>
		
		
		
			<view v-show="type == 0" style="width:94%;margin-top:50rpx;margin-left:3%;border-radius:10rpx;background: #fff;overflow: hidden;">
				
				<view style="width:100%;background:red;color:#fff;font-size:24rpx;display:flex;line-height:60rpx;">
				<view style="line-height:90rpx;width:96%;margin-left:2%;display:flex;align-items:center;justify-content: center;text-align:center;">
					<view style="width:30%;text-align:left;">
						
						排名
					</view>
					
					<view style="width:40%;">
						
						一级好友提现人数
						
					</view>
					<view style="width:30%;text-align: right;">
						奖金（￥元）
					</view>
				</view>
			</view>
			
			
			<view style="width:96%;margin-left:2%;font-size: 26rpx;">
				<view :class="{actitem:true,actbtm:idx<(spread_rank.length-1)}" v-for="(item,idx) in spread_rank">
					<view style="width:30%;text-align:left;display:flex;overflow:hidden;white-space:nowrap;">
						
						<view style="margin-right:10rpx;text-align:center;background:red;border-radius: 50%;height:50rpx;line-height:50rpx;width:50rpx;color:#fff;">
							{{item.index}}
						</view>
						{{item.nickname}}
					</view>
					
					<view style="width:40%;text-align: center;">
					
							{{item.num}}人
						
					</view>
					<view style="width:30%;text-align:right;color:#df732a;">
						￥{{item.reward}}
					</view>
				</view>
			</view>
		</view>
		
		
		
		
			<view v-show="type == 2"  style="width:94%;margin-top:50rpx;margin-left:3%;border-radius:10rpx;background: #fff;overflow: hidden;">
				
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
				<view :class="{actitem:true,actbtm:idx<(rankData.length-1)}" v-for="(item,idx) in rankData">
					<view style="width:30%;text-align:left;display:flex;overflow:hidden;white-space:nowrap;">
						
						<view style="margin-right:10rpx;text-align:center;background:red;border-radius: 50%;height:50rpx;line-height:50rpx;width:50rpx;color:#fff;">
							{{item.rank}}
						</view>
						{{item.nickname?maskChineseString(item.nickname):'无'}}
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
	</view>
		
		
		
		<uni-popup ref="popup" >
			<view style="background-color: white;padding: 30rpx;width: 70vw;border-radius: 16rpx;padding-bottom: 50rpx;">
				<view style="text-align: center;font-size: 34rpx;font-weight: 700;">排行榜规则</view>
				<view style="text-align: center;margin: 20rpx 0;">
		
				
				</view>
				<view style="margin-bottom: 30rpx;">
						<view v-html="rank_rules">
							
						</view>
				
				</view>
		<!-- 	    <view style="text-align: center;color: rgb(0, 0, 0);display: flex;align-items: center;justify-content: center;"><image style="width: 30rpx;height: 30rpx;margin-right: 6rpx;" src='../../../static/logo.png'></image> 急速审核规则</view> -->
				<!-- 
				
				<view style="background-color: rgb(221, 221, 221);color: #888888;padding: 16rpx;text-align: center;border-radius: 36rpx;" @click="popupclose">关闭</view> 
				-->
				<view style="margin: 30rpx 0 0rpx 0;background-color: red;color: #fff;padding: 16rpx;text-align: center;border-radius: 36rpx;" @click="closeRank">关闭</view>
			
			</view>
		</uni-popup>
		
		
		
		<uni-popup ref="popup2" >
			<view style="background-color: white;padding: 30rpx;width: 70vw;border-radius: 16rpx;padding-bottom: 50rpx;">
				<view style="text-align: center;font-size: 34rpx;font-weight: 700;">接单奖励规则</view>
				<view style="text-align: center;margin: 20rpx 0;">
		
				
				</view>
				<view style="margin-bottom: 30rpx;">
						<view v-if="money_rules" v-html="money_rules">
							
						</view>
				
				</view>
		<!-- 	    <view style="text-align: center;color: rgb(0, 0, 0);display: flex;align-items: center;justify-content: center;"><image style="width: 30rpx;height: 30rpx;margin-right: 6rpx;" src='../../../static/logo.png'></image> 急速审核规则</view> -->
				<!-- 
				
				<view style="background-color: rgb(221, 221, 221);color: #888888;padding: 16rpx;text-align: center;border-radius: 36rpx;" @click="popupclose">关闭</view> 
				-->
				<view style="margin: 30rpx 0 0rpx 0;background-color: red;color: #fff;padding: 16rpx;text-align: center;border-radius: 36rpx;" @click="closeRank2">关闭</view>
			
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
				isLoading: true,
				money_rules: '',
				rankData:'',
				rank_rules:'',
				my_task_rank:'',
				my_task_num:0,
				rank_rules:'',
				myrank:'',
				margin:'',
				spread_count:0,
				type:0,
				fission_rank:[],
				spread_rank:[],
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
		computed: {
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
			maskChineseString(inputString) {
			    if (inputString.length > 4) {
			        // 将字符串转换为数组，以处理中文字符
			        const characters = inputString.split('');
			        
			        // 获取第三个字符到倒数第二个字符之间的部分
			        const maskPart = characters.slice(2, characters.length - 2).join('');
			        
			        // 生成与maskPart相同长度的星号字符串
			        const maskedString = '*'.repeat(2);
			        
			        // 拼接替换后的字符串
			        const result = characters.slice(0, 2).join('') + maskedString + characters.slice(-1).join('');
			        
			        return result;
			    } else {
			        // 如果字符串长度不超过4，直接返回原始字符串
			        return inputString;
			    }
			},

			ranking_list2() {
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
						console.log('money_rules', res)
						if (res.data.code == 1) {
							that.rankData=res.data.data.data
							that.my_task_num=res.data.data.my_task_num
							that.my_task_rank=res.data.data.my_task_rank
							that.money_rules=res.data.data.money_rules
						
							
						}
					}
				})
			}, 
			closeRank(){
				this.$refs.popup.close()
				
			},
			closeRank2(){
				this.$refs.popup2.close()
				
			},
			seeRank(){
				this.$refs.popup.open('center')
			},
			seeRank2(){
				this.$refs.popup2.open('center')
			},
			invite(){
				
				uni.navigateTo({
					url:'/pages/mine/subPage/share'
				})
			},
			task(){
				
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
				this.ranking_list2()
				let that=this
				uni.request({
					url: this.global.url + '/api/user/statistic',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						console.log('getUserBuildl',res)
						if (res.data.code == 1) {
							that.sum=res.data.data.sum
							that.count=res.data.data.count
							that.fission_rank=res.data.data.fission_rank
							that.spread_rank=res.data.data.spread_rank
							that.spread_count=res.data.data.spread_count
							that.myrank=res.data.data.myrank
							that.margin=res.data.data.margin
							that.rank_rules=res.data.data.rank_rules
					
						// console.log(this.cardList)
						// this.poster=this.cardList
						
						}
					},
					complete: () => {
						that.isLoading = false;
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
	/* Skeleton Styles */
	.skeleton-animate {
		background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
		background-size: 200% 100%;
		animation: skeleton-shimmer 1.5s infinite linear;
	}
	
	@keyframes skeleton-shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	.skeleton-line {
		height: 28rpx;
		border-radius: 8rpx;
		background-color: #f0f0f0;
	}

	.skeleton-list-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx;
		border-bottom: 1rpx solid #f5f5f5;
	}

	.skeleton-avatar {
		width: 50rpx;
		height: 50rpx;
		border-radius: 50%;
		margin-right: 10rpx;
	}

	.actbtm{
		
		border-bottom: 2rpx solid #bbb;
	}
	.actitem{
		display:flex;
		line-height:54rpx;
		align-items:center;
		padding:20rpx 10rpx;
		justify-content: center;
		text-align:center;
	}
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
