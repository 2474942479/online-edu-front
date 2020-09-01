import request from '@/utils/request'
export default {
    createStatistics(day) {
        return request({
            url: `/statisticsService/daily/${day}`,
            method: 'post'
        })
    },

    show(begin,end){
        return request({
            url:`/statisticsService/daily/showBySearch`,
            method:'get',
            params:{begin,end}
        })
    }
}