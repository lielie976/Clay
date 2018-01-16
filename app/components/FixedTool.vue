<template>
  <div class="xgb-tools">
    <div class="tools-box tools-wechatQrcode">
      <i class="iconfont icon-weixin1"></i>
      <img class="tools-wechatQrcode-image" src="/img/xgb-wechat.jpeg" alt="微信公众号二维码">
      <span class="hint-text">公众号</span>
    </div>
    <div class="tools-box">
      <a href="http://biaoge.wallstreetcn.com/f/O88l5G" target="_blank">
        <i class="iconfont icon-fankui"></i>
      </a>
      <span class="hint-text">用户反馈</span>
    </div>
    <div class="tools-box" @click="scrollToTop">
      <i class="iconfont icon-xiangshang"></i>
      <span class="hint-text">回到顶部</span>
    </div>
  </div>
</template>

<script>
// import { debounce } from 'underscore'

function smoothscroll () {
  var currentScroll = document.documentElement.scrollTop || document.body.scrollTop
  if (currentScroll > 0) {
    window.requestAnimationFrame(smoothscroll)
    window.scrollTo(0, currentScroll - (currentScroll / 15))
  }
}

export default {
  // mounted () {
  //   window.onscroll = debounce(function (e) {
  //     let top = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop
  //     if (top > 300) {
  //       document.querySelector('.xgb-tools').style.bottom = '60px'
  //       document.querySelector('.tools-wechatQrcode-image').style.bottom = '50px'
  //     } else {
  //       document.querySelector('.xgb-tools').style.bottom = '-40px'
  //       document.querySelector('.tools-wechatQrcode-image').style.bottom = '10px'
  //     }
  //   }, 300)
  // },
  methods: {
    scrollToTop () {
      smoothscroll()
    }
  }
}
</script>

<style lang="less" scoped>
.xgb-tools {
  position: fixed;
  right: 40px;
  // bottom: -40px;
  bottom: 60px;
  cursor: pointer;
  transition: .3s;
}

.tools-box {
  position: relative;
  width: 28px;
  height: 28px;
  line-height: 28px;
  margin: 0 auto 12px;
  text-align: center;
  border-radius: 2px;
  background-color: #353a47;
  opacity: .8;
  transition: .3s;
  &:hover {
    opacity: 1;
  }
  i {
    font-size: 18px;
    color: #fff;
  }
}

.tools-wechatQrcode-image {
  visibility: hidden;
  position: fixed;
  bottom: 10px;
  right: 80px;
  width: 100px;
  height: 100px;
  transition: .3s;
}

.tools-box:hover {
  .tools-wechatQrcode-image {
    visibility: visible;
  }
  .hint-text {
    visibility: visible;
  }
}

.hint-text {
  position: absolute;
  top: 0;
  right: -30px;
  width: 28px;
  height: 28px;
  font-size: 14px;
  line-height: 1.1;
  visibility: hidden;
  text-align: left;
}

@media screen and (max-width: 1360px) {
  .tools-box {
    opacity: .5;
  }
}
</style>

