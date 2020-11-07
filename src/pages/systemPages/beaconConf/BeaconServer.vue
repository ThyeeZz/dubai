<template>
  <div class="deploy">
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="id" label="Gateway ID"></el-table-column>
      <el-table-column prop="name" label="Gateway name"></el-table-column>
      <el-table-column prop="status" label="Gateway status"></el-table-column>
      <!-- <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">部署</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>
<script>
import { getSocketSimpleList } from '@/api/api';
export default {
  name: "BeaconDeploy",
  data() {
    return {
      tableData: []
    };
  },
  methods: {
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
    getData() {
      getSocketSimpleList()
        .then(res => {
          const {data} = res;
          for (let i of data) {
            this.tableData.push({
              id: i.id,
              name: i.name,
              status: this.getStatus(i.status)
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
<style lang="scss" scoped>
.deploy{
  height: 7.8rem;
  overflow: auto;
  .el-table{
    height: 7rem;
    overflow: auto;
  }
}
</style>