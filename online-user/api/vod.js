import request from '@/utils/request'

export default {

  getPlayAuth(vid) {
    return request({
      url: `/eduService/vod/getVideoPlayAuth/${vid}`,
      method: 'get'
    })
  }

}