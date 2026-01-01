<template>
	<view >
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		<view class="nav">
			<image src="/static/noviciate/left.png" @click="back" mode=""></image>
			<view class="nav_word1">分享</view>
			<view class="rule" @click="gz">
				邀请规则
			</view>
		</view>
		<!-- 内容一 -->
		<view class="content">
			<view class="content_nav" @click="invitation">
				<image src="/static/share/bg.png" class="shareImg" mode=""></image>
				<view class="content_word">
					点击生成我的专属海报
				</view>
			</view>
			
			<view class="content_tain1" v-if="detail">
				<view class="tainImg1">
					<image src="/static/share/content_tain1.png" class="tainImg1" mode=""></image>
					<view class="tainConet">
						<view class="tainConetWord">
							邀请超简单
						</view>
						<view class="tainImg1Box">
							<view class="taImg1">
								<view class="taImg1_img">
									<image src="/static/share/icon_12x.png" class="taImg1_img" mode=""></image>
								</view>

								<view class="taImg1Word">
									向好友发送二维码
								</view>
							</view>
							<view class="tainWire1">

							</view>
							<view class="taImg1">
								<view class="taImg1_img">
									<image src="/static/share/icon_22x.png" class="taImg1_img" mode=""></image>
								</view>

								<view class="taImg1Word">
									向好友通过二维码注册
								</view>
							</view>
							<view class="tainWire1">

							</view>
							<view class="taImg1">
								<view class="taImg1_img">
									<image src="/static/share/icon_32x.png" class="taImg1_img" mode=""></image>
								</view>
								<view class="taImg1Word">
									下载安装登录
								</view>
							</view>

						</view>

					</view>

				</view>

			</view>
			<view class="content_tain2">
				<view class="content_tain2Img">
					<image src="/static/share/img_bgx.png" class="balanceImg" mode=""></image>
					<view class="content_tain2Conent">
						<view class="content_tain2ConentWord">
							奖励一：邀请好友奖励提成
						</view>
						<view class="content_tain2ConentImg">
							<view class="envelopesBox1">
								<image src="/static/share/envelopes.png" class="envelopesImg1" mode=""></image>
								<view class="envelopesBox1Word">
									<view class="envelopesBox1Word1" >
									{{detail.reward_one[0]}}元
									</view>
									<view class="envelopesBox1Word2" style="padding: 0 30rpx;font-size: 18rpx;">
										一级好友完成首次注册
									</view>
								</view>
							</view>
								<view class="envelopesBox2">
									<image src="/static/share/envelopes.png" class="envelopesImg2" mode=""></image>
								<view class="envelopesBox1Word">
									<view class="envelopesBox1Word1">
									+{{detail.reward_one[1]-0+(detail.reward_one[2]-0)}}元
									</view>
									<view class="envelopesBox1Word2" style="padding: 0 30rpx;font-size: 18rpx;">
										一级好友完成首次任务<!-- +{{detail.reward_one[1]}} -->
									
									</view>
									<!-- <view class="envelopesBox1Word3"  style="padding: 0 30rpx;font-size: 18rpx">
										二级好友完成首次任务+{{detail.reward_one[2]}}
									</view> -->
								</view>
								</view>
								<view class="envelopesBox3">
									<image src="/static/share/envelopes.png" class="envelopesImg3" mode=""></image>
									<view class="envelopesBox1Word">
										<view class="envelopesBox1Word1">
										+{{detail.reward_one[3]-0+(detail.reward_one[4]-0)}}元
										</view>
										<view class="envelopesBox1Word2" style="padding: 0 30rpx;font-size: 18rpx;">
										一级好友完成首次提现<!-- +{{detail.reward_one[3]}} -->
										</view>
										<!-- <view class="envelopesBox1Word3" style="padding: 0 30rpx;font-size: 18rpx;">
											二级好友完成首次提现+{{detail.reward_one[4]}}
										</view> -->
									</view>
								</view>

						</view>
						<view class="content_tain2Word2">
							奖励将自动发放到账户余额
						</view>
					</view>
				</view>
				
			</view>
		  <!-- <view class="content_tain3">
				<view class="rewardImg">
					<image src="/static/share/reward.png" class="reward" mode=""></image>
					<view class="rewardImgContent">
						<view class="rewardWordBox">
							奖励二：永久收益提成
						</view>
						<view class="rewardImg1">
							<view class="reward2"> 
								<image src="/static/share/reward2.png" class="reward2Img" mode=""></image>
								<view class="rewardWord">
									{{detail.reward_two[0]}}
								</view>
							</view>
							
						</view>
						<view class="rewardImg2">
							<view class="reward2">
								<image src="/static/share/reward1.png" class="reward2Img" mode=""></image>
								<view class="rewardWord">
									{{detail.reward_two[1]}}
								</view>
							</view>
						</view>
						<view class="rewardImgContentWord">
							奖励将自动发放到账户余额
						</view>
					</view>
				</view>
		  	
		  </view> -->
		</view>
		<!-- 内容二 -->
		<view class="content2">
			<view class="content2Reward">
				<image src="/static/share/reward3.png" class="content2RewardImg" mode=""></image>
				<view class="content2RewardContent">
					<view class="content2RewardContentWrod">
						奖励二：永久做任务提成
					</view>
					<view class="content2RewardImg2">
						<view class="content2RewardImg2-img1">
							<image src="/static/share/reward4.png" mode=""></image>
							<view class="content2RewardImg2-img1">
								<view class="cTitle">
									一级好友完成悬赏任务
								</view>
								<view class="cTitle1">
									{{detail.reward_three[0]}}%
								</view>
							</view>
						</view>
						<view class="content2RewardImg2-img2">
							<image src="/static/share/reward4.png" mode=""></image>
							<view class="content2RewardImg2-img2-img2">
								<view class="cTitle">
									二级好友完成悬赏任务
								</view>
								<view class="cTitle1">
								{{detail.reward_three[1]}}%
								</view>
							</view>
						</view>
					</view>
					<view class="botWord">
						奖励将自动发放到账户余额
					</view>
					
				</view>
			</view>
			<view class="content2Reward2">
				<view class="content2Reward2Img">
					<image src="/static/share/reward5.png" class="content2Reward2Img-img" mode=""></image>
					<view class="content2Reward2CBox">
						<view class="content2Reward2CBoxWord">
							奖励三：月赚钱榜巨额奖励
						</view>
						<view class="imgBox">
							<view class="content2Reward2CBox1">
								<image src="/static/share/redEnvelopes.png" class="redImg" mode=""></image>
								<view class="redImgWord">
									<view class="redImgWord1">
										{{detail.reward_four[0]}}元
									</view>
									<view class="redImgWord2">
										第一名
									</view>
								</view>
							</view>
							<view class="content2Reward2CBox2">
								<image src="/static/share/redEnvelopes.png" class="redImg" mode=""></image>
								<view class="redImgWord">
									<view class="redImgWord1">
										{{detail.reward_four[1]}}元
									</view>
									<view class="redImgWord2">
										第二名
									</view>
								</view>
							</view>
							<view class="content2Reward2CBox3">
								<image src="/static/share/redEnvelopes.png" class="redImg" mode=""></image>
								<view class="redImgWord">
									<view class="redImgWord1">
										{{detail.reward_four[2]}}元
									</view>
									<view class="redImgWord2">
										第三名
									</view>
								</view>
							</view>
						</view>
						<view class="btomWord" @click="seeList">
							<image src="/static/share/buttonImg.png" class="buttonImg" mode=""></image>
							<view class="btomWordBox">
								查看榜单
							</view>
						</view>
					
					
					</view>
				</view>
			</view>
			<view class="content2Reward3">
				<view class="content2Reward3Img">
					<image src="/static/share/reward5.png" class="reward5Img" mode=""></image>
					<view class="content2Reward3ImgCtitle">
						<!-- <view class="content2Reward3ImgCtitleNav">
							邀请小技巧
						</view> -->
						<view class="content2Reward3ImgCtitleNavC">
							<view v-html="detail.invitation_skill">
								
							</view>
						</view>
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
				detail:'',
				
			};
		},
		onLoad:function(){
			var that=this
			that.get_detail()
		},
		
		methods:{
			back(){
				uni.navigateBack({
					delta:1
				})
			},
			// 详情
			get_detail:function(){
				var that=this
				uni.request({
					url: that.global.url + '/api/user/builds',
					method: 'get',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
					if(res.data.code==1){
						console.log(res)
						that.detail=res.data.data
					}
					}
				})
				
				
			},
			
			gz:function(){
				uni.navigateTo({
					url:'guize'
				})
			},
			
			//邀请
			invitation(){
				uni.navigateTo({
					url:"/pages/mine/subPage/share"
				})
			},
			
			
			//查看榜单
			seeList(){
				uni.navigateTo({
					url:'/pages/home/subpage/rank'
				})
			}
		}
	}
</script>

<style lang="scss">
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
		background-color: #017ff0db;
	}

	.nav {
		width: 100%;
		height: 88rpx;
		background-color: #017ff0db;
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

	.content {
		background: linear-gradient(#0fdbff, #017ff0);
		width: 100%;
		overflow: hidden;

		.content_nav {
			width: 100%;
			height: 960rpx;
			position: relative;

			.shareImg {
				width: 100%;
				height: 100%;
			}

			.content_word {
				position: absolute;
				top: 75%;
				left: 33%;
				font-size: 28rpx;
				color: #FFFFFF;
			}
		}

		.content_tain1 {
			margin-top: 66rpx;
			.tainImg1 {
				width: 702rpx;
				height: 380rpx;
				margin: 0 auto;
				position: relative;

				image {
					width: 100%;
					height: 100%;
				}
				.tainConet {
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0;
					left: 0;
					.tainConetWord {
						font-size: 30rpx;
						font-weight: bold;
						color: #000000;
						text-align: center;
						margin-top: 63rpx;
					}

					.tainImg1Box {
						width: 85%;
						display: flex;
						margin: 39rpx auto 0;
						.taImg1 {
							width: 32%;
							.taImg1_img {
								width: 83rpx;
								height: 83rpx;
								margin: 0 auto;

								image {
									width: 100%;
									height: 100%;
								}
							}

							.taImg1Word {
								margin-top: 20rpx;
								font-size: 24rpx;
								color: #000000;
								line-height: 30rpx;
								text-align: center;
							}
						}

						.tainWire1 {
							width: 116rpx;
							height: 4rpx;
							background: #5900D8;
							border-radius: 2rpx;
							margin-top: 35rpx;
						}
					}

				}
			}
		}
		.content_tain2{
			margin-top: 60rpx;
			.content_tain2Img{
				width: 702rpx;
				height: 500rpx;
				margin:  0 auto;
				position: relative;
				.balanceImg{
					width: 100%;
					height: 100%;
				}
				.content_tain2Conent{
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0;  
					left: 0;
					.content_tain2ConentWord{
						font-size: 34rpx;
						color: #000000;
						margin: 51rpx 0 0 62rpx;
						font-weight: bold;
					}
					.content_tain2ConentImg{
						width: 90%;
						display: flex;
						justify-content: space-between;
						margin: 40rpx auto 0;
						.envelopesBox1{
							width: 200rpx;
							height: 229rpx;
							position: relative;
							.envelopesImg1{
								width: 100%;
								height: 100%;
							}
							.envelopesBox1Word{
								width: 100%;
								height: 100%;
								position: absolute;
								top: 0;
								left: 0;
								.envelopesBox1Word1{
									font-size: 24rpx;
									color: #FE0000;
									text-align: center;
									font-weight: bold;
									padding:10rpx 30rpx;
									position: relative;
									z-index: 99;
									
									margin-top: 14rpx;
								}
								.envelopesBox1Word2{
									margin-top: 33rpx; 
									font-size: 16rpx;
									padding: 0 20rpx;
									position: relative;
									z-index: 99;
									color: #FE0000;
									text-align: center;
								}
							}
						}
						.envelopesBox2{
							width: 200rpx;
							height: 229rpx;
							position: relative;
							.envelopesImg2{
								width: 100%;
								height: 100%;
							}
						.envelopesBox1Word{
							width: 100%;
							height: 100%;
							position: absolute;
							top: 0;
							left: 0;
							.envelopesBox1Word1{
								font-size: 24rpx;
								color: #FE0000;
								text-align: center;
								font-weight: bold;
								margin-top: 14rpx;
								padding: 10rpx;
								position: relative;
								z-index: 99;
							}
							.envelopesBox1Word2{
								margin-top: 33rpx;
								font-size: 16rpx;
								color: #FE0000;
								text-align: center;
								padding: 10rpx;
								position: relative;
								z-index: 99;
							}
							.envelopesBox1Word3{
								font-size: 24rpx;
								color: #FE0000;
								text-align: center;
								padding: 16rpx;
								position: relative;
								z-index: 99;
							}
						}
						}
						.envelopesBox3{
							width: 200rpx;
							height: 229rpx;
							position: relative;
							.envelopesImg3{
								width: 100%;
								height: 100%;
							}
							.envelopesBox1Word{
								width: 100%;
								height: 100%;
								position: absolute;
								top: 0;
								left: 0;
								.envelopesBox1Word1{
									font-size: 24rpx;
									color: #FE0000;
									text-align: center;
									font-weight: bold;
									margin-top: 24rpx;
								}
								.envelopesBox1Word2{
									margin-top: 42rpx;
									font-size: 16rpx;
									color: #FE0000;
									text-align: center;
								}
								.envelopesBox1Word3{
									font-size: 16rpx;
									color: #FE0000;
									text-align: center;
								}
							}
						}
					}
				}
			}
			.content_tain2Word2{
				color: #000000;
				font-size: 30rpx;
				text-align: center;
				margin-top: 36rpx;
			}
		}
		.content_tain3{
		  width: 100%;
			margin-top: 60rpx;
			.rewardImg{
				width: 702rpx;
				height: 580rpx;
				position: relative;
				margin: 0 auto;
				.reward{
					width: 100%;
					height: 100%;
					
				} 
				.rewardImgContent{
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0;
					left: 0;
					.rewardWordBox{
						color: #000000;
						font-size: 34rpx;
						margin: 51rpx 0 0 62rpx;
					}
					.rewardImg1{
						.reward2{
							width: 610rpx;
							height: 168rpx;
							position: relative;
							margin: 36rpx 0 0 47rpx;
							.reward2Img{
								width: 100%;
								height: 100%;
								
							} 
							.rewardWord{
								width: 262rpx;
								height: 80rpx;
								position: absolute;
								top: 40rpx;
								left: 22rpx;
								color: #017ff0;
								line-height: 30rpx;
								font-size: 20rpx;
								transform: scale(1);
							}
						}
					}
					.rewardImg2{
						.reward2{
							width: 610rpx;
							height: 168rpx;
							position: relative;
							margin: 12rpx 0 0 47rpx;
							.reward2Img{
								width: 100%;
								height: 100%;
								
							} 
							.rewardWord{
								width: 262rpx;
								height: 80rpx;
								position: absolute;
								top: 40rpx;
								right: 30rpx;
								color: #017ff0;
								line-height: 30rpx;
								font-size: 20rpx;
								transform: scale(1);
							}
						}
					}
				.rewardImgContentWord{
					color: #000000;
					font-size: 30rpx;
					margin-top: 25rpx;
					text-align: center;
				}
					
				}
				
			}
			
		}
	}
	.content2{
		width: 100%;
		background-color: #017ff0;
		overflow: hidden;
		.content2Reward{
			width: 702rpx;
			height: 440rpx;
			margin: 60rpx auto;
			position: relative;
			.content2RewardImg{
				width: 100%;
				height: 100%;
			}
			.content2RewardContent{
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
				.content2RewardContentWrod{
					font-size: 34rpx;
					color: #000000;
					margin: 51rpx 0 0 62rpx;
				}
				.content2RewardImg2{
					width: 90%;
					display: flex;
					margin: 49rpx auto 0;
					justify-content: space-between;
					.content2RewardImg2-img1{
						width: 280rpx;
						height: 160rpx;
						position: relative;
						image{
							width: 100%;
							height: 100%;
						}
						.content2RewardImg2-img1{
							width: 100%;
							height: 100%;
							position: absolute;
							top: 0;
							left: 0;
							.cTitle{
								font-size: 24rpx;
								color: #FFFFFF;
								text-align: center;
								margin-top: 25rpx;
							}
							.cTitle1{
								font-size: 60rpx;
								text-align: center;
								color: #FFFFFF;
							}
						}
					}
					.content2RewardImg2-img2{
						width: 280rpx;
						height: 160rpx;
							position: relative;
						image{
							width: 100%;
							height: 100%;
						}
						.content2RewardImg2-img2-img2{
							width: 100%;
							height: 100%;
							position: absolute;
							top: 0;
							left: 0;
							.cTitle{
								font-size: 24rpx;
								color: #FFFFFF;
								text-align: center;
								margin-top: 25rpx;
							}
							.cTitle1{
								font-size: 60rpx;
								text-align: center;
								color: #FFFFFF;
							}
						}
					}
				}
				.botWord{
					color: #000000;
					font-size: 30rpx;
					margin-top: 40rpx;
					text-align: center;
				}
			}
		}
		.content2Reward2{
			width: 702rpx;
			height: 480rpx;
			margin: 60rpx auto;
			position: relative;
			.content2Reward2Img{
				width: 100%;
				height: 100%;
				.content2Reward2Img-img{
					width: 100%;
					height: 100%;
				}
				.content2Reward2CBox{
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0;
					left: 0;
					.content2Reward2CBoxWord{
						color: #000000;
						font-size: 30rpx;
						margin: 51rpx 0 0 62rpx; 
					}
					.imgBox{
						width: 85%;
						display: flex;
						justify-content: space-between;
						margin: 50rpx auto 0;
						.content2Reward2CBox1{
							width: 184rpx;
							height: 149rpx;
							position: relative;
							.redImg{
								width: 100%;
								height: 100%;
								
							}
							.redImgWord{
								width: 100%;
								height: 100%;
								position: absolute;
								top: 0;
								left: 0;
								.redImgWord1{
									font-size: 24rpx;
									margin: 44rpx auto 0;
									text-align: center;
									color: #FE0000;
								}
								.redImgWord2{
									font-size: 26rpx;
									color: #FFFFFF;
									text-align: center;
									margin-top: 30rpx;
								}
							}
						}
						.content2Reward2CBox2{
							width: 184rpx;
							height: 149rpx;
							position: relative;
							.redImg{
								width: 100%;
								height: 100%;
						
							}
							.redImgWord{
								width: 100%;
								height: 100%;
								position: absolute;
								top: 0;
								left: 0;
								.redImgWord1{
									font-size: 24rpx;
									margin: 44rpx auto 0;
									text-align: center;
									color: #FE0000;
								}
								.redImgWord2{
									font-size: 26rpx;
									color: #FFFFFF;
									text-align: center;
									margin-top: 30rpx;
								}
							}
						}
						.content2Reward2CBox3{
							width: 184rpx;
							height: 149rpx;
									position: relative;
							.redImg{
								width: 100%;
								height: 100%;
							}
							.redImgWord{
								width: 100%;
								height: 100%;
								position: absolute;
								top: 0;
								left: 0;
								.redImgWord1{
									font-size: 24rpx;
									margin: 44rpx auto 0;
									text-align: center;
									color: #FE0000;
								}
								.redImgWord2{
									font-size: 26rpx;
									color: #FFFFFF;
									text-align: center;
									margin-top: 30rpx;
								}
							}
						}
					}
					.btomWord{
						width: 261rpx;
						height: 73rpx;
						margin: 47rpx auto 0;
						position: relative;
						.buttonImg{
							width: 100%;
							height: 100%;
							
						}
						.btomWordBox{
							width: 100%;
							height: 100%;
							position: absolute;
							top: 0;
							left: 0;
							line-height: 70rpx;
							text-align: center;
							color: #FFFFFF;
							font-size: 34rpx;
							
						}
					}
				}
			}
		}
		.content2Reward3{
			width: 702rpx;
			height: 480rpx;
			margin: 60rpx auto;
			position: relative;
			.content2Reward3Img{
				width: 100%;
				height: 100%;
				position: relative;
				.reward5Img{
					width: 100%;
					height: 100%;
				}
				.content2Reward3ImgCtitle{
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0;
					left: 0;
					.content2Reward3ImgCtitleNav{
						font-size: 34rpx;
						color: #000000;
						margin: 51rpx 0 0 62rpx;
					}
					.content2Reward3ImgCtitleNavC{
						width: 559rpx;
						// height: 183rpx;
						margin: 44rpx 0 0 62rpx;
						.careful1{
							font-size: 26rpx;
							color: #000000;
						}
						.careful2{
							margin-top: 20rpx;
							font-size: 26rpx;
							color: #000000;
						}
						.careful3{
								margin-top: 20rpx;
							font-size: 26rpx;
							color: #000000;
						}
						.careful4{
								margin-top: 20rpx;
							font-size: 26rpx;
							color: #000000;
						}
					}
				}
			}
			
		}
	}
</style>
