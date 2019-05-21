//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')
Page({
	data: {
		motto: 'Hello World',
		userInfo: {},
		hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
		nvb: [],
		arr: [],
		inde: 0,
		count: 10,
		start: 0,
		id: 36,
		url: '',
		value: null,
		api: "",
		cutApi: true,
		imgs:false,
		imgsnum:0
	},
	//事件处理函数
	bindViewTap: function() {
		wx.navigateTo({
			url: '../logs/logs'
		})
	},
	onLoad: function() {

		let that = this
		this.setData({
			start: this.random(),
		})
		this.setData({
			api: util.setApi(this),
		})
		that.getData(that)
		this.getDetails()
		if(app.globalData.userInfo) {
			this.setData({
				userInfo: app.globalData.userInfo,
				hasUserInfo: true
			})
		} else if(this.data.canIUse) {
			// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
			// 所以此处加入 callback 以防止这种情况
			app.userInfoReadyCallback = res => {
				this.setData({
					userInfo: res.userInfo,
					hasUserInfo: true
				})
			}
		} else {
			// 在没有 open-type=getUserInfo 版本的兼容处理
			wx.getUserInfo({
				success: res => {
					app.globalData.userInfo = res.userInfo
					this.setData({
						userInfo: res.userInfo,
						hasUserInfo: true
					})
				}
			})
		}
	},
	getUserInfo: function(e) {
		app.globalData.userInfo = e.detail.userInfo
		this.setData({
			userInfo: e.detail.userInfo,
			hasUserInfo: true
		})
	},
	// 获取分类导航条
	getData(that) {
		wx.showLoading({
			title: '真正玩命加载',
		})
		wx.request({
			url: 'https://api.mlwei.com/wallpaper/api/?cid=tags',
			success(res) {
				let data = res.data.data
				that.setData({
					nvb: data
				})
				wx.hideLoading()
			}
		})
	},
	//	切换分类
	seek(e) {
		let index = e.currentTarget.dataset.index
		let name = e.currentTarget.dataset.item.name
		let id = e.currentTarget.dataset.item.id

		this.setData({
			inde: index,
			id: id,
			start: this.data.start,
			cutApi: true
		})
		this.setData({
			api:util.setApi(this),
			arr: [],
			imgsnum:0
		})
		this.getDetails()
	},
	//	滑到到底部获取更多图片
	tolower(e) {
		if(this.data.imgs==false){
			return
		}
		let start = this.data.start + 10

		this.setData({
			start: start,
		})
		this.setData({
			api:util.setApi(this),
			imgs:false
			
		})
		this.getDetails()
	},
	// 查看大图
	look(e) {

		let index = e.currentTarget.dataset.index
		let data = JSON.stringify({
			data: this.data.arr,
			index,
			start: this.data.start,
			id: this.data.id,
			api: this.data.api,
			value:this.data.value
		})
		wx.navigateTo({
			url: '../look/look?data=' + encodeURIComponent(data)
		})
	},
	//调用封装的Promise请求图片数据
	getDetails() {
		util.post(this).then(res => {
			if(res.length == 0) {
				console.log("没有数据")
				this.setData({
					start: this.random()
				})
				this.getDetails()
			}
			let arr = this.data.arr
			for(let ke in res) {
				arr.push(res[ke])
			}
			this.setData({
				arr: arr
			})
		})
	},
	//随机数
	random() {
		let num = Math.round(Math.random() * 1000)
		return num
	},
	//搜索图片
	search(e) {
		console.log("搜索图片", this.data.value)
		this.setData({
			cutApi: false,
		})
		this.setData({
			start:this.random(),
			api: util.setApi(this),
			arr: [],
			imgsnum:0
		})
		this.getDetails()
	},
	input(e) {
		this.setData({
			value: e.detail.value
		})
	},
	upload(){
		let num=this.data.imgsnum+1
		this.setData({
			imgsnum:num
		})
//		console.log("加载")

		if(num>=this.data.arr.length-9){
			this.setData({
				imgs:true
			})
		}
		
	}
})