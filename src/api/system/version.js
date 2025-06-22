import request from '@/utils/request'

// 查询系统版本列表
export function listVersion(query) {
  return request({
    url: '/system/version/list',
    method: 'get',
    params: query
  })
}

// 查询系统版本详细
export function getVersion(versionId) {
  return request({
    url: '/system/version/' + versionId,
    method: 'get'
  })
}

// 新增系统版本
export function addVersion(data) {
  return request({
    url: '/system/version',
    method: 'post',
    data: data
  })
}

// 修改系统版本
export function updateVersion(data) {
  return request({
    url: '/system/version',
    method: 'put',
    data: data
  })
}

// 删除系统版本
export function delVersion(versionId) {
  return request({
    url: '/system/version/' + versionId,
    method: 'delete'
  })
}

// 导出系统版本
export function exportVersion(query) {
  return request({
    url: '/system/version/export',
    method: 'get',
    params: query
  })
}

// 获取最新版本
export function getLatestVersion() {
  return request({
    url: '/system/version/latest',
    method: 'get'
  })
}

// 发布版本
export function publishVersion(versionId) {
  return request({
    url: '/system/version/publish/' + versionId,
    method: 'put'
  })
} 