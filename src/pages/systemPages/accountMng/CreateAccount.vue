<template>
  <div class="create-user">
    <el-form
      :model="userForm"
      class="create-user-form"
      :rules="rules"
      ref="userForm"
      label-width="150px"
    >
      <el-form-item label="Username" prop="username">
        <el-input v-model="userForm.username"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input type="password" v-model="userForm.password"></el-input>
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model="userForm.email"></el-input>
      </el-form-item>
      <el-form-item label="Role" prop="role">
        <el-select v-model="userForm.role" placeholder="please select">
          <el-option
            v-for="role in roleList"
            :label="role.name"
            :value="role.id"
            :key="role.name"
          ></el-option>
        </el-select>
      </el-form-item>
      
        <el-form-item label="Affiliated company" prop="hid">
          <el-select v-model="userForm.hid" placeholder="please select">
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
     
      <el-form-item label="Departments" prop="dept">
        <el-checkbox-group
          v-model="userForm.dept"
          @change="handleCheckedChange"
        >
          <el-checkbox
            v-for="item in deptList"
            :label="item.id"
            :key="item.id"
            >{{ item.name }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('userForm');"
          >Submit</el-button
        >
        <el-button @click="resetForm('userForm');">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import md5 from "md5";
import { mapState } from "vuex";
import { addUser, getMyDoctor } from "@/api/api";
import { emailCheck } from '@/lib/utils';
export default {
  name: "createUser",
  data() {
    return {
      userForm: {
        username: "",
        password: "",
        email: '',
        role: 1,
        dept: [],
        hid: 0
      },
      companyList: [],
      deptList: [],
      rules: {
        username: [
          { required: true, message: "please enter user name", trigger: "blur" }
        ],
        password: [
          { required: true, message: "please enter pawword", trigger: "blur" }
        ],
        role: [
          {
            required: true,
            message: "Please select a user role",
            trigger: "blur"
          }
        ],
        hid: [
          {
            required: true,
            message: "Please select the company",
            trigger: "blur"
          }
        ],
        dept: [
          {
            required: true,
            message: "Please tick the department",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            validator: emailCheck,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let pass = md5(this.userForm.password).toUpperCase();
          addUser({ ...this.userForm, password: pass })
            .then(res => {
              this.succeed("Created successfully");
              this.resetForm("userForm");
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleCheckedChange(value) {
      console.log(this.userForm.dept);
    }
  },
  computed: {
    ...mapState(["roleList"])
  },
  created() {
    getMyDoctor()
      .then(res => {
        const { company, dept } = res.data;
        this.companyList = [...company];
        this.deptList = [...dept];
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>
<style lang="scss" scoped>
.create-user-form /deep/ {
  margin-top: 20px;
  .el-input {
    width: 250px;
  }
}
</style>
