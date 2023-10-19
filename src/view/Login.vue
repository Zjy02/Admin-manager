<template>
    <div class="login-wrapper">
        <LoginComponent/>
    </div>
    
</template>

<script >
import LoginComponent from '../components/Login/LoginComponent.vue'
export default {
    name:'login',
    components:{LoginComponent },
}
</script>

<style lang="scss">
.login-wrapper{
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f9fcff;
    width: 100%;
    height: 100vh;
}
</style>