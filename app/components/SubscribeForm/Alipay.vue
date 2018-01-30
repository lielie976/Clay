<template>
  <div class="subscribe-alipay">
    <a class="subscribe-alipay-redo" @click="redo">重新支付</a>
    <a class="subscribe-alipay-finish" @click="finish">完成支付</a>
  </div>
</template>

<script>
export default {
  methods: {
    redo () {
      this.$store.commit('subscribe/changePayStatus', {
        status: 3
      })
    },
    finish () {
      this.$store.commit('subscribe/changePayStatus', {
        status: 2
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

.subscribe-alipay {
  a {
    display: block;
    height: 48px;
    line-height: 48px;
    text-align: center;
    color: #fff;
  }
  &-redo {
    background-color: #e6e6e6;
    margin-bottom: 16px;
  }
  &-finish {
    background-color: @strongFontColor;
  }
}
</style>
