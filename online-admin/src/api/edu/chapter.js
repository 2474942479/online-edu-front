import request from '@/utils/request'

export default {


    saveChapter(chapter) {
        return request({
            url: `/eduService/chapter/saveChapter`,
            method: "post",
            data: chapter

        })

    },
    getChapter(chapterId) {
        return request({
            url: `/eduService/chapter/getChapter/${chapterId}`,
            method: "get"
        })

    },
    updateChapter(chapter) {
        return request({
            url: `/eduService/chapter/updateChapter`,
            method: "put",
            data: chapter
        })

    },
    deleteChapter(chapterId) {
        return request({
            url: `/eduService/chapter/${chapterId}`,
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
