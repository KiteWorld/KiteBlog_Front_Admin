import Cookies from "js-cookie";
export default class socketService {
	constructor(url) {
		this.url = url
	}
	ws = null

	connected = false

	callBackMapping = {}

	sendRetryCount = 0

	connectRetryCount = 0

	connectLimtCount = 0

	connect() {
		this.ws = new WebSocket(this.url, [
			Cookies.get("token"),
		]);
		// this.ws = new WebSocket(this.url);

		this.ws.onopen = () => {
			console.log("WebSocket 服务器链接成功！")
			this.connected = true
			this.connectRetryCount = 0
		};

		this.ws.onmessage = (evt) => {
			const data = JSON.parse(evt.data)
			const socketType = data.socketType
			if (this.callBackMapping[socketType]) {
				this.callBackMapping[socketType](data)
			}
		};
		this.ws.onclose = () => {
			console.log("WebSocket 断开！");
			// 限制重新连接次数
			// if (this.connectRetryCount > this.connectLimtCount) {
			// 	console.log("重试连接已经超过指定次数，请检查服务器是否正常")
			// 	return
			// }
			this.connected = false
			this.connectRetryCount++
			setTimeout(() => {
				console.log(`第${this.connectRetryCount}次尝试重新连接服务器`)
				this.connect()
			}, this.connectRetryCount * 500)
		};
	}
	registerCallback(socketType, callback) {
		this.callBackMapping[socketType] = callback
	}
	send(data) {
		if (this.connected) {
			this.sendRetryCount = 0
			this.ws.send(JSON.stringify(data))
		} else {
			this.sendRetryCount++
			setTimeout(() => {
				this.send(data)
			}, this.sendRetryCount * 500)
		}
	}
}