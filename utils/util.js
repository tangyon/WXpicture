const formatTime = date => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()

	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}

const getTouchData = (endX, endY, startX, startY) => {
	console.log(endX - startX,endY - startY)
	let turn = "";
	if(endX - startX > 50 && Math.abs(endY - startY) < 50) { //右滑
		turn = "right";
	} else if(endX - startX < -50 && Math.abs(endY - startY) < 50) { //左滑
		turn = "left";
	}
//	console.log(turn)
	return turn;
}

const post = (that) => {
	let count = that.data.count
	let id = that.data.id
	let start = that.data.start
	let arr = that.data.arr
	let api=that.data.api
	let promise = new Promise(function(resolve, reject) {
		wx.request({
			url: api,
			success(res) {
				let data=res.data.data
				if(data.length>10){
					data.pop()
				}
				resolve(data)
			}
		})

	})
	wx.hideLoading()
	return promise
}
const setApi= (that) => {
		let api1 = `https://api.mlwei.com/wallpaper/api/?cid=${that.data.id}&start=${that.data.start}&count=${that.data.count}`
		let api2 = `https://image.baidu.com/search/acjson?tn=resultjson_com&ipn&word=${that.data.value}&pn=${that.data.start}&rn=10`
		let api = that.data.cutApi == true ? api1 : api2
		console.log(api,that.data.cutApi )
		return api
	}

module.exports = {
	formatTime: formatTime,
	getTouchData: getTouchData,
	post: post,
	setApi:setApi
}

