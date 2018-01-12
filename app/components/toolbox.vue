<template>
  <div class="toolbox-container">
    <div class="toolbox-titlebar">
      <span class="toolbox-titlebar-label">{{title}}</span>
      <a v-if="href" :href="href" target="_blank" class="toolbox-titlebar-more">更多<i class="iconfont">&#xe634;</i></a>
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
    }
  }
}
</script>

<style lang="less" scoped>
@import '../styles/variables.less';

.toolbox-container{
  margin-bottom: 20px;
}
.toolbox-titlebar{
  height: 30px;
  padding: 0 15px 0 0;
  border-bottom:1px solid @border-color-dark;
  position: relative;
  &-label{
    font-size: 16px;
    display: inline-block;
    height: 30px;
    border-bottom:1px solid @mainColorRed;
  }
  &-more{
    font-size: 14px;
    position: absolute;
    right: 15px;
    color:#666666;
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

