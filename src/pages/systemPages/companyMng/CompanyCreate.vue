<template>
  <div class="create-company">
    <el-form
      :model="companyForm"
      :rules="rules"
      ref="companyForm"
      label-width="150px"
      class="companyForm"
    >
      <el-form-item label="Company name" prop="name">
        <el-input v-model="companyForm.name"></el-input>
      </el-form-item>

      <el-form-item label="Contact number" prop="phone">
        <el-input v-model="companyForm.phone"></el-input>
      </el-form-item>

      <el-form-item label="Company address" prop="address">
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

      <el-form-item>
        <el-button type="primary" @click="submitForm('companyForm');"
          >Submit</el-button
        >
        <el-button @click="resetForm('companyForm');">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { validateLat, validateLng, getWorkDay, week } from "@/lib/utils";
import { createCompany } from "@/api/api";
import { mapActions } from "vuex";
export default {
  name: "CreateCompany",
  data() {
    return {
      companyForm: {
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
        lat: "", // 纬度
        lng: "" // 经度
      },
      worktime: {
        week: 0, // 选择工作时间
        begin: "",
        end: ""
      },
      workday: [], // 绑定选择工作日
      areaList: [],
      week,
      rules: {
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
            message: "Please input contact number",
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
      }
    };
  },
  created() {
    this.getAreaList().then(res => {
      this.areaList = [...res];
    });
  },
  methods: {
    ...mapActions(["getAreaList", "getCompanyList"]),
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const { companyForm, worktime } = this;
          const lng = companyForm.lng || 0;
          const lat = companyForm.lat || 0;
          companyForm.workTime = worktime.week ? [{ ...worktime }] : [];
          createCompany({
            ...companyForm,
            lat,
            lng
          })
            .then(res => {
              this.succeed("Successfully created!");
              this.getCompanyList(); // 公司创建后更新一下 vuex的公司简单列表
              this.resetForm()
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          this.warning("Please fill in valid information");
          return false;
        }
      });
    },
    resetForm() {
      this.$data.companyForm = this.$options.data()
    },
    handleChange(val) {
      this.worktime.week = getWorkDay(val);
    }
  }
};
</script>
<style lang="scss" scoped>
.create-company /deep/ {
  margin-top: 0.2rem;
  height: 7.8rem;
  overflow: auto;
  .el-form-item__content {
    width: 4rem;
    .el-select {
      width: 100%;
    }
  }
  .work-day {
    .el-form-item__content {
      width: 8rem;
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
</style>
