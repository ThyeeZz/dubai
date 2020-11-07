<template>
  <div class="login-wrapper" v-loading="loading">
    <div class="header-bar"><img src="../assets/img/ete.png" alt="ETE" /></div>
    <div class="title-bar">
      Remote Health Check and Activity Monitoring Is Our Mission
    </div>
    <div class="login-content">
      <div class="login-content-left">
        <p class="device">ETE-TH07 Bracelet</p>
        <img src="../assets/img/login-bg2.png" alt="ETE device" />
      </div>
      <div class="login-content-right">
        <div class="title">ETE Dashboard Login</div>
        <div class="login-form">
          <div class="username">
            <p class="icon"></p>
            <input type="text" class="input" v-model="username" />
          </div>
          <div class="password" @keydown.enter="onLogin">
            <p class="icon"></p>
            <input type="password" class="input" v-model="password" />
          </div>
          <div class="login-button" @click="onLogin">CLICK HERE TO ENTER</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations } from "vuex";
import md5 from "md5";
import { getTokenInfo } from "@/lib/utils";
import { logout } from "@/api/api";
export default {
  name: "Login",
  data() {
    return {
      loading: false,
      username: "",
      password: ""
    };
  },
  methods: {
    ...mapActions([
      "login",
      "getSimpleDeparts",
      "getServerList",
      "getCompanyList",
      "getActiveNum",
      "getBeaconList",
      "getRoleList",
      "getAreaList"
    ]),
    onLogin() {
      let loginInfo = {
        username: this.username,
        password: md5(this.password).toUpperCase()
      };
      // const {id,access_token} = getTokenInfo()
      // logout().then(res=>{
      //   console.log(res)
      // })

      this.loading = true;
      this.login(loginInfo)
        .then(() => {
          // 获取各项简单列表 方便后续的直接使用，减少http请求
          const { id } = this.$store.state.userInfo;
          const p1 = this.getSimpleDeparts();
          const p2 = this.getServerList();
          const p3 = this.getCompanyList();
          const p4 = this.getBeaconList();
          const p5 = this.getRoleList();
          const p6 = this.getAreaList();
          // const p6 = this.getActiveNum(id);
          Promise.all([p1, p2, p3, p4, p5, p6])
            .then(() => {
              this.loading = false;
              this.$router.push({
                path: "/index/synthesize"
              });
            })
            .catch(err => {
              this.loading = false;
              console.log(err);
            });
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.login-wrapper {
  width: 100%;
  height: 100%;
  min-width: 800px;
  background: url("http://94.201.123.152:8091/pictures/sys/background/login-bg.jpg") center center no-repeat;
  background-size: cover;
  font-size: 16px;
  .header-bar {
    height: 1.5rem;
    box-sizing: border-box;
    padding: 0.25rem 0.25rem;
    img {
      height: 1rem;
    }
  }
  .title-bar {
    height: 1rem;
    color: #fff;
    font-size: 0.42rem;
    text-align: center;
    line-height: 1rem;
    font-weight: bold;
  }
  .login-content {
    height: 3.5rem;
    width: 8rem;
    display: flex;
    margin: 0.8rem auto;
    justify-content: space-between;
    color: #fff;
    .login-content-left {
      width: 3.8rem;
      box-sizing: border-box;
      padding: 0.1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      .device {
        height: 0.5rem;
        line-height: 0.5rem;
        text-align: center;
        font-size: 0.32rem;
        margin-bottom: 0.3rem;
      }
      img {
        width: 3rem;
        height: auto;
      }
    }
    .login-content-right {
      box-sizing: border-box;
      width: 3.8rem;
      height: 3.5rem;
      padding: 0.1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 0 0 auto;
      .title {
        height: 0.5rem;
        line-height: 0.5rem;
        text-align: center;
        font-size: 0.32rem;
        margin-bottom: 0.3rem;
      }
      .login-form {
        width: 3.5rem;
        height: 2.7rem;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        .icon {
          width: 0.5rem;
          height: 0.5rem;
        }
        .input {
          width: 2.5rem;
          height: 0.5rem;
          box-sizing: border-box;
          padding: 0 0.2rem;
          outline: none;
          border-width: 1px;
          border-style: solid;
          border-color: transparent transparent #999 transparent;
          background-color: rgba(0, 0, 0, 0);
          font-size: 0.22rem;
          color: #fff;
        }
        .username {
          box-sizing: border-box;
          padding: 0 0.15rem;
          height: 0.5rem;
          width: 3.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .icon {
            background: url("../assets/img/login-username.png") center center
              no-repeat;
            background-size: cover;
          }
        }
        .password {
          box-sizing: border-box;
          padding: 0 0.15rem;
          height: 0.5rem;
          width: 3.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .icon {
            background: url("../assets/img/login-pass.png") center center
              no-repeat;
            background-size: cover;
          }
        }
        .login-button {
          height: 0.5rem;
          line-height: 0.5rem;
          width: 3.5rem;
          text-align: center;
          letter-spacing: 0.05rem;
          cursor: pointer;
          font-size: 0.22rem;
        }
      }
    }
  }
}
</style>
