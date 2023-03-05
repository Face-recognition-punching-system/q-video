/*
 * @Author       : Pear107
 * @Date         : 2023-02-12 13:56:12
 * @LastEditors  : Pear107
 * @LastEditTime : 2023-03-05 20:50:01
 * @FilePath     : \q-video\src\utils\axios.ts
 * @Description  : 头部注释
 */
import axios from "axios"
import { InternalAxiosRequestConfig, AxiosResponse } from "axios"

// const baseUrl = "https://yearr107.top/api"
const baseUrl = "http://localhost:8888"
// 添加请求拦截器
axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem(
      "access_token"
    )}`
    config.headers["Content-Type"] = "application/json"
    return config
  },
  (error: any) => Promise.reject(error)
)

// 添加响应拦截器
axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => Promise.reject(error)
)

const axiosGet: ({
  url,
  data,
}: {
  url: string
  data: { [key: string]: string }
}) => Promise<any> = ({ url, data }) => {
  return new Promise(
    (resolve: (value: any) => void, reject: (value: any) => void) => {
      axios
        .get(baseUrl + url, { ...data })
        .then((value: AxiosResponse) => {
          resolve(value.data)
        })
        .catch((reason: any) => {
          reject(reason)
        })
    }
  )
}

const axiosPost: ({
  url,
  data,
}: {
  url: string
  data: { [key: string]: string }
}) => Promise<any> = ({ url, data }) => {
  return new Promise(
    (resolve: (value: any) => void, reject: (value: any) => void) => {
      axios
        .post(baseUrl + url, { ...data })
        .then((value: AxiosResponse) => {
          resolve(value.data)
        })
        .catch((reason: any) => {
          reject(reason)
        })
    }
  )
}

export { axiosGet, axiosPost }
