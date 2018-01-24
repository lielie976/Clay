<template>
  <div class="widgetBox-container">
    <div class="widgetBox-titlebar">
      <span class="widgetBox-titlebar-label">{{title}}</span>
      <a v-if="href" :href="href" target="_blank" class="widgetBox-titlebar-more">{{subTitle}}<i class="iconfont">&#xe634;</i></a>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    href: {
      type: String
    },
    title: {
      type: String
    },
    subTitle: {
      type: String,
      default: '更多'
    }
  }
}
</script>

<style lang="less" scoped>
@import '../styles/variables.less';

.widgetBox-container{
  margin-bottom: 20px;
}
.widgetBox-titlebar{
  position: relative;
  height: 30px;
  padding: 0 15px 0 0;
  margin-bottom: 8px;
  border-bottom:1px solid @border-color-dark;
  &-label{
    font-size: 16px;
    display: inline-block;
    height: 30px;
    border-bottom:1px solid @mainColorRed;
  }
  &-more{
    font-size: 14px;
    position: absolute;
    right: 0;
    color:#999;
    cursor: pointer;
    .iconfont{
      font-size: 14px;
    }
    &:hover{
      color:@mainColorRed;
    }
  }
}

</style>

