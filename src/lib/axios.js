import axios from 'axios'
import md5 from 'md5'
import {
  MessageBox,
  Message
} from 'element-ui'
import {
  reqConfig,
  encryptKey
} from '@/config/request'
import store from '@/store'
import {
  Loading
} from 'element-ui';
import getToken from './tokenRequest';
import Vue from 'vue';

// 请求数据时显示加载loding
let loadingInstance = null;
let needLoadingRequestCount = 0

function startLoading() {
  if (loadingInstance) {
    return
  }
  loadingInstance = Loading.service({
    lock: true,
    text: 'loading...',
    background: 'rgba(0,0,0,.5)'
  })
}

function alertMessage(message) {
  Message({
    message: message,
    type: 'error',
    duration: 3 * 1000,
    showClose: true
  })
}

// function endLoading() {
//   loadingInstance.close();
// }

// function showFullScreenLoading() {
//   // if (needLoadingRequestCount === 0) {
//     startLoading()
//   // }
//   // needLoadingRequestCount++
// }

// function tryHideFullScreenLoading() {
//   if (needLoadingRequestCount <= 0) return
//   needLoadingRequestCount--
//   if (needLoadingRequestCount === 0) {
//     endLoading()
//   }
// }
class HttpRequest {
  getInstanceConfig() {
    let config = {
      withCredentials: true, // send cookies when cross-domain requests
      timeout: 20000, // request timeout
    }
    return config
  }
  getTimestamp() {
    return new Date().getTime();
  }
  /**
   * @description: 生成请求的签名
   * @param 
   * u:客户端ip
   * v：版本
   * t：时间戳
   * d：请求body
   */
  getSignature(u, t, d, s, m) {
    if (m === 'GET' || m === 'DELETE') {
      let obj = d;
      let objStr = '';
      if (d) {
        for (let i in obj) {
          objStr += `&${i}=${obj[i]}`
        }
        objStr = encodeURI(objStr.substr(1));
      } else {
        objStr = null
      }

      let str = `FROM:${u}-(T:${t}-DATA:${objStr}|SECRET:${s})=${m}`;
      let signature = md5(str).toUpperCase();
      return signature
    }
    let str = `FROM:${u}-(T:${t}-DATA:${JSON.stringify(d)}|SECRET:${s})=${m}`;
    let signature = md5(str).toUpperCase();
    return signature
  }

  refreshToken() {
    let data = {
      refresh_token: store.state.userInfo.refresh_token,
      id: store.state.userInfo.id
    };
    this.request('api/auth/token', 'POST', data).then(res => {
      let {
        status_code,
        data
      } = res.data
      if (status_code == 200) {
        store.commit('upDateToken', data)
        resolve()
      } else {
        MessageBox.confirm('You have been logged out, you can stay on this page, or log in again',
            'please login again', {
              confirmButtonText: 'Login again',
              cancelButtonText: 'Cancel',
              type: 'warning'
            }).then(() => {
            router.push({
              name: "login"
            })
          })
          .catch((err) => {
            console.log('token 请求出错');

          })
        reject()
      }
    })
  }
  /**
   * @description: 对请求和返回过程的拦截处理
   * @param instance：axios实例
   */
  interceptors(instance) {
    instance.interceptors.request.use(config => {
      // Vue.prototype.$_loading.show()
      return config

    }, error => {
      return Promise.reject(error)
    })
    instance.interceptors.response.use(res => {
      // Vue.prototype.$_loading.hide()
      const data = {
        ...res.data
      };
      if (data.status_code !== 200) {
        switch (data.status_code) {
          // 3 系
          case 3001:
            alertMessage("Gateway Not Exist")
            break;
          case 3002:
            alertMessage("Cannot be deleted,there are children item")
            break;
          case 3003:
            alertMessage("File is empty")
            break;
          case 3004:
            alertMessage("Upload error")
            break;
          case 3005:
            alertMessage("MAC address format error")
            break;
          case 3006:
            alertMessage("Clear Cache Error")
            break;
          case 3007:
            alertMessage("Send sms failed")
            break;
          case 3008:
            alertMessage("Server is not  working")
            break;
          case 3009:
            alertMessage("Server does not exists")
            break;
          case 4001:
            alertMessage("The user has already logged in")
            break;
          case 4006:
            alertMessage("Signature not valid")
            break;
          case 4011:
            alertMessage("Wrong password")
            break;
          case 4012:
            alertMessage("Wrong password or username")
            break;
          case 4013:
            alertMessage("Please input your username")
            break;
          case 4014:
            alertMessage("Incorrect username format")
            break;
          case 4015:
            alertMessage("Username already exist")
            break;
          case 4016:
            alertMessage("User not exist")
            break;
          case 4018:
            alertMessage("UserId Already exist")
            break;
          case 4019:
            alertMessage("Please remove user first")
            break;
          case 4021:
            alertMessage("Please remove department first")
            break;
          case 4022:
            alertMessage("UserId not exist")
            break;
          case 4023:
            alertMessage("Device Mac address not exist")
            break;
          case 4024:
            alertMessage("Please remove company first")
            break;
          case 4025:
            alertMessage("Device MAC already exist")
            break;
          case 4026:
            alertMessage("Not enough permissions")
            break;
          case 4027:
            alertMessage("Out of your Authority")
            break;
          case 500:
            alertMessage('System Error')
            break;
          case 501:
            alertMessage('Parameter  Error')
            break;
          case 502:
            alertMessage('Insert  Error')
            break;
          case 503:
            alertMessage('Update  Error')
            break;
          case 504:
            alertMessage('Delete  Error')
            break;
          case 505:
            alertMessage('Get Data failed')
            break;
          case 507:
            alertMessage('Parameter is null')
            break;
          case 4000:
            getToken();
            break;
          default:
            alertMessage('Request error, please contact the background')
            break;
        }
        return Promise.reject(res.message || 'error')
      } else {
        return data
      }
    }, error => {
      alertMessage('Request error, please contact the background')
      return Promise.reject(error)
    })
  }
  /**
   * @description: 
   * @param options:请求参数；reqdata:请求body数据
   * @return: axios请求实例
   */
  request(url, method, data = null) {
    const instance = axios.create({
      withCredentials: true, // send cookies when cross-domain requests
      timeout: 20000, // request timeout
    });
    let timestamp = this.getTimestamp();
    let AccessToken = store.state.userInfo ? store.state.userInfo.access_token : 0;
    let Id = store.state.userInfo ? store.state.userInfo.id : 0;

    let sysauth = this.getSignature(reqConfig.udid, timestamp, data, encryptKey, method)

    this.interceptors(instance);
    return method === 'POST' && instance({
      url: url,
      method: method,
      data: data,
      headers: {
        'UDID': reqConfig.udid,
        'TIME': timestamp,
        'SYSAUTH': sysauth,
        "AccessToken": AccessToken,
        'UID': Id,
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }) || instance({
      url: url,
      method: method,
      params: data,
      headers: {
        'UDID': reqConfig.udid,
        'TIME': timestamp,
        'SYSAUTH': sysauth,
        "AccessToken": AccessToken,
        'UID': Id,
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
  }
}

export default HttpRequest
