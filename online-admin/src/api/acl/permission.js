import request from '@/utils/request'

const api_name = '/admin/acl/permission'

export default {
    permissionList() {
        return request({
            url: `${api_name}/getAllPermission`,
            method: 'get'
        })
    },

    removeById(id) {
        return request({
            url: `${api_name}/deleteAllById/${id}`,
            method: "delete"
        })
    },

    saveLevelOne(menu) {
        return request({
            url: `${api_name}/savePermission`,
            method: "post",
            data: menu
        })
    },

    update(menu) {
        return request({
            url: `${api_name}/updatePermission`,
            method: "put",
            data: menu
        })
    }
}