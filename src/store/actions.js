import * as Api from '../api/api';
import {
  getDeviceType
} from "../lib/utils"
const actions = {
  login({
    commit
  }, loginInfo) {
    const {
      login
    } = Api;
    return new Promise((resolve, reject) => {
      login(loginInfo).then(res => {
        let {
          data
        } = res;
        console.log(data);
        commit("setLogInfo", data); // 存储token
        resolve();
      }).catch(err => {
        reject(err)
      })

    })
  },
  getAllUser({
    commit
  }) {
    const {
      getAllUserInfo
    } = Api;
    let user_info_list = [];

    return getAllUserInfo().then(res => {
      let {
        data
      } = res;
      if (data.length !== 0) {
        data.forEach(item => {
          try {
            user_info_list.push({
              clingId: item.clingId, // Cling的用户ID
              patainId: item.id, // 病人ID
              career: item.career,
              birthdate: item.birthdate,
              deviceId: getDeviceType(item.deviceId), //获取用户的设备型号
              age: new Date().getFullYear() - new Date(item.birthdate).getFullYear(),
              gender: item.gender,
              nickName: item.nickName,
              avatar: item.avatar,
              mac: item.mac.replace(/:/g, '-'),
              name: item.name,
              phone: item.phone,
              idcard: item.idcard,
              address: item.address,
              workTime: item.workTime,
              tz: item.tz || 0,
              time: 0,
              hr: 0,
              hbp: 0,
              lbp: 0,
              totalCal: 0,
              steps: 0,
              weakTime: 0,
              bodyTemp: 0,
              wristTemp: 0,
              doctorId: item.doctorId, // 部门id
              doctorName: item.doctorName, // 部门名称
              notice: item.notice, // 通知状态
              lastAlarmTime: 0, // 上次报警时间戳
              alarmType: 6, //报警类型 6:无报警（方便报警优先级排序采用的6）
              position: 0,
              deepSleep: 0,
              endSleep: 0,
              lightSleep: 0,
              midSleep: 0,
              sleepTotal: 0,
              lastNightSleep: 0,
              startSleep: 0,
              canBeChanged: true, // 是否可以被广播改变状态
              positionName: 'Unknown' // 位置信息---实际为网关自定义的名称
            })
          } catch (error) {
            console.log(error)
          }
        })
      }
      user_info_list = user_info_list.filter(item => item.deviceId !== 'Unknown Device');
      commit('setUserList_beforeMix', user_info_list)
      return user_info_list
    })
  },
  getHealthData({
    commit,
    state
  }) {
    const {
      getHealthInfo
    } = Api;
    let health_data_list = {};
    const {
      user_info_list
    } = state;
    return getHealthInfo().then(res => {
        const {
          data
        } = res;
        if (data.length) {
          data.forEach(item => {
            const {
              clingId
            } = item;
            health_data_list[clingId] = {
              date: item.date,
              deepSleep: item.deepSleep,
              endSleep: item.endSleep,
              hbp: item.hbp,
              hr: item.hr,
              lbp: item.lbp,
              lightSleep: item.lightSleep,
              midSleep: item.midSleep,
              sleepTotal: Math.round(item.sleepTotal / 60),
              totalCal: item.totalCal,
              startSleep: item.startSleep,
              steps: item.steps,
              clingId: item.clingId,
              weakTime: item.weakTime,
              avgWTemp: item.avgWTemp
            }
          })
          user_info_list.forEach(user => {
            const {
              clingId
            } = user;
            
            const healthObject = health_data_list[clingId];
            if(clingId ===38){
              console.log(healthObject)
            }
            if (healthObject) {
              user.date = healthObject.date;
              user.deepSleep = healthObject.deepSleep;
              user.endSleep = healthObject.endSleep;
              user.hbp = healthObject.hbp;
              user.hr = healthObject.hr;
              user.lbp = healthObject.lbp;
              user.lightSleep = healthObject.lightSleep;
              user.midSleep = healthObject.midSleep;
              user.sleepTotal = healthObject.sleepTotal;
              user.totalCal = healthObject.totalCal;
              user.startSleep = healthObject.startSleep;
              user.steps = healthObject.steps;
              user.weakTime = healthObject.weakTime;
              user.bodyTemp = healthObject.avgWTemp;
            }
          })
          commit('setUserList', user_info_list);
          return user_info_list;
        } else {
          commit('setUserList', user_info_list);
          return user_info_list;
        }
      })
      .catch(() => {
        commit('setUserList', user_info_list);
        return user_info_list;
      })
  },
  // 获取简单部门列表
  getSimpleDeparts({
    commit
  }) {
    const {
      getDprtSimpleList
    } = Api;
    return new Promise((resolve, reject) => {
      getDprtSimpleList().then(res => {
        const {
          data
        } = res;
        commit('setDeparts', data);
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })

  },
  // 获取可用网关服务
  getServerList({
    commit
  }) {
    const {
      getSocketSimpleList
    } = Api;
    return new Promise((resolve, reject) => {
      getSocketSimpleList()
        .then(res => {
          let {
            data
          } = res;
          commit('setServerList', data);
          resolve(data)
        })
        .catch(err => {
          console.log(err);
          reject(err)
        });
    })
  },
  // 获取公司简单列表
  getCompanyList({
    commit
  }) {
    const {
      getCompanySimpleList
    } = Api;
    return new Promise((resolve, reject) => {
      getCompanySimpleList().then(res => {
        const {
          data
        } = res
        commit('setCompanyList', data);
        resolve(data)
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  },
  // 获取公司总人数及在线人数信息
  getActiveNum({
    commit
  }, id) {
    const {
      getOnlineNumber
    } = Api;
    return new Promise((resolve, reject) => {
      getOnlineNumber({
        id: id
      }).then(res => {
        const {
          data
        } = res;
        commit('setOnlineInfo', data);
        resolve(data)
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  },
  // 获取网关简单列表
  getBeaconList({
    commit
  }) {
    const {
      getBeaconSimpleList
    } = Api;
    return new Promise((resolve, reject) => {
      getBeaconSimpleList().then(res => {
        let {
          data
        } = res;
        commit('setBeaconList', data)
        resolve(data)
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  },

  // 获取所有角色列表
  getRoleList({
    commit
  }) {
    const {
      getAllRole
    } = Api;
    getAllRole().then(res => {
      const {
        data
      } = res;
      commit("setRoleList", data)
    })
  },

  // 获取所有区域简单列表
  getAreaList({
    commit
  }) {
    const {
      getAreaSimpleList
    } = Api;
    return new Promise((resolve, reject) => {
      getAreaSimpleList().then(res => {
        const {
          data
        } = res;
        commit('setAreaList', data);
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })

  }

}

export default actions
