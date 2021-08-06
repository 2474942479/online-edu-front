import request from '@/utils/request'

export default {

    // 1 讲师列表（后端中条件查询分页）
    // current:当前页   size：每页记录数    teacherQuery：查询条件
    getUserList(userQueryDTO) {
        return request({
            url: `/user/getUserList`,
            method: 'post',
            data: userQueryDTO
        })
    },

    getUserInfoById(id) {
        return request({
            url: `/user/getUserInfoById/${id}`,
            method: 'get'
        })
    },

    updateUser(userDTO) {
        return request({
            url: `/user/updateUser`,
            method: 'post',
            data: userDTO
        })
    },

    removeUser(id) {
        return request({
            url: `/user/removeUser/${id}`,
            method: 'get'
        })
    }

}
