<template>
  <div class="home-banner" :style="`background-image: url(${banner.ImgUrl})`">
    <a :href="`${banner.RedirectUrl}`" target="_blank" class="home-banner-content"></a>
    <span class="home-banner-close">
      关闭
      <i class="iconfont icon-guanbiduihuakuang"></i>
    </span>
  </div>
</template>

<script>
export default {
  computed: {
    banner () {
      return this.$store.state.home.banner
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

.home-banner {
  position: relative;
  width: 100%;
  min-width: 1200px;
  height: 120px;
  background-color: @navBarColor;
  // background-size: cover;
  background-size: auto 120px;
  background-position: center center;
  background-repeat: no-repeat;
  &-content {
    height: 120px;
    width: 1200px;
    margin: 0 auto;
    position: relative;
    display: block;
  }
  &-close {
    position: absolute;
    top: 15px;
    right: 15px;
    color: #999999;
    font-size: 12px;
    cursor: pointer;
    .iconfont {
      color: #999999;
      font-size: 12px;
    }
  }
}
</style>
