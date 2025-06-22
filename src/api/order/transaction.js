import request from '@/utils/request'

// 查询全局交易配置列表
export function listTransaction(query) {
  return request({
    url: '/order/transaction/list',
    method: 'get',
    params: query
  })
}

// 查询全局交易配置详细
export function getTransaction(id) {
  return request({
    url: '/order/transaction/' + id,
    method: 'get'
  })
}


// 修改全局交易配置
export function updateTransaction(data) {
  return request({
    url: '/order/transaction',
    method: 'put',
    data: data
  })
}
