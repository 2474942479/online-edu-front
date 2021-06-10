import request from '@/utils/request'

export default {

  // 生成订单
  creatOrder(orderInfo) {
    return request({
      url: `/orderService/order/createOrder`,
      method: 'post',
      data: orderInfo
    })
  },

  // 获取订单信息
  getOrderInfo(orderNumber) {
    return request({
      url: `/orderService/order/getOrderInfo/${orderNumber}`,
      method: 'get'
    })
  },

  //  取消订单

  removeOrder(orderNumber) {
    return request({
      url: `/orderService/order/removeOrder/${orderNumber}`,
      method: 'delete'
    })
  },

  getOrderListByUserId(orderQueryDTO) {
    return request({
      url: `/orderService/order/getOrderList`,
      method: 'post',
      data: orderQueryDTO
    })
  }

}