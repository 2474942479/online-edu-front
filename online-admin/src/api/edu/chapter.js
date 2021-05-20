import request from '@/utils/request'

export default {


    saveOrUpdateChapter(chapterDTO) {
        return request({
            url: `/eduService/chapter/saveOrUpdateChapter`,
            method: "post",
            data: chapterDTO
        })

    },
    getChapter(chapterId) {
        return request({
            url: `/eduService/chapter/getChapterInfo/${chapterId}`,
            method: "get"
        })

    },

    removeChapter(chapterId) {
        return request({
            url: `/eduService/chapter/removeChapter/${chapterId}`,
            method:"delete"
        })

    },

    //查询所有的课程分类列表
    getAllChapterVO(courseId) {
        return request({
            url: `/eduService/chapter/getAllChapterVO/${courseId}`,
            method: 'get',
        })
    }


}
