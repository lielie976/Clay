<template>
  <div>
    <p class="subscribe-form-final">账户余额：{{data.balance}} ，{{priceNeededToPay > 0 ? `剩余支付 ${priceNeededToPay} 元` : '优先使用账户余额支付'}}</p>
    <div :class="['subscribe-form-actions', `${priceNeededToPay <= 0 && 'only-balance'}`]">
      <a class="subscribe-form-actions-pay pay-action-alipay" @click="() => goingToPay(1, 'alipay')"><i class="iconfont icon-zhifubaozhifu"></i>支付宝支付</a>
      <a class="subscribe-form-actions-pay pay-action-wechat" @click="() => goingToPay(1, 'wechat')"><i class="iconfont icon-weixinzhifu"></i>微信支付</a>
      <a class="subscribe-form-actions-pay pay-action-balance" @click="payWithBalance">余额支付</a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    data: Object
  },
  computed: {
    ...mapGetters({
      priceNeededToPay: 'subscribe/priceNeededToPay'
    })
  },
  methods: {
    goingToPay (status, method) {
      if (this.priceNeededToPay <= 0) return
      this.$store.commit('subscribe/changePayStatus', {
        status,
        method
      })
    },
    payWithBalance () {
      this.$store.dispatch('subscribe/payWithBalance')
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../styles/variables.less';

.subscribe-form-final {
  margin: 16px 0;
  color: #e6394d;
  font-size: 14px;
}

.subscribe-form-actions {
  display: flex;
  justify-content: space-between;
  margin: 0 -4px;
  a {
    flex: 1;
    margin: 0 4px;
    height: 48px;
    line-height: 48px;
    text-align: center;
  }
  i {
    display: inline-block;
    margin-top: -2px;
    vertical-align: middle;
    font-size: 20px;
    margin-right: 6px;
  }
  &-pay {
    color: #fff;
  }
  .pay-action-alipay {
    background-color: #4ea7f2;
    flex: 1;
  }
  .pay-action-wechat {
    background-color: #1ec370;
    flex: 1;
  }
  .pay-action-balance {
    background-color: #e6e6e6;
    flex: 0 0 142px;
  }
  &.only-balance {
    .pay-action-alipay {
      background-color: #e6e6e6;
    }
    .pay-action-wechat {
      background-color: #e6e6e6;
    }
    .pay-action-balance {
      background-color: @strongFontColor;
    }
  }
}
</style>

