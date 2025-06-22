import request from '@/utils/request'

// 查询订单列表
export function listOrders(query) {
  return request({
    url: '/business/orders/list',
    method: 'get',
    params: query
  })
}

// 查询订单详细
export function getOrders(orderId) {
  return request({
    url: '/business/orders/' + orderId,
    method: 'get'
  })
}


// 导出订单
export function exportOrders(query) {
  return request({
    url: '/business/orders/export',
    method: 'get',
    params: query
  })
}