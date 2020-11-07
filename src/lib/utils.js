import {
  Message,
  MessageBox
} from 'element-ui';
import Cookie from 'js-cookie';

export const getMinuteBeginTimestamp = (timestamp) => { //获取时间戳(秒)分钟开始
  if (timestamp === 0) {
    return '--'
  }
  const dateTime = new Date(timestamp) || new Date();
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var date = dateTime.getDate();
  var hour = dateTime.getHours() < 10 ? '0' + dateTime.getHours() : dateTime.getHours();
  var minute = dateTime.getMinutes() < 10 ? '0' + dateTime.getMinutes() : dateTime.getMinutes();
  var second = dateTime.getSeconds() < 10 ? '0' + dateTime.getSeconds() : dateTime.getSeconds();
  var dt = year + '-' + month + '-' + date + " " + hour + ':' + minute + ':' + second;
  return dt;
}
export const getTime = (timestamp) => { //格局时间戳获取时间
  if (timestamp == 0) {
    return '00:00'
  } else {
    var dateTime = new Date();
    dateTime.setTime(timestamp);
    var hour = dateTime.getHours() < 10 ? '0' + dateTime.getHours() : dateTime.getHours();
    var minute = dateTime.getMinutes() < 10 ? '0' + dateTime.getMinutes() : dateTime.getMinutes();
    var dt = hour + ':' + minute
    return dt;
  }
}
export const timeStamp = () => {
  let timeStamp = Date.parse(new Date()) / 1000;
  return timeStamp
}
export const formatH_M_S = (timeSatmp) => {
  //毫秒
  let date = new Date(timeSatmp);
  let hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  let minute =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  let second =
    date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
  return `${hour}:${minute}:${second}`;
}
export const getTodayTimestamp = (h, m) => {
  let date = new Date();
  date.setHours(h);
  date.setMinutes(m);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return Math.floor(date.getTime() / 1000);
}
export const countedObj = (arrObj, prop) => {
  return arrObj.reduce((obj, item) => {
    if (item[prop] in obj) {
      obj[item[prop]]++
    } else {
      obj[item[prop]] = 1
    }
    return obj;
  }, {})
}

export const sortTrail = (trail, prop) => {
  if (trail.length) {
    var indexItem = trail[0];

    var arr = [indexItem];

    for (var i = 1; i < trail.length; i++) {
      if (indexItem[prop] === trail[i][prop]) {
        indexItem = trail[i];
      } else {
        indexItem = trail[i];
        arr.push(trail[i])
      }
    }
    return arr
  } else {
    return 0;
  }
}

export const succeed = (message) => {
  Message({
    showClose: true,
    message: message,
    type: 'success',
    duration: 3000,
    center: true
  });
}
export const failed = (message) => {
  Message({
    showClose: true,
    message: message,
    type: 'error',
    duration: 3000,
    center: true
  });
}
export const warning = (message) => {
  Message({
    showClose: true,
    message: message,
    type: 'warning',
    duration: 3000,
    center: true
  });
}
export const myConfirm = (message, func, info) => {
  MessageBox.confirm(message, 'prompt', {
    confirmButtonText: 'confirm',
    cancelButtonText: 'cancel',
    type: 'warning'
  }).then(func).catch(() => {
    Message({
      type: 'info',
      message: info,
      duration: 3000,
      center: true
    });
  })
}
export const getDeviceType = (deviceId) => { //判定用户的device型号 公用函数
  if (deviceId && deviceId.length > 5) {
    // let deviceId = deviceId.toUpperCase();
    if (deviceId.indexOf("HICB") !== -1) {
      return "Band";
    }
    if (deviceId.indexOf("HICV") !== -1) {
      return "VOC";
    }
    if (deviceId.indexOf("HICA") !== -1) {
      return "Aura";
    }
    if (deviceId.indexOf("HICL") !== -1) {
      return "Leap";
    }
    if (deviceId.indexOf("HICTMO") !== -1) {
      return "Thermo";
    }
    if (deviceId.indexOf("HICETET") !== -1) {
      return "ETE";
    }
  } else {
    return "Unknown Device";
  }
}

// 根据区间重新设置echarts 图形
export const restChartsData = (start, range, target, value, end) => {
  if (value <= start) {
    target[0].value++
  } else if (value > start && value <= end) {
    let index = Math.floor((value - start + range) / range);
    target[index].value++
  } else if (value > end) {
    target[target.length - 1].value++
  }
}

// 函数防抖，第一次立即触发，之后每隔 wait 触发
/**
 * 描述
 * @date 2020-06-17
 * @param {any} fun
 * @param {any} wait
 * @param {any} ...args
 * @returns {any}
 */
// export const debounce = (fun, wait, ...args) => {
//   let flag = true;
//   let timer = null;
//   return function () {
//     let context = this;
//     if (flag) {
//       fun.apply(context, args)
//       flag = false;
//     } else {
//       if (timer) {
//         clearTimeout(timer);
//         timer = null;
//       }
//       timer = setTimeout(() => {
//         fun.apply(context, args);
//         flag = true;
//       }, wait)
//     }
//   }
// }
function getWorkDayList(arg) {
  const monInt = parseInt(1000000, 2);
  const tusInt = parseInt(100000, 2);
  const wesInt = parseInt(10000, 2);
  const tursInt = parseInt(1000, 2);
  const friInt = parseInt(100, 2);
  const satInt = parseInt(10, 2);
  const sunInt = parseInt(1, 2);

  let weekList = [];
  if ((arg & monInt) > 0) {
    weekList.push(1)
  }
  if ((arg & tusInt) > 0) {
    weekList.push(2)
  }
  if ((arg & wesInt) > 0) {
    weekList.push(3)
  }
  if ((arg & tursInt) > 0) {
    weekList.push(4)
  }
  if ((arg & friInt) > 0) {
    weekList.push(5)
  }
  if ((arg & satInt) > 0) {
    weekList.push(6)
  }
  if ((arg & sunInt) > 0) {
    weekList.push(0)
  }
  return weekList
}
export const getAlarmType = (cal, deviceId, hr, workTime = []) => {
  let bool = true;
  if (workTime.length !== 0) {
    // 判断是否报警
    const {
      week,
      begin,
      end
    } = workTime[0];


    const workDayList = getWorkDayList(week);

    const today = new Date().getDay(); // 星期几
    const beginTime = new Date().setHours(begin.split(':')[0], begin.split(':')[1], 0);
    const endTime = new Date().setHours(end.split(':')[0], end.split(':')[1], 0);
    const now = +new Date()

    bool = workDayList.includes(today) && beginTime < now && endTime > now;
  }

  const data = Math.round(cal).toString(2).padStart(16, '0');
  const higtSeven = hr.toString(2).padStart(8, '0');
  let bodyTempMakeUp = 0;
  let wristTempMakeUp = 0;
  let calories = 0;

  // 体温、腕温小数位补偿
  if (deviceId === 'ETE' || deviceId === 'Thermo') {
    bodyTempMakeUp = data[1];
    wristTempMakeUp = data[2];
  }


  if (data[0] === '1' && bool) {
    // 报警
    calories = '--'
    if (data[5] === '1') {
      // sos 报警
      return {
        alarmType: 1,
        alarmTypeCn: 'Sos',
        bodyTempMakeUp,
        wristTempMakeUp,
        calories
      }
    } else if (data[6] === '1') {
      // 高温
      return {
        alarmType: 2,
        alarmTypeCn: 'High Temperature',
        bodyTempMakeUp,
        wristTempMakeUp,
        calories
      }
    } else if (data[7] === '1') {
      // 低温
      return {
        alarmType: 3,
        alarmTypeCn: 'Low Tempeture',
        bodyTempMakeUp,
        wristTempMakeUp,
        calories
      }
    } else if (data[4] === '1') {
      // 未佩戴
      return {
        alarmType: 4,
        alarmTypeCn: 'Not Worn',
        bodyTempMakeUp,
        wristTempMakeUp,
        calories
      }
    } else if (data[3] === '1') {
      // 高温
      return {
        alarmType: 5,
        alarmTypeCn: 'Low Power',
        bodyTempMakeUp,
        wristTempMakeUp,
        calories
      }
    }
  } else {
    let cal = '';
    if (deviceId === 'Aura' || deviceId === 'Leap') {
      cal = data.substring(1, 16)
    } else {
      cal = higtSeven + data.substring(8, 16)
    }
    calories = parseInt(cal, 2);
    return {
      alarmType: 6,
      alarmTypeCn: 'No Alarm',
      bodyTempMakeUp,
      wristTempMakeUp,
      calories
    }
  }
}

export const deepClone = (origin, target) => {
  var target = target || {}, //设置target的默认值，不传值默认为空对象
    toStr = Object.prototype.toString, //原型链方法：判断数值类型
    arrStr = '[object Array]';

  for (var prop in origin) {
    if (origin.hasOwnProperty(prop)) { //判断是否为对象自身属性

      if (origin[prop] !== 'null' && typeof (origin[prop]) === 'object') { //判断需要被克隆的对象的属性是否为原始值
        target[prop] = toStr.call(origin[prop]) === arrStr ? [] : {}; //不是原始值，将其转为数组或对象
        deepClone(origin[prop], target[prop]); //如果不是原始值，继续调用自身，判断该属性的子属性是否为原始值
      } else {
        target[prop] = origin[prop]; //如果是原始值的话，将其复制给克隆对象
      }
    }
  }
  return target
}

// 单例
export const singleton = (fn) => {
  let result;
  return function () {
    return result || (result = fn.apply(this, arguments));
  }
}

// 防抖
export const debounce = (func, time) => {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
      timer = null
    }
    timer = setTimeout(func, time * 1000)
  }
}

// 遍历beacon 简单列表获取网关的固定座标以及网关的未知名称
export const getFixedCoordinates = (gt, beaconList) => {
  const target = beaconList.find(item => item.mac === gt);
  if (target) {
    return {
      coordinate: {
        lat: target.x,
        lng: target.y
      },
      positionName: target.gatewayname
    }
  } else {
    return {
      coordinate: {
        lat: 0,
        lng: 0
      },
      positionName: 'Unknown'
    }
  }

}

// 睡眠页面图标配置
export const extend = {
  yAxis: {
    splitNumber: 1,
    splitLine: {
      show: true,
      lineStyle: {
        color: "#465587",
        width: 1,
        type: "dashed"
      }
    },
    axisLabel: {
      color: "#fff"
    }
  },
  xAxis: {
    axisLabel: {
      textStyle: {
        color: "#fff"
      }
    }
  },
  series: {
    label: {
      show: true,
      position: "top"
    },
    barWidth: 20
  }
};
export const grid = {
  x: 0,
  y: 20,
  y2: 0,
  x2: 0,
  backgroundColor: "#fff",
  y2: 0
};

export const defaultMember = Object.freeze({
  deviceId: "ETE", //获取用户的设备型号
  age: 0,
  gender: 0,
  nickName: "--",
  avatar: require("../assets/img/img-avater.png"),
  mac: "--",
  name: "--",
  hr: 0,
  hbp: 0,
  lbp: 0,
  totalCal: 0,
  steps: 0,
  bodyTemp: 0.0,
  doctorId: "--", // 部门id
  alarmType: 6, //报警类型 6:无报警（方便报警优先级排序采用的6）
  position: 0,
  positionName: "--"
});
// lat lng 验证规则
export const validateLat = (rule, value, callback) => {
  if (typeof value === 'string' && Number.isNaN(Number(value))) {
    callback("Coordinates must be numbers");
  } else {
    if (value < -90 || value > 90) {
      callback("Latitude must be between -90 and 90");
    } else {
      callback()
    }
  }
};
export const validateLng = (rule, value, callback) => {
  if (typeof value === 'string' && Number.isNaN(Number(value))) {
    callback("Coordinates must be numbers");
  } else {
    if (value < -180 || value > 180) {
      callback("Latitude must be between -180 and 180");
    } else {
      callback()
    }
  }
};
export const emailCheck = (rule, value, callback) => {
  const emailReg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
  if (!value) {
    callback("Please input eamil");
  } else {
    if (!emailReg.test(value)) {
      callback("Please enter the correct email format");
    } else {
      callback();
    }
  }
}

const macReg = /[0-9a-z]{2}-[0-9a-z]{2}-[0-9a-z]{2}-[0-9a-z]{2}-[0-9a-z]{2}-[0-9a-z]{2}/;

export const getWorkDay = (arg) => {
  if (typeof arg !== 'number') {

    let weekStr = [0, 0, 0, 0, 0, 0, 0];
    if (arg.includes('Monday')) {
      weekStr[0] = 1;
    }
    if (arg.includes('Tuesday')) {
      weekStr[1] = 1;
    }
    if (arg.includes('Wednesday')) {
      weekStr[2] = 1;
    }
    if (arg.includes('Thursday')) {
      weekStr[3] = 1;
    }
    if (arg.includes('Friday')) {
      weekStr[4] = 1;
    }
    if (arg.includes('Saturday')) {
      weekStr[5] = 1;
    }
    if (arg.includes('Sunday')) {
      weekStr[6] = 1;
    }
    return parseInt(weekStr.join(''), 2);
  } else {
    const monInt = parseInt(1000000, 2);
    const tusInt = parseInt(100000, 2);
    const wesInt = parseInt(10000, 2);
    const tursInt = parseInt(1000, 2);
    const friInt = parseInt(100, 2);
    const satInt = parseInt(10, 2);
    const sunInt = parseInt(1, 2);

    let weekList = [];
    if ((arg & monInt) > 0) {
      weekList.push('Monday')
    }
    if ((arg & tusInt) > 0) {
      weekList.push('Tuesday')
    }
    if ((arg & wesInt) > 0) {
      weekList.push('Wednesday')
    }
    if ((arg & tursInt) > 0) {
      weekList.push('Thursday')
    }
    if ((arg & friInt) > 0) {
      weekList.push('Friday')
    }
    if ((arg & satInt) > 0) {
      weekList.push('Saturday')
    }
    if ((arg & sunInt) > 0) {
      weekList.push('Sunday')
    }
    return weekList
  }
}

export const week = Object.freeze([{
    label: "Monday",
    id: 1
  },
  {
    label: "Tuesday",
    id: 2
  },
  {
    label: "Wednesday",
    id: 3
  },
  {
    label: "Thursday",
    id: 4
  },
  {
    label: "Friday",

    id: 5
  },
  {
    label: "Saturday",
    id: 6
  },
  {
    label: "Sunday",
    id: 7
  }
])

export const defaultState = () => ({
  userInfo: {},
  userList: [],
  user_info_list: [],
  departList: [],
  serverList: [],
  companyList: [],
  beaconSimpleList: [],
  roleList: [],
  saved_DoctorId: undefined,
  areaList: [],
  alarmData_filter_saved: [],
  alarmData_saved: []
})

// 获取存储的cookie
export const getTokenInfo = () => {
  let loginInfo = Cookie.get('loginInfo'); // 为储存为undefined
  loginInfo = loginInfo || {
    id: 0,
    access_token: 0,
    refresh_token: 0
  }
  return loginInfo
}

// 时区选择
export const timeZoneList = Object.freeze([
  {
    label: 'UTC -12:00',
    value: '-12',
    id: 1
  },
  {
    label: 'UTC -11:00',
    value: '-11',
    id: 2
  },
  {
    label: 'UTC -10:00',
    value: '-10',
    id: 3
  },
  {
    label: 'UTC -09:00',
    value: '-9',
    id: 4
  },
  {
    label: 'UTC -08:00',
    value: '-8',
    id: 5
  },
  {
    label: 'UTC -07:00',
    value: '-7',
    id: 6
  },
  {
    label: 'UTC -06:00',
    value: '-6',
    id: 7
  },
  {
    label: 'UTC -05:00',
    value: '-5',
    id: 8
  },
  {
    label: 'UTC -04:00',
    value: '-4',
    id: 9
  },
  {
    label: 'UTC -03:00',
    value: '-3',
    id: 10
  },
  {
    label: 'UTC -02:00',
    value: '-2',
    id: 11
  },
  {
    label: 'UTC -01:00',
    value: '-1',
    id: 12
  },
  {
    label: 'UTC -00:00',
    value: '-0',
    id: 13
  },
  {
    label: 'UTC +01:00',
    value: '1',
    id: 14
  },
  {
    label: 'UTC +02:00',
    value: '2',
    id: 15
  },
  {
    label: 'UTC +03:00',
    value: '3',
    id: 16
  },
  {
    label: 'UTC +04:00',
    value: '4',
    id: 17
  },
  {
    label: 'UTC +05:00',
    value: '5',
    id: 18
  },
  {
    label: 'UTC +06:00',
    value: '6',
    id: 19
  },
  {
    label: 'UTC +07:00',
    value: '7',
    id: 20
  },
  {
    label: 'UTC +08:00',
    value: '8',
    id: 21
  },
  {
    label: 'UTC +09:00',
    value: '9',
    id: 22
  },
  {
    label: 'UTC +10:00',
    value: '10',
    id: 23
  },
  {
    label: 'UTC +11:00',
    value: '11',
    id: 24
  },
  {
    label: 'UTC +12:00',
    value: '12',
    id: 25
  },
])
