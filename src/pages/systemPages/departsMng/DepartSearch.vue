<template>
  <div>
    <el-container style="width:16.06rem;">
      <el-main>
        <el-form
          ref="form"
          v-model="form"
          label-width="150px"
          width="2rem"
          :rules="rules"
          :inline="true"
        >
          <el-form-item label="Department name" class="margin-bot">
            <el-input v-model="form.name" v-on:keydown.enter.native.prevent="getData"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getData">Search</el-button>
          </el-form-item>
        </el-form>

        <el-table :data="tableData" v-loading="loading" stripe>
          <el-table-column prop="id" label="ID" width="100"></el-table-column>
          <el-table-column
            prop="name"
            label="Department name"
          ></el-table-column>
          <el-table-column
            prop="phone"
            label="Contact number"
          ></el-table-column>
          <el-table-column
            prop="companyname"
            label="Affiliated company"
          ></el-table-column>
          <el-table-column
            prop="sServerName"
            label="Gateway service"
          ></el-table-column>
          <el-table-column
            prop="coordinate"
            label="Coordinate"
          ></el-table-column>
          <el-table-column label="Operation">
            <template slot-scope="{ row }">
              <el-button @click="modify(row);" type="text" size="normal"
                >Modify</el-button
              >
              <el-button @click="del(row);" type="text" size="normal"
                >Delete</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 修改部门信息 dialog -->
        <el-dialog
          title="Department information modification"
          :visible.sync="dialogFormVisible"
        >
          <el-form
            :model="modifyForm"
            ref="modifyForm"
            :rules="rules"
            label-width="150px"
            class="demo-modifyForm"
          >
            <el-form-item label="Department name" prop="name">
              <el-input v-model="modifyForm.name"></el-input>
            </el-form-item>

            <el-form-item label="Contact number" prop="phone">
              <el-input v-model="modifyForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="Latitude" prop="lat">
              <el-input v-model="modifyForm.lat"></el-input>
            </el-form-item>
            <el-form-item label="Longitude" prop="lng">
              <el-input v-model="modifyForm.lng"></el-input>
            </el-form-item>
            <el-form-item label="Gateway service" prop="sServerId">
              <el-select
                v-model="modifyForm.sServerId"
                placeholder="please choose"
              >
                <el-option
                  v-for="item in serverList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Affiliated company" prop="hid">
              <el-select v-model="modifyForm.hid">
                <el-option
                  v-for="item in companyList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="Working period">
              <el-checkbox v-model="diy"
                >Whether to create a new working period?</el-checkbox
              >
            </el-form-item>

            <el-form-item label="Work day" class="work-day" v-show="diy">
              <el-checkbox-group v-model="workday" @change="handleChange">
                <el-checkbox
                  v-for="item in week"
                  :key="item.id"
                  :label="item.label"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="Work time" class="work-time" v-show="diy">
              <el-time-select
                placeholder="start time"
                v-model="worktime.begin"
                :picker-options="{
                  start: '00:00',
                  step: '00:30',
                  end: '24:00'
                }"
              >
              </el-time-select>
              <el-time-select
                placeholder="end time"
                v-model="worktime.end"
                :picker-options="{
                  start: '00:00',
                  step: '00:30',
                  end: '24:00'
                }"
              >
              </el-time-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitModify('modifyForm');"
              >Submit</el-button
            >
          </div>
        </el-dialog>
      </el-main>
      <div class="fr">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageindex"
          :page-sizes="[10, 30, 100, 400]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
        ></el-pagination>
      </div>
    </el-container>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { departPager, updateDepart, delDepart } from "@/api/api";
import { validateLat, validateLng, week, getWorkDay } from "@/lib/utils";
export default {
  name: "DepartSearch",
  data() {
    return {
      dialogFormVisible: false,
      modifyForm: {
        name: "",
        phone: "",
        gender: 0,
        id: "",
        sServerId: "",
        hid: "",
        lng: "",
        lat: "",
        diy: 0,
        workTime: [
          {
            week: 0,
            begin: "",
            end: ""
          }
        ]
      },
      worktime: {
        week: 0,
        begin: "",
        end: ""
      },
      diy: false,
      workday: [],
      week,
      pagesize: 30,
      pageindex: 1,
      totalPage: 0,
      tableData: [],
      loading: false,
      form: {
        name: ""
      },
      rules: Object.freeze({
        name: [
          {
            required: true,
            message: "Please input department name",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "Please input contact number",
            trigger: "blur"
          }
        ],
        sServerId: [
          {
            required: true,
            message: "Please choose gateway service",
            trigger: "blur"
          }
        ],
        hid: [
          {
            required: true,
            message: "Plwase choose affiliated company",
            trigger: "blur"
          }
        ],
        lat: [{ validator: validateLat, trigger: "blur" }],
        lng: [{ validator: validateLng, trigger: "blur" }]
      })
    };
  },
  computed: {
    ...mapState(["companyList", "serverList"])
  },
  methods: {
    ...mapActions(["getSimpleDeparts"]),
    modify(row) {
      let {
        name,
        phone,
        gender,
        id,
        sServerId,
        hid,
        lat,
        lng,
        diy,
        workTime
      } = row;
      if (workTime.length === 0 || JSON.stringify(workTime[0]) === "{}") {
        workTime = [
          {
            week: 0,
            begin: "",
            end: ""
          }
        ];
      }
      this.modifyForm = {
        name,
        phone,
        gender,
        id,
        sServerId,
        hid,
        lat,
        lng,
        diy,
        workTime
      };

      this.workday = getWorkDay(workTime[0].week);
      this.worktime.begin = workTime[0].begin;
      this.worktime.end = workTime[0].end;
      this.diy = Boolean(diy);

      this.dialogFormVisible = true;
    },
    del(row) {
      this.$confirm("Are you sure to delete?", "prompt", {
        confirmButtonText: "comfirm",
        cancelButtonText: "cancel",
        type: "warning",
        center: true
      })
        .then(() => {
          const { id } = row;
          delDepart({ id }).then(res => {
            this.succeed("successfully deleted,please relogin");
            this.getData();
            this.getSimpleDeparts(); // 重新获取部门简单列表并存储
          });
        })
        .catch(() => {
          console.log(err);
        });
    },
    getData() {
      this.loading = true;
      const { pagesize, form, pageindex } = this;
      departPager({
        ...form,
        pagesize,
        pageindex
      })
        .then(res => {
          this.tableData = [];
          this.loading = false;
          const { content, totalElements } = res.data;
          this.totalPage = totalElements;
          for (let item of content) {
            const {
              name,
              gender,
              id,
              phone,
              sServerName,
              sServerId,
              hid,
              lat,
              lng,
              diy,
              workTime
            } = item;
            this.tableData.push({
              name,
              gender,
              id,
              phone,
              sServerName,
              sServerId,
              hid,
              companyname: this.getCompanyName(hid),
              coordinate: `${lat},${lng}`,
              lat,
              lng,
              diy,
              workTime
            });
          }
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    handleSizeChange(value) {
      this.pagesize = value;
      this.getData();
    },
    handleCurrentChange(value) {
      this.pageindex = value;
      this.getData();
    },
    getStatus(status) {
      switch (status) {
        case 0:
          return "initializing";
        case 1:
          return "idle";
        case 2:
          return "working";
        case 3:
          return "service offlin";
        case 4:
          return "locking";
      }
    },
    submitModify(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const { modifyForm, worktime, diy } = this;
          // 用户是否选择diy部门工作时间，如果diy，上传diy的 否则上传diy: 0
          if (diy) {
            modifyForm.diy = 1;
            modifyForm.workTime = worktime.week === 0 ? [] : [worktime];
          } else {
            modifyForm.diy = 0;
            modifyForm.workTime = [];
          }
          const lat = modifyForm.lat || 0;
          const lng = modifyForm.lng || 0;

          updateDepart({
            ...modifyForm,
            lat,
            lng
          })
            .then(res => {
              this.succeed("Update completed,please relogin");
              this.getData();
              this.getSimpleDeparts();
              this.dialogFormVisible = false;
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          return null;
        }
      });
    },
    getCompanyName(hid) {
      if (hid) {
        let company = this.companyList.find(item => item.id == hid);
        return company.name;
      } else {
        return "--";
      }
    },
    handleChange(val) {
      this.worktime.week = getWorkDay(val);
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
<style scoped lang="scss">
.el-container {
  height: 8rem;
  text-align: left;
  background-color: rgba(244, 248, 252, 1);
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.63);
  line-height: 0.7rem;
  color: #666;
  position: relative;
  .fr {
    height: 1rem;
    position: absolute;
    bottom: 0;
    right: 20px;
    display: flex;
    align-items: center;
  }
}
.el-main {
  width: 100%;
  height: 7rem;
  padding: 0;
  overflow: auto;
  .el-form {
    margin-top: 20px;
    margin-right: 20px;
    text-align: left;
  }
  .el-table {
    height: 6rem;
    overflow: auto;
  }
  .el-table__row {
    height: 0.46rem;
  }
  .el-dialog__wrapper /deep/ {
    .el-dialog {
      .el-dialog__header {
        height: 0.5rem;
        display: flex;
      }
      .el-dialog__body {
        max-height: 6rem;
        overflow: auto;
        .demo-modifyForm {
          display: flex;
          flex-direction: column;
          .el-form-item__content {
            width: 4rem;
            .el-select {
              width: 100%;
            }
          }
          .work-day {
            .el-form-item__content {
              width: 6rem;
              max-height: 3rem;
              overflow: auto;
            }
          }
          .work-time {
            .el-form-item__content {
              width: 8rem;
            }
          }
        }
      }
    }
  }
}
</style>
