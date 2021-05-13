import request from '@/utils/request'

const api_name = '/admin/acl/permission'

export default {
  getAllPermission() {
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

  save(menu) {
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
  },

  getRolePermission(roleId) {
    return request({
      url: `${api_name}/getRolePermission/${roleId}`,
      method: 'get'
    })
  },
  
  assignRolePermission(rolePermissionDTO) {
    return request({
      url: `${api_name}/assignRolePermission`,
      method: "post",
      data: rolePermissionDTO
    })
  }
}
