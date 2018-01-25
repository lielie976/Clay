<template>
  <widget-box title="相应板块">
    <a class="aside-bkj-locked" @click="handleClick">
      <img src="/img/aside-bkj-locked.png">
    </a>
  </widget-box>  
</template>

<script>
import WidgetBox from '~/components/WidgetBox'

export default {
  components: {
    WidgetBox
  },
  methods: {
    handleClick () {
      this.$store.dispatch('login/showLogin')
    }
  }
}
</script>

<style lang="less" scoped>
.aside-bkj-locked {
  height: 64px;
}
</style>
