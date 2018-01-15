<template>
  <ul class="home-news-container">
    <msg
      v-for="msg in msgs"
      :key="msg.Id"
      :msg="msg"
    />
  </ul>
</template>

<script>
import Msg from './Msg'

export default {
  components: {
    Msg
  },
  computed: {
    msgs () {
      return this.$store.state.homeMsgs.msgs
    }
  }
}
</script>

<style lang="less" scoped>
.home-news-container {
  padding-top: 30px;
  background: #fff;
}
</style>

