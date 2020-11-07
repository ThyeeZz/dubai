<template>
  <div class="reports-search">
    <div class="beacon-search-wrap">
      <el-form :model="myForm" class="demo-ruleForm">
        <el-form-item label="Userid">
          <el-input v-model="myForm.pid"></el-input>
        </el-form-item>
        <el-form-item label="Name">
          <el-input v-model="myForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Type">
          <el-select
            v-model="myForm.type"
            placeholder="please choose alarm type"
          >
            <el-option label="SOS" value="1"></el-option>
            <el-option label="High temperature" value="2"></el-option>
            <el-option label="Low temperature" value="3"></el-option>
            <el-option label="Not worn" value="4"></el-option>
            <el-option label="Low power" value="5"></el-option>
            <el-option label="All type" value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="time-item timePicker" label="Time period">
          <el-date-picker
            v-model="value1"
            type="datetime"
            placeholder="choose period"
            @change="change"
          >
          </el-date-picker>
          <el-date-picker
            v-model="value2"
            type="datetime"
            placeholder="choose period"
            @change="change"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getData">Search</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrap">
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="tableLoading"
        height="100%"
      >
        <el-table-column prop="typeCn" label="Type"></el-table-column>
        <el-table-column
          prop="clingId"
          label="ID"
          width="50px"
        ></el-table-column>
        <el-table-column prop="name" label="Name"></el-table-column>
        <el-table-column prop="timeCn" label="Alarm time"></el-table-column>
        <el-table-column
          prop="count"
          label="Processing times"
        ></el-table-column>
        <el-table-column
          prop="handlerTime"
          label="Last action time"
        ></el-table-column>
        <el-table-column label="Operation">
          <template slot-scope="{ row }">
            <el-button type="text" @click="checkAlarmHistory(row);"
              >Alarm history</el-button
            >
            <el-button type="text" @click="checkActionHistory(row);"
              >Action history</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-wrap">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageindex"
        :page-sizes="[15, 50, 100, 300]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalcount"
      ></el-pagination>
    </div>

    <!-- 历史报警dialog -->
    <el-dialog
      title="Historical alarm"
      :visible.sync="alarmVisible"
      class="myDialog"
    >
      <el-table :data="alarmData" v-loading="alarmLoading">
        <el-table-column property="time" label="Date"></el-table-column>
        <el-table-column property="tp" label="Tempeture"></el-table-column>
        <el-table-column property="mac" label="Mac"></el-table-column>
      </el-table>
    </el-dialog>

    <!-- 历史处理dialog -->
    <el-dialog
      title="Historical action"
      :visible.sync="actionVisible"
      class="myDialog"
    >
      <el-table :data="actionData" v-loading="actionLoading">
        <el-table-column property="uid" label="Uid"></el-table-column>
        <el-table-column property="name" label="Processor"></el-table-column>
        <el-table-column property="action" label="Action"></el-table-column>
        <el-table-column property="time" label="Alarm time"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { getMinuteBeginTimestamp } from "@/lib/utils";
import { alarmPager, getAlertHistory, getActionHistory } from "@/api/api";
import { mapState } from "vuex";
export default {
  name: "heatAlarmSearch",
  data() {
    return {
      alarmVisible: false,
      actionVisible: false,
      myForm: {
        name: "",
        pid: "",
        type: "0",
        start: 0,
        end: 0
      },
      value1: new Date(),
      value2: new Date(),
      pageindex: 1,
      pagesize: 15,
      totalcount: 0,
      tableData: [],
      tableLoading: false,
      alarmLoading: false,
      actionLoading: false,
      alarmData: [],
      actionData: []
    };
  },
  methods: {
    change() {
      const { value1,value2 } = this;
      this.myForm.start =
        (value1 && Math.round(+new Date(value1) / 1000)) || 0;
      this.myForm.end = (value2 && Math.round(+new Date(value2) / 1000)) || 0;
    },
    getData() {
      const { myForm, pageindex, pagesize } = this;
      const pid = myForm.pid || 0; // 没有pdi 默认传0而非空
      const requestObj = { ...myForm, pid, pageindex, pagesize };

      this.tableLoading = true;
      alarmPager(requestObj)
        .then(res => {
          const { content, totalElements } = res.data;
          this.totalcount = totalElements;
          this.tableData = [];
          this.tableLoading = false;
          content.forEach(item => {
            const {
              type,
              clingId,
              date,
              name,
              patientId,
              status,
              time,
              temp,
              count,
              mac,
              handlerTime
            } = item;
            this.tableData.push({
              type,
              typeCn: this.getAlarmType(type),
              clingId,
              date,
              name,
              patientId,
              time,
              timeCn: getMinuteBeginTimestamp(time),
              handlerTime: getMinuteBeginTimestamp(handlerTime),
              temp,
              count,
              mac
            });
          });
          this.tableData.sort((x, y) => y.time - x.time);
        })
        .catch(err => {
          this.tableLoading = false;
          console.log(err);
        });
    },
    getAlarmType(n) {
      switch (n) {
        case 1:
          return "Sos";
        case 2:
          return "High Temperature";
        case 3:
          return "Low Temperature";
        case 4:
          return "Not worn";
        case 5:
          return "Low power";
        case 99:
          return "System acquisition";
      }
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.pageindex = val;
      this.getData();
    },
    checkAlarmHistory(row) {
      const { mac, date, type } = row;
      this.alarmLoading = true;
      this.alarmVisible = true;
      getAlertHistory({ mac, date, type })
        .then(res => {
          this.alarmLoading = false;
          const { data } = res;
          this.alarmData = [];
          data.forEach(item => {
            const { mac, tp, t } = item;
            this.alarmData.push({
              time: getMinuteBeginTimestamp(t),
              tp,
              mac
            });
          });
        })
        .catch(err => {
          this.alarmLoading = false;
          console.log(err);
        });
    },
    checkActionHistory(row) {
      const { mac, date, type } = row;
      this.actionLoading = true;
      this.actionVisible = true;
      getActionHistory({ mac, date, type })
        .then(res => {
          this.actionLoading = false;
          this.actionData = [];
          const { data } = res;
          data.forEach(item => {
            const { name, time, uid, action } = item;
            this.actionData.push({
              name,
              time: getMinuteBeginTimestamp(time),
              uid,
              action
            });
          });
        })
        .catch(err => {
          this.actionLoading = false;
          console.log(err);
        });
    }
  },
  mounted() {
    this.getData();
  },
  computed: {
    ...mapState(["userList"])
  }
};
</script>
<style lang="scss" scoped>
.reports-search {
  height: 9.54rem;
  width: 100%;
  .beacon-search-wrap /deep/ {
    height: 2rem;
    .demo-ruleForm {
      display: flex;
      flex-wrap: wrap;
      padding: 0.1rem 0.2rem;
      flex: 0 0 auto;
      overflow: auto;
      align-items: center;
      .el-form-item {
        width: 3.5rem;
        flex: 0 0 auto;
        display: flex;
        .el-form-item__label {
          width: 1.5rem;
        }
        .el-form-item__content {
          width: 2rem;
          margin: 0;
        }
      }
      .timePicker {
        width: 8rem;
        .el-form-item__content {
          width: 6.5rem;
        }
      }
    }
  }
  .table-wrap {
    height: 6.54rem;
    padding: 0.1rem 0.2rem 0.1rem 0;
    box-sizing: border-box;
  }
  .pagination-wrap {
    height: 1rem;
    .el-pagination {
      height: 100%;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
  .myDialog /deep/ {
    overflow: auto;
    .el-dialog__header {
      display: flex;
      align-items: center;
      height: 0.5rem;
    }
    .el-dialog__body {
      overflow: auto;
      max-height: 5rem;
    }
  }
}
</style>
