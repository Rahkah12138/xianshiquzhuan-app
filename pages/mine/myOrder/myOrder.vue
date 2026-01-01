<template>
	<view class="order-container">
		<!-- Tabs -->
		<view class="tabs-container">
			<view :class="['tab-item', Inv === 5 ? 'active' : '']" @click="TapList(5)">全部</view>
			<view :class="['tab-item', Inv === 1 ? 'active' : '']" @click="TapList(1)">待提交</view>
			<view :class="['tab-item', Inv === 2 ? 'active' : '']" @click="TapList(2)">审核中</view>
			<view :class="['tab-item', Inv === 3 ? 'active' : '']" @click="TapList(3)">不合格</view>
			<view :class="['tab-item', Inv === 4 ? 'active' : '']" @click="TapList(4)">已完成</view>
		</view>

		<!-- Order List -->
		<view class="order-list">
			<view class="order-card" v-for="(item, index) in ddList" :key="index">
				<template v-if="!item.record_id">
					<view class="card-header">
						<image class="avatar" :src="item.avatar && item.avatar.includes('http') ? item.avatar : global.url + item.avatar" mode="aspectFill"></image>
						<view class="header-content">
							<view class="title-row">
								<span class="title">{{item.title}}</span>
								<image v-if="item.top == 1" class="top-icon" src="/static/user/xsd.png"></image>
							</view>
							<view class="tag">{{item.entryname.substring(0,4)}}</view>
						</view>
						<view class="price">+{{item.price}}元</view>
					</view>
					<view class="card-footer">
						<span class="time">{{item.createtime}}</span>
						<view class="actions">
							<template v-if="item.status !== '待提交'">
								<button class="btn-status" @click="reason(item.status, item.id)">{{item.status}}</button>
								<button class="btn-action" v-if="item.is_jubao" @click="createRoom(item.tasklist_id)">申诉</button>
							</template>
							<template v-else>
								<button class="btn-status" @click="order(item.tasklist_id, item.id, item.status)">{{item.status}}</button>
								<button class="btn-action" @click="giveUp(item.id)">放弃</button>
							</template>
						</view>
					</view>
					<view class="unqualified-actions" v-if="item.status === '不合格'">
						<button @click="giveup(item.id)">放弃任务</button>
						<button @click="report(item.trade_no, item.id)">举报任务</button>
						<button @click.stop="order(item.tasklist_id, item.id, item.status)">重新提交</button>
					</view>
				</template>
				<template v-else>
					<view class="card-header">
						<image class="avatar" :src="item.task_icon" mode="aspectFill"></image>
						<view class="header-content">
							<view class="title-row">
								<span class="title">{{item.title}}</span>
							</view>
							<view class="tag">{{item.project_tag}}</view>
						</view>
						<view class="price">+{{item.amount}}元</view>
					</view>
					<view class="card-footer">
						<span class="time">{{item.last_opt_time}}</span>
					</view>
				</template>
			</view>
		</view>

		<!-- Popups -->
		<view v-show="isJoin" @touchmove.stop.prevent="stopSlide">
			<view class="mask" @click="join"></view>
			<view class="prompt-box" v-if="info">
				<image src="/static/detail/del.png" class="close-img" @click.stop="join"></image>
				<view class="prompt-title">
					<image src="/static/release/yellow.png"></image>
					<text>提示</text>
				</view>
				<view class="prompt-text" v-if="info.content === undefined">不合格原因: {{info}}</view>
				<view class="prompt-text" v-if="info.content !== undefined">
					<view>不合格原因: {{info.content}}</view>
					<view class="prompt-images" @click="perviewImg">
						<image v-for="(img, idx) in info.image" :key="idx" :src="img" mode="aspectFill"></image>
					</view>
				</view>
			</view>
		</view>

		<view v-show="isgive" @touchmove.stop.prevent="stopSlide">
			<view class="mask" @click="isgive = !isgive"></view>
			<view class="tip-del">
				<view class="tip-top">
					<image src="/static/release/yellow.png" mode="widthFix"></image>任务提醒
				</view>
				<view class="tip-titdel">是否放弃该任务？</view>
				<view class="tip-btn">
					<view @click="isgive = false">取消</view>
					<view @click="ToGiveUp">确认</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const xuanshangModule = uni.requireNativePlugin('LingKu-XuanShangModule');
	export default {
		data() {
			return {
				Inv: 1,
				type: '',
				ddList: [],
				page: 1,
				totalPage: '',
				isJoin: false,
				info: '',
				isgive: false,
				orderId: ''
			}
		},
		onLoad(e) {
			this.userInfo = uni.getStorageSync('token')
			this.Inv = e.type;
		},
		onShow() {
			this.TapList(this.Inv)
		},
		onReachBottom() {
			let that = this;
			if (that.page > that.totalPage) {

			} else {
				that.page++;
				that.cadbcd(that.page)
			}
		},
		methods: {
			wa_order(task_id) {
				var param = {
					'userId': this.userInfo.user_id,
					'pageRouter': 'task_union_detail?task_id=' + task_id
				}
				xuanshangModule.show(param);
			},
			createRoom(id) {
				uni.request({
					url: this.global.url + '/api/message/createRoom',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						id: id,
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						console.log(res.data)
						if (res.data.code == 1) {
							uni.navigateTo({
								url: '/pages/home/subpage/consultDetail?room_id=' + res.data.data.room_id
							})
						}
					}
				})
			},
			// 跳转对话
			lianzhu: function(a) {
				uni.navigateTo({
					url: '/pages/member/duihua?id=' + a
				})
			},

			// 关闭弹窗
			join() {
				let that = this;
				that.isJoin = !that.isJoin;
			},
			cadbcd(page) {

				let that = this;
				uni.request({
					url: that.global.url + "/api/order/index",
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
						page: that.page,
						type: that.Inv
					},
					success: (res) => {
						console.log('列表', res)
						if (res.data.code == 1 && res.data.data.data.length > 0) {
							that.totalPage = res.data.data.last_page;
							that.ddList = that.ddList.concat(res.data.data.data)
						} else {

						}

					}
				})
				that.getWaList()
			},
			getWaList() {
				let that = this;
				let type = that.Inv == 3 ? 3 : that.Inv == 4 ? 2 : (that.Inv - 1)
				let url = "https://api.xuanshangwa.com.cn/web/unionApi/act/task_list_my"
				url += '?token=' + uni.getStorageSync('wa_token') + '&page=' + Number(that.page) + '&limit=10&type=' + Number(
					type)
				console.log('蛙类型', type, url)
				uni.request({
					url: url,
					method: "GET",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {},
					success: (res) => {
						console.log('蛙列表', res)
						res.data.data.list = res.data.data.list.map(item => {
							item.createtime = item.last_opt_time
							return item
						})
						console.log(res.data.data.list)
						that.ddList = that.ddList.concat(res.data.data.list)
						that.ddList = that.ddList.sort((a, b) => {
							const timeA = new Date(a.createtime).getTime();
							const timeB = new Date(b.createtime).getTime();

							// 降序排列，最新的在前面
							return timeB - timeA;
						});
						console.log('蛙列表1111', that.ddList)
					}
				})
			},
			TapList(e) {
				let that = this;
				that.Inv = e;
				that.type = e;
				that.page = 1;
				that.ddList = [];
				that.cadbcd(that.page);
			},
			order(e, a, c) {
				// 跳转到订单详情

				if (c == '不合格') {
					uni.navigateTo({
						url: "/pages/mine/rewardManagement/orderunqualified/orderunqualified?tasklist_id=" + e +
							'&orderId=' + a
					})
				} else {
					uni.navigateTo({
						url: "/pages/task/detail?id=" + e
					})
				}

			},
			getImgUrl(imae) {
				return this.global.url + imae;
			},
			reason(name, id) {
				let that = this;
				if (name == '不合格') {
					let that = this;
					uni.request({
						url: this.global.url + '/api/order/reject',
						method: "POST",
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							token: uni.getStorageSync("token").token,
							orderId: id
						},
						success: (res) => {
							if (res.data.code == 1) {
								that.isJoin = !that.isJoin;
								that.info = res.data.data
							}

						}
					})

				}
			},
			giveUp(id) {

				let that = this;
				uni.request({
					url: this.global.url + '/api/task/giveup',
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
						orderId: id
					},
					success: (res) => {
						that.info = res.data.data

						that.page = 1;
						that.ddList = []
						that.TapList(that.Inv)

						uni.showToast({
							title: '放弃成功',
							icon: 'success',
							duration: 2000,
						})

					}
				})
			},
			//举报任务
			report(trade_no, id) {
				uni.navigateTo({
					url: '/pages/task/report?id=' + trade_no + '&order_id=' + id
				})
			},
			giveup(id) {
				this.isgive = true
				this.orderId = id
			},
			// 放弃任务
			ToGiveUp() {
				uni.request({
					url: this.global.url + '/api/task/giveup',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						orderId: this.orderId,
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})
						if (res.data.code == 1) {
							this.isgive = false
							this.ddList = []
							this.cadbcd()

						}
					}
				})
			},
			// 预览图片
			perviewImg() {
				let that = this;
				if (that.info.content != undefined) {
					uni.previewImage({
						urls: that.info.image,
						indicator: 'number',
						loop: true
					});
				}

			},
		}
	}
</script>

<style scoped lang="scss">
	.order-container {
		background-color: #f8f8f8;
		min-height: 100vh;
	}

	.tabs-container {
		background-color: #ffffff;
		display: flex;
		justify-content: space-around;
		border-bottom: 1px solid #eeeeee;
	}

	.tab-item {
		font-size: 30rpx;
		color: #999;
		padding: 20rpx 0;
		cursor: pointer;
		transition: color 0.3s ease;
		border-bottom: 2px solid transparent;
		flex: 1;
		text-align: center;
		font-weight: bold;
	}

	.tab-item.active {
		color: $uni-color-primary;
		border-bottom: 2px solid $uni-color-primary;
	}

	.order-list {
		padding: 20rpx;
	}

	.order-card {
		background-color: #ffffff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.card-header {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.header-content {
		flex: 1;
	}

	.title-row {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
	}

	.top-icon {
		width: 26rpx;
		height: 36rpx;
		margin-left: 10rpx;
	}

	.tag {
		font-size: 24rpx;
		color: #999;
		background-color: #f0f0f0;
		padding: 4rpx 12rpx;
		border-radius: 10rpx;
		display: inline-block;
	}

	.price {
		font-size: 30rpx;
		font-weight: bold;
		color: $uni-color-primary;
	}

	.card-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 24rpx;
		color: #999;
	}

	.actions {
		display: flex;
		gap: 20rpx;
	}

	.btn-status,
	.btn-action {
		font-size: 24rpx;
		padding: 6rpx 16rpx;
		border-radius: 10rpx;
		border: 1px solid;
	}

	.btn-status {
		color: $uni-color-primary;
		border-color: $uni-color-primary;
	}

	.btn-action {
		color: #999;
		border-color: #999;
	}

	.unqualified-actions {
		display: flex;
		justify-content: flex-end;
		gap: 20rpx;
		margin-top: 20rpx;
		padding-top: 20rpx;
		border-top: 1px solid #f0f0f0;

		button {
			font-size: 24rpx;
			padding: 8rpx 20rpx;
			border-radius: 10rpx;
			color: #fff;
			background-color: $uni-color-primary;
		}
	}

	.mask {
		z-index: 99;
		background: rgba(0, 0, 0, 0.4);
		position: fixed;
		bottom: 0;
		right: 0;
		left: 0;
		top: 0;
	}

	.prompt-box {
		width: 80%;
		max-width: 600rpx;
		z-index: 999;
		background: #ffffff;
		border-radius: 20rpx;
		overflow: hidden;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		padding: 30rpx;
	}

	.close-img {
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		right: 20rpx;
		top: 20rpx;
	}

	.prompt-title {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 34rpx;
		margin-bottom: 30rpx;

		image {
			width: 50rpx;
			height: 50rpx;
			margin-right: 20rpx;
		}
	}

	.prompt-text {
		font-size: 28rpx;
		text-align: center;
	}

	.prompt-images {
		display: flex;
		gap: 20rpx;
		margin-top: 20rpx;
		justify-content: center;

		image {
			width: 150rpx;
			height: 150rpx;
			border-radius: 10rpx;
		}
	}

	.tip-del {
		z-index: 999;
		width: 480rpx;
		background: #ffffff;
		border-radius: 10rpx;
		overflow: hidden;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		padding: 30rpx;
	}

	.tip-top {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		margin-bottom: 20rpx;

		image {
			width: 30rpx;
			height: 30rpx;
			margin-right: 20rpx;
		}
	}

	.tip-titdel {
		font-size: 28rpx;
		text-align: center;
		margin-bottom: 40rpx;
	}

	.tip-btn {
		display: flex;
		font-size: 28rpx;

		view {
			flex: 1;
			text-align: center;
			padding: 15rpx 0;
			border-radius: 10rpx;
		}

		view:first-child {
			background-color: #f0f0f0;
			color: #333;
			margin-right: 10rpx;
		}

		view:last-child {
			background-color: $uni-color-primary;
			color: #ffffff;
			margin-left: 10rpx;
		}
	}
</style>
