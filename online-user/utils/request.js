import axios from 'axios'
import cookie from "js-cookie";
import { Message, MessageBox } from 'element-ui'
// 创建axios实例
const service = axios.create({
  baseURL: 'http://localhost:10002', // api的base_url
  timeout: 5000 // 请求超时时间
})

// 第三步 创建拦截器  发送请求前进行拦截
service.interceptors.request.use(
  config => {
    // 判断token是否有值
    if (cookie.get("token")) {
      // 将值设置进header中
      config.headers['token'] = cookie.get('token')
    }
    return config
  },
  err => {
    return Promise.reject(err);
  })

// http response 拦截器
service.interceptors.response.use(
  response => {

    if (response.data.code == 0) {
      return response
    } else {
      /**
       * code为非20000是抛错 可结合自己业务进行修改
       */
      // 返回错误码,自行定义,根据项目需求和实际情况
      switch (response.data.code) {
        // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
        case 202007: case 50008 :case 50012: case 50014:
          // 只会在本页面显示，跳转后不显示
          cookie.remove('token');
          cookie.remove("userInfo")
          MessageBox.confirm(
            '你已被登出，可以取消继续留在该页面，或者重新登录',
            '确定登出',
            {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
              // window.setTimeout("window.location='/login'",3000);
              window.location.href="/login"
          })
          break;
        case 25000:
          //25000：订单支付中，不做任何提示
          return response
        default:
          Message({
            message: response.data.message || 'error',
            type: 'error',
            duration: 5 * 1000
          })
          // 返回一个带有拒绝原因的Promise对象。
          return Promise.reject('error')
      }
    }
  },
  error => {
    Message({
            message: response.data.message || 'error',
            type: 'error',
            duration: 5 * 1000
          })
          return Promise.reject(error)  // 返回接口返回的错误信息
  });

export default service