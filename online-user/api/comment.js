import request from '@/utils/request'

export default {


    // 发表评论
    saveComment(commentDTO) {
        return request({
            url: `/eduCms/comment/saveCommentInfo`,
            method: "post",
            data: commentDTO
        })
    },

    // 分页查询评论

    getCommentList(commentQueryDTO) {
        return request({
            url: `/eduCms/comment/getCommentList`,
            method: "post",
            data: commentQueryDTO
        })
    }

}