<template>
	<view class="team-container">
		<view class="header">
			<view class="header-card">
				<view class="data-item">
					<view class="value">{{ team.length > 0 ? team[0].per_income : '0.00' }}</view>
					<view class="label">个人业绩(元)</view>
				</view>
				<view class="data-item">
					<view class="value">{{ team.length > 0 ? team[0].total : '0' }}</view>
					<view class="label">团队总业绩(元)</view>
				</view>
				<view class="data-item">
					<view class="value">{{ team.length > 0 ? team[0].count : '0' }}</view>
					<view class="label">团队总人数(人)</view>
				</view>
			</view>
		</view>

		<view class="tabs">
			<view :class="['tab-item', Inv === 0 ? 'active' : '']" @click="changeTab(0)">直推</view>
			<view :class="['tab-item', Inv === 1 ? 'active' : '']" @click="changeTab(1)">间推</view>
		</view>

		<view class="team-list">
			<view class="list-item" v-for="(item, index) in ztList" :key="index" :style="{ animationDelay: index * 0.1 + 's' }">
				<image :src="getImgUrl(item.avatar)" class="avatar"></image>
				<view class="user-info">
					<view class="nickname">{{ item.nickname }}</view>
					<view class="id">ID: {{ item.id }}</view>
				</view>
				<view class="performance">
					<view class="label">个人业绩</view>
					<view class="value">{{ item.per_income }}(元)</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				Inv: 0,
				team: [],
				ztList: []
			}
		},
		onLoad() {
			this.getMyTeamZ();
		},
		methods: {
			getMyTeamZ() {
				let that = this;
				uni.request({
					url: that.global.url + "/api/user/team",
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
						type: 1,
					},
					success: (res) => {
						if (res.data.code == 1) {
							that.team = [res.data.data];
							that.ztList = res.data.data.userteam;
						}
					}
				})
			},
			getMyTeamJ() {
				let that = this;
				uni.request({
					url: that.global.url + "/api/user/team",
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync("token").token,
						type: 2,
					},
					success: (res) => {
						if (res.data.code == 1) {
							that.ztList = res.data.data.userteams;
						}
					}
				})
			},
			changeTab(Inv) {
				this.Inv = Inv;
				if (Inv == 0) {
					this.getMyTeamZ();
				} else {
					this.getMyTeamJ();
				}
			},
			getImgUrl(imae) {
				return imae.includes('http') ? imae : this.global.url + imae;
			},
		}
	}
</script>

<style lang="scss" scoped>
	@keyframes slideInDown {
		from {
			transform: translateY(-50px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.header {
		animation: slideInDown 0.5s ease-out forwards;
	}

	.team-container {
		background-color: #f5f5f5;
		min-height: 100vh;
	}

	.header {
		background: linear-gradient(135deg, #E63946, #FC5C7D);
		padding: 40rpx 30rpx;
		color: #ffffff;
	}

	.header-card {
		display: flex;
		justify-content: space-around;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 20rpx;
		padding: 40rpx;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	}

	.data-item {
		text-align: center;
	}

	.value {
		font-size: 48rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.label {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.8);
	}

	.tabs {
		display: flex;
		background-color: #ffffff;
		border-bottom: 1rpx solid #eee;
	}

	.tab-item {
		flex: 1;
		text-align: center;
		padding: 30rpx 0;
		font-size: 32rpx;
		color: #666;
		position: relative;

		&.active {
			color: #E63946;
			font-weight: bold;

			&::after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
				width: 60rpx;
				height: 6rpx;
				background-color: #E63946;
				border-radius: 3rpx;
			}
		}
	}

	.team-list {
		padding: 30rpx;
	}

	.list-item {
		display: flex;
		align-items: center;
		background-color: #ffffff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
		animation: fade-in 0.5s ease-out forwards;
		opacity: 0;
	}

	.avatar {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		margin-right: 30rpx;
	}

	.user-info {
		flex: 1;
	}

	.nickname {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
	}

	.id {
		font-size: 24rpx;
		color: #999;
	}

	.performance {
		text-align: right;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(20px);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
