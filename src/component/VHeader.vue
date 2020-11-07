<template>
  <div id="header">
    <div class="header-company">
      <img src="../assets/img/ete.png" alt />
      <span>Remote Health Check Monitoring</span>
    </div>
    <div class="header-nav">
      <p v-show="false">{{ onRouter }}</p>
      <ul>
        <li :class="{ active: n == 0 }" @click="goto(0);">
          <i class="synthesize"></i> <span>Platform</span>
        </li>
        <li :class="{ active: n == 1 }" @click="goto(1);">
          <i class="activity"></i> <span>Activity</span>
        </li>
        <li :class="{ active: n == 2 }" @click="goto(2);">
          <i class="sleep"></i> <span>Sleep</span>
        </li>
        <li :class="{ active: n == 3 }" @click="goto(3);">
          <i class="report"></i> <span>Reports</span>
        </li>
        <li :class="{ active: n == 4 }" @click="goto(4);" v-if="isShowSystem">
          <i class="system"></i> <span>System</span>
        </li>
      </ul>
    </div>
    <div class="header-admin">
      <span>Hi,{{ name || "Admin" }}</span>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">Logout</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { logout } from "@/api/api";
import QRCode from "qrcode";
import md5 from "md5";
export default {
  name: "VHeader",
  data() {
    return {
      n: 0,
      pathArr: ["synthesize", "activity", "sleep", "reports", "system"],
      showWarnningFlag: false,
      name: ""
    };
  },
  created() {
    const { name } = this.userInfo;
    this.name = name;
  },
  computed: {
    ...mapState(["username", "password", "userInfo"]),
    onRouter() {
      const { path } = this.$route;
      const { pathArr } = this;
      pathArr.forEach((item, index) => {
        if (path.indexOf(item) !== -1) {
          this.n = index;
        }
      });
      return path;
    },
    isShowSystem() {
      const { role } = this.userInfo;
      return role !== 1;
    }
  },
  methods: {
    ...mapMutations(["clearCatche"]),
    goto(n) {
      if (this.n != n) {
        this.n = n;
        let name = this.pathArr[n];
        this.$router.push({ name: name });
      }
    },
    handleCommand(command) {
      if (command === "logout") {
        logout()
          .then(res => {
            this.clearCatche();
            this.$router.push({ name: "login" });
          })
          .catch(err => {
            this.$router.push({ name: "login" });
            console.log(err);
          });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#header {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 1.26rem;
  background: rgba(7, 7, 49, 1);
  box-shadow: 9px 0px 24px rgba(0, 0, 0, 0.3);
  border-bottom: 2px solid #1e94ee;
  box-sizing: border-box;
  padding: 0 0.3rem;
}
.header-company {
  width: 7rem;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  img {
    width: 1.2rem;
    height: auto;
  }
  span {
    color: #fff;
    margin-left: 0.15rem;
    font-size: 0.28rem;
    letter-spacing: 2px;
  }
}
.header-nav {
  width: 8.9rem;
  height: 100%;
  ul {
    display: flex;
    justify-content: space-around;
    width: 100%;
    height: 100%;
    > li {
      box-sizing: border-box;
      padding-top: 0.15rem;
      // float: left;
      width: 1.27rem;
      height: 100%;
      font-size: 0.2rem;
      text-align: center;
      color: #46528f;
      cursor: pointer;
      &:hover {
        background-color: #1977f2;
        color: #fff;
        .synthesize {
          background-image: url("../assets/hicling/synthesize_hover.png");
        }
        .activity {
          background-image: url("../assets/hicling/activity_hover.png");
        }
        .sleep {
          background-image: url("../assets/hicling/sleep_hover.png");
        }
        .report {
          background-image: url("../assets/hicling/report_hover.png");
        }
        .system {
          background-image: url("../assets/hicling/system_hover.png");
        }
      }
    }
    .active {
      background-color: #1977f2;
      color: #fff;
      .synthesize {
        background-image: url("../assets/hicling/synthesize_hover.png");
      }
      .activity {
        background-image: url("../assets/hicling/activity_hover.png");
      }
      .sleep {
        background-image: url("../assets/hicling/sleep_hover.png");
      }
      .report {
        background-image: url("../assets/hicling/report_hover.png");
      }
      .system {
        background-image: url("../assets/hicling/system_hover.png");
      }
    }
  }
}
.header-admin {
  width: 2.7rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-right: 0.1rem;
  span {
    display: inline-block;
    font-size: 0.24rem;
    color: rgba(70, 82, 143, 1);
    max-width: 2.5rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin-right: 0.05rem;
  }
  .el-dropdown {
    width: 0.4rem;
  }
}
.synthesize {
  margin: 0 auto;
  display: block;
  width: 0.6rem;
  height: 0.6rem;
  background-image: url("../assets/hicling/synthesize.png");
  background-size: contain;
}
.activity {
  margin: 0 auto;
  display: block;
  width: 0.6rem;
  height: 0.6rem;
  background-image: url("../assets/hicling/activity.png");
  background-size: contain;
}
.sleep {
  margin: 0 auto;
  display: block;
  width: 0.6rem;
  height: 0.6rem;
  background-image: url("../assets/hicling/sleep.png");
  background-size: contain;
}
.report {
  margin: 0 auto;
  display: block;
  width: 0.6rem;
  height: 0.6rem;
  background-image: url("../assets/hicling/report.png");
  background-size: contain;
}
.system {
  margin: 0 auto;
  display: block;
  width: 0.6rem;
  height: 0.6rem;
  background-image: url("../assets/hicling/system.png");
  background-size: contain;
}
.el-dropdown-link {
  cursor: pointer;
  color: #fff;
}
.el-icon-arrow-down {
  font-size: 0.2rem;
  color: #fff;
}
.warnning_wrap {
  position: relative;
}
.warnTag {
  position: absolute;
  display: inline-block;
  width: 0.2rem;
  height: 0.2rem;
  background-color: #ff0000;
  border-radius: 50%;
  top: 0.1rem;
  right: 0.1rem;
  font-size: 0.16rem;
  line-height: 0.3rem;
  text-align: center;
  color: #fff;
}
</style>
