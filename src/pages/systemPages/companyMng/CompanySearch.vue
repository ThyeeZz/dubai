<template>
  <div class="company-search">
    <el-form
      ref="form"
      v-model="form"
      label-width="150px"
    >
      <el-form-item label="Company name" class="margin-bot">
        <el-input v-model="form.name" v-on:keydown.enter.native.prevent="getData"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getData">Search</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" v-loading="loading" stripe>
      <el-table-column prop="id" label="ID" width="60"></el-table-column>
      <el-table-column prop="name" label="Company name"></el-table-column>
      <el-table-column prop="phone" label="Contact number"></el-table-column>
      <el-table-column prop="location" label="Location"></el-table-column>
      <el-table-column prop="address" label="Address"></el-table-column>
      <el-table-column
        prop="lat_lng"
        label="Latitude and longitude"
      ></el-table-column>

      <el-table-column label="operation">
        <template slot-scope="scope">
          <el-button @click="modify(scope.row);" type="text" size="normal"
            >Modify</el-button
          >
          <el-button @click="del(scope.row);" type="text" size="normal"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
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
    <!-- 修改弹出dialog -->
    <el-dialog
      title="Company information modification"
      :visible.sync="showModifyDialog"
    >
      <el-form
        :model="companyForm"
        :rules="rules"
        ref="companyForm"
        label-width="1.5rem"
        class="companyForm"
      >
        <el-form-item label="Company name" prop="name">
          <el-input v-model="companyForm.name"></el-input>
        </el-form-item>

        <el-form-item label="Contact number" prop="phone">
          <el-input v-model="companyForm.phone"></el-input>
        </el-form-item>

        <el-form-item label="Address" prop="address">
          <el-input v-model="companyForm.address"></el-input>
        </el-form-item>

        <el-form-item label="Latitude" prop="lat">
          <el-input v-model="companyForm.lat"></el-input>
        </el-form-item>

        <el-form-item label="Longitude" prop="lng">
          <el-input v-model="companyForm.lng"></el-input>
        </el-form-item>
        <el-form-item label="Location" prop="lid">
          <el-select v-model="companyForm.lid">
            <el-option
              v-for="item in areaList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Work day" class="work-day">
          <el-checkbox-group v-model="workday" @change="handleChange">
            <el-checkbox
              v-for="item in week"
              :key="item.id"
              :label="item.label"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="Work time" class="work-time">
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
        <el-button type="primary" @click="submitModify('companyForm');"
          >Submit</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { validateLat, validateLng, getWorkDay } from "@/lib/utils";
import { getCompanyPager, updateCompany, delCompany } from "@/api/api";
import { mapState, mapActions } from "vuex";
export default {
  name: "companySearch",
  props: [],
  data() {
    return {
      showModifyDialog: false,
      pagesize: 30,
      pageindex: 1,
      totalPage: 0,
      tableData: [],
      loading: false,
      form: {
        name: ""
      },
      companyForm: {
        id: "",
        name: "",
        phone: "",
        address: "",
        workTime: [
          {
            week: 0,
            begin: "",
            end: ""
          }
        ],
        lid: "",
        lng: "", // 经度
        lat: "" // 纬度
      },
      worktime: {
        week: 0, // 选择工作时间
        begin: "",
        end: ""
      },
      workday: [], // 绑定选择工作日
      week: Object.freeze([
        {
          label: "Monday",
          id: 1
        },
        {
          label: "Tuesday",
          id: 2
        },
        {
          label: "Wednesday",
          id: 3
        },
        {
          label: "Thursday",
          id: 4
        },
        {
          label: "Friday",

          id: 5
        },
        {
          label: "Saturday",
          id: 6
        },
        {
          label: "Sunday",
          id: 7
        }
      ]),
      rules: Object.freeze({
        name: [
          {
            required: true,
            message: "Please input company name",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "Please input phone number",
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: "Please input company address",
            trigger: "blur"
          }
        ],
        lat: [{ validator: validateLat, trigger: "blur" }],
        lng: [{ validator: validateLng, trigger: "blur" }],
        lid: [
          { required: true, message: "Please select location", trigger: "blur" }
        ]
      })
    };
  },
  methods: {
    ...mapActions(["getCompanyList"]),
    modify(row) {
      this.showModifyDialog = true;
      let { id, name, phone, address, lng, lat, lid, workTime } = { ...row };

      if (workTime.length === 0||JSON.stringify(workTime[0])==="{}") {
        workTime = [
          {
            week: 0,
            begin: "",
            end: ""
          }
        ];
      }
      this.companyForm = { id, name, phone, address, lng, lat, lid, workTime };
      this.workday = getWorkDay(workTime[0].week);
      this.worktime.begin = workTime[0].begin;
      this.worktime.end = workTime[0].end;
    },
    del(row) {
      this.$confirm("Are you sure to delete?", "prompt", {
        confirmButtonText: "Comfirm",
        cancelButtonText: "Cancel",
        type: "warning",
        center: true
      }).then(() => {
        const { id } = row;
        delCompany({ id }).then(res => {
          this.succeed("successfully deleted");
          this.getData();
          this.getCompanyList(); // 公司创建后更新一下 vuex的公司简单列表
        });
      });
    },
    getData() {
      const { pagesize, pageindex, form } = this;
      this.loading = true;
      getCompanyPager({
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
              address,
              hospitalName,
              id,
              lat,
              lng,
              telPhone,
              lid,
              workTime
            } = item;
            this.tableData.push({
              address,
              name: hospitalName,
              id,
              lat, // 纬度
              lng, // 经度
              lat_lng: `${lat}, ${lng}`,
              phone: telPhone,
              location: this.getAreaName(lid),
              lid,
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
    submitModify(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const { companyForm, worktime } = this;
          const lng = companyForm.lng || 0;
          const lat = companyForm.lat || 0;
          companyForm.workTime = worktime.week ? [{ ...worktime }] : [];
          updateCompany({ ...companyForm, lat, lng })
            .then(res => {
              this.succeed("update completed");
              this.showModifyDialog = false;
              this.getData();
              this.getCompanyList(); // 公司创建后更新一下 vuex的公司简单列表
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          return false;
        }
      });
    },
    getAreaName(lid) {
      const target = this.areaList.find(item => item.id === lid);
      return (target && target.name) || "Unbound";
    },
    handleChange(val) {
      this.worktime.week = getWorkDay(val);
    }
  },
  mounted() {
    this.getData();
  },
  computed: {
    ...mapState(["areaList"])
  }
};
</script>
<style scoped lang="scss">
.company-search {
  box-sizing: border-box;
  padding-top: 0.2rem;
  height: 8rem;
  overflow: hidden;
  background-color: rgba(244, 248, 252, 1);
  .el-form {
    height: 0.8rem;
    display: flex;
  }
  .el-table {
    height: 6.5rem;
    overflow: auto;
  }
  .pagination {
    height: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .el-pagination {
      height: 100%;
    }
  }
  .el-dialog__wrapper /deep/ {
    .el-dialog {
      .el-dialog__header {
        height: 0.5rem;
        display: flex;
      }
      .el-dialog__body {
        height: 6rem;
        overflow: auto;
        .companyForm {
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
