<template>
	<!-- 今日收益页面 -->
	<view style="background-color: #FFFFFF;height: 100%;">
		<view class="sycontent" v-for="item in shoyyimingxList" :key="item.id">
			<p style="font-size: 45rpx;text-align: center;padding: 30rpx 0;color: #FFFFFF;">{{item.gold}}</p>
			<p style="font-size: 30rpx;text-align: center;color:#FFFFFF;">金币余额</p>
			<view class="table">
				<view>
					<p style="color: #FFFFFF;">{{item.today_profit}}</p>
					<p style="color: #FFFFFF;">今日收益(个)</p>
				</view>
				<view>
					<p style="color: #FFFFFF;">{{item.Cumulative_profit}}</p>
					<p style="color: #FFFFFF;">累计收益(个)</p>
				</view>
			</view>
		</view>
		
		<!-- 选项卡 -->
		<view class="inv-h-w">
			<view :class="['inv-h',Inv==1?'inv-h-se':'']" @click="tgp(1)">全部明细</view>
			<view :class="['inv-h',Inv==2?'inv-h-se':'']" @click="tgp(2)">收入明细</view>
			<view :class="['inv-h',Inv==3?'inv-h-se':'']" @click="tgp(3)">支出明细</view>
		</view>
		<!-- 充值明细-->
		<!-- 内容 -->
		<view class="bgac">
				<view class="order_list" v-for="(arr,index) in syList"  :key="index">
					<p style="font-size: 28rpx;">{{arr.remarks}}</p>
					<p style="font-size: 22rpx;color: #333333;">{{arr.createtime}}</p>
					<view class="post" v-if="arr.account_type">
						<view v-if="arr.account_type==1">+{{arr.amount}}个</view>
						<view v-if="arr.account_type==2">-{{arr.amount}}个</view>
						</view>
					<view class="post" v-else="">+{{arr.amount}}个</view>
				</view>
			
		</view>
		<!-- 选项卡 -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				Inv: 1,
				token: '',
				type: 1,
				shoyyimingxList: [],
				syList: [],
				page:1,
				loadingText:'加载中...',
				last_page:'',
				
			}
		},
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url: "/pages/mine/wallet/illustrate"
			})
		},
		onShow() {
			this.getMyCard()
		},
		onReachBottom() {
			let that =this;
			if(that.page>that.last_page){
				uni.showToast({
					title:"已加载全部数据",
					icon:'none'
				})
			}else{
				that.page++
				that.getnewsList(that.page);
			}
				 
		},
		methods: {
			//列表数据请求
			getMyCard() {
				let that = this
			     uni.request({
					url:this.global.url+"/api/user/myGold",
					method:"POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data:{
						token: uni.getStorageSync("token").token,
						type: that.type,
						page:that.page
					},
					success: (res) => {
						if(res.data.code == 1){
							console.log(res)
							that.shoyyimingxList = [res.data.data];
							that.syList = res.data.data.profit;
							that.last_page = res.data.data.profit.last_page;
						}
					}
				})
			},
			//根据type值获取不同列表的数据
			tgp(e) {
				let that = this;
				that.Inv = e;
				that.type = e;
				that.page = 1;
				that.syList=[];
				that.getnewsList(that.page);
				
			},
			////屏幕到底部时候触发此事件
			getnewsList(page) {
				let  that =this;
				uni.request({
					url:this.global.url+"/api/user/myGold",
					method:"POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data:{
						token: uni.getStorageSync("token").token,
						type: that.type,
						page:that.page
					},
					success: (res) => {
						if(res.data.code == 1){
							that.last_page = res.data.data.last_page;
							that.syList = that.syList.concat(res.data.data.profit)
						}
					}
				})
			},
			tixian() {
				uni.navigateTo({
					url: "/pages/mine/wallet/withdrawal"
				})
			},
			chongzhi() {
				uni.navigateTo({
					url: "/pages/mine/wallet/recharge"
				})
			},
			getMyTx() {
				let token = uni.getStorageSync("token")
				let card = token.token
				let that = this
				let type = 2
				that.request('/api/user/wallet', {
					method: 'POST',
					token: card,
					type: type
				}).then(res => {
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.bgac {
		background-color: #FFFFFF;
	}

	.sycontent {
		width: 100%;
		height: 350rpx;
		background-color: #017ff0;
	}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	button {
		color: red;
		width: 15%;
		text-align: center;
		border: 1px solid red;
		font-size: 24rpx;
		// text-align: center;
		line-height: 0 !important;
		padding: 25rpx 0;
		border-radius: 30rpx;
	}
	.table {
		display: flex;
		justify-content: center;
		padding: 30rpx 0;
	}

	.table view {
		width: 50%;
	}

	.table view p {
		padding: 10rpx 0;
		font-size: 28rpx;
		text-align: center;
	}

	// 选项卡样式
	.inv-h-w {
		background-color: #FFFFFF;
		// height: 60rpx;
		display: flex;
		justify-content: flex-start;
		width: 100%;
	}

	.inv-h {
		width: 15%;
		font-size: 28rpx;
		text-align: center;
		color: #C9C9C9;
		margin: 0 30rpx;
		height: 80rpx;
		line-height: 80rpx;
	}

	.inv-h-se {
		color: #017ff0;
		border-bottom: 2px solid #017ff0;
	}

	.order_list {
		border-bottom: 1px solid #eeeeee;
		position: relative;
	}

	.post {
		color: red;
		position: absolute;
		top: 30rpx;
		right: 70rpx;
		font-size: 34rpx;
		font-weight: 500;
	}

	.order_list p {
		margin: 20rpx;
	}
</style>
