<template>
	<view>
		<view class="status_bar">

		</view>
		<view class="title">
			<image src="/static/noviciate/left.png" mode="widthFix" class="titleImg" @click="navToParent"></image>
			<view class="back">
				<view :class="index==i?'check':''" v-for="(a,i) in typeArr" :key="i" @click="checkPage(i)">{{a}}</view>
			</view>
			<image src="/static/index/ranking.png" class="ranking" mode="widthFix"></image>
			<view class="rankingBox">
				<view class="rankingImg" v-for="(c,i) in newArr" :key="i" :class="i==1? 'rankingImgs':''">
					<view class="rankImgBox1" v-if="i==1">
						<image src="/static/index/ranking1.png" class="rankingImg1" mode=""></image>
						<image :src="c.image" class="img_a1" mode="aspectFill"></image>
						<image src="/static/index/dOne.png" class="dOneImg1" mode=""></image>
						
					</view>
					<view class="rankImgBox2" v-if="i==0">
						<image src="/static/index/ranking2.png" class="rankingImg2" mode=""></image>
						<image :src="c.image" class="img_a2" mode="aspectFill"></image>
						<image src="/static/index/dTwo.png" class="dOneImg2" mode=""></image>
						
					</view>
					<view class="rankImgBox2" v-if="i==2">
						<image src="/static/index/ranking3.png" class="rankingImg2" mode=""></image>
						<image :src="c.image" class="img_a2" mode="aspectFill"></image>
						<image src="/static/index/dThree.png" class="dOneImg2" mode=""></image>
						
					</view>
					<view class="rankImgBoxWord1">{{c.name}}</view>
					<view class="rankImgBoxNum" v-if="index==0">{{c.money}}元</view>
					<view class="rankImgBoxNum" v-if="index==1">{{c.money}}人</view>
					<view class="rankImgBoxNum" style="margin-top: 50rpx;">
						奖励 : {{c.reward}}元
					</view>
				</view>
			</view>
		</view>

		<!-- 个人信息 -->
		<view class="messageBox">
			<view class="userImgBox">
				<image :src="userMessage.avatar" class="userImg" mode=""></image>
			</view>

			<view class="message" v-if="index==0">
				<view class="messageName">
					{{userMessage.nickname}}
				</view>
				<view class="extension">
					悬赏金额：{{dt.money}}
				</view>
				<view class="rankingBoxs">
					当前排名：{{dt.sort}}
				</view>
			</view>
			<view class="message" v-if="index==1">
				<view class="messageName">
					{{userMessage.nickname}}
				</view>
				<view class="extension">
					推广人数：{{dt.money}}
				</view>
				<view class="rankingBoxs">
					当前排名：{{dt.sort}}
				</view>
			</view>

			<view class="btn" v-if="index==0" @click="jiedan">
				去接单
			</view>
			<view class="btn" v-if="index==1" @click="jiedan">
				分享
			</view>
		</view>
		<!-- 榜单 -->
		<view class="listBox">
			<view :class="index1==i?'check1s':''" v-for="(b,i) in dayArr" :key="i" @click="dayPage(i)">{{b}}</view>
		</view>
		<!-- 榜单排名 -->
		<view class="rankingListBox">
			<view class="rankingListBoxNavBox" v-if="index==0">
				<view class="rankingListBoxNav"  v-for="(item,index) in rankList2" :key="index">
					{{item}}
				</view>
				
			</view>
			<view class="rankingListBoxNavBox" v-if="index==1">
				<view class="rankingListBoxNav"  v-for="(item,index) in rankList" :key="index">
					{{item}}
				</view>
				
			</view>
			<view class="rankingListBoxContent" v-for="(item,index) in residueArr" :key="index">
				<view class="listConent">
					<image src="/static/index/ranking5.png" class="shape" mode=""></image>
					<view class="shapeWord">
						{{index+4}}
					</view>
				</view>
				<view class="rankingMessage">
					<image :src="item.image" class="mesImg" mode=""></image>
					<view class="messageWord">
						{{item.name}}
					</view>
				</view>
				<view class="peopleNum">
					{{item.money}}
				</view>
				
				<view class="rewardBox" >
					{{item.reward}}元
				</view>
			
			</view>


		</view>
		<!-- <view class="back">
			<view :class="index==i?'check':''" v-for="(a,i) in typeArr" :key="i" @click="checkPage(i)">{{a}}</view>
		</view> -->
		<!-- <view class="list">
			<view :class="index1==i?'check1':''" v-for="(b,i) in dayArr" :key="i" @click="dayPage(i)">{{b}}</view>
		</view> -->
		<!-- 	<view class="item">
			<view class="top">
				<view class="img" v-for="(c,i) in newArr" :key="i">
					<image v-if="i==1" class="img_o"  src="/static/seniority/icon_one.png" mode=""></image>
					<image v-if="i==0" class="img_o" src="/static/seniority/icon_two.png" mode=""></image>
					<image v-if="i==2" class="img_o" src="/static/seniority/icon_ther.png" mode=""></image>
					<image :src="c.image" class="img_a" mode="aspectFill"></image><text>{{c.name}}</text>
					<text v-if="index==0">{{c.money}}</text>
					<text v-else>{{c.money|people}}人</text>
				</view>
			</view>
			<view class="table">
				<view class="tr" v-for="(d,i) in residueArr" :key="i">
					<view class="td">{{i+4}}</view>
					<image class="td head" :src="d.image" mode="aspectFill"></image>
					<view class="td">{{d.name}}</view>
					<view class="td" v-if="index==0">{{d.money}}</view>
					<view class="td" v-else ="index==1">{{d.money|people}}人</view>
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				index1: 0, // 排行榜下标
				rankArr: [], // 排名列表
				dt: '',

				index: 0, // 排行榜分类下标
				dayArr: ['周榜单', '月榜单'], // 排行榜
				typeArr: ['赚钱排行榜', '推广排行榜'], // 排行榜分类
				newArr: [], //前三名
				residueArr: [], //剩余排行,
				sUrl: '',
				userMessage: '', //用户信息
				rankList: ['排名', '昵称', '推广人数', '奖励'],
				rankList2: ['排名', '昵称', '赏金金额', '奖励']
			}
		},
		onLoad() {
			let that = this;
			that.getRankList();
			uni.request({
				url: that.global.url + "/api/user/index",
				method: "POST",
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				data: {
					token: uni.getStorageSync("token").token,
				},
				success: (res) => {
					if (res.data.code == 1) {
						that.userMessage = res.data.data;

						that.userMessage.level_image = that.global.url + that.userMessage.level_image

					}
				}
			})
		},
		filters: {
			people(value) {
				return parseInt(value)
			}
		},
		methods: {
			// 返回上级页
			navToParent() {
				uni.navigateBack();
			},
			// 切换排行榜
			checkPage(i) {
				let that = this;
				that.index = i;
				that.getRankList();
			},
			// 切换排行榜
			dayPage(i) {
				let that = this;
				that.index1 = i;
				that.getRankList();
			},
			// 获取排名列表
			getRankList() {
				let that = this;
				that.rankArr = []
				uni.request({
					url: that.global.url + '/api/index/ranking_list',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						type: that.index + 1,
						list_type: that.index1 + 1,
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						console.log(res.data.data.data)
						that.dt = res.data.data.user
						for (let i in res.data.data.data) {
							that.rankArr.push(res.data.data.data[i])
						}
						console.log(that.rankArr)
						let na = [];
						let reArr = [];
						let san;
						that.rankArr.forEach((item, index) => {
							item.image = that.global.url + item.image;
							if (index <= 2) {
								na.push(item)
							} else {
								reArr.push(item)
							}
						})
						san = na[0]
						na[0] = na[1];
						na[1] = san
						that.newArr = na;
						that.residueArr = reArr;
						// console.log(that.newArr,'2222222222222222222')
					}
				})
			},
			//接单和分享
			jiedan() {
				if (this.index == 0) {
					uni.switchTab({
						url: '/pages/task/task'
					})
				} else {
					uni.navigateTo({
						url: '/pages/mine/subPage/share'
					})
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	page {
		background-color: #F3F3F3;
	}

	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
		background: linear-gradient(90deg, #FE4D4E, #FF2D8F);
	}

	.title {
		width: 100%;
		height: 423rpx;
		background: linear-gradient(90deg, #FE4D4E, #FF2D8F);
		position: relative;
		// overflow: hidden;
		border-radius: 0 0 -100rpx -100rpx;

		.titleImg {
			width: 60rpx;
			height: 60rpx;
			position: absolute;
			left: 14rpx;
			z-index: 999;
			top: 5%;
		}

		.ranking {
			width: 480rpx;
			height: 80rpx;
			margin: 40rpx auto 0;
			display: block;
		}

		.rankingBox {
			width: 100%;
			display: flex;
			justify-content: space-around;
			margin-top: 67rpx;

			.rankingImg {
				width: 222rpx;
				height: 260rpx;
				background-color: #FFFFFF;
				border-radius: 20rpx;
				position: relative;

				.rankImgBox1 {
					width: 168rpx;
					height: 184rpx;
					margin: 0 auto;
					position: relative;

					.rankingImg1 {
						width: 100%;
						height: 100%;
						position: absolute;
						top: -84rpx;
						left: 0;
					}

					.img_a1 {
						width: 112rpx;
						height: 112rpx;
						position: absolute;
						top: -52rpx;
						left: 17%;
						border-radius: 50%;
					}

					.dOneImg1 {
						width: 150rpx;
						height: 60rpx;
						position: absolute;
						top: 40rpx;
						left: 12rpx;
						z-index: 9;
					}

				}

				.rankImgBox2 {
					width: 168rpx;
					height: 184rpx;
					margin: 0 auto;
					position: relative;

					.rankingImg2 {
						width: 100%;
						height: 100%;
						position: absolute;
						top: -84rpx;
						left: 0;
					}

					.img_a2 {
						width: 112rpx;
						height: 112rpx;
						position: absolute;
						top: -50rpx;
						left: 17%;
						border-radius: 50%;
					}

					.dOneImg2 {
						width: 150rpx;
						height: 60rpx;
						position: absolute;
						top: 40rpx;
						left: 12rpx;
						z-index: 9;
					}

				}

				.rankImgBoxWord1 {
					width: 100%;
					font-size: 30rpx;
					position: absolute;
					top: 40%;
					left: 0;
					text-align: center;
					color: #222222;
				}

				.rankImgBoxNum {
					width: 100%;
					font-size: 32rpx;
					position: absolute;
					top: 60%;
					left: 0;
					color: #FE4B53;
					text-align: center;
				}
			}

			.rankingImgs {
				margin-top: -33rpx;
			}
		}

		.back {
			width: 100%;
			display: flex;
			justify-content: space-around;
			margin-left: 36rpx;
			position: relative;
			top: 15rpx;
		}
	}

	.back>view {
		width: 28%;
		color: #FFFFFF;
		font-size: 40rpx;
		font-weight: bold;
		text-align: center;
	}

	.messageBox {
		width: 682rpx;
		height: 238rpx;
		margin: 226rpx auto 0;
		border-radius: 20rpx;
		border: 9rpx solid #FD4A54;
		display: flex;
		position: relative;
		background-color: #FFFFFF;

		.userImgBox {
			width: 25%;

			.userImg {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				margin: 60rpx 0 0 40rpx;
			}
		}

		.message {
			width: 75%;

			.messageName {
				font-size: 28rpx;
				margin-top: 36rpx;
			}

			.extension {
				font-size: 28rpx;
				margin-top: 19rpx;
			}

			.rankingBoxs {
				font-size: 28rpx;
				margin-top: 19rpx;
			}
		}


		.btn {
			width: 170rpx;
			height: 70rpx;
			line-height: 70rpx;
			text-align: center;
			color: #FFFFFF;
			background-color: #FF3A2F;
			border-radius: 60rpx;
			// margin: 75rpx 29rpx 0 0;
			position: absolute;
			top: 75rpx;
			right: 29rpx;
		}

	}

	.listBox {
		width: 100%;
		margin-top: 50rpx;
		display: flex;
		justify-content: space-around;
		color: #333333;
		font-size: 32rpx;

		.check1s {
			font-size: 40rpx;
			background: linear-gradient(0deg, #FE4D4E 0%, #FF2D8F 100%);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
		}
	}

	.rankingListBox {
		width: 100%;
		background-color: #FFFFFF;
		margin-top: 27rpx;
		border-radius: 20rpx;
		padding-bottom: 40rpx;

		.rankingListBoxNavBox {
			display: flex;
			justify-content: space-around;
			width: 100%;
			margin-top: 20rpx;

			.rankingListBoxNav {
				font-size: 30rpx;
			}
		}

		.rankingListBoxContent {
			width: 100%;
			margin-top: 43rpx;
			display: flex;

			.listConent {
				width: 42rpx;
				height: 48rpx;
				position: relative;
				margin: 35rpx 0 0 60rpx;

				.shape {
					width: 100%;
					height: 100%;


				}

				.shapeWord {
					width: 100%;
					height: 100%;
					line-height: 48rpx;
					text-align: center;
					font-size: 28rpx;
					position: absolute;
					top: 0;
					left: 0;
					color: #FFFFFF;
				}
			}

			.rankingMessage {
				width: 200rpx;
				display: flex;
				margin: 20rpx 0 0 56rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;

				.mesImg {
					
					flex-shrink: 0;
					width: 70rpx;
					height: 70rpx;
					border-radius: 50%;
					
				}

				.messageWord {
					font-size: 30rpx;
					margin: 21rpx 0 0 10rpx;
				}
			}

			.peopleNum {
				width: 93rpx;
				margin: 40rpx 0 0 77rpx;
				font-size: 30rpx;
				box-sizing: border-box;
			}

			.rewardBox {
				width: 95rpx;
				font-size: 30rpx;
				margin: 40rpx 0 0 104rpx;
				box-sizing: border-box;
				color: #FF252D;
			}
		}

	}




	.check {
		border-bottom: 2px solid #FFFFFF !important;
	}

	// .list {
	// 	display: flex;
	// 	width: 450rpx;
	// 	height: 66rpx;
	// 	color: #FFFFFF;
	// 	overflow: hidden;
	// 	line-height: 66rpx;
	// 	text-align: center;
	// 	border-radius: 30rpx;
	// 	border: 1px solid #FFFFFF;
	// 	position: relative;
	// 	top: -95rpx;
	// 	left: 50%;
	// 	transform: translate(-50%, -50%);
	// }

	// .list>view {
	// 	width: 50%;
	// }

	// .check1 {
	// 	color: #FF5A00;
	// 	background: #FFFFFF;
	// }

	// .item {
	// 	padding-bottom: 1rpx;

	// }

	// .top {
	// 	display: flex;
	// 	color: #FFFFFF;
	// 	text-align: center;
	// 	align-items: flex-end;
	// 	justify-content: space-around;
	// }
	//  .top .img{
	// 	position: relative;
	// }
	//  .img_a{
	// 	width: 136rpx;
	// 	height: 136rpx;
	// 	border-radius: 50%;
	// 	margin-bottom: 20rpx;
	// }
	// .img_o{
	// 	width: 80rpx;
	// 	height: 70rpx;
	// 	position: absolute;
	// 	top: -53rpx;
	// 	left: 30rpx;
	// }
	// .img>text {
	// 	display: block;
	// }

	// .table {
	// 	width: 704rpx;
	// 	margin: 30rpx auto;
	// 	background: #FFFFFF;
	// 	border-radius: 10rpx;
	// }

	// .tr {
	// 	display: flex;
	// 	padding: 30rpx 0;
	// 	align-items: center;
	// 	justify-content: space-between;
	// }

	// .td {
	// 	width: 25%;
	// 	color: #333333;
	// 	text-align: center;
	// }

	// .td:last-child {
	// 	color:#017ff0;
	// }

	// .head {
	// 	width: 68rpx;
	// 	height: 68rpx;
	// 	border-radius: 50%;
	// }
</style>
