import request from '@/utils/request'

export default {

    // 登录
    login(loginInfo) {
        return request({
            url: `/user/login`,
            method: 'post',
            data: loginInfo
        })
    },

    //根据token获取用户信息
    getUserInfoByToken() {
        return request({
            url: `/user/getUserInfoByToken`,
            method: 'get',
        })
    },

    updateUser(userDTO) {
        return request({
            url: `/user/updateUser`,
            method: "post",
            data: userDTO
        })
    },

    perfectUser(resetDTO) {
        return request({
            url: `/user/perfectUser`,
            method: "post",
            data: resetDTO
        })
    },

    updateUserPass(resetDTO) {
        return request({
            url: `/user/updateUserPass`,
            method: "post",
            data: resetDTO
        })
    },

    updateUserMobile(resetDTO) {
        return request({
            url: `/user/updateUserMobile`,
            method: "post",
            data: resetDTO
        })
    }

}