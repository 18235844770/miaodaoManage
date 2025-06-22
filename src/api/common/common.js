import request from '@/utils/request'

// 上传文件
export function uploadFile(data) {
  return request({
    url: '/common/upload',
    method: 'post',
    data: data
  })
}

// 下载文件
export function downloadFile(url) {
  return request({
    url: '/common/download',
    method: 'get',
    params: { url }
  })
}