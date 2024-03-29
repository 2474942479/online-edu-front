import request from '@/utils/request'

const api_name = '/admin/acl/role'

export default {

  getPageList(roleQueryDTO) {
    return request({
      url: `${api_name}/pageRole`,
      method: 'post',
      data: roleQueryDTO // url查询字符串或表单键值对
    })
  },
  
  getById(id) {
    return request({
      url: `${api_name}/get/${id}`,
      method: 'get'
    })
  },

  save(role) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: role
    })
  },

  updateById(role) {
    return request({
      url: `${api_name}/update`,
      method: 'put',
      data: role
    })
  },

  removeById(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'delete'
    })
  },

  removeRows(idList) {
    return request({
      url: `${api_name}/batchRemove`,
      method: 'delete',
      data: idList
    })
  }

}
