<template>
  <div class="uploadWrap" loading='loading'>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="1.8rem"
      class="demo-ruleForm"
    >
      <el-form-item label="Name" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="Userid" prop="clingId">
        <el-input v-model="ruleForm.clingId"></el-input>
      </el-form-item>
      <el-form-item label="IDCard" prop="idcard">
        <el-input v-model="ruleForm.idcard"></el-input>
      </el-form-item>
      <el-form-item label="Address" prop="address">
        <el-input v-model="ruleForm.address"></el-input>
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model="ruleForm.email"></el-input>
      </el-form-item>
      <el-form-item label="Gender" prop="gender">
        <el-radio-group v-model="ruleForm.gender">
          <el-radio :label="1">male</el-radio>
          <el-radio :label="0">female</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Contact number" prop="phone">
        <el-input v-model="ruleForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="Emergency contact">
        <div
          :inline="true"
          class="contact-from"
          v-for="(item, index) in n"
          :key="index"
        >
          <el-input
            v-model="contact[index].name"
            placeholder="Enter the name"
          ></el-input>
          <el-input
            v-model="contact[index].phone"
            placeholder="Enter email/phone"
          ></el-input>
          <i
            class="el-icon-circle-plus-outline"
            @click="addcontact"
            v-show="index === n - 1"
          ></i>
          <i
            class="el-icon-remove-outline"
            @click="reduceContact(index);"
            v-show="index === n - 1 && index !== 0"
          ></i>
        </div>
      </el-form-item>
      <el-form-item label="Department" prop="doctorId">
        <el-select v-model="ruleForm.doctorId" placeholder="please choose">
          <el-option
            v-for="item in departList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Time zone" prop="tz">
        <el-select v-model="ruleForm.tz" placeholder="please choose">
          <el-option
            v-for="item in timeZoneList"
            :key="item.id"
            :label="item.label"
            :value="item.value"
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
import { mapActions, mapState } from "vuex";
import { addPatient,refreshUser } from "@/api/api";
import { emailCheck, getWorkDay, week, deepClone, timeZoneList } from "@/lib/utils";
export default {
  name: "deviceUpload",
  data() {
    return {
      loading: false,
      ruleForm: {
        name: "",
        gender: 1,
        doctorId: "",
        clingId: "",
        tz: '', // 时区
        idcard: "",
        phone: "",
        address: "",
        email: "",
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
      contact: [{}],
      timeZoneList,
      rules: Object.freeze({
        name: [
          {
            required: true,
            message: "Please input employee name",
            trigger: "blur"
          }
        ],
        clingId: [
          {
            required: true,
            message: "Please input ETE UserID",
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
        doctorId: [
          {
            required: true,
            message: "Please choose department",
            trigger: "blur"
          }
        ],
        tz:[
          {
            required: true,
            message: "Please choose department",
            trigger: "blur"
          }
        ],
        address: [
          { required: true, message: "Please input address", trigger: "blur" }
        ],
        email: [
          {
            required: true,
            validator: emailCheck,
            trigger: "blur"
          }
        ],
        idcard: [
          { required: true, message: "Please input address", trigger: "blur" }
        ]
      }),
      n: 1 // 紧急联系人个数
    };
  },
  computed: {
    ...mapState(["departList"])
  },
  methods: {
    ...mapActions(["getAllUser"]),
    refresh() {
      refreshUser()
        .then(res => {
          this.getAllUser()
        })
        .catch(err => {
          console.log(err);
          this.failed(
            "Information synchronization failed, please contact the background"
          );
        });
    },
    submitForm(formName) {
      let { ruleForm, contact, diy, worktime } = this;
      let contact_copy = deepClone(contact, []);
      // 用户是否选择diy部门工作时间，如果diy，上传diy的 否则上传diy: 0
      if (diy) {
        ruleForm.diy = 1;
        ruleForm.workTime = worktime.week === 0 ? [] : [worktime];
      } else {
        ruleForm.diy = 0;
        ruleForm.workTime = [];
      }

      contact_copy.forEach((item, index, arr) => {
        if (Object.keys(item).length !== 2) {
          arr.splice(index, 1);
        }
      });

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          addPatient({
            ...ruleForm,
            contact: contact_copy
          })
            .then(res => {
              this.loading = false;
              this.succeed("Upload information successfully");
              this.refresh();
              this.resetForm();
            })
            .catch(err => {
              this.loading = false;
              console.log(err);
            });
        } else {
          this.failed("Please fill in valid information");
          return null;
        }
      });
    },
    resetForm() {
      Object.assign(this.data, this.$options.data());
      this.n = 1;
      this.contact = [{}];
    },
    addcontact() {
      console.log(this.contact);
      this.contact.push({});
      this.n++;
    },
    reduceContact(n) {
      console.log(this.contact);
      this.contact.splice(n, 1);
      this.n--;
    },
    handleChange(val) {
      this.worktime.week = getWorkDay(val);
    }
  }
};
</script>
<style lang="scss" scoped>
.uploadWrap {
  height: 7.8rem;
  margin-top: 0.2rem;
  overflow: auto;
  .el-form {
    .el-form-item {
      .el-input {
        width: 3rem;
      }
      .el-select {
        width: 3rem;
      }
    }
  }
  .el-icon-remove-outline,
  .el-icon-circle-plus-outline {
    color: #dcdfe6;
    font-size: 18px;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
}
</style>
