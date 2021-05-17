import request from '@/utils/request'

export default {


    //查询所有的课程分类列表
    getAllList() {
        return request({
            url: '/eduService/subject/getAllSubject',
            method: 'get',
        })
    },

    getSubjectInfo(id) {
        return request({
            url: '/eduService/subject/getSubjectInfo/' + id,
            method: 'get'
        })
    },

    saveOrUpdateSubject(subjectDTO) {
        return request({
            url: '/eduService/subject/saveOrUpdateSubject',
            method: 'post',
            data: subjectDTO
        })
    },

    removeSubject(id) {
        return request({
            url: '/eduService/subject/deleteSubject/' + id,
            method: 'delete'
        })
    }


}
