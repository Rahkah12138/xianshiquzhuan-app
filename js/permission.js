/**
 * 权限申请工具类
 * 在申请权限前弹出说明用途的对话框，满足应用上架合规要求
 */

// 权限用途说明配置
const PERMISSION_PURPOSES = {
	// 相机权限
	'android.permission.CAMERA': {
		title: '相机权限申请',
		purpose: '用于拍摄任务反馈图片、上传头像等功能'
	},
	// 存储权限
	'android.permission.READ_EXTERNAL_STORAGE': {
		title: '存储权限申请',
		purpose: '用于选择和上传任务图片、保存分享海报等功能'
	},
	'android.permission.WRITE_EXTERNAL_STORAGE': {
		title: '存储权限申请',
		purpose: '用于保存分享海报、下载任务相关文件等功能'
	},
	// 定位权限
	'android.permission.ACCESS_FINE_LOCATION': {
		title: '定位权限申请',
		purpose: '用于推荐附近任务、验证任务地点等功能'
	},
	'android.permission.ACCESS_COARSE_LOCATION': {
		title: '定位权限申请',
		purpose: '用于推荐附近任务、验证任务地点等功能'
	},
	// 电话权限
	'android.permission.READ_PHONE_STATE': {
		title: '设备信息权限申请',
		purpose: '用于识别设备唯一标识，保障账号安全'
	},
	// 通讯录权限
	'android.permission.READ_CONTACTS': {
		title: '通讯录权限申请',
		purpose: '用于邀请好友功能'
	}
}

// 默认权限说明（当未配置特定权限时使用）
const DEFAULT_PURPOSE = {
	title: '权限申请',
	purpose: '该权限是应用正常运行所必需的'
}

/**
 * 申请权限前显示用途说明弹窗
 * @param {String} permission - 权限名称
 * @returns {Promise<Boolean>} - 用户是否同意申请
 */
function showPermissionPurpose(permission) {
	return new Promise((resolve) => {
		const info = PERMISSION_PURPOSES[permission] || DEFAULT_PURPOSE

		uni.showModal({
			title: info.title,
			content: info.purpose + '\n\n是否允许申请该权限？',
			confirmText: '允许',
			cancelText: '拒绝',
			success: (res) => {
				resolve(res.confirm)
			},
			fail: () => {
				resolve(false)
			}
		})
	})
}

/**
 * 请求单个权限（带用途说明）
 * @param {String} permission - 权限名称
 * @returns {Promise<Boolean>} - 是否获得权限
 */
async function requestPermission(permission) {
	// #ifdef APP-PLUS
	// 检查是否已有权限
	const hasPermission = plus.android.checkPermission(permission)
	if (hasPermission === 1) {
		return true // 已有权限
	}

	// 显示权限用途说明
	const userAgreed = await showPermissionPurpose(permission)
	if (!userAgreed) {
		return false // 用户拒绝申请
	}

	// 申请权限
	return new Promise((resolve) => {
		plus.android.requestPermissions(
			[permission],
			(result) => {
				if (result.granted && result.granted.includes(permission)) {
					resolve(true)
				} else {
					resolve(false)
				}
			},
			(error) => {
				console.error('权限申请失败:', error)
				resolve(false)
			}
		)
	})
	// #endif

	// #ifndef APP-PLUS
	return true
	// #endif
}

/**
 * 请求相机权限
 * @returns {Promise<Boolean>}
 */
function requestCameraPermission() {
	return requestPermission('android.permission.CAMERA')
}

/**
 * 请求存储权限
 * @returns {Promise<Boolean>}
 */
async function requestStoragePermission() {
	const read = await requestPermission('android.permission.READ_EXTERNAL_STORAGE')
	if (!read) return false
	const write = await requestPermission('android.permission.WRITE_EXTERNAL_STORAGE')
	return write
}

/**
 * 请求定位权限
 * @returns {Promise<Boolean>}
 */
function requestLocationPermission() {
	return requestPermission('android.permission.ACCESS_FINE_LOCATION')
}

/**
 * 请求设备信息权限
 * @returns {Promise<Boolean>}
 */
function requestPhoneStatePermission() {
	return requestPermission('android.permission.READ_PHONE_STATE')
}

/**
 * 选择图片前申请必要权限
 * @returns {Promise<Boolean>}
 */
async function requestImagePickPermissions() {
	// #ifdef APP-PLUS
	const camera = await requestCameraPermission()
	const storage = await requestStoragePermission()
	return camera && storage
	// #endif

	// #ifndef APP-PLUS
	return true
	// #endif
}

export default {
	requestPermission,
	requestCameraPermission,
	requestStoragePermission,
	requestLocationPermission,
	requestPhoneStatePermission,
	requestImagePickPermissions,
	showPermissionPurpose,
	PERMISSION_PURPOSES
}
