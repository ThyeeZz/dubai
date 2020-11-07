<template>
  <div class="content" ref="myTable">
    <audio
      src="http://94.201.123.152:8091/files/alarm/notWorn.wav"
      ref="notWornPlayer"
      v-show="false"
    ></audio>
    <audio
      src="http://94.201.123.152:8091/files/alarm/sos.wav"
      ref="sosPlayer"
      v-show="false"
    ></audio>
    <audio
      src="http://94.201.123.152:8091/files/alarm/highTemp.wav"
      ref="highTempPlayer"
      v-show="false"
    ></audio>
    <audio
      src="http://94.201.123.152:8091/files/alarm/lowTemp.wav"
      ref="lowTempPlayer"
      v-show="false"
    ></audio>
    <audio
      src="http://94.201.123.152:8091/files/alarm/lowPower.wav"
      ref="lowPowerPlayer"
      v-show="false"
    ></audio>
    <el-table
      :data="alarmData"
      style="width: 100%"
      height="100%"
      @row-contextmenu="hideInput"
      cell-class-name="overFlow"
      v-loading="loading"
      element-loading-background="bgColor"
      
    >
      <el-table-column
        prop="name"
        label="Name"
        min-width="30%"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="time"
        label="Time"
        min-width="15%"
      ></el-table-column>
      <el-table-column
        prop="typeCn"
        label="Alarm"
        min-width="20%"
      ></el-table-column>
      <el-table-column label="Action" min-width="35%">
        <template slot-scope="{ row }">
          <div class="input-wrapper" v-if="!row.isHandled">
            <el-input
              v-model="row.note"
              v-show="!row.isHideInput"
              size="small"
            ></el-input>
            <el-button
              type="primary"
              size="mini"
              @click.stop="handleClick(row);"
              >{{ !row.isHideInput ? "Upload" : "Add" }}</el-button
            >
          </div>
          <p v-else>{{ row.handler }}</p>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import { AlarmSocket } from "@/lib/socket";
import { getAlarmType, getTime, deepClone } from "@/lib/utils";
import { handleAlarm } from "@/api/api";

export default {
  name: "",
  props: {
    alarmMap: {
      type: Map
    },
    alert: {
      type: String,
      required: true
    },
    bgColor: {
      type: String,
      default: "rgba(0, 0, 0, 0.8)"
    }
  },
  data() {
    return {
      alarmSocket: null,
      alarmData: [],
      loading: false
    };
  },
  computed: {
    ...mapState(["userInfo", "alarmData_saved"])
  },
  watch: {
    alert(val) {
      const { userInfo } = this;
      this.closeSocket();
      const alert_address = `${val};${userInfo.access_token};${userInfo.id}`;
      this.alarmSocket = new AlarmSocket();

      this.alarmSocket.init(alert_address, this.getAlarmMessage);
    }
  },
  mounted() {
    // 在table 范围内 右键可以关闭input 输入框，所以要组织掉默认事件
    const { myTable } = this.$refs;
    myTable.addEventListener("contextmenu", e => {
      e.preventDefault();
    });
    window.onbeforeunload = e => {
      this.closeSocket();
      // 刷新保存一波
      const { alarmData } = this;
      this.cacheAlarmData(alarmData);
    };
  },
  created() {
    this.getCache();
  },
  beforeDestroy() {
    const { isLogout } = this.userInfo;
    this.closeSocket();
    if (!isLogout) {
      const { alarmData } = this;
      this.cacheAlarmData(alarmData);
    }
  },
  methods: {
    ...mapMutations(["cacheAlarmData"]),
    getAlarmMessage(e) {
      //数据接收
      try {
        if (e.data) {
          let resdata = JSON.parse(e.data);
          if (resdata instanceof Array) {
            let newTime = getTime(+new Date());
            let { alarmData } = this;
            resdata.forEach(item => {
              let currentObj = this.alarmMap.get(item.mac);
              if (currentObj) {
                const {
                  alarmType,
                  alarmTypeCn,
                  bodyTempMakeUp,
                  wristTempMakeUp,
                  calories
                } = getAlarmType(item.cl, currentObj.deviceId, item.hr);
                currentObj.alarmType = alarmType;

                currentObj.alarmTime = getTime(item.t);
                const id = `${currentObj.mac}${currentObj.alarmType}`;
                const AlreadyBeenAlarmed = alarmData.find(
                  item => item.id === id
                );
                // 已有此用户的同类型报警，时间差值30分钟再次响应
                if (AlreadyBeenAlarmed) {
                  const timeInterval = +new Date() - AlreadyBeenAlarmed.t;
                  if (timeInterval > 30 * 60 * 1000) {
                    this.touchAlertSound(alarmType);
                    alarmData.unshift({
                      clingId: currentObj.clingId,
                      mac: currentObj.mac,
                      name: currentObj.name,
                      time: currentObj.alarmTime,
                      type: currentObj.alarmType,
                      typeCn: alarmTypeCn,
                      handler: "",
                      isHandled: false,
                      id: id,
                      t: item.t,
                      isHideInput: true,
                      timeOut: item.t + 15000
                    });
                  }
                } else {
                  // 否则z直接将报警对象插入进去
                  this.touchAlertSound(alarmType);
                  alarmData.unshift({
                    clingId: currentObj.clingId,
                    mac: currentObj.mac,
                    name: currentObj.name,
                    time: currentObj.alarmTime,
                    type: currentObj.alarmType,
                    typeCn: alarmTypeCn,
                    action: "",
                    isHandled: false,
                    id: id,
                    t: item.t,
                    isHideInput: true,
                    timeOut: item.t + 15000
                  });
                }
              }
            });

            this.alarmData = alarmData.sort((x, y) => {
              return y.t - x.t;
            });
          } else {
            const { mac, type } = resdata;
            const { alarmData } = this;
            this.alarmData = alarmData.filter(
              item => item.id !== `${mac}${type}`
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    touchAlertSound(alarmType) {
      const {
        notWornPlayer,
        sosPlayer,
        highTempPlayer,
        lowTempPlayer,
        lowPowerPlayer
      } = this.$refs;

      switch (alarmType) {
        case 1:
          // sos 报警音效
          sosPlayer.play();
          break;
        case 2:
          // 高温 报警音效
          highTempPlayer.play();
          break;
        case 3:
          // 低温 报警音效
          lowTempPlayer.play();
          break;
        case 4:
          // 未佩戴 报警音效
          notWornPlayer.play();
          break;
        case 5:
          // 低电量 报警音效
          lowPowerPlayer.play();
          break;
        default:
          break;
      }
    },
    handleClick(row) {
      if (row.isHideInput) {
        row.isHideInput = false;
      } else {
        const { t, mac, type, note } = row;
        if (!note || note.trim() === "") {
          this.failed("Please enter valid note!");
          return;
        }
        const requestBody = {
          time: t,
          mac,
          type,
          handler: note
        };
        handleAlarm(requestBody).then(res => {
          this.succeed("Added successfully");
          this.alarmSocket.send(JSON.stringify({ cmd: "action", mac, type }));
          row.isHandled = true;
          row.handler = note;
        });
      }
    },
    hideInput(row) {
      row.isHideInput = true;
    },
    closeSocket() {
      if (this.alarmSocket) {
        this.alarmSocket.socket.close();
        this.alarmSocket.socket = null;
        this.alarmSocket = null;
      }
    },
    getCache() {
      this.loading = true;
      const { alert, userInfo } = this;
      const alert_address = `${alert};${userInfo.access_token};${userInfo.id}`;
      this.alarmSocket = new AlarmSocket();
      this.alarmSocket.init(alert_address, this.getAlarmMessage);
      setTimeout(() => {
        this.alarmData =
          (this.alarmData_saved && [...this.alarmData_saved]) || [];
        this.loading = false;
      }, 800);
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  height: 100%;
  width: 100%;
  .el-table__body-wrapper{
    scrollbar-width: none;
  }
  .input-wrapper {
    display: flex;
    justify-content: center;
  }
}
</style>
