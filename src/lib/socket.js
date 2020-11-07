// 报警广播
export class AlarmSocket {
  constructor() {
    this.socket = null;
  }

  init(wsURI, onMessage) {
    // 实例化socket
    this.socket = new WebSocket(wsURI);
    // 监听数据
    this.socket.onmessage = onMessage;
    // 监听socket连接
    this.socket.onopen = this.open;
    // 监听socket错误信息
    this.socket.onerror = this.error;
    // 监听socket关闭
    this.socket.onclose = this.close;
    // 监听socket发送
    this.socket.onsend = this.send;
  }

  open() {
    //连接建立之后执行send方法发送数据
    console.log('建立连接')
  }
  error(e) {
    //连接建立失败重连
    console.log(e + 'error')
  }
  send(Data) {
    //数据发送
    console.log('发送数据')
    this.socket.send(Data);
  }
  close(e) {
    //关闭
    console.log("实时报警socket断开连接");
  }
}


// 实时活动广播
export class ActSocket {
  constructor() {
    this.socket = null
  }

  // socket
  init(wsURI, onMessage) {
    // 实例化socket
    this.socket = new WebSocket(wsURI);
    // 监听数据
    this.socket.onmessage = onMessage;
    // 监听socket连接
    this.socket.onopen = this.open;
    // 监听socket错误信息
    this.socket.onerror = this.error;
    // 监听socket关闭
    this.socket.onclose = this.close;
  }
  open() {
    //连接建立之后执行send方法发送数据
    let actions = {
      test: "12345"
    };
  }
  error(e) {
    //连接建立失败重连
    console.log(e + 'error')
  }
  send(Data) {
    //数据发送
    this.websock.send(Data);
  }
  close(e) {
    //关闭
    console.log("实时活动socket断开连接");
  }
}
