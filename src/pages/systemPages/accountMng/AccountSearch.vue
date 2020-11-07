<template>
  <div>
    <el-container style="width:16.06rem;">
      <el-main>
        <el-form
          ref="form"
          v-model="form"
          label-width="100px"
          width="2rem"
          :rules="rules"
          :inline="true"
        >
          <el-form-item label="Username" class="margin-bot">
            <el-input v-model="form.name" v-on:keydown.enter.native.prevent="getData"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getData">Search</el-button>
          </el-form-item>
        </el-form>

        <el-table :data="tableData" v-loading="loading" stripe>
          <el-table-column prop="id" label="ID" width="150"></el-table-column>
          <el-table-column prop="username" label="Username"></el-table-column>
          <el-table-column prop="roleCn" label="Role"></el-table-column>
          <el-table-column prop="departs" label="Department"></el-table-column>
          <el-table-column prop="email" label="Email"></el-table-column>
          <el-table-column label="Operation">
            <template slot-scope="{row}">
              <el-button
                @click="modify(row);"
                type="text"
                size="normal"
                :disabled="row.id == 3"
                >Modify</el-button
              >
              <el-button
                @click="del(row);"
                type="text"
                size="normal"
                :disabled="row.id == 3"
                >Delete</el-button
              >
              <el-button
                @click="kickout(row);"
                type="text"
                size="normal"
                :disabled="row===2"
                >Force Logout</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 修改部门信息 dialog -->
        <el-dialog
          title="Account information modification"
          :visible.sync="dialogFormVisible"
        >
          <el-form
            :model="modifyForm"
            class="create-user-form"
            :rules="rules"
            label-width="150px"
            ref="modifyForm"
            width="4rem"
          >
            <el-form-item label="Uername" prop="username">
              <el-input v-model="modifyForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="Password">
              <el-input
                type="password"
                placeholder="blank or input new password"
                v-model="modifyForm.password"
              ></el-input>
            </el-form-item>
            <el-form-item label="Email" prop="email">
              <el-input v-model="modifyForm.email"></el-input>
            </el-form-item>
            <el-form-item label="Role" prop="role">
              <el-select v-model="modifyForm.role">
                <el-option
                  v-for="role in roleList"
                  :label="role.name"
                  :value="role.id"
                  :key="role.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <!--
              <el-form-item label="Affiliated company" prop="hid">
                <el-select v-model="modifyForm.hid">
                  <el-option
                    v-for="item in companyList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            -->
            <el-form-item label="Departments" prop="dept">
              <el-checkbox-group
                v-model="modifyForm.dept"
                @change="handleCheckedChange"
              >
                <el-checkbox
                  v-for="item in departsList"
                  :label="item.id"
                  :key="item.id"
                  >{{ item.name }}</el-checkbox
                >
              </el-checkbox-group>
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
import md5 from "md5";
import { mapState, mapActions } from "vuex";
import { getAllClient, deleteClient, updateUser, forceLogout } from "@/api/api";
import { emailCheck } from "@/lib/utils";
export default {
  name: "AccountSearch",
  data() {
    return {
      dialogFormVisible: false,
      pagesize: 30,
      pageindex: 1,
      totalPage: 0,
      tableData: [],
      loading: false,
      role: 0,
      form: {
        name: ""
      },
      modifyForm: {
        username: "",
        password: "",
        email: "",
        role: 0,
        dept: [],
        hid: 0,
        id: ""
      },
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
      },
      companyList: [],
      departsList: []
    };
  },
  methods: {
    ...mapActions(["getSimpleDeparts", "getCompanyList"]),
    modify(row) {
      this.dialogFormVisible = true;
      let { dept, email } = row;
      email = email === "--" ? "" : email;
      this.modifyForm = { ...row, email, dept: JSON.parse(dept) };
    },
    del(row) {
      this.$confirm("Are you sure to delete?", "prompt", {
        confirmButtonText: "Comfirm",
        cancelButtonText: "Cancel",
        type: "warning",
        center: true
      })
        .then(() => {
          const { id } = row;
          deleteClient({ id }).then(res => {
            this.succeed("successfully deleted");
            this.getData();
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    async getData() {
      this.loading = true;
      const { form, pagesize, pageindex } = this;
      getAllClient({ ...form, pagesize, pageindex })
        .then(res => {
          this.loading = false;
          this.tableData = [];
          const { content, totalElements } = res.data;
          this.totalPage = totalElements;
          content.forEach(item => {
            const { dept, hid, id, role, username, email } = item;
            this.tableData.push({
              dept,
              hid,
              id,
              email: email || "--",
              role,
              username,
              roleCn:
                role === 1
                  ? "NormalUser"
                  : role === 2
                  ? "SuperAdministrator"
                  : "Adminstrator",
              companyname: this.getCompanyName(hid),
              departs: this.getDeparts(JSON.parse(dept))
            });
          });
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
          let { password } = this.modifyForm;
          let { modifyForm } = this;
          if (password) {
            password = md5(password).toUpperCase();
            modifyForm = { ...modifyForm, password };
          } else {
            delete modifyForm.password;
          }
          updateUser(modifyForm)
            .then(res => {
              this.succeed("update completed,please relogin!");
              this.dialogFormVisible = false;
              this.getData();
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
      try {
        if (hid !== 0) {
          let company = this.companyList.find(item => item.id == hid);
          return company.name;
        } else {
          return "--";
        }
      } catch (error) {
        console.log(error);
        return "Company may have been deleted";
      }
    },
    getDeparts(dptList) {
      let tempArr = [];
      if (dptList.length == 0) {
        tempArr = ["No"];
      } else {
        for (let i of dptList) {
          for (let j of this.departsList) {
            if (j.id == i) {
              tempArr.push(j.name);
            }
          }
        }
      }

      return tempArr.toString();
    },
    handleCheckedChange(value) {
      console.log(this.modifyForm.dept);
    },
    kickout({id}){
      forceLogout({id}).then(res=>{
        this.succeed('Force logout succeddfully')
      }).catch(err=>{
        console.log(err)
      })
    }
  },
  mounted() {
    const p1 = this.getSimpleDeparts();
    const p2 = this.getCompanyList();
    Promise.all([p1, p2]).then(res => {
      this.departsList = res[0];
      this.companyList = res[1];
      this.getData();
    });
    this.role = this.userInfo.role;
  },
  created(){
    this.role = this.userInfo.role;
  },
  computed: {
    ...mapState(["userInfo", "roleList"])
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
    height: 0.5rem;
    position: absolute;
    bottom: 0;
    right: 20px;
  }
}
.el-main /deep/ {
  width: 100%;
  height: 7.5rem;
  padding: 0;
  overflow: auto;
  .el-form {
    box-sizing: border-box;
    padding-top: 20px;
    text-align: left;
    height: 1rem;
  }
  .el-table {
    height: 6.5rem;
    overflow: auto;
  }

  .el-table__row {
    height: 0.46rem;
  }
  .el-dialog {
    .el-dialog__header {
      height: 0.5rem;
      display: flex;
    }
    .el-dialog__body {
      .create-user-form {
        height: auto;
        .el-form-item {
          .el-input {
            width: 3rem !important;
          }
        }
      }
    }
  }
}
.el-select,
.el-input {
  width: 3rem;
}
</style>
