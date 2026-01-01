<template>
	<view class="task-detail-container" @click.stop="ismenu=false">
		<!-- Skeleton Loading -->
		<view v-if="isLoading">
			<view class="detail-header skeleton-header-part">
				<view class="header-content">
					<view class="task-title-row">
						<view class="skeleton-avatar skeleton-animate"></view>
						<view class="title-info">
							<view class="skeleton-line skeleton-animate" style="width: 60%;"></view>
							<view class="skeleton-line skeleton-animate"
								style="width: 40%; margin-top: 10rpx; height: 24rpx;"></view>
						</view>
					</view>
					<view class="price-row">
						<view class="skeleton-line skeleton-animate" style="width: 30%; height: 48rpx;"></view>
						<view class="skeleton-line skeleton-animate" style="width: 25%; height: 32rpx;"></view>
					</view>
					<view class="task-id">
						<view class="skeleton-line skeleton-animate" style="width: 50%;"></view>
					</view>
				</view>
			</view>

			<view class="detail-body">
				<view class="card info-card">
					<view class="info-grid">
						<view class="grid-item" v-for="i in 4" :key="i">
							<view class="skeleton-line skeleton-animate"
								style="width: 50%; height: 32rpx; margin: 0 auto;"></view>
							<view class="skeleton-line skeleton-animate"
								style="width: 70%; height: 24rpx; margin: 10rpx auto 0;"></view>
						</view>
					</view>
					<view class="device-info">
						<view class="info-line">
							<view class="skeleton-line skeleton-animate" style="width: 60%;"></view>
						</view>
						<view class="info-line">
							<view class="skeleton-line skeleton-animate" style="width: 80%;"></view>
						</view>
					</view>
				</view>

				<view class="card">
					<view class="card-title">
						<view class="skeleton-line skeleton-animate" style="width: 30%;"></view>
					</view>
					<view class="card-content">
						<view class="skeleton-line skeleton-animate" style="width: 90%;"></view>
						<view class="skeleton-line skeleton-animate" style="width: 80%;"></view>
						<view class="skeleton-line skeleton-animate" style="width: 95%;"></view>
					</view>
				</view>

				<view class="card">
					<view class="card-title">
						<view class="skeleton-line skeleton-animate" style="width: 40%;"></view>
					</view>
					<view class="steps-container">
						<view class="step-item" v-for="i in 2" :key="i">
							<view class="step-title">
								<view class="skeleton-step-index skeleton-animate"></view>
								<view class="skeleton-line skeleton-animate" style="width: 70%;"></view>
							</view>
							<view class="step-content">
								<view class="skeleton-line skeleton-animate"
									style="width: 100%; height: 72rpx; border-radius: 12rpx;"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- Actual Content -->
		<template v-else>
			<!-- 菜单选项 -->
			<view class="menu-wrapper" :class="{ 'visible': ismenu }" @click.stop="ismenu=false">
			<view class="menu-content" :class="{ 'active': ismenu }">
				<view class="menu-arrow"></view>
				<view class="menu-item" v-for="(d,s) in menu" :key="s" @click="navToRule(s)">
					<image v-if="s==4" src="/static/share/fenx.png" class="menu-icon"></image>
					<text>{{d}}</text>
				</view>
			</view>
		</view>

		<!-- 头部 -->
		<view class="detail-header">
			<view class="header-content">
				<view class="task-title-row">
					<image class="avatar" :src="detail.image" mode="aspectFill" @click="navToTaskUser"></image>
					<image v-if="detail.user_level>1" class="vip-badge" :src="detail.vip"></image>
					<view class="title-info">
						<view class="title">{{detail.title}}</view>
						<view class="tags">
							<text class="tag">{{detail.classifications_id}}</text>
							<text class="tag">{{detail.entryname}}</text>
						</view>
					</view>
				</view>
				<view class="price-row">
					<view class="price">
						<text class="symbol">+</text>{{detail.price}}<text class="unit">元</text>
					</view>
					<view class="guarantee">保证金 {{user.bond}}元</view>
				</view>
				<view class="task-id">
					<text>任务编号：{{detail.trade_no}}</text>
					<text class="copy-btn" @click="setClipboard(detail.trade_no,1)">复制</text>
				</view>
			</view>
		</view>

		<!-- 主体内容 -->
		<view class="detail-body">
			<!-- 任务数据 -->
			<view class="card info-card">
				<view class="info-grid">
					<view class="grid-item">
						<text class="value">{{detail.surplus}}</text>
						<text class="label">剩余数量</text>
					</view>
					<view class="grid-item">
						<text class="value">{{detail.received}}</text>
						<text class="label">完成数量</text>
					</view>
					<view class="grid-item">
						<text class="value">{{detail.timelimit}}h</text>
						<text class="label">限时完成</text>
					</view>
					<view class="grid-item">
						<text class="value">{{detail.audittime}}h</text>
						<text class="label">限时审核</text>
					</view>
				</view>
				<view class="device-info">
					<view class="info-line" v-if="detail.jisu_time>0">
						<image class="line-icon" src="/static/index/kuaishen.png"></image>
						<text>已开启快审 | {{detail.jisu_time/60}}分钟内必审核</text>
					</view>
					<view class="info-line">
						<image class="line-icon" src="/static/phone.png"></image>
						<text>设备支持：{{ detail.equipment == 1 ? '全部' : detail.equipment == 2 ? '仅安卓' : '仅苹果' }}</text>
					</view>
				</view>
			</view>

			<!-- 任务说明 -->
			<view class="card">
				<view class="card-title">官方提示</view>
				<view class="card-content official-tips">
					<view v-for="(a, index) in array" :key="index">{{a}}</view>
				</view>
				<view class="card-title">任务描述</view>
				<view class="card-content">{{detail.taskdescription}}</view>
			</view>

			<!-- 做单步骤 -->
			<view class="card">
				<view class="card-title">
					做单步骤
					<text class="subtitle">（请参照以下步骤做单）</text>
				</view>
				<view class="steps-container">
					<view class="step-item" v-for="(e,f) in detail.tasksteps" :key="f">
						<view class="step-title">
							<text class="step-index">{{f+1}}</text>
							<text class="step-title-text">{{e.title}}</text>
						</view>
						<view class="step-content">
							<!-- 操作网址 -->
							<view class="step-actions" v-if="e.ids==0">
								<button class="action-btn primary" @click="setLink(e.url)">打开链接</button>
								<button class="action-btn secondary" @click="setClipboard(e.url,2)">复制链接</button>
							</view>
							<!-- 操作数据 -->
							<view class="step-actions" v-if="e.ids==2">
								<view class="copy-data-box">{{e.url}}</view>
								<button class="action-btn primary" @click="setClipboard(e.url,2)">复制数据</button>
							</view>
							<!-- 操作手机号 -->
							<input class="step-input" v-if="e.ids==5" type="text" v-model="textObj.info" placeholder="请根据要求输入内容" :disabled="detail.type==2||detail.type==4||detail.type==6" />
							<!-- 操作图片 -->
							<view class="step-image-area" v-if="e.ids==1||e.ids==3||e.ids==4">
								<view v-if="e.ids==1&&detail.type!=0" class="image-overlay">点击报名</view>
								<view v-if="e.ids!=1" class="image-tag">{{e.ids==3?'说明图':e.ids==4?'验证图':''}}</view>
								
								<image v-for="(g,h) in e.url" :key="h" :class="e.ids==1 ? 'qr-code' : 'step-image'" :src="global.url+g" mode="aspectFill" @click="perviewImg(e.url)"></image>
								
								<view v-if="e.ids==4" class="upload-box" @click="chooseImg(f)">
									<text class="plus-icon">+</text>
									<text>添加图片</text>
								</view>

								<view v-if="e.ids==1" class="step-actions qr-actions">
									<button class="action-btn primary" @click="saveImage(e.url[0])">保存扫码</button>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="sticky-footer">
			<view v-if="detail.type==0||detail.type==2||detail.type==6" class="footer-buttons">
				<button class="footer-btn secondary" @click="clickLeft">
					<image :src="'/static/'+(detail.type==0?'detail/chat':'detail/huan')+'.png'" mode="widthFix"></image>
					{{detail.type==0?'联系悬赏主':'换一个'}}
				</button>
				<button class="footer-btn primary" @click="clickRight">{{detail.type==2||detail.type==6?'点击报名':detail.type==0?'提交任务':''}}</button>
			</view>
			<view v-if="detail.type==4" class="footer-buttons">
				<button class="footer-btn disabled" @click="clickCenter">{{detail.type==4?'审核中':''}}</button>
			</view>
		</view>

		<!-- 赚赏金弹窗 -->
		<view v-show="isJoin" @touchmove.stop.prevent="stopSlide">
			<view class="mask" @click="isJoin=!isJoin"></view>
			<view class="tip-content">
			<view class="tip-back">
					<text>赚赏金 就三步</text>
					<view class="close-btn" @click="isJoin=false">
						<image src="/static/close.png" mode="widthFix"></image>
					</view>
				</view>
				<view class="tipbord">
					<view class="tip1">1.浏览悬赏</view>
					<view class="tip2">请仔细阅读悬赏限制条件及要求，确保能完成后点击页面底部的“点击报名”按钮，先报名再做单，还可以查看做的单视频，更加全面了解做单要求。</view>
					<view class="tip1">2.按步骤操作</view>
					<view class="tip2">请根据步骤要求进行操作，上传任务所需的验证图或验证文字。</view>
					<view class="tip1">3.正确提交</view>
					<view class="tip2">检查上传截图或者验证文字，确认无误后点击页面底部“提交任务”，提交成功后，等待审核通过发放赏金。</view>
					<view class="protocol">
						<view class="checkbox" :class="{'checked': isTcp}" @click="setReminder">
							<image v-if="isTcp" src="/static/release/dui.png" mode="widthFix"></image>
						</view>
						不再提示
					</view>
					<view class="tipbt">
						<text @click="navToRule(1)">新人须知</text>
						<text @click="navToVideo">做单视频</text>
						<text @click="isJoin=false">开始赚钱</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 放弃任务弹窗 -->
		<view v-show="isgive" @touchmove.stop.prevent="stopSlide">
			<view class="mask" @click="isgive=!isgive"></view>
			<view class="tip-del">
				<view class="tip-top">
					<image src="/static/release/yellow.png" mode="widthFix"></image>任务提醒
				</view>
				<view class="tip-titdel">是否放弃该任务？</view>
				<view class="tip-btn">
					<view @click="isgive=false">取消</view>
					<view @click="ToGiveUp">确认</view>
				</view>
			</view>
		</view>
		</template>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isLoading: true, // 页面加载状态
				user: {}, // 用户
				detail: {}, // 详情
				taskId: '', // 任务id
				isTcp: false, // 是否勾选
				textObj: {
					url: [],
					info: ''
				}, // 输入框内容
				ismenu: false, // 菜单显隐
				isJoin: false, // 赚赏金弹窗
				isgive: false, // 放弃任务弹窗
				menu: ['举报', '新人须知', '接单规则', '免责声明', '分享'], // 菜单选项
				array: [], // 做单说明
			}
		},
		// 监听按钮触发
		onNavigationBarButtonTap() {
			this.ismenu = !this.ismenu
		},
		onLoad(option) {
			this.taskId = option.id
			console.log(option)
			this.getTaskDetails()
		},
		methods: {
			// 不在提示
			setReminder() {
				uni.request({
					url: this.global.url + '/api/task/reminder',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						if (res.data.code == 1) {
							this.isTcp = true // 勾选
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
						}
					}
				})
			},
			// 获取详情
			getTaskDetails() {
				uni.request({
					url: this.global.url + '/api/task/taskdetails',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						id: this.taskId,
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						if (res.data.code == 1) {
							this.detail = res.data.data
							console.log('getTaskDetails detail',this.detail)
							this.user = res.data.data.user
							this.isJoin = this.user.reminder == 1 ? true : false
							//this.user.avatar = this.global.url + this.user.avatar
							//this.detail.image = this.global.url + this.detail.image;
							let arr = res.data.data.illustrate
							this.array = arr.split('。')
							// 审核中回显所填数据
							if (this.detail.content != null) {
								this.textObj.url = this.detail.content.url
								this.textObj.info = this.detail.content.info
								let array = []
								for (var i = 0; i < res.data.data.tasksteps.length; i++) {
									if (res.data.data.tasksteps[i].ids == 4) {
										array.push(res.data.data.tasksteps[i])
									}
								}
								for (var i = 0; i < array.length; i++) {
									array[i].url.push(res.data.data.content.url[i])
								}
							}
						}
					},
					complete: () => {
						this.isLoading = false;
					}
				})
			},
			// 左侧按钮
			clickLeft() {
				if (this.detail.type == 0) {
					this.createRoom()
				} else if (this.detail.type == 2 || this.detail.type == 6) {
					this.changeTask()
				}
			},
			// 单个按钮
			clickCenter() {
				uni.showToast({
					title: '该任务' + this.detail.type == 4 ? '审核中' : '',
					icon: 'none'
				})
			},
			// 右侧按钮
			clickRight() {
				// 如果订单id存在
				if (this.detail.type == 0) {
					this.submitTask() // 提交任务
				}
				if (this.detail.type == 2 || this.detail.type == 6) {
					this.clickSignUp() // 点击报名
				}
			},
			createRoom() {
				let token = uni.getStorageSync('token');
				if (!token) {
					uni.navigateTo({
						url: '/pages/home/login/login'
					});
					return;
				}

				if (!this.detail.id) {
					uni.showToast({
						title: '无法获取任务信息',
						icon: 'none'
					});
					return;
				}

				const params = {
					id: this.detail.id,
					token: token.token
				};

				console.log('即将创建聊天室，发送参数:', params);

				uni.request({
					url: this.global.url + '/api/message/createRoom',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: params,
					success: (res) => {
						console.log('创建聊天室返回:', res.data);
						if (res.data.code == 1 && res.data.hasOwnProperty('data')) {
							let roomId;
							const data = res.data.data;
							// 兼容两种可能的返回格式: data: {room_id: xxx} 或 data: xxx
							if (typeof data === 'object' && data !== null) {
								roomId = data.room_id;
							} else {
								roomId = data;
							}

							if (roomId !== null && roomId !== undefined) {
								uni.navigateTo({
									url: '/pages/home/subpage/consultDetail?room_id=' + roomId
								});
							} else {
								uni.showToast({
									title: '无法获取房间ID',
									icon: 'none'
								});
							}
						} else {
							uni.showToast({
								title: res.data.msg || '创建聊天室失败',
								icon: 'none'
							});
						}
					},
					fail: (err) => {
						uni.showToast({
							title: '网络请求失败，请检查网络连接',
							icon: 'none'
						});
						console.error('createRoom request failed', err);
					}
				});
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
						orderId: this.detail.order_id,
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})
						if (res.data.code == 1) {
							this.isgive = false
							this.getTaskDetails()
						}
					}
				})
			},
			// 换一个
			changeTask() {
				uni.request({
					url: this.global.url + '/api/task/change',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token,
						taskId: this.taskId
					},
					success: (res) => {
						if (res.data.code == 1 && res.data.data && res.data.data.id) {
							// 如果返回的是同一个任务，提示暂无其他任务
							if (res.data.data.id == this.taskId) {
								uni.showToast({
									title: '暂无其他任务',
									icon: 'none'
								})
								return
							}
							// 获取新任务ID后重新加载完整详情
							this.taskId = res.data.data.id
							this.isLoading = true
							this.getTaskDetails()
						} else {
							uni.showToast({
								title: res.data.msg || '暂无其他任务',
								icon: 'none'
							})
						}
					}
				})
			},
			// 提交任务
			submitTask() {
				// 验证步骤是否存在
				let verify = this.detail.tasksteps.map(i => i.ids).indexOf(4)
				// 收集信息是否存在
				let info = this.detail.tasksteps.map(i => i.ids).indexOf(5)
				if (verify != -1 && this.textObj.url.length == 0) {
					uni.showToast({
						title: '请根据任务步骤上传图片',
						icon: 'none'
					})
				} else if (info != -1 && this.textObj.info == '') {
					uni.showToast({
						title: '请根据任务步骤填写信息',
						icon: 'none'
					})
				} else {
					uni.request({
						url: this.global.url + '/api/order/submit_task',
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							id: this.detail.order_id,
							content: JSON.stringify(this.textObj),
							token: uni.getStorageSync('token').token
						},
						success: (res) => {
							
							uni.showToast({
								title: '提交成功',
								icon: 'success',
								duration:2000,
							})
							
							// uni.showToast({
							// 	title: res.data.msg,
							// 	icon: 'none'
							// })
							if (res.data.code == 1) {
								this.getTaskDetails()
							}
						}
					})
				}
			},
			// 点击报名
			clickSignUp() {

				let token=uni.getStorageSync('token');
				console.log('homr')
				if(!token){
					uni.navigateTo({
						url:'/pages/home/login/login'
					})
					return; // 未登录则不继续执行
				}

				uni.request({
					url: this.global.url + '/api/task/signup',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						id: this.taskId,
						frequency: this.detail.frequency,
						single_time: this.detail.timelimit,
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})
						if (res.data.code == 1) {
							this.getTaskDetails()
						}
					}
				})
			},
			// 保存图片
			saveImage(url) {
				if (this.detail.type == 0) {
					const imageUrl = this.global.url + url;
					uni.showLoading({ title: '保存中...' });
					// 先下载图片到本地
					uni.downloadFile({
						url: imageUrl,
						success: (downloadRes) => {
							if (downloadRes.statusCode === 200) {
								// 下载成功后保存到相册
								uni.saveImageToPhotosAlbum({
									filePath: downloadRes.tempFilePath,
									success: () => {
										uni.hideLoading();
										uni.showToast({
											title: '保存成功',
											icon: 'success'
										})
									},
									fail: (err) => {
										uni.hideLoading();
										console.log('保存失败:', err);
										uni.showToast({
											title: '保存失败，请检查相册权限',
											icon: 'none'
										})
									}
								})
							} else {
								uni.hideLoading();
								uni.showToast({
									title: '图片下载失败',
									icon: 'none'
								})
							}
						},
						fail: (err) => {
							uni.hideLoading();
							console.log('下载失败:', err);
							uni.showToast({
								title: '图片下载失败',
								icon: 'none'
							})
						}
					})
				} else {
					let str = this.detail.type == 6 ? '请点击报名' : this.detail.type == 4 ? '提交成功，等待审核' : '该任务待提交'
					uni.showToast({
						title: str,
						icon: 'none'
					})
				}
			},
			// 预览图片
			perviewImg(url) {
				uni.previewImage({
					urls: url.map(i => i = this.global.url + i),
					indicator: 'number',
					loop: true
				})
			},
			// 打开链接
			setLink(e) {
				if (this.detail.type == 0) {
					if (e.indexOf("douyin") != -1) {
						if (plus.os.name == 'Android') {
							if(plus.runtime.isApplicationExist({
				//查看安卓系统手机有没有下载这款app
				pname: 'com.ss.android.ugc.aweme' //微信app云打包的包名
			})){
								uni.setClipboardData({
									data: e,
									success: () => {
										plus.runtime.launchApplication({
												pname: "com.ss.android.ugc.aweme"
											},
											function(e) {
												console.log('Open system default browser failed: ' + e
													.message);
											}
										)
									}
								})
							}else{
								uni.showToast({
									title:"请先安装抖音app",
									icon:"none"
								})
							}
						
						} else if (plus.os.name == 'iOS') {
							plus.runtime.launchApplication({
								action: 'douyin://'
							}, function(e) {
								uni.showToast({
									title:"请先安装抖音app",
									icon:"none"
								})
							});
						}
					} else {
            // #ifdef H5
              window.open(e);
            // #endif
            // #ifdef APP-PLUS
              plus.runtime.openURL(e);
            // #endif
					}
				} else {
					let str = this.detail.type == 6 ? '请点击报名' : this.detail.type == 4 ? '提交成功，等待审核' : '该任务待提交'
					uni.showToast({
						title: str,
						icon: 'none'
					})
				}
			},
			// 复制到剪贴板
			setClipboard(e, type) {
				if (type == 1) {
					uni.setClipboardData({
						data: String(e),
						success: () => {
							uni.showToast({
								title: '已复制到剪贴板',
								icon: 'none'
							})
						},
						fail: () => {
							uni.showToast({
								title: '复制失败',
								icon: 'none'
							})
						}
					})
					return
				}
				if (this.detail.type == 0) {
					uni.setClipboardData({
						data: e,
						success: () => {
							uni.showToast({
								title: '已复制到剪贴板',
								icon: 'none'
							})
						}
					})
				} else {
					let str = this.detail.type == 6 ? '请点击报名' : this.detail.type == 4 ? '提交成功，等待审核' : '该任务待提交'
					uni.showToast({
						title: str,
						icon: 'none'
					})
				}
			},
			// 上传图片
			chooseImg(index) {
				if (this.detail.type == 0) {
					uni.chooseImage({
						count: 1,
						success: (res) => {
							uni.uploadFile({
								url: this.global.url + '/index.php/api/common/uploads',
								filePath: res.tempFilePaths[0],
								name: 'file',
								success: (resimg) => {
									let data = JSON.parse(resimg.data);
									if (data.code == 1) {
										this.detail.tasksteps[index].url.push(data.data
											.url); // 用于展示
										this.textObj.url.push(data.data.url); // 用于验证提交
									}
								}
							})
						}
					})
				} else {
					let str = this.detail.type == 6 ? '请点击报名' : this.detail.type == 4 ? '提交成功，等待审核' : '该任务待提交'
					uni.showToast({
						title: str,
						icon: 'none'
					})
				}
			},
			// 跳转规则
			navToRule(index) {
				let url = ''
				if (index == 0) {
					url = '/pages/task/report?id=' + this.detail.trade_no
				} else if (index == 1) {
					url = '/pages/home/subpage/course?id=4'
				} else if (index == 2) {
					url = '/pages/home/subpage/course?id=1'
				} else if (index == 3) {
					url = '/pages/home/subpage/course?id=2'
				} else {
					console.log(111111)
					//url = '/pages/home/subpage/invite'
					
					url = '/pages/mine/subPage/share'
				}
				uni.navigateTo({
					url: url
				})
			},
			// 跳转做单视频
			navToVideo() {
				uni.navigateTo({
					url: 'video'
				})
			},
			// 跳转个人信息
			navToTaskUser() {
				uni.navigateTo({
					url: '/pages/task/user?id=' + this.detail.user_id
				})
			},
			// 跳转开通会员
			navToVip() {
				uni.navigateTo({
					url: '/pages/member/member'
				})
			},
			//禁止页面滚动(规避警告)
			stopSlide() {
				return
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

	.skeleton-header-part .skeleton-animate {
		background: linear-gradient(90deg, rgba(255, 255, 255, 0.3) 25%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0.3) 75%);
		background-size: 200% 100%;
		animation: skeleton-shimmer 1.5s infinite linear;
	}

	.skeleton-avatar {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.skeleton-line {
		height: 28rpx;
		border-radius: 8rpx;
		margin-bottom: 10rpx;
	}

	.detail-body .skeleton-line {
		margin-bottom: 0;
	}

	.skeleton-step-index {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		margin-right: 20rpx;
		flex-shrink: 0;
	}

	page {
		background-color: #f7f8fa;
	}

	.task-detail-container {
		padding-bottom: 120rpx; // 为底部按钮留出空间
	}

	.menu-wrapper {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 1000;
		visibility: hidden;
		pointer-events: none;

		&.visible {
			visibility: visible;
			pointer-events: auto;
		}
	}

	.menu-content {
		position: absolute;
		top: 20rpx;
		/* #ifdef H5 */
		top: calc(44px + 20rpx);
		/* #endif */
		right: 20rpx;
		background-color: #fff;
		border-radius: 16rpx;
		box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);
		opacity: 0;
		transform: scale(0);
		transform-origin: top right;
		transition: all 0.3s ease;
		will-change: transform, opacity;

		&.active {
			opacity: 1;
			transform: scale(1);
		}

		.menu-arrow {
			position: absolute;
			top: -14rpx;
			right: 24rpx;
			width: 0;
			height: 0;
			border-left: 14rpx solid transparent;
			border-right: 14rpx solid transparent;
			border-bottom: 14rpx solid #fff;
		}

		.menu-item {
			display: flex;
			align-items: center;
			padding: 24rpx 30rpx;
			font-size: 28rpx;
			color: #333;
			border-bottom: 1rpx solid #f5f5f5;

			&:last-child {
				border-bottom: none;
			}

			.menu-icon {
				width: 36rpx;
				height: 36rpx;
				margin-right: 16rpx;
			}
		}
	}

	.detail-header {
		background: $uni-color-primary;
		color: #fff;
		padding: 20rpx 30rpx 80rpx;
		border-radius: 0 0 40rpx 40rpx;
	}

	.header-content {
		.task-title-row {
			display: flex;
			align-items: center;
			position: relative;

			.avatar {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				border: 2rpx solid #fff;
				margin-right: 20rpx;
				flex-shrink: 0;
			}

			.vip-badge {
				position: absolute;
				width: 40rpx;
				height: 40rpx;
				left: 70rpx;
				bottom: -4rpx;
			}

			.title-info {
				.title {
					font-size: 36rpx;
					font-weight: bold;
					margin-bottom: 10rpx;
				}
				.tags {
					display: flex;
					.tag {
						font-size: 22rpx;
						background-color: rgba(255, 255, 255, 0.2);
						padding: 4rpx 12rpx;
						border-radius: 20rpx;
						margin-right: 10rpx;
					}
				}
			}
		}

		.price-row {
			display: flex;
			justify-content: space-between;
			align-items: baseline;
			margin-top: 30rpx;

			.price {
				font-size: 52rpx;
				font-weight: bold;
				color: #fff;
				.symbol {
					font-size: 36rpx;
					margin-right: 4rpx;
				}
				.unit {
					font-size: 28rpx;
					font-weight: normal;
					margin-left: 4rpx;
				}
			}
			.guarantee {
				font-size: 24rpx;
				background-color: rgba(255, 255, 255, 0.2);
				padding: 6rpx 16rpx;
				border-radius: 20rpx;
			}
		}

		.task-id {
			margin-top: 20rpx;
			font-size: 24rpx;
			color: rgba(255, 255, 255, 0.8);
			.copy-btn {
				margin-left: 20rpx;
				background-color: rgba(255, 255, 255, 0.2);
				padding: 4rpx 16rpx;
				border-radius: 20rpx;
			}
		}
	}

	.detail-body {
		padding: 0 24rpx;
		margin-top: -60rpx; // 让卡片上移，与头部有交叠效果
		position: relative;
		z-index: 10;
	}

	.card {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

		.card-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 20rpx;
			display: flex;
			align-items: center;
			
			.subtitle {
				font-size: 24rpx;
				color: #999;
				font-weight: normal;
				margin-left: 10rpx;
			}
		}

		.card-content {
			font-size: 28rpx;
			color: #666;
			line-height: 1.6;
		}
		
		.official-tips {
			view {
				margin-bottom: 10rpx;
			}
		}
	}

	.info-card {
		.info-grid {
			display: flex;
			justify-content: space-around;
			text-align: center;
			padding-bottom: 20rpx;
			border-bottom: 1rpx solid #f0f0f0;

			.grid-item {
				.value {
					display: block;
					font-size: 32rpx;
					font-weight: bold;
					color: $uni-color-primary;
				}
				.label {
					display: block;
					font-size: 24rpx;
					color: #999;
					margin-top: 10rpx;
				}
			}
		}
		.device-info {
			margin-top: 20rpx;
			.info-line {
				display: flex;
				align-items: center;
				font-size: 26rpx;
				color: #666;
				&:not(:last-child) {
					margin-bottom: 10rpx;
				}
				.line-icon {
					width: 40rpx;
					height: 40rpx;
					margin-right: 10rpx;
				}
			}
		}
	}

	.steps-container {
		.step-item {
			margin-bottom: 40rpx;
			&:last-child {
				margin-bottom: 0;
			}
			.step-title {
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;
				.step-index {
					width: 40rpx;
					height: 40rpx;
					line-height: 40rpx;
					text-align: center;
					border-radius: 50%;
					background-color: $uni-color-primary;
					color: #fff;
					font-weight: bold;
					margin-right: 20rpx;
					flex-shrink: 0;
				}
				.step-title-text {
					font-size: 28rpx;
					color: #333;
					font-weight: 500;
				}
			}
			.step-content {
				padding-left: 60rpx;
				.step-actions {
					display: flex;
					gap: 20rpx;
					.action-btn {
						flex: 1;
						height: 72rpx;
						line-height: 72rpx;
						font-size: 28rpx;
						border-radius: 12rpx;
						margin: 0;
						&.primary {
							background-color: $uni-color-primary;
							color: #fff;
						}
						&.secondary {
							background-color: #fdecec;
							color: $uni-color-primary;
							border: 1rpx solid $uni-color-primary;
						}
					}
					.copy-data-box {
						flex: 2;
						height: 72rpx;
						line-height: 72rpx;
						padding: 0 20rpx;
						background-color: #f7f8fa;
						border-radius: 12rpx;
						color: #666;
						font-size: 26rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
				.step-input {
					width: 100%;
					height: 80rpx;
					background-color: #f7f8fa;
					border-radius: 12rpx;
					padding: 0 20rpx;
					font-size: 28rpx;
					box-sizing: border-box;
				}
				.step-image-area {
					position: relative;
					display: flex;
					flex-wrap: wrap;
					gap: 20rpx;
					.image-overlay {
						position: absolute;
						top: 0;
						left: 0;
						width: 180rpx;
						height: 180rpx;
						background-color: rgba(0, 0, 0, 0.5);
						color: #fff;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 12rpx;
						z-index: 9;
					}
					.image-tag {
						position: absolute;
						top: 0;
						left: 0;
						background-color: $uni-color-primary;
						color: #fff;
						padding: 4rpx 16rpx;
						font-size: 22rpx;
						border-radius: 12rpx 0 12rpx 0;
						z-index: 9;
					}
					.qr-code {
						width: 180rpx;
						height: 180rpx;
						border-radius: 12rpx;
					}
					.step-image {
						width: 200rpx;
						height: 320rpx;
						border-radius: 12rpx;
					}
					.upload-box {
						width: 180rpx;
						height: 180rpx;
						background-color: #f7f8fa;
						border: 2rpx dashed #ddd;
						border-radius: 12rpx;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						color: #999;
						.plus-icon {
							font-size: 60rpx;
							line-height: 1;
						}
					}
					.qr-actions {
						width: 180rpx;
						margin-top: 10rpx;
					}
				}
			}
		}
	}

	.sticky-footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #fff;
		padding: 20rpx 24rpx;
		padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
		z-index: 100;
		box-sizing: border-box;
		.footer-buttons {
			display: flex;
			gap: 20rpx;
			.footer-btn {
				flex: 1;
				height: 88rpx;
				line-height: 88rpx;
				font-size: 30rpx;
				border-radius: 44rpx;
				margin: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				&.primary {
					background: $uni-color-primary;
					color: #fff;
				}
				&.secondary {
					background-color: #fdecec;
					color: $uni-color-primary;
					image {
						width: 34rpx;
						height: 28rpx;
						margin-right: 10rpx;
					}
				}
				&.disabled {
					background-color: #e0e0e0;
					color: #999;
				}
			}
		}
	}

	/* 弹窗 */
	.mask {
		z-index: 999;
		background: rgba(0, 0, 0, 0.6);
		position: fixed;
		bottom: 0;
		right: 0;
		left: 0;
		top: 0;
	}

	.tip-content {
		z-index: 1000;
		width: 600rpx;
		background: #FFFFFF;
		border-radius: 20rpx;
		overflow: hidden;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		.tip-back {
			width: 100%;
			color: #fff;
			font-size: 32rpx;
			font-weight: bold;
			text-align: center;
			background: $uni-color-primary;
			line-height: 120rpx;
			position: relative;
			.close-btn {
				position: absolute;
				top: 10rpx;
				right: 10rpx;
				padding: 10rpx;
				image {
					width: 30rpx;
					height: 30rpx;
					display: block;
				}
			}
		}
		.tipbord {
			padding: 20rpx 30rpx 30rpx;
			.tip1 {
				font-size: 28rpx;
				font-weight: bold;
				color: #333;
				margin-bottom: 10rpx;
			}
			.tip2 {
				font-size: 26rpx;
				color: #666;
				line-height: 1.6;
				margin-bottom: 20rpx;
			}
			.protocol {
				display: flex;
				align-items: center;
				font-size: 24rpx;
				color: #666;
				.checkbox {
					width: 32rpx;
					height: 32rpx;
					border: 1rpx solid #ccc;
					border-radius: 50%;
					margin-right: 10rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					&.checked {
						background-color: $uni-color-primary;
						border-color: $uni-color-primary;
					}
					image {
						width: 24rpx;
						height: 24rpx;
					}
				}
			}
			.tipbt {
				margin-top: 30rpx;
				display: flex;
				gap: 20rpx;
				text {
					flex: 1;
					height: 72rpx;
					line-height: 72rpx;
					text-align: center;
					border-radius: 36rpx;
					font-size: 26rpx;
					&:nth-child(1), &:nth-child(2) {
						background-color: #fdecec;
						color: $uni-color-primary;
					}
					&:nth-child(3) {
						background-color: $uni-color-primary;
						color: #fff;
					}
				}
			}
		}
	}

	.tip {
		&-del {
			z-index: 1000;
			width: 520rpx;
			background: #FFFFFF;
			border-radius: 20rpx;
			overflow: hidden;
			position: fixed;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
		&-top {
			display: flex;
			padding-top: 40rpx;
			font-size: 32rpx;
			font-weight: bold;
			align-items: center;
			justify-content: center;
			image {
				width: 40rpx;
				height: 40rpx;
				margin-right: 16rpx;
			}
		}
		&-titdel {
			padding: 40rpx;
			font-size: 28rpx;
			color: #666;
			text-align: center;
		}
		&-btn {
			display: flex;
			font-size: 30rpx;
			border-top: 1rpx solid #f0f0f0;
			view {
				flex: 1;
				height: 90rpx;
				line-height: 90rpx;
				text-align: center;
				&:first-child {
					color: #666;
					border-right: 1rpx solid #f0f0f0;
				}
				&:last-child {
					color: $uni-color-primary;
					font-weight: 500;
				}
			}
		}
	}
</style>
