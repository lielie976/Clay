<template>
  <sub-form :data="data">
    <alipay v-if="data.payMethod === 'alipay'" />
    <wechat-pay v-if="data.payMethod === 'wechat'" />
  </sub-form>
</template>

<script>
import { mapGetters } from 'vuex'
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
  },
  computed: {
    ...mapGetters({
      priceNeededToPay: 'subscribe/priceNeededToPay'
    })
  },
  methods: {
    goingToPay (status, method) {
      this.$store.commit('subscribe/changePayStatus', {
        status,
        method
      })
    }
  },
  mounted () {
    // window.open('https://baidu.com')
  }
}
</script>

<style lang="less" scoped>
</style>

