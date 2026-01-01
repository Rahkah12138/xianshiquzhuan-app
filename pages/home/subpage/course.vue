<template>
	<view class="course">
 <rich-text  :nodes="content"></rich-text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
        content:'',
			  type:''
			}
		},
	
		onLoad(e) {
			this.type = e.id;
			let text = "";
			if (this.type == 0) {
				text = "发单规则";
			} else if (this.type == 1) {
				text = "接单规则";
			} else if (this.type == 2) {
				text = "免责声明";
			} else if (this.type == 3) {
				text = "充值协议";
			} else if (this.type == 4) {
				text = '新人须知'
			}
			uni.setNavigationBarTitle({
				title: text
			});
			this.getCourse()
		},
		methods:{
			//初始化
			
			getCourse(){
				let that =this;
				uni.request({
					url: that.global.url + '/api/index/explain',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success: (res) => {
					if(res.data.code==1){
						let text="";
						if(that.type== 0){
							that.content =res.data.data.release_notes || '';
							text ="发单规则";
						}else if(that.type==1){
							that.content =res.data.data.receiving_orders || '';
							text ="接单规则";
						}else if(that.type==2){
							that.content =res.data.data.exemption || '';
							text ="免责声明";
						}else if(that.type ==3){
							that.content =res.data.data.agreement || '';
							text ="充值协议";
						}else if(that.type == 4){
							that.content =res.data.data.new_people || '';
							text = '新人须知'
						}
						uni.setNavigationBarTitle({
						title:text
						});
					}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.course{
	padding: 10px;
	box-sizing: border-box;
}
</style>
