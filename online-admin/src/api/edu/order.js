import request from '@/utils/request'

export default {

    getOrderList(orderQueryDTO) {
        return request({
            url: `/orderService/order/getOrderList`,
            method: "post",
            data: orderQueryDTO
        })
    },

    getOrderInfo(orderNumber) {
        return request({
            url: `/orderService/order/getOrderInfo/${orderNumber}`,
            method: "get"
        })
    },
}