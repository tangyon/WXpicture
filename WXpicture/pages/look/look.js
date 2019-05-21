// pages/look/look.js
var util = require('../../utils/util.js')
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		touchX: '',
		touchY: '',
		url: '',
		arr: [],
		index: 0,
		count: 10,
		start: 0,
		id: '',
		lastTime: 0,
		imgHeight: '100%',
		imgWidth: '100%',
		left: 0,
		isSlide: true,
		classname: false,
		api:"",
		value:""
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		let that = this
		let data = options.data
		data = decodeURIComponent(data)
		data = JSON.parse(data)
		this.setData({
			arr: data.data,
			index: data.index,
			start: data.start,
			id: data.id,
			api:data.api,
			value:data.value
		})
		console.log(data.value)
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {
		wx.showLoading({
			title: '正在加载页面',
		})
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
		console.log("页面显示")
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {
		console.log("页面隐藏")
	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {
		console.log("页面卸载")
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	},
	dblclick() {},
	//监听页面滑动
	slide(e) {
		//隐藏保存按钮
		if(this.data.classname == true) {
			this.setData({
				classname: false
			})
		}

		this.setData({
			touchX: e.changedTouches[0].clientX,
			touchY: e.changedTouches[0].clientY
		});
	},
	end(e) {
		let x = e.changedTouches[0].clientX;
		let y = e.changedTouches[0].clientY;
		let w = this.data.touchX
		let s = this.data.touchY
		let direction = util.getTouchData(x, y, w, s)
		let width = wx.getSystemInfoSync().windowWidth
		console.log(this.data.isSlide,direction)
		//		左右移动图片
		if(this.data.isSlide == false) {
			if(direction == 'right' || direction == "left") {
				let left = this.data.left
				let Wpx = (x - w + left)
				if(Wpx >= 0) {
					Wpx = 0
				}
				if(Wpx <= -(1024 - width)) {
					Wpx = -(1024 - width)
				}
				console.log(Wpx)
				this.setData({
					left: Wpx
				})
			}

			return
		}
		//左右滑动切换图片
		if(direction == 'right') {

			let inde = this.data.index
			if(inde == 0) {
				inde = 0
			} else {
				inde -= 1
			}
			this.setData({
				index: inde
			})
		}
		if(direction == 'left') {
			let index = this.data.index
			let data = this.data.arr
			console.log(index)
			if(index >= data.length - 2) {
				console.log('需要请求数据了')
				let start=this.data.start+10
				console.log(start)
				this.setData({
					start:start,
				})
				this.setData({
					api:util.setApi(this)
				})
				util.post(this).then(res => {
					for(let ke in res) {
						data.push(res[ke])
					}
					this.setData({
						arr: data,
					})
					console.log(this.data.arr.length)
				})
			} 
				index++
			this.setData({
				index: index
			})
		}

	},
	upload() {
		wx.hideLoading()
	},
	previewImage(e) {
		let time = e.timeStamp
		let lastTime = this.data.lastTime
		let width = wx.getSystemInfoSync().windowWidth
		this.setData({
			lastTime: time
		})
		let mistiming = time - lastTime
//		双击
		if(mistiming < 300) {
			let left = -e.detail.x / width * (1024 - width)
			this.setData({
				lastTime: 0,
				isSlide: !this.data.isSlide,
				left: left
			})
			if(this.data.isSlide == false) {
				this.setData({
					imgHeight: "768px",
					imgWidth: "1024px",
				})
			} else {
				this.setData({
					imgHeight: "100%",
					imgWidth: "100%",
					left: 0
				})
			}

		}

	},
	//长按显示保存按钮
	longPress() {
		console.log('长按事件')
		this.setData({
			classname: true
		})
	},
	//点击保存图片
	save() {
		console.log("保存图片")
		wx.getSetting({
			success(res) {
				if(!res.authSetting['scope.writePhotosAlbum']) {
					wx.authorize({
						scope: 'scope.writePhotosAlbum',
						success() {
							console.log('授权成功')
						}
					})
				}
			}
		})
		let data=this.data.arr
		let index=this.data.index
		var imgSrc = data[index].img_1024_768?data[index].img_1024_768.img_1024_768:data[index].middleURL
		console.log(data[index])
		wx.downloadFile({
			url: imgSrc,
			success: function(res) {
				console.log(res);
				//图片保存到本地
				wx.saveImageToPhotosAlbum({
					filePath: res.tempFilePath,
					success: function(data) {
						wx.showToast({
							title: '保存成功',
							icon: 'success',
							duration: 2000
						})
					},
					fail: function(err) {
						console.log(err);
						if(err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
							console.log("当初用户拒绝，再次发起授权")
							wx.openSetting({
								success(settingdata) {
									console.log(settingdata)
									if(settingdata.authSetting['scope.writePhotosAlbum']) {
										console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
									} else {
										console.log('获取权限失败，给出不给权限就无法正常使用的提示')
									}
								}
							})
						}
					},
					complete(res) {
						console.log(res);
					}
				})
			}
		})
	}
})