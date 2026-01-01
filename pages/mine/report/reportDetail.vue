<template>
	<!-- 举报详情 -->
	<view>
		<view>
		<view v-for="arr in weiquanDetailsList">
			<view class="data">
				<view class="datas">{{arr.createtime}}</view>
			</view>
			<view class="title">
				<view class="content">任务编号：{{arr.tasklist_id}}</view>
			</view>
			<view class="liyou">
				<span>举报理由</span>
				<view class="lycontent">{{arr.content}}</view>
			</view>
			<view style="font-size: 24rpx;justify-content: flex-end;display:flex;padding:20rpx;">
				<view v-if="arr.status !=0 && userinfo.id == arr.businessid && arr.is_guzhu !== 1 " @click="agree" style="margin-top:20rpx;margin-right:40rpx;border:1px solid  red;color:red;padding: 10rpx 10rpx;border-radius: 10rpx;float:left;">
					审批通过
				</view>
				<view v-if="arr.status !=0 && userinfo.id != arr.businessid" @click="giveup" style="margin-top:20rpx;margin-right:40rpx;border:1px solid  red;color:red;padding: 10rpx 10rpx;border-radius: 10rpx;float:left;">
					放弃任务
				</view>
				
				<view @click="goRoom" style="margin-top:20rpx;margin-right:40rpx;border:1px solid  red;color:red;padding: 10rpx 10rpx;border-radius: 10rpx;float:left;">
					举证辩诉
				</view>
			</view>
			<view class="imgtitle">
				<view class="tit">截图</view>
				<view class="imgView" v-for="item in arr.image"@click="perviewImg(arr.image)">
					<image :src="getImgUrl(item)" ></image>
				</view>
			</view>
		</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				fileUrl:'',
				token:'',
				weiquanDetailsList:[],
				id:'',
				userinfo:''
			}
		},
		onLoad(event) {
			let fileUrl = event.fileUrl
			this.fileUrl = fileUrl
			this.id=event.id
			this.userinfo=uni.getStorageSync('token')
			this.getJuBaoList(event.id)
		},
		methods: {
			giveup(){
				let that =this
				uni.request({
					url: that.global.url + '/api/User/giveup',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token,
						id:this.id
						},
					success: (res) => {
						if (res.data.code == 1) {
							uni.showToast({
								title: '操作成功',
								icon:'none'
							})
							that.getJuBaoList(that.id)
						}else{
							uni.showToast({
								title: res.data.msg,
								icon:'none'
							})
						}
					}
				})
			},
			agree(){
				let that =this
				uni.request({
					url: that.global.url + '/api/User/agree',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token,
						id:this.id
						},
					success: (res) => {
						if (res.data.code == 1) {
							uni.showToast({
								title: '操作成功',
								icon:'none'
							})
							that.getJuBaoList(that.id)
						}else{
							uni.showToast({
								title: res.data.msg,
								icon:'none'
							})
						}
					}
				})
			},
			goRoom() {
				let that = this;
				uni.request({
					url: that.global.url + "/api/message/createComplainRoom",
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
						id:this.id,
					},
					success: (res) => {
						if (res.data.code == 1) {
							console.log(res.data)
						
							
							uni.navigateTo({
								url: "/pages/home/subpage/consultDetail?room_id="+res.data.data.room_id
							})
						}
					
					}
				})
			
			},
			getJuBaoList(id){
				let that =this
				uni.request({
					url: that.global.url + '/api/User/comDetails',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token,
						id:id
						},
					success: (res) => {
						if (res.data.code == 1) {
							console.log('weiquanDetailsList',res)
							that.weiquanDetailsList =[res.data.data]
						}
					}
				})
			},
			getImgUrl(imae){
				if(imae.includes('http')){
					return imae
				}else{
					return this.global.url+imae;
				}
			},
			// 预览图片
			perviewImg(url) {
				
				let arr = url.map(img =>{
					if(img.includes('http')){
						return img
					}else{
						return this.global.url+img;
					}
				})
				uni.previewImage({
					urls: arr,
					indicator: 'number',
					loop: true
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	page{
		background-color: WhiteSmoke;
	}
	.data{
		height: 100rpx;
		.datas{
			text-align: center;
			line-height: 100rpx;
			font-size: 28rpx;
			color: #C0C0C0;
		}
	}
	.title{
		// height: 80rpx;
		height: 100rpx;
		font-size: 28rpx;
		color: #A9A9A9;
		width: 100%;
		background-color: white;
		.content{
			line-height: 100rpx;
			margin: 15rpx;
		}
	}
	.liyou{
		margin: 15rpx 0 0 0;
		span{
			font-size: 30rpx;
			color: #A9A9A9;
			margin: 0 0 0 15rpx;
			height: 80rpx;
		}
		.lycontent{
			height: 300rpx;
			background-color: white;
			margin: 15rpx 15rpx 0 15rpx;
			font-size: 30rpx;
		}
	}
	.imgtitle{
		.tit{
			margin: 15rpx;
			font-size: 28rpx;
			color: #A9A9A9;
		}
		.imgView{
			display: inline;
		image{
			width:  167rpx;
			height: 167rpx;
			margin: 0 5rpx 0 15rpx;
		  }
		}
	}
</style>
