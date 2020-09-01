import request from '@/utils/request'

export default {


    // 发表评论
    saveComment(commentInfo) {
        return request({
            url: `/eduCms/comment/saveCommentInfo`,
            method: "post",
            data: commentInfo
        })
    },

    // 分页查询评论

    getCommentList(current, size, courseId) {
        return request({
            url: `/eduCms/comment/${current}/${size}/${courseId}`,
            method: "get",
        })
    }

}