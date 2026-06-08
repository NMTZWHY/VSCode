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
export function getResearchPlatformList(level) {
  // 拼接筛选参数：有level则携带，无则查询全部
  let url = '/researchlist/'
  if (level) {
    url += `?level=${level}`
  }
  return request({
    url: url,
    method: 'get'
  })
}