import request from '@/utils/request'

export default {

    // 分页讲师查询

    getTeacherFront(current,size){
        return request({
            url: `/eduCms/teacherFront/getTeacherFront/${current}/${size}`,
            method: "get"
        })

    },

    // 根据id获取讲师信息
    getTeacherAll(id){
        return request({
            url: `/eduCms/teacherFront/getTeacherAllById/${id}`,
            method: "get"
        })
    }
    
}