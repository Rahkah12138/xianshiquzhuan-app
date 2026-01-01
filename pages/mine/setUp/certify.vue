<template>
	<view>
		<view class="row b-b">
			<text class="tit">真实姓名</text>
			<input class="input" :disabled="is_certify == 1" type="text" placeholder="请输入真实姓名" v-model="certify_name"  />
		</view>
		<view class="row b-b">
			<text class="tit">身份证号</text>
			<input class="input" type="text" :disabled="is_certify == 1" placeholder="请输入身份证号" v-model="certify_id"  />
		</view>
		<button class="add-btn" @click="confirm" type="primary" v-if="isShow==true">确定</button>
		<button class="add-btn"  type="primary" v-if="is_certify">已认证</button>
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				certify_name: "",
				certify_id: "",
				is_certify:0,
				isShow: true,
				isread: false,
				message:''
			}
		},
		onLoad() {
			let that = this;
			that.getInfo();
		},

		methods: {

			getInfo() {
				let that = this;
				uni.request({
					url: that.global.url + '/api/user/userinfo',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token,
					},
					success: (res) => {
						if (res.data.code == 1) {
							that.certify_name = res.data.data.certify_name;
							that.certify_id = res.data.data.certify_id;
							that.is_certify = res.data.data.is_certify;
							if (res.data.data.is_certify) {
								that.isShow = false;
								that.isread = true;
							}
						}
					}
				})
			},
			isIdcard (value) {
						var sId = value;
						if (sId.length == 15) {
							if(!/^\d{14}(\d|x)$/i.test(sId)){
								this.message =  "你输入的身份证长度或格式错误";
								return false;
							} else  {
							    sId=sId.substr(0,6)+'19'+sId.substr(6,9);
							    sId+= getVCode(sId);
							}
						}
						function getVCode(CardNo17) {
						  var Wi = new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2,1);
						  var Ai = new Array('1','0','X','9','8','7','6','5','4','3','2');
						  var cardNoSum = 0;
						  for (var i=0; i<CardNo17.length; i++)cardNoSum+=CardNo17.charAt(i)*Wi[i];
						  var seq = cardNoSum%11;
						  return Ai[seq];
						}
						var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"} ;
			
						var iSum=0 ;
						var info="" ;
						if(!/^\d{17}(\d|x)$/i.test(sId)){
							this.message =  "你输入的身份证长度或格式错误";
							return false;
						}
						sId=sId.replace(/x$/i,"a"); 
						if(aCity[parseInt(sId.substr(0,2))]==null){ 
							this.message =  "你的身份证地区非法";
							return false;
						}
						var sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2)); 
						var d=new Date(sBirthday.replace(/-/g,"/")) ;
						if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())){
							this.message =  "身份证上的出生日期非法";
							return false; 
						}
						for(var i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) ;
						if(iSum%11!=1){
							this.message =  "你输入的身份证号非法";
							return false; 
						}
						return true;
					},
			confirm() {
				let that = this;
				if (!that.certify_name) {
					uni.showToast({
						title: '真实姓名不能为空',
						icon: 'none'
					})
					return;
				}
				if (!that.certify_id) {
					uni.showToast({
						title: '身份证号不能为空',
						icon: 'none'
					})
					return;
				}
				
				let is=this.isIdcard(this.certify_id);
				if(!is){
						uni.showToast({
							title: this.message,
							icon: 'none'
						})
						return
				}
				
				// let acc = /^(?:1[3-9]\d{9}|[a-zA-Z\d._-]*\@[a-zA-Z\d.-]{1,10}\.[a-zA-Z\d]{1,20})$/
				// var a = acc.test(that.account)
				// if (!acc.test(that.account)) {
				// 	uni.showToast({
				// 		title: '请输入正确的支付宝账号',
				// 		icon: 'none'
				// 	})
				// 	return
				// }
				uni.request({
					url: this.global.url + '/api/user/certify',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token,
						certify_name: that.certify_name,
						certify_id: that.certify_id,
					},
					success: (res) => {
						if (res.data.code == 1) {
							that.isShow = false;
							that.isread = true;
							uni.showToast({
								title: "绑定成功"
							})
							uni.navigateBack()
						}else{
							uni.showToast({
								icon:'none',
								title: res.data.msg
							})
						}
					}
				})


			}
		}
	}
</script>

<style scoped="">
	.row {
		display: flex;
		align-items: center;
		position: relative;
		padding: 0 30upx;
		height: 110upx;
		background: #FFFFFF;
		border-bottom: 1rpx solid #ccc;
	}

	.tit {
		flex-shrink: 0;
		width: 140upx;
		font-size: 13px;
	}

	.input {
		flex: 1;
		font-size: 30upx;
		margin: 5px;
		/* border-style: dashed; */
	}

	button {
		border-radius: 25px;
		background-color: #017ff0;
		margin: 100px;
	}

	page {
		background-color: WhiteSmoke;
	}
</style>
