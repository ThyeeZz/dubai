<template>
  <div>
    <el-container style="width:16.06rem;">
      <el-main>
        <el-form
          ref="form"
          v-model="form"
          label-width="80px"
          width="2rem"
          :inline="true"
        >
          <el-form-item label="name" class="margin-bot">
            <el-input v-model="form.name" @keydown.enter.native.prevent="getData"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getData"
              >Search</el-button
            >
          </el-form-item>
        </el-form>

        <el-table :data="tableData" v-loading="loading" stripe>
          <!--
            <el-table-column prop="index" label="序号" width="100"></el-table-column>
          -->
          <el-table-column
            prop="clingId"
            label="ID"
            width="60"
          ></el-table-column>
          <el-table-column prop="name" label="Name"></el-table-column>
          <el-table-column
            prop="doctorName"
            label="Department"
          ></el-table-column>
          <el-table-column prop="mac" label="Mac"></el-table-column>
          <el-table-column
            prop="phone"
            label="Contact number"
          ></el-table-column>
          <el-table-column prop="Email" label="Email"></el-table-column>

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
import { Message } from "element-ui";
import { mapActions } from "vuex";
import { patientPager, delPatient } from "@/api/api";
import { refreshUser } from "@/api/api";
export default {
  name: "ClientSearch",
  props: [],
  data() {
    return {
      pagesize: 30,
      pageindex: 1,
      totalPage: 0,
      tableData: [],
      loading: false,
      form: {
        name: ""
      },
      userList: [],
      healthList: []
    };
  },
  methods: {
    ...mapActions(["getAllUser"]),
    refresh() {
      refreshUser()
        .then(res => {
          this.getAllUser();
        })
        .catch(err => {
          this.failed(
            "Information synchronization failed, please contact the background"
          );
        });
    },
    modify(row) {
      this.$router.push({
        path: "/index/system/client/edit",
        query: { row }
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
          const { id } = row;
          delPatient({ id }).then(res => {
            this.succeed("successfully deleted");
            this.getData();
            this.refresh();
          });
        })
        .catch(() => {
          return;
        });
    },
    getData() {
      this.loading = true;
      const { pagesize, pageindex, form } = this;
      patientPager({ ...this.form, pagesize, pageindex })
        .then(res => {
          this.tableData = [];
          this.loading = false;
          const { content, totalElements } = res.data;
          this.totalPage = totalElements;
          for (let item of content) {
            const {
              clingId,
              doctorId,
              doctorName,
              gender,
              name,
              phone,
              contact,
              mac,
              id,
              idcard,
              Email,
              address,
              diy,
              workTime,
              tz
            } = item;
            this.tableData.push({
              id,
              clingId,
              doctorId,
              doctorName: doctorName === "未知" ? "Unknown" : doctorName,
              gender,
              name,
              mac,
              phone,
              idcard,
              contact,
              Email,
              address,
              diy,
              workTime,
              tz
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
    margin-right: 20px;
    text-align: left;
    box-sizing: border;
    padding-top: 20px;
  }
  .el-table {
    height: 6.5rem;
    overflow: auto;
    &::before {
      content: "";
      background-color: transparent;
    }
  }

  .el-table__row {
    height: 0.46rem;
  }
}
</style>
