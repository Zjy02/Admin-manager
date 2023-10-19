<template>
     <div class="shell">
            <div class="container a-container" ref="aContainer">
                <el-form ref="userRegistform" class="form" :model="regist" status-icon :rules="Registrules">
                    <h2 class="form_title title">创建账号</h2>
                    <div class="form_icons">
                        <a href="https://github.com/Zjy02/vite-project">
                            <img src="../../assets/github.svg" class="iconsvg" alt="">
                        </a>
                        <img src="../../assets/qq.svg" class="iconsvg" alt="">
                        <img src="../../assets/weixin.svg" class="iconsvg" alt="">
                    </div>
                    <span class="form_span"></span>
                    <el-form-item prop="userName">
                        <el-input type="text" v-model="regist.userName" class="form_input" placeholder="userName" />
                    </el-form-item>

                    <el-form-item prop="userEmail">
                        <el-input type="text" v-model="regist.userEmail" class="form_input" placeholder="userEmail" />
                    </el-form-item>
                    
                    <el-form-item prop="userPwd">
                        <el-input type="text" v-model="regist.userPwd" class="form_input" placeholder="Password" />
                    </el-form-item>
                    
                    <button @click="getButtons(signup)" class="form_button button submit">SIGN UP</button>
                </el-form>
            </div>

            <div class="container b-container" ref="bContainer">
                <el-form ref="userform" class="form" :model="user" status-icon :rules="rules">
                    <h2 class="form_title title">登入账号</h2>
                    <div class="form_icons">
                        <a href="https://github.com/Zjy02/vite-project">
                            <img src="../../assets/github.svg" class="iconsvg" alt="">
                        </a>
                        <img src="../../assets/qq.svg" class="iconsvg" alt="">
                        <img src="../../assets/weixin.svg" class="iconsvg" alt="">
                    </div>
                    <span class="form_span"></span>
                    <el-form-item prop="userName">
                        <el-input type="text" v-model="user.userName" class="form_input" placeholder="UserName" />
                    </el-form-item>
                    <el-form-item prop="userPwd">
                        <el-input type="password" v-model="user.userPwd" class="form_input" placeholder="Password" />
                    </el-form-item>
                        
                    <a class="form_link">忘记密码？</a>
                    <button @click="getButtons(signin)" class="form_button button submit">SIGN IN</button>
                </el-form>
            </div>

            <div class="switch" id="switch-cnt" ref="switchCtn">
                <div class="switch_circle" ref="switchCircle01"></div>
                <div class="switch_circle switch_circle-t" ref="switchCircle02"></div>
                <div class="switch_container" ref="switchC1">
                    <h2 class="switch_title title" style="letter-spacing: 0;">Welcome Back！</h2>
                    <p class="switch_description description">已经有账号了嘛，去登入账号来进入奇妙世界吧！！！</p>
                    <button @click="changeForm" class="switch_button button switch-btn">SIGN IN</button>
                </div>

                <div class="switch_container is-hidden" ref="switchC2">
                    <h2 class="switch_title title" style="letter-spacing: 0;">Hello Friend！</h2>
                    <p class="switch_description description">去注册一个账号，成为尊贵的粉丝会员，让我们踏入奇妙的旅途！</p>
                    <button @click="changeForm" class="switch_button button switch-btn">SIGN UP</button>
                </div>
            </div>
        </div>
</template>

<script setup>
import { onMounted, ref, reactive,getCurrentInstance } from 'vue';
import { useRouter} from 'vue-router'
import util from './../../utils/utils'
import storage from '../../utils/storage'
const { proxy} = getCurrentInstance()
let switchCtn = ref(null)
let switchC1 = ref(null)
let switchC2 = ref(null)
let switchCircle01 = ref(null)
let switchCircle02 = ref(null)
let aContainer = ref(null)
let bContainer = ref(null)
const userform = ref(null)
const Router = useRouter()
const rules =  ref({
        userName: [{
            required: true, message: "请输入用户名", trigger: "blur"
        }],
        userPwd: [{
            required: true, message: "请输入密码", trigger: "blur"
        }],
    })

const Registrules = ref({
    userName: [{
        required: true, message: "请输入用户名", trigger: "blur"
    }],
    userPwd: [{
        required: true, message: "请输入密码", trigger: "blur"
    }],
    userEmail:[{
        required: true, message: "请输入邮箱", trigger: "blur"
    }]
})
const user = reactive({
    userName: 'admin',
    userPwd: '123456'
})
const regist = reactive({
    userName: '',
    userPwd: '',
    userEmail:''
})



let getButtons = (e) => {
    console.log(userform)
   userform.value.validate((valid) => {
        if (valid) {
            proxy.$api.login(user).then(async (res) => {
                proxy.$store.commit('saveUserInfo', res)
                await loadAsyncRoutes()
                Router.push('/welcome')
            })
        } else {
            return false
        }
    })
}
const loadAsyncRoutes =  async function(){
    let userInfo = storage.getItem("userInfo") || {}
    if (userInfo.token) {
        try {
            const { menuList } = await this.$api.getPermissionList()
            let routes = util.generateRoute(menuList)
            routes.map(item => {
                let url = `./../view/${item.component}.vue`
                item.component = () => import(url)
                Router.addRoute("home", item)
            })
        } catch (error) {

        }
    }
}

const changeForm = (e) => {
    switchCtn.value.classList.add("is-gx");
    setTimeout(function () {
        switchCtn.value.classList.remove("is-gx");
    }, 1500)
    switchCtn.value.classList.toggle("is-txr");
    switchCircle01.value.classList.toggle("is-txr");
    switchCircle02.value.classList.toggle("is-txr");

    switchC1.value.classList.toggle("is-hidden");
    switchC2.value.classList.toggle("is-hidden");
    aContainer.value.classList.toggle("is-txl");
    bContainer.value.classList.toggle("is-txl");
    bContainer.value.classList.toggle("is-z");
}
onMounted(()=>{
})
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    /* 字体无法选中 */
    user-select: none;
}
.form_icons{
    display: flex;
    justify-content: space-around;
    gap: 10px;
}
.iconsvg{
    width: 30px;
    height: 30px;
}

body {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    background-color: #ecf0f3;
    color: #a0a5a8;
}

.shell {
    position: relative;
    width: 1000px;
    min-width: 1000px;
    min-height: 600px;
    height: 600px;
    padding: 25px;
    background-color: #ecf0f3;
    box-shadow: 10px 10px 10px #d1d9e6, -10px -10px 10px #f9f9f9;
    border-radius: 12px;
    overflow: hidden;
}

/* 设置响应式 */
@media (max-width: 1200px) {
    .shell {
        transform: scale(0.7);
    }
}

@media (max-width: 1000px) {
    .shell {
        transform: scale(0.6);
    }
}

@media (max-width: 800px) {
    .shell {
        transform: scale(0.5);
    }
}

@media (max-width: 600px) {
    .shell {
        transform: scale(0.4);
    }
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    width: 600px;
    height: 100%;
    padding: 25px;
    background-color: #ecf0f3;
    transition: 1.25s;
}

.form {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
}

.iconfont {
    margin: 0 5px;
    border: rgba(0, 0, 0, 0.5) 2px solid;
    border-radius: 50%;
    font-size: 25px;
    padding: 3px;
    opacity: 0.5;
    transition: 0.1s;
}

.iconfont:hover {
    opacity: 1;
    transition: 0.15s;
    cursor: pointer;
}

.form_input {
    width: 350px;
    height: 40px;
    margin: 4px 0;
    padding-left: 25px;
    font-size: 13px;
    /* letter-spacing: 0.15px; */
    border: none;
    outline: none;
    background-color: #ecf0f3;
    /* transition: 0.25s ease; */
    /* border-radius: 8px; */
    /* box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #f9f9f9; */
}
.form_input{
    margin-top: 16px;
}
.form_input >>> .el-input__wrapper{
    margin-left: -25px;
    letter-spacing: 0.15px;
    transition: 0.25s ease;
    border-radius: 8px;
    background-color: #ecf0f3;
    border: none;
    outline: none;
    box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #f9f9f9;
}

.form_input >>> .el-input__wrapper:hover {
    /* background-color: red; */
    box-shadow: inset 4px 4px 4px #d1d9e6, inset -4px -4px 4px #f9f9f9;
}

.form_span {
    margin-top: 30px;
    margin-bottom: 12px;
}

.form_link {
    color: #181818;
    font-size: 15px;
    margin-top: 25px;
    border-bottom: 1px solid #a0a5a8;
    line-height: 2;
}

.title {
    font-size: 34px;
    font-weight: 700;
    line-height: 3;
    color: #181818;
    letter-spacing: 10px;
}

.description {
    font-size: 14px;
    letter-spacing: 0.25px;
    text-align: center;
    line-height: 1.6;
}

.button {
    width: 180px;
    height: 50px;
    border-radius: 25px;
    margin-top: 50px;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 1.15px;
    background-color: #4B70E2;
    color: #f9f9f9;
    box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #f9f9f9;
    border: none;
    outline: none;
}

.a-container {
    z-index: 100;
    left: calc(100% - 600px);
}

.b-container {
    left: calc(100% - 600px);
    z-index: 0;
}

.switch {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 400px;
    padding: 50px;
    z-index: 200;
    transition: 1.25s;
    background-color: #ecf0f3;
    overflow: hidden;
    box-shadow: 4px 4px 10px #d1d9e6, -4px -4px 10px #d1d9e6;
}

.switch_circle {
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background-color: #ecf0f3;
    box-shadow: inset 8px 8px 12px #b8bec7, inset -8px -8px 12px #fff;
    bottom: -60%;
    left: -60%;
    transition: 1.25s;
}

.switch_circle-t {
    top: -30%;
    left: 60%;
    width: 300px;
    height: 300px;
}

.switch_container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: absolute;
    width: 400px;
    padding: 50px 55px;
    transition: 1.25s;
}

.switch_button {
    cursor: pointer;
}

.switch_button:hover,
.submit:hover {
    box-shadow: 6px 6px 10px #d1d9e6, -6px -6px 10px #f9f9f9;
    transform: scale(0.985);
    transition: 0.25s;
}

.switch_button:active,
.switch_button:focus {
    box-shadow: 2px 2px 6px #d1d9e6, -2px -2px 6px #f9f9f9;
    transform: scale(0.97);
    transition: 0.25s;
}

.is-txr {
    left: calc(100% - 400px);
    transition: 1.25s;
    transform-origin: left;
}

.is-txl {
    left: 0;
    transition: 1.25s;
    transform-origin: right;
}

.is-z {
    z-index: 200;
    transition: 1.25s;
}

.is-hidden {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    transition: 1.25s;
}

.is-gx {
    animation: is-gx 1.25s;
}

@keyframes is-gx {

    0%,
    10%,
    100% {
        width: 400px;
    }

    30%,
    50% {
        width: 500px;
    }
}
</style>