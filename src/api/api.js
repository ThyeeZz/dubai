import axios from '@/api/index'

// ---------------------------------------------平台用户相关------------------------------------------------
//登录接口
export const login = (loginInfo) => {
  let {
    username,
    password
  } = loginInfo
  return axios.request('/api/auth/login', 'POST', {
    username,
    password
  })
}

// 更新token 接口
export const refreshToken = ({
  refresh_token,
  id
}) => {
  return axios.request('/api/auth/token', 'POST', {
    refresh_token,
    id
  })
}

// 用户注销接口
export const logout = () => {
  return axios.request('/api/auth/logout', 'DELETE', )
}

// 新建用户接口
export const addUser = ({
  username,
  password,
  email,
  hid,
  dept,
  role
}) => {
  return axios.request('/api/user/add', 'POST', {
    username,
    password,
    email,
    hid,
    dept,
    role
  })
}

// 更新用户接口
export const updateUser = ({
  id,
  username,
  password,
  email,
  hid,
  dept,
  role
}) => {
  return axios.request('/api/user/update', 'POST', {
    id,
    username,
    password,
    email,
    hid,
    dept,
    role
  })
}

// 分也搜索平台用户接口
export const getAllClient = ({
  pagesize,
  pageindex,
  name
}) => {
  return axios.request('api/user/pager', 'GET', {
    pagesize,
    pageindex,
    name
  })
}

// 删除用户
export const deleteClient = ({
  id
}) => {
  return axios.request('api/user/del', 'DELETE', {
    id
  })
}

// 强制登出
export const forceLogout = ({
  id
}) => {
  return axios.request("api/user/logout", "DELETE", {
    id
  })
}

// -----------------------------------------------------Cling 数据相关----------------------------------------
// 获取平台所有用户信息
export const getAllUserInfo = () => {
  return axios.request('/api/cling/user/all', 'GET')
}

// 获取平台用户今日健康信息
export const getHealthInfo = () => {
  return axios.request('/api/cling/health/all/today', 'GET')
}

// 强制刷新平台用户信息
export const refreshUser = () => {
  return axios.request('/api/cling/refresh/user', 'GET')
}

// 获取当前用户可以管理的部门
export const getMyDoctor = () => {
  return axios.request("api/doctor/my", "GET");
}

// -------------------------------------------------公司相关接口----------------------------------------------
// 新建公司接口
export const createCompany = ({
  name,
  phone,
  address,
  lid,
  workTime,
  lng, // 经度
  lat // 纬度
}) => {
  return axios.request('/api/hospital/add', 'POST', {
    name,
    phone,
    address,
    lid,
    workTime,
    lng, // 经度
    lat // 纬度
  })
}

// 获取公司接口
export const getCompany = ({
  id
}) => {
  return axios.request('/api/hospital/get', 'GET', {
    id
  })
}

// 更新公司接口
export const updateCompany = ({
  id,
  name,
  phone,
  address,
  lid,
  workTime,
  lng, // 经度
  lat // 纬度
}) => {
  return axios.request('/api/hospital/update', 'POST', {
    id,
    name,
    phone,
    address,
    lid,
    workTime,
    lng, // 经度
    lat // 纬度
  })
}

// 获取公司简单列表
export const getCompanySimpleList = () => {
  return axios.request('/api/hospital/list', 'GET')
}

// 分也搜索公司
export const getCompanyPager = ({
  pagesize,
  pageindex,
  name
}) => {
  return axios.request('/api/hospital/pager', 'GET', {
    pagesize,
    pageindex,
    name
  })
}

// 删除公司接口
export const delCompany = ({
  id
}) => {
  return axios.request('/api/hospital/del', 'DELETE', {
    id
  })
}

// 获取公司在线人数
export const getOnlineNumber = ({
  id
}) => {
  return axios.request('/api/hospital/online', 'GET', {
    id
  })
}

// 获取哦平台统计数据
export const getStatisticsDataApi = () => {
  return axios.request('api/cling/health/profile', 'GET')
}

// ------------------------------------------------------部门相关接口-------------------------------------------
// 新建部门接口
export const createDepart = ({
  name,
  phone,
  gender,
  hid,
  sServerId,
  lat,
  lng,
  diy,
  workTime
}) => {
  return axios.request('api/doctor/add', 'POST', {
    name,
    phone,
    gender,
    hid,
    sServerId,
    lat,
    lng,
    diy,
    workTime
  })
}
// 部门分也查询
export const departPager = ({
  pagesize,
  pageindex,
  name
}) => {
  return axios.request('api/doctor/pager', 'GET', {
    pagesize,
    pageindex,
    name
  })
}
// 部门更新接口
export const updateDepart = (modifyForm) => {
  return axios.request('api/doctor/update', 'POST', modifyForm)
}
// 删除部门接口
export const delDepart = ({
  id
}) => {
  return axios.request("api/doctor/del", 'DELETE', {
    id
  })
}
// 获取部门简单列表
export const getDprtSimpleList = () => {
  return axios.request("api/doctor/list", "GET")
}


//  --------------------------------------------------------------区域相关接口---------------------------------
// 创建区域
export const createArea = ({
  name,
  lat,
  lng
}) => {
  return axios.request("api/location/add", 'POST', {
    name,
    lat,
    lng
  })
}
// 获取特定区域接口
export const getSpecificArea = ({
  id
}) => {
  return axios.request("api/location/get", 'GET', {
    id
  })
}
// 更新区域接口
export const updateArea = ({
  id,
  name,
  lat,
  lng
}) => {
  return axios.request("api/location/update", 'POST', {
    id,
    name,
    lat,
    lng
  })
}
// 获取所有区域简列表
export const getAreaSimpleList = () => {
  return axios.request("api/location/all", 'GET')
}
// 分也搜索区域接口
export const getAreaPager = ({
  pagesize,
  pageindex,
  name
}) => {
  return axios.request("api/location/pager", 'GET', {
    pagesize,
    pageindex,
    name
  })
}
// 删除区域接口
export const deleteArea = ({
  id
}) => {
  return axios.request("api/location/del", 'DELETE', {
    id
  })
}


//  --------------------------------------------------------------网关相关接口-------------------------
// 网关分页查询
export const beaconPager = (queryBody) => {
  return axios.request("api/beacon/pager", 'GET', queryBody)
}
// 网关短列表
export const getBeaconSimpleList = () => {
  return axios.request('api/beacon/list', 'GET')
}
// 获取所有可用网关服务段列表
export const getSocketSimpleList = () => {
  return axios.request('api/socket/list', 'GET')
}
// 删除网关接口
export const deleteBeacon = ({
  mac
}) => {
  return axios.request('api/beacon/del', 'DELETE', {
    mac
  })
}
// 重启网管
export const rebootBeacon = ({
  ssid,mac
}) => {
  return axios.request('api/cling/reboot/gateway', 'GET', {
    ssid,mac
  })
}
// 网关更新
export const updateBeacon = (modifyForm) => {
  return axios.request('api/beacon/update', 'POST', modifyForm)
}

//  --------------------------------------------------------病人相关接口------------------------------
// 增加病人接口
export const addPatient = ({
  name,
  gender,
  doctorId,
  clingId,
  idcard,
  phone,
  contact,
  email,
  address,
  diy,
  workTime,
  tz
}) => {
  return axios.request('api/patient/add', 'POST', {
    name,
    gender,
    doctorId,
    clingId,
    idcard,
    phone,
    contact,
    email,
    address,
    diy,
    workTime,
    tz
  })
}
// 分页搜索病人
export const patientPager = ({
  pageindex,
  pagesize,
  name
}) => {
  return axios.request("api/patient/pager", 'GET', {
    pageindex,
    pagesize,
    name
  })
}
// 删除病人
export const delPatient = ({
  id
}) => {
  return axios.request("api/patient/del", 'DELETE', {
    id
  })
}
// 更新病人
export const updatePatient = ({
  id,
  name,
  gender,
  doctorId,
  clingId,
  idcard,
  phone,
  contact,
  email,
  address,
  diy,
  workTime,
  mac,
  tz
}) => {
  return axios.request("api/patient/update", 'POST', {
    id,
    name,
    gender,
    doctorId,
    clingId,
    idcard,
    phone,
    contact,
    email,
    address,
    diy,
    workTime,
    mac,
    tz
  })
}
// 获取病人接口
export const getOnePatient = ({
  id
}) => {
  return axios.request("api/patient/get", "GET", {
    id
  })
}

//  --------------------------------------------------------体征报警相关接口------------------------------
// 体征报警处理接口
export const handleAlarm = ({
  time,
  mac,
  type,
  handler
}) => {
  return axios.request('api/alert/handler', 'POST', {
    time,
    mac,
    type,
    handler
  })
}
// 分页查询体征报警接口
export const alarmPager = ({
  pagesize,
  pageindex,
  name,
  pid,
  type,
  start,
  end
}) => {
  return axios.request('api/alert/pager', 'GET', {
    pagesize,
    pageindex,
    name,
    pid,
    type,
    start,
    end
  })
}
// 获取指定的报警历史接口
export const getAlertHistory = ({
  mac,
  type,
  date
}) => {
  return axios.request("api/alert/history", "GET", {
    mac,
    type,
    date
  })
}
// 获取指定的报警处理接口
export const getActionHistory = ({
  mac,
  type,
  date
}) => {
  return axios.request("api/alert/action", "GET", {
    mac,
    type,
    date
  })
}


//   -------------------------------------------------角色相关接口---------------------------------------
// 获取所有用户的角色接口
export const getAllRole = () => {
  return axios.request("api/role/all", "GET")
}
// 获取用户角色接口
export const getSpecificRole = () => {
  return axios.request("api/role/get", "GET")
}
