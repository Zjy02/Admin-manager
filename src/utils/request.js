// axios二次封装
import axios from "axios";
import { ElMessage } from "element-plus";
import storage from './storage'
import config from "./../config";
import router from "./../router";

const TOKEN_INVLID ="TOKEN认证失败，请重新登录！！！"
const NETWORK_ERROR = "网络请求异常，请稍后重试！"

// 创建axios实例对象，添加全局配置
const service = axios.create ({
    baseURL:config.baseApi,
    timeout:8000
})

//请求拦截
service.interceptors.request.use((req)=>{
    //to-do
    const token = storage.getItem('userInfo').token
    const headers = req.headers
    if(!headers.Authorization) headers.Authorization = "Bearer " + token
    return req
})

// 响应拦截

service.interceptors.response.use((res)=>{
    const {code , data , msg } = res.data;
    if(code === 200){
        return data
    }else if(code === 500001) {
        ElMessage.error(TOKEN_INVLID)
        setTimeout(() => {
            router.push('/login')
        }, 1500);
        return Promise.reject(TOKEN_INVLID)
    }else {
        ElMessage.error(msg || NETWORK_ERROR)
        return Promise.reject(msg || NETWORK_ERROR)
    }
})

// 请求核心函数
// @param {*} options 请求配置


function request (options) {

    options.method = options.method || 'get';
    if(options.method.toLowerCase() ==='get'){
        options.params = options.data;
    }
    let isMock = config.mock 
    if(typeof options.mock != 'undefined'){
        isMock = options.mock
    }
    if(config.env === 'prod') {
        service.defaults.baseURL = config.baseApi
    }else {
        service.defaults.baseURL = isMock? config.mockApi : config.baseApi
    }

    
    return service(options)
}

['get','post','put', 'delete','patch'].forEach((item=>{
    request[item] = (url,data,option)=>{
        return request({url,
            data,
            method:item,
            ...option
        })
    }
}))

export default request