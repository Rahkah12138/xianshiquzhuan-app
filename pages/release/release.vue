<template>
	<view class="release-container">
		<!-- 遮罩层 -->
		<view class="overlay" v-if="ismenu" @click="ismenu=false"></view>
		
		<!-- 菜单选项 -->
		<transition name="slide-fade">
			<view class="menu" v-if="ismenu">
				<view class="menu-item" v-for="(d,s) in menu" :key="s" @click="navToRule(s)">{{d}}</view>
			</view>
		</transition>


		<!-- 表单内容 -->
		<view class="form-wrapper">
			<!-- 支持设备 -->
			<view class="card">
				<view class="card-title">支持设备</view>
				<view class="device-options">
					<view :class="['option-btn', index === i ? 'checked' : '']" v-for="(a,i) in ment.slice(0, 3)" :key="i" @click="index=(index==i?-1:i)">{{a}}</view>
				</view>
			</view>

			<!-- 基础信息 -->
			<view class="card">
				<view class="card-title">基础信息</view>
				<view class="form-row">
					<text class="label">项目名称</text>
					<input class="input-field" type="text" v-model="name" placeholder="必须真实项目名称,6个字以内" maxlength="6" />
				</view>
				<view class="form-row">
					<text class="label">悬赏标题</text>
					<input class="input-field" type="text" v-model="title" placeholder="请输入悬赏标题，10个字以内" maxlength="10" />
				</view>
				<view class="form-row">
					<text class="label">任务说明</text>
					<input class="input-field" type="text" v-model="task" placeholder="关键内容简要说明" />
				</view>
				<view class="form-row">
					<text class="label">接单限时</text>
					<picker class="picker-field" @change="bindPickerChangeTime" :value="index2" :range="timeArr">
						<view :class="{'placeholder': index2 < 0}">{{ index2 < 0 ? '请选择超时释放名额的时间' : timeArr[index2] }}</view>
					</picker>
				</view>
				<view class="form-row">
					<text class="label">审核限时</text>
					<picker class="picker-field" @change="bindPickerChangeAudit" :value="index3" :range="auditArr">
						<view :class="{'placeholder': index3 < 0}">{{ index3 < 0 ? '请选择超时自动审核的时间' : auditArr[index3] }}</view>
					</picker>
				</view>
				<view class="form-row-full">
					<text class="label">做单次数</text>
					<view class="order-options">
						<view :class="['order-btn', index1 === i0 ? 'checked' : '']" v-for="(a,i0) in order" :key="i0" @click="orderChoose(i0)">{{a}}</view>
					</view>
				</view>
				<view class="form-row" v-show="index1==2">
					<text class="label">重复次数</text>
					<picker class="picker-field" @change="bindPickerChangeOrderSonValue" :value="orderSonValue" :range="orderSon">
						<view>{{orderSon[orderSonValue]}}</view>
					</picker>
				</view>
			</view>

			<!-- 价格与步骤 -->
			<view class="card">
				<view class="card-title">价格与步骤</view>
				<view class="form-row" v-show="type!=='edit'">
					<text class="label">悬赏单价</text>
					<input class="input-field" type="digit" v-model="price" :placeholder="unit_priceL" @blur="blurPrice" />
				</view>
				<view class="form-row" v-show="type!=='edit'">
					<text class="label">悬赏次数</text>
					<input class="input-field" type="number" v-model="count" :placeholder="min_quantity" @blur="blurCount" />
				</view>
				<view class="form-row-money">
					<view class="money-header">
						<text class="label">预付赏金</text>
						<text class="formula">=(悬赏单价+服务费)×悬赏次数</text>
					</view>
					<view class="money-content">
						<text class="money-value">{{money || '0.00'}}</text>
						<view class="fee-tip" @click="navToVip">
							<image src="/static/release/error.png" mode="widthFix"></image>
							<text>降低服务费</text>
						</view>
					</view>
				</view>
				<view class="form-row-full">
					<text class="label">做单步骤</text>
					<text class="sub-label">(建议网址和二维码放在第一位)</text>
				</view>
				
				<!-- 步骤列表 -->
				<view class="step-list-container">
					<view class="step-item" v-for="(e,f) in stepArr" :key="f">
						<view class="step-header">
							<view class="step-index">{{f+1}}</view>
							<view class="step-title-text">{{e.ids==5?'收集手机号':'步骤说明'}}</view>
						</view>
						<view class="step-content-preview">
							<pre class="step-desc">{{e.title}}</pre>
							<!-- ... 预览内容 ... -->
						</view>
						<view class="step-actions">
							<view class="action-icon" @click="operateChange(e,f,2)"><image src="/static/release/zuo2.png"></image></view>
							<view class="action-icon" @click="operateChange(e,f,1)"><image src="/static/release/zuo1.png"></image></view>
							<view class="action-icon" @click="operateChange(e,f,3)"><image src="/static/release/zuo3.png"></image></view>
							<view class="action-icon" @click="operateChange(e,f,0)"><image src="/static/release/zuo0.png"></image></view>
						</view>
					</view>
				</view>

				<!-- 添加步骤 -->
				<view class="add-step-area">
					<button class="add-step-btn" @click="isstep=!isstep">
						<image src="/static/user/add.png"></image>
						添加步骤
					</button>
					<view class="step-options-popup" v-show="isstep">
						<view class="option" v-for="(a,i) in step" :key="i" @click="showJoin(i)">
							<image :src="'/static/release/tab'+i+'.png'" mode="widthFix"></image>{{a}}
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部操作 -->
		<view class="footer-actions" :style="{'z-index': isstep || isJoin ? 99 : 100}">
			<view class="protocol" @click="isTcp=!isTcp">
				<view class="checkbox" :class="{'checked': isTcp}">
					<view class="checkmark"></view>
				</view>
				<text class="protocol-text">我已阅读并同意遵守<text class="rule-link" @click.stop="navToReleaseRule">《发布规则》</text></text>
			</view>
			<view class="tip">
				<view class="tip-title">发布提示:</view>
				<view class="tip-content-text">{{prompt}}</view>
			</view>
			<button class="release-btn" @click="releaseType">{{taskId==''?'申请':'确认'}}发布</button>
		</view>

		<!-- 添加步骤弹窗 -->
		<view class="popup-wrapper" v-if="isJoin">
			<view class="popup-overlay" @click="isJoin=false"></view>
			<view class="popup-content">
				<view class="popup-title">{{ isupdate ? '编辑' : '添加' }}{{ taskArr[stepobj.ids].title }}</view>
				<view class="popup-body">
					<!-- 步骤说明 -->
					<textarea class="popup-textarea" v-model="stepobj.title" :placeholder="taskArr[stepobj.ids].holder" />

					<!-- 网址/数据/信息输入 -->
					<input v-if="[0, 2, 5].indexOf(stepobj.ids) !== -1" class="popup-input" v-model="stepobj.input"
						:placeholder="taskArr[stepobj.ids].holder1" />

					<!-- 图片上传 -->
					<view class="image-uploader" v-if="[1, 3, 4].indexOf(stepobj.ids) !== -1">
						<view class="img-item" v-for="(img, d) in taskArr[stepobj.ids].image" :key="d">
							<image class="img" :src="img" mode="aspectFill"></image>
							<view class="del" @click="handleRemove(stepobj.ids, d)"></view>
						</view>
						<view class="add-btn" @click="chooseImg(stepobj.ids)" v-if="taskArr[stepobj.ids].image.length < 1">
						</view>
					</view>
				</view>
				<view class="popup-actions">
					<button class="action-btn cancel" @click="isJoin=false">取消</button>
					<button class="action-btn confirm" @click="taskAdd">确认</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// Script content remains the same
	export default {
		data() {
			return {
				ismenu: false, // 菜单显隐
				menu: ['发布规则', '接单规则', '免责声明'], // 菜单选项
				id: '', // 任务分类id
				taskId: '', // 任务id
				classId: '', // 分类id
				exemption: {}, // 获取服务费比例
				index: -1, // 支持设备下标
				ment: ['全部', '安卓', '苹果', ''], // 支持设备
				name: '', // 项目名称
				title: '', // 标题
				task: '', // 任务说明
				index2: -1, // 限时下标
				timeArr: ['1小时', '2小时', '3小时', '6小时', '9小时', '12小时', '15小时', '24小时', '48小时'], // 限时
				index3: -1, // 审核下标
				auditArr: ['1小时', '2小时', '3小时', '6小时', '9小时', '12小时', '15小时', '24小时', '48小时'], // 审核
				index1: 0, // 做单次数下标
				order: ['每人一次', '每日一次','每人多次'], // 做单次数
				orderSon: ['2次','3次','5次','无限制'],
				orderSonValue: 0,
				price: '', // 悬赏单价c
				count: '', // 悬赏次数
				money: '', // 预付赏金
				stepobj: {
					ids: 0,
					title: '',
					input: '',
					image: []
				}, // 任务对象
				stepArr: [], // 任务集合
				rateArr: ['删除', '下移', '上移', '编辑'], // 步骤操作
				isstep: false, // 步骤显隐
				isupdate: false, //是否编辑
				isTcp: false, // 是否勾选协议
				step: ['输入网址', '二维码', '复制数据', '图文说明', '验证图', '收集信息'], // 步骤展开
				isJoin: false, //是否弹窗
				isdel: false, //是否删除弹窗
				taskArr: [{
					title: '输入网址',
					title1: '填写网址',
					holder: '适用于需要网址，填写网址的操作。输入内容，详细说明如何输入网址。',
					holder1: '链接'
				}, {
					title: '上传二维码',
					title1: '二维码',
					holder: '适用于需要扫描二维码的操作，输入内容，详细说明如何扫描二维码。',
					image: []
				}, {
					title: '复制数据',
					title1: '填写数据',
					holder: '适用于需要复制数据，如填写邀请码，输入内容，提示会员复制数据，方便填写。',
					holder1: '如邀请码，钱包地址之类'
				}, {
					title: '上传说明图',
					title1: '说明图',
					holder: '适用于图文说明，引导悬赏人的操作。输入内容，详细说明需要注意哪些事项等！',
					image: []
				}, {
					title: '上传验证图',
					title1: '验证图',
					holder: '适用于需要验证图，引导接单人操作。输入内容，详细说明需要注意事项！',
					image: []
				}, {
					title: '收集信息',
					holder: '适用于收集手机号、用户名、姓名、ID等。输入内容太，详细说明你要收集什么。',
					holder1: '请输入要收集的信息'
				}], // 弹窗内容
				prompt:'',   //发布提示
				unit_priceL:'',//最低价格
				min_quantity:'',//最低次数,
				unit_pricea:'',
				min_quantitya:'',
				type:'',
				delIndex: 0
			}
		},
		// 监听按钮触发
		onNavigationBarButtonTap() {
			this.ismenu = !this.ismenu
		},
		/* 同时监听多个变量的变化 */
		computed: {
			changeMoney() {
				const {
					index2,
					index3,
					price,
					count
				} = this
				return {
					index2,
					index3,
					price,
					count
				}
			}
		},
		/* 实时监听 */
		watch: {
			changeMoney(newV, oldV) {
				// 计算预付赏金
				if (newV.price != '' && newV.count != ''&& this.exemption.user) {
					let b = parseInt(this.exemption.user.service_charge)/100
					                                        let c =Number(b*newV.price) 
					                                        let a = (newV.price-0 +c) * newV.count
					                                        this.money =a.toFixed(2)
				} 
				// 初始化限时
				this.index2 = newV.index2 == 0 ? -1 : newV.index2;
				// 初始化审核
				this.index3 = newV.index3 == 0 ? -1 : newV.index3;
			},
			// 弹窗关闭且初始化stepobj
			isJoin(newV, oldV) {
				if (!newV) {
					this.stepobj = {
						ids: 0,
						title: '',
						input: '',
						image: []
					}
				}
			}
		},
		onLoad(option) {
			console.log('进入了发布任务页',option)
			if (typeof option.type != 'undefined') {
				this.type=option.type
				this.taskId = option.taskId // 任务id
				this.getAgain()
			}else{
				
				this.classId = option.id // 任务分类id
				this.getServicePrice()
			}
		},
		onHide() {
			this.ismenu = false
		},
		methods: {
			orderChoose(i){
				let that = this
				that.index1 = i
				
			},
			// 编辑任务数据回显
			getAgain() {
				let that=this
				uni.request({
					url: this.global.url + '/api/task/again',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						id: this.taskId,
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						if (res.data.code == 1) {
							let list = res.data.data
							// 分类id
							this.classId = list.classifications_id
							// 支持设备
							this.index = list.equipment - 1
							// 项目名称
							this.name = list.entryname
							// 标题
							this.title = list.title
							// 任务说明
							this.task = list.taskdescription
							// 限时
							this.index2 = this.timeArr.map(i => i).indexOf(list.timelimit + '小时')
							// 审核
							this.index3 = this.auditArr.map(i => i).indexOf(list.audittime + '小时')
							// 做单次数
							this.index1 = list.frequency - 1
							// 悬赏单价
							this.price = list.price
							// 悬赏次数
							this.count = list.total
							// 做单次数
							this.orderSonValue = list.jie_num == 0? 3 : this.orderSon.findIndex(item=>item.includes(list.jie_num)>0)
							// 勾选协议
							this.isTcp = true
							// 做单步骤
							let arr = list.tasksteps
							// 删除字符串url
							arr.map(s => typeof s.url == 'string' ? delete s.url : '')
							// 修改数组url属性名为image
							let tasksteps = JSON.parse(JSON.stringify(arr).replace(/url/g, 'image'))
							for (let i in tasksteps) {
								// tasksteps数组有image属性执行
								if (tasksteps[i].hasOwnProperty('image')) {
									for (let j in tasksteps[i].image) {
										// 给image数组图片对象加访问域名
										tasksteps[i].image[j] = this.global.url + tasksteps[i].image[j]
									}
								}
							}
							this.stepArr = tasksteps
							
							that.getServicePrice()
						}
					}
				})
			},
			// 限时选择
			bindPickerChangeTime(e) {
				this.index2 = e.detail.value;
			},
			bindPickerChangeOrderSonValue(e){
				this.orderSonValue = e.detail.value;
			},
			// 审核选择
			bindPickerChangeAudit(e) {
				console.log('审核选择',e)
				this.index3 = e.detail.value;
			},
			// 失焦判断价格不低于unit_pricea
			blurPrice(e) {
				let num = Number(e.detail.value.toString().match(/^\d+(?:\.\d{0,2})?/))
				if (num < this.unit_pricea) {
					this.price = this.unit_pricea
				}else{
					this.price = num
				}
			},
			// 失焦判断数量不小于3
			blurCount(e) {
				if (parseInt(e.detail.value) < this.min_quantitya) {
					this.count = this.min_quantitya
				}
			},
			// 弹窗显隐
			showJoin(i) {
				this.isstep = false;
				this.stepobj.ids = i;
				this.$nextTick(() => {
					this.isJoin = true;
				});
			},
			// 操作链接
			setLink(type, input) {
				if (type == 0) { // 跳转链接
					window.location.href = input;
				} else { // 复制链接
					uni.setClipboardData({
						data: input,
						success: () => {
							uni.showToast({
								title: '已复制到剪贴板',
								icon: 'none'
							})
						}
					});
				}
			},
			// 添加、编辑任务
			taskAdd() {
				
				let urls = /(http|https):\/\/([\w.]+\/?)\S*/
				if (this.stepobj.title == '') {
					uni.showToast({
						title: '请输入说明内容',
						icon: 'none'
					})
				} else if (this.stepobj.input == '' && [0, 2, 5].indexOf(this.stepobj.ids) != -1) {
					uni.showToast({
						title: '请填写信息',
						icon: 'none'
					})
				
					
				} else if(!urls.test(this.stepobj.input)&&[0, 2].indexOf(this.stepobj.ids) != -1 ){
					uni.showToast({
						title: '请填写正确网址',
						icon: 'none'
					})
					return
				}else if (typeof this.taskArr[this.stepobj.ids].image != 'undefined' && this.taskArr[this.stepobj.ids]
					.image.length == 0 && [1, 3, 4].indexOf(this.stepobj.ids) != -1) {
					uni.showToast({
						title: '请选择图片',
						icon: 'none'
					})
				} else {
					this.isJoin = false; // 关闭弹窗
					this.stepobj.image = this.taskArr[this.stepobj.ids].image; // 图片传参
					if (!this.isupdate) { // 添加步骤
						// 限制添加一条收集信息
						let isadd = this.stepArr.map(i => i.ids).indexOf(this.stepobj.ids);
						if (isadd == -1 || this.stepobj.ids != 5) {
							this.stepArr.push(this.stepobj);
						} else {
							uni.showToast({
								title: '仅限添加一条收集信息',
								icon: 'none'
							})
						}
					} else { // 编辑步骤
						this.isupdate = false
					}
					this.stepArr.sort((a, b) => a.ids - b.ids); // 从小到大排序
					this.taskArr[this.stepobj.ids].image = []; // 初始化图片
				}
			},
			// 上传图片
			chooseImg(index) {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						res.tempFilePaths.forEach((i) => {
							uni.uploadFile({
								url: this.global.url + '/index.php/api/common/upload',
								filePath: i,
								name: 'file',
								formData: {
									'upload': 'upload'
								},
								success: (resimg) => {
									let data = JSON.parse(resimg.data);
									if (data.code == 1) {
										this.taskArr[index].image.push(data.data.fullurl);
									}
								}
							});
						});
					}
				});
			},
			// 预览图片
			perviewImg(i) {
				uni.previewImage({
					urls: this.taskArr[i].image.includes('http')? this.taskArr[i].image.includes('http') : this.global.url + this.taskArr[i].image,
					indicator: 'number',
					loop: true
				});
			},
			// 预览图片
			perviewImg1(arr) {
				uni.previewImage({
					urls: arr,
					indicator: 'number',
					loop: true
				});
			},
			// 删除图片
			handleRemove(i, d) {
				this.taskArr[i].image.splice(d, 1);
			},
			// 确认删除任务
			notarize() {
				console.log(this.delIndex, this.stepArr)
				this.isdel = false; // 关闭窗显
				this.stepArr.splice(this.delIndex, 1);
			},
			// 任务操作
			operateChange(item, index, i) {
				if (i == 0) { // 删除
					this.delIndex = index
					this.isdel = true; // 开启窗显
				} else if (i == 1) { // 下移
					if (index != this.stepArr.length - 1) {
						this.stepArr.splice(index + 2, 0, item);
						this.stepArr.splice(index, 1);
					} else {
						uni.showToast({
							title: '已经到底部了',
							icon: 'none'
						})
					}
				} else if (i == 2) { // 上移
					if (index != 0) {
						this.stepArr.splice(index - 1, 0, item);
						this.stepArr.splice(index + 1, 1);
					} else {
						uni.showToast({
							title: '已经到顶部了',
							icon: 'none'
						})
					}
				} else { // 编辑
					this.stepobj = item; // 数据回显
					this.taskArr[item.ids].image = item.image; // 编辑图回显
					this.isJoin = true; // 开启弹窗
					this.isupdate = true; // 执行编辑
				}
			},
			// 跳转会员中心
			navToVip() {
				uni.navigateTo({
					url: '/pages/member/member'
				})
			},
			// 跳转规则
			navToRule(index) {
				uni.navigateTo({
					url: '/pages/home/subpage/course?id='+index
				})
			},
			// 跳转发布规则
			navToReleaseRule() {
				uni.navigateTo({
					url: '/pages/home/subpage/course?id=0'
				})
			},
			// 获取服务费
			getServicePrice() {
				uni.request({
					url: this.global.url + '/api/task/release',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: uni.getStorageSync('token').token,
						id: this.classId,
					},
					success: (res) => {
						this.exemption = res.data.data;
						this.prompt = res.data.data.prompt;
						this.unit_priceL = '最低出价'+res.data.data.unit_price+'元';
						this.unit_pricea =res.data.data.unit_price;
						this.min_quantity = '最少'+res.data.data.min_quantity+'单';
						this.min_quantitya=res.data.data.min_quantity
						if(this.price&&this.count){
							let b = parseInt(this.exemption.user.service_charge)/100
							                                        let c =Number(b*this.price) 
							                                        let a = (this.price-0 +c) * this.count
							                                        this.money =a.toFixed(2)
						}
					}
				})
			},
			// 发布任务-添加或编辑
			releaseType() {
				if (this.taskId == '' || this.type == 'resend') {
					this.confirmRelease()
				} else {
					this.againRelease()
				}
				
	
				
			},
			// 发布任务-确认发布
			confirmRelease() {
				if (this.index == -1) {
					uni.showToast({
						title: '请选择支持设备',
						icon: 'none'
					})
				} else if (this.name == '') {
					uni.showToast({
						title: '请输入项目名称',
						icon: 'none'
					})
				} else if (this.title == '') {
					uni.showToast({
						title: '请输入标题',
						icon: 'none'
					})
				} else if (this.task == '') {
					uni.showToast({
						title: '请输入任务说明',
						icon: 'none'
					})
				} else if (this.index2 == -1) {
					uni.showToast({
						title: '请选择接单时间',
						icon: 'none'
					})
				} else if (this.index3 == -1) {
					uni.showToast({
						title: '请选择审核时间',
						icon: 'none'
					})
				} else if (this.price == '') {
					uni.showToast({
						title: '请输入悬赏单价',
						icon: 'none'
					})
				} else if (this.count == '') {
					uni.showToast({
						title: '请输入悬赏次数',
						icon: 'none'
					})
				} else if (this.stepArr.length == 0) {
					uni.showToast({
						title: '请选择并输入步骤',
						icon: 'none'
					})
				} else if (!this.isTcp) {
					uni.showToast({
						title: '请勾选协议',
						icon: 'none'
					})
				} else {
					// 得到步骤数据（图片是绝对路径）
					let setparr = this.stepArr;
					for (let a in setparr) {
						// 过滤空值
						if (setparr[a].input == '') {
							delete setparr[a].input
						}
						// 去掉图片域名
						if (typeof setparr[a].image != 'undefined') {
							for (let b in setparr[a].image) {
								setparr[a].image[b] = setparr[a].image[b].replace(this.global.url, '')
							}
						}
					}
					console.log(JSON.stringify(setparr))
					// 发起发布请求
					uni.request({
						url: this.global.url + '/api/task/confirm_release',
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							name: this.name,
						//	task_id: this.id,
							classId: this.classId,
							title: this.title,
							price: this.price,
							money: this.money,
							explain: this.task,
							ment: this.index + 1,
							numoffers: this.count,
							equipment: this.index + 1,
							frequency: this.index1 + 1,
							jie_num: this.orderSon[this.orderSonValue] == '无限制'? 0 : Number(this.orderSon[this.orderSonValue].split('')[0]),
							step: JSON.stringify(setparr),
							token: uni.getStorageSync('token').token,
							user_id: uni.getStorageSync('token').user_id,
							audittime: this.auditArr[this.index3].replace('小时', ''),
							timelimit: this.timeArr[this.index2].replace('小时', '')
						},
						success: (res) => {
							
							
							if (res.data.code == 1) {
								uni.showToast({
									title: '发布成功',
									icon: 'success',
									duration:2000,
								})
								setTimeout(function(){
									
									uni.navigateTo({
										//url: '/pages/task/task'
										url: '/pages/mine/rewardManagement/rewardManagement?type=3'
									})
								},2000)
							}else if(res.data.code == 10002){
								uni.showModal({
									content: '余额不足请先充值!',
									cancelColor: '#adadad',
									confirmText: '去充值',
									confirmColor: '#64a6df',
									success: function(r) {
										console.log(r)
										if (r.confirm) { 
											console.log('惦记了确定',r)
											// 执行确认后的操作
											uni.navigateTo({
												url: '/pages/mine/wallet/recharge'
											})
										} 
										else {
											// 执行取消后的操作
										}
									}
								})
							}else{
								if(res.data.msg == '余额不足,请前往充值!'){
									uni.showModal({
										content: '余额不足请先充值!',
										cancelColor: '#adadad',
										confirmText: '去充值',
										confirmColor: '#64a6df',
										success: function(r) {
											console.log(r)
											if (r.confirm) { 
												console.log('惦记了确定',r)
												// 执行确认后的操作
												uni.navigateTo({
													url: '/pages/mine/wallet/recharge'
												})
											} 
											else {
												// 执行取消后的操作
											}
										}
									})
									return
								}
								console.log(res.data.msg)
								 uni.showToast({
									title: res.data.msg,
									icon: 'none'
								 })
								
							}
						}
					})
				}
			},
			// 编辑发布-确认发布
			againRelease() {
				if (this.index == -1) {
					uni.showToast({
						title: '请选择支持设备',
						icon: 'none'
					})
				} else if (this.name == '') {
					uni.showToast({
						title: '请输入项目名称',
						icon: 'none'
					})
				} else if (this.title == '') {
					uni.showToast({
						title: '请输入标题',
						icon: 'none'
					})
				} else if (this.task == '') {
					uni.showToast({
						title: '请输入任务说明',
						icon: 'none'
					})
				} else if (this.index2 == -1) {
					uni.showToast({
						title: '请选择接单时间',
						icon: 'none'
					})
				} else if (this.index3 == -1) {
					uni.showToast({
						title: '请选择审核时间',
						icon: 'none'
					})
				} else if (this.price == '') {
					uni.showToast({
						title: '请输入悬赏单价',
						icon: 'none'
					})
				} else if (this.count == '') {
					uni.showToast({
						title: '请输入悬赏次数',
						icon: 'none'
					})
				} else if (this.stepArr.length == 0) {
					uni.showToast({
						title: '请选择并输入步骤',
						icon: 'none'
					})
				} else if (!this.isTcp) {
					uni.showToast({
						title: '请勾选协议',
						icon: 'none'
					})
				} else {
					// 得到步骤数据（图片是绝对路径）
					let setparr = this.stepArr;
					for (let a in setparr) {
						// 过滤空值
						if (setparr[a].input == '') {
							delete setparr[a].input
						}
						// 去掉图片域名
						if (typeof setparr[a].image != 'undefined') {
							for (let b in setparr[a].image) {
								setparr[a].image[b] = setparr[a].image[b].replace(this.global.url, '')
							}
						}
					}
					// 发起发布请求
					uni.request({
						url: this.global.url + '/api/task/again_release',
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							id: this.taskId,
							name: this.name,
							title: this.title,
							price: this.price,
							money: this.money,
							explain: this.task,
							numoffers: this.count,
							equipment: this.index + 1,
							frequency: this.index1 + 1,
							jie_num: this.orderSon[this.orderSonValue] == '无限制'? 0 : Number(this.orderSon[this.orderSonValue].split('')[0]),
							step: JSON.stringify(setparr),
							classifications_id: this.classId,
							token: uni.getStorageSync('token').token,
							audittime: this.auditArr[this.index3].replace('小时', ''),
							timelimit: this.timeArr[this.index2].replace('小时', '')
						},
						success: (res) => {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
							if (res.data.code == 1) {
								uni.navigateBack()
							}
						}
					})
				}
			},
			//禁止页面滚动(规避警告)
			stopSlide() {
				return
			},
		}
	}
</script>

<style lang="scss" scoped>
	/* 动画效果 */
	.slide-fade-enter-active, .slide-fade-leave-active {
		transition: all 0.3s ease;
	}
	.slide-fade-enter, .slide-fade-leave-to {
		transform: translateY(-20px);
		opacity: 0;
	}

	/* 遮罩层 */
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 99;
	}

	/* 菜单 */
	.menu {
		position: fixed;
		top: calc(var(--status-bar-height) + 88rpx + 15rpx);
		right: 30rpx;
		width: 250rpx;
		background-color: #fff;
		border-radius: 16rpx;
		box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);
		z-index: 100;
		overflow: hidden;
		.menu-item {
			padding: 25rpx 30rpx;
			font-size: 28rpx;
			color: #333;
			border-bottom: 1rpx solid #f0f0f0;
			&:last-child {
				border-bottom: none;
			}
			&:active {
				background-color: #f7f8fa;
			}
		}
	}

	page {
		background-color: #f7f8fa;
	}

	.release-container {
		width: 100%;
		min-height: 100vh;
		padding-bottom: 220rpx; // Footer space
	}


	.form-wrapper {
		padding: 0 30rpx;
		margin-top: 20rpx;
	}

	.card {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

		.card-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 20rpx;
		}
	}

	.device-options {
		display: flex;
		gap: 20rpx;
		.option-btn {
			flex: 1;
			height: 72rpx;
			line-height: 72rpx;
			text-align: center;
			background-color: #f7f8fa;
			border-radius: 12rpx;
			font-size: 28rpx;
			color: #666;
			&.checked {
				background-color: $uni-color-primary;
				color: #fff;
				font-weight: 500;
			}
		}
	}

	.order-options {
		display: flex;
		width: 100%;
		gap: 16rpx;
		margin-top: 16rpx;
		.order-btn {
			flex: 1;
			height: 64rpx;
			line-height: 64rpx;
			text-align: center;
			background-color: #f7f8fa;
			border-radius: 12rpx;
			font-size: 26rpx;
			color: #666;
			&.checked {
				background-color: $uni-color-primary;
				color: #fff;
				font-weight: 500;
			}
		}
	}

	.form-row, .form-row-full {
		display: flex;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #f0f0f0;
		&:last-child {
			border-bottom: none;
		}
		.label {
			width: 180rpx;
			font-size: 28rpx;
			color: #333;
			flex-shrink: 0;
		}
		.input-field, .picker-field {
			flex: 1;
			font-size: 28rpx;
			text-align: right;
			.placeholder {
				color: #999;
			}
		}
		.radio-group {
			display: flex;
			justify-content: flex-end;
			flex: 1;
			radio {
				transform: scale(0.8);
			}
		}
		.fee-tip {
			display: flex;
			align-items: center;
			color: $uni-color-primary;
			font-size: 24rpx;
			margin-left: 10rpx;
			image {
				width: 30rpx;
				height: 30rpx;
				margin-right: 6rpx;
			}
		}
	}
	
	.form-row-full {
		flex-direction: column;
		align-items: flex-start;
		.sub-label {
			font-size: 24rpx;
			color: $uni-color-primary;
			margin-top: 10rpx;
		}
	}

	.form-row-money {
		padding: 20rpx 0;
		border-bottom: 1rpx solid #f0f0f0;

		.money-header {
			display: flex;
			align-items: baseline;
			margin-bottom: 16rpx;

			.label {
				font-size: 28rpx;
				color: #333;
				flex-shrink: 0;
			}

			.formula {
				font-size: 22rpx;
				color: #999;
				margin-left: 8rpx;
			}
		}

		.money-content {
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: #f7f8fa;
			border-radius: 12rpx;
			padding: 20rpx 24rpx;

			.money-value {
				font-size: 36rpx;
				font-weight: bold;
				color: $uni-color-primary;

				&::before {
					content: '¥';
					font-size: 24rpx;
					margin-right: 4rpx;
				}
			}

			.fee-tip {
				display: flex;
				align-items: center;
				color: $uni-color-primary;
				font-size: 24rpx;
				background-color: #fff;
				padding: 10rpx 16rpx;
				border-radius: 20rpx;
				box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

				image {
					width: 28rpx;
					height: 28rpx;
					margin-right: 6rpx;
				}
			}
		}
	}

	.step-list-container {
		margin-top: 20rpx;
		.step-item {
			background-color: #f7f8fa;
			border-radius: 12rpx;
			padding: 20rpx;
			margin-bottom: 20rpx;
			.step-header {
				display: flex;
				align-items: center;
				.step-index {
					width: 40rpx;
					height: 40rpx;
					line-height: 40rpx;
					text-align: center;
					border-radius: 50%;
					background-color: $uni-color-primary;
					color: #fff;
					font-weight: bold;
					margin-right: 20rpx;
				}
				.step-title-text {
					font-size: 28rpx;
					font-weight: 500;
				}
			}
			.step-content-preview {
				padding: 20rpx 0 20rpx 60rpx;
				.step-desc {
					font-size: 26rpx;
					color: #666;
					white-space: pre-wrap;
				}
			}
			.step-actions {
				display: flex;
				justify-content: flex-end;
				gap: 30rpx;
				border-top: 1rpx solid #e0e0e0;
				padding-top: 20rpx;
				.action-icon {
					image {
						width: 40rpx;
						height: 40rpx;
					}
				}
			}
		}
	}

	.add-step-area {
		position: relative;
		display: flex;
		justify-content: center;
		.add-step-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 80rpx;
			width: 300rpx;
			background-color: #fdecec;
			color: $uni-color-primary;
			border-radius: 40rpx;
			font-size: 28rpx;
			margin: 20rpx 0 0;
			image {
				width: 32rpx;
				height: 32rpx;
				margin-right: 10rpx;
			}
		}
		.step-options-popup {
			position: absolute;
			bottom: 100rpx;
			left: 50%;
			transform: translateX(-50%);
			width: 600rpx;
			background-color: #fff;
			border-radius: 16rpx;
			box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);
			display: grid;
			grid-template-columns: 1fr 1fr 1fr;
			padding: 20rpx;
			gap: 20rpx;
			z-index: 100;
			.option {
				display: flex;
				flex-direction: column;
				align-items: center;
				font-size: 24rpx;
				color: #666;
				image {
					width: 60rpx;
					height: 60rpx;
					margin-bottom: 10rpx;
				}
			}
		}
	}

	.footer-actions {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #fff;
		padding: 20rpx 30rpx;
		padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
		box-sizing: border-box;
		.protocol {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24rpx;
			color: #666;
			.protocol-text {
				user-select: none;
			}
			.rule-link {
				color: $uni-color-primary;
			}
			.checkbox {
				position: relative;
				width: 36rpx;
				height: 36rpx;
				border: 2rpx solid #dcdfe6;
				border-radius: 8rpx;
				margin-right: 12rpx;
				background-color: #fff;
				transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
				flex-shrink: 0;

				&:active {
					transform: scale(0.9);
				}

				.checkmark {
					position: absolute;
					top: 50%;
					left: 50%;
					width: 10rpx;
					height: 18rpx;
					border: solid #fff;
					border-width: 0 3rpx 3rpx 0;
					transform: translate(-50%, -60%) rotate(45deg) scale(0);
					opacity: 0;
					transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
				}

				&.checked {
					background: linear-gradient(135deg, $uni-color-primary 0%, #ff6b6b 100%);
					border-color: $uni-color-primary;
					box-shadow: 0 4rpx 12rpx rgba(230, 57, 70, 0.35);

					.checkmark {
						transform: translate(-50%, -60%) rotate(45deg) scale(1);
						opacity: 1;
						animation: checkBounce 0.3s cubic-bezier(0.4, 0, 0.2, 1);
					}
				}
			}
		}

		@keyframes checkBounce {
			0% {
				transform: translate(-50%, -60%) rotate(45deg) scale(0);
			}
			50% {
				transform: translate(-50%, -60%) rotate(45deg) scale(1.2);
			}
			100% {
				transform: translate(-50%, -60%) rotate(45deg) scale(1);
			}
		}
		.tip {
			margin-top: 20rpx;
			font-size: 24rpx;
			color: #999;
			.tip-title {
				color: $uni-color-primary;
			}
		}
		.release-btn {
			height: 88rpx;
			line-height: 88rpx;
			font-size: 32rpx;
			background-color: $uni-color-primary;
			color: #fff;
			border-radius: 44rpx;
			margin-top: 20rpx;
		}
	}
	/* 弹窗样式 */
	.popup-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 999;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.popup-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
	}

	.popup-content {
		width: 80%;
		background-color: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		position: relative;
		z-index: 1000;
	}

	.popup-title {
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		margin-bottom: 20rpx;
	}

	.popup-body {
		margin-bottom: 30rpx;
	}

	.popup-textarea {
		width: 100%;
		height: 150rpx;
		background-color: #f7f8fa;
		border-radius: 12rpx;
		padding: 20rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		margin-bottom: 20rpx;
	}

	.popup-input {
		width: 100%;
		height: 80rpx;
		background-color: #f7f8fa;
		border-radius: 12rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
		font-size: 28rpx;
	}

	.popup-actions {
		display: flex;
		justify-content: space-between;
		gap: 20rpx;
	}

	.action-btn {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 40rpx;
		font-size: 28rpx;
		&.cancel {
			background-color: #f0f0f0;
			color: #333;
		}
		&.confirm {
			background-color: $uni-color-primary;
			color: #fff;
		}
	}
	
	.image-uploader {
		display: flex;
		gap: 20rpx;
		.img-item {
			position: relative;
			width: 120rpx;
			height: 120rpx;
			.img {
				width: 100%;
				height: 100%;
				border-radius: 12rpx;
			}
			.del {
				position: absolute;
				top: -10rpx;
				right: -10rpx;
				width: 32rpx;
				height: 32rpx;
				background-color: red;
				color: white;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 24rpx;
				&::after {
					content: '×';
				}
			}
		}
		.add-btn {
			width: 120rpx;
			height: 120rpx;
			background-color: #f7f8fa;
			border-radius: 12rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 60rpx;
			color: #ccc;
			&::after {
				content: '+';
			}
		}
	}
</style>
