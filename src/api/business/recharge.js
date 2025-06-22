import request from '@/utils/request'

// 查询储值套餐列表
export function listRecharge(query) {
  return request({
    url: '/business/recharge/list',
    method: 'get',
    params: query
  })
}

// 查询储值套餐详细
export function getRecharge(rechargeId) {
  return request({
    url: '/business/recharge/' + rechargeId,
    method: 'get'
  })
}

// 新增储值套餐
export function addRecharge(data) {
  return request({
    url: '/business/recharge',
    method: 'post',
    data: data
  })
}

// 修改储值套餐
export function updateRecharge(data) {
  return request({
    url: '/business/recharge',
    method: 'put',
    data: data
  })
}

// 删除储值套餐
export function delRecharge(rechargeId) {
  return request({
    url: '/business/recharge/' + rechargeId,
    method: 'delete'
  })
}

// 导出储值套餐
export function exportRecharge(query) {
  return request({
    url: '/business/recharge/export',
    method: 'get',
    params: query
  })
}