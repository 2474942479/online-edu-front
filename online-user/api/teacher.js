import request from '@/utils/request'

export default {

    // 分页讲师查询

    getTeacherList(teacherQueryDTO){
        return request({
            url: `/eduCms/teacher/getTeacherList`,
            method: "post",
            data: teacherQueryDTO
        })

    },

    // 根据id获取讲师信息
    getTeacherInfoById(id){
        return request({
            url: `/eduCms/teacher/getTeacherInfoById/${id}`,
            method: "get"
        })
    }
    
}