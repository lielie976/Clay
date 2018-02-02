<template>
  <sub-form :data="data" :hasHeader="false" :onClose="onClose">
    <div class="subscribe-fail">
      <p class="subscribe-fail-icon">
        <i class="iconfont icon-dingyueshibai"></i>
        <span>支付失败</span>
        <span>{{data.errmsg}}</span>
      </p>
      <a class="subscribe-fail-redo" @click="redo">重新支付</a>
    </div>
  </sub-form>
</template>

<script>
import SubForm from './SubForm'

export default {
  components: { SubForm },
  props: {
    data: Object,
    onClose: Function
  },
  methods: {
    redo () {
      this.$store.commit('subscribe/changePayStatus', {
        status: 0
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

.subscribe-fail {
  text-align: center;
  &-icon {
    margin-top: 56px;
    line-height: 1;
    color: #d8d8d8;
    i {
      display: block;
      font-size: 64px;
      color: #d8d8d8;
      margin-bottom: 16px;
    }
  }
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
