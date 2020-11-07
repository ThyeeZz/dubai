<template>
  <div class="beacon-search-wrap">
    <el-form :model="myForm" label-width="1.5rem" class="demo-ruleForm">
      <el-form-item label="Search method">
        <el-select
          v-model="myForm.type"
          placeholder="please choose search method"
        >
          <el-option label="Show all gateways" value="0"></el-option>
          <el-option label="Address search" value="1"></el-option>
          <el-option label="Gateway name search" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Gateway address" v-show="myForm.type == 1">
        <el-input
          v-model="myForm.key"
          placeholder="please input gateway mac"
        ></el-input>
      </el-form-item>

      <el-form-item label="Gateway name" v-show="myForm.type == 2">
        <el-input
          v-model="myForm.key"
          placeholder="Please enter a custom gateway name"
        ></el-input>
      </el-form-item>

      <el-form-item
        label="Status"
        v-show="myForm.type == 2 || myForm.type == 1"
      >
        <el-select
          v-model="myForm.status"
          placeholder="Please select the gateway status"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="deBouncedSearch">Search</el-button>
      </el-form-item>
    </el-form>

    <div class="table-wrap">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column
          prop="mac"
          label="Gateway mac"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="gatewayname"
          label="Gateway name"
          width="180"
        ></el-table-column>
        <el-table-column prop="runstatusCn" label="Status"></el-table-column>
        <el-table-column prop="serviceCn" label="Service"></el-table-column>
        <el-table-column
          prop="lastTime"
          label="Last work time"
        ></el-table-column>
        <el-table-column prop="coordinate" label="Coordinate"></el-table-column>
        <el-table-column label="Operation">
          <template slot-scope="{ row }">
            <el-button type="text" @click="edit(row);">Modify</el-button>
            <el-button type="text" @click="del(row);">Delete</el-button>
            <el-button type="text" @click="reboot(row);">Reboot</el-button>
          </template>
        </el-table-column>
      </el-table>
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
    </div>
    <el-dialog title="Modify gateway information" :visible.sync="modifyVisible">
      <!---->
      <el-form
        :model="modifyForm"
        :rules="rules"
        ref="ruleForm"
        label-width="1.8rem"
        class="modifyForm"
      >
        <el-form-item label="Gateway mac">
          <el-input v-model="modifyForm.mac" disabled></el-input>
        </el-form-item>

        <el-form-item label="Custom gateway name">
          <el-input v-model="modifyForm.gatewayname"></el-input>
        </el-form-item>

        <el-form-item label="Latitude" v-show="isHardGateway" prop="x">
          <el-input v-model="modifyForm.x"></el-input>
        </el-form-item>
        <el-form-item label="Longitude" v-show="isHardGateway" prop="y">
          <el-input v-model="modifyForm.y"></el-input>
        </el-form-item>

        <el-form-item label="Modify gateway status">
          <el-select
            v-model="modifyForm.runstatus"
            placeholder="please chosse gateway status"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Server">
          <el-select
            v-model="modifyForm.sServerId"
            placeholder="please choose server"
          >
            <el-option
              v-for="item in allServerList"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm');"
            >Submit</el-button
          >
          <el-button @click="resetForm('ruleForm');">Reset</el-button>
        </el-form-item>
      </el-form>
      <!--
        <div slot="footer" class="dialog-footer">

        </div>
      -->
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { debounce, getMinuteBeginTimestamp } from "@/lib/utils";
import {
  beaconPager,
  deleteBeacon,
  rebootBeacon,
  updateBeacon,
  getSocketSimpleList
} from "@/api/api";
import { validateLat, validateLng } from "@/lib/utils";
export default {
  name: "beaconSearch",
  data() {
    return {
      modifyVisible: false,
      myForm: {
        type: "0",
        key: "",
        status: 0
      },
      modifyForm: {
        mac: "",
        gatewayname: "",
        runstatus: 0,
        sServerId: "",
        x: 0,
        y: 0
      },
      options: Object.freeze([
        {
          label: "Unknown",
          value: 0
        },
        {
          label: "Entry",
          value: 1
        },
        {
          label: "Authorized",
          value: 2
        },
        {
          label: "Lost connection",
          value: 3
        },
        {
          label: "Wrong",
          value: 4
        },
        {
          label: "Locking",
          value: 5
        }
      ]),
      pageindex: 1,
      pagesize: 15,
      totalcount: 0,
      tableData: [],
      loading: false,
      allServerList: [],
      deBouncedSearch: null,
      rules: {
        x: [{ validator: validateLat, trigger: "blur" }],
        y: [{ validator: validateLng, trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState(["serverList"]),
    isHardGateway() {
      return this.modifyForm.mac.length === 17;
    }
  },
  mounted() {
    this.getData();
  },
  created() {
    this.deBouncedSearch = debounce(this.getData, 0.5);
    this.allServerList = [
      {
        id: 0,
        name: "no service"
      },
      ...this.serverList
    ];
  },
  watch: {
    "myForm.type"(newVal) {
      this.pageindex = 1;
    }
  },
  methods: {
    ...mapActions(["getBeaconList"]),
    getData() {
      this.loading = true;
      beaconPager({
        ...this.myForm,
        pagesize: this.pagesize,
        pageindex: this.pageindex
      })
        .then(res => {
          this.tableData = [];
          this.loading = false;
          const { totalElements, content } = res.data;
          this.totalcount = totalElements;
          content.forEach(item => {
            this.tableData.push({
              runstatus: item.runstatus,
              runstatusCn: this.getStatus(item.runstatus),
              gatewayname: item.gatewayname,
              sServerId: item.serverId,
              serviceCn: this.getServiceName(item.serverId),
              lastTime: getMinuteBeginTimestamp(item.lasttime),
              mac: item.mac,
              x: item.x || 0,
              y: item.y || 0,
              coordinate: `${item.x},${item.y}`
            });
          });
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    },
    getServiceName(sid) {
      const { name } = this.allServerList.find(item => item.id === sid);
      return name || "--";
    },
    getStatus(status) {
      switch (status) {
        case 0:
          return "Unknown";
          break;
        case 1:
          return "Entry";
          break;
        case 2:
          return "Authorized";
          break;
        case 3:
          return "Lost connection";
          break;
        case 4:
          return "Wrong";
          break;
        case 5:
          return "Locking";
          break;
        default:
          return;
      }
    },
    edit(row) {
      console.log(row);
      this.modifyVisible = true;
      const { mac, gatewayname, runstatus, sServerId, x, y } = row;
      this.modifyForm = { mac, gatewayname, runstatus, sServerId, x, y };
    },
    reboot(row) {
      const { sServerId, mac } = row;
      this.$confirm("Are you sure to reboot?", "prompt", {
        confirmButtonText: "Comfirm",
        cancelButtonText: "Cancel",
        type: "warning",
        center: true
      })
        .then(() => {
          rebootBeacon({ ssid: sServerId, mac }).then(res => {
            this.succeed("Reboot successfully");
          }).catch(err=>{
            console.log(err)
          })
        })
        .catch(() => {
          return false;
        });
    },
    del(row) {
      this.$confirm("Are you sure to delete?", "prompt", {
        confirmButtonText: "Comfirm",
        cancelButtonText: "Cancel",
        type: "warning",
        center: true
      })
        .then(() => {
          const { mac } = row;
          deleteBeacon({ mac })
            .then(res => {
              console.log(res);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          return false;
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          updateBeacon(this.modifyForm)
            .then(res => {
              this.succeed("update completed!");
              this.getData();
              this.getBeaconList();
              this.modifyVisible = false;
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      return null;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageindex = val;
      this.getData();
    }
  }
};
</script>
<style lang="scss" scoped>
.beacon-search-wrap /deep/ {
  box-sizing: border-box;
  padding: 20px;
  width: 100%;
  position: relative;
  height: 8rem;
  .demo-ruleForm {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    height: 1rem;
    .el-form-item {
      width: 25%;
      .el-form-item__label {
        word-break: normal;
      }
    }
  }
  .table-wrap {
    height: 6.8rem;
    .el-table {
      height: 6.3rem;
      overflow: auto;
    }
    .pagination-wrap {
      text-align: right;
      height: 0.5rem;
    }
  }
  .el-dialog {
    .el-dialog__header {
      height: 0.5rem;
      display: flex;
    }
  }
}
.modifyForm {
  .el-input,
  .el-select {
    width: 4rem;
  }
}
</style>
