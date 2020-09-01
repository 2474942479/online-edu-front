import request from '@/utils/request'

export default {

    // 1 讲师列表（后端中条件查询分页）
    // current:当前页   size：每页记录数    teacherQuery：查询条件
    getTeacherListPage(current,size,teacherQuery) {
        return request({
            // url: '/eduservice/teacher/getTeacherListPage/'+current+"/"+size,
            url: `/eduService/teacher/getTeacherListPage/${current}/${size}`,   //  表达式赋值
            method: 'post',
            // teacherQuery条件对象 后端用RequestBody获取数据
            // data表示把对象转换成json数据传递到接口里
            data: teacherQuery
        })
    },

// 根据id删除讲师
    removeTeacherById(id){
        return request({
            url: `/eduService/teacher/removeTeacher/${id}`,
            method: 'delete',
        })

    },

    // 添加讲师
    addTeacher(teacherInfo){
        return request({
            url:`/eduService/teacher/addTeacher`,
            method:'post',
            data: teacherInfo
        })
    },

// 通过id查询讲师信息
    getTeacherInfoById(id){
        return request({
            url: `/eduService/teacher/getTeacherInfo/${id}`,
            method: "get"
        })
    },

    // 修改讲师
    uptateTeacher(teacherInfo){
        return request({
            url: `/eduService/teacher/updateTeacher`,
            method: "put",
            data: teacherInfo
        })
    }



}
