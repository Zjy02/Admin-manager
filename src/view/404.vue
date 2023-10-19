<template>
    <div class="exception">
        <img src="../assets/404.png" alt="404页面" class="error">
        <el-button @click="goHome" type="primary" class="btn">回首页</el-button>
    </div>
</template>

<script>
    export default {
        name: '404',
        methods:{
            goHome(){
                this.$router.push('/')
            }
        }
    }
</script>

<style lang="scss" scoped>
.exception{
    position: relative;
    .error{
        width: 100%;
        height: 100vh;
        position: absolute;
        z-index: -1;
    }
    .btn{
        
        position: fixed;
        bottom: 100px;
        left: 50%;
        margin-left: -34px;
    }
}

</style>