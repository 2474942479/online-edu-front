import request from '@/utils/request'

export default {

    // 登录
    postLoginInfo(loginInfo){
        return request({
            url: `/user/login`,
            method: 'post',
            data: loginInfo
        })
    },

    //根据token获取用户信息
    getUserInfoByToken(){
        return request({
            url: `/user/getUserInfo`,
            method: 'get',
        })
    }
    
}