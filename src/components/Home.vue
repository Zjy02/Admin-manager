<template>
<div class="basic-layout">
  <div class="nav-side">
    <div class="logo">
    <img src="./../assets/logo.png" alt="">
    Manager
  </div>
    <el-menu
      :default-active="activeMenu"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="#001529"
      text-color="#fff"
      router 
    >
      <tree-menu :userMenu="MenuList"/>


    </el-menu>
  </div>
    <div class="content-right">
        <div class="nav-top">
            <div class="bread">
              <el-icon @click="toggle"><Operation /></el-icon>
              <BreadCrumb />
            </div>
            <div class="rightBox">
              <el-badge :is-dot="noticeCount>0? true:false" class="item" @click="this.$router.push('/audit/approve')">
                <el-icon color="blue" class="icon"><BellFilled  /></el-icon>
              </el-badge>

              <el-dropdown @command="handleLogout">
                <span class="el-dropdown-link">
                  {{ userInfo.userName }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="email">邮箱:{{ userInfo.userEmail }}</el-dropdown-item>
                    <el-dropdown-item command="logout">退出</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div> 
        </div>
        <div class="wrapper">
            <router-view ></router-view>
        </div>
    </div>
</div>
</template>

<script >
import { ArrowDown } from '@element-plus/icons-vue'
import TreeMenu from './TreeMenu.vue'
import BreadCrumb from './BreadCrumb.vue'
export default {
  name:'home',
  components:{TreeMenu,BreadCrumb},
  data(){
    return {
      isCollapse:false,
      userInfo:this.$store.state.userInfo,
      noticeCount:0,
      MenuList:[],
      activeMenu:location.hash.slice(1)
    }
  },
  computed:{
    noticeCount(){
      return this.$store.state.noticeCount
    }
  },
  mounted(){
    this.getNoticeCount()
    this.getMenuItem()
  },
  methods:{
    toggle(){
      this.isCollapse = !this.isCollapse
    },

    handleLogout(key){
      if(key == 'email') return
      this.$store.commit('saveUserInfo','')
      this.userInfo = {};
      this.$router.push('/login')
    },

    async getNoticeCount(){
          try {
            const count = await this.$api.noticeCount()
            this.$store.commit("saveNoticCount",count)
          } catch (error) {
            console.log(error)
          }
    },
    async getMenuItem(){
          try {
            const {menuList,actionList} = await this.$api.getPermissionList()
            this.MenuList = menuList
            //将菜单列表保存到loaclstorage
            this.$store.commit('saveUserMenu',menuList)
            //将权限列表保存到loaclstorage
            this.$store.commit('saveUserAction',actionList)

          } catch (error) {
            console.log(error)
          }
    },


  }
}

</script>

<style lang="scss">

.basic-layout {
  height: 100vh;
  width: 100vw;
  position: relative;
  .nav-side {
    position: fixed;
    width: 14vw;
    height: 100vh;
    background-color: black;
    color: #fff;
    overflow: auto;
    transition: width .5s;
    .logo{
      margin-top: 5px;
      font-size: 30px;
      display: flex;
      align-items: center;
      justify-content: space-around;
    img{
      width: 40px;
      height: 40px;
      border-radius: 100px;
    }
  }
  }
  .content-right{
    margin-left: 200px;
    .nav-top {
        height: 50px;
        line-height: 50px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #ddd;
        padding: 0 20px;
        .bread{
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .rightBox{
          display: flex;
          align-items: center;
          justify-content: space-around;
          gap: 15px;
          height: 100%;
          .item {
              width: 20px;
              height: 30%;
              display: flex;
              cursor: pointer;
              .icon{
                width: 20px;
                height: 20px;
              }
            }

            .el-dropdown-link{
              height: 100%;
              display: flex;
            }
        }
      }
    .wrapper {
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
      }
  }
}
@media (max-width: 1200px) {
    .logo {
        transform: scale(0.7);
    }
}

@media (max-width: 1000px) {
    .logo {
        transform: scale(0.6);
    }
}

@media (max-width: 800px) {
    .logo {
        transform: scale(0.5);
    }
}

@media (max-width: 600px) {
    .logo {
        transform: scale(0.4);
    }
}
</style>