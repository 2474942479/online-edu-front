import request from '@/utils/request'

export default {

    // 根据手机号获取验证码
    sendCodeByMobile(mobile) {
        return request({
          url: `/eduMsm/msm/send/${mobile}`,
          method: 'get'
        })
      },

    // 注册
    postRegisterInfo(registerInfo) {
        return request({
          url: `/user/register`,
          method: 'post',
          data: registerInfo
        })
      }
}