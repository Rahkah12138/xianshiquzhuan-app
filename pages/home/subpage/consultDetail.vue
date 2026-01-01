<template>
	<view class="chat-container">
		<view class="status_bar"></view>
		<view class="nav">
			<image src="/static/noviciate/left.png" @click="back" class="back-icon"></image>
			<view class="nav-title">聊天</view>
			<view class="nav-action" @click="toUsers">成员</view>
		</view>

		<scroll-view class="message-list" scroll-y="true" :scroll-with-animation="true" :scroll-top="scrollTop" @scroll="scroll">
			<view class="notice-banner">
				<text>温馨提示：私下加好友留微信QQ号或私拉群，最低扣50元，多次私加或拉群扣100元，或直接暂停任务并扣除所有赏金。对方有以上情况请联系人工客服举报，有奖励!(奖励根据悬赏主余额以及保证金多少来定，只奖励最先举报的)</text>
			</view>

			<block v-if="userId" v-for="(item,index) in msgs" :key="item.id">
				<view class="time" v-if="item.timeStr">{{item.timeStr}}</view>
				<view :class="['message-item', item.fromUser.id == userId ? 'sent' : 'received']">
					<image :src="item.fromUser.avatar" class="avatar"></image>
					<view class="message-content">
						<view class="username" v-if="item.fromUser.id != userId">
							<text v-if="item.fromUser.id==10000">客服</text>
							<text v-else-if="item.comid == 0">{{ item.fromUser.id == item.tasker ? (inType ? item.fromUser.nickname : '接单人') : '悬赏主' }}</text>
							<text v-else>{{ item.fromUser.id == item.faqifang ? '举报人' : '被举报人' }}</text>
						</view>
						<view class="bubble">
							<text v-if="item.type==1" userSelect="true">{{item.content}}</text>
							<image v-if="item.type==2" @click="perviewImg(item.content)" :src="item.content" mode="aspectFill" class="message-image"></image>
							<video v-if="item.type == 3" :src="item.content" class="message-video"></video>
						</view>
					</view>
				</view>
			</block>
		</scroll-view>

		<view class="input-bar">
			<input type="text" v-model="content" placeholder="想和TA说点什么..." class="input-field" />
			<image @click="sendVideo" src="../../../static/video.png" class="action-icon"></image>
			<image @click="sendImage" src="../../../static/release/tab3.png" class="action-icon"></image>
			<button @click="sendMessage" class="send-btn">发送</button>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				id:'',
				obj:'',
				content:'',
				lastMsgId:'',
				msgs:[],
				user:{},
				userId:'',
				img:'',
				scrollTop:'',
				old: {
					scrollTop: 0
				},
				itl:'',
				inType: null
			}
		},
		onUnload() {
			clearInterval(this.itl)
		},
	
		onLoad(option) {
			if(option.inType){
				this.inType = option.inType
			}
			this.room_id = option.room_id
			this.user=uni.getStorageSync('token')
			this.userId=this.user.id
			let that=this;
			this.itl=setInterval(function(){
				that.getChat();
			},5000)
		},
		onShow() {
			this.getChat()
			
			
		},
		methods:{
			back(){
				clearInterval(this.itl)
				uni.navigateBack({
					delta:1
				})
			},
			topScrollClick(e) {
				let that=this;
				// 解决view层不同步的问题
				this.scrollTop = this.old.scrollTop
				this.$nextTick(function() {
					this.scrollTop =1000000
				});
			},
			scroll(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			toUsers(){
				uni.navigateTo({
					url:'/pages/home/subpage/consultUser?room_id='+this.room_id
				})
			},

			perviewImg(i) {
				var a=[]
				a.push(i)
				uni.previewImage({
					urls: a,
					//indicator: 'number',
					loop: false
				});
			},
			getChat(){
			
				let that=this;
				uni.request({
					url: this.global.url + '/api/message/getMessageList',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						lastMsgId:this.lastMsgId,
						room_id:this.room_id,
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						if (res.data.code == 1) {
							
							let isScroll=that.msgs.length !=res.data.data.length
							that.msgs=res.data.data
							if(that.msgs.length>0){
								that.lastMsgId=that.msgs[that.msgs.length-1].id
							}
							if(isScroll){
								
								that.topScrollClick()
							}
							
							
							
						}
					}
				})
			},
			sendMessage(){
				if(!this.content){
					
					uni.showToast({
						title: '请输入聊天内容',
						icon: 'none'
					})
					return;
				}
				this.sendData(1,this.content)
				
				//this.topScrollClick()
			},
			sendData(type,content){
				let that=this;
				uni.request({
					url: this.global.url + '/api/message/sendMsg',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						type:type,
						room_id:this.room_id,
						content: content,
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						if (res.data.code == 1) {
							if(type == 1){
								that.content='';
								
							}
							that.getChat()
							
							//that.topScrollClick()
						}
					}
				})
			},
			sendVideo() {
				let that = this;
				uni.chooseVideo({
					sourceType: ['album'],
					mediaType:['video'],
					count: 1,
					success: (res) => {
						uni.uploadFile({
							url: this.global.url + '/api/common/uploads?token=' + uni.getStorageSync(
								'token').token,
							filePath: res.tempFilePath,
							name: 'file',
							success: (resimg) => {
								if (JSON.parse(resimg.data).code == 1) {
									//let img = that.global.url+JSON.parse(resimg.data).data;
									let img =JSON.parse(resimg.data).data.fullurl;
									that.sendData(3,img)
								}
							}
						});
					}
				});
			},
			sendImage() {
				let that = this;
				uni.chooseImage({
					count: 1,
					success: (res) => {
						uni.uploadFile({
							url: this.global.url + '/api/common/upload?token=' + uni.getStorageSync(
								'token').token,
							filePath: res.tempFilePaths[0],
							name: 'file',
							success: (resimg) => {
								if (JSON.parse(resimg.data).code == 1) {
									//let img = that.global.url+JSON.parse(resimg.data).data;
									let img =JSON.parse(resimg.data).data.fullurl;
									that.sendData(2,img)
								}
							}
						});
					}
				});
			},
			init(){
				let _this = this
				uni.request({
					url:_this.global.url+'/api/Notice/read',
					method:"GET",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data:{
						id:_this.id
					},
					success(res) {
						_this.obj = res.data.data;
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@keyframes slideInUp {
		from {
			transform: translateY(50px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.chat-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #f5f5f5;
	}

	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
		background-color: #E63946;
	}

	.nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 88rpx;
		background-color: #E63946;
		color: #ffffff;
		padding: 0 30rpx;
	}

	.back-icon {
		width: 40rpx;
		height: 40rpx;
	}

	.nav-title {
		font-size: 36rpx;
		font-weight: bold;
	}

	.nav-action {
		font-size: 28rpx;
	}

	.message-list {
		flex: 1;
		overflow-y: auto;
	}

	.notice-banner {
		background-color: #fffbe6;
		color: #faad14;
		padding: 20rpx;
		border-radius: 10rpx;
		font-size: 24rpx;
		margin: 20rpx;
		animation: slideInUp 0.5s ease-out forwards;
		text-align: center;
	}

	.time {
		text-align: center;
		color: #999;
		font-size: 24rpx;
		margin: 20rpx 0;
	}

	.message-item {
		display: flex;
		margin-bottom: 30rpx;
		animation: slideInUp 0.5s ease-out forwards;
		margin-left: 20rpx;
		margin-right: 20rpx;

		&.sent {
			flex-direction: row-reverse;

			.bubble {
				background-color: #E63946;
				color: #ffffff;
			}
		}

		&.received {
			.bubble {
				background-color: #ffffff;
				color: #333;
			}
		}
	}

	.avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.message-content {
		margin: 0 20rpx;
		max-width: 70%;
	}

	.username {
		font-size: 24rpx;
		color: #999;
		margin-bottom: 10rpx;
	}

	.bubble {
		padding: 20rpx;
		border-radius: 20rpx;
		font-size: 28rpx;
	}

	.message-image {
		width: 300rpx;
		height: 300rpx;
		border-radius: 20rpx;
	}

	.message-video {
		width: 400rpx;
		height: 400rpx;
		border-radius: 20rpx;
	}

	.input-bar {
		display: flex;
		align-items: center;
		padding: 20rpx;
		background-color: #ffffff;
		border-top: 1rpx solid #eee;
	}

	.input-field {
		flex: 1;
		height: 80rpx;
		background-color: #f5f5f5;
		border-radius: 40rpx;
		padding: 0 30rpx;
		font-size: 28rpx;
	}

	.action-icon {
		width: 50rpx;
		height: 50rpx;
		margin: 0 20rpx;
	}

	.send-btn {
		background-color: #E63946;
		color: #ffffff;
		border-radius: 40rpx;
		padding: 0 40rpx;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
	}
</style>
