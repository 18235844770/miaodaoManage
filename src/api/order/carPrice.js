import request from '@/utils/request'

// 查询车费配置列表
export function listCarPrice(query) {
  return request({
    url: '/order/carPrice/list',
    method: 'get',
    params: query
  })
}

// 查询车费配置详细
export function getCarPrice(id) {
  return request({
    url: '/order/carPrice/' + id,
    method: 'get'
  })
}

// 修改车费配置
export function updateCarPrice(data) {
  return request({
    url: '/order/carPrice',
    method: 'put',
    data: data
  })
}
