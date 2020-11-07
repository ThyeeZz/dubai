<template>
  <div id="sleepRest">
    <div class="mian-left">
      <div class="firstContent">
        <div class="search">
          <div class="search-box">
            <input
              type="text"
              placeholder="Please input name or userid"
              v-model.trim="keyword"
              @keydown.enter="search"
            />
            <i class="el-icon-search" @click="search"></i>
          </div>
          <div class="select-box">
            <el-select v-model="doctorId" @change="changeWsURI">
              <el-option
                v-for="item in departsList"
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
          <div class="sleep-show-bord">
            <sleep-item class="sleep-bord" :member="member"></sleep-item>
          </div>
        </div>
      </div>
      <div class="secondContent">
        <div class="title-box">
          <p class="flex-center">
            <span class="moon"></span>
            <span>Distribution of sleep duration of current community</span>
          </p>
        </div>
        <div class="sleep-distribution">
          <ve-histogram
            :data="sleepChartData.chartData"
            :extend="sleepChartData.extend"
            :tooltip-visible="false"
            :grid="sleepChartData.grid"
            :colors="sleepChartData.colors"
            :legend-visible="false"
            height="100%"
          ></ve-histogram>
        </div>
      </div>
      <div class="thirdContent">
        <div class="title-box">
          <p class="flex-center">
            <span class="breathe-small"></span>
            <span>Current apnoea distribution of community</span>
          </p>
        </div>
        <div class="hr-distribution">
          <ve-histogram
            :data="breathChartData.chartData"
            :extend="sleepChartData.extend"
            :tooltip-visible="false"
            :grid="sleepChartData.grid"
            :colors="sleepChartData.colors"
            :legend-visible="false"
            height="100%"
          ></ve-histogram>
        </div>
      </div>
    </div>
    <div class="main-right">
      <div class="sleep-wrapper">
        <sleep-item
          v-for="(member, index) in this.userlist_after_cut[this.currentPage]"
          :member="member"
          class="mb"
          @choose="choose(index);"
          :key="member.userid"
        ></sleep-item>
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
          Goto：
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
// import { actForSleep } from "@/mixin";
import SleepItem from "@/component/SleepItem";
import { mapState, mapActions, mapMutations } from "vuex";
import {
  restChartsData,
  getTime,
  extend,
  grid,
  defaultMember
} from "@/lib/utils";
export default {
  name: "SleepRest",
  components: {
    SleepItem
  },
  // mixins: [ actForSleep ],
  data() {
    return {
      inputVal: "",
      sleepChartData: {
        chartData: {
          columns: ["name", "value"],
          rows: [
            { name: "0", value: 0 },
            { name: "4", value: 0 },
            { name: "5", value: 0 },
            { name: "6", value: 0 },
            { name: "7", value: 0 },
            { name: "8", value: 0 },
            { name: "10", value: 0 }
          ]
        },
        colors: ["#a366fe"],
        extend,
        grid
      },
      breathChartData: {
        chartData: {
          columns: ["呼吸暂停", "人数"],
          rows: [
            { 呼吸暂停: "4", 人数: 0 },
            { 呼吸暂停: "5", 人数: 0 },
            { 呼吸暂停: "6", 人数: 0 },
            { 呼吸暂停: "7", 人数: 0 },
            { 呼吸暂停: "8", 人数: 0 },
            { 呼吸暂停: "10", 人数: 0 }
          ]
        }
      },
      member: defaultMember,
      currentPage: 0,
      somePage: 1,
      websock: null,
      renderList: [],
      departsList: [],
      currentIndex: 0,
      doctorId: 0, //部门名称
      keyword: "",
      userlist_after_cut: []
    };
  },

  methods: {
    ...mapActions(["getHealthData"]),
    ...mapMutations(["saveLeaveDprtId"]),
    // 切换socket后，重新指定渲染List，重新渲染整个；
    changeWsURI(id) {
      const { ws_servers } = this.userInfo;
      const target = ws_servers.find(item => item.id === id);
      this.doctorId = target.id;
      this.setBaseData();
    },
    setBaseData() {
      this.renderList = this.userList.filter(
        item => item.doctorId === this.doctorId
      );
      this.sortFunc();

      this.member =
        this.userlist_after_cut[this.currentPage][0] || defaultMember;

      this.resetSleepData(this.userList);
    },
    // 搜索
    search() {
      let { keyword } = this;
      if (keyword) {
        let target = this.renderList.find(
          item => item.name === keyword || item.clingId == keyword
        );
        if (target) {
          this.isSetMember = false;
          this.member = { ...target };
        } else {
          this.warning("The user cannot be found");
        }
      } else {
        this.warning("please input name or userId");
      }
    },
    choose(index) {
      this.member = this.userlist_after_cut[this.currentPage][index];
    },

    sortFunc() {
      let time = new Date().getTime();
      this.renderList.sort((x, y) => y.sleepTotal - x.sleepTotal);
      this.userlist_after_cut = this.cutUserList(this.renderList, 12);
    },
    resetSleepData(arr) {
      this.sleepChartData.chartData.rows = [
        { name: "0", value: 0 },
        { name: "4", value: 0 },
        { name: "5", value: 0 },
        { name: "6", value: 0 },
        { name: "7", value: 0 },
        { name: "8", value: 0 },
        { name: "10", value: 0 }
      ];
      let target = [...this.sleepChartData.chartData.rows];
      arr.forEach(item => {
        restChartsData(240, 60, target, item.sleepTotal, 540);
      });
      this.sleepChartData.chartData.rows = [...target];
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
    cutUserList(target, num) {
      let target1 = [...target];
      let result = [];
      while (target1.length > 12) {
        let cut = target1.splice(0, 12);
        result.push(cut);
      }
      result.push(target1);
      return result;
    }
  },
  created() {
    this.getHealthData().then(res => {
      this.userList = [...res];
      this.setBaseData();
    });
    const { ws_servers } = this.userInfo;
    this.departsList = [...ws_servers];
    // this.saved_deprtId  储存再vuex中的 部门ID
    // 初次进入的h时，saved_doctorId = undefined;
    let doctorId = this.saved_deprtId || ws_servers[0].id;
    // 由于权限限制，需要判断保存的部门id是否在改账号的显示范围内
    // 否则会出现0部门的情况
    const target = ws_servers.find(item => item.id === doctorId);
    const { id } = target || ws_servers[0];

    this.doctorId = id;
  },
  computed: {
    ...mapState(["userInfo", "saved_deprtId"]),
    sleepTotal() {
      let { sleepTotal } = this.member;
      sleepTotal = sleepTotal || 0;
      const hour = Math.floor(sleepTotal / 60);
      const min = sleepTotal % 60;
      return `${hour} h ${min} m`;
    },
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
    this.saveLeaveDprtId(this.doctorId);
    next();
  }
};
</script>
<style lang="scss" scoped>
@import "../style/minix.scss";
#sleepRest {
  display: flex;
  padding: 0.23rem 0.2rem 0.26rem;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  color: #fff;
  font-size: 0.2rem;
  background-color: #070731;
  .mian-left {
    width: 7.94rem;
    .secondContent,
    .thirdContent {
      margin-top: 0.2rem;
      padding: 0 0.22rem;
    }
  }
}
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
    line-height: 0.34rem;
    background: rgba(25, 119, 242, 1);
    font-size: 0.22rem;
    color: #fff;
    &:after {
      @include triangle(0.17rem);
    }
  }
  p:last-child {
    padding-right: 0.14rem;
    font-size: 0.16rem;
  }
}
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

.firstContent {
  padding: 0.15rem 0.2rem;
  background: rgba(21, 24, 54, 1);
  border-radius: 0.08rem;
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
//  睡眠 start
.sleep-show-bord /deep/ {
  margin-left: 0.1rem;
  width: 4.44rem;
  height: 2.72rem;
  display: flex;
  justify-content: center;
  align-items: center;
  .sleep-bord {
    width: 100%;
    height: 100%;
    #time_num_unit {
      font-size: 0.22rem !important;
      font-weight: bolder;
    }
    .time_num {
      font-size: 0.36rem !important;
      font-weight: bolder;
    }
  }
}
.sleep {
  margin-left: 0.1rem;
  width: 4.44rem;
  height: 2.72rem;
}

.bg-blue {
  background: rgba(70, 85, 135, 1);
}
// 睡眠 end

.moon {
  display: inline-block;
  margin-right: 0.12rem;
  width: 0.3rem;
  height: 0.3rem;
  background-image: url("../assets/hicling/moon.png");
  background-size: contain;
}
.breathe-small {
  display: inline-block;
  margin-right: 0.12rem;
  width: 0.3rem;
  height: 0.3rem;
  background-image: url("../assets/hicling/breath-small.png");
  background-size: contain;
}
.sleep-distribution {
  height: 2rem;
  // background-image: url("../assets/hicling/step-bg.png");
}
.hr-distribution {
  height: 2.2rem;
  // background-image: url("../assets/hicling/hr-bg.png");
}
.main-right {
  width: 11rem;
  height: 9rem;
  scrollbar-width: none;
  .sleep-wrapper {
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
      cursor: pointer;
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
</style>
