import request from '@/utils/request'

// 查询全局佣金配置列表
export function listRate(query) {
  return request({
    url: '/business/rate/list',
    method: 'get',
    params: query
  })
}

// 查询全局佣金配置详细
export function getRate(id) {
  return request({
    url: '/business/rate/' + id,
    method: 'get'
  })
}

// 新增全局佣金配置
export function addRate(data) {
  return request({
    url: '/business/rate',
    method: 'post',
    data: data
  })
}

// 修改全局佣金配置
export function updateRate(data) {
  return request({
    url: '/business/rate',
    method: 'put',
    data: data
  })
}

// 删除全局佣金配置
export function delRate(id) {
  return request({
    url: '/business/rate/' + id,
    method: 'delete'
  })
}

// 导出全局佣金配置
export function exportRate(query) {
  return request({
    url: '/business/rate/export',
    method: 'get',
    params: query
  })
}