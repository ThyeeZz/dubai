<template>
  <div id="app" class="fillcontain">
    <router-view />
    <transition name="fade">
      <div class="dialog-wrap" v-show="shareFlag">
        <div class="dialog-content">
          <div class="dialog-head">
            <i class="el-icon-close" @click="closeDialog"></i>
          </div>
          <div class="dialog-body">
            <p>打开微信扫码登录手机端页面</p>
            <div class="QRcode-wrap"><canvas id="QRCode"></canvas></div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { reqConfig, encryptKey } from "@/config/request";
import Cookie from "js-cookie";
import md5 from "md5";

export default {
  name: "App",
  data() {
    return {
      _beforeUnload_time: 0,
      xhr: null
    };
  },
  methods: {
    closeDialog() {
      this.$store.commit("setShareFlag", false);
    },
    getSignature(u, t, d, s, m) {
      if (m === "GET" || m === "DELETE") {
        let obj = d;
        let objStr = "";
        if (d) {
          for (let i in obj) {
            objStr += `&${i}=${obj[i]}`;
          }
          objStr = encodeURI(objStr.substr(1));
        } else {
          objStr = null;
        }

        let str = `FROM:${u}-(T:${t}-DATA:${objStr}|SECRET:${s})=${m}`;
        let signature = md5(str).toUpperCase();
        return signature;
      }
      let str = `FROM:${u}-(T:${t}-DATA:${JSON.stringify(d)}|SECRET:${s})=${m}`;
      let signature = md5(str).toUpperCase();
      return signature;
    },
    handleReolad() {
      let state = JSON.stringify(this.$store.state);
      window.sessionStorage.setItem("state", state);
    },
    handleLoad() {
      let state = JSON.parse(window.sessionStorage.getItem("state"));
      this.$store.replaceState(Object.assign({}, this.$store.state, state));
    },
    // beforeUnloadHandler() {
    //   this._beforeUnload_time = +new Date();
    // },
    // getData() {
    //   const _gap_time = +new Date() - this._beforeUnload_time;
    //   const { access_token, id } = this.userInfo;
    //   let timestamp = +new Date();
    //   const sysauth = this.getSignature(
    //     reqConfig.udid,
    //     timestamp,
    //     null,
    //     encryptKey,
    //     "DELETE"
    //   );
    //   var xhr = new XMLHttpRequest();
    //   xhr.open("DELETE", "api/auth/logout", false);
    //   xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    //   xhr.setRequestHeader("UDID", reqConfig.udid);
    //   xhr.setRequestHeader("TIME", timestamp);
    //   xhr.setRequestHeader("SYSAUTH", sysauth);
    //   xhr.setRequestHeader("AccessToken", access_token);
    //   xhr.setRequestHeader("UID", id);
    //   // xhr.send();
    //   this.xhr = xhr;

    // },
    // unloadHandler(e) {
    //   const _gap_time = +new Date() - this._beforeUnload_time;

    //   // //判断是窗口关闭还是刷新
    //   localStorage.setItem("time", _gap_time);
    //   if (_gap_time <= 5) {
    //     this.xhr.send();
    //     localStorage.setItem("test", "test2");
    //   }
    // }
  },
  mounted() {
    window.addEventListener("beforeunload", e => {
      this.handleReolad();
      // this.beforeUnloadHandler(e);
      // let userAgent = navigator.userAgent;
      // let isOpera = userAgent.indexOf("Opera") > -1;
      // if (isOpera) {
      //   //判断是否Opera浏览器
      //   return "Opera";
      // }
      // if (
      //   userAgent.indexOf("Firefox") > -1 ||
      //   userAgent.indexOf("Chrome") > -1
      // ) {
      //   this.unloadHandler();
      // } else if (
      //   userAgent.indexOf("compatible") > -1 &&
      //   userAgent.indexOf("MSIE") > -1 &&
      //   !isOpera
      // ) {
      //   e = e ? e : window.event ? window.event : null;
      //   var cy = e.clientY || e.target.event.clientY;
      //   var ak = e.altKey || e.target.event.altKey;
      //   if (cy < 0 || ak) {
      //     this.unloadHandler();
      //   }
      // }
    });
    // window.addEventListener("unload", async e => this.unloadHandler(e));
  },
  created() {
    this.handleLoad();
    // this.getData();
  },
  // destroyed() {
  //   window.removeEventListener("beforeunload", e => {
  //     this.handleReolad();
  //     this.beforeUnloadHandler(e);
  //   });
  //   window.removeEventListener("unload", e => this.unloadHandler(e));
  // },
  computed: {
    ...mapState(["shareFlag", "userInfo"])
  }
};
</script>

<style lang="scss">
@import "./style/common.scss";
#app {
  min-width: 1000px;
  overflow-x: auto;
}
.margin-bot {
  height: 40px;
  .el-form-item__label {
    margin-bottom: 1rem;
  }
}
.colorGreen {
  color: aqua;
}
.colorWhite {
  color: #fff;
}

.el-message {
  .el-message__icon {
    font-size: 16px;
  }
  .el-message__content {
    font-size: 16px;
  }
}
.el-time-panel__footer {
  display: flex;
  justify-content: flex-end;
}
.el-form-item__label {
  word-break: break-word;
}
.dialog-wrap {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  .dialog-content {
    width: 400px;
    height: 400px;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.4);
    background-color: #fff;
    box-sizing: border-box;
    padding: 25px;
    .dialog-head {
      height: 25px;
      text-align: right;
      font-size: 16px;
      i {
        cursor: pointer;
        &:hover {
          color: #409eff;
        }
      }
    }
    .dialog-body {
      height: calc(100% - 25px);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      p {
        font-size: 16px;
      }
      .QRcode-wrap {
        width: 200px;
        height: 200px;
        .QRCode {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.overFlow {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.el-table::before {
  height: 0 !important;
}
.el-table .cell {
  // word-wrap: break-word !important;
  word-break: normal;
  text-align: center;
}
#map_wrap {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}
.overFlow {
  .cell {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    word-break: normal !important;
  }
}
.el-select-dropdown__item {
  display: flex;
  align-items: center;
}
</style>
