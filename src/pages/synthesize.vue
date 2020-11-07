<template>
  <div id="synthesize">
    <div class="main-left">
      <div class="location_selector">
        <!-- 位置名称 -->
        <div class="company_title">
          <span class="location"></span>
          <div class="company_title_wrap">
            <div class="company_title_content" ref="companyContent">
              <p
                class="company_title_item overFlow"
                v-for="(location, index) in locations"
                :key="location.id + String(index)"
                @click="chooseLocation($event, location);"
              >
                {{ location.name }}
              </p>
            </div>
          </div>
          <div
            class="arrow_icon"
            @click="moveRight"
            v-if="locations.length > 3"
          >
            <i class="el-icon-d-arrow-right"></i>
          </div>
        </div>

        <!-- 公司名称 -->
        <div class="company_detail">
          <div
            class="company_detail_item"
            v-for="company in companyList"
            :key="company.id"
          >
            <div class="company_detail_wrap">
              <p class="overFlow" @click.self="isFold(company);">
                {{ company.name }}
              </p>
              <i class="el-icon-caret-bottom" v-show="company.isFold_dept"></i>
              <i class="el-icon-caret-top" v-show="!company.isFold_dept"></i>
            </div>

            <!-- 部门选择 -->
            <div
              class="dept_item"
              v-for="dept in company.dept"
              :key="dept.id"
              @click.stop="chooseDept($event, dept);"
              v-show="!company.isFold_dept"
            >
              {{ dept.name }}
            </div>
          </div>
        </div>
      </div>

      <div class="device">
        <h3>Smart Health Devices</h3>
        <ul>
          <li v-for="item in deviceList" :key="item.name">
            <span :class="item.deviceName"></span>
            <div class="device-percent">
              <span>{{ item.name }}</span>
              <v-progress
                :color="item.color"
                :height="0.24"
                :percentage="item.percent"
              ></v-progress>
            </div>
            <span class="device-number" :style="{ color: item.color }">
              <i>{{ item.number }}</i> <i>pcs</i>
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div class="main-center">
      <div class="main-center-map" id="map">
        <p v-show="mapFlag">not support google maps</p>
      </div>
      <div class="main-center-bigData">
        <h3>Community Health Profile</h3>
        <div class="dayData">
          <router-link class="data-box" tag="div" to="/index/activity">
            <h6>Average Temperature</h6>
            <div class="data-item">
              <span class="temp"></span>
              <span class="data" style="color:#3DDAFB">
                <i>{{ profileData.temp.toFixed(1) }}</i>
                <i class="small temp-unit"></i>
              </span>
            </div>
          </router-link>
          <router-link class="data-box" tag="div" to="/index/reports">
            <h6>Total Alarms</h6>
            <div class="data-item">
              <span class="warning-red"></span>
              <span class="data" style="color:#FC397B">
                <i>{{ profileData.alert }}</i> <i class="small">times</i>
              </span>
            </div>
          </router-link>
          <router-link class="data-box" tag="div" to="/index/sleep">
            <h6>Sleep Activities</h6>
            <div class="data-item">
              <span class="sleep-red"></span>
              <span class="data" style="color:#E156F1">
                <i>{{ getAverageSleep_Hour }}</i> <i class="small">h</i>
                <i>{{ getAverageSleep_Minute }}</i> <i class="small">m</i>
              </span>
            </div>
          </router-link>
          <router-link class="data-box" tag="div" to="/index/activity">
            <h6>Steps Activities</h6>
            <div class="data-item">
              <span class="step"></span>
              <span class="data" style="color:#93FF6D">
                <i>{{ profileData.step }}</i> <i class="small">steps</i>
              </span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <div class="main-right">
      <h3>Basic User information</h3>
      <div class="basic-information">
        <div class="basic-information-title"><p>Gender</p></div>
        <div class="basic-information-content">
          <div class="first-info">
            <div class="first-info-left">
              <span class="male"></span> <span class="small">male</span>
            </div>
            <div class="first-info-right">
              <span class="small">female</span> <span class="female"></span>
            </div>
          </div>
          <div class="second-info">
            <span>{{ malPercent ? malPercent + "%" : "0%" }}</span>
            <span>{{ falPercent ? falPercent + "%" : "0%" }}</span>
          </div>
          <div class="third-info">
            <span :style="{ width: `calc(${malPercent}% - 0.15rem)` }"></span>
            <span :style="{ width: `calc(${falPercent}% - 0.15rem)` }"></span>
          </div>
        </div>
      </div>
      <div class="basic-information">
        <div class="basic-information-title"><p>Age</p></div>
        <div
          id="ageCharts"
          class="basic-information-content"
          style="height:2.25rem;margin-top:10px"
        ></div>
      </div>
      <div class="basic-information">
        <div class="basic-information-title">
          <p>{{ titleName }}</p>
        </div>
        <div
          id="barCharts"
          class="basic-information-content"
          style="height:2.25rem;margin-top:10px"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
import VProgress from "@/component/VProgress";
import { mapMutations, mapState, mapActions } from "vuex";
import { getStatisticsDataApi } from "@/api/api";
import { deepClone } from "@/lib/utils";

export default {
  name: "Synthesize",
  components: {
    VProgress
  },
  data() {
    return {
      titleName: "Locations",
      userList: [],
      mapFlag: false,
      profileData: {
        alert: 0,
        sleep: 0,
        step: 0,
        temp: 0
      },
      deviceList: Object.freeze([
        {
          name: "ETE-TH07",
          deviceName: "ETE",
          number: 0,
          percent: 0,
          color: "#37F8FF"
        },
        {
          name: "ETE-TH07A",
          deviceName: "Aura",
          number: 0,
          percent: 0,
          color: "#65FFA8"
        },
        {
          name: "ETE-TH07L",
          deviceName: "Leap",
          number: 0,
          percent: 0,
          color: "#F28A5C"
        }
      ]),
      locations: [],
      companyList: [],
      map: null,
      markers: [],
      moveTimes: 1,
      ageCharts: null,
      barCharts: null,
      id: 0
    };
  },
  methods: {
    ...mapActions(["getActiveNum", "getAllUser"]),
    ...mapMutations(["saveLeaveDprtId"]),
    setBaseData() {
      // 设置设备的百分比
      const len = this.userList.length;
      this.deviceList.forEach(device => {
        let temArr = this.userList.filter(
          item => item.deviceId === device.deviceName
        );
        let length = temArr.length;
        device.number = length;
        device.percent = Math.round((length / len) * 100);
      });

      this.setAgeData(this.userList);
    },
    setAgeData(arr) {
      const Xdata = [],
        Ydata = [];
      const calcAgeRange = (item, target) => {
        if (item.age <= 18) {
          target[0].value++;
        } else if (item.age > 18 && item.age <= 25) {
          target[1].value++;
        } else if (item.age > 25 && item.age <= 75) {
          let x = Math.ceil((item.age - 26) / 10) + 2;
          target[x].value++;
        } else {
          target[7].value++;
        }
        return target;
      };
      const target = [
        { key: "<18", value: 0 },
        { key: "19-25", value: 0 },
        { key: "26-35", value: 0 },
        { key: "36-45", value: 0 },
        { key: "46-55", value: 0 },
        { key: "56-65", value: 0 },
        { key: "66-75", value: 0 },
        { key: ">75", value: 0 }
      ];
      arr.forEach(item => {
        calcAgeRange(item, target);
      });
      target.forEach(item => {
        const { key, value } = item;
        Xdata.push(key);
        Ydata.push(value);
      });

      this.initBarCharts({
        ele: "ageCharts",
        Xdata,
        Ydata
      });
    },
    setLocationChartsData() {
      const Xdata = [],
        Ydata = [];
      this.locations.forEach(item => {
        const { name, total } = item;
        Xdata.push(name);
        Ydata.push(total);
      });
      this.initBarCharts({
        ele: "barCharts",
        Xdata,
        Ydata
      });
    },
    // 渲染柱状图
    initBarCharts({ ele, Xdata, Ydata }) {
      const barCharts = this.$echarts.init(document.getElementById(ele));
      const option = {
        color: ["#58DDFF"],
        tooltip: {
          trigger: "item"
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          top: "5%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: Xdata,
          show: false
        },
        yAxis: {
          type: "value",
          axisLabel: {
            textStyle: {
              color: "#fff",
              fontSize: "12px"
            }
          },
          splitLine: false
        },
        series: [
          {
            type: "bar",
            barWidth: 16,
            data: Ydata
          }
        ]
      };
      barCharts.setOption(option);
      this[ele] = barCharts;
    },
    // 谷歌地图 init函数
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
    renderMarkers(arr, coordinate, id) {
      // 清除上一次的标记点
      const { markers, map } = this;
      if (markers.length) {
        markers.forEach(item => {
          item.setMap(null);
        });
      }
      // 循环进行标记
      arr.forEach(gateway => {
        const { lat, lng, name } = gateway;
        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: map,
          icon: require("../assets/hicling/done2.png"),
          label: `${name}`
        });
        marker.addListener("click", () => {
          this.id = id;
          this.$router.push({ path: "/index/activity" });
        });
        markers.push(marker);
      });

      map.setCenter(coordinate);
      map.setZoom(4);
    },
    async getUserList() {
      this.userList = await this.getAllUser();
      this.setBaseData();
      this.getStatisticsData();
    },
    getStatisticsData() {
      getStatisticsDataApi().then(res => {
        try {
          let { data } = res;
          this.profileData = { ...data };
        } catch (error) {
          console.log(error);
        }
      });
    },
    // 点击选择位置信心，计算属性 getCompanyList 响应更换已选位置
    chooseLocation(e, val) {
      // const center = {
      //   lat: 32.222,
      //   lng: 121.3666
      // }
      // this.map.setCenter(center)
      const { company } = val;
      this.companyList = [...company];
      const company_title_item = document.getElementsByClassName(
        "company_title_item"
      );
      Array.prototype.forEach.call(company_title_item, item => {
        item.classList.remove("choose");
      });

      e.target.classList.add("choose");
    },
    chooseDept(e, dept) {
      const dept_item = document.getElementsByClassName("dept_item");
      Array.prototype.forEach.call(dept_item, item => {
        item.classList.remove("choose");
      });
      e.target.classList.add("choose");
      const { gateway, id, lat, lng } = dept;

      const gatewayHW = gateway.filter(item => item.mac.length === 17);
      const gatewaySW = gateway.filter(item => item.mac.length !== 17);

      // 移动网关的坐标使用 部门的坐标，只显示一个点，label显示移动网关的数量
      // 拼接上 固定网管的数据 进行渲染标记
      gatewayHW.push({
        lat,
        lng,
        name: gatewaySW.length
      });
      this.renderMarkers(gatewayHW, { lat, lng }, id);
    },
    moveRight() {
      const { locations, moveTimes } = this;
      const { companyContent } = this.$refs;
      companyContent.style.transform = `translateX(${-1.3 * moveTimes}rem)`;
      this.locations.push(locations[moveTimes - 1]);
      this.moveTimes++;
    },
    // 展开
    isFold(company) {
      this.titleName = "Departments";
      const dprtList = [];
      let { isFold_dept, dept } = company;
      const Xdata = [],
        Ydata = [];
      dept.forEach(item => {
        const { name, total } = item;
        Xdata.push(name);
        Ydata.push(total);
      });

      this.initBarCharts({
        ele: "barCharts",
        Xdata,
        Ydata
      });
      company.isFold_dept = !isFold_dept;
    }
  },
  mounted() {
    try {
      this.initMap();
    } catch (err) {
      this.mapFlag = true;
    }
    const target = document.getElementsByClassName("company_title_item")[0];
    target.classList.add("choose");
    this.setLocationChartsData();
  },
  created() {
    this.getUserList();
    const { location } = this.userInfo;
    location.forEach(loca => {
      const { company } = loca;
      company.forEach(comp => {
        comp.isFold_dept = true; // 折叠
      });
    });
    this.locations = deepClone(location, []);
    this.companyList = this.locations[0]["company"];

    window.addEventListener("resiez", () => {
      this.ageCharts.resize();
      this.barCharts.resize();
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.ageCharts.resize();
      this.barCharts.resize();
    });
  },
  computed: {
    ...mapState(["userInfo", "onlineInfo"]),
    getAverageSleep_Hour() {
      let { sleep } = this.profileData;
      return Math.floor(sleep / 60 / 60);
    },
    getAverageSleep_Minute() {
      let { sleep } = this.profileData;
      return Math.round(sleep / 60) % 60;
    },
    malPercent() {
      let maleLen = this.userList.filter(item => item.gender === 1).length;
      let res = Math.round((maleLen / this.userList.length) * 100);
      return res;
    },
    falPercent() {
      let femaleLen = this.userList.filter(item => item.gender === 0).length;
      if (femaleLen !== 0) {
        return 100 - this.malPercent;
      } else {
        return 0;
      }
    }
  },
  beforeRouteLeave(to, form, next) {
    if (this.id) {
      this.saveLeaveDprtId(this.id);
    }
    next();
  }
};
</script>
<style lang="scss" scoped>
@import "../style/minix.scss";
#synthesize {
  display: flex;
  padding: 0.23rem 0.2rem 0.23rem;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  color: #fff;
  font-size: 0.2rem;
  background-color: #030318;
}
.main-left {
  width: 5.8rem;
}
.location_selector {
  box-sizing: border-box;
  width: 100%;
  height: 5.2rem;
  background: rgba(255, 255, 255, 0.1);
  opacity: 1;
  border-radius: 8px;
  .company_title {
    width: 5.4rem;
    height: 0.6rem;
    box-sizing: border-box;
    padding: 0.1rem 0.2rem 0;
    border-bottom: 1px solid #1977f2;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .location {
      display: inline-block;
      width: 0.5rem;
      height: 0.5rem;
      background: url("../assets/hicling/location.png") center center no-repeat;
      background-size: contain;
    }
    .company_title_wrap {
      width: 4.8rem;
      display: flex;
      align-items: flex-end;
      overflow-x: auto;
      scrollbar-width: none;

      .company_title_content {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        transition: all 0.5s linear;
        .company_title_item {
          display: inline-block;
          width: 1.2rem;
          height: 0.4rem;
          background-color: #1977f2;
          color: #fff;
          cursor: pointer;
          margin-right: 0.1rem;
          border-radius: 5px 5px 0 0;
          line-height: 0.4rem;
          text-align: center;
          box-sizing: border-box;
          padding: 0 0.05rem;
          &:hover {
            background-color: #4a8feb;
          }
        }
        .choose {
          background-color: #4a8feb;
          &:hover {
            background-color: #1977f2;
          }
        }
      }
    }
    .arrow_icon {
      width: 0.5rem;
      font-size: 0.28rem;
      line-height: 0.5rem;
      text-align: center;
      cursor: pointer;
    }
  }
  .company_detail {
    box-sizing: border-box;
    padding: 0.1rem 0.2rem;
    height: calc(100% - 0.6rem);
    overflow: auto;
    .company_detail_wrap {
      display: flex;
    }
    p {
      height: 0.4rem;
      line-height: 0.4rem;
      cursor: pointer;
    }
    i {
      display: inline-block;
      width: 0.4rem;
      height: 0.4rem;
      font-size: 0.28rem;
      line-height: 0.4rem;
      text-align: center;
      cursor: pointer;
    }
    .dept_item {
      padding: 0.1rem 0.4rem;
      cursor: pointer;
    }
    .choose {
      background-color: rgba(92, 88, 88, 0.5);
    }
  }
}

.device {
  margin-top: 0.32rem;
  h3 {
    height: 0.34rem;
    line-height: 0.34rem;
    background: rgba(25, 119, 242, 1);
    text-align: center;
    font-size: 0.22rem;
    color: #fff;
  }
  ul > li {
    display: flex;
    align-items: flex-end;
    height: 0.7rem;
    border-bottom: 1px solid #465587;
    padding-bottom: 0.09rem;
    padding-top: 0.15rem;
  }
  .device-percent {
    margin-left: 0.4rem;
    width: 3.23rem;
    font-size: 0.4rem;
    span {
      display: inline-block;
      width: 80%;
      font-size: 0.2rem;
      color: #fff;
    }
  }
  .device-number {
    margin-left: 0.2rem;
    font-size: 0.35rem;
    color: #37f8ff;
    font-weight: bold;
    i:first-child {
      font-size: 0.4rem;
    }
    i:last-child {
      font-size: 0.2rem;
    }
  }
}

.ETE {
  display: inline-block;
  width: 0.9rem;
  height: 0.7rem;
  background: url("../assets/hicling/Thermo.png") center center no-repeat;
  background-size: contain;
}
.Aura {
  display: inline-block;
  width: 0.9rem;
  height: 0.7rem;
  background: url("../assets/hicling/Aura.png") center center no-repeat;
  background-size: contain;
}
.Leap {
  display: inline-block;
  width: 0.9rem;
  height: 0.7rem;
  background: url("http://94.201.123.152:8091/pictures/sys/background/Leap.png")
    center center no-repeat;
  background-size: contain;
}

.main-center {
  width: 8.14rem;
  margin-left: 0.28rem;
}
.main-center-map {
  width: 8.14rem;
  height: 5.2rem;
}
.main-center-bigData {
  margin-top: 0.32rem;
  h3 {
    height: 0.34rem;
    line-height: 0.34rem;
    background: rgba(25, 119, 242, 1);
    text-align: center;
    font-size: 0.22rem;
    color: #fff;
  }
  .dayData {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
}
.data-box {
  box-sizing: border-box;
  margin-top: 0.2rem;
  padding: 0.1rem 0.16rem;
  width: 4rem;
  height: 1.3rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  h6 {
    font-size: 0.2rem;
    color: #fff;
  }
  .data-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 0.15rem;
  }
}
.temp {
  display: inline-block;
  width: 0.3rem;
  height: 0.6rem;
  background: url("../assets/img/temp-normal@x2.png") no-repeat;
  background-size: contain;
}
.data {
  font-size: 0.5rem;
  font-weight: bold;
}
.small {
  font-size: 0.2rem;
}
.temp-unit {
  display: inline-block;
  width: 0.3rem;
  height: 0.3rem;
  background: url("../assets/img/temp-unit-blue.png");
  background-size: contain;
}
.step {
  display: inline-block;
  width: 0.6rem;
  height: 0.6rem;
  background-image: url("../assets/hicling/step.png");
  background-size: contain;
}
.warning-red {
  display: inline-block;
  width: 0.6rem;
  height: 0.6rem;
  background-image: url("../assets/hicling/warning-red.png");
  background-size: contain;
}
.sleep-red {
  display: inline-block;
  width: 0.6rem;
  height: 0.6rem;
  background-image: url("../assets/hicling/sleep-red.png");
  background-size: contain;
}
.care-orange {
  display: inline-block;
  width: 0.6rem;
  height: 0.6rem;
  background-image: url("../assets/hicling/care-orange.png");
  background-size: contain;
}
.consult {
  display: inline-block;
  width: 0.6rem;
  height: 0.6rem;
  background-image: url("../assets/hicling/consult.png");
  background-size: contain;
}
.hospital {
  display: inline-block;
  width: 0.6rem;
  height: 0.6rem;
  background-image: url("../assets/hicling/hospital.png");
  background-size: contain;
}
.male {
  display: inline-block;
  width: 0.55rem;
  height: 0.49rem;
  background-image: url("../assets/hicling/male.png");
  background-size: cover;
}
.female {
  display: inline-block;
  width: 0.55rem;
  height: 0.49rem;
  background-image: url("../assets/hicling/female.png");
  background-size: cover;
}
.main-right {
  width: 4.2rem;
  margin-left: 0.28rem;
  h3 {
    height: 0.34rem;
    line-height: 0.34rem;
    background: rgba(25, 119, 242, 1);
    text-align: center;
    font-size: 0.22rem;
    color: #fff;
  }
}
.basic-information {
  margin-top: 0.2rem;
}
.basic-information-title {
  position: relative;
  height: 0.34rem;
  background: rgba(70, 85, 135, 1);
  p {
    position: relative;
    width: 1.5rem;
    padding-left: 0.14rem;
    height: 0.34rem;
    line-height: 0.34rem;
    background: rgba(25, 119, 242, 1);
    font-size: 0.22rem;
    color: #fff;
    &:after {
      @include triangle(0.17rem);
    }
  }
}
.basic-information-content {
  box-sizing: border-box;
  padding: 0.18rem 0.14rem;
  margin-top: 0.07rem;
  background: rgba(255, 255, 255, 0.11);
  .first-info {
    display: flex;
    justify-content: space-between;
    color: #fff;
    .first-info-left,
    .first-info-right {
      display: flex;
      align-items: flex-end;
    }
  }
  .second-info {
    display: flex;
    justify-content: space-between;
    span:first-child {
      color: #6065ee;
      font-size: 0.7rem;
      font-weight: bold;
    }
    span:last-child {
      color: #fc397b;
      font-size: 0.7rem;
      font-weight: bold;
    }
  }
  .third-info {
    display: flex;
    justify-content: space-between;
    span:first-child {
      position: relative;
      display: block;
      height: 0.24rem;
      background-color: #6065ee;
      border-top-left-radius: 0.12rem;
      border-bottom-left-radius: 0.12rem;
      &:after {
        position: absolute;
        right: -0.24rem;
        top: 0;
        content: "";
        border-top: solid 0.12rem #6065ee;
        border-left: solid 0.12rem #6065ee;
        border-bottom: solid 0.12rem transparent;
        border-right: solid 0.12rem transparent;
      }
    }
    span:last-child {
      position: relative;
      display: block;
      height: 0.24rem;
      background-color: #fc397b;
      border-top-right-radius: 0.12rem;
      border-bottom-right-radius: 0.12rem;
      &:after {
        position: absolute;
        left: -0.24rem;
        top: 0;
        content: "";
        border-top: solid 0.12rem transparent;
        border-left: solid 0.12rem transparent;
        border-bottom: solid 0.12rem #fc397b;
        border-right: solid 0.12rem #fc397b;
      }
    }
  }
}
#numberCharts {
  box-sizing: border-box;
  padding: 0.18rem 0.14rem;
  height: 2.5rem;
}
.profession-list {
  display: flex;
  align-items: center;
  span:first-of-type {
    width: 1.26rem;
    margin-right: 0.15rem;
    font-size: 0.18rem;
  }
  span:last-of-type {
    color: #58ddff;
    margin-left: 0.15rem;
  }
  .profession-persent {
    width: 1.43rem;
  }
}
.markerP {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: rgba(25, 119, 242, 0.8);
  color: #eee;
  span:first-child {
    font-size: 0.4rem;
    font-weight: bold;
  }
}
.canvas2 {
  .canvas {
    vertical-align: bottom;
    z-index: 10000;
  }
}
.overFlow {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: no-wrap;
}
</style>
