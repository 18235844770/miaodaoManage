import request from '@/utils/request'

// 查询服务项目列表
export function listManagement(query) {
  return request({
    url: '/business/management/list',
    method: 'get',
    params: query
  })
}

// 查询服务项目详细
export function getManagement(serviceId) {
  return request({
    url: '/business/management/' + serviceId,
    method: 'get'
  })
}

// 新增服务项目
export function addManagement(data) {
  return request({
    url: '/business/management',
    method: 'post',
    data: data
  })
}

// 修改服务项目
export function updateManagement(data) {
  return request({
    url: '/business/management',
    method: 'put',
    data: data
  })
}

// 删除服务项目
export function delManagement(serviceId) {
  return request({
    url: '/business/management/' + serviceId,
    method: 'delete'
  })
}
