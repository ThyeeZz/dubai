import {
  defaultState
} from '@/lib/utils';
import Cookie from 'js-cookie';
const mutations = {
  setLogInfo(state, params) {
    // state.alert_address = `ws://10.0.0.31:5012/alert;${params.access_token};${params.id}`;
    const {
      access_token,
      refresh_token,
      alert_address,
      id,
      role,
      location,
      ws_servers,
      name
    } = params;
    ws_servers.forEach(ws => {
      ws.address = `${ws.address};${access_token};${id}`
    })

    state.userInfo = {
      access_token,
      refresh_token,
      id,
      role, // normal: 1 super: 2 admin: 3
      isLogout: false,
      alert_address: alert_address[0],
      ws_servers,
      location,
      name
    }
    Cookie.set('loginInfo', {
      id,
      access_token,
      refresh_token
    }, {
      expires: 7
    })
  },
  clearCatche(state) {
    Object.assign(state, defaultState())
    sessionStorage.removeItem("state");
    state.userInfo.isLogout = true;
  },
  upDateToken(state, {
    id,
    access_token,
    refresh_token
  }) {
    state.userInfo.refresh_token = params.refresh_token;
    state.userInfo.id = params.id;
    state.userInfo.access_token = params.access_token;
    Cookie.set('loginInfo', {
      id,
      access_token,
      refresh_token
    }, {
      expires: 7
    })
  },
  setUserList(state, params) {
    state.userList = [...params]
  },
  setUserList_beforeMix(state, params) {
    state.user_info_list = [...params];
  },
  // 是否显示分享二维码
  setShareFlag(state, params) {
    state.shareFlag = params
  },
  // 部门列表怕
  setDeparts(state, params) {
    state.departList = [...params];
  },
  // 可用网关服务列表
  setServerList(state, params) {
    state.serverList = [...params];
  },
  // 公司列表
  setCompanyList(state, params) {
    state.companyList = [...params];
  },
  setOnlineInfo(state, params) {
    state.onlineInfo = {
      ...params
    }
  },
  setAlarmData(state, params) {
    state.alalrmData = [...params]
  },
  setBeaconList(state, params) {
    state.beaconSimpleList = [...params];
  },
  setRoleList(state, params) {
    state.roleList = [...params]
  },
  saveActivityDprtId(state, params) {
    state.activity_dprtId = params
  },
  saveSleepDprtId(state, params) {
    state.sleep_dprtId = params
  },
  saveLeaveDprtId(state, params) {
    state.saved_deprtId = params
  },
  setAreaList(state, params) {
    state.areaList = [...params]
  },
  // 缓存AlarmData 数据
  cacheAlarmData(state, params) {
    state.alarmData_saved = [...params];
  }
}

export default mutations
