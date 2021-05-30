import request from '@/utils/request'
export default {
    createStatistics(day) {
        return request({
            url: `/eduService/statistics/daily/produce`,
            method: 'get',
            params: { day }
        })
    },

    show(begin, end) {
        return request({
            url: `/eduService/statistics/daily/show`,
            method: 'get',
            params: { begin, end }
        })
    },

    getStatisticsByDay(day) {
        return request({
            url: `/eduService/statistics/daily/getStatisticsByDay`,
            method: `get`,
            params: { day }
        })
    }


}