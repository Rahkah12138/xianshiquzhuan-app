(function (w) {
	function plusReady() {
		console.log("plusReady");
	};
	if (w.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	};
	var packName = null;
	var partyMethod = {
		/**
		 * 检查app是否安装
		 * @param  {String} pg 包名
		 * @return {Number} int 1 已安装，2 未安装
		 */
		isInstall: function (pg) {
			console.log("checkAppInstalled" + pg);
			this.packName = pg;
			var b = plus.runtime.isApplicationExist({
				pname: pg
			}) ? 1 : 2;
			console.log("checkAppInstalled  是否已安装 " + this.packName + b);
			return b;
		},
		/**
		 * 执行关闭退出相关逻辑
		 */
		exit: function () {

		},
		/**
		 * 打开app
		 * @param  {String} pg 包名
		 * @return {void}
		 */
		openApp: function (pg) {
			console.log('startApp' + pg);
			if (plus.os.name == "Android") {
				plus.runtime.launchApplication({
					pname: pg
				}, function (e) {
					alert("Open system default browser failed: " + e.message);
				});
			}
		}
	};
	w.partyMethod = partyMethod;
})(window);