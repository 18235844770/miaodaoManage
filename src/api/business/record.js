import request from '@/utils/request'

// 查询用户提现记录列表
export function listRecord(query) {
  return request({
    url: '/business/record/query',
    method: 'get',
    params: query
  })
}

// 查询用户提现记录详细
export function getRecord(id) {
  return request({
    url: '/business/record/' + id,
    method: 'get'
  })
}

// 新增用户提现记录
export function addRecord(data) {
  return request({
    url: '/business/record',
    method: 'post',
    data: data
  })
}

// 修改用户提现记录
export function updateRecord(data) {
  return request({
    url: '/business/record',
    method: 'put',
    data: data
  })
}

// 批量审核用户提现记录
export function batchUpdateRecord(data) {
  return request({
    url: '/business/record/batch',
    method: 'put',
    data: data
  })
}

// 删除用户提现记录
export function delRecord(id) {
  return request({
    url: '/business/record/' + id,
    method: 'delete'
  })
}

// 导出用户提现记录
export function exportRecord(query) {
  return request({
    url: '/business/record/export',
    method: 'get',
    params: query
  })
}