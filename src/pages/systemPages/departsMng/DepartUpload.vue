<template>
  <div class="uploadWrap">
    <el-form
      :model="creatDprtForm"
      :rules="rules"
      ref="ruleForm"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-form-item label="Department name" prop="name">
        <el-input v-model="creatDprtForm.name"></el-input>
      </el-form-item>
      <el-form-item label="Contact number" prop="phone">
        <el-input v-model="creatDprtForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="Latitude" prop="lat">
        <el-input v-model="creatDprtForm.lat"></el-input>
      </el-form-item>
      <el-form-item label="Longitude" prop="lng">
        <el-input v-model="creatDprtForm.lng"></el-input>
      </el-form-item>
      <el-form-item label="Gateway service" prop="sServerId">
        <el-select
          v-model="creatDprtForm.sServerId"
          placeholder="please choose"
        >
          <el-option
            v-for="item in serverList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Affiliated company" prop="hid">
        <el-select v-model="creatDprtForm.hid">
          <el-option
            v-for="item in companyList"
            :key="item.id"
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

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm');"
          >Submit</el-button
        >
        <el-button @click="resetForm('ruleForm');">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { validateLat, validateLng, week, getWorkDay } from "@/lib/utils";
import { createDepart } from "@/api/api";
export default {
  name: "deviceUpload",
  data() {
    return {
      creatDprtForm: {
        name: "",
        gender: 0, // 旧接口修改 此字段有用 勿删
        phone: "",
        hid: "",
        sServerId: "",
        lng: "",
        lat: "",
        workTime: [
          {
            week: 0,
            begin: "",
            end: ""
          }
        ],
        diy: 0
      },
      worktime: {
        week: 0,
        begin: "",
        end: ""
      },
      diy: false,
      workday: [],
      week,
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
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const { creatDprtForm, worktime, diy } = this;
          // 用户是否选择diy部门工作时间，如果diy，上传diy的 否则上传diy: 0
          if (diy) {
            creatDprtForm.diy = 1;
            creatDprtForm.workTime = worktime.week === 0 ? [] : [worktime];
          } else {
            creatDprtForm.diy = 0;
            creatDprtForm.workTime = [];
          }
          const lat = creatDprtForm.lat || 0;
          const lng = creatDprtForm.lng || 0;
          createDepart({ ...creatDprtForm, lat, lng })
            .then(res => {
              this.succeed("update completed");
              this.resetForm();
              this.getSimpleDeparts();
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          this.failed("Please fill in valid information");
          return null;
        }
      });
    },
    resetForm() {
      this.creatDprtForm = {
        name: "",
        gender: 0, // 旧接口修改 此字段有用 勿删
        phone: "",
        hid: "",
        sServerId: "",
        lng: "",
        lat: "",
        workTime: [
          {
            week: 0,
            begin: "",
            end: ""
          }
        ],
        diy: 0
      };
      this.worktime = {
        week: 0,
        begin: "",
        end: ""
      };
      this.diy = false;
      this.workday = [];
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
    handleChange(val) {
      this.worktime.week = getWorkDay(val);
    }
  }
};
</script>
<style lang="scss" scoped>
.uploadWrap {
  margin-top: 0.2rem;
  height: 7.7rem;
  overflow: auto;
  .el-form {
    .el-form-item {
      .el-input {
        width: 4rem;
      }
      .el-select {
        width: 4rem;
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
}
</style>
