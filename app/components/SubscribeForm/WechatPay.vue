<template>
  <div class="subscribe-wechat">
    <div id="qrcode" ref="qrcode"></div>
  </div>
</template>

<script>
export default {
  methods: {
    generateQrcode () {
      if (!this.$refs.qrcode) return
      const qrcode = new window.QRCode(this.$refs.qrcode)
      qrcode.makeCode('https://baidu.com')
    }
  },
  mounted () {
    this.generateQrcode()
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
