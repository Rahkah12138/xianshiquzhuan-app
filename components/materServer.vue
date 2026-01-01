<template>
	<view class="mask" v-if="fatherMask == true" >
		<view class="mask_content">
			<view class="mask_box">
				<view class="title">
					<view class="title_word">全部筛选</view>
					<image src="/static/material/cloose.png" mode="" class="t_img" @click="cloose"></image>
				</view>
				<view class="mask_type">
					课程类目
				</view>
				<view class="type_content">
					<view class="type_con" v-for="(item,index) in typeList" :key="index" @click="typea(index,item)">
						<view class="type_word" :class="typeShow == index ?'type_boxae':''">
							{{item.name}}
						</view>
					</view>
					<view style="width: 30%;">
					</view>
				</view>
				<view class="mask_level">
					课程类型
				</view>
				<view class="mask_level_box">
					<view class="mask_level_con" v-for="(item,index) in courseTypesObj" :key="index" @click="levelaType(index)">
				  <view class="mask_word" :class="index == courseTypesObjIndex ? 'type_boxae':''">
				  	{{item}}
				  </view>			
					</view>
					<view class="a-bxo">
						
					</view>
				</view>
				
				
				
				<view class="mask_price">
					价格
				</view>
				<view class="mask_price_box">
					<view class="mask_price_con" v-for="item in pricList" :key="item.id" @click="pricea(item.id,item)">
		     <view class="pric_word" :class="item.id ==priceShow ?'type_boxae':'' ">
		     	{{item.pricNum}}
		     </view>				
					</view>
					<view style="width: 30%;">
					</view>
				</view>
			</view>
			<view class="mater_btn">
				<view class="mater_btn1" @click="reset">
					重置
				</view>
				<view class="mater_btn2" @click="define">
					确定
				</view>
			</view>
		</view>
	</view>
	
</template>

<script>
	import {courseClassification,courseTypes} from '@/api/course/index.js';
	import {download} from '@/api/material/index.js'
	export default{
		props:{
			fatherMask:{
				type: Boolean,
				default: ''
			}
		},
		data(){
			return{
				typeList:[
				],
				curriculumList:[
				],
				classificationList:[
					
				],
				pricList:[
					{
						id:1,
						pricNum:"1000-10000元"
					},
					{
						id:2,
						pricNum:"500-1000元"
					},
					{
						id:3,
						pricNum:"100-500元"
					},
					{
						id:4,
						pricNum:"0-100元"
					},
					{
						id:5,
						pricNum:"免费"
					}
				],
				typeShow:-1,//控制展示选中和未被选中的类型
				curriculumShow:-1,//控制展示选中和未被选中的课程类型
				cationShow:-1,//控制展示选中和未被选中的分类
				priceShow:' ',//控制价格
				levelShow:-1,//控制级别,
				num1:'',
				search1:'',
				Pircemoney:'',
				courseTypesObj:{},
				courseTypesObjIndex:'',
			}
		},
		onLoad() {
			
		},
		onShow() {
		},
		methods:{
			cloose(){
				this.$emit('chaFatherMask',false);
			},
			//课程分类
			init(){
				let _this = this
				courseClassification().then(res=>{
					console.log(res,'9999999999')
					_this.typeList=res.data
					
				}).catch(err=>{
					 
				})
				courseTypes().then(res=>{
					console.log(res,'66666666666666')
					_this.courseTypesObj = res.data
				}).catch(err=>{
					console.log(err)
				})
			},
			
			//控制展示选中和未被选中的类型
			typea(index,item){
				this.typeShow = index
				this.num1 = item.id
				this.search1 = item.name
			},
			
			//控制价格
			pricea(id,item){
				this.priceShow = id
				console.log(item)
				if(item.pricNum=='免费'){
					this.Pircemoney = '0'
				}else{
					this.Pircemoney = item.pricNum
				}
			},
			
			//课程类型
			levelaType(index){
				this.courseTypesObjIndex = index
			},
			//重置
			reset(){
				this.typeShow = -1;
				this.curriculumShow =-1;
				this.cationShow  = -1;
				this.priceShow = -1;
				this.levelShow = -1
				this.courseTypesObjIndex = -1
				this.Pircemoney=-1
			},
			//确定
			define(){
				let money
				if(this.Pircemoney=='0'){
					money='0'
				}else{
					let m =this.Pircemoney.replace(/-/,',')
					money = m.replace(/元/,'')
				}
				let data={
					subject_id:this.num1,
					cate:this.courseTypesObjIndex,
					money:money
				}
				download(data).then(res=>{
					if(res.data.length==0){
						uni.showToast({
							title:"暂没有相关内容",
							icon:"none"
						})
					}else{
						res.data.forEach(item=>{
							if(item){
								item.imgUrl2='/static/home/img1.png'
								item.imgUrl3='/static/home/img2.png'
								item.imgUrl4 = '/static/home/img3.png'
								if(item.type==1){
									item.special_type_name = '图文'
								}else if(item.type == 2){
									item.special_type_name = '音频'
								}else if(item.type == 3){
									item.special_type_name = '视频'
								}else if(item.type == 4){
									item.special_type_name = '直播'
								}else if(item.type == 5){
									item.special_type_name = '专题'
								}else if(item.type == 7){
									item.special_type_name = '线下课'
								}
							}
						})
						this.$emit('chaFatherMask',false);
						this.$emit('sonListtt',res.data);
					}
				}).catch(err=>{
					console.log(err)
				})
			},
		}
	}
	
</script>

<style lang="scss" scoped>
	.mask{
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,.3);
		position: fixed;
		top: 0;
		left: 0;
		.mask_content{
			width: 100%;
			height: 75%;
			position: absolute;
			bottom: 0;
			left: 0;
			background-color: #FFFFFF;
			border-radius: 20rpx 20rpx 0 0;
			padding-bottom: 100rpx;
			.mask_box{
				width: 100%;
				height: 100%;
				overflow: hidden;
				overflow-y: scroll;
			}
			.title{
				width: 100%;
				height: 68rpx;
				position: relative;
				.title_word{
					width: 100%;
					text-align: center;
					color: rgba(16, 16, 16, 100);
					font-size: 28rpx;
					line-height: 68rpx;
					
				}
				.t_img{
					width: 32rpx;
					height: 32rpx;
					position: absolute;
					top: 18rpx;
					right: 26rpx;
				}
			}
			.mask_type{
				color: rgba(16, 16, 16, 100);
				font-size: 26rpx;
				display: inline-block;
				margin: 46rpx 0 0 22rpx;
			}
			.type_content{
				width: 80%;
				margin: 20rpx auto 0;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				.type_con{
					width: 30%;
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
					background-color: #F4F4F4;
					color: rgba(153, 153, 153, 100);
					font-size: 24rpx;
					margin-bottom: 36rpx;
					border-radius: 16rpx;
				}
			}
			.mask_curriculum{
				color: rgba(16, 16, 16, 100);
				font-size: 26rpx;
				display: inline-block;
				margin: 0 0 0 22rpx;
			}
			.curriculum_content{
				width: 80%;
				margin: 20rpx auto 0;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				.curriculum_con{
					width: 30%;
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
					background-color: #F4F4F4;
					color: rgba(153, 153, 153, 100);
					font-size: 24rpx;
					margin-bottom: 36rpx;
					border-radius: 16rpx;
				}
			}
			.mask_classification{
				color: rgba(16, 16, 16, 100);
				font-size: 26rpx;
				display: inline-block;
				margin: 0 0 0 22rpx;
			}
			.classification_content{
				width: 80%;
				margin: 20rpx auto 0;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				.classification_con{
					width: 30%;
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
					background-color: #F4F4F4;
					color: rgba(153, 153, 153, 100);
					font-size: 24rpx;
					margin-bottom: 36rpx;
					border-radius: 16rpx;
				}
			}
			.mater_btn{
				width: 85%;
				height: 80rpx;
				display: flex;
				justify-content: space-between;
				position: fixed;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
				.mater_btn1{
					width: 240rpx;
					height: 80rpx;
					line-height: 80rpx;
					text-align: center;
					background-color: rgba(161, 195, 255, 100);
					border-radius: 20rpx;
					color: rgba(255, 255, 255, 100);
					font-size: 28rpx;
				}
				.mater_btn2{
					width: 240rpx;
					height: 80rpx;
					line-height: 80rpx;
					text-align: center;
					background-color: rgba(103, 158, 255, 100);
					border-radius: 20rpx;
					color: rgba(255, 255, 255, 100);
					font-size: 28rpx;
				}
			}
			.type_boxae{
				background-color: rgba(103, 158, 255, 100);
				color: rgba(255, 255, 255, 100);
				border-radius: 16rpx;
			}
			.mask_price{
				color: rgba(16, 16, 16, 100);
				font-size: 26rpx;
				display: inline-block;
				margin: 0 0 0 22rpx;
			}
			.mask_price_box{
				width: 80%;
				margin: 20rpx auto 0;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				.mask_price_con{
					width: 30%;
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
					background-color: #F4F4F4;
					color: rgba(153, 153, 153, 100);
					font-size: 24rpx;
					margin-bottom: 36rpx;
					border-radius: 16rpx;
					box-sizing:border-box
				}
			}
			.mask_level{
				color: rgba(16, 16, 16, 100);
				font-size: 26rpx;
				display: inline-block;
				margin: 0 0 0 22rpx;
			}
			.mask_level_box{
				width: 80%;
				margin: 20rpx auto 0;
				display: flex;
				justify-content: space-between;
				
				flex-wrap: wrap;
				.mask_level_con{
					width: 30%;
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
					background-color: #F4F4F4;
					color: rgba(153, 153, 153, 100);
					font-size: 24rpx;
					margin-bottom: 36rpx;
					border-radius: 16rpx;
					box-sizing:border-box
					
				}
				.a-bxo{
					width: 30%;
				}
			}
		}
	}
</style>
