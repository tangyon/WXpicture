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
		api: "",
		value: "",
		cutApi: "",
		top: 0,
		imgw: "",
		imgh: ""
	},

	//	 生命周期函数--监听页面加载

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
			api: data.api,
			value: data.value,
			cutApi: data.cutApi
		})

	},
	//	生命周期函数--监听页面初次渲染完成
	onReady: function() {
		wx.showLoading({
			title: '正在加载页面',
		})

	},
	//	 生命周期函数--监听页面显示

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
		if(this.data.isSlide == false) {
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
			if(index >= data.length - 2) {
				console.log('需要请求数据了')
				let start = this.data.start + 10
				console.log(start)
				this.setData({
					start: start,
				})
				this.setData({
					api: util.setApi(this)
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
	//	图片加载完成
	upload() {
		console.log('图片加载完成')
		wx.hideLoading()
		let that = this
		let url = this.data.arr[this.data.index].img_1024_768 ?
			this.data.arr[this.data.index].img_1024_768 :
			this.data.arr[this.data.index].middleURL
			console.log(url)
		wx.getImageInfo({
			src: url,
			success(res) {
				let w = res.width
				let h = res.height
				console.log(w, h)
				that.setData({
					imgw: w,
					imgh: h,
					imgWidth: '100%',
					imgHeight: '100%',
				})
				console.log('imgw',that.data.imgw)
			},
			fail(res) {}
		})
	},
	previewImage(e) {
		let that = this
		let time = e.timeStamp
		let lastTime = this.data.lastTime
		let width = wx.getSystemInfoSync().windowWidth
		let height = wx.getSystemInfoSync().windowHeight
		this.setData({
			lastTime: time
		})
		let mistiming = time - lastTime
		//		双击
		if(mistiming < 300) {

			if(this.data.isSlide == true) {

				if(this.data.cutApi == true) {
					console.log('获取图片大小')
					let url = this.data.arr[this.data.index].img_1024_768 ?
						this.data.arr[this.data.index].img_1024_768 :
						this.data.arr[this.data.index].middleURL
					wx.getImageInfo({
						src: url,
						success(res) {
							let w = res.width + 'px'
							let h = res.height + 'px'
							console.log(w, h)
							let left = -e.detail.x* (res.width/width)+e.detail.x
							let top = -e.detail.y * (height /res.height )+e.detail.y
							console.log(left, top)
							that.setData({
								imgWidth: w,
								imgHeight: h,
								left: left,
								top: top
							})
						},
						fail(res) {
							console.log(res)
						}
					})
				} else if(this.data.cutApi == false) {
					let left = 0
					let top = 0
					console.log('杨幂',height - e.detail.y)
					console.log(e.detail.y > (height / 2))
					console.log(e.detail.y < (height / 2))
					console.log(e.detail.y == (height / 2))
					console.log(top)
					if(e.detail.y > (height / 2)) {
						top = -e.detail.y
					} 
					if(e.detail.y <( height / 2)) {
						top = height - e.detail.y
						
					} 
					if(e.detail.y == (height / 2)) {
						top = 0
					}
					left = -e.detail.x
					console.log(top)
					this.setData({
						imgHeight: '200%',
						imgWidth: '200%',
						top: top,
						left: left
					})
				}

			}
			//			再次双击缩小
			else {
				console.log('缩小')
				this.setData({
					imgHeight: '100%',
					imgWidth: '100%',
					left: 0,
					top: 0
				})
			}
			this.setData({
				lastTime: 0,
				isSlide: !this.data.isSlide,
			})
		}

	},
	//长按显示保存按钮
	longPress() {
		this.setData({
			classname: true
		})
	},
	//点击保存图片
	save() {
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
		
		let data = this.data.arr
		let index = this.data.index
		var imgSrc = data[index].img_1024_768 ? data[index].img_1024_768: data[index].middleURL
		console.log(imgSrc)
		wx.downloadFile({
			url: imgSrc,
			type:"http",
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
				})
			}
		})
	},
	touchMoveChange(e) {
		if(this.data.isSlide == true) {
			return
		}
		let x = e.changedTouches[0].clientX
		let y = e.changedTouches[0].clientY
		let width = wx.getSystemInfoSync().windowWidth
		let height = wx.getSystemInfoSync().windowHeight
		let box = 1024 / width * 5
		let left = this.data.left
		let top = this.data.top
		let w = this.data.imgWidth
		let h = this.data.imgHeight
		console.log('最多移动', (width * 2 - width), width)
		console.log(this.data.cutApi)
		if(this.data.cutApi == true) {
			w = parseInt(w)
			h = parseInt(h)
			console.log("高", width - w)
			if(left >= 0) {
				left = 0
			}
			if(left <= width - w) {
				left = width - w
			}
			if(top <= height - h) {
				top = height - h
			}
			if(top > h - height) {
				top = h - height
			}

		} else if(this.data.cutApi == false) {
			if(left >= 0) {
				left = 0
			}
			if(left <= -width) {
				left = -width
			}
			if(top <= -height) {
				top = -height
			}
			if(top > height) {
				top = height
			}

		}
		if(this.data.touchX - x > 1) {
			x = left - box
		} else if(this.data.touchX - x < 1) {
			x = left + box
		}
		if(this.data.touchY - y < 1) {
			top = top + box
		} else if(this.data.touchY - y > 1) {
			top = top - box
		}
		console.log("top", top, "left", left)
		this.setData({
			left: x,
			top: top
		})
	},
	//分享图片
	//onMenuShareTimeline分享到朋友圈
	//onMenuShareAppMessage分享给朋友
	share() {
		var that = this;
		let url = this.data.arr[this.data.index].img_1024_768 ?
			this.data.arr[this.data.index].img_1024_768 :
			this.data.arr[this.data.index].middleURL
		console.log('分享图片', url)
	}
})

