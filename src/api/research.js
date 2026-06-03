import request from './request'

// 科研平台入驻申请
export function submitApplication(data) {
  return request({
    url: '/applications/',
    method: 'post',
    data
  })
}