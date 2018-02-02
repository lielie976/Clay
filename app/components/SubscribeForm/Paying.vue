<template>
  <sub-form :data="data" :onClose="onClose">
    <alipay :data="data" v-if="data.payMethod === 'alipay'" />
    <wechat-pay :data="data" v-if="data.payMethod === 'wechat'" />
  </sub-form>
</template>

<script>
import SubForm from './SubForm'
import Payment from './Payment'
import Alipay from './Alipay'
import WechatPay from './WechatPay'

export default {
  components: {
    SubForm,
    Payment,
    Alipay,
    WechatPay
  },
  props: {
    onClose: Function,
    data: Object
  }
}
</script>

<style lang="less" scoped>
</style>

