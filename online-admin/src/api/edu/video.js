import request from '@/utils/request'
const api_name = '/eduService/video'
export default {
    saveVideoInfo(videoInfo) {
        return request({
            url: `${api_name}/saveVideo`,
            method: 'post',
            data: videoInfo
        })
    },
    updateVideoInfo(videoInfo) {
        return request({
            url: `${api_name}/updateVideo`,
            method: 'put',
            data: videoInfo
        })
    },
    deleteVideo(id) {
        return request({
            url: `${api_name}/${id}`,
            method: 'delete'
        })
    },

    getVideoInfo(id){
        return request({
            url: `${api_name}/getVideo/${id}`,
            method: 'get'
        })

    },

    // 删除上传到阿里云的视频
    deleteAliyunVod(VideoSourceId){
        return request({
            url: `eduVod/video/removeVod/${VideoSourceId}`,
            method: 'delete'
        })
    }
    
}