<template>
	<view>
		<!-- 菜单选项 -->
		<view class="menu" v-show="ismenu">
			<view v-for="(d,s) in menu" :key="s" @click="navToRule(s)">{{d}}</view>
		</view>
		<!-- 支持设备 -->
		<view class="head">
			<view class="head-tr">支持设备</view>
			<view :class="['head-td',index==i?'check':'']" v-for="(a,i) in ment" :key="i"
				@click="index=(index==i?-1:i)">{{a}}
			</view>
		</view>
		<!-- 表单区域1 -->
		<view class="froms">
			<view class="row">
				<text>项目名称</text>
				<input type="text" v-model="name" placeholder="必须真实项目名称,4个字以内" maxlength="4" />
			</view>
			<view class="row">
				<text>标题</text>
				<input type="text" v-model="title" placeholder="请输入悬赏标题，10个字以内" maxlength="10" />
			</view>
			<view class="row">
				<text>任务说明</text>
				<input type="text" v-model="task" placeholder="任务备注" />
			</view>
			<view class="row">
				<text>限时</text>
				<picker @change="bindPickerChangeTime" :value="index2" :range="timeArr">
					<input v-model="timeArr[index2]" placeholder="请选择接单限时（超时未结单释放名额）" disabled />
				</picker>
			</view>
			<view class="row">
				<text>审核</text>
				<picker @change="bindPickerChangeAudit" :value="index3" :range="auditArr">
					<input v-model="auditArr[index3]" placeholder="请选择审核时间（超时系统自动审核)" disabled />
				</picker>
			</view>
			<view class="row">
				<text>做单次数</text>
				<radio-group>
					<radio color="#017ff0" v-for="(a,i0) in order" :key="i0" :value="a" :checked="index1==i0"
						@click="index1=i0">{{a}}
					</radio>
				</radio-group>
			</view>
		</view>
		<!-- 表单区域2 -->
		<view class="froms">
			<view class="row">
				<text>悬赏单价</text>
				<input type="digit" v-model="price" placeholder="最低出价0.24元" @blur="blurPrice" />
			</view>
			<view class="row">
				<text>悬赏次数</text>
				<input type="number" v-model="count" placeholder="最少3单" @blur="blurCount" />
			</view>
			<view class="row">
				<text>预付赏金</text>
				<input v-model="money" placeholder="(悬赏单价+服务费)×悬赏次数" disabled />
				<view class="xun">
					<image src="/static/release/error.png" mode="widthFix"></image>
					<text @click="navToVip">降低服务费</text>
				</view>
			</view>
			<view class="row">
				<text>做单步骤</text>
				<input placeholder="(建议网址和二维码放在第一位)" placeholder-style="color: #017ff0;" disabled />
			</view>
			<!-- 步骤列表 -->
			<view class="steplist" v-for="(e,f) in stepArr" :key="f">
				<!-- 头部 -->
				<view class="setpIndex">
					<view>{{f+1}}</view>{{e.ids==5?'手机号':'步骤说明'}}
				</view>
				<!-- 主体 -->
				<view class="setpcont" v-if="e.ids==0">
					<view @click="setLink(0,e.input)">打开链接</view>
					<view @click="setLink(1,e.input)">复制链接</view>
				</view>
				<view class="copy" v-if="e.ids==2">
					<view>{{e.title}}</view>
					<view @click="setLink(1,e.input)">复制数据</view>
				</view>
				<view class="phone" v-if="e.ids==5">{{e.title}}</view>
				<view :class="['code',e.ids==1?'ewms':'']" v-if="e.ids==1||e.ids==3||e.ids==4">
					<view v-if="e.ids!=1">{{e.ids==3?'说明图':e.ids==4?'验证图':''}}</view>
					<block v-for="(g,h) in e.image" :key="h">
						<image :src="g" mode="aspectFill" @click="perviewImg1(e.image)"></image>
					</block>
				</view>
				<!-- 操作 -->
				<view class="operate">
					<view class="operlist" v-for="(j,h) in rateArr" :key="h" @click="operateChange(e,f,h)">
						<image :src="'/static/release/zuo'+h+'.png'" mode="aspectFill"></image>
						<text>{{j}}</text>
					</view>
				</view>
				<!-- 删除弹窗 -->
				<view v-show="isdel" @touchmove.stop.prevent="stopSlide">
					<!-- 遮罩层 -->
					<view class="mask" @click="isdel=!isdel"></view>
					<!-- 内容区 -->
					<view class="tip-del">
						<view class="tip-top">
							<image src="/static/release/yellow.png" mode="widthFix"></image>温馨提示
						</view>
						<view class="tip-titdel">确定删除此步骤？</view>
						<view class="tip-btn">
							<view @click="isdel=false">取消</view>
							<view @click="notarize(f)">确认</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 添加步骤 -->
			<view class="addbtn" @click="isstep=!isstep">添加步骤
				<!-- 添加步骤显隐 -->
				<view class="stepshow" v-show="isstep">
					<view v-for="(a,i) in step" :key="i" @click="showJoin(i)">
						<image :src="'/static/release/tab'+i+'.png'" mode="widthFix"></image>{{a}}
					</view>
				</view>
			</view>
			<view style="width:100%;height: 40rpx;"></view>
		</view>
		<!-- 协议 -->
		<view class="protocol" @click="isTcp=!isTcp">
			<view class="protocol-checkbox" :class="{'checked': isTcp}">
				<view class="checkmark"></view>
			</view>
			<text class="protocol-text">我已阅读并同意遵守《发布规则》的全部内容</text>
		</view>
		<view class="tip">
			<view>发布提示:</view>1.本平台禁止发布黄、赌、毒及政策等一切法律禁止内容，详细请参考《发布规则》，如有违反将查封账号，不退还账户余额，敬请周知；
		</view>
		<view style="width:100%;height: 98rpx;"></view>
		<view class="releasebtn" @click="releaseType">{{taskId==''?'申请':'确认'}}发布</view>
		<!-- 弹窗 -->
		<view v-show="isJoin" @touchmove.stop.prevent="stopSlide">
			<!-- 遮罩层 -->
			<view class="mask" @click="isJoin=!isJoin"></view>
			<!-- 内容区 -->
			<view class="tip-content" v-if="stepobj.ids==i" v-for="(b,i) in taskArr" :key="i">
				<view class="tip-container">
					<view class="tip-tit">{{b.title}}
						<image @click="isJoin=false" src="/static/release/delete.png" mode="widthFix"></image>
					</view>
					<view class="state">
						<text v-if="i!=5">步骤说明</text>
						<textarea v-model="stepobj.title" :placeholder="b.holder" maxlength="300" />
						<text>{{stepobj.title.length+'/300'}}</text>
					</view>
					<view class="linkurl">
						<text>{{b.title1}}</text>
						<input v-if="i==0||i==2" type="text" v-model="stepobj.input" :placeholder="b.holder1" />
						<view class="upimg" v-if="i==1||i==3||i==4">
							<view v-for="(c,d) in b.image" :key="d">
								<image :src="c" mode="aspectFill" @click="perviewImg(i)" @longpress="handleRemove(i)">
								</image>
							</view>
							<view v-if="b.image.length==0" @click="chooseImg(i)">+</view>
						</view>
					</view>
				</view>
				<view class="tip-btn">
					<view @click="isJoin=isupdate=false">取消</view>
					<view @click="taskAdd">{{isupdate?'确认':'添加'}}</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				ismenu: false, // 菜单显隐
				menu: ['发单规则', '接单规则', '免责声明'], // 菜单选项
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
				timeArr: ['请选择接单时间', '1小时', '2小时', '3小时', '6小时', '9小时', '12小时', '15小时', '24小时', '48小时'], // 限时
				index3: -1, // 审核下标
				auditArr: ['请选择审核时间', '1天', '2天', '3天', '4天', '5天', '6天', '7天'], // 审核
				index1: 0, // 做单次数下标
				order: ['每人一次', '每日一次'], // 做单次数
				price: '', // 悬赏单价
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
					holder: '适用于收集手机号、用户名、姓名、ID等。输入内容太，详细说明你要收集什么。'
				}], // 弹窗内容
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
			                                console.log(this.exemption.user)
			                                if (newV.price != '' && newV.count != ''&& this.exemption.user) {
			                                        this.money = ((parseInt(newV.price) + (parseInt(this.exemption.user.service_charge) / 100)*(parseInt(newV.price))) * (
			                                              parseInt(newV.count))).toFixed(2);
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
			if (typeof option.type != 'undefined') {
				this.taskId = option.taskId // 任务id
				this.getAgain()
			}
			this.id = option.id // 任务分类id
			this.getServicePrice()
		},
		onHide() {
			this.ismenu = false
		},
		methods: {
			// 编辑任务数据回显
			getAgain(taskId) {
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
							this.index3 = this.auditArr.map(i => i).indexOf(list.audittime + '天')
							// 做单次数
							this.index1 = list.frequency - 1
							// 悬赏单价
							this.price = list.price
							// 悬赏次数
							this.count = list.total
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
						}
					}
				})
			},
			// 限时选择
			bindPickerChangeTime(e) {
				this.index2 = e.detail.value;
			},
			// 审核选择
			bindPickerChangeAudit(e) {
				this.index3 = e.detail.value;
			},
			// 失焦判断价格不低于0.24
			blurPrice(e) {
				if (parseInt(e.detail.value) < 0.24) {
					this.price = 0.24
				}
			},
			// 失焦判断数量不小于3
			blurCount(e) {
				if (parseInt(e.detail.value) < 3) {
					this.count = 3
				}
			},
			// 弹窗显隐
			showJoin(i) {
				this.isJoin = true;
				this.stepobj.ids = i;
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
				if (this.stepobj.title == '') {
					uni.showToast({
						title: '请输入说明内容',
						icon: 'none'
					})
				} else if (this.stepobj.input == '' && [0, 2].indexOf(this.stepobj.ids) != -1) {
					uni.showToast({
						title: '请填写信息',
						icon: 'none'
					})
				} else if (typeof this.taskArr[this.stepobj.ids].image != 'undefined' && this.taskArr[this.stepobj.ids]
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
					urls: this.taskArr[i].image,
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
			handleRemove(i) {
				this.taskArr[i].image.splice(i, 1);
			},
			// 确认删除任务
			notarize(index) {
				this.isdel = false; // 关闭窗显
				this.stepArr.splice(index, 1);
			},
			// 任务操作
			operateChange(item, index, i) {
				if (i == 0) { // 删除
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
					url: '/pages/home/subpage/course'
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
						token: uni.getStorageSync('token').token
					},
					success: (res) => {
						this.exemption = res.data.data
					}
				})
			},
			// 发布任务-添加或编辑
			releaseType() {
				if (this.taskId == '') {
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
					// 发起发布请求
					uni.request({
						url: this.global.url + '/api/task/confirm_release',
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							name: this.name,
							task_id: this.id,
							title: this.title,
							price: this.price,
							money: this.money,
							explain: this.task,
							ment: this.index + 1,
							numoffers: this.count,
							equipment: this.index + 1,
							frequency: this.index1 + 1,
							step: JSON.stringify(setparr),
							token: uni.getStorageSync('token').token,
							user_id: uni.getStorageSync('token').user_id,
							audittime: this.auditArr[this.index3].replace('天', ''),
							timelimit: this.timeArr[this.index2].replace('小时', '')
						},
						success: (res) => {
							uni.showToast({
								title: res.data.msg,
								icon: 'none'
							})
							if (res.data.code == 1) {
								uni.switchTab({
									url: '/pages/task/task'
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
							step: JSON.stringify(setparr),
							classifications_id: this.classId,
							token: uni.getStorageSync('token').token,
							audittime: this.auditArr[this.index3].replace('天', ''),
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
			}
		}
	}
</script>

<style scoped lang="scss">
	page {
		color: #333333;
	}

	.head,
	.row,
	.xun,
	.code,
	.copy,
	.stepshow,
	.protocol,
	.tip-tit,
	.setpcont,
	.operate {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.menu {
		z-index: 999;
		width: 198rpx;
		padding: 1rpx 0;
		font-size: 28rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		box-shadow: 0 1rpx 3rpx 0 rgba(4, 0, 0, 0.5);
		position: fixed;
		top: 80rpx;
		right: 0;

		&>view {
			margin: 30rpx auto;
			text-align: center;
		}
	}

	/* 支持设备 */
	.head {
		flex-wrap: wrap;
		font-size: 30rpx;
		margin-top: 20rpx;
		background-color: #FFFFFF;
		padding: 18rpx 24rpx 30rpx 24rpx;

		&-tr {
			width: 100%;
			font-weight: bold;
			margin-bottom: 29rpx;
		}

		&-td {
			padding: 18rpx 35rpx;
			background-color: #F8F8F8;
		}

		.check {
			color: #017ff0;
			background-color: #FEF7D9;
		}

		.head-td:last-child {
			background-color: #FFFFFF;
		}
	}

	/* 表单样式 */
	.froms {
		padding: 0 24rpx;
		margin-top: 10rpx;
		background-color: #FFFFFF;

		.row {
			padding: 30rpx 0;
			position: relative;
			border-bottom: 1px solid #F8F8F8;

			&>text {
				font-size: 26rpx;
			}

			&>input,
			&>picker,
			.xun {
				width: 75%;
				color: #999999;
				font-size: 24rpx;
			}

			&>picker {
				& input {
					width: 100%;
					color: #999999;
					font-size: 24rpx;
				}
			}

			.xun {
				justify-content: flex-end;
				position: absolute;
				right: 0;

				&>image {
					width: 30rpx;
					height: 30rpx;
					border-radius: 50%;
					margin-right: 20rpx;
				}
			}

			&>radio-group {
				width: 79%;
				color: #999999;

				&>radio {
					transform: scale(0.7);
				}
			}
		}

		.steplist {
			padding: 30rpx 0;

			.setpIndex {
				display: flex;
				font-size: 28rpx;
				align-items: center;

				&>view {
					width: 40rpx;
					height: 40rpx;
					line-height: 40rpx;
					text-align: center;
					border-radius: 50%;
					margin-right: 20rpx;
					background-color: #017ff0;
				}
			}

			.code {
				width: 100%;
				height: 180rpx;
				margin: 30rpx 0;
				position: relative;

				&>view {
					z-index: 2;
					width: 90rpx;
					height: 40rpx;
					font-size: 26rpx;
					line-height: 40rpx;
					text-align: center;
					background-color: #017ff0;
					border-radius: 0 20rpx 0 20rpx;
					position: absolute;
					left: 0;
					top: 0;
				}

				&>image {
					width: 180rpx;
					height: 180rpx;
				}
			}

			.ewms {
				display: flex;
				align-items: center;
				justify-content: flex-start;

				&>image:nth-child(3n+2) {
					margin: 0 80rpx;
				}
			}

			.copy {
				width: 75%;
				margin: 30rpx auto;

				&>view {
					border-radius: 10rpx;
				}

				&>view:first-child {
					width: 350rpx;
					height: 60rpx;
					color: #999999;
					font-size: 24rpx;
					padding: 0 20rpx;
					line-height: 50rpx;
					box-sizing: border-box;
					border: 2px solid #017ff0;
				}

				&>view:last-child {
					width: 150rpx;
					height: 60rpx;
					font-size: 28rpx;
					line-height: 60rpx;
					text-align: center;
					background-color: #017ff0;
				}
			}

			.phone {
				width: 600rpx;
				height: 60rpx;
				color: #999999;
				font-size: 24rpx;
				padding: 0 20rpx;
				line-height: 50rpx;
				margin: 30rpx auto;
				border-radius: 10rpx;
				box-sizing: border-box;
				border: 2px solid #017ff0;
			}

			.setpcont {
				margin: 30rpx 0;
				justify-content: space-around;

				&>view {
					width: 150rpx;
					height: 60rpx;
					font-size: 28rpx;
					text-align: center;
					line-height: 60rpx;
					border-radius: 10rpx;
				}

				&>view:first-child {
					background-color: #017ff0;
				}

				&>view:last-child {
					color: #017ff0;
					background-color: #FFFCF1;
				}
			}

			.operate {
				font-size: 26rpx;

				.operlist {
					display: flex;
					align-items: center;

					&>image {
						width: 40rpx;
						height: 40rpx;
						margin-right: 20rpx;
					}
				}
			}
		}

		.addbtn {
			width: 410rpx;
			color: #017ff0;
			font-size: 26rpx;
			font-weight: bold;
			position: relative;
			background: #FEF7D9;
			border-radius: 10rpx;
			padding: 22rpx 146rpx;
			box-sizing: border-box;
			margin: 40rpx auto 0 auto;
			border: 2rpx solid #017ff0;
		}

		.stepshow {
			width: 398rpx;
			height: 200rpx;
			margin: 0 auto;
			flex-wrap: wrap;
			font-size: 24rpx;
			background: #FFFFFF;
			padding: 26rpx 22rpx;
			box-sizing: border-box;
			box-shadow: 0 1rpx 3rpx 0 rgba(4, 0, 0, 0.5);
			position: absolute;
			bottom: -202rpx;
			left: 0;

			&>view {
				width: 40%;
				color: #333333;
				font-weight: 500;

				&>image {
					width: 25rpx;
					height: 25rpx;
					margin-right: 10rpx;
				}
			}
		}
	}

	/* 协议 */
	.protocol {
		display: flex;
		align-items: center;
		color: #999999;
		font-size: 24rpx;
		margin: 30rpx 20rpx;
		justify-content: flex-start;

		.protocol-checkbox {
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
				background: linear-gradient(135deg, #017ff0 0%, #4facfe 100%);
				border-color: #017ff0;
				box-shadow: 0 4rpx 12rpx rgba(1, 127, 240, 0.35);

				.checkmark {
					transform: translate(-50%, -60%) rotate(45deg) scale(1);
					opacity: 1;
					animation: checkBounce 0.3s cubic-bezier(0.4, 0, 0.2, 1);
				}
			}
		}

		.protocol-text {
			user-select: none;
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

	.releasebtn {
		z-index: 9;
		width: 100%;
		height: 98rpx;
		font-size: 30rpx;
		line-height: 98rpx;
		text-align: center;
		background: #017ff0;
		position: fixed;
		bottom: 0;
	}

	.tip {
		color: #017ff0;
		margin: 0 24rpx;
		font-size: 24rpx;
		line-height: 40rpx;
		margin-bottom: 20rpx;
	}

	/* 弹窗 */
	.mask {
		z-index: 99;
		background: rgba(0, 0, 0, 0.6);
		position: fixed;
		bottom: 0;
		right: 0;
		left: 0;
		top: 0;
	}

	.tip {
		&-content {
			z-index: 999;
			background: #FFFFFF;
			border-radius: 10rpx;
			overflow: hidden;
			position: fixed;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}

		&-container {
			padding: 30rpx;
		}

		&-tit {
			font-size: 26rpx;
			margin-bottom: 28rpx;

			&>image {
				width: 28rpx;
				height: 28rpx;
			}
		}

		&-del {
			z-index: 999;
			width: 480rpx;
			height: 300rpx;
			background: #FFFFFF;
			border-radius: 10rpx;
			overflow: hidden;
			position: fixed;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}

		&-top {
			display: flex;
			margin: 20rpx 0;
			font-size: 28rpx;
			align-items: center;
			justify-content: center;

			&>image {
				width: 30rpx;
				height: 30rpx;
				margin-right: 20rpx;
			}
		}

		&-titdel {
			display: flex;
			margin: 68rpx 0;
			font-size: 28rpx;
			align-items: center;
			justify-content: center;
		}

		&-btn {
			display: flex;
			font-size: 28rpx;

			&>view {
				width: 50%;
				height: 70rpx;
				line-height: 70rpx;
				text-align: center;
			}

			&>view:last-child {
				background-color: #017ff0;
			}
		}
	}

	.state {
		font-size: 28rpx;
		position: relative;

		&>textarea {
			width: 518rpx;
			height: 190rpx;
			padding: 22rpx;
			margin: 20rpx 0;
			font-size: 24rpx;
			line-height: 50rpx;
			border-radius: 10rpx;
			background-color: #EEEEEE;
		}

		&>text:last-child {
			color: #999999;
			font-size: 24rpx;
			position: absolute;
			bottom: 10rpx;
			right: 10rpx;
		}
	}

	.linkurl {
		font-size: 28rpx;

		&>input {
			width: 518rpx;
			font-size: 24rpx;
			margin-top: 20rpx;
			padding: 16rpx 22rpx;
			border-radius: 10rpx;
			background-color: #EEEEEE;
		}

		.upimg {
			display: flex;
			margin-top: 20rpx;
			align-items: center;

			&>view {
				width: 180rpx;
				height: 180rpx;
				font-size: 100rpx;
				text-align: center;
				line-height: 180rpx;
				background-color: #EEEEEE;

				&>image {
					width: 180rpx;
					height: 180rpx;
				}
			}

			&>view:nth-child(3n+2) {
				margin: 0 10rpx;
			}
		}
	}
</style>
