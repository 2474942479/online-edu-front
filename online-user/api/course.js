import request from '@/utils/request'

export default {

    // 条件分页课程查询

    getCourseList(courseQuery){
        return request({
            url: `/eduCms/course/getCourseList`,
            method: "post",
            data: courseQuery
        })

    },

    // 查询所有课程分类
    getAllSubject(){
        return request({
            url: `/eduService/subject/getAllSubject`,
            method: "get"
        })
    },

    // 获取课程详情页面所有信息

    getCourseInfo(id){
        return request({
            url: `/eduCms/course/getCourseInfo/${id}`,
            method: "get"
        })

    }
    
}