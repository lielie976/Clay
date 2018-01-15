<template>
  <div class="home-news">
    <div class="home-news-titlebar">
      <span class="home-news-titlebar-label">7X24 即时播报</span>
      <msgs-subjects />
      <msgs-settings />
    </div>
    <div class="home-news-main">
      <msgs-hot-subjects />
      <msgs />
    </div>
  </div>
</template>

<script>
import MsgsSettings from './MsgsSettings'
import MsgsSubjects from './MsgsSubjects'
import MsgsHotSubjects from './MsgsHotSubjects'
import Msgs from './Msgs'

export default {
  components: {
    MsgsSettings,
    MsgsSubjects,
    MsgsHotSubjects,
    Msgs
  }
}
</script>

<style lang="less" scoped>
@import "../../styles/variables.less";
.home-news {
  &-titlebar {
    height: 30px;
    padding: 0;
    border-bottom: 1px solid @border-color-dark;
    position: relative;
  }
  &-main {
    margin-top: 10px;
  }
  &-titlebar-label {
    font-size: 16px;
    display: inline-block;
    height: 30px;
    border-bottom: 1px solid @mainColorRed;
    margin-right: 30px;
    position: relative;
    &:after {
      content: "";
      display: block;
      position: absolute;
      right: -18px;
      top: 6px;
      height: 12px;
      width: 1px;
      background: @border-color-dark;
    }
  }
}
</style>

