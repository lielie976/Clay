<template>
  <div class="xgb-tools">
    <div class="tools-box tools-appQrcode">
      <img src="/img/logo_dark.png">
      <img class="tools-appQrcode-image" src="/img/xgb-app.png" alt="App下载二维码">
      <span class="hint-text">App下载</span>
    </div>
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
import { smoothscroll } from '~/utils/helpers'

export default {
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

.tools-appQrcode-image {
  visibility: hidden;
  position: fixed;
  bottom: 120px;
  right: 80px;
  width: 100px;
  height: 100px;
}

.tools-wechatQrcode-image {
  visibility: hidden;
  position: fixed;
  bottom: 80px;
  right: 80px;
  width: 100px;
  height: 100px;
}

.tools-box:hover {
  .tools-wechatQrcode-image {
    visibility: visible;
  }
  .tools-appQrcode-image {
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

