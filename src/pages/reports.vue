<template>
  <div class="report">
    <div class="report-left">
      <p class="title">Real-Time Alarm</p>
      <div class="alarm_table_wrap">
        <real-time-alarm :alarmMap="alarmMap" :alert="alert" bgColor="rgba(255,255,255,0.8)" />
      </div>
    </div>
    <div class="report-right"><heat-alarm-search /></div>
  </div>
</template>
<script>
import HeatAlarmSearch from "./systemPages/heatAlarm/HeatAlarmSearch";
import RealTimeAlarm from "@/component/RealTimeAlarm";
import { mapState } from "vuex";
export default {
  name: "Reports",
  components: { HeatAlarmSearch, RealTimeAlarm },
  data() {
    return {
      alarmMap: null,
      alert: ""
    };
  },
  methods: {
    getMap() {
      const alarmMap = new Map();
      [].forEach.call(this.userList, item => {
        alarmMap.set(item.mac, item);
      });
      this.alarmMap = alarmMap;
    }
  },
  created() {
    this.getMap();
    this.alert = this.userInfo.alert_address;
  },
  computed: {
    ...mapState(["userList", "userInfo"])
  }
};
</script>
<style lang="scss" scoped>
.report /deep/ {
  width: 19.2rem;
  height: 9.54rem;
  display: flex;
  .report-left {
    height: 100%;
    width: 7.2rem;
    background-color: #d6d5da;
    overflow: hidden;
    .title {
      width: 100%;
      height: 0.8rem;
      font-size: 0.36rem;
      text-align: center;
      line-height: 0.8rem;
      background-color: #3778F6;
      color: #fff;
    }
    .alarm_table_wrap {
      width: 100%;
      height: calc(100% - 0.8rem);
      .el-table {
        height: 100%;
        color: #909399;
        background-color: transparent;
        th,
        tr {
          background-color: transparent;
          border: none;
        }
      }
      .el-table__row:hover {
        color: #424242;
      }
      .input-wrapper {
        display: flex;
        width: 100%;
        justify-content: center;
      }
    }
  }
  .report-right {
    height: 100%;
    width: 12rem;
  }
}
</style>
