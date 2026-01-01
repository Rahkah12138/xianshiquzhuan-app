<template>
	<view>
		<view class="xiaoxi_li" v-for="(item,index) in list" @click="duihua(item.targetId)">
			<view class="xiao">
<!-- 				<image src="../../../static/239cdb69-88c0-4ebd-9eec-c4dfaeb6d246.jpg" mode=""></image> -->
			</view>
			<view class="zi">
				<view class="fenpi">
					<view>
						ID: {{item.targetId}} 
					</view>				
					 <view class="p1">
						<view class="p11" @click.stop="shanchu(item.targetId)" >删除会话</view>					
						<view class="p12" v-if="item.unreadMessageCount>0">{{item.unreadMessageCount}}</view>
					 </view>				 
				</view>
				<view class="yichushen">{{item.latestMessage.content.content}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[],
				
			}
		},
		onLoad:function(){
			var that=this
			var im = that.$im
			var RongIMLib=that.$RongIMLib
			that.get_list()
			im.watch({
			conversation: function(event){
			  var updatedConversationList = event.updatedConversationList; // 更新的会话列表
				that.get_list()	
							
			},
			  message: function(event){
			    var message = event.message;
			    console.log('收到新消息:', message);
				
				
			  },
			  status: function(event){
			    var status = event.status;
			    console.log('连接状态码:', status);
			  }
			});
			
		},
		
		methods: {
			
			
			// 删除会话
			shanchu:function(a){
				var that=this
				var im = that.$im
				var RongIMLib=that.$RongIMLib
				var conversation = im.Conversation.get({
				  targetId: a,
				  type: RongIMLib.CONVERSATION_TYPE.PRIVATE
				});
				conversation.destory().then(function(){
				  console.log('删除会话成功');
				  that.get_list()
				});
				
				conversation.read().then(function(){
				  console.log('清除未读数成功'); // im.watch conversation 将被触发
				});
				
			},
			// 获取会话列表
			get_list:function(){
				var that=this
				var im = that.$im
				var RongIMLib=that.$RongIMLib
				var option = {
				  count: 30 
				};
				im.Conversation.getList(option).then(function(conversationList) {
				  console.log('获取会话列表成功', conversationList);
				  that.list=conversationList
				});
			},
			
			
			
			duihua:function(a){
				var that=this
				var im = that.$im
				var RongIMLib=that.$RongIMLib
				var conversation = im.Conversation.get({
				  targetId:a,
				  type: RongIMLib.CONVERSATION_TYPE.PRIVATE
				});
				conversation.read().then(function(){
				  console.log('清除未读数成功'); // im.watch conversation 将被触发
				});
				
				uni.navigateTo({
					url:'/pages/member/duihua?id='+a
				})
				
			},
			
			
			
		}
	}
</script>

<style>
	.p12{
		width: 35rpx;
		height: 35rpx;
		color: #fff;
		text-align: center;
		font-size: 24rpx;
		background: red;
		border-radius: 50%;
		margin-left: 20rpx;
	}
	.p11{
		color: red;
		font-size: 26rpx;
	}
	.p1{
		display: flex;
		align-items: center;
	}
	.fenpi{
		display: flex;
		justify-content: space-between;
	}
	.zi{
		width: calc(100% - 200rpx);
	}
	.yichushen{
		overflow:hidden;
			text-overflow:ellipsis;
			white-space:nowrap
	}
	.xiaoxi_li{
		display: flex;
		align-items: center;
		padding: 30rpx;
		width: 100%;
	}
	.xiao{
		width: 80rpx;
		height: 80rpx;
		margin-right: 20rpx;
		flex-shrink: 0;
	}
	.xiao image{
		width: 100%;
		height: 100%;
		border-radius: 50%;
		flex-shrink: 0;
	}
	
</style>
