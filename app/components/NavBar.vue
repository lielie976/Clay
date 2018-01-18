<template>
  <nav class="nav has-shadow">
    <div class="container">
      <div class="nav-left">
        <a href="/" class="nav-item logo">
          <h1 class="slogan">{{texts.slogan}} | {{texts.description}}</h1>
          <img src="/img/logo.png" alt="选股宝 logo">
        </a>
        <nuxt-link to="/" exact class="nav-item">
          7 x 24
        </nuxt-link>
        <nuxt-link to="/zhutiku" exact class="nav-item" target="_blank">
          主题库
        </nuxt-link>
        <nuxt-link to="/dingpan" exact class="nav-item" target="_blank">
          智能盯盘
          <img src="/img/HOT.png" class="is-hot" />
        </nuxt-link>
        <nuxt-link to="/yuanchuang" exact class="nav-item" target="_blank">
          原创
        </nuxt-link>
      </div>
      <div class="nav-right">
        <span class="go-login nav-item" data-type="login">登录</span>
        <span class="go-login nav-item" data-type="register">注册</span>
      </div>
    </div>
  </nav>
</template>

<script>
import texts from '~/utils/texts'

export default {
  computed: {
    texts: () => texts
  }
}
</script>

<style lang="less" scoped>
.nav {
  height: 56px; 
  line-height: 56px; 
  box-shadow: 0 2px 3px hsla(0,0%,4%,.1);
  background-color: #30333f;
  color: #fff;
  .container {
    width: 1300px;
    margin: 0 auto;
    overflow: hidden;
  }
  .nav-left {
    float: left;
    display: flex;
    align-items: center;
  }
  .nav-right {
    float: right;
    .nav-item {
      color: #fff;
    }
  }
  .nav-item {
    color: #d8d8d8;
    height: 56px; 
    line-height: 56px; 
    margin-right: 40px;
    &:hover {
      color: #fff;
    }
    &.is-active-route {
      border-bottom: 3px solid #e6394d;
      pointer-events: none;
      color: #fff;
    }
    .is-hot {
      width: 25px;
    }
  }
  .logo {
    margin-right: 81px;
  }
  .logo img {
    width: 108px;
    height: 26px;
  }
  .slogan {
    display: inline-block;
    text-indent: -9999px;
    width: 0;
  }
  @media screen and (max-width: 1366px) {
    .container {
      width: 1100px;
    }
  }
}
</style>
