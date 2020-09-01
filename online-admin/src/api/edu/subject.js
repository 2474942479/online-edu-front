import request from '@/utils/request'

export default {


    //查询所有的课程分类列表
    getAllList(){
        return request({
            url: '/eduService/subject/getAllSubject',
            method: 'get',
          })
    }

  
}
