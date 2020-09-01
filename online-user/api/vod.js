import request from '@/utils/request'

export default {

  getPlayAuth(vid) {
    return request({
      url: `/eduVod/video/getVideoPlayAuth/${vid}`,
      method: 'get'
    })
  }

}