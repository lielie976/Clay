<template>
  <div class="subscribe-wechat">
    <div id="qrcode" ref="qrcode"></div>
  </div>
</template>

<script>
export default {
  props: {
    data: Object
  },
  methods: {
    generateQrcode (url) {
      if (!this.$refs.qrcode) return
      const qrcode = new window.QRCode(this.$refs.qrcode)
      qrcode.makeCode(url)
    }
  },
  mounted () {
    // this.generateQrcode()
    this.$store.dispatch('subscribe/createPayOrder', { type: 5 }).then((res) => {
      const url = this.data.order.pay_url
      const orderNo = this.data.order.order_no
      if (!url || !orderNo) {
        this.$store.commit('subscribe/changePayStatus', { status: 3 })
        return
      }
      this.generateQrcode(url)
      this.timer = setInterval(() => {
        this.$store.dispatch('subscribe/checkOrderStatus', { order_no: orderNo })
      }, 1000)
    })
  },
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

.subscribe-wechat {
  a {
    display: block;
    height: 48px;
    line-height: 48px;
    text-align: center;
    color: #fff;
  }
  #qrcode {
    width: 166px;
    height: 166px;
    margin: 0 auto;
    padding: 16px;
    border: 1px solid #efefef;
    overflow: hidden;
  }
}
</style>
