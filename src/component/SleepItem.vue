<template>
  <div class="sleep" @click="$emit('choose');">
    <div class="userInfo">
      <div class="avatar"><img :src="member.avatar" alt /></div>
      <div class="information">
        <div class="nameId">
          <p class="name">{{ member.name }}</p>
        </div>
        <div class="posInfo">
          <div class="pos">
            <span class="posIcon"></span>
            <p>{{ member.deviceId }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="sleepInfo">
      <div class="sleepTime">
        <div class="slepDuration">
          <span class="moonIcon"></span>
          <div class="time">
            <p class="span">
              <span class="time_num">{{ getHour }}</span>
              <span id="time_num_unit">h</span>
              <span class="time_num">{{ getMin }}</span>
              <span id="time_num_unit">m</span>
            </p>
          </div>
        </div>
        <div class="start_end">
          <p class="start_end__p">
            <span>Bed:</span> <span>{{ startTime }}</span>
          </p>
          <p class="start_end__p">
            <span>Wake:</span> <span>{{ endTime }}</span>
          </p>
        </div>
      </div>
      <div class="sleepQuality">
        <span class="icon"></span>
        <div class="sleep_quality">
          <p class="tag">Light sleep</p>
          <p class="number">{{ Math.round(member.lightSleep / 60) }}&nbsp;m</p>
        </div>
        <div class="sleep_quality">
          <p class="tag">Mid sleep</p>
          <p class="number">{{ Math.round(member.midSleep / 60) }}&nbsp;m</p>
        </div>
        <div class="sleep_quality">
          <p class="tag">Deep sleep</p>
          <p class="number">{{ Math.round(member.deepSleep / 60) }}&nbsp;m</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "SleepItem",
  props: ["member"],
  data() {
    return {};
  },
  methods: {
    getTime(timeStamp, tz) {
      timeStamp = timeStamp || 0;
      if (timeStamp === 0) return "00:00";
      // console.log(new Date(timeStamp).getHours())
      let hour = new Date(timeStamp).getUTCHours();
      let minute = new Date(timeStamp).getUTCMinutes();
      let offsetHour = hour + tz;
      offsetHour =
        offsetHour >= 24
          ? offsetHour - 24
          : offsetHour < 0
          ? offsetHour + 24
          : offsetHour;
      hour = offsetHour < 10 ? `0${offsetHour}` : offsetHour;
      minute = minute < 10 ? `0${minute}` : minute;
      return `${hour}:${minute}`;
    }
  },
  computed: {
    startTime() {
      const { startSleep, tz } = this.member;
      return this.getTime(startSleep, tz);
    },
    endTime() {
      const { endSleep, tz } = this.member;
      return this.getTime(endSleep, tz);
    },
    getHour() {
      let { sleepTotal } = this.member;
      sleepTotal = sleepTotal || 0;
      return Math.floor(sleepTotal / 60);
    },
    getMin() {
      let { sleepTotal } = this.member;
      sleepTotal = sleepTotal || 0;
      return Math.floor(sleepTotal % 60);
    }
  }
};
</script>
<style lang="scss" scoped>
.sleep {
  border-radius: 0.08rem;
  background: rgba(64, 14, 139, 1);

  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;
  .userInfo {
    width: 95%;
    height: 30%;
    display: flex;
    justify-content: space-around;
    margin: 0.15rem 2.5%;
    .avatar {
      width: 20%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .information {
      width: 70%;
      display: flex;
      flex-wrap: wrap;
      font-size: 0.18rem;
      .nameId {
        width: 100%;
        height: 50%;
        .name {
          font-size: 0.22rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .posInfo {
        width: 100%;
        height: 50%;
        .pos {
          display: flex;
          height: 100%;
          justify-content: space-between;
          .posIcon {
            width: 10%;
            background-image: url("../assets/img/ClingThermo.png");
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
          }
          p {
            width: 80%;
            font-size: 0.18rem;
            margin-right: 5px;
            line-height: 0.35rem;
          }
        }
        .electric {
          display: flex;
          height: 50%;
          .eleIcon {
            width: 20%;
            background-image: url("../assets/img/battery1.png");
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
          }
          p {
            width: 70%;
            font-size: 0.24rem;
            margin-left: 5px;
          }
        }
      }
    }
  }
  .sleepInfo {
    width: 100%;
    height: 55%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    font-size: 0.16rem;
    font-weight: normal;
    .sleepTime {
      height: 45%;
      width: 96%;
      background-color: rgb(33, 0, 69);
      display: flex;

      .slepDuration {
        width: 58%;
        display: flex;
        .moonIcon {
          width: 30%;
          background-image: url("../assets/img/moon1.png");
          background-size: 60% 60%;
          background-repeat: no-repeat;
          background-position: center;
        }
        .time {
          width: 100%;
          height: 100%;
          position: relative;
          .span {
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
            #time_num_unit {
              display: inline-block;
              width: 15%;
              text-align: center;
              display: inline-block;
              line-height: 0.5rem;
              font-size: 0.18rem;
            }
            .time_num {
              font-size: 0.28rem;
              display: inline-block;
              width: 30%;
              text-align: center;
              display: inline-block;
              line-height: 0.5rem;
            }
          }
        }
      }
      .start_end {
        width: 40%;

        p {
          display: flex;
          align-items: center;
          height: 50%;
          width: 100%;
          line-height: 0.25rem;
          justify-content: space-between;
        }
      }
    }
    .sleepQuality {
      height: 45%;
      width: 96%;
      background-color: rgb(33, 0, 69);
      display: flex;
      justify-content: space-around;
      .icon {
        width: 15%;
        height: 60%;
        flex: 0 0 auto;
        transform: translateY(30%);
        background-image: url("../assets/img/zhexiantu1.png");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
      .sleep_quality {
        flex: 0 0 auto;
        color: aqua;
        width: 27%;
        height: 100%;
        display: flex;
        flex-direction: column;
        font-size: 0.14rem;
        .tag {
          width: 100%;
          height: 50%;
          white-space: nowrap;
          display: flex;
          align-items: center;
        }
        .number {
          width: 100%;
          height: 50%;
          display: flex;
          align-items: center;
        }
      }
    }
  }
}

.bg-red {
  background: rgba(249, 93, 98, 1);
}
.bg-blue {
  background: rgba(70, 85, 135, 1);
}
</style>
