import request from '@/utils/request'

export default {

    // 根据手机号获取验证码
    sendCodeByMobile(mobile) {
        return request({
            url: `/eduCms/msm/send/${mobile}`,
            method: 'get'
        })
    }
}