import request from '@/utils/request'

export default {

    // 根据课程id查询返回最终发布信息
    getFinalRelease(courseId){
        return request({
            url: `/eduService/course/getFinalReleaseVo/${courseId}`,
            method: 'get',
          })
    },

    changeReleaseStatus(courseInfo){
        return request({
            url: `/eduService/course/updateReleaseStatus`,
            method: 'post',
            data:courseInfo
          })
    }

  
}
