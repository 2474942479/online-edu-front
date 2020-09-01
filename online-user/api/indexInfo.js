import request from '@/utils/request'
export default {

    // 查询前两条banner信息 前8条热门课程和前4个讲师
  getIndexInfo() {
    return request({
      url: `/eduCms/indexFront/getIndexInfo`,
      method: 'get'
    })
  },


}