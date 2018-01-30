<template>
  <sub-form :data="data" :hasHeader="false">
    <div class="subscribe-fail">
      <a class="subscribe-fail-redo" @click="redo">重新支付</a>
    </div>
  </sub-form>
</template>

<script>
import SubForm from './SubForm'

export default {
  components: { SubForm },
  props: {
    data: Object
  },
  methods: {
    redo () {
      this.$store.commit('subscribe/changePayStatus', {
        status: 1
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

.subscribe-fail {
  text-align: center;
  &-redo {
    display: block;
    color: #fff;
    width: 360px;
    height: 48px;
    line-height: 48px;
    margin: 58px 0 24px;
    text-align: center;
    background-color: #e6394d;
  }
}
</style>
