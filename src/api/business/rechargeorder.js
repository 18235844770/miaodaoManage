import request from '@/utils/request'

// 查询充值记录列表
export function listRechargeorder(query) {
  return request({
    url: '/business/rechargeorder/list',
    method: 'get',
    params: query
  })
}

// 查询充值记录详细
export function getRechargeorder(orderId) {
  return request({
    url: '/business/rechargeorder/' + orderId,
    method: 'get'
  })
}

// 新增充值记录
export function addRechargeorder(data) {
  return request({
    url: '/business/rechargeorder',
    method: 'post',
    data: data
  })
}

// 修改充值记录
export function updateRechargeorder(data) {
  return request({
    url: '/business/rechargeorder',
    method: 'put',
    data: data
  })
}

// 删除充值记录
export function delRechargeorder(orderId) {
  return request({
    url: '/business/rechargeorder/' + orderId,
    method: 'delete'
  })
}

// 导出充值记录
export function exportRechargeorder(query) {
  return request({
    url: '/business/rechargeorder/export',
    method: 'get',
    params: query
  })
}