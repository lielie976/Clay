<template>
  <widget-box title="相应板块">
    <a class="aside-bkj-locked">
      <img src="/img/aside-bkj-locked.png">
    </a>
  </widget-box>  
</template>

<script>
import WidgetBox from '~/components/WidgetBox'

export default {
  components: {
    WidgetBox
  }
}
</script>

<style lang="less" scoped>
.aside-bkj-locked {
  height: 64px;
}
</style>
