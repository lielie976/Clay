<template>
  <widget-box title="相关股票">
    <a @click="handleClick">
      <img src="/img/aside-stocks-locked.png">
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
