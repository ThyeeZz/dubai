import axios from 'axios'
import store from '@/store'
import router from '@/router/index'
import md5 from 'md5';
import Vue from 'vue'



// create an axios instance
const service = axios.create({
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
})

const getSignature = (u, t, d, s, m) => {
  let str = `FROM:${u}-(T:${t}-DATA:${JSON.stringify(d)}|SECRET:${s})=${m}`;
  let signature = md5(str).toUpperCase();
  return signature
}

const tokenRequest = function (url, data) {
  const encryptKey = '13CD7F1AAFD0D45E5CFE080BF8CED693';
  const udid = '60.186.186.233'; //客户端ip
  let time = new Date().getTime();
  data = {
    refresh_token: store.state.userInfo.refresh_token,
    id: store.state.userInfo.id
  };
  return service({
    url: url,
    method: 'POST',
    data: data,
    headers: {
      'UDID': `${udid}`,
      'TIME': time,
      'SYSAUTH': `${getSignature(udid,time,data,encryptKey,'POST')}`,
      "AccessToken": 0,
      'UID': window.sessionStorage.id ? window.sessionStorage.id : 0,
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
const getToken = function () {

  tokenRequest('api/auth/token').then(res => {
    let {
      status_code,
      data
    } = res.data
    if (status_code == 200) {
      store.state.userInfo.refresh_token = data.refresh_token;
      store.state.userInfo.id = data.id;
      store.state.userInfo.access_token = data.access_token;
    } else {
      router.push({
        name: "login"
      })
      Vue.prototype.$alert('You have been logged out, please log in again',
        'Logout prompt ', {
          confirmButtonText: 'Confirm',
          type: 'warning',
          callback: action => {
            return
          }
        })
    }
  })

}
export default getToken;
