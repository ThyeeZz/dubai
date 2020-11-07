<template>
  <div class="area-search">
    <div class="search-form-wrapper">
      <el-form v-model="searchForm">
        <el-form-item label="Area name">
          <el-input v-model="searchForm.name" @keydown.enter.native.prevent='getData'></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData">Search</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-wrapper">
      <el-table :data="tableData" style="width: 100%" height="100%">
        <el-table-column prop="id" label="ID" width="50"> </el-table-column>
        <el-table-column prop="name" label="Name"></el-table-column>
        <el-table-column prop="lat" label="Latitude"></el-table-column>
        <el-table-column prop="lng" label="Longitude"></el-table-column>
        <el-table-column label="Operation">
          <template slot-scope="{ row }">
            <el-button type="text" @click="modify(row);">Modify</el-button>
            <el-button type="text" @click="del(row);">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageindex"
        :page-sizes="[15, 30, 50, 100]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 更新弹出 dialog -->
    <el-dialog title="Modify Area" :visible.sync="dialogFormVisible">
      <el-form
        :model="modifyForm"
        ref="ruleForm"
        :rules="rules"
        class="modify-form"
      >
        <el-form-item label="Area name" prop="name">
          <el-input v-model="modifyForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Latitude">
          <el-input v-model="modifyForm.lat"></el-input>
        </el-form-item>
        <el-form-item label="Longitude">
          <el-input v-model="modifyForm.lng"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false;">Cancel</el-button>
        <el-button type="primary" @click="submitModify">Submit</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAreaPager, updateArea, deleteArea } from "@/api/api";
import { mapActions, maptActions } from 'vuex';
export default {
  name: "AreatSearch",
  data() {
    return {
      dialogFormVisible: false,
      tableData: [],
      pageindex: 1,
      pagesize: 15,
      total: 0,
      searchForm: {
        name: ""
      },
      modifyForm: {
        id: "",
        name: "",
        lat: 0,
        lng: 0
      },
      rules: {
        name: [
          { required: true, message: "Please inout area name", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    ...mapActions(["getAreaList"]),
    getData() {
      const { pageindex, pagesize, searchForm } = this;
      getAreaPager({ ...searchForm, pagesize, pageindex })
        .then(res => {
          const { content, totalElements } = res.data;
          this.tableData = [...content];
          this.total = totalElements;
        })
        .catch(err => {
          console.log(err);
        });
    },
    modify(row) {
      this.dialogFormVisible = true;
      const { id, name, lat, lng } = row;
      this.modifyForm = { id, name, lat, lng };
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
          deleteArea({ id }).then(res => {
            this.succeed('Delete successfully');
            this.getData();
            this.getAreaList();
          }).catch(err=>{
            console.log(err)
          })
        })
        .catch(() => {
          return false;
        });
    },
    submitModify() {
      const { modifyForm } = this;
      updateArea(modifyForm)
        .then(res => {
          this.succeed("Update completed");
          this.dialogFormVisible = false;
          this.getData();
          this.getAreaList();
        })
        .catch(err => {
          console.log(err);
        });
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
.area-search {
  width: 100%;
  height: 8rem;
  .search-form-wrapper {
    height: 1.2rem;
    .el-form {
      height: 100%;
      display: flex;
      padding: 0.1rem 0.2rem;
      align-items: center;
      justify-content: flex-start;
      .el-form-item {
        display: flex;
        align-items: center;
        margin: 0 20px 0 0;
        .el-form-item__label {
          width: 1.5rem;
        }
        .el-form-item__content {
          width: 3rem;
        }
      }
    }
  }
  .table-wrapper {
    height: 5.8rem;
  }
  .pagination {
    height: 1rem;
    .el-pagination {
      box-sizing: border-box;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
  .modify-form /deep/ {
    .el-form-item {
      display: flex;
      .el-form-item__label {
        width: 1.5rem;
      }
      .el-form-item__content {
        width: 5rem;
      }
    }
  }
}
</style>
