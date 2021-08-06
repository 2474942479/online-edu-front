import request from '@/utils/request'
const api_name = '/eduService/video'
export default {
    saveOrUpdateVideo(videoInfo) {
        return request({
            url: `${api_name}/saveOrUpdateVideo`,
            method: 'post',
            data: videoInfo
        })
    },
    
    deleteVideo(id) {
        return request({
            url: `${api_name}/removeAllVideo/${id}`,
            method: 'delete'
        })
    },

    getVideoInfo(id){
        return request({
            url: `${api_name}/getVideoInfo/${id}`,
            method: 'get'
        })

    },

    // 删除上传到阿里云的视频
    deleteAliyunVod(VideoSourceId){
        return request({
            url: `eduService/vod/removeVod/${VideoSourceId}`,
            method: 'delete'
        })
    }
    
}