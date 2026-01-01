<template>
	<view>
		<view style="padding-bottom: 100rpx;height: 100%;"  v-if="scrollTop">
			<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" >
							<view v-for="(item,index) in xiaoxi_list">
								<view class="ziji" v-if="item.type==2">								
									<view class="tu1" v-if="item.img">
										<image @click="perviewImg(item.img)" :src="item.img" mode="widthFix"></image>
									</view>
									<view v-else> 
										{{item.content}}
									</view>
									<image style="margin-left: 20rpx;"  class="tuer" :src="wodetou" mode=""></image>
								</view>
								<view class="bieren" v-if="item.type==1">
									<image style="margin-right: 20rpx;" class="tuer"  :src="duitou" mode=""></image>
									<view  class="tu1"  v-if="item.img">
										<image @click="perviewImg(item.img)" :src="item.img" mode="widthFix"></image>
									</view>
									<view v-else>
										{{item.content}}
									</view>								
								</view>
							</view>
			                    
			                   
			</scroll-view>
		</view>
		<view class="dibu">
			<view class="dibu_1">
				<input type="text" v-model="xinxi" value="" />
			</view>
			<view @click="fasongtu">
				<image class="tu" src="../../static/tiantu.png" mode="widthFix"></image>
			</view>
			<view @click="fasongzi" class="fasongzi">
				发送
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uid:'',
				benid:'',
				xiaoxi_list:[],
				xinxi:'',
				scrollTop:'',
				wodetou:'',
				duitou:'',
				  old: {
				                scrollTop: 0
				            }
			}
		},
		onLoad:function(options){
			var that=this
			that.uid=options.id
			that.benid=uni.getStorageSync('token').id
			that.wodetou = that.global.url+ uni.getStorageSync('token').avatar
			console.log(that.wodetou)
			var im=that.$im
			var conversationList = []; // 当前已存在的会话列表
			im.watch({
			  conversation: function(event){
			    var updatedConversationList = event.updatedConversationList; // 更新的会话列表
			    console.log('更新会话汇总:', updatedConversationList);
			        console.log('最新会话列表:', im.Conversation.merge({
			          conversationList,
			          updatedConversationList
			        }));
				
				
			  },
			  message: function(event){
			    var message = event.message;
			    console.log('收到新消息:', message);
				if(message.senderUserId==that.uid){
					var b={
						type:1,
						content:message.content.content,
						img:message.content.imageUri
					}
					that.xiaoxi_list.push(b)
					 that.scrollTop = that.old.scrollTop
					            that.$nextTick(() => {
					                that.scrollTop = that.xiaoxi_list.length * 150
					 			   	   
					            });
				}
				
			  },
			  status: function(event){
			    var status = event.status;
			    console.log('连接状态码:', status);
			  }
			});
			that.huoli()
			that.get_touxiang()
		},
		
		methods: {
			// 预览图片
			perviewImg(i) {
				var a=[]
				a.push(i)
				uni.previewImage({
					urls: a,
					indicator: 'number',
					loop: true
				});
			},
			
			// 获取头像
			get_touxiang:function(){
				var that=this
				uni.request({
					url: that.global.url + '/api/user/rong_get_users',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token:uni.getStorageSync('token').token,
						id: that.uid,
						
					},
					success: (res) => {
						 console.log(res)
						 that.duitou=res.data.data.avatar
					}
				})
				
				
			},
			
			// 获取历史信息
			huoli:function(){
				var that=this
				var im = that.$im
				var RongIMLib=that.$RongIMLib
				var conversation = im.Conversation.get({
				  targetId:that.uid ,
				  type: RongIMLib.CONVERSATION_TYPE.PRIVATE
				});
				var option = {
				  timestrap: +new Date(),
				  count: 20
				};
				conversation.getMessages(option).then(function(result){
				  var list = result.list; // 历史消息列表
				  var hasMore = result.hasMore; // 是否还有历史消息可以获取
				  console.log('获取历史消息成功', list, hasMore);
				  	for (var i = 0; i < list.length; i++) {
				  		
						if(list[i].senderUserId!=that.benid){
							var b={
								type:1,
								content:list[i].content.content,
								img:list[i].content.imageUri
							}
							that.xiaoxi_list.push(b)
							
								
						}else{
							var b={
								type:2,
								content:list[i].content.content,
								img:list[i].content.imageUri
							}
							that.xiaoxi_list.push(b)
						
								
						}
				  	}
					that.scrollTop = that.old.scrollTop
					           that.$nextTick(() => {
					               that.scrollTop = that.xiaoxi_list.length * 150
								   	   
					           });
					console.log(that.xiaoxi_list)
				});
				
				
			},
			// 发送文字消息
			fasongzi:function(){
				var that=this
				var im = that.$im
				var RongIMLib=that.$RongIMLib
				if(that.xinxi==''){
					uni.showToast({
						title:'输入消息不能为空',
						icon:'none',
					})
				}
				var conversation = im.Conversation.get({
				  targetId: that.uid,
				  type: RongIMLib.CONVERSATION_TYPE.PRIVATE
				});
				conversation.send({
				  messageType: RongIMLib.MESSAGE_TYPE.TEXT, // 'RC:TxtMsg'
				  content: {
				    content: that.xinxi // 文本内容
				  }
				}).then(function(message){
					that.xinxi=''
					var b={
						type:2,
						content:message.content.content,
						img:''
					}
					that.xiaoxi_list.push(b)
					that.scrollTop = that.old.scrollTop
					           that.$nextTick(() => {
					               that.scrollTop = that.xiaoxi_list.length * 150
								   	   console.log( that.scrollTop )
					           });
						
				  console.log('发送文字消息成功', message);
				});
				
				
			},
			// 发送图片消息
			fasongtu:function(){
				var that=this
				var im = that.$im
				var RongIMLib=that.$RongIMLib
				
					uni.chooseImage({
						count: 1,
						success: (res) => {
							res.tempFilePaths.forEach((i) => {
								uni.uploadFile({
									url: this.global.url + '/index.php/api/common/uploads',
									filePath: i,
									name: 'file',
									formData: {
										'upload': 'upload'
									},
									success: (resimg) => {
										let data = JSON.parse(resimg.data);
										
										var conversation = im.Conversation.get({
										  targetId: that.uid,
										  type: RongIMLib.CONVERSATION_TYPE.PRIVATE
										});
										conversation.send({
										  messageType: RongIMLib.MESSAGE_TYPE.RICH_CONTENT, // 'RC:ImgTextMsg'
										  content: {
										    title: '图文标题',
										    content: '图文内容',
										    imageUri: data.data.fullurl,
										    url: data.data.fullurl
										  }
										}).then(function(message){
											var b={
												type:2,
												content:'',
												img:message.content.imageUri
											}
											that.xiaoxi_list.push(b)
											that.scrollTop = that.old.scrollTop
											           that.$nextTick(() => {
											               that.scrollTop = that.xiaoxi_list.length * 150
														   	   console.log( that.scrollTop )
											           });
										  console.log('发送图文消息成功', message);
										});
									}
								});
							});
						}
					});
				
			},
			
			
			
		}
	}
</script>

<style>
	.fasongzi{
		color: #fff;
	}
	.lianjie{
		
	}
	.ziji{
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 20rpx;
	}
	.bieren{
		display: flex;
		align-items: center;
		
		padding: 20rpx;
	}
	
	.tu{
		width: 80rpx;
	}
	.tuer{
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		flex-shrink: 0;
	}
	.tu1 image{
		width: 60rpx;
	}
	.tu1{
		width: 60rpx;
	}
	.dibu{
		display: flex;
		position: fixed;
		bottom: 0;
		width: 100%;
		align-items: center;
		padding:0rpx 20rpx;
		height: 100rpx;
		background: rgb(0, 149, 239);
	}
	.tu{
		width: 70rpx;
		margin: 0 20rpx;
	}
	scroll-view{
		width: 100%;
		height:1350rpx;
		
	}
	.dibu_1{
		width: calc(100% - 220rpx);
		background: #fff;
		height: 70rpx;
		line-height: 70rpx;
		display: flex;
		align-items: center;
		border-radius: 15rpx;
		padding-left: 10rpx;
	}
</style>
