<template>
  <span class="time-widget">
    <i class="iconfont icon-shijianicon"></i>{{ time * 1000 | formatDate('YYYY/MM/DD HH:mm')}}
  </span>
</template>

<script>
export default {
  props: {
    time: Number
  }
}
</script>

<style lang="less" scoped>
.time-widget {
  font-size: 12px;
  line-height: 12px;
  display: inline-block;
  position: relative;
  color: #999;
  .iconfont {
    font-size: 12px;
    margin-right: 10px;
  }
}
</style>
