<template>
  <div>
    <el-row style="height: 9rem">
      <el-col :span="4" style="height: 100%">
        <el-menu
          :default-active="defaultActive"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
          unique-opened
          style="height: 100%"
        >
          <el-submenu
            v-for="item of routers"
            :key="item.id"
            :index="item.path"
          >
            <template slot="title">
              <i :class="item.iconClass"></i> <span>{{ item.title }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                v-for="item1 of item.children"
                :key="item1.id"
                :index="item1.path"
              >
                <img :src="item1.imgUrl" alt class="menu_icon" />
                <span slot="title">{{ item1.title }}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :span="20">
        <div class="Dashboard">
          <span>{{ onRouter }}</span>
        </div>
        <router-view></router-view>
      </el-col>
    </el-row>
    <el-row class="information">
      <p class="p1">Powered by Eye To Eye Security</p>
      <p class="p2">version: {{ version }}</p>
    </el-row>
  </div>
</template>
<script>
import axios from "axios";
import { mapState } from "vuex";
export default {
  name: "sderBar",
  data() {
    return {
      version: "",
      routerList: [
        {
          title: "Area Management",
          path: "4",
          iconClass: "el-icon-setting",
          id: 4,
          roles: [2], // 可以访问的角色
          children: [
            {
              id: "4-1",
              title: "Area Create",
              path: "/index/system/area/create",
              imgUrl: require("../assets/img/upload.png")
            },
            {
              id: "4-2",
              title: "Area Query",
              path: "/index/system/area/search",
              imgUrl: require("../assets/img/check.png")
            }
          ]
        },
        {
          title: "Company Management",
          path: "5",
          iconClass: "el-icon-setting",
          id: 5,
          roles: [2, 3],
          children: [
            {
              id: "5-1",
              title: "Company Create",
              path: "/index/system/company/create",
              imgUrl: require("../assets/img/upload.png")
            },
            {
              id: "5-2",
              title: "Company Query",
              path: "/index/system/company/search",
              imgUrl: require("../assets/img/check.png")
            }
          ]
        },
        {
          title: "Department Management",
          path: "2",
          iconClass: "el-icon-setting",
          id: 2,
          roles: [2, 3],
          children: [
            {
              id: "2-1",
              title: "Department Create",
              path: "/index/system/depart/upload",
              imgUrl: require("../assets/img/upload.png")
            },
            {
              id: "2-2",
              title: "Department Query",
              path: "/index/system/depart/search",
              imgUrl: require("../assets/img/check.png")
            }
          ]
        },
        {
          title: "Employee Management",
          path: "1",
          iconClass: "el-icon-setting",
          id: 1,
          roles: [2, 3],
          children: [
            {
              id: "1-1",
              title: "Employee Create",
              path: "/index/system/client/upload",
              imgUrl: require("../assets/img/upload.png")
            },
            {
              id: "1-2",
              title: "Employee Query",
              path: "/index/system/client/search",
              imgUrl: require("../assets/img/check.png")
            }
          ]
        },

        {
          title: "Gateway Management",
          path: "3",
          iconClass: "el-icon-setting",
          id: 3,
          roles: [2],
          children: [
            {
              id: "3-1",
              title: "Gateway Query",
              path: "/index/system/beacon/search",
              imgUrl: require("../assets/img/upload.png")
            },
            {
              id: "3-2",
              title: "Gateway Services Query",
              path: "/index/system/beacon/server",
              imgUrl: require("../assets/img/check.png")
            }
          ]
        },
        {
          title: "Account Management",
          path: "6",
          iconClass: "el-icon-setting",
          id: 6,
          roles: [2, 3],
          children: [
            {
              id: "6-1",
              title: "Account Create",
              path: "/index/system/account/create",
              imgUrl: require("../assets/img/upload.png")
            },
            {
              id: "6-2",
              title: "Account Query",
              path: "/index/system/account/search",
              imgUrl: require("../assets/img/check.png")
            }
          ]
        }
      ]
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
      return null;
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
      return null;
    }
  },
  mounted() {
    // console.log(this.$route);
  },
  created() {
    axios.get("/static/version.json").then(res => {
      this.version = res.data.version;
    });
  },
  computed: {
    ...mapState(["userInfo"]),
    defaultActive: function() {
      return this.$route.path;
    },
    onRouter: function() {
      // console.log(this.$route.meta.title);
      return this.$route.meta.title;
      // return null
    },
    routers() {
      // role===3: admin 不可进入区域已经gateway management
      const { role } = this.userInfo;
      const { routerList } = this;
      return routerList.filter(item => item.roles.includes(role));
    }
  }
};
</script>
<style lang="scss" scoped>
.Dashboard {
  // border: 1px solid red;
  height: 1rem;
  width: 100%;
  border-bottom: 1px solid #cfcbcb;
  background-color: #eee8e8;
  box-shadow: 3px 3px 2px #e4e2e2;
  line-height: 1rem;
  font-size: 0.24rem;
  padding: 0 15px;
  span {
    font-size: 0.24rem;

    font-style: italic;
    font-family: Arial, Helvetica;
    color: #424242;
  }
}
.menu_icon {
  width: 0.3rem;
  height: auto;
  margin-right: 5px;
}
.information {
  height: 0.55rem;
  background-color: #070731;
  display: flex;
  width: 100%;
  font-size: 0.22rem;
  color: #fff;
  justify-content: center;
  align-items: center;

  .p1 {
  }
  .p2 {
    display: table-cell;
    font-size: 12px;
    vertical-align: bottom;
    line-height: 100%;
    margin-left: 25px;
  }
}
.menubar,
.el-menu,
.el-menu-item-group {
  overflow: hidden;
}
.el-menu-item {
  width: 100%;
}
</style>
