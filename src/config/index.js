// 环境配置封装

const env = import.meta.env.MODE || 'production'
const EnvConfig = {
    dev:{
        baseApi:'/api',
        mockApi:'https://www.fastmock.site/mock/c5ba01ffa1a7f75d745869fe6ef45d0d/api'
    },
    test:{
        baseApi:'//test.futurefe.com/api',
        mockApi:'https://www.fastmock.site/mock/c5ba01ffa1a7f75d745869fe6ef45d0d/api'
    },
    production:{
        baseApi:'http://www.zhoumou.cool:8887/api',
        mockApi:'https://www.fastmock.site/mock/c5ba01ffa1a7f75d745869fe6ef45d0d/api'
    }
}


export default{
    env,
    mock:false,
    ...EnvConfig[env],
    namespace : "manager"
}