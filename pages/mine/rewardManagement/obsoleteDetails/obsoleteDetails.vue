<template>
	<view>
		<!-- 菜单选项 -->
		<view class="menu" v-show="ismenu">
			<view v-for="(d,s) in menu" :key="s" @click="navToRule(s)">
				<image v-if="s==4" src="/static/share/fenx.png" mode="widthFix"></image>{{d}}
			</view>
		</view>
		<!-- 头部背景 -->
		<view class="back"></view>
		<!-- 两侧间距 -->
		<view class="back1">
			<!-- 高价注册 -->
			<view class="tr1">
				<view class="left1">
					<view class="top1">
						<image class="img1" :src="detail.image" mode="aspectFill" @click="navToTaskUser">
						</image>
						<view class="text1"><text>{{detail.title}}</text><text>{{detail.classifications_id}}</text>
						</view>
					</view>
					<view class="bot1"><text>+{{detail.price}}元</text><text>保证金{{user.bond}}元</text>
					</view>
				</view>
				<view class="cen1">
					<text>任务编号：{{detail.trade_no}}</text>
					<text @click="setClipboard(detail.trade_no,1)" style="color: #FFFFFF;">复制</text>
				</view>
				<view class="right1">
					<view>{{detail.surplus}}<text>剩余数量</text></view>
					<view>{{detail.received}}<text>完成数量</text></view>
					<view>{{detail.timelimit}}个小时<text>做单小时</text></view>
					<view>{{detail.audittime}}天<text>审核时间</text></view>
				</view>
			</view>
			<!-- 做单说明 -->
			<view class="tr2">
				<view class="title">做单说明</view>
				<view v-for="a in array" :key="a">{{a}}</view>
				<view class="title">任务说明</view>
				<view>{{detail.taskdescription}}</view>
			</view>
			<!-- 开通会员 -->
			<view class="tr3">
				<view class="left3">
					<image :src="user.avatar" mode="aspectFill" @click="navToTaskUser"></image>
					<view class="bot3">
						<text>ID:{{user.id}}</text>
						<text>{{user.id =='16542'? '平台自营':user.user_level_id}}</text>
					</view>
				</view>
				<view class="right3" @click="navToVip">开通会员</view>
			</view>
			<!-- 做单视频 -->
			<view class="tr4" @click="navToVideo">
				<view>
					做单视频<image src="/static/detail/video.png" mode="widthFix"></image>
				</view>
				<image src="/static/detail/geng.png" mode="widthFix"></image>
			</view>
			<!-- 做单步骤 -->
			<view class="tr5">
				<view class="top5">做单步骤<text>（请参照以下步骤做单）</text></view>
				<view class="steplist" v-for="(e,f) in detail.tasksteps" :key="f">
					<!-- 步骤标题 -->
					<view class="setpIndex">
						<view>{{f+1}}</view>{{e.title}}
					</view>
					<!-- 操作网址 -->
					<view class="setpcont" v-if="e.ids==0">
						<view @click="setLink(e.url)" style="color: #FFFFFF;">打开链接</view>
						<view @click="setClipboard(e.url,2)">复制链接</view>
					</view>
					<!-- 操作数据 -->
					<view class="copy" v-if="e.ids==2">
						<view>{{e.url}}</view>
						<view @click="setClipboard(e.url,2)">复制数据</view>
					</view>
					<!-- 操作手机号 -->
					<input class="setinput" v-if="e.ids==5" type="text" v-model="textObj.info" placeholder="请根据要求输入内容"
						:disabled="detail.type==2||detail.type==4||detail.type==6" />
					<!-- 操作图片 -->
					<view v-if="e.ids==1||e.ids==3||e.ids==4" class="tr0">
						<!-- 二维码蒙层 -->
						<!-- <view v-if="e.ids==1&&detail.type!=0" class="zhe">点击报名</view> -->
						<!-- 说明验证图标识 -->
						<view v-if="e.ids!=1" class="zhe1"  style="color: #FFFFFF;">{{e.ids==3?'说明图':e.ids==4?'验证图':''}}</view>
						<!-- 二维码说明验证图 -->
						<block v-for="(g,h) in e.url" :key="h">
							
						
								
						
							<image :class="'imgs'+(e.ids==1?'1':'2')"  :src="global.url+g" mode="aspectFill"
								@click="perviewImg(e.url)">
								</image>
								
								
							<!-- 说明验证图-添加凭证 -->
							<view v-if="e.ids==4&&e.url.length==1" class="imgadd" @click="chooseImg(f)">
								<text>+</text>添加图片
							</view>
							<!-- 二维码保存本地 -->
							<view v-if="e.ids==1" class="setpcont">
								<view @click="saveImage(g)">保存扫码</view>
							</view>
						</block>
						
						
					</view>
				</view>
			</view>
		</view>
		<!-- 按钮 -->
		<!-- <view v-if="detail.type==0||detail.type==2||detail.type==6" class="btns">
			<view @click="clickLeft">
				<image :src="'/static/'+(detail.type==0?'search/del':'detail/huan')+'.png'" mode="widthFix"></image>
				{{detail.type==0?'放弃任务':'换一个'}}
			</view>
			<view @click="clickRight" style="color: #FFFFFF;">{{detail.type==2||detail.type==6?'点击报名':detail.type==0?'提交任务':''}}</view>
		</view> -->
		<!-- <view v-if="detail.type==4" class="btns">
			<view class="btng" @click="clickCenter">{{detail.type==4?'审核中':''}}</view>
		</view> -->
		<!-- 赚赏金弹窗 -->
		<!-- <view v-show="isJoin" @touchmove.stop.prevent="stopSlide"> -->
			<!-- 遮罩层 -->
			<!-- <view class="mask" @click="isJoin=!isJoin"></view> -->
			<!-- 内容区 -->
			<!-- <view class="tip-content">
				<view class="tip-back">
					<text style="color: #FFFFFF;">虚拟数据 仅供测试</text>
					<image src="/static/login/icon_delete@2x.png" mode="widthFix" @click="isJoin=false"></image>
				</view>
				<view class="tipbord">
					<view class="tip1">1.浏览悬赏</view>
					<view class="tip2">请仔细阅读悬赏限制条件及要求，确保能完成后点击页面底部的“点击报名”按钮，先报名再做单，还可以查看做的单视频，更加全面了解做单要求。</view>
					<view class="tip1">2.按步骤操作</view>
					<view class="tip2">请根据步骤要求进行操作，上传任务所需的验证图或验证文字。</view>
					<view class="tip1">3.正确提交</view>
					<view class="tip2">检查上传截图或者验证文字，确认无误后点击页面底部“提交任务”，提交成功后，等待审核通过发放赏金。</view>
					<view class="protocol">
						<view v-if="!isTcp" @click="setReminder"></view>
						<image v-else src="/static/release/dui.png" mode="widthFix"></image>
						不再提示
					</view>
					<view class="tipbt">
						<text @click="navToRule(1)">新人须知</text>
						<text @click="navToVideo">做单视频</text>
						<text @click="isJoin=false">开始赚钱</text>
					</view>
				</view>
			</view> -->
	<!-- 	</view> -->
		<!-- 放弃任务弹窗 -->
		<!-- <view v-show="isgive" @touchmove.stop.prevent="stopSlide"> -->
			<!-- 遮罩层 -->
			<!-- <view class="mask" @click="isgive=!isgive"></view> -->
			<!-- 内容区 -->
			<!-- <view class="tip-del">
				<view class="tip-top">
					<image src="/static/release/yellow.png" mode="widthFix"></image>任务提醒
				</view>
				<view class="tip-titdel">是否放弃该任务？</view>
				<view class="tip-btn">
					<view @click="isgive=false">取消</view>
					<view @click="ToGiveUp">确认</view>
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
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
				orderId:'',
				tasklist_id:''
			}
		},
		// 监听按钮触发
		onNavigationBarButtonTap() {
			this.ismenu = !this.ismenu
		},
		onLoad(option) {
			this.orderId = option.orderId
				this.tasklist_id=option.tasklist_id
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
						id: this.tasklist_id,
						token: uni.getStorageSync('token').token,
						orderId:this.orderId
					},
					success: (res) => {
						if (res.data.code == 1) {
							this.detail = res.data.data
							this.user = res.data.data.user
							this.isJoin = this.user.reminder == 1 ? true : false
							this.user.avatar = this.global.url + this.user.avatar
							this.detail.image = this.global.url + this.detail.image;
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
					}
				})
			},
			// 左侧按钮
			clickLeft() {
				// 如果订单id存在
				if (this.detail.type == 0) {
					this.isgive = true // 放弃任务弹出窗口
				}
				if (this.detail.type == 2 || this.detail.type == 6) {
					this.changeTask() // 换一个
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
				if (this.detail.type == 0||this.detail.type == 5) {
					this.submitTask() // 提交任务
				}
				
				if (this.detail.type == 2 || this.detail.type == 6) {
					this.clickSignUp() // 点击报名
				}
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
					success: (res) => {
						if (res.data.code == 1) {
							this.taskId = res.data.data.id
							this.detail = res.data.data
							this.detail.image = this.global.url + this.detail.image;
						} else {
							uni.showToast({
								title: res.data.msg,
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
								title: res.data.msg,
								icon: 'none'
							})
							if (res.data.code == 1) {
								this.getTaskDetails()
							}
						}
					})
				}
			},
			// 点击报名
			clickSignUp() {
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
				console.log(url,'22222222222')
				uni.saveImageToPhotosAlbum({
					filePath: this.global.url + url,
					success: function() {
						uni.showToast({
							title: '保存成功',
							icon: 'none'
						})
					}
				})
				// if (this.detail.type == 0) {
				// 	uni.saveImageToPhotosAlbum({
				// 		filePath: this.global.url + url,
				// 		success: function() {
				// 			uni.showToast({
				// 				title: '保存成功',
				// 				icon: 'none'
				// 			})
				// 		}
				// 	})
				// } else {
				// 	let str = this.detail.type == 6 ? '请点击报名' : this.detail.type == 4 ? '提交成功，等待审核' : '该任务待提交'
				// 	uni.showToast({
				// 		title: str,
				// 		icon: 'none'
				// 	})
				// }
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
					let sear = 'douyin'
					let url = e.indexOf(sear)
					let str = e.substr(url, 6);
					if (str == 'douyin') {
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

						plus.runtime.openURL(e)
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
						data: e,
						success: () => {
							uni.showToast({
								title: '已复制到剪贴板',
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
								url: this.global.url + '/index.php/api/common/upload',
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
					
				} else if(this.detail.type == 5){
					uni.chooseImage({
						count: 1,
						success: (res) => {
							uni.uploadFile({
								url: this.global.url + '/index.php/api/common/upload',
								filePath: res.tempFilePaths[0],
								name: 'file',
								success: (resimg) => {
									let data = JSON.parse(resimg.data);
									if (data.code == 1) {
										this.detail.tasksteps[index].url.splice(1,1)
										this.detail.tasksteps[index].url.push(data.data
											.url); // 用于展示
											console.log(index,'1111111111111')
											if(index-1==0){
												console.log(this.textObj,'999999999999')
												this.textObj.url[0]=data.data.url;
											}else if(index-1==1){
												this.textObj.url[1]=data.data.url;
											}
										
										 // 用于验证提交
										console.log(this.textObj)
									}
								}
							})
						}
					})
				}
				
				
				else {
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
					url = '/pages/home/subpage/invite'
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
			},
		}
	}
</script>

<style scoped lang="scss">
	.menu {
		z-index: 999;
		width: 198rpx;
		padding: 1rpx 0;
		font-size: 28rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		box-shadow: 0 1rpx 3rpx 0 rgba(4, 0, 0, 0.5);
		position: fixed;
		right: 0;
		top: 0;

		&>view {
			display: flex;
			margin: 30rpx auto;
			align-items: center;
			justify-content: center;

			&>image {
				width: 32rpx;
				height: 32rpx;
				margin-right: 10rpx;
			}
		}
	}

	.tr3,
	.tr4,
	.top1,
	.left1,
	.left3,
	.text1,
	.right1,
	.copy,
	.btns,
	.tipbt,
	.protocol,
	.setpcont {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.back {
		width: 100%;
		height: 150rpx;
		background: #017ff0;
		border-radius: 0 0 40rpx 40rpx;
	}

	.back1 {
		margin: 0 24rpx;
		position: relative;
		top: -100rpx;
	}

	.tr1 {
		padding: 20rpx;
		background: #FFFFFF;
		border-radius: 10rpx;

		.left1 {
			align-items: flex-start;

			.top1 {
				.img1 {
					width: 99rpx;
					height: 99rpx;
					border-radius: 50%;
					margin-right: 30rpx;
				}

				.text1 {
					height: 80rpx;
					flex-flow: column;
					align-items: flex-start;

					&>text:first-child {
						display: block;
						color: #666666;
						font-size: 30rpx;
						font-weight: bold;
					}

					&>text:last-child {
						display: block;
						color: #666666;
						font-size: 24rpx;
					}
				}
			}

			.bot1 {
				color: #FE0000;
				font-size: 32rpx;
				text-align: right;
				font-weight: bold;

				&>text:last-child {
					display: block;
					color: #666666;
					font-weight: 500;
					font-size: 24rpx;
					margin-top: 10rpx;
				}
			}
		}

		.cen1 {
			color: #666666;
			font-size: 24rpx;
			margin: 25rpx 0 47rpx 0;

			&>text:last-child {
				color: #333333;
				padding: 3rpx 7rpx;
				margin-left: 67rpx;
				background: #017ff0;
			}
		}

		.right1 {
			font-size: 26rpx;
			padding-bottom: 10rpx;

			&>view {
				width: 25%;
				text-align: center;
				border-right: 1px solid #cecece;

				&>text {
					color: #666666;
					display: block;
					margin-top: 20rpx;
				}
			}

			&>view:last-child {
				border: none;
			}
		}
	}

	.tr2 {
		color: #333333;
		margin: 10rpx 0;
		font-size: 24rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		padding: 20rpx 20rpx 30rpx 20rpx;

		.title {
			color: #017ff0;
			margin: 20rpx 0;
			font-size: 28rpx;
			font-weight: bold;
		}

		.title:first-child {
			margin-top: 0;
		}
	}

	.tr3 {
		background: #FFFFFF;
		border-radius: 10rpx;
		padding: 10rpx 20rpx;

		.left3 {
			color: #333333;
			font-size: 22rpx;

			&>image {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
				margin-right: 10rpx;
			}

			.bot3 {
				&>text {
					display: block;
					color: #666666;
				}
			}
		}

		.right3 {
			color: #FFFFFF;
			font-size: 24rpx;
			background: #017ff0;
			padding: 9rpx 18rpx;
		}
	}

	.tr4 {
		margin: 10rpx 0;
		background: #FFFFFF;
		border-radius: 10rpx;
		padding: 27rpx 20rpx;

		&>image {
			width: 19rpx;
			height: 33rpx;
		}

		&>view {
			display: flex;
			color: #017ff0;
			font-size: 28rpx;
			align-items: center;
			font-weight: bold;
			&>image {
				width: 26rpx;
				height: 26rpx;
				margin-left: 20rpx;
			}
		}
	}

	.tr5 {
		padding: 20rpx;
		background: #FFFFFF;
		border-radius: 10rpx;

		.top5 {
			color: #333333;
			font-size: 28rpx;

			&>text {
				color: #999999;
				font-size: 24rpx;
			}
		}

		.steplist {
			margin-top: 30rpx;

			.setpIndex {
				display: flex;
				font-size: 28rpx;
				align-items: center;

				&>view {
					width: 30rpx;
					height: 30rpx;
					color: #FFFFFF;
					font-size: 24rpx;
					line-height: 30rpx;
					text-align: center;
					border-radius: 50%;
					margin-right: 20rpx;
					background-color: #017ff0;
				}
			}

			.setpcont {
				margin-top: 30rpx;
				justify-content: flex-start;

				&>view {
					width: 150rpx;
					height: 60rpx;
					font-size: 28rpx;
					text-align: center;
					line-height: 60rpx;
					margin-right: 30rpx;
					border-radius: 10rpx;
				}

				&>view:first-child {
					background-color: #017ff0;
				}

				&>view:last-child {
					color: #017ff0;
					background-color: #FFF2BE;
				}
			}

			.copy {
				margin: 30rpx auto;
				justify-content: flex-start;

				&>view {
					margin-right: 30rpx;
					border-radius: 10rpx;
				}

				&>view:first-child {
					width: 350rpx;
					height: 60rpx;
					color: #999999;
					font-size: 24rpx;
					padding: 0 20rpx;
					overflow: hidden;
					line-height: 50rpx;
					box-sizing: border-box;
					border: 2px solid #017ff0;
				}

				&>view:last-child {
					width: 150rpx;
					height: 60rpx;
					font-size: 28rpx;
					line-height: 60rpx;
					text-align: center;
					background-color: #017ff0;
				}
			}

			.setinput {
				width: 350rpx;
				height: 60rpx;
				color: #999999;
				margin: 30rpx 0;
				font-size: 24rpx;
				padding: 0 20rpx;
				line-height: 50rpx;
				border-radius: 10rpx;
				box-sizing: border-box;
				border: 2px solid #017ff0;
			}

			.imgs1 {
				width: 180rpx;
				height: 180rpx;
				margin: 20rpx 30rpx 0 0;
			}

			.imgs2 {
				width: 230rpx;
				height: 400rpx;
				margin: 20rpx 30rpx 0 0;
				// position: relative;
			}
			.imgs0{
				width: 230rpx;
				height: 400rpx;
				margin: 20rpx 30rpx 0 0;
			}
			.imgs1{
				width: 230rpx;
				height: 400rpx;
				margin: 20rpx 30rpx 0 0;
				position: relative;
			}
			.imgs1Word{
				color: red;
				position: absolute;
				top: 50%;
				left: 55%;
				transform: translate(-50%,-50%);
				font-weight: bold;
			}
				
			.imgadd {
				width: 120rpx;
				height: 120rpx;
				color: #FFFFFF;
				font-size: 24rpx;
				margin-top: 20rpx;
				text-align: center;
				vertical-align: top;
				background: #017ff0;
				display: inline-block;

				&>text {
					display: block;
					font-size: 50rpx;
				}
			}
		}
	}

	.tr0 {
		display: flex;
		position: relative;
	}

	.zhe {
		z-index: 9;
		opacity: 0.7;
		width: 180rpx;
		color: #EEC891;
		height: 180rpx;
		font-size: 22rpx;
		text-align: center;
		background: #000000;
		line-height: 180rpx;
		margin: 20rpx 30rpx 0 0;
		position: absolute;
		left: 0;
		top: 0;
	}

	.zhe1 {
		z-index: 9;
		width: 90rpx;
		height: 40rpx;
		font-size: 26rpx;
		line-height: 40rpx;
		text-align: center;
		background-color: #017ff0;
		border-radius: 0 20rpx 0 20rpx;
		position: absolute;
		top: 20rpx;
		left: 0;
	}

	.btns {
		z-index: 9;
		width: 100%;
		height: 98rpx;
		color: #333333;
		font-size: 30rpx;
		box-shadow: 0 0 5rpx #ddd;
		background: #FFFFFF;
		line-height: 98rpx;
		text-align: center;
		position: fixed;
		bottom: 0;

		&>view:first-child {
			width: 30%;
			display: flex;
			align-items: center;
			justify-content: center;

			&>image {
				width: 34rpx;
				height: 28rpx;
				margin-right: 10rpx;
			}
		}

		.btng {
			width: 100% !important;
		}

		&>view:last-child {
			width: 70%;
			background: #017ff0;
		}
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

	.tip-content {
		z-index: 999;
		width: 550rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		overflow: hidden;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.tip-back {
		width: 100%;
		color: #333333;
		font-size: 30rpx;
		text-align: center;
		background: #017ff0;
		line-height: 146rpx;
		border-radius: 0 0 50% 50%/0 0 45% 45%;

		&>text {
			margin-left: 100rpx;
		}

		&>image {
			float: right;
			width: 43rpx;
			height: 43rpx;
			margin: 20rpx;
		}
	}

	.tipbord {
		padding: 14rpx 24rpx 24rpx 24rpx;
	}

	.tip1 {
		color: #333333;
		font-size: 28rpx;
		margin-bottom: 20rpx;
	}

	.tip2 {
		color: #333333;
		font-size: 24rpx;
		margin-bottom: 30rpx;
	}

	/* 协议 */
	.protocol {
		color: #333333;
		font-size: 24rpx;
		justify-content: flex-start;

		&>image {
			width: 28rpx;
			height: 28rpx;
			margin-right: 20rpx;
		}

		&>view {
			width: 24rpx;
			height: 24rpx;
			border-radius: 50%;
			margin-right: 20rpx;
			border: 1px solid #333333;
		}
	}

	.tipbt {
		margin-top: 30rpx;

		&>text {
			color: #017ff0;
			font-size: 24rpx;
			font-weight: bold;
			background: #ffece8;
			padding: 19rpx 23rpx;
			border-radius: 10rpx;
		}

		&>text:last-child {
			color: #017ff0;
			font-weight: 500;
		}
	}

	.tip {
		&-del {
			z-index: 999;
			width: 480rpx;
			height: 300rpx;
			background: #FFFFFF;
			border-radius: 10rpx;
			overflow: hidden;
			position: fixed;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}

		&-top {
			display: flex;
			margin: 20rpx 0;
			font-size: 28rpx;
			align-items: center;
			justify-content: center;

			&>image {
				width: 30rpx;
				height: 30rpx;
				margin-right: 20rpx;
			}
		}

		&-titdel {
			display: flex;
			margin: 68rpx 0;
			font-size: 28rpx;
			align-items: center;
			justify-content: center;
		}

		&-btn {
			display: flex;
			font-size: 28rpx;

			&>view {
				width: 50%;
				height: 70rpx;
				line-height: 70rpx;
				text-align: center;
			}

			&>view:last-child {
				background-color: #017ff0;
			}
		}
	}
</style>
