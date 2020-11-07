<template>
  <div class="wrapper">
    <div class="main-left">
      <div class="div__ul">
        <el-button
          type="default"
          v-for="loca in locations"
          :key="loca.id"
          @click="chooseLocation(loca);"
          >{{ loca.name }}</el-button
        >
      </div>
      <ul class="company__ul">
        <li v-for="company in companyList" :key="company.id">
          <p @click="chooseCompany(company);">{{ company.name }}</p>
          <ul class="dept__ul">
            <li
              class="dept_item"
              v-for="dept in company.childList"
              :key="dept.id"
              @click="chooseDept(dept);"
            >
              {{ dept.name }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div id="map"></div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { deepClone } from "@/lib/utils";
export default {
  name: "Test",
  data() {
    return {
      map: null,
      markers: [],
      locations: [],
      companyList: []
    };
  },
  created() {
    const { location } = this.userInfo;
    const locations = deepClone(location, []);
    locations.forEach(loca => {
      loca.childList = loca.company;
      delete loca.company;
      loca.childList.forEach(comp => {
        comp.childList = comp.dept;
        comp.isFold_dept = true;
        delete comp.dept;
        comp.childList.forEach(dept => {
          dept.childList = dept.gateway;
          delete dept.gateway;
        });
      });
    });

    console.log(locations);
    this.locations = [...locations];
  },
  mounted() {
    this.initMap();
  },
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    initMap() {
      const mapOption = {
        zoom: 1,
        center: {
          lat: 0,
          lng: 0
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      const map = new google.maps.Map(
        document.getElementById("map"),
        mapOption
      );
      this.map = map;
    },
    renderLocationMap(arr) {
      if (arr.length === 0) {
        return;
      }
      // 清除上一个层级的标记
      const { markers, map } = this;
      if (markers.length) {
        markers.forEach(item => {
          item.setMap(null);
        });
      }
      // 重新渲染下一个层级的地图标记
      arr.forEach(item => {
        const { lat, lng, name } = item;
        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: map,
          icon: require("../assets/hicling/done2.png"),
          label: `${name}`
        });
        marker.addListener("click", () => {
          console.log(item);
        });
        markers.push(marker);
      });
      console.log(arr[0]);
      // 设置中心点：第一个非0坐标的，如果没有就第一个坐标
      const { lat, lng } =
        arr.find(item => item.lat !== 0 && item.lng !== 0) || arr[0];
      map.setCenter({ lat, lng });
    },
    chooseLocation(loca) {
      // const { childList } = loca;
      // this.companyList = [...childList];
      // this.renderLocationMap(childList);
      // this.map.setZoom(4)

      this.$_loading.show();
      setTimeout(() => {
        this.$_loading.hide();
      }, 5000);
    },
    chooseCompany(comp) {
      const { childList } = comp;
      this.renderLocationMap(childList);
      this.map.setZoom(6);
    },
    chooseDept(dept) {
      const { childList } = dept;
      this.map.setLabel = childList.length;
      this.map.setZoom(8);
    }
  }
};
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  .main-left,
  #map {
    flex: 5;
    height: 5rem;
    border: 1px solid red;
  }
  .main-left {
    font-size: 0.22rem;
    .div__ul {
      overflow: auto;
      width: 100%;
      height: 0.6rem;
      display: flex;
      align-items: center;
      border-bottom: 1px solid blue;
      button {
        margin-left: 15px;
        cursor: pointer;
      }
    }

    .dept__ul {
      padding-left: 25px;
      .dept_item {
        padding: 5px 0;
        cursor: pointer;
      }
    }
  }
}
</style>
