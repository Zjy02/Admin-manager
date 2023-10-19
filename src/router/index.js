import { createRouter, createWebHashHistory} from "vue-router";
import Home from '/src/components/Home.vue';
import  storage  from "../utils/storage";
import API from '../api'
import util from './../utils/utils'
const routes = [
    {
        name: 'home',
        path:'/',
        meta:{
            title:'首页'
        },
        component:Home,
        redirect:'/welcome',
        children:[
            {
                name:'welcome',
                path:'/welcome',
                meta:{
                    title:'欢迎页'
                },
                component:()=>import('/src/view/Welcome.vue'),
            }, 
            {
                name:'user',
                path:'/system/user',
                meta:{
                    title:'用户信息'
                },
                component:()=>import('/src/view/User.vue'),
            },
            {
                name:'menu',
                path:'/system/menu',
                meta:{
                    title:'菜单管理'
                },
                component:()=>import('/src/view/Menu.vue'),
            },
            {
                name:'role',
                path:'/system/role',
                meta:{
                    title:'角色管理'
                },
                component:()=>import('/src/view/Role.vue'),
            },
            {
                name:'dept',
                path:'/system/dept',
                meta:{
                    title:'部门管理'
                },
                component:()=>import('/src/view/Dept.vue'),
            },
            {
                name:'leave',
                path:'/audit/leave',
                meta:{
                    title:'休假申请'
                },
                component:()=>import('/src/view/Leave.vue'),
            },
            {
                name:'approve',
                path:'/audit/approve',
                meta:{
                    title:'待审批'
                },
                component:()=>import('/src/view/Approve.vue'),
            },
        ]
    },
    {
        name: 'login',
        path:'/login',
        meta:{
            title:'登录'
        },
        component:()=>import('/src/view/Login.vue'),
    },
    {
        name: '404',
        path:'/404',
        meta:{
            title:'页面不存在'
        },
        component:()=>import('/src/view/404.vue'),
    }

]

const router = createRouter({
  history :createWebHashHistory(),
  routes
})
//动态的添加路由
async function loadAsyncRoutes(){
    let userInfo = storage.getItem("userInfo") || {}
    if(userInfo.token) {
        try {
            const {menuList} = await API.getPermissionList()
            let routes = util.generateRoute(menuList)
            routes.map( (item)=>{
                let url =`/src/view/${item.component}.vue`
                item.component = ()=>import(url) 
                router.addRoute('home',item)
                })
        } catch (error) {
            
        }
    }
}


async function loadAsyncRoutesWrapper() {
    await loadAsyncRoutes();
  }
  loadAsyncRoutesWrapper();


//判断当前地址是否可以访问
function checkPermission(path){
    //判断访问的地址是否存在
    //router.hasRoute(to.name) 方法二
    let hasPermisssion= router.getRoutes().filter(route=> route.path == path).length
    if(hasPermisssion){
        return true
    }else{
        return false
    }
}

// 导航守卫
router.beforeEach((to,from,next)=>{
    if(checkPermission(to.path)){
        document.title = to.meta.title
        next()
    }else{ 
        next('/404')
    }
})

export default router