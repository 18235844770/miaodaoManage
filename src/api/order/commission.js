import request from '@/utils/request'

// 查询佣金分成列表
export function listCommission(query) {
  return request({
    url: '/order/commission/query',
    method: 'get',
    params: query
  })
}

// 查询佣金分成详细
export function getCommission(id) {
  return request({
    url: '/order/commission/' + id,
    method: 'get'
  })
}

// 新增佣金分成
export function addCommission(data) {
  return request({
    url: '/order/commission',
    method: 'post',
    data: data
  })
}

// 修改佣金分成
export function updateCommission(data) {
  return request({
    url: '/order/commission',
    method: 'put',
    data: data
  })
}

// 删除佣金分成
export function delCommission(id) {
  return request({
    url: '/order/commission/' + id,
    method: 'delete'
  })
}

// 导出佣金分成
export function exportCommission(query) {
  return request({
    url: '/order/commission/export',
    method: 'get',
    params: query
  })
}