import {
  myConfirm
} from "@/lib/utils";

// 实时活动页面
export const actForActive = {
  data() {
    return {
      socket: null
    }
  },
  methods: {
    // socket
    init(wsURI) {
      // 实例化socket
      this.socket = new WebSocket(wsURI);
      // 监听socket连接
      this.socket.onopen = this.open;
      // 监听socket错误信息
      this.socket.onerror = this.error;
      // 监听socket消息
      this.socket.onmessage = this.getMessage;
      // 监听socket关闭
      this.socket.onclose = this.close;
    },
    open() {
      //连接建立之后执行send方法发送数据
      let actions = {
        test: "12345"
      };
    },
    error() {
      //连接建立失败重连
      console.log("连接错误");
      myConfirm("Socket connection error, try to reconnect?", this.init, 'You can check whether the network connection is normal or contact the background！');
    },
    send(Data) {
      //数据发送
      this.websock.send(Data);
    },
    close(e) {
      //关闭
      console.log("实时活动socket断开连接");
    }
    
  }
}
