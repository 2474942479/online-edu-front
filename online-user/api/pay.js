import request from '@/utils/request'

export default {

    // 生成支付二维码
    createWxCode(orderNumber) {
        return request({
          url: `/orderService/payLog/createWxCode/${orderNumber}`,
          method: 'get'
        })
      },

    // 查询订单状态
    getPayStatus(orderNumber) {
        return request({
          url: `/orderService/payLog/getPayStatus/${orderNumber}`,
          method: 'get'
        })
      }
}