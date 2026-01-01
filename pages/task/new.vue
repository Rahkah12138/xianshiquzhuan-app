<template>
	<view>
		  <view style="position: fixed;top: 0;width: 100%;background: #E63946;z-index: 999; padding-top:var(--status-bar-height)">
			  

	<view class="nav">
		<image src="/static/noviciate/left.png" @click="back" mode=""></image>
		<view class="nav_word1">首发新单</view>
		<view class="rule" @click="seeRank">
			规则
		</view>
	</view>
	
<!-- 	<view class="status_bar">
	
	</view> -->

			
		<!-- 选项卡 -->

		  </view>
		<!-- 筛选弹窗 -->
	


		
		  <!-- #ifdef APP-PLUS || H5 -->
		  <view style="height: calc(var(--status-bar-height) + 88rpx);width:100%;"></view>
		  <!-- #endif -->
		  <!-- #ifdef MP-WEIXIN -->
		  <view style="height: calc(var(--status-bar-height) + 88rpx);width:100%;"></view>
		  <!-- #endif -->

		<!-- Skeleton Loading -->
		<view v-if="isLoading" class="skeleton-wrapper" style="margin: 20rpx 20rpx;">
			<view class="skeleton-task" v-for="i in 5" :key="i">
				<view class="skeleton-left">
					<view class="skeleton-avatar skeleton-animate"></view>
				</view>
				<view class="skeleton-right">
					<view class="skeleton-line skeleton-animate" style="width: 70%; height: 32rpx;"></view>
					<view class="skeleton-line skeleton-animate" style="width: 40%; margin-top: 15rpx;"></view>
					<view class="skeleton-price skeleton-animate"></view>
				</view>
			</view>
		</view>
		
		<view class="coupleta" v-if="imgShow == false && !isLoading" style="margin: 20rpx 20rpx;">
			<view class="task" v-for="(c,i) in taskArr" :key="i" @click="navToDetail(c.id,c.type)">
				<view class="sanfenpian">
					<!-- <image v-if="c.top==1" src="../../static/index/ding.png" mode=""></image>
					<image v-if="c.recommend==1" src="../../static/shouye/icon_tui@2x.png" mode=""></image>
					<image v-if="c.ensure==1" src="../../static/shouye/icon_bao@2x.png" mode=""></image> -->
					
				</view>
				<view class="left">
					<view class="top">
						<image style="width: 100rpx;height: 100rpx;border-radius: 50%;" :src="c.avatar"></image>
						<image v-show="c.user_level_id>1" class="vip" style="border-radius:0;width: 50rpx;height: 50rpx;top: 100rpx;left: 84rpx;"
							:src="c.vip"></image>
					</view>
					<view class="cen" style="display:flex;align-items: center;justify-content: space-between;">
						<view class="cen" style="display:flex;align-items: center;">
							<text class="cen_word">{{c.title}}</text>						
							<image v-if="c.top==1" style="width: 40rpx;height: 40rpx;margin: 0 5rpx;"
								src="../../static/index/ding.png"></image>
							<image  v-if="c.recommend==1" style="width: 40rpx;height: 40rpx;margin: 0 5rpx;"src="../../static/shouye/icon_tui@2x.png" mode=""></image>
							<image v-if="c.ensure==1 " style="width: 40rpx;height: 40rpx;margin: 0 5rpx;"
								src="../../static/index/bao.png"></image>
								
							<image v-if="c.is_jisu==1" style="width: 40rpx;height: 40rpx;margin: 0 10rpx;"
									src="../../static/index/kuaishen.png"></image>
						</view>
						
						<view class="cen_pic" style="font-size:24rpx;">  <text style="font-weight: bold;font-size: 32rpx;">+</text>  <text style="font-weight: bold;font-size: 36rpx;">{{c.price}}</text>元</view>
					</view>
					<view class="bom_word">
						<view class="bom_word1">
							{{c.tasktypename}}
						</view>
						<view class="bom_word2">
							{{c.entryname}}
						</view>
						<view class="bom_word3">
							<text class="wrod_box1">{{c.received}}人已赚</text>
							<view class="bom_wire" style="margin: 0 10rpx;">
								|
							</view>
							<view class="bom_worda">
								剩余：{{c.surplus}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		
		
		<uni-popup ref="popup" >
			<view style="background-color: white;padding: 30rpx;width: 70vw;border-radius: 16rpx;padding-bottom: 50rpx;">
				<view style="text-align: center;font-size: 34rpx;font-weight: 700;">规则</view>
				<view style="text-align: center;margin: 20rpx 0;">
		
				
				</view>
				<view style="margin-bottom: 30rpx;">
						<view v-html="new_principle">
							
						</view>
				
				</view>
		<!-- 	    <view style="text-align: center;color: rgb(0, 0, 0);display: flex;align-items: center;justify-content: center;"><image style="width: 30rpx;height: 30rpx;margin-right: 6rpx;" src='../../../static/logo.png'></image> 急速审核规则</view> -->
				<!-- 
				
				<view style="background-color: rgb(221, 221, 221);color: #888888;padding: 16rpx;text-align: center;border-radius: 36rpx;" @click="popupclose">关闭</view> 
				-->
				<view style="margin: 30rpx 0 0rpx 0;background-color: #E63946;color: #fff;padding: 16rpx;text-align: center;border-radius: 36rpx;" @click="closeRank">关闭</view>
			
			</view>
		</uni-popup>

	</view>
</template>
<script>
	
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
	console.log(statusBarHeight,'aasssssssss')
	export default {
		data() {
			return {
				isLoading: true,
				new_principle:'',
				equipment:1,
				statusBarHeight: statusBarHeight,
				userInfo:{},
				page: 12, // 页码
				index: 1, // 选项卡下标
				index1: -1, // 类型下标
				messArr: [], // 消息列表
				taskArr: [], // 任务列表
				typeArr: [], // 任务类型
				isJoin: false, // 筛选显隐
				current: ['类型', '综合', '最新', '高价', '人气','简单'], // 选项卡
				imgShow: false,
				fatherMask: false,
				typeList: [{
					name: '不限',
					qk: ''
				},{
					name: '1小时以内',
					qk: '1'
				},{
					name: '1-3小时',
					qk: '1-3'
				},{
					name: '3-6小时',
					qk: '3-6'
				},{
					name: '6-9小时',
					qk: '6-9'
				},{
					name: '9-11小时',
					qk: '9-11'
				},{
					name: '11-13小时',
					qk: '11-13'
				}
				
				],
				courseTypesObj:[{
					name: '不限',
					qk: ''
				},{
					name: '1小时以内',
					qk: '1'
				},{
					name: '1-3小时',
					qk: '1-3'
				},{
					name: '3-6小时',
					qk: '3-6'
				},{
					name: '6-9小时',
					qk: '6-9'
				},{
					name: '9-11小时',
					qk: '9-11'
				},{
					name: '11-13小时',
					qk: '11-13'
				}
				
				],
				pricelist:[{
					name: '不限',
					qk: ''
				},{
					name: '6元以内',
					qk: '6'
				},{
					name: '10元以内',
					qk: '10'
				},{
					name: '20元以内',
					qk: '20'
				},{
					name: '20元以上',
					qk: '21'
				}
				
				],
				danleixinglist:[{
					name: '不限',
					qk: ''
				},{
					name: '置顶',
					qk: '1'
				},{
					name: '推荐',
					qk: '2'
				},{
					name: '保证金',
					qk: '3'
				}
				
				],

				typeshow1: 0, //控制展示选中和未被选中的类型
				typeshow2: 0, //控制展示选中和未被选中的类型
				typeshow3: 0, //控制展示选中和未被选中的类型
				typeshow4: 0, //控制展示选中和未被选中的类型
				
				num1: '',
				search1: '',
				Pircemoney: '',
				
				courseTypesObjIndex: '',
			}
		},
		onReachBottom() {
				let that = this;
		
				
				that.page += 12;
				that.getTaskList();
			
		},
		 onPullDownRefresh() {
				
			
		        console.log('refresh');
				this.page = 12;
				this.typeArr = []
				this.getTaskList();
		        setTimeout(function () {
		            uni.stopPullDownRefresh();
		        }, 1000);
		 },
			
		onLoad() {
		
			
			this.userInfo=uni.getStorageSync('token')

		},
		onShow() {
			this.page = 12;
			this.typeArr = []
			this.getTaskList();
		},
		methods: {
			closeRank(){
				this.$refs.popup.close()
				
			},
			seeRank(){
				this.$refs.popup.open('center')
			},
			navToDetail(id,type) {
			
					uni.navigateTo({
						url: '/pages/task/detail?id=' + id
					});
				
			},
			resett(){
				this.equipment = 1
				this.index1 = -1
			},
			setEquipment(val){
				this.equipment=val
			},
			newCourse() {
				uni.switchTab({
					url: '/pages/pagesFind/publishTask/publishTask'
				})
			},
			navToSearch() {
				uni.navigateTo({
					url: '/pages/home/subpage/search'
				});
			},

			jks:function(){
				
			},
			
			// 显示筛选
			shaixuan:function(){
				var that=this
				that.fatherMask=true
				
			},
			
			// guan
			gguan:function(){
				var that=this
				that.fatherMask=false
			},
			
			
			// queding
			define:function(){
				var that=this
				that.page=12
				that.fatherMask=false
				this.getTaskList();
			},
			
			
			// 重置
			reset:function(){
				var that=this
					that.typeshow1=0
					that.typeshow2=0
					that.typeshow3=0
					that.typeshow4=0
			},
			
			
			
			
			// 做单时间
			show1:function(index1,item1){
				var that=this
				that.typeshow1=index1
				
				
			},
			
			// 审核时间
			show2:function(index1,item1){
				var that=this
				that.typeshow2=index1
				
				
			},
			// 价格区间
			show3:function(index1,item1){
				var that=this
				that.typeshow3=index1
				
				
			},
			//做单类型
			show4:function(index1,item1){
				var that=this
				that.typeshow4=index1
				
				
			},
			// 获取任务列表
			getTaskList() {
				let that = this;
				console.log(that.courseTypesObj[that.typeshow2])
				
				uni.showLoading({
					title: '加载中'
				});
				
				uni.request({
					url: that.global.url + '/api/task/index2',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						equipment:that.equipment,
						page: that.page,
						type: that.index,
						timelimit:that.typeList[that.typeshow1].qk,
						audittime:that.courseTypesObj[that.typeshow2].qk,
						price:that.pricelist[that.typeshow3].qk,
						task_status:that.danleixinglist[that.typeshow4].qk,
						tasktype: that.index1 != -1 ? that.typeArr[that.index1].id : ''
					},
					success: (res) => {
						
						uni.hideLoading()
						
						that.new_principle= res.data.data.new_principle
						that.messArr = res.data.data.headlines;
						that.typeArr = res.data.data.tasktype;
						that.taskArr = res.data.data.tasklist;
						that.taskArr.map(i => i.avatar = i.avatar.includes('http')? i.avatar : that.global.url + i.avatar);
						
					
						
					},
					complete: () => {
						that.isLoading = false;
					}
				})
			},
			setType(i){
				this.index1 = this.index1 == i ? -1 : i;
			},
			// 切换任务类型
			cutTypeTask() {
				let that = this;
				that.page = 12; //分页初始化
				
				that.getTaskList();
				this.isJoin=false
			},
			// 切换选项卡
			cutItem(i) {
				let that = this;
				that.page = 12; //分页初始化
				that.index = i == 0 ? 1 : i;
				that.getTaskList();
				// 弹出筛选
				if (i == 0) {
					that.join();
				}
			},
			back(){
				uni.navigateBack();
			},
			// 筛选显隐
			join() {
				let that = this;
				that.isJoin = !that.isJoin;
			},
		

			// 禁止页面滚动(规避警告)
			stopSlide() {
				return;
			},
			imgSh() {
				this.imgShow = !this.imgShow
			},
		
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

	.skeleton-task {
		width: 100%;
		height: 140rpx;
		background-color: #FFFFFF;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
		padding: 14rpx;
		display: flex;
		align-items: center;
		box-sizing: border-box;
	}

	.skeleton-left {
		width: 15%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.skeleton-avatar {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
	}

	.skeleton-right {
		width: 85%;
		height: 100%;
		padding-left: 10rpx;
		position: relative;
	}

	.skeleton-line {
		height: 28rpx;
		border-radius: 8rpx;
	}
	
	.skeleton-price {
		position: absolute;
		top: 10rpx;
		right: 10rpx;
		width: 25%;
		height: 40rpx;
		border-radius: 8rpx;
	}

	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
		background-color: $uni-color-primary;
	}
	
	.nav {
		width: 100%;
		height: 88rpx;
		background-color: transparent;
		display: flex;
		
	
		image {
			width: 40rpx;
			height: 40rpx;
			margin-top: 24rpx;
			margin-left: 30rpx;
			position: absolute;
			left: 10rpx; 
		}
	
		.nav_word1 {
			line-height: 88rpx;
			font-size: 36rpx;
			color: #FFFFFF;
			text-align: center;
			width: 100%;
		}
	
		.rule {
			width: 131rpx;
			height: 44rpx;
			background-color: rgba(0, 0, 0, .2);
			border-radius: 40rpx;
			margin-right: 30rpx;
			margin-top: 22rpx;
			font-size: 26rpx;
			line-height: 44rpx;
			text-align: center;
			color: #FFFFFF;
			position: absolute;
			right: 20rpx;
			
		}
	}
	


		.title_nav{
			width: 100%;
			height: 88rpx;
			background-color: $uni-color-primary;
			position: relative;
			.title_nav_wrod{
				font-size: 32rpx;
				color: #fff;
				line-height: 88rpx;
				text-align: center;
			}
			.nav_btn{
				width: 167rpx;
				height: 48rpx;
				border: 1px solid #333333;
				position: absolute;
				top: 18rpx;
				right: 12rpx;
				border-radius: 40rpx;
				display: flex;
				.releaseImgs{
					width: 40rpx;
					height: 40rpx;
					margin-top: 4rpx;
					margin-left: 10rpx;
				}
				.nav_btnWord{
					font-size: 24rpx;
					line-height: 48rpx;
					text-align: center;
				}
			}
		}
	.left{
		width: 100%;
	}
	.coupleta {
		 border-radius: 10rpx;
		 background-color: #F8F8F8;
		 margin: 0 auto;
	
		 .task{
			 width: 100%;
			 height: 140rpx;
			 background-color: #FFFFFF;
			 border-radius: 10rpx;
			 margin-bottom: 20rpx;
			 position: relative;
			 	padding-top:14rpx;
			 .top{
				width: 15%;
				height: 126rpx;
				background-color: #FFFFFF;
				float: left;
				overflow: hidden;
				position: relative;
				 image{
					 width: 80rpx;
					 height: 80rpx;
					 border-radius: 50%;
					 position: absolute;
					 top: 50%;
					 left: 50%;
					 transform: translate(-50%,-50%);
					 
				 }
			 }
			 .cen{
			
				 height: 56rpx;
				
				 .cen_word{
					
					 float: left;
					 font-size: 30rpx;
				 }
				 .cen_img{
					 float: left;
					 image{
						 width: 27rpx;
						 height: 36rpx;
						 margin-top: 25rpx;
						 
					 }
				 }
				 .cen_pic{
					 float: right;
				
					 font-size: 30rpx;
					 color: #FF0101;
					 margin-right:13rpx;
					
				 }
			 }
			 .bom_word{
				 float: left;
				 width: 85%;
				 height: 71rpx;
				 margin-top: 12rpx;
				 box-sizing:border-box;
				 .bom_word1{
					     float: left;
					     font-size: 12px;
					     padding: 3px 6px;
					     background-color: #fdecec;
					     color: $uni-color-primary;
					     border-radius: 5px;
				 }
				 .bom_word2{
					    float: left;
					    font-size: 12px;
					    background-color: #fdecec;
					    color: $uni-color-primary;
					    padding: 3px 6px;
					    margin-left: 5px;
					    border-radius: 5px;
					
				 }
				 .bom_word3{
					 float: right;
					 margin-right: 12rpx;
					 box-sizing:border-box;
					 margin-top: 2rpx;
					 .wrod_box1{
						 font-size: 24rpx;
						 color: #999999;
						 float: left;
					 }
					 .bom_wire{
						 float: left;
						 font-size: 24rpx;
						 color: #999999;
					 }
					 .bom_worda{
						 float: right;
						 font-size: 24rpx;
						 color: #999999;
					 }
				 }
			 }
		 }
	
	}
	.tuiren_sanren{
		border-radius: 10rpx;
		
		margin: 20rpx;
	}
	.tuiren_sanren_2_2{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	.tuiren_sanren_2_2_1{
		width: 48%;
		background: #fff;
		height: 200rpx;
		margin-bottom: 20rpx;
		padding-top: 28rpx ;
		border: 1px solid #fff;
		position: relative;
		border-radius: 20rpx;
		
	}
	.tui_sanren_2_1_1_qian{
		
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.quanli{
		width: 40rpx;
		height: 40rpx;
	}
	
	.ma15{
		margin-bottom: 30rpx;
	}
	.tui_sanren_2_2_2_ava{
		width: 26%;
		text-align: center;
		display: flex;
		flex-shrink: 0;
		justify-content: center;
		align-items: center;
	}
	.tuidian_sanren_2{
		
	}
	.tuidian_sanren_2_2{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	
	.tuidian_sanren_2_2_1{
		width: 48%;
		height: 195rpx;
		margin-bottom: 20rpx;
		box-shadow: 0px 1px 4px 2px rgba(183, 91, 0, 0.16);
		background: rgba(183, 91, 0, 0.16);
		border: 1px solid rgba(183, 91, 0, 0.1);
		position: relative;
		border-radius: 20rpx;
		
	}
	.a_1{
		width: 48%;
		height: 195rpx;
		margin-bottom: 20rpx;
		box-shadow: 0px 1px 4px 2px rgba(0, 32, 255, 0.16);
		background: rgba(0, 32, 255, 0.16);
		border: 1px solid rgba(0, 0, 0, 0.1);
		position: relative;
		border-radius: 20rpx;
		
	}
	.a_2{
		width: 48%;
		height: 195rpx;
		margin-bottom: 20rpx;
		box-shadow: 0px 1px 4px 2px rgba(191, 0, 255, 0.16);
		background: rgba(191, 0, 255, 0.16);
		border: 1px solid rgba(0, 0, 0, 0.1);
		position: relative;
		border-radius: 20rpx;
		
	}
	.a_3{
		width: 48%;
		height: 195rpx; 
		margin-bottom: 20rpx;
		box-shadow: 0px 1px 4px 2px rgba(255, 127, 0, 0.16);
		background: rgba(255, 127, 0, 0.16);
		border: 1px solid rgba(0, 0, 0, 0.1);
		position: relative;
		border-radius: 20rpx;
		
	}
	.a_4{
		width: 48%;
		height: 195rpx;
		margin-bottom: 20rpx;
		box-shadow: 0px 1px 4px 2px rgba(0, 96, 255, 0.16);
		background: rgba(0, 96, 255, 0.16);
		border: 1px solid rgba(0, 0, 0, 0.1);
		position: relative;
		border-radius: 20rpx;
		
	}
	.swiper2_1 image{
		width: 100%;
		height: 100%;
		
	}
	.swiper2_1{
		width: 100%;
		height: 150rpx;
		border-radius: 20rpx;
		
	}
	.swiper2{
		margin: 20rpx 0;
		width: 100%;
		height: 150rpx;
	}
	.duoy{
		margin: 20rpx;
		
	}
	.tui_sanren_2_2_2_2>view{
		margin-bottom: 10rpx;
	}
	.tui_sanren_2_2_2{
		display: flex;
		height: 180rpx;
		align-items: center;
	}
	.tui_sanren_2_1_1_yuan{
		font-size: 30rpx;
		color: #FF0000;
	}
	.tui_sanren_2_1_1_yu{
		color: #999999;
		font-size: 20rpx;
	}
	.tui_sanren_2_1_1_qian{
		font-size: 22rpx;
		color: #666666;
	}
	.tui_sanren_2_2_2_ava image{
		width: 67rpx;
		height: 67rpx; 
		border-radius:50% ;
	}
	.tui_sanren_2_2_2_ava{
		width: 30%;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.tui_sanren_2_1_1_ava{
		width: 100%; 
		text-align: center;
		margin-top: 25rpx;
		flex-shrink: 0;
	}
	.tui_sanren_2_1_1_ava image{
		width: 67rpx; 
		height: 67rpx; 
		border-radius:50% ;
	}	
	.tui_sanren_2_1_1_tit{
		font-size: 28rpx;
		color: #000;
		font-weight: 500;
		width: 80%;
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.tui_sanren_2_1_1>view{
		margin-bottom: 21rpx;
		width: 100%;
		text-align: center;
	}
	.tui_sanren_2_1_1{
		width: 100%;
		
		
	}
	.sanfenpian image{
		width: 25rpx;
		height: 32rpx;
		margin-right: 20rpx;
	}
	.sanfenpian{
		position: absolute;
		top: -10rpx;
		left: 20rpx;	
		z-index: 99;
	}
	.tui_sanren_2_2{
		width: 60%;
		margin-top: 20rpx;
	}
	.tui_sanren_2_2_1{
		
		height: 180rpx;
		margin-bottom: 20rpx;
		box-shadow: 0px 1px 4px 2px rgba(183, 91, 0, 0.16);
		background: rgba(183, 91, 0, 0.16);
		border: 1px solid rgba(183, 91, 0, 0.1);
		position: relative;
		border-radius: 20rpx;
	}
	.tui_sanren_2_1{
		width: 35%;
		height: 380rpx;
		box-shadow: 0px 1px 4px 2px rgba(233, 0, 0, 0.16);
		background: rgba(233, 0, 0, 0.16);
		border: 1px solid rgba(233, 0, 0, 0.1);
		position: relative;
		border-radius: 20rpx;
	}
	.tui_sanren_2{
		display: flex;
		align-items: center;
		margin-top: 25rpx;
		justify-content: space-between;
	}
	.huo{
		margin-right: 20rpx;
	}
	.tui_sanren_1_1{
		display: flex;
		align-items: center;
	}
	
	.tui_sanren_1 image{
		width: 30rpx;
		height: 30rpx;
	}
	.tui_sanren_1{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.tui_sanren{
		border-radius: 10rpx;
		padding: 20rpx;
		margin: 20rpx;
		background: #fff;
	}
	.box_con {
		position: relative;
	}
	.tab,
	.item,
	.msg,
	.list,
	.task,
	.tip {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tab {
		width: 100%;
		height: 70rpx;
		background: #FFFFFF;
		justify-content: space-around;
		border-top: 1px solid #F8F8F8;

		.item {
			width: 12%;
			color: #666666;
			font-size: 30rpx;
			padding: 10rpx 0;
			margin-bottom: 5rpx;
			justify-content: center;
		}

		.tab_img {
			.top_img1 {
				width: 30rpx;
				height: 30rpx;
			}
		}

		.check {
			color: $uni-color-primary;
			border-bottom: 1px solid $uni-color-primary;
		}

		.choose {
			&>text {
				display: block;
				font-size: 20rpx;
				position: relative;
				right: -10rpx;
			}
		}
	}

	.msg {
		width: 100%;
		height: 70rpx;
		color: #FF0000;
		margin: 20rpx 0 0 0;
		font-size: 26rpx;
		background: #FFFFFF;
		justify-content: flex-start;

		&>image {
			width: 76rpx;
			height: 38rpx;
			margin: 0 20rpx 0 40rpx;
		}

		.swiper {
			width: 100%;
			height: 70rpx;
			line-height: 70rpx;
			// margin-top: 20rpx;
		}
	}

	.list {
		flex-wrap: wrap;
		margin: 20rpx 24rpx 0 24rpx;

		.task {
			width: 346rpx;
			height: 220rpx;
			padding: 15rpx;
			background: #FFFFFF;
			border-radius: 10rpx;
			margin-bottom: 20rpx;
			box-sizing: border-box;
			align-items: flex-start;
		
			.left {
				width: 80%;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.top {
					display: flex;

					&>image {
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
						margin-right: 20rpx;
					}

					&>view {
						width: 60%;
						font-size: 30rpx;

						&>text:first-child {
							color: #333333;
							display: block;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 1;
							overflow: hidden;
						}

						&>text:last-child {
							color: #FF0101;
						}
					}
				}

				.cen {
					&>text {
						color: #999999;
						font-size: 20rpx;
						padding: 6rpx 12rpx;
						background: #F2F1F1;
						border-radius: 10rpx;
					}

					&>text:first-child {
						margin-right: 15rpx;
					}
				}

				.bot {
					color: #999999;
					font-size: 20rpx;

					.hr {
						margin: 0 20rpx;
					}
				}
			}

			.right {
				width: 20%;
				display: flex;
				align-items: flex-start;
				justify-content: space-around;

				.right_img1 {
					width: 26rpx;
					height: 50rpx;
				}

				.right_img2 {
					width: 26rpx;
					height: 36rpx;
				}

			}
		}
	}

	.mask {
		z-index: 99;
		background: rgba(0, 0, 0, 0.6);
		position: fixed;
		bottom: 0;
		right: 0;
		left: 0;
		top: 72rpx;
	}

	.tip {
		width: 100%;
		z-index: 999;
		color: #999999;
		padding: 30rpx;
		padding-bottom:0rpx;
		flex-wrap: wrap;
		font-size: 26rpx;
		background: #FFFFFF;
		box-sizing: border-box;
		border-top: 1px solid #999999;
		position: fixed;

		&>view {
			width: 150rpx;
			height: 60rpx;
			line-height: 60rpx;
			text-align: center;
			background: #F5F5F5;
			margin-bottom: 30rpx;
			border-radius: 10rpx;
		}

		.che {
			color: #FFFFFF;
			background: $uni-color-primary;
		}
		
		
		.mater_btn {
			width: 100%;
			height: 80rpx;
			display: flex;
			justify-content: space-between;
		
			.mater_btn1 {
				width: 50%;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				background-color: #fff;
				color: #333;
				font-size: 28rpx;
				border:1px solid #eee;
			}
		
			.mater_btn2 {
				width: 50%;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				background-color: $uni-color-primary;
				color: #fff;
				font-size: 28rpx;
			}
		}
		
	}

	.lista {
		width: 95%;
		background-color: #F8F8F8;
		margin: 20rpx auto;

		.lefta {
			width: 100%;
		}

		.task {
			width: 100%;
			height: 140rpx;
			background-color: #FFFFFF;
			border-radius: 10rpx;
			margin-bottom: 20rpx;
			overflow: hidden;

			.top {
				width: 15%;
				height: 140rpx;
				background-color: #FFFFFF;
				float: left;
				overflow: hidden;
				position: relative;

				image {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);

				}
			}

			.cen {
				width: 85%;
				height: 69rpx;
				float: left;
				overflow: hidden;
				box-sizing: border-box;
				padding-left: 10rpx;
				.cen_word {
					margin-top: 20rpx;
					float: left;
					font-size: 30rpx;
				}

				.cen_img {
					float: left;

					image {
						width: 27rpx;
						height: 36rpx;
						margin-top: 25rpx;

					}
				}

				.cen_pic {
					float: right;
					margin-top: 14rpx;
					font-size: 30rpx;
					color: #FF0101;
					margin-right: 13rpx;
					font-weight: 600;
				}
			}

			.bom_word {
				float: left;
				width: 85%;
				height: 71rpx;
				margin-top: 12rpx;
				box-sizing: border-box;

				.bom_word1 {
					float: left;
					font-size: 20rpx;
					color: #999999;
					padding: 3px 6px;
					background: #F2F1F1;
					border-radius: 5px;
				}

				.bom_word2 {
					float: left;
					font-size: 20rpx;
					color: #999999;
					padding: 3px 6px;
					background: #F2F1F1;
					border-radius: 5px;
					margin-left: 20rpx;
				}

				.bom_word3 {
					float: right;
					margin-right: 12rpx;
					box-sizing: border-box;
					margin-top: 2rpx;

					.wrod_box1 {
						font-size: 20rpx;
						color: #999999;
						float: left;
					}

					.bom_wire {
						float: left;
						font-size: 20rpx;
						color: #999999;
					}

					.bom_worda {
						float: right;
						font-size: 20rpx;
						color: #999999;
					}
				}
			}
		}

	}

	.maskw {
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .3);
		position: fixed;
		z-index: 999;
		top: 0;
		left: 0;
		
		.mask_content {
			width: 100%;
			height: 75%;
			position: absolute;
			bottom: 0;
			left: 0;
			background-color: #FFFFFF;
			border-radius: 20rpx 20rpx 0 0;
			padding-bottom: 210rpx;
box-sizing: border-box;
			.mask_box {
				width: 100%;
				height: 100%;
				overflow: hidden;
				overflow-y: scroll;
			}

			.title {
				width: 100%;
				height: 68rpx;
				position: relative;

				.title_word {
					width: 100%;
					text-align: center;
					color: rgba(16, 16, 16, 100);
					font-size: 28rpx;
					line-height: 68rpx;

				}

				.t_img {
					width: 32rpx;
					height: 32rpx;
					position: absolute;
					top: 18rpx;
					right: 26rpx;
				}
			}

			.mask_type {
				color: rgba(16, 16, 16, 100);
				font-size: 26rpx;
				display: inline-block;
				margin: 46rpx 0 0 22rpx;
			}

			.type_content {
				width: 80%;
				margin: 20rpx auto 0;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;

				.type_con {
					width: 30%;
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
					background-color: #F4F4F4;
					color: rgba(153, 153, 153, 100);
					font-size: 24rpx;
					margin-bottom: 36rpx;
					border-radius: 16rpx;
				}
			}

			.mask_curriculum {
				color: rgba(16, 16, 16, 100);
				font-size: 26rpx;
				display: inline-block;
				margin: 0 0 0 22rpx;
			}

			.curriculum_content {
				width: 80%;
				margin: 20rpx auto 0;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;

				.curriculum_con {
					width: 30%;
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
					background-color: #F4F4F4;
					color: rgba(153, 153, 153, 100);
					font-size: 24rpx;
					margin-bottom: 36rpx;
					border-radius: 16rpx;
				}
			}

			.mask_classification {
				color: rgba(16, 16, 16, 100);
				font-size: 26rpx;
				display: inline-block;
				margin: 0 0 0 22rpx;
			}

			.classification_content {
				width: 80%;
				margin: 20rpx auto 0;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;

				.classification_con {
					width: 30%;
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
					background-color: #F4F4F4;
					color: rgba(153, 153, 153, 100);
					font-size: 24rpx;
					margin-bottom: 36rpx;
					border-radius: 16rpx;
				}
			}

			.mater_btn {
				width: 85%;
				height: 80rpx;
				display: flex;
				justify-content: space-between;
				position: fixed;
				bottom: 126rpx;
				left: 50%;
				transform: translateX(-50%);

				.mater_btn1 {
					width: 240rpx;
					height: 80rpx;
					line-height: 80rpx;
					text-align: center;
					background-color: #D7D7D7;
					border-radius: 2000rpx;
					color: rgba(255, 255, 255, 100);
					font-size: 28rpx;
				}

				.mater_btn2 {
					width: 240rpx;
					height: 80rpx;
					line-height: 80rpx;
					text-align: center;
					background-color: $uni-color-primary;
					border-radius: 2000rpx;
					color: rgba(255, 255, 255, 100);
					font-size: 28rpx;
				}
			}

			.type_boxae {
				background-color: $uni-color-primary;
				
				color: rgba(255, 255, 255, 100);
				border-radius: 16rpx;
			}

			.mask_price {
				color: rgba(16, 16, 16, 100);
				font-size: 26rpx;
				display: inline-block;
				margin: 0 0 0 22rpx;
			}

			.mask_price_box {
				width: 80%;
				margin: 20rpx auto 0;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;

				.mask_price_con {
					width: 30%;
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
					background-color: #F4F4F4;
					color: rgba(153, 153, 153, 100);
					font-size: 24rpx;
					margin-bottom: 36rpx;
					border-radius: 16rpx;
					box-sizing: border-box
				}
			}

			.mask_level {
				color: rgba(16, 16, 16, 100);
				font-size: 26rpx;
				display: inline-block;
				margin: 0 0 0 22rpx;
			}

			.mask_level_box {
				width: 80%;
				margin: 20rpx auto 0;
				display: flex;
				justify-content: space-between;

				flex-wrap: wrap;

				.mask_level_con {
					width: 30%;
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
					background-color: #F4F4F4;
					color: rgba(153, 153, 153, 100);
					font-size: 24rpx;
					margin-bottom: 36rpx;
					border-radius: 16rpx;
					box-sizing: border-box
				}

				.a-bxo {
					width: 30%;
				}
			}
		}
	}
</style>
