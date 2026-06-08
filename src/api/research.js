import request from './request'

// 科研平台入驻申请
export function submitApplication(data) {
  return request({
    url: '/applications/',
    method: 'post',
    data
  })
}
export function uploadRichImg(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: '/upload/image/',
    method: 'post',
    data: formData
  })
}