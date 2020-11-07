<template>
  <div id="RealtimeActivity">
    <div class="mian-left">
      <div class="firstContent">
        <div class="search">
          <div class="search-box">
            <input
              type="text"
              placeholder="Please input name or userid"
              v-model.trim="keyword"
              @input="search"
            />
            <i class="el-icon-search" @click="search"></i>
          </div>
          <div class="select-box">
            <el-select v-model="doctorId" @change="changeWsURI">
              <el-option
                v-for="item in socketList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="result">
          <ul>
            <li>
              <span>Name</span>
              <span v-fullyDisplay>{{ member.name ? member.name : "--" }}</span>
            </li>
            <li>
              <span>Age</span> <span>{{ member.age ? member.age : 0 }}</span>
            </li>
            <li>
              <span>Phone</span>
              <span v-fullyDisplay>{{
                member.phone ? member.phone : "--"
              }}</span>
            </li>
            <li>
              <span>IDCard</span>
              <span>{{ member.idcard ? member.idcard : "--" }}</span>
            </li>
            <li>
              <span>Address</span>
              <span v-fullyDisplay>{{ member.address || "--" }}</span>
            </li>
            <li>
              <span>Temp</span> <span>{{ member.bodyTemp }}</span>
            </li>
            <li>
              <span>HR</span> <span>{{ getHr }}</span>
            </li>
            <li>
              <span>BP</span> <span>{{ getBp }}</span>
            </li>
            <li>
              <span>Steps</span>
              <span>{{ member.steps ? member.steps : 0 }}</span>
            </li>
            <li>
              <span>Total CAL</span>
              <span>{{ member.totalCal ? member.totalCal : 0 }}</span>
            </li>
          </ul>
          <!-- 左侧信息展示板 -->
          <div class="left-showbord">
            <active-multiple :member="member" @showMap="showMap" />
          </div>
        </div>
      </div>
      <div class="secondContent">
        <div class="title-box">
          <p class="flex-center">
            <span class="heart-small"></span> <span>Real Time Alarm</span>
          </p>
        </div>
        <div class="report-left">
          <real-time-alarm :alarmMap="alarmMap" :alert="alert_address" />
        </div>
      </div>
    </div>

    <div class="main-right">
      <div class="mb-wrapper">
        <active-multiple
          v-for="(member, subIndex) in userlist_after_cut[currentPage]"
          :member="member"
          :index="subIndex"
          class="mb"
          :key="subIndex"
          @showMap="showMap"
          @choose="choose(subIndex);"
        />
      </div>
      <div class="pagination">
        <el-button type="primary" @click="go(1);">First</el-button>
        <el-button type="primary" @click="goPrivious">
          <i class="el-icon-caret-left"></i>
        </el-button>
        <el-button type="primary" @click="goNext">
          <i class="el-icon-caret-right"></i>
        </el-button>
        <div class="input-wrapper">
          <p>Goto：</p>
          <el-input v-model="somePage">
            <template slot="append"
              >/{{ total }}</template
            >
          </el-input>
        </div>
        <el-button type="primary" @click="go(somePage);">Go</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import ActiveMultiple from "@/component/ActiveMultiple";
import RealTimeAlarm from "@/component/RealTimeAlarm";
import { actForActive } from "@/mixin";
import { mapMutations, mapState, mapActions } from "vuex";
import {
  getAlarmType,
  getTime,
  formatH_M_S,
  deepClone,
  getFixedCoordinates,
  defaultMember
} from "@/lib/utils";
import { getHealthInfo } from "@/api/api";
import { AlarmSocket, ActSocket } from "@/lib/socket";
export default {
  name: "RealtimeActivity",
  components: {
    ActiveMultiple,
    RealTimeAlarm
  },
  // mixins: [actForActive],
  data() {
    return {
      member: defaultMember,
      renderList: [], // 主要渲染的List 是由userList 根据部门筛选后得出的
      doctorId: 0,
      isSetMember: true, // 是否讲member设置为广播排序的第一个人
      currentPage: 0,
      somePage: 1,
      userlist_after_cut: [],
      actSocket: null,
      renderMap: new Map(),
      alarmMap: new Map(),
      keyword: "", // 搜索关键字
      alert_address: ""
    };
  },

  methods: {
    ...mapMutations(["saveLeaveDprtId"]),
    ...mapActions(["getHealthData"]),
    getActMessage(e) {
      //数据接收
      try {
        if (e.data) {
          const resdata = JSON.parse(e.data);
          let renderList = [...this.renderList];
          let member = { ...this.member };

          resdata.forEach(item => {
            let obj = this.renderMap.get(item.mac);
            if (obj) {
              obj.time = item.t ? item.t : 0;
              const { coordinate, positionName } = getFixedCoordinates(
                item.gt,
                this.beaconSimpleList
              );
              // 网关的自定义名称
              // 写在判断之外，因为用户离场再进场出现了 online但是位置unknown的情况
              obj.positionName = positionName;
              if (obj.canBeChanged) {
                // 新需求：如果对象的 canBeChanged 为false  保持其目前状态
                // 可能广播中的的用户不在该部门下 所以需要判断一下
                const {
                  alarmType,
                  alarmTypeCn,
                  bodyTempMakeUp,
                  wristTempMakeUp,
                  calories
                } = getAlarmType(item.cl, obj.deviceId, item.hr, obj.workTime);
                // 网关的坐标
                obj.coordinates =
                  item.lng === 0
                    ? coordinate
                    : {
                        lat: item.lat,
                        lng: item.lng
                      };
                obj.alarmType = alarmType;
                obj.totalCal =
                  item.gt === "APP" ? Math.round(item.cl) : calories;

                obj.hbp = item.hbp;
                obj.lbp = item.lbp;
                obj.mac = item.mac;
                obj.steps = item.st;

                obj.bodyTemp = this.getBodyTemp(
                  item.lbp,
                  obj.deviceId,
                  bodyTempMakeUp
                );
                obj.wristTemp = this.getWristTemp(
                  item.hbp,
                  obj.deviceId,
                  wristTempMakeUp
                );
                // 此处根据广播选择目标的 canBeChanged 是否为 true
                this.isTargetStatusCanBeChanged(obj);
              }
              if (member.clingId == obj.clingId) {
                member.position = obj.position;
                member.hr = obj.hr;
                member.hbp = obj.hbp;
                member.lbp = obj.lbp;
                member.totalCal = obj.totalCal;
                member.steps = obj.steps;
                member.bodyTemp = obj.bodyTemp;
                member.wristTemp = obj.wristTemp;
                member.alarmType = obj.alarmType;
              }
              this.renderMap.set(item.mac, obj);
            }
          });
          this.renderList = [...this.renderMap.values()]; //讲Map对象转换为渲染数组
          [].forEach.call(this.renderList, item => {
            this.renderMap.set(item.mac, item);
          });
          this.member = { ...member };
          this.sortFunc(this.renderList);
          this.isSetMember &&
            (this.member = this.userlist_after_cut[this.currentPage][0]);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 获取温度函数
    getBodyTemp(lbp, deviceId, bodyMakeUp) {
      let bodyTemp;
      if (deviceId === "ETE" || deviceId === "Thermo") {
        bodyTemp = ((lbp * 2 + parseInt(bodyMakeUp)) / 10).toFixed(1);
      } else {
        bodyTemp = "--";
      }
      return bodyTemp;
    },
    getWristTemp(hbp, deviceId, wristMakeUp) {
      let wristTemp;
      if (deviceId === "ETE" || deviceId === "Thermo") {
        wristTemp = (hbp * 2 + parseInt(wristMakeUp)) / 10;
      } else {
        wristTemp = "--";
      }
      return wristTemp;
    },
    // 搜索
    search() {
      let { keyword } = this;
      keyword = keyword.toLowerCase();
      let tempList = this.renderList.filter(item => {
        let { name, clingId } = item;
        return (
          name.toLowerCase().indexOf(keyword) !== -1 ||
          clingId.toString().indexOf(keyword) !== -1
        );
      });

      this.userlist_after_cut =
        tempList.length !== 0 ? this.cutUserList(tempList, 12) : [];
    },
    //选择
    choose(index) {
      this.member = this.userlist_after_cut[this.currentPage][index];
      this.isSetMember = false;

      // 是否可以被广播改变状态
      let { mac } = this.userlist_after_cut[this.currentPage][index];
      let obj = this.renderMap.get(mac);
      if (obj) {
        obj.canBeChanged = true;
        obj.alarmType = 6;
      }
      this.renderMap.set(mac, obj);
    },
    // 对人员排序并且查看用户online与否，30000ms内未上传该用户信息视为offline
    sortFunc(target) {
      let time = new Date().getTime();
      for (let i of target) {
        i.position = time - i.time < 180000 ? 1 : 0;
        if (i.position === 0) {
          i.positionName = "Unknown";
        }
      }
      target.sort((x, y) => {
        if (x.position == y.position) {
          if (x.alarmType == y.alarmType) {
            return y.bodyTemp - x.bodyTemp;
          } else {
            return x.alarmType - y.alarmType;
          }
        } else {
          return y.position - x.position;
        }
      });

      this.userlist_after_cut = this.cutUserList(target, 12);
      this.userlist_after_cut_copy = [...this.userlist_after_cut];
    },
    closeSocket() {
      if (this.actSocket) {
        this.actSocket.socket.close();
        this.actSocket.socket = null;
        this.actSocket = null;
      }
    },
    // 切换socket后，重新指定渲染List，重新渲染整个；
    changeWsURI(arg) {
      const { id, address, alert } = this.socketList.find(
        item => item.id === arg
      );

      this.doctorId = id;
      this.renderByDepart();

      if (this.actSocket) {
        this.actSocket.socket.close();
        this.actSocket.socket = null;
      }
      this.alert_address = alert;
      this.actSocket.init(address, this.getActMessage);
    },
    // 根据部门显示人员
    // 获取到渲染list之后，并对renderList进行首次排序
    // 首次排序后，连接socket，socket每次接收到数据后更新渲染List，并对更新后的List重新排序和验证位置信息
    renderByDepart() {
      const { userList } = this;
      this.alarmData = [];
      this.renderMap = new Map();
      this.alarmMap = new Map();

      this.renderList = userList.filter(
        item => item.doctorId === this.doctorId
      );

      let renderList1 = deepClone(this.renderList, []);
      let renderList2 = deepClone(this.renderList, []);

      [].forEach.call(renderList1, item => {
        this.renderMap.set(item.mac, item);
      });
      [].forEach.call(renderList2, item => {
        this.alarmMap.set(item.mac, item);
      });

      // 获得 rendrlist 先进行一次排序
      this.sortFunc(this.renderList);

      this.member =
        this.userlist_after_cut[this.currentPage][0] || defaultMember;
    },
    // 将整个userList 切割成 每12个一个的二维数组
    cutUserList(target, num) {
      let result = [];
      let target1 = [...target];
      while (target1.length > 12) {
        let cut = target1.splice(0, 12);
        result.push(cut);
      }
      result.push(target1);
      return result;
    },
    goNext() {
      if (this.currentPage < this.userlist_after_cut.length - 1) {
        this.currentPage++;
        this.somePage++;
        this.member = this.userlist_after_cut[this.currentPage][0];
      }
    },
    goPrivious() {
      if (this.currentPage > 0) {
        this.currentPage--;
        this.somePage--;
        this.member = this.userlist_after_cut[this.currentPage][0];
      }
    },
    go(val) {
      let x = parseInt(val);
      if (x > 0 && x <= this.userlist_after_cut.length) {
        this.currentPage = val - 1;
        this.member = this.userlist_after_cut[val - 1][0];
      } else {
        // 超出范围怎么办
      }
    },
    /*
     无理取闹的新需求：某用户产生了报警之后，不再根据广播改变其实时状态，
     必须点击该用户豆腐块之后才可以根据广播改变其状态，
     也就是说如果某用户在持续报警过程中点击实际上是没有效果的，因为持续报警回一直将
     该用户 ”是否可被更改状态“ 置为false ,直到用户离开报警状态再点击，此用户才可以被广播改变状态
     这个问题已经再会议中告知老板，希望不要再让我改回去！
    */

    isTargetStatusCanBeChanged(target) {
      // 1-5 为报警，6为正常状态
      let { alarmType } = target;
      if (alarmType !== 6) {
        target.canBeChanged = false;
      } else {
        target.canBeChanged = true;
      }
    },
    showMap(val) {
      this.$mapping.show(val.coordinates, val.positionName);
    }
  },
  beforeDestroy() {
    this.closeSocket();
  },
  mounted() {
    window.onbeforeunload = e => {
      //监听页面刷新，离开 主动断开socket
      this.closeSocket();
    };
  },
  created() {
    this.actSocket = new ActSocket(); // 实例化广播
    const { alert_address, ws_servers } = this.userInfo;
    this.socketList = [...ws_servers];

    this.getHealthData().then(res => {
      this.userList = [...res];
      this.renderByDepart();
    });

    this.userlist_after_cut =
      (sessionStorage.getItem("testCache") &&
        JSON.parse(sessionStorage.getItem("testCache"))) ||
      [];

    // this.saved_deprtId  储存再vuex中的 部门ID
    // 初次进入的h时，saved_doctorId = undefined;
    let doctorId = this.saved_deprtId || ws_servers[0].id;
    // 由于权限限制，需要判断保存的部门id是否在改账号的显示范围内
    // 否则会出现0部门的情况
    const target = ws_servers.find(item => item.id === doctorId);
    const { address, id, alert } = target || ws_servers[0];

    this.doctorId = id;
    this.alert_address = alert;

    // 实例化 广播
    this.actSocket.init(address, this.getActMessage);
  },
  computed: {
    ...mapState(["userInfo", "beaconSimpleList", "saved_deprtId"]),
    total() {
      return this.userlist_after_cut.length;
    },
    getHr() {
      const { hr, deviceId } = this.member;
      if (deviceId === "Aura" || deviceId === "Leap") {
        return hr ? hr : 0;
      } else {
        return "--";
      }
    },
    getBp() {
      const { lbp, hbp, deviceId } = this.member;
      if (deviceId === "Aura" || deviceId === "Leap") {
        return `${hbp} / ${lbp}`;
      } else {
        return "--";
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    /*
      客户需要重新进入activity、sleep 页面时显示离开时的部门信息；
      因为离开页面需要关闭广播，以免重新进入时无法连接广播；
      如果keepalive了，无法确定广播的状态，可能会影响广播断开与连接；
      使用路由组件是为了先保存再离开， beforeDestory 会将路由进入与
      储存部门ID同步进行，无法实现该需求
    */
    this.saveLeaveDprtId(this.doctorId);
    // 离开时尝试缓存数据
    window.sessionStorage.setItem(
      "testCache",
      JSON.stringify(this.userlist_after_cut)
    );
    next();
  }
};
</script>
<style lang="scss" scoped>
@import "../style/minix.scss";
#RealtimeActivity {
  display: flex;
  padding: 0.23rem 0.2rem 0.26rem;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  color: #fff;
  font-size: 0.2rem;
  background-color: #030318;
  .mian-left {
    width: 7.94rem;
    .secondContent /deep/ {
      margin-top: 0.2rem;
      height: 5rem;
      width: 7.94rem;
      padding: 0 0.22rem;
      box-sizing: border-box;
      .title-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 0.34rem;
        background-color: rgba(70, 85, 135, 1);
        p:first-child {
          position: relative;
          padding-left: 0.14rem;
          padding-right: 0.14rem;
          height: 0.34rem;
          width: 60%;
          line-height: 0.34rem;
          background: rgba(25, 119, 242, 1);
          color: #fff;
          display: flex;
          justify-content: flex-start;
          &:after {
            @include triangle(0.17rem);
          }
        }
      }
      .report-left {
        height: 4.6rem;
        width: 100%;
        background-color: transparent;
        .content {
          height: 100%;
          width: 100%;
          .el-table {
            height: 100%;
            width: 100%;
            color: #fff;
            background-color: rgba(0, 0, 0, 0);
            th,
            tr {
              background-color: rgba(0, 0, 0, 0);
              border: none;
            }
            .el-table__row:hover {
              color: #424242;
            }
          }
        }
      }
    }
  }
}

.firstContent {
  padding: 0.15rem 0.2rem;
  background: rgba(21, 24, 54, 1);
  border-radius: 0.08rem;
  .search {
    display: flex;
    height: 0.4rem;
    width: 7.54rem;
    margin-bottom: 0.32rem;
    justify-content: space-between;
    align-items: center;
    .search-box {
      width: 60%;
      height: 0.4rem;

      border: 1px solid #066ece;
      color: rgb(190, 186, 186);
      border-radius: 0.2rem;
      box-sizing: border-box;
      padding: 0 0.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      input {
        height: 0.4rem;
        width: 80%;
        background-color: transparent;
        color: #fff;
      }
      i {
        font-size: 0.22rem;
        cursor: pointer;
      }
    }
    .select-box /deep/ {
      width: 35%;
      height: 0.4rem;
      .el-select {
        border-radius: 5px;
      }
      .el-select,
      .el-input,
      .el-input__inner {
        height: 0.4rem;
        color: #fff;
        line-height: 0.4rem;
      }
      .el-input__suffix {
        height: 0.4rem;
        display: flex;
        align-items: center;
      }
      .el-select,
      .el-input__inner {
        background-color: #066ece;
        border-color: #066ece;
      }
    }
  }
  .result {
    display: flex;
    justify-content: space-between;
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0.07rem;
      height: 0.3rem;
      width: 2.95rem;
      &:nth-of-type(2n + 1) {
        background: rgba(36, 39, 91, 1);
      }
      span:first-child {
        color: #33d5ff;
      }
      span {
        max-width: 1.45rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
// 查询到的会员
.left-showbord /deep/ {
  margin-left: 0.1rem;
  width: 4.44rem;
  height: 2.72rem;
  border-radius: 0.08rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
  padding: 0.03rem;
  cursor: pointer;
  .health_hr_left_data,
  .health_bp_right_data,
  .st-cal-left-data,
  .thermo-left-data {
    font-size: 0.32rem !important;
  }
}
.content {
  box-sizing: border-box;
  position: relative;
  padding: 0.08rem 0.1rem;
  height: 2.35rem;
  border-radius: 0.08rem;
}
.hr-num {
  position: absolute;
  left: 0.1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.5rem;
  font-weight: bold;
}

.bp-num {
  position: absolute;
  right: 0.1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.4rem;
  font-weight: bold;
  p {
    text-align: right;
    line-height: 0.4rem;
  }
  .slash {
    margin-right: 2px;
    font-size: 0.4rem;
    font-weight: 300;
  }
}
.cal-box {
  position: absolute;
  left: 0.1rem;
  bottom: 0.08rem;
  p {
    display: flex;
    align-items: center;
    font-size: 0.4rem;
  }
}
.step-box {
  position: absolute;
  right: 0.1rem;
  bottom: 0.08rem;
  p {
    display: flex;
    align-items: center;
    font-size: 0.4rem;
  }
}

// 查询到的会员 end

.step-small {
  display: inline-block;
  margin-right: 0.12rem;
  width: 0.3rem;
  height: 0.3rem;
  background-image: url("../assets/hicling/step-white.png");
  background-size: contain;
}
.heart-small {
  display: inline-block;
  margin-right: 0.12rem;
  width: 0.3rem;
  height: 0.3rem;
  background-image: url("../assets/img/alarm.png");
  background-size: contain;
}
.temp-unit {
  width: 0.3rem;
  height: 0.3rem;
  background: url("../assets/img/temp-unit-blue.png") no-repeat;
  background-size: contain;
}

.main-right {
  width: 11rem;
  height: 9rem;
  scrollbar-width: none;

  .mb-wrapper {
    height: 8.6rem;
    overflow: hidden;
    display: flex;
    justify-content: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;
    margin-left: 0.23rem;
    overflow-y: auto;
    scrollbar-width: none;
    .mb {
      margin-bottom: 0.1rem;
      margin-right: 0.1rem;
      width: 3.36rem;
      height: 2.06rem;
    }
  }
  .pagination /deep/ {
    height: 0.4rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .el-button {
      height: 0.4rem;
      position: relative;
      width: 1rem;
      span {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .input-wrapper {
      height: 100%;
      display: flex;
      align-items: center;
      margin: 0 10px;
      flex: 0 0 auto;
      .el-input {
        height: 100%;
        .el-input__inner {
          height: 100%;
          width: 1rem;
          line-height: 0.4rem;
        }
      }
      .el-input-group {
        display: flex;
        justify-content: flex-end;
        .el-input-group__append {
          width: 0.5rem;
          line-height: 0.4rem;
        }
      }
    }
  }
}

.bg-red {
  background: #f14246;
}
.bg-blue {
  background: rgba(70, 85, 135, 1);
}
.error {
  cursor: pointer;
  &::before {
    color: brown;
  }
}
.successs::before {
  color: rgb(111, 212, 153);
}
.el-select-dropdown__item {
  height: 0.4rem;
}
</style>
