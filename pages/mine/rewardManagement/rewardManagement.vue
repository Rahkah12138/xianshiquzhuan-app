<template>
	<view class="reward-container">
		<!-- Tabs -->
		<view class="tabs-container">
			<view :class="['tab-item', Inv==1?'active':'']" @click="TapList(1)">已上架({{online}})</view>
			<view :class="['tab-item', Inv==2?'active':'']" @click="TapList(2)">已暂停({{stop}})</view>
			<view :class="['tab-item', Inv==3?'active':'']" @click="TapList(3)">待上架({{wait}})</view>
			<view :class="['tab-item', Inv==4?'active':'']" @click="TapList(4)">未通过({{no}})</view>
			<view :class="['tab-item', Inv==5?'active':'']" @click="TapList(5)">已下架({{down}})</view>
		</view>

		<!-- Skeleton Loading -->
		<view v-if="isLoading" class="reward-list">
			<view class="reward-card" v-for="i in 3" :key="i">
				<view class="card-header">
					<view class="skeleton-avatar skeleton-animate"></view>
					<view class="header-content">
						<view class="skeleton-line skeleton-animate" style="width: 70%; height: 30rpx;"></view>
						<view class="skeleton-line skeleton-animate" style="width: 40%; height: 32rpx; margin-top: 10rpx;"></view>
					</view>
				</view>
				<view class="card-body">
					<view class="info-row" v-for="j in 2" :key="j">
						<view class="skeleton-line skeleton-animate" style="width: 40%;"></view>
						<view class="skeleton-line skeleton-animate" style="width: 30%;"></view>
					</view>
				</view>
				<view class="card-footer">
					<view class="skeleton-line skeleton-animate" v-for="k in 4" :key="k" style="width: 100rpx; height: 40rpx;"></view>
				</view>
			</view>
		</view>

		<!-- Reward List -->
		<view v-else class="reward-list">
			<view class="reward-card" v-for="(item,index) in ddList" :key="index">
				<view class="card-header" @click="goDetail(item.id)">
					<image class="avatar" :src="item.avatar" mode="aspectFill"></image>
					<view class="header-content">
						<view class="title-row">
							<span class="title">{{item.title}}</span>
							<image v-if="item.top==1" class="icon" src="/static/shouye/icon_ding1@2x.png"></image>
							<image v-if="item.is_jisu==1" class="icon" src="/static/index/kuaishen.png"></image>
							<image v-if="item.recommend==1" class="icon" src="/static/shouye/icon_tui@2x.png"></image>
							<image v-if="item.ensure==1" class="icon" src="/static/shouye/icon_bao@2x.png"></image>
						</view>
						<view class="price">+{{item.price}}元</view>
					</view>
				</view>
				<view class="card-body">
					<view class="info-row">
						<span>浏览次数：{{item.view?item.view:0}} 次</span>
						<span>{{item.tasktype}} &nbsp;&nbsp;{{item.entryname}}</span>
					</view>
					<view class="info-row">
						<span>已赚：{{item.received}}</span>
						<span>剩余：{{item.surplus}}</span>
					</view>
				</view>

				<!-- Actions -->
				<view class="card-actions" v-if="type==1||type==2">
					<button @click="toExamine(item.id)">
						<image src="/static/user/xssh.png"></image>
						审核：{{item.to_examine}}
					</button>
					<button @click="dosage(item)">
						<image src="/static/user/icon_jia.png"></image>
						加量/加价
					</button>
					<button v-if="type==1" @click="suspendTask(item.id)">
						<image src="/static/user/xsplay.png"></image>
						暂停
					</button>
				</view>

				<view class="card-footer" v-if="type==1">
					<button @click="dian_zhiding" :data-fei='item.recommend_fee' :data-id='item.id'>
						<image src="../../../static/xuanshangguan/icon_recommend@2x.png"></image>
						置顶包
					</button>
					<button @click="buyRefreshbag()">
						<image src="/static/user/icon_shua.png"></image>
						刷新包
					</button>
					<button @click="chooseTop(item.top_fee,item.id)">
						<image src="/static/user/zd.png"></image>
						置顶
					</button>
					<button @click="before_renovate(item.id)">
						<image src="/static/user/icon_shua.png"></image>
						刷新
					</button>
					<button @click="open(item.id,index)">
						<image src="/static/user/icon_shua.png"></image>
						急速审核
					</button>
				</view>

				<view class="card-footer" v-if="type==2">
					<button @click="putOnTheShelves(item.id)">
						<image src="/static/user/xsdsj.png"></image>
						重新上架
					</button>
					<button @click="editOrder(item.id,item)">
						<image src="/static/user/xsdsj.png"></image>
						编辑
					</button>
					<button @click="downTask(item.id)">
						<image src="/static/user/xsdel.png"></image>
						下架
					</button>
				</view>

				<view class="card-footer" v-if="type==3">
					<button @click="reason(item.id,item.status)">
						<image src="/static/user/xssh.png"></image>
						{{item.status==0?'审核中':"已驳回"}}
					</button>
					<button @click="editOrder(item.id,item)">
						<image src="/static/user/xsdsj.png"></image>
						编辑
					</button>
					<button @click="downTask(item.id)">
						<image src="/static/user/xsdel.png"></image>
						下架
					</button>
				</view>

				<view class="card-footer" v-if="type==4">
					<button @click="reason(item.id,item.status)">
						<image src="/static/user/xssh.png"></image>
						已驳回
					</button>
					<button @click="editOrder(item.id,item)">
						<image src="/static/user/xsdsj.png"></image>
						编辑
					</button>
					<button @click="downTask(item.id)">
						<image src="/static/user/xsdel.png"></image>
						下架
					</button>
				</view>

				<view class="card-footer" v-if="type==5">
					<button @click="resendOrder(item.id)">
						<image src="/static/user/xsdsj.png"></image>
						重发
					</button>
					<button @click="deleteTask(item.id)">
						<image src="/static/user/xsdel.png"></image>
						删除
					</button>
				</view>
			</view>
		</view>

		<!-- 置顶选择弹窗 -->
		<view class="popup-mask" v-if="show" @click="quxiao" @touchmove.stop.prevent="stopSlide">
			<view class="popup-box" @click.stop>
				<view class="popup-title">选择置顶方式</view>
				<view class="popup-content">
					<view class="popup-btn" @click="openPopup2">使用余额置顶</view>
					<view class="popup-btn" @click="useTopbag">使用置顶包（剩余{{tophour}}小时）</view>
				</view>
				<view class="popup-cancel" @click="quxiao">取消</view>
			</view>
		</view>

		<!-- 通用确认弹窗 -->
		<view class="popup-mask" v-if="isJoin" @click="qx" @touchmove.stop.prevent="stopSlide">
			<view class="popup-box" @click.stop>
				<!-- 余额置顶 -->
				<template v-if="pop_cont==1">
					<view class="popup-title">置顶任务</view>
					<view class="popup-content">
						<view class="input-group">
							<text>置顶时长（小时）</text>
							<input type="number" v-model="dataMony" placeholder="请输入小时数" />
						</view>
						<view class="price-info">置顶费用：{{price}}元/小时</view>
						<view class="price-info">需支付：{{mony || 0}}元</view>
					</view>
					<view class="popup-actions">
						<view class="popup-btn cancel" @click="qx">取消</view>
						<view class="popup-btn confirm" @click="showPopup">确定</view>
					</view>
				</template>

				<!-- 暂停确认 -->
				<template v-if="pop_cont==2">
					<view class="popup-title">暂停任务</view>
					<view class="popup-content">
						<text>确定要暂停该任务吗？</text>
					</view>
					<view class="popup-actions">
						<view class="popup-btn cancel" @click="qx">取消</view>
						<view class="popup-btn confirm" @click="ConfirmSuspension">确定</view>
					</view>
				</template>

				<!-- 重新上架确认 -->
				<template v-if="pop_cont==3">
					<view class="popup-title">重新上架</view>
					<view class="popup-content">
						<text>确定要重新上架该任务吗？</text>
					</view>
					<view class="popup-actions">
						<view class="popup-btn cancel" @click="qx">取消</view>
						<view class="popup-btn confirm" @click="ConfirmShelves">确定</view>
					</view>
				</template>

				<!-- 删除确认 -->
				<template v-if="pop_cont==4">
					<view class="popup-title">删除任务</view>
					<view class="popup-content">
						<text>确定要删除该任务吗？删除后无法恢复</text>
					</view>
					<view class="popup-actions">
						<view class="popup-btn cancel" @click="qx">取消</view>
						<view class="popup-btn confirm" @click="ConfirmDelete">确定</view>
					</view>
				</template>

				<!-- 使用置顶包 -->
				<template v-if="pop_cont==5">
					<view class="popup-title">使用置顶包</view>
					<view class="popup-content">
						<view class="input-group">
							<text>置顶时长（小时）</text>
							<input type="number" v-model="hours" @input="setInt" placeholder="请输入小时数" />
						</view>
						<view class="price-info">剩余置顶包时长：{{tophour}}小时</view>
					</view>
					<view class="popup-actions">
						<view class="popup-btn cancel" @click="qx">取消</view>
						<view class="popup-btn confirm" @click="showPopup2">确定</view>
					</view>
				</template>

				<!-- 刷新确认 -->
				<template v-if="pop_cont==6">
					<view class="popup-title">刷新任务</view>
					<view class="popup-content">
						<text>确定要刷新该任务吗？</text>
					</view>
					<view class="popup-actions">
						<view class="popup-btn cancel" @click="qx">取消</view>
						<view class="popup-btn confirm" @click="renovate">确定</view>
					</view>
				</template>

				<!-- 下架确认 -->
				<template v-if="pop_cont==7">
					<view class="popup-title">下架任务</view>
					<view class="popup-content">
						<text>确定要下架该任务吗？</text>
					</view>
					<view class="popup-actions">
						<view class="popup-btn cancel" @click="qx">取消</view>
						<view class="popup-btn confirm" @click="ConfirmDown">确定</view>
					</view>
				</template>
			</view>
		</view>

		<!-- 驳回理由弹窗 -->
		<view class="popup-mask" v-if="isReason" @click="close" @touchmove.stop.prevent="stopSlide">
			<view class="popup-box" @click.stop>
				<view class="popup-title">驳回理由</view>
				<view class="popup-content">
					<text>{{info}}</text>
				</view>
				<view class="popup-actions">
					<view class="popup-btn confirm" @click="close">我知道了</view>
				</view>
			</view>
		</view>

		<!-- 急速审核弹窗 -->
		<uni-popup ref="popup">
			<view class="jisu-popup">
				<view class="jisu-title">急速审核设置</view>
				<view class="jisu-content">
					<view class="jisu-item">
						<text>1小时审核</text>
						<switch :checked="time==0" @change="select1" />
					</view>
					<view class="jisu-item">
						<text>30分钟审核</text>
						<switch :checked="time==1" @change="select2" />
					</view>
					<view class="jisu-item">
						<text>15分钟审核</text>
						<switch :checked="time==2" @change="select3" />
					</view>
				</view>
				<view class="jisu-actions">
					<view class="jisu-btn cancel" @click="popupclose">取消</view>
				</view>
			</view>
		</uni-popup>

		<view class="fab-button" @click="goPublish">+</view>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				isLoading: true,
				renovate_id: '',
				hours: '',
				show: false,
				Inv: '',
				type: 1,
				ddList: [],
				mony: '',
				dataMony: '',
				price: '',
				isJoin: false,
				cid: '',
				pop_cont: 1,
				suspend: '',
				totalPage: '',
				page: 1,
				isReason: false,
				info: '',
				tuijian_d: false,
				xs: '',
				xs_mon: '',
				tuijianfei: '',
				bbid: '',
				time: 3, //当前选中时间类型 0：1H 1：30mine 2：15mime
				newID: null,
				tophour: 0,
				online: 0,
				stop: 0,
				wait: 0,
				no: 0,
				down: 0,
			}
		},
		watch: {
			dataMony(newValue, oldValue) {
				this.mony = newValue * this.price

			}
		},
		onShow(e) {
			this.getTopbag()
			this.ddList = [];
			this.cadbcd(1)
		},
		onLoad(e) {
			this.Inv = e.type;
			this.type = e.type;

		},
		onReachBottom() {
			let that = this;
			if (that.page > that.last_page) {

			} else {
				that.page++
				that.cadbcd(that.page);
			}
		},
		methods: {
			setInt() {
				console.log('input')
				console.log(this.hours)
				console.log(parseInt(this.hours))
				let hours = parseInt(this.hours)
				this.hours = hours
			},
			getTopbag() {
				let that = this;
				uni.request({
					url: that.global.url + "/api/user/topbag",
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,

					},
					success: (res) => {

						if (res.data.code == 1) {
							that.tophour = res.data.data.tophour




						}

					}
				})
			},
			popupok(val) {
				var that = this
				const time = this.time == 0 ? 3600 : this.time == 1 ? 1800 : 900
				uni.request({
					url: this.global.url + '/api/task/bindjisu',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token,
						id: that.newID,
						jisu_time: time,
						is_open: val ? 1 : 0,
					},
					success: (res) => {
						this.$refs.popup.close()
						uni.showToast({
							title: res.data.msg,
							icon: 'none',
							success() {
								that.select(time)
								for (let i = 0; i < that.ddList.length; i++) {
									if (that.ddList[i].id == that.newID) {

										that.ddList[i].jisu_time = time

										that.ddList = [];
										that.page = 1;
										that.cadbcd(that.page);

									}
								}
								// that.$refs.popup.close()
							}
						})
					}
				})
			},
			popupclose() {
				var that = this
				that.$refs.popup.close()
				return;
				uni.request({
					url: this.global.url + 'api/task/unbindjisu',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token,
						id: that.newID,


					},
					success: (res) => {
						uni.showToast({
							title: res.data.msg,
							icon: 'none',
							success() {
								that.$refs.popup.close()
							}
						})
					}
				})

			},
			select1(e) {
				this.time = 0
				let val = e.detail.value
				this.popupok(val)
			},
			select2(e) {
				this.time = 1
				let val = e.detail.value
				this.popupok(val)
			},
			select3(e) {
				this.time = 2
				let val = e.detail.value
				this.popupok(val)
			},

			select(type) {
				if (type == 3600) {
					this.time = 0
				} else if (type == 1800) {
					this.time = 1
				} else if (type == 900) {
					this.time = 2
				} else {
					this.time = 3

				}

			},
			open(id, index) {
				this.newID = id
				let data = this.ddList[index]
				this.select(data['jisu_time'])
				this.$refs.popup.open('center')
			},
			ppp: function() {

			},

			// 修改小时
			gaijine: function(e) {
				var that = this



				that.xs_mon = e.detail.value * that.tuijianfei


			},


			// 确定		
			quedingtui: function(e) {
				var that = this

				if (!that.xs || that.xs < 0) {
					uni.showToast({
						title: '请输入正确的时间',
						icon: 'none',

					})
					console.log(that.xs)
					return false
				}
				uni.request({
					url: this.global.url + 'api/task/recommend',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token,
						taskId: this.bbid,
						time: this.xs,
						money: this.xs_mon

					},
					success: (res) => {
						uni.showToast({
							title: res.data.msg,
							icon: 'none',
							success() {
								that.tuijian_d = false
							}
						})
					}
				})


			},


			// 隐藏推荐
			quxiao_t: function() {
				var that = this
				that.tuijian_d = false
			},

			dian_zhiding: function(e) {

				uni.navigateTo({
					url: "/pages/mine/wallet/top"
				})


				return;

				var that = this
				console.log(e)
				that.xs = ''
				that.xs_mon = 0
				that.tuijianfei = e.currentTarget.dataset.fei
				that.bbid = e.currentTarget.dataset.id
				that.tuijian_d = true



			},




			close() {
				let that = this;
				that.isReason = !that.isReason;
			},
			// 驳回理由
			reason(id, type) {


				let that = this;
				uni.request({
					url: this.global.url + '/api/task/reject',
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
						taskId: id
					},
					success: (res) => {
						if (res.data.code == 1) {
							that.isReason = !that.isReason;
							that.info = res.data.data;
							that.closeReason = !that.closeReason;
						}


					}
				})

			},
			//禁止页面滚动(规避警告)
			stopSlide() {
				return
			},
			quxiao() {

				this.show = false
			},
			chooseTop(price, opce) {
				this.cid = opce
				this.price = price

				this.show = true
			},
			useTopbag() {
				this.show = false
				this.isJoin = !this.isJoin
				this.pop_cont = 5
			},
			openPopup2() {
				this.show = false
				this.isJoin = !this.isJoin
				this.pop_cont = 1
			},
			openPopup(price, opce) {
				this.price = price
				this.isJoin = !this.isJoin
				this.cid = opce
				this.pop_cont = 1
			},
			showPopup2(index, pid) {
				if (this.hours == '') {
					uni.showToast({
						title: "请输入置顶时间",
						icon: "none"
					})
				} else {
					uni.request({
						url: this.global.url + '/api/task/top2',
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							token: uni.getStorageSync('token').token,
							taskId: this.cid,
							time: this.hours,
						},
						success: (res) => {
							if (res.data.code == 1) {
								this.page = 1;
								this.ddList = [];
								this.cadbcd(this.page);
								this.isJoin = !this.isJoin
								this.mony = ''
								this.dataMony = ''
								uni.showToast({
									title: res.data.msg,
									icon: "none"
								})
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: "none"
								})
								this.mony = '';
								this.dataMony = '';
								this.isJoin = !this.isJoin
							}
						}
					})
				}
			},
			showPopup(index, pid) {
				if (this.dataMony == '') {
					uni.showToast({
						title: "请输入置顶时间",
						icon: "none"
					})
				} else {
					uni.request({
						url: this.global.url + '/api/task/top',
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							token: uni.getStorageSync('token').token,
							taskId: this.cid,
							time: this.dataMony,
							money: this.mony
						},
						success: (res) => {
							if (res.data.code == 1) {
								this.page = 1;
								this.ddList = [];
								this.cadbcd(this.page);
								this.isJoin = !this.isJoin
								this.mony = ''
								this.dataMony = ''
								uni.showToast({
									title: res.data.msg,
									icon: "none"
								})
							} else {
								uni.showToast({
									title: res.data.msg,
									icon: "none"
								})
								this.mony = '';
								this.dataMony = '';
								this.isJoin = !this.isJoin
							}
						}
					})
				}
			},
			qx() {
				this.isJoin = !this.isJoin
			},
			cadbcd(page) {

				let that = this;
				uni.request({
					url: that.global.url + "/api/task/reward",
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
						page: page,
						type: that.Inv
					},
					success: (res) => {
						// console.log(res.data.code)
						if (res.data.code == 1) {
							that.totalPage = res.data.data.last_page;
							that.online = res.data.data.online;
							that.stop = res.data.data.stop;
							that.wait = res.data.data.wait;
							that.no = res.data.data.no;
							that.down = res.data.data.down;
							that.ddList = that.ddList.concat(res.data.data.data);
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: "none"
							})
						}

					},
					complete: () => {
						that.isLoading = false;
					}
				})

			},
			rewardOperation(eps) {
				let that = this;
				uni.request({
					url: this.global.url + "/api/task/suspend",
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
						type: eps.type,
						id: eps.id
					},
					success: (res) => {
						if (res.data.code == 1) {
							uni.showToast({
								title: res.data.msg,
								icon: "none"
							})
							that.ddList = [];
							that.page = 1;
							that.cadbcd(that.page);
						}
						if (res.data.code == 0) {
							uni.showToast({
								title: res.data.msg,
								icon: "none"
							})
						}
					}
				})

			},
			TapList(e) {
				let that = this;
				that.Inv = e;
				that.type = e;
				that.ddList = [];
				that.page = 1;
				that.cadbcd(that.page)
			},

			ConfirmSuspension() {
				let cht = []
				for (let i in this.ddList) {
					i = cht;
				}
				if (cht.code <= 0) {
					uni.showToast({
						title: '提示',
						content: "任务进行中不可暂停",
						icon: "none"
					})
				} else {
					this.rewardOperation({
						type: this.type,
						id: this.suspend
					})
					this.isJoin = !this.isJoin
				}
			},
			//点击暂停任务
			suspendTask(m) {
				this.isJoin = !this.isJoin
				this.suspend = m
				this.pop_cont = 2;

			},
			// 重新上架任务
			putOnTheShelves(em) {
				this.isJoin = !this.isJoin
				this.suspend = em
				this.pop_cont = 3
			},
			// 删除任务
			deleteTask(cm) {
				this.isJoin = !this.isJoin
				this.suspend = cm
				this.pop_cont = 4
			},
			downTask(cm) {
				this.isJoin = !this.isJoin
				this.suspend = cm
				this.pop_cont = 7
			},
			ConfirmShelves() {
				this.rewardOperation({
					type: this.type,
					id: this.suspend
				})
				this.isJoin = !this.isJoin
			},

			ConfirmDelete() {
				this.rewardOperation({
					type: 3,
					id: this.suspend,
				})
				// this.pop_cont = 3;
				this.isJoin = !this.isJoin
			},
			ConfirmDown() {
				this.rewardOperation({
					type: 5,
					id: this.suspend,
				})
				// this.pop_cont = 3;
				this.isJoin = !this.isJoin
			},
			toExamine(id) {
				uni.navigateTo({
					url: "/pages/mine/rewardManagement/auditManagement?id=" + id
				})
			},
			goPublish() {
				uni.navigateTo({
					url: "/pages/pagesFind/publishTask/publishTask"
				})
			},
			nweRelease() {

				// uni.navigateTo({
				// 	url: "../releaseF/releaseF"
				// })
				uni.navigateTo({
					url: "/pages/pagesFind/publishTask/publishTask"
				})
			},
			buyTopbag() {
				uni.navigateTo({
					url: "/pages/mine/wallet/top"
				})

			},
			buyRefreshbag() {
				uni.navigateTo({
					url: "/pages/mine/rewardManagement/renovate"
				})

			},
			getImgUrl(imae) {
				return this.global.url + imae;
			},
			TopTask() {
				this.$refs.popup.open()
			},
			// 跳转到任务详情
			goDetail(id) {
				uni.navigateTo({
					url: "/pages/task/detail?id=" + id
				})
			},
			editOrder(id, item) {
				if (item.to_examine > 0) {
					uni.showToast({
						title: '有任务未审核，不可编辑',
						icon: "none",
					})
					return;
				}

				uni.navigateTo({
					url: "/pages/release/release?type=edit&taskId=" + id
				})
			},
			resendOrder(id) {
				uni.navigateTo({
					url: "/pages/release/release?type=resend&taskId=" + id
				})
			},
			before_renovate(id) {
				this.renovate_id = id
				this.pop_cont = 6


				this.isJoin = !this.isJoin



			},
			//刷新
			renovate() {
				let id = this.renovate_id
				let that = this
				uni.request({
					url: this.global.url + '/api/task/refreshNmu',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						id: id,
						token: uni.getStorageSync("token").token,
					},
					success(res) {
						that.isJoin = false

						if (res.data.code == 0) {
							if (res.data.data.is_over == 1) {

								uni.showModal({
									title: '提示',
									content: '刷新次数已用完，去购买？',
									success: function(res) {
										if (res.confirm) {
											uni.navigateTo({
												url: "/pages/mine/rewardManagement/renovate"
											})
											console.log('用户点击确定');
										} else if (res.cancel) {
											console.log('用户点击取消');
										}
									}
								});


							} else {

								uni.showToast({
									title: res.data.msg,
									icon: "none",
									position: "bottom",
								})
							}
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: "none",
								position: "bottom"
							})
						}
					},
					fail(res) {
						uni.showToast({
							title: res.data.msg,
							icon: "none",
						})
					}
				})
			},
			//加量加价id
			dosage(item) {
				if (uni.getStorageSync('userInfo')) {
					uni.removeStorageSync('userInfo');
					uni.setStorageSync('userInfo', item)
				} else {
					uni.setStorageSync('userInfo', item)
				}
				uni.navigateTo({
					url: "/pages/release/dosage"
				})
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

	.skeleton-avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.skeleton-line {
		height: 24rpx;
		border-radius: 8rpx;
	}

	.reward-container {
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
		font-size: 24rpx;
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

	.reward-list {
		padding: 20rpx;
	}

	.reward-card {
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

	.icon {
		width: 32rpx;
		height: 32rpx;
		margin-left: 10rpx;
	}

	.price {
		font-size: 32rpx;
		font-weight: bold;
		color: $uni-color-primary;
	}

	.card-body {
		font-size: 26rpx;
		color: #666;
		margin-bottom: 20rpx;
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 10rpx;
	}

	.card-actions,
	.card-footer {
		display: flex;
		justify-content: space-around;
		padding-top: 20rpx;
		margin-top: 20rpx;
		border-top: 1px solid #f0f0f0;

		button {
			display: flex;
			align-items: center;
			font-size: 24rpx;
			color: #666;
			background: none;
			border: none;
			padding: 5rpx 10rpx;

			image {
				width: 30rpx;
				height: 30rpx;
				margin-right: 8rpx;
			}
		}
	}

	.fab-button {
		position: fixed;
		right: 40rpx;
		bottom: 100rpx;
		width: 110rpx;
		height: 110rpx;
		background: linear-gradient(135deg, $uni-color-primary, darken($uni-color-primary, 10%));
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #ffffff;
		font-size: 70rpx;
		font-weight: 300;
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
		z-index: 999;
		transition: transform 0.2s ease;
		animation: fab-pop-in 0.3s ease-out, fab-pulse 2s infinite 1s;
	}

	.fab-button:active {
		transform: scale(0.95);
	}

	@keyframes fab-pop-in {
		from {
			transform: scale(0);
			opacity: 0;
		}

		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes fab-pulse {
		0% {
			box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
		}

		50% {
			box-shadow: 0 8rpx 30rpx rgba($uni-color-primary, 0.5);
		}

		100% {
			box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
		}
	}

	/* 弹窗样式 */
	.popup-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.popup-box {
		width: 600rpx;
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.popup-title {
		text-align: center;
		font-size: 32rpx;
		font-weight: bold;
		padding: 30rpx;
		border-bottom: 1px solid #f0f0f0;
	}

	.popup-content {
		padding: 30rpx;
		text-align: center;
		font-size: 28rpx;
		color: #666;
	}

	.popup-content .popup-btn {
		padding: 20rpx;
		margin: 10rpx 0;
		background-color: #f5f5f5;
		border-radius: 10rpx;
	}

	.popup-cancel {
		text-align: center;
		padding: 20rpx;
		color: #999;
		border-top: 1px solid #f0f0f0;
	}

	.popup-actions {
		display: flex;
		border-top: 1px solid #f0f0f0;
	}

	.popup-actions .popup-btn {
		flex: 1;
		text-align: center;
		padding: 25rpx;
		font-size: 30rpx;
	}

	.popup-actions .popup-btn.cancel {
		color: #999;
		border-right: 1px solid #f0f0f0;
	}

	.popup-actions .popup-btn.confirm {
		color: $uni-color-primary;
	}

	.input-group {
		margin-bottom: 20rpx;
		text-align: left;

		text {
			display: block;
			margin-bottom: 10rpx;
			color: #333;
		}

		input {
			width: 100%;
			height: 70rpx;
			border: 1px solid #ddd;
			border-radius: 10rpx;
			padding: 0 20rpx;
			box-sizing: border-box;
		}
	}

	.price-info {
		text-align: left;
		color: #999;
		font-size: 26rpx;
		margin-top: 10rpx;
	}

	/* 急速审核弹窗 */
	.jisu-popup {
		width: 600rpx;
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.jisu-title {
		text-align: center;
		font-size: 32rpx;
		font-weight: bold;
		padding: 30rpx;
		border-bottom: 1px solid #f0f0f0;
	}

	.jisu-content {
		padding: 20rpx 30rpx;
	}

	.jisu-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 1px solid #f5f5f5;

		text {
			font-size: 28rpx;
			color: #333;
		}
	}

	.jisu-actions {
		padding: 20rpx 30rpx;
	}

	.jisu-btn {
		text-align: center;
		padding: 20rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
	}

	.jisu-btn.cancel {
		background-color: #f5f5f5;
		color: #666;
	}
</style>
