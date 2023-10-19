// 工具函数封装
export default {
    //格式化日期
    formatDate(date,rule){
        let fmt = rule || 'yyyy-MM-dd hh:mm:ss'
        if(/(y+)/.test(fmt)){
            fmt = fmt.replace(/(y+)/.exec(fmt)[1], (date.getFullYear() + '').substring(4 - /(y+)/.exec(fmt)[1].length))
        }
        const o = {
            "M+":date.getMonth() + 1,
            "d+":date.getDate(),
            "h+":date.getHours(),
            "m+":date.getMinutes(),
            "s+":date.getSeconds(),
        }

        for(let k in o){
            const re = new RegExp(`(${k})`)
            if(re.test(fmt)){
                const val = o[k] + '';
                fmt = fmt.replace(re.exec(fmt)[1], re.exec(fmt)[1].length == 1? val : ('00'+val).substring(val.length))
            }
        }
        return fmt
    },
    //动态的添加路由
    generateRoute(menuList){
        let routes = []
        const deepList = (list) =>{
                while(list.length){
                    let item = list.pop()
                    if(item.action){
                        routes.push(
                            {
                                name: item.component,
                                path:item.path,
                                meta:{
                                    title:item.menuName
                                },
                                component: item.component
                            }
                        )
                    }
                    if(item.children && !item.action){
                        deepList(item.children)
                    }
                }
        }
        deepList(menuList)
        return routes
    }
}