import { createApp } from 'vue'
import './assets/style/index.scss'
import './assets/style/reset.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import  ElMessage  from "element-plus";
import 'element-plus/dist/index.css'
import  request  from './utils/request'
import  storage  from './utils/storage'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import api from './api'
import  store  from './store/index'




const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
//自定义指令 设置按钮是否显示
app.directive('has',{
  beforeMount:(el,binding)=>{
    let actionList = storage.getItem("actionList")
    let value = binding.value

    let hasPermission = actionList.includes(value)
    if(!hasPermission){
      el.style = "display:none"
      setTimeout(() => {
        el.parentNode.removeChild(el)
      });
    }
  }
})

app.config.globalProperties.$request = request
app.config.globalProperties.$api = api
app.config.globalProperties.$storage = storage
app.config.globalProperties.$message = ElMessage

console.log(import.meta.env)
app.use(router).use(store).use(ElementPlus).mount('#app')