import request from '@/utils/request'

export default {


    //查询所有的课程分类
    getAllList(){
        return request({
            url: '/eduService/subject/getAllSubject',
            method: 'get',
          })
    },

    // 查询所有讲师
    getAllTeacher(){
        return request({
            url: '/eduService/teacher/findAll',
            method: 'get',
        })

    },
    
    // 分页条件查询所有的课程
    getCourseListPage(courseQueryDTO){
        return request({
            url: `/eduService/course/getCourseListPage`,
            method: 'post',
            data: courseQueryDTO
        })
    },

// 增加课程基本信息
    addCourseInfo(courseInfo){
        return request({
            url: '/eduService/course//addCourseInfo',
            method: 'post',
            data:courseInfo
        })
    },

    

    // 通过课程id查询课程基本信息
    getCourseInfoVoById(id){
        return request({
            url:`/eduService/course/getCourseInfoVoById/${id}`,
            method:"get"
        })
    },

    // 修改课程基本信息
    updateCourseInfoVo(courseInfo){
        return request({
            url:"/eduService/course/updateCourseInfoVo",
            method:"put",
            data:courseInfo
        })
    },

    removeCourseById(courseId){
        return request({
            url:`/eduService/course/deleteCourse/${courseId}`,
            method:"delete"
        })
    }
  
}
