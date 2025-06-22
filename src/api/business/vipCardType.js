import request from '@/utils/request'

// 查询VIP卡类型列表
export function listVipCardType(query) {
  return request({
    url: '/setting/vipCardType/query',
    method: 'get',
    params: query
  })
}

// 查询VIP卡类型详细
export function getVipCardType(id) {
  return request({
    url: '/setting/vipCardType/' + id,
    method: 'get'
  })
}

// 新增VIP卡类型
export function addVipCardType(data) {
  return request({
    url: '/setting/vipCardType/add',
    method: 'post',
    data: data
  })
}

// 修改VIP卡类型
export function updateVipCardType(data) {
  return request({
    url: '/setting/vipCardType/update',
    method: 'put',
    data: data
  })
}

// 删除VIP卡类型
export function delVipCardType(id) {
  return request({
    url: '/setting/vipCardType/delete/' + id,
    method: 'delete'
  })
} 