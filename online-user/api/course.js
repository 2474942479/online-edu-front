import request from '@/utils/request'

export default {

    // 条件分页课程查询

    getCourseList(current,size,courseQuery){
        return request({
            url: `/eduCms/course/getCourseList/${current}/${size}`,
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

    getCourseAllInfo(id){
        return request({
            url: `/eduCms/course/getCourseAllInfo/${id}`,
            method: "get"
        })

    }
    
}