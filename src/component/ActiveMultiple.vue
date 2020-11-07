<template>
  <div :class="tempAlarmBg" @click="$emit('choose');">
    <div class="active-item-top">
      <div class="active-item-top-avatar"><img :src="member.avatar" alt /></div>
      <div class="active-item-top-baseInfo">
        <div class="baseInfo-left">
          <p class="name">{{ member.name }}</p>
          <div class="baseInfo-device">
            <span class="device-icon"></span>
            <span class="device-name">{{ member.deviceId }}</span>
          </div>
        </div>
        <div class="baseInfo-right">
          <div class="position-wrapper" @click.stop="showPopMap(member.positionName)">
            <p class="position-icon"></p>
            <p class="position-name">{{ member.positionName }}</p>
          </div>

          <span class="position-info">{{
            member.position == 1 ? "online" : "offline"
          }}</span>
        </div>
      </div>
    </div>
    <div
      class="active-item-btm"
      v-show="
        member.alarmType == 6 || member.alarmType == 2 || member.alarmType == 3
      "
    >
      <div
        class="active-item-btm_health"
        v-if="member.deviceId === 'Aura' || member.deviceId === 'Leap'"
      >
        <div class="active-item-btm_health_hr">
          <div class="health_hr_left">
            <p class="icon"></p>
            <p class="health_hr_left_data">{{ member.hr }}</p>
          </div>
          <div class="health_hr_right">
            <p class="health_hr_right_tag">efficacy</p>
            <p class="health_hr_right_data">{{ efficacy }}</p>
          </div>
        </div>
        <div class="active-item-btm_health_bp">
          <div class="health_bp_left"><p class="icon"></p></div>
          <div class="health_bp_right">
            <div class="health_bp_right_tag">2 hr ago</div>
            <div class="health_bp_right_data">
              {{ member.hbp }} <span>/</span> {{ member.lbp }}
            </div>
          </div>
        </div>
      </div>
      <div
        class="active-item-btm-temp"
        v-if="member.deviceId === 'ETE' || member.deviceId === 'Thermo'"
      >
        <div :class="tempAlarmClass">
          <p class="thermo-left-icon"></p>
          <p class="thermo-left-data">{{ member.bodyTemp }}</p>
          <div class="thermo-left-unit-wrap">
            <p class="thermo-left-unit"></p>
          </div>
        </div>
        <div class="thermo-right">
          <span class="tem-right-desc">1 min ago</span>
        </div>
      </div>
      <div class="active-item-btm-sport">
        <div class="st-cal">
          <div class="st-cal-left">
            <p class="st-cal-left-icon"></p>
            <p class="st-cal-left-data">{{ member.totalCal }}</p>
          </div>
          <div class="st-cal-right"><p class="st-cal-right-uni">KCal</p></div>
        </div>
        <div class="st-cal">
          <div class="st-cal-left">
            <p class="st-cal-left-icon step-icon"></p>
            <p class="st-cal-left-data">{{ member.steps }}</p>
          </div>
          <div class="st-cal-right"><p class="st-cal-right-uni">step</p></div>
        </div>
      </div>
    </div>
    <div class="active-item-btm sos" v-show="member.alarmType == 1">
      <img src="../assets/img/sos.png" alt />
    </div>
    <div class="active-item-btm notWorn" v-show="member.alarmType == 4">
      <img src="../assets/img/no-worn.png" alt />
    </div>
    <div class="active-item-btm lowPower" v-show="member.alarmType == 5">
      <img src="../assets/img/low-power.png" alt />
    </div>
  </div>
</template>
<script>
export default {
  name: "ActivieMultiple",
  props: {
    member: {
      type: Object,
      required: true
    }
  },
  computed: {
    tempAlarmClass() {
      let { alarmType } = this.member;
      return (
        (alarmType === 2 && "thermo-left-warn-high") ||
        (alarmType === 3 && "thermo-left-warn-low") ||
        "thermo-left"
      );
    },
    tempAlarmBg() {
      switch (this.member.alarmType) {
        case 0:
          return "active-item bg-black";
        case 1:
          return "active-item bg-orange";
        case 2:
          return "active-item bg-red";
        case 3:
          return "active-item bg-blue";
        case 4:
          return "active-item bg-orange";
        case 5:
          return "active-item bg-orange";
        default:
          return "active-item bg-black";
      }
    },
    efficacy() {
      const { member } = this;
      const { gender, hr, age } = member;
      const res =
        gender == 0
          ? Math.round((hr / (226 - age)) * 100)
          : Math.round((hr / (220 - age)) * 100);
      return res + "%";
    }
  },
  methods: {
    showPopMap(positionName) {
      const { position, coordinates } = this.member;
      if (position === 0) {
        return;
      } else {
        
        this.$emit('showMap',{coordinates,positionName})
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.active-item {
  height: 100%;
  width: 100%;
  border-radius: 0.08rem;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  .active-item-top {
    width: 100%;
    height: 40%;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0.1rem 0.1rem;
    margin-bottom: 0.05rem;
    .active-item-top-avatar {
      width: 20%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .active-item-top-baseInfo {
      width: 75%;
      height: 100%;
      display: flex;
      justify-content: space-around;
      .baseInfo-left {
        width: 50%;
        height: 100%;
        display: flex;
        flex-direction: column;
        .name {
          width: 100%;
          height: 50%;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .baseInfo-device {
          height: 50%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: start;
          .device-icon {
            width: 18%;
            height: 100%;
            background: url("../assets/img/ClingThermo.png") center center
              no-repeat;
            background-size: contain;
            margin-right: 10px;
          }
          .device-name {
            font-size: 0.24rem;
          }
        }
      }
      .baseInfo-right {
        width: 50%;
        height: 100%;
        display: flex;
        flex-direction: column;
        .position-wrapper {
          width: 100%;
          height: 50%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .position-icon {
            width: 20%;
            height: 100%;
            background: url("../assets/img/location1.png") center center
              no-repeat;
            background-size: contain;
          }
          .position-name {
            width: 70%;
            font-size: 0.18rem;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .position-info {
          width: 100%;
          height: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.24rem;
        }
      }
    }
  }
  .active-item-btm {
    width: 100%;
    height: 55%;
    display: flex;
    box-sizing: border-box;
    padding: 0.05rem 0.1rem;
    flex-direction: column;
    justify-content: space-between;
    .active-item-btm_health {
      height: 47%;
      width: 100%;
      display: flex;
      justify-content: space-between;
      .active-item-btm_health_hr {
        background-color: #000;
        width: 48.5%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        .health_hr_left {
          width: 60%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-around;
          .icon {
            width: 34%;
            height: 79%;
            background: url("../assets/img/hr@x2.png") center center no-repeat;
            background-size: contain;
          }
          .health_hr_left_data {
            width: 56%;
            height: 100%;
            font-size: 0.24rem;
            font-weight: bold;
            display: flex;
            align-items: center;
            box-sizing: border-box;
          }
        }
        .health_hr_right {
          width: 40%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-end;
          box-sizing: border-box;
          padding-right: 0.03rem;
          .health_hr_right_tag {
            font-size: 0.16rem;
            flex: 2;
            display: flex;
            align-items: center;
          }
          .health_hr_right_data {
            font-size: 0.24rem;
            font-weight: 800;
            flex: 3;
            display: flex;
            align-items: center;
          }
        }
      }
      .active-item-btm_health_bp {
        background-color: #000;
        width: 48.5%;
        height: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .health_bp_left {
          width: 20%;
          height: 100%;
          display: flex;
          align-items: center;
          .icon {
            width: 100%;
            height: 79%;
            background: url("../assets/img/bp.png") center center no-repeat;
            background-size: contain;
          }
        }
        .health_bp_right {
          width: 70%;
          height: 100%;

          display: flex;
          flex-direction: column;
          align-items: center;
          box-sizing: border-box;
          align-items: flex-end;
          justify-content: center;
          .health_bp_right_tag {
            font-size: 0.16rem;
            flex: 2;
          }
          .health_bp_right_data {
            font-size: 0.24rem;
            font-weight: bolder;
            flex: 3;
            span {
              font-size: 0.2rem;
            }
          }
        }
      }
    }
    .active-item-btm-temp {
      height: 47%;
      width: 100%;
      display: flex;
      background-color: #000;
      justify-content: space-between;
      .thermo-left {
        width: 50%;
        height: 100%;
        display: flex;
        justify-content: start;
        align-items: center;
        .thermo-left-icon {
          width: 20%;
          height: 80%;
          background: url("../assets/img/temp-normal.png") center center
            no-repeat;
          background-size: contain;
          justify-content: space-around;
        }
        .thermo-left-data {
          width: 45%;
          font-size: 0.24rem;
          margin-right: 10px;
          text-align: left;
          font-weight: bold;
        }
        .thermo-left-unit-wrap {
          width: 20%;
          height: 100%;
          display: flex;
          align-items: flex-start;

          .thermo-left-unit {
            margin-top: 0.05rem;
            width: 100%;
            height: 60%;
            background: url("../assets/img/temp-unit.png") center center
              no-repeat;
            background-size: contain;
          }
        }
      }
      .thermo-left-warn-high {
        color: #f14246;
        width: 50%;
        height: 100%;
        display: flex;
        justify-content: start;
        align-items: center;
        .thermo-left-icon {
          width: 20%;
          height: 80%;
          background: url("../assets/img/temp-alarm.png") center center
            no-repeat;
          background-size: contain;
          justify-content: space-around;
        }
        .thermo-left-data {
          width: 45%;
          font-size: 0.24rem;
          margin-right: 10px;
          text-align: left;
        }
        .thermo-left-unit-wrap {
          width: 20%;
          height: 100%;
          display: flex;
          align-items: flex-start;

          .thermo-left-unit {
            margin-top: 0.05rem;
            width: 100%;
            height: 60%;
            background: url("../assets/img/temp-unit-red.png") center center
              no-repeat;
            background-size: contain;
          }
        }
      }
      .thermo-left-warn-low {
        color: #5093da;
        width: 50%;
        height: 100%;
        display: flex;
        justify-content: start;
        align-items: center;
        .thermo-left-icon {
          width: 20%;
          height: 80%;
          background: url("../assets/img/temp-normal.png") center center
            no-repeat;
          background-size: contain;
          justify-content: space-around;
        }
        .thermo-left-data {
          width: 45%;
          font-size: 0.24rem;
          margin-right: 10px;
          text-align: left;
        }
        .thermo-left-unit-wrap {
          width: 20%;
          height: 100%;
          display: flex;
          align-items: flex-start;

          .thermo-left-unit {
            margin-top: 0.05rem;
            width: 100%;
            height: 60%;
            background: url("../assets/img/temp-unit-blue.png") center center
              no-repeat;
            background-size: contain;
          }
        }
      }
      .thermo-right {
        width: 50%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        .tem-right-desc {
          margin-top: 0.03rem;
        }
      }
    }
    .active-item-btm-sport {
      height: 47%;
      width: 100%;
      display: flex;
      justify-content: space-between;
      .st-cal {
        background-color: #000;
        width: 48.5%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        .st-cal-left {
          width: 75%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-around;
          .st-cal-left-icon {
            width: 25%;
            height: 79%;
            background: url("../assets/img/cal.png") center center no-repeat;
            background-size: contain;
          }
          .st-cal-left-data {
            width: 70%;
            height: 100%;
            display: flex;
            align-items: center;
            font-size: 0.24rem;
            font-weight: bolder;
          }
          .step-icon {
            background: url("../assets/img/step.png") center center no-repeat;
            background-size: contain;
          }
        }
        .st-cal-right {
          width: 25%;
          height: 100%;
          display: flex;
          box-sizing: border-box;
          padding-right: 0.03rem;
          flex-direction: column-reverse;
          .st-cal-right-uni {
            font-size: 0.16rem;
            text-align: right;
            margin-bottom: 0.03rem;
          }
        }
      }
    }
  }
  .lowPower,
  .notWorn,
  .sos {
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.bg-red {
  background: #f14246;
}
.bg-blue {
  background: #5093da;
}
.bg-black {
  background: rgba(69, 85, 136, 1);
}
.bg-orange {
  background: #fa7107;
}
</style>
