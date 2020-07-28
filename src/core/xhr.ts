import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers, responseType, timeout } = config
  
    // 创建 xhr 实例
    const request = new XMLHttpRequest()
  
    // 设置响应数据类型
    if (responseType) {
      request.responseType = responseType
    }

    // 设置请求超时时长
    if (timeout) {
      request.timeout = timeout
    }
  
    // 初始化请求
    request.open(method.toUpperCase(), url!, true)
  
    // 处理响应数据
    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) {
        return
      }

      // 当出现网络错误或者超时错误时，status 都为 0
      if (request.status === 0 ) {
        return
      }
  
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData = responseType && responseType !== 'text'
        ? request.response
        : request.responseText
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      handleResponse(response)
    }

    // 处理网络错误
    request.onerror = function handleError() {
      reject(createError(
        'Netword Error',
        config,
        null,
        request
      ))
    }

    // 处理请求超时
    request.ontimeout = function handleTimeout() {
      reject(createError(
        `Timeout of ${config.timeout} ms exceeded`,
        config,
        'ECONNABORTED',
        request
      ))
    }

    function handleResponse(response: AxiosResponse) {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(createError(
          `Request failed with status code ${response.status}`,
          config,
          null,
          request,
          response
        ))
      }
    }
  
    // 设置 xhr headers
    Object.keys(headers).forEach((name) => {
      // 这里要额外判断一个逻辑，当我们传入的 data 为空的时候，请求 header 配置 Content-Type 是没有意义的，于是我们把它删除
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })
  
    // 发送请求
    request.send(data)

  })
}