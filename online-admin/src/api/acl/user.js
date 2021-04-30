import request from '@/utils/request'

const api_name = '/admin/acl/user'

export default {

  getPageList(userQueryDTO) {
    return request({
      url: `${api_name}/pageUser`,
      method: 'post',
      data: userQueryDTO // url查询字符串或表单键值对
    })
  },
  getById(id) {
    return request({
      url: `${api_name}/get/${id}`,
      method: 'get'
    })
  },

  saveOrUpdateUserInfo(user) {
    return request({
      url: `${api_name}/saveOrUpdateUserInfo`,
      method: 'post',
      data: user
    })
  },
  getAssign(userId) {
    return request({
      url: `${api_name}/toAssign/${userId}`,
      method: 'get'
    })
  },
  saveAssign(userId, roleId) {
    return request({
      url: `${api_name}/doAssign`,
      method: 'post',
      params: { userId, roleId }
    })
  },
  removeById(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'delete'
    })
  },
  batchRemove(ids) {
    return request({
      url: `${api_name}/batchRemove`,
      method: 'delete',
      data: ids
    })
  }
}
