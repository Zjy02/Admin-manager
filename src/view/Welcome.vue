<template>
<div class="welcome">
    <div class="content">
        <div class="sub-title">欢迎体验</div>
        <div class="title">后台管理系统</div>
        <div class="desc">-Vue3 + ElementPlus + Node + MongoDB 打造的通用后台管理系统</div>
    </div>
    <div class="img"></div>
</div>
</template>

<script >
export default {
    name:'welcome'   
}

</script>

<style scoped lang="scss">
.welcome{
    display: flex;
    justify-content: center;
    gap: 20px;
    align-items: center;
    height: 100%;
    background-color: #fff;
    .content {
        .title {
            font-size: 30px;
            line-height: 42px;
            color: #333;
        }
        .title {
            font-size: 40px;
            line-height: 62px;
            color: #409eff;
        }
        .desc {
            text-align: right;
            font-size: 14px;
            color: #999;
        }
    }
    .img{
        background-image: url(../assets/background.png);
        width: 638px;
        height: 438px;
    }
}
@media (max-width: 1200px) {
    .img {
        transform: scale(0.7);
    }
}

@media (max-width: 1000px) {
    .img {
        transform: scale(0.6);
    }
}

@media (max-width: 800px) {
    .img {
        transform: scale(0.5);
    }
}

@media (max-width: 600px) {
    .img {
        transform: scale(0.4);
    }
}
</style>