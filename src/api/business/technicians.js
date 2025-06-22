import request from '@/utils/request'

// 查询技师列表
export function listTechnicians(query) {
  return request({
    url: '/business/technicians/list',
    method: 'get',
    params: query
  })
}

// 查询技师详细
export function getTechnicians(technicianId) {
  return request({
    url: '/business/technicians/' + technicianId,
    method: 'get'
  })
}

// 新增技师
export function addTechnicians(data) {
  return request({
    url: '/business/technicians',
    method: 'post',
    data: data
  })
}

// 修改技师
export function updateTechnicians(data) {
  return request({
    url: '/business/technicians',
    method: 'put',
    data: data
  })
}

// 删除技师
export function delTechnicians(technicianId) {
  return request({
    url: '/business/technicians/' + technicianId,
    method: 'delete'
  })
}

// 导出技师
export function exportTechnicians(query) {
  return request({
    url: '/business/technicians/export',
    method: 'get',
    params: query
  })
}