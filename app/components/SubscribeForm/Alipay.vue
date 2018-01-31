<template>
  <div class="subscribe-alipay">
    <p class="subscribe-alipay-icon">
      <i class="iconfont icon-zhifubaozhifu"></i>
    </p>
    <a class="subscribe-alipay-redo" @click="redo">重新支付</a>
    <!-- <a class="subscribe-alipay-finish" @click="finish">完成支付</a> -->
  </div>
</template>

<script>
export default {
  props: {
    data: Object
  },
  methods: {
    redo () {
      this.createOrder()
    },
    finish () {
      this.$store.commit('subscribe/changePayStatus', {
        status: 2
      })
    },
    createOrder () {
      this.$store.dispatch('subscribe/createPayOrder', {
        type: 2,
        returnUrl: location.href
      }).then((res) => {
        const url = this.data.order.pay_url
        const orderNo = this.data.order.order_no
        if (!url || !orderNo) {
          this.$store.commit('subscribe/changePayStatus', { status: 3 })
          return
        }
        window.open(url)
        this.timer = setInterval(() => {
          this.$store.dispatch('subscribe/checkOrderStatus', { order_no: orderNo })
        }, 1000)
      })
    }
  },
  mounted () {
    this.createOrder()
  },
  destroyed () {
    clearInterval(this.timer)
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
  &-icon {
    text-align: center;
    line-height: 1;
    margin: 40px 0;
    i {
      color: #4ea7f2;
      font-size: 56px;
    }
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
